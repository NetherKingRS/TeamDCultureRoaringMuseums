window.Arcade = (() => {
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  function record(id,value,lower=false){const old=Game.state.games[id];if(!old||(lower?value<old:value>old))Game.state.games[id]=value;Game.persist()}
  function stage(title,description,controls){UI.show(`<span class="tag">Museum Arcade</span><h2 id="panelTitle">${title}</h2><p class="small">${description}</p><div class="scorebar"><span id="gameScore">Score: 0</span><span id="gameProgress">Ready</span></div><canvas id="arcadeCanvas" class="game-canvas" width="720" height="380" aria-label="${title} play area"></canvas><div id="gameControls" class="game-controls">${controls}</div><p class="feedback" id="gameFeedback" role="status">Press Start to play.</p><button class="primary" id="startArcade">Start Game</button>`);Jazz.duck(true);return $('#arcadeCanvas').getContext('2d')}
  function label(ctx,s,x,y,size=18,color='#f8e3b5'){ctx.fillStyle=color;ctx.font=`700 ${size}px Arial`;ctx.textAlign='center';ctx.fillText(s,x,y)}
  function background(ctx){ctx.fillStyle='#16363c';ctx.fillRect(0,0,720,380);ctx.strokeStyle='#496555';ctx.lineWidth=1;for(let x=0;x<720;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,380);ctx.stroke()} }
  function rhythm(){
    const ctx=stage('Jazz Club','Hit D, F, J, or K when a note reaches the gold line. On a phone, tap the matching key below. A 24-note set, with points for timing.', ['D','F','J','K'].map((k,i)=>`<button class="secondary" data-lane="${i}" aria-label="Play ${k} lane">${k}</button>`).join(''));
    const lanes=[165,295,425,555],names=['D','F','J','K'],notes=Array.from({length:24},(_,i)=>({time:2+i*.65,lane:[0,2,1,3,0,1,2,3,2,0,3,1][i%12],status:''}));
    let active=false,done=false,elapsed=0,last=0,score=0,hits=0,combo=0,flash=[0,0,0,0],raf;
    function hit(lane){if(!active)return;flash[lane]=.18;const n=notes.find(n=>!n.status&&n.lane===lane&&Math.abs(n.time-elapsed)<.23);if(n){const delta=Math.abs(n.time-elapsed);n.status='hit';hits++;combo++;const points=delta<.095?100:60;score+=points;Jazz.hit(60+lane*4);$('#gameFeedback').textContent=`${points===100?'Perfect!':'Good!'} ${combo} note streak.`}else{combo=0;$('#gameFeedback').textContent='A little early or late—wait for the gold line.'}$('#gameScore').textContent=`Score: ${score} · Streak: ${combo}`}
    function onKey(e){const lane=['d','f','j','k'].indexOf(e.key.toLowerCase());if(lane>=0){e.preventDefault();if(!e.repeat)hit(lane)}}
    document.addEventListener('keydown',onKey);$$('[data-lane]').forEach(b=>b.onclick=()=>hit(+b.dataset.lane));
    $('#startArcade').onclick=()=>{active=true;done=false;elapsed=0;score=0;hits=0;combo=0;notes.forEach(n=>n.status='');$('#startArcade').hidden=true;$('#gameFeedback').textContent='Get ready… the first note is on its way.';$('#gameScore').textContent='Score: 0 · Streak: 0'};
    function draw(now){const dt=Math.min((now-last)/1000,.05)||0;last=now;if(active&&!document.hidden)elapsed+=dt;
      background(ctx);label(ctx,'THE JAZZ CLUB',360,31,16,'#d8b871');
      lanes.forEach((x,i)=>{ctx.fillStyle=flash[i]>0?'#607b61':'#23494b';ctx.fillRect(x-48,52,96,267);flash[i]=Math.max(0,flash[i]-dt);label(ctx,names[i],x,356,21)});
      ctx.fillStyle='#e6bc69';ctx.fillRect(100,304,520,4);
      notes.forEach(n=>{if(n.status)return;const until=n.time-elapsed;if(active&&until<-.24){n.status='miss';combo=0;$('#gameFeedback').textContent='Missed one. Keep the beat!';return}const y=306-until*122;if(y<52||y>325)return;ctx.fillStyle=['#e8bd6b','#9bba9a','#d99574','#aaa2c4'][n.lane];ctx.beginPath();ctx.roundRect(lanes[n.lane]-36,y-10,72,20,7);ctx.fill();});
      if(!active&&!done)label(ctx,'A quiet set. A little swing.',360,185,22);
      if(active){$('#gameProgress').textContent=`${notes.filter(n=>n.status).length} / 24 notes`;if(elapsed>notes[23].time+.5){active=false;done=true;record('rhythm',score);$('#gameFeedback').textContent=`Set complete! ${hits} / 24 notes hit · ${score} points. Best: ${Game.state.games.rhythm||0}.`;$('#startArcade').hidden=false;$('#startArcade').textContent='Play Again';Game.toast('Jazz Club set complete!')}}
      if(done)label(ctx,`${score} POINTS`,360,195,34);
      raf=requestAnimationFrame(draw);
    }
    raf=requestAnimationFrame(draw);UI.setCleanup(()=>{cancelAnimationFrame(raf);document.removeEventListener('keydown',onKey)})
  }
  function baseball(){
    const ctx=stage('Babe’s Ballpark','Press Space or tap Swing when the ball reaches the gold hitting zone. Ten pitches. A centered hit scores a home run.', '<button class="primary" id="swingButton">Swing · Space</button>');
    let active=false,elapsed=0,last=0,pitch=0,score=0,runs=0,swung=false,feedback='',swingAge=5,raf;
    const durations=[1.6,1.45,1.8,1.5,1.7,1.4,1.6,1.5,1.8,1.45];
    function position(){return 120+Math.min(1.1,elapsed/durations[Math.min(pitch,9)])*470}
    function swing(){if(!active||swung)return;swung=true;swingAge=0;const distance=Math.abs(position()-575);let points=distance<18?100:distance<42?50:0;score+=points;if(points===100)runs++;feedback=points===100?'HOME RUN! +100':points===50?'BASE HIT! +50':'STRIKE! Watch the gold zone.';$('#gameFeedback').textContent=feedback;$('#gameScore').textContent=`Score: ${score} · Home runs: ${runs}`;if(points)Jazz.hit(points===100?81:72)}
    function key(e){if(e.code==='Space'){e.preventDefault();if(!e.repeat)swing()}}document.addEventListener('keydown',key);$('#swingButton').onclick=swing;
    $('#startArcade').onclick=()=>{active=true;elapsed=0;pitch=0;score=0;runs=0;swung=false;feedback='';$('#startArcade').hidden=true;$('#gameFeedback').textContent='Wait for the ball to reach the gold zone.';$('#gameScore').textContent='Score: 0 · Home runs: 0'};
    function draw(now){const dt=Math.min((now-last)/1000,.05)||0;last=now;if(!document.hidden){if(active)elapsed+=dt;swingAge+=dt}
      ctx.fillStyle='#254c49';ctx.fillRect(0,0,720,380);ctx.fillStyle='#476d58';ctx.fillRect(0,100,720,280);
      for(let x=0;x<720;x+=72){ctx.fillStyle=x%144?'#e5ceb0':'#c2b298';ctx.fillRect(x,66,68,34)}
      label(ctx,'BABE’S BALLPARK',360,38,21);ctx.fillStyle='#b5956f';ctx.beginPath();ctx.moveTo(80,240);ctx.lineTo(570,140);ctx.lineTo(680,245);ctx.lineTo(570,340);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#e9dec5';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(90,240);ctx.lineTo(590,240);ctx.stroke();
      ctx.fillStyle='#f3d18644';ctx.fillRect(553,173,44,132);ctx.strokeStyle='#efc46a';ctx.strokeRect(553,173,44,132);label(ctx,'HIT ZONE',575,159,12,'#fff0c2');
      // Pitcher and batter, drawn as small period-uniform sprites.
      ctx.fillStyle='#e9d9b8';ctx.fillRect(85,206,24,34);ctx.fillStyle='#d2a57b';ctx.fillRect(89,193,16,16);ctx.fillStyle='#28464b';ctx.fillRect(85,190,24,7);ctx.fillRect(86,239,9,19);ctx.fillRect(101,239,9,19);
      ctx.fillStyle='#efe3c9';ctx.fillRect(611,216,26,39);ctx.fillStyle='#d2a57b';ctx.fillRect(614,200,20,19);ctx.fillStyle='#38434b';ctx.fillRect(609,196,29,9);ctx.fillRect(611,254,10,23);ctx.fillRect(629,254,10,23);
      ctx.strokeStyle='#dcb982';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(615,227);ctx.lineTo(swingAge<.25?568:647,swingAge<.25?230:188);ctx.stroke();
      if(active){const x=position(),fly=swung&&feedback.startsWith('HOME')?Math.max(0,swingAge)*250:0;ctx.fillStyle='#fff5db';ctx.beginPath();ctx.arc(swung&&feedback.startsWith('HOME')?575-fly:x,230-fly*.5,7,0,Math.PI*2);ctx.fill();$('#gameProgress').textContent=`Pitch ${pitch+1} / 10`;
        if(elapsed>durations[pitch]+.75){if(!swung)$('#gameFeedback').textContent='No swing that time. Watch the next pitch.';pitch++;elapsed=0;swung=false;if(pitch===10){active=false;record('baseball',score);$('#gameFeedback').textContent=`Game complete! ${runs} home runs · ${score} points. Best: ${Game.state.games.baseball||0}.`;$('#startArcade').hidden=false;$('#startArcade').textContent='Play Again';Game.toast('Ballpark game complete!')}}
      }else label(ctx,pitch===10?`${score} POINTS`:'TIME YOUR SWING',360,330,26,'#f7e0a4');
      raf=requestAnimationFrame(draw);
    }
    raf=requestAnimationFrame(draw);UI.setCleanup(()=>{cancelAnimationFrame(raf);document.removeEventListener('keydown',key)})
  }
  function memory(){const pairs=[['Radio','Shared national broadcasts','radio'],['Nineteenth Amendment','Voting rights regardless of sex','ballot'],['Louis Armstrong','Jazz musician','trumpet'],['Babe Ruth','Baseball star','ball'],['The Great Gatsby','Fitzgerald’s 1925 novel','book'],['Automobile','Travel to more recreation','car']];
    const deck=pairs.flatMap((p,id)=>[{id,text:p[0],icon:p[2]},{id,text:p[1]}]);for(let i=deck.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}
    UI.show(`<h2 id="panelTitle">Museum Match</h2><p class="small">Flip two cards. Match each object or person with its meaning. Clear the board in as few turns as possible.</p><div class="scorebar"><span id="memoryTurns">Turns: 0</span><span id="memoryPairs">Pairs: 0 / 6</span></div><div class="memory-board">${deck.map((c,i)=>`<button class="memory-card" data-card="${i}" aria-label="Card ${i+1}, face down"><span class="question-mark">?</span></button>`).join('')}</div><p id="memoryFeedback" class="feedback" role="status">Find all six pairs.</p><button id="restartMemory" class="secondary">New Game</button>`);
    let opened=[],matched=0,turns=0,locked=false,timer;
    function flip(button,up){const c=deck[button.dataset.card];button.classList.toggle('flipped',up);button.innerHTML=up?`${c.icon?`<svg viewBox="0 0 32 32" aria-hidden="true">${ICONS[c.icon]}</svg>`:''}<span>${c.text}</span>`:'<span class="question-mark">?</span>';button.setAttribute('aria-label',up?c.text:`Card ${+button.dataset.card+1}, face down`)}
    $$('[data-card]').forEach(b=>b.onclick=()=>{if(locked||b.disabled||opened.includes(b))return;flip(b,true);opened.push(b);if(opened.length!==2)return;turns++;$('#memoryTurns').textContent=`Turns: ${turns}`;if(deck[opened[0].dataset.card].id===deck[opened[1].dataset.card].id){opened.forEach(c=>{c.disabled=true;c.classList.add('matched')});opened=[];matched++;$('#memoryPairs').textContent=`Pairs: ${matched} / 6`;$('#memoryFeedback').textContent='A match!';Jazz.hit(76);if(matched===6){record('memory',turns,true);$('#memoryFeedback').textContent=`Board cleared in ${turns} turns! Best: ${Game.state.games.memory}.`;Game.toast('Museum Match complete!')}}else{locked=true;$('#memoryFeedback').textContent='No match. Remember those cards.';timer=setTimeout(()=>{opened.forEach(c=>flip(c,false));opened=[];locked=false},1000)}});
    $('#restartMemory').onclick=memory;UI.setCleanup(()=>clearTimeout(timer));
  }
  function timeline(){const events=['Armistice ends the fighting in WWI','Nineteenth Amendment ratified','The Great Gatsby published','The Sun Also Rises published','The Jazz Singer released'];
    UI.show(`<h2 id="panelTitle">Rewind The Decade</h2><p class="small">Drag the cards from earliest to latest. Keyboard: Space picks up a card, arrows move it, Space drops it, Escape cancels the move.</p><ol class="drag-list" id="timelineList">${[3,0,4,1,2].map(id=>`<li class="drag-card" tabindex="0" draggable="true" data-event="${id}"><span aria-hidden="true">⠿</span>${events[id]}</li>`).join('')}</ol><p id="timelineFeedback" role="status" class="feedback"></p><div class="button-row"><button class="primary" id="checkTimeline">Check Timeline</button><button class="secondary" id="timelineHint">Hint</button></div>`);
    const list=$('#timelineList');let dragged=null,picked=null,before=null;
    function place(card,target,after){if(target&&target!==card)list.insertBefore(card,after?target.nextSibling:target)}
    function clean(){list.querySelectorAll('.dragging,.over').forEach(c=>c.classList.remove('dragging','over'));dragged=null}
    function finish(card){card.focus();clean();$('#timelineFeedback').textContent=`Position ${[...list.children].indexOf(card)+1} of 5.`}
    [...list.children].forEach(card=>{
      card.ondragstart=e=>{dragged=card;card.classList.add('dragging');e.dataTransfer.setData('text/plain',card.dataset.event);e.dataTransfer.effectAllowed='move'};
      card.ondragover=e=>{if(dragged){e.preventDefault();e.dataTransfer.dropEffect='move';list.querySelectorAll('.over').forEach(c=>c.classList.remove('over'));card.classList.add('over')}};
      card.ondrop=e=>{e.preventDefault();if(!dragged)return;const moving=dragged,r=card.getBoundingClientRect();place(moving,card,e.clientY>r.top+r.height/2);finish(moving)};
      card.ondragend=clean;
      card.onpointerdown=e=>{if(e.pointerType==='mouse')return;dragged=card;card.classList.add('dragging');card.setPointerCapture(e.pointerId)};
      card.onpointermove=e=>{if(e.pointerType==='mouse'||dragged!==card)return;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.drag-card');if(target&&list.contains(target)){const r=target.getBoundingClientRect();place(card,target,e.clientY>r.top+r.height/2);card.setPointerCapture(e.pointerId)}};
      card.onpointerup=e=>{if(e.pointerType!=='mouse'&&dragged===card)finish(card)};card.onpointercancel=e=>{if(e.pointerType!=='mouse')clean()};
      card.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();if(picked===card){picked=null;finish(card)}else{picked=card;before=[...list.children];card.classList.add('dragging')}}else if(picked===card&&['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();place(card,e.key==='ArrowUp'?card.previousElementSibling:card.nextElementSibling,e.key==='ArrowDown');card.focus()}};
    });
    const cancel=e=>{if(picked){e.preventDefault();before.forEach(c=>list.appendChild(c));finish(picked);picked=null;$('#timelineFeedback').textContent='Move canceled.'}};$('#panel').addEventListener('cancel',cancel);
    $('#checkTimeline').onclick=()=>{const correct=[...list.children].filter((c,i)=>+c.dataset.event===i).length;$('#timelineFeedback').textContent=correct===5?'Correct! 1918 → 1920 → 1925 → 1926 → 1927.':`${correct} / 5 in the right place. Keep rearranging!`;if(correct===5){record('timeline',1);Jazz.hit(79);Game.toast('Timeline complete!')}};
    $('#timelineHint').onclick=()=>$('#timelineFeedback').textContent='The war’s fighting ended first. Gatsby came before Hemingway’s novel, and both came before The Jazz Singer.';
    UI.setCleanup(()=>$('#panel').removeEventListener('cancel',cancel));
  }
  return {rhythm,baseball,memory,timeline};
})();
