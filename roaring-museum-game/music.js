/* Original procedurally performed jazz-inspired background score. No sampled recordings. */
window.Jazz = (() => {
  let context, master, timer, enabled=false, volume=.2, ducked=false, step=0, next=0;
  let recording,requestId=0;
  const recordingURL = window.MUSEUM_CONFIG?.backgroundMusic?.trim();
  const midi = n => 440 * Math.pow(2,(n-69)/12);
  const chords = [[48,52,55,59],[45,48,52,55],[50,53,57,60],[43,47,50,53]];
  const melody = [72,null,76,74,71,null,67,null,69,null,72,76,74,72,null,67,69,null,74,72,69,null,65,69,67,null,71,74,72,null,71,null];
  function init() {
    if(context)return;
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)return;
    context=new Audio();master=context.createGain();master.gain.value=0;master.connect(context.destination);
  }
  function note(n,at,length,level=.1,type='piano') {
    if(!context)return;
    const gain=context.createGain();const filter=context.createBiquadFilter();
    filter.type='lowpass';filter.frequency.value=type==='bass'?600:2600;
    gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(level,at+.015);
    gain.gain.exponentialRampToValueAtTime(.0001,at+length);
    filter.connect(gain);gain.connect(master);
    const osc=context.createOscillator();osc.type=type==='bass'?'triangle':'sine';osc.frequency.value=midi(n);osc.connect(filter);osc.start(at);osc.stop(at+length+.02);
    if(type==='piano'){const overtone=context.createOscillator();const mix=context.createGain();overtone.type='sine';overtone.frequency.value=midi(n)*2;mix.gain.value=.18;overtone.connect(mix);mix.connect(filter);overtone.start(at);overtone.stop(at+length*.65)}
  }
  function brush(at) {
    const buffer=context.createBuffer(1,context.sampleRate*.09,context.sampleRate);
    const d=buffer.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);
    const source=context.createBufferSource();source.buffer=buffer;
    const filter=context.createBiquadFilter();filter.type='highpass';filter.frequency.value=4300;
    const gain=context.createGain();gain.gain.value=.018;source.connect(filter);filter.connect(gain);gain.connect(master);source.start(at);
  }
  function scheduler(){
    if(!enabled||context.state!=='running')return;
    while(next<context.currentTime+.2){
      const beat=60/76, chord=chords[Math.floor(step/8)%4];
      if(step%8===0||step%8===5)chord.forEach((n,i)=>note(n+12,next+i*.012,1.6,.045));
      if(step%2===0)note(chord[(step%8===4)?2:0]-12,next,.6,.12,'bass');
      if(step%2===1)brush(next);
      const m=melody[step%melody.length];if(m!==null)note(m,next,.65,.052);
      next+=beat*(step%2===0?.61:.39);step++;
    }
  }
  function gain(){const level=enabled?(ducked?volume*.12:volume):0;if(recording)recording.volume=level;if(master)master.gain.setTargetAtTime(level,context.currentTime,.12)}
  async function start(){
    if(enabled)return true;
    const request=++requestId;enabled=true;
    try{
      if(recordingURL){
        if(!recording){recording=new Audio(recordingURL);recording.loop=true;recording.preload='none'}
        gain();await recording.play();
      }else{
        init();if(!context){enabled=false;return false}
        await context.resume();
        if(request===requestId&&enabled){next=context.currentTime+.06;if(!timer)timer=setInterval(scheduler,80)}
      }
      if(request!==requestId||!enabled)return false;
      gain();return true;
    }catch{
      if(request!==requestId)return false;
      stop();window.Game?.toast('Music could not play. Check the file path or try Play Music again.');return false;
    }
  }
  function stop(){
    requestId++;enabled=false;recording?.pause();
    if(recording)recording.volume=0;
    clearInterval(timer);timer=null;
    if(master){master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(0,context.currentTime);context.suspend().catch(()=>{})}
  }
  function hit(n=76){if(enabled&&context?.state==='running')note(n,context.currentTime+.005,.3,.1)}
  document.addEventListener('visibilitychange',()=>{if(recording){if(document.hidden)recording.pause();else if(enabled)recording.play().catch(()=>{stop();window.Game?.musicUI()});return}if(!context)return;if(document.hidden)context.suspend();else if(enabled)context.resume().then(()=>{next=context.currentTime+.05})});
  return {start,stop,hit,isOn:()=>enabled,setVolume:v=>{volume=Math.max(0,Math.min(.6,v));gain()},getVolume:()=>volume,duck:value=>{ducked=value;gain()}};
})();
