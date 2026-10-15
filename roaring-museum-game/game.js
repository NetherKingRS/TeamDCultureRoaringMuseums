/* Canvas museum world. All coordinates are in world pixels. */
window.Game = (() => {
  const canvas=document.querySelector('#world'),ctx=canvas.getContext('2d');
  const mini=document.querySelector('#minimap'),mctx=mini.getContext('2d');
  const W=1920,H=2300,keys=new Set(),touch=new Set();
  let vw=innerWidth,vh=innerHeight,zoom=1,dpr=1,last=0,started=false,near=null,frame=0;
  let camera={x:0,y:0},player={x:960,y:1570,dir:'up',moving:false,walk:0};
  let data;
  try{data=JSON.parse(localStorage.getItem('team-d-adventure-v1'))}catch{}
  const state={seen:[],stamps:[],games:{},exitScore:null,...(data&&typeof data==='object'?data:{})};
  state.seen=Array.isArray(state.seen)?state.seen.filter(id=>ROOMS.some(r=>r.exhibits.some(e=>e.id===id))):[];
  state.stamps=Array.isArray(state.stamps)?state.stamps.filter(id=>ROOMS.some(r=>r.id===id)):[];
  if(!state.games||typeof state.games!=='object')state.games={};
  const palette=['#467764','#916751','#61758c','#77815a','#886876','#a78150'];
  const rooms=ROOMS.map((r,i)=>({...r,x:i%2===0?70:1170,y:100+Math.floor(i/2)*510,w:680,h:420,color:palette[i],side:i%2===0?'left':'right'}));
  const walkable=[{x:838,y:98,w:244,h:1522},{x:888,y:1590,w:144,h:150},{x:88,y:1718,w:1744,h:484}];
  const objects=[],obstacles=[];
  rooms.forEach(r=>{
    walkable.push({x:r.x+18,y:r.y+18,w:r.w-36,h:r.h-36});
    walkable.push({x:r.side==='left'?730:1060,y:r.y+160,w:160,h:100});
    r.exhibits.forEach((e,i)=>{const o={id:e.id,type:'exhibit',room:r.id,x:r.x+140+i*200,y:r.y+155,title:e.title,icon:e.icon};objects.push(o);obstacles.push({x:o.x-31,y:o.y-21,w:62,h:42})});
    objects.push({id:r.id,type:'challenge',room:r.id,x:r.x+340,y:r.y+330,title:r.name+' Challenge',icon:'ballot'});
    obstacles.push({x:r.x+309,y:r.y+306,w:62,h:44});
    obstacles.push({x:r.x+75,y:r.y+310,w:112,h:35},{x:r.x+493,y:r.y+310,w:112,h:35});
  });
  objects.push(
    {id:'guide',type:'guide',x:960,y:1495,title:'Meet The Curator'},
    {id:'reference',type:'reference',x:870,y:1584,title:'Teacher Reference',icon:'book'},
    {id:'video',type:'video',x:1050,y:1584,title:'Replay Intro Video',icon:'film'},
    {id:'exit',type:'exit',x:960,y:2140,title:'Exit Ticket · 5 Questions',icon:'news'},
    {id:'rhythm',type:'arcade',x:315,y:1815,title:'Jazz Club · Rhythm Game',icon:'music',color:'#af7654'},
    {id:'baseball',type:'arcade',x:745,y:1815,title:'Babe’s Ballpark',icon:'ball',color:'#627e72'},
    {id:'memory',type:'arcade',x:1175,y:1815,title:'Museum Match',icon:'art',color:'#797491'},
    {id:'timeline',type:'arcade',x:1605,y:1815,title:'Rewind The Decade',icon:'clock',color:'#967b48'}
  );
  objects.filter(o=>o.type==='arcade').forEach(o=>obstacles.push({x:o.x-55,y:o.y-25,w:110,h:50}));
  obstacles.push({x:915,y:530,w:90,h:90},{x:917,y:1048,w:86,h:84});
  const icons={};Object.entries(ICONS).forEach(([name,path])=>{const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#f6da99" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`);icons[name]=im});
  function persist(){try{localStorage.setItem('team-d-adventure-v1',JSON.stringify(state))}catch{}updateHUD()}
  function reset(){state.seen=[];state.stamps=[];state.games={};state.exitScore=null;player.x=960;player.y=1570;persist()}
  function toast(message){const node=document.querySelector('#toast');node.textContent=message;node.style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.style.display='none',3300)}
  function updateHUD(){
    document.querySelector('#questFill').style.width=(state.seen.length/18*100)+'%';
    document.querySelector('#questCount').textContent=`${state.seen.length} / 18 exhibits · ${state.stamps.length} / 6 stamps`;
    const complete=state.stamps.length===6;
    document.querySelector('#questTitle').textContent=complete?'All gallery stamps collected!':'Discover the museum';
    document.querySelector('#questDetail').textContent=complete?'Visit the arcade and finish your exit ticket.':'Read exhibits, then try each room challenge.';
  }
  function rect(x,y,w,h,color,r=0){ctx.fillStyle=color;if(r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}else ctx.fillRect(x,y,w,h)}
  function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
  function text(value,x,y,size=16,color='#f3e5c4',align='center',font='Georgia'){ctx.font=`700 ${size}px ${font}`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(value,x,y)}
  function plant(x,y){ellipse(x+5,y+12,23,11,'#09252c40');rect(x-10,y-3,20,25,'#ac8060',3);ellipse(x,y-2,24,15,'#234d42');ellipse(x-12,y-13,12,22,'#427059');ellipse(x+12,y-13,12,22,'#527e62');ellipse(x,y-20,10,23,'#6e9270')}
  function lamp(x,y){ellipse(x,y,65,65,'#f3d58c09');ellipse(x,y,40,40,'#f3d58c0b');rect(x-2,y-6,4,18,'#564d37');ellipse(x,y-10,12,6,'#d6b269');ellipse(x,y-10,7,3,'#f5da93')}
  function floor(x,y,w,h,color,tile=54){rect(x,y,w,h,color);ctx.strokeStyle='#163b3320';ctx.lineWidth=1;for(let xx=x;xx<x+w;xx+=tile){ctx.beginPath();ctx.moveTo(xx,y);ctx.lineTo(xx,y+h);ctx.stroke()}for(let yy=y;yy<y+h;yy+=tile){ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);ctx.stroke()}}
  function wall(x,y,w,h){rect(x+7,y+10,w,h,'#061c2735');rect(x,y,w,h,'#24423e');rect(x,y,w,5,'#6b7d5c');rect(x,y+h-4,w,4,'#132f31')}
  function roomDraw(r){
    rect(r.x+8,r.y+10,r.w,r.h,'#051b2550',5);
    floor(r.x,r.y,r.w,r.h,'#bdb193');
    rect(r.x+40,r.y+84,r.w-80,r.h-126,r.color,4);
    ctx.strokeStyle='#e5ca8960';ctx.lineWidth=2;ctx.strokeRect(r.x+50,r.y+94,r.w-100,r.h-146);
    for(let yy=r.y+107;yy<r.y+r.h-70;yy+=28)for(let xx=r.x+65;xx<r.x+r.w-65;xx+=28){rect(xx,yy,2,2,'#f4dc9c28')}
    wall(r.x,r.y,r.w,18);wall(r.x,r.y+r.h-18,r.w,18);
    const doorY=r.y+160;
    if(r.side==='left'){wall(r.x,r.y,18,r.h);wall(r.x+r.w-18,r.y,18,160);wall(r.x+r.w-18,doorY+100,18,r.h-260)}
    else{wall(r.x+r.w-18,r.y,18,r.h);wall(r.x,r.y,18,160);wall(r.x,doorY+100,18,r.h-260)}
    rect(r.x+173,r.y+24,334,43,'#28433c',3);text(r.name,r.x+r.w/2,r.y+52,22);text(r.subtitle,r.x+r.w/2,r.y+77,9,'#455c4c','center','Arial');
    const doorX=r.side==='left'?r.x+r.w-12:r.x+12;
    lamp(doorX,doorY-18);lamp(doorX,doorY+118);
    plant(r.x+45,r.y+55);plant(r.x+r.w-45,r.y+55);
    for(const x of [r.x+75,r.x+493]){rect(x+4,r.y+315,112,35,'#172d3035',4);rect(x,r.y+309,112,34,'#b79867',5);rect(x+4,r.y+302,104,14,'#d2b783',4);for(let xx=x+25;xx<x+100;xx+=28)rect(xx,r.y+311,2,24,'#8c7755')}
    text('READ 3 EXHIBITS · EARN A STAMP',r.x+r.w/2,r.y+r.h-32,9,'#e6d9ac','center','Arial');
    r.exhibits.forEach((e,i)=>{const x=r.x+120+i*210;rect(x,r.y+19,48,7,'#cea667',2)})
  }
  function drawHall(){
    floor(820,80,280,1540,'#c8bda1',40);
    rect(885,95,150,1480,'#716a55');rect(893,100,134,1470,'#365f55');
    ctx.strokeStyle='#c6b67a';ctx.lineWidth=2;ctx.strokeRect(904,111,112,1443);
    for(let y=150;y<1500;y+=60){ctx.strokeStyle='#c4b87833';ctx.beginPath();ctx.moveTo(960,y-14);ctx.lineTo(977,y);ctx.lineTo(960,y+14);ctx.lineTo(943,y);ctx.closePath();ctx.stroke()}
    rect(820,80,280,14,'#26443f');
    for(let row=0;row<3;row++){
      const y=100+row*510;
      floor(730,y+160,108,100,'#b5ad90',30);floor(1082,y+160,108,100,'#b5ad90',30);
      rect(740,y+173,105,74,'#3d6255');rect(1075,y+173,105,74,'#3d6255');
      text('← '+String(row*2+1).padStart(2,'0'),869,y+218,13,'#dccc99');text(String(row*2+2).padStart(2,'0')+' →',1051,y+218,13,'#dccc99');
      plant(852,y+70);plant(1068,y+70);
    }
    for(const y of [575,1090]){ellipse(964,y+15,52,43,'#102d3430');ellipse(960,y,50,44,'#84795c');ellipse(960,y-4,43,37,'#d5c799');ellipse(960,y-6,36,30,'#537f79');ellipse(960,y-9,27,22,'#81a79b');ellipse(960+Math.sin(frame/45)*4,y-9,18,13,'#b8d4b080');rect(954,y-34,12,30,'#b6b791',3);ellipse(960,y-34,17,8,'#e0d0a1')}
    floor(870,1600,180,118,'#b4aa8a',40);rect(888,1600,144,120,'#487167');
    rect(879,1440,162,35,'#233e3b',4);text('GRAND HALL',960,1463,14);text('↑ GALLERIES',960,1418,11,'#e4d19d','center','Arial');
    text('ARCADE ↓',960,1665,14,'#f0d395');
  }
  function arcadeDraw(){
    floor(70,1700,1780,520,'#b5aa8a',48);
    rect(98,1730,1724,455,'#384f50',5);
    for(let y=1730;y<2180;y+=48)for(let x=98;x<1820;x+=48)if((Math.floor(x/48)+Math.floor(y/48))%2)rect(x,y,46,46,'#40585a');
    wall(70,1700,818,18);wall(1032,1700,818,18);wall(70,1700,18,520);wall(1832,1700,18,520);wall(70,2202,1780,18);
    rect(730,1742,460,36,'#172f34',4);text('THE ARCADE',960,1767,22,'#f1c771');
    for(const x of [130,1790]){plant(x,1745);plant(x,2160)}
    text('RHYTHM · TIMING · MEMORY · HISTORY',960,2060,15,'#a5c0ae','center','Arial');
    rect(220,1965,260,35,'#a4815b',5);rect(1440,1965,260,35,'#a4815b',5);
  }
  function drawObject(o){
    const isNear=near===o,seen=o.type==='exhibit'?state.seen.includes(o.id):o.type==='challenge'?state.stamps.includes(o.id):false;
    if(o.type==='guide'){avatar(o.x,o.y,'down',false,true);text('CURATOR',o.x,o.y-47,9,'#f4d38b','center','Arial');return}
    if(o.type==='arcade'){
      ellipse(o.x+6,o.y+21,62,17,'#10282c66');rect(o.x-49,o.y-64,98,94,o.color,5);rect(o.x-44,o.y-58,88,17,'#ead39b',3);
      rect(o.x-39,o.y-36,78,45,'#19393c',4);if(icons[o.icon]?.complete)ctx.drawImage(icons[o.icon],o.x-15,o.y-29,30,30);
      rect(o.x-47,o.y+6,94,16,'#2b4745',2);ellipse(o.x-21,o.y+11,5,5,'#e2b968');ellipse(o.x+16,o.y+11,4,4,'#d37e66');ellipse(o.x+28,o.y+11,4,4,'#83aa8b');
      const label=o.id==='rhythm'?'JAZZ CLUB':o.id==='baseball'?'BABE’S BALLPARK':o.id==='memory'?'MUSEUM MATCH':'REWIND THE DECADE';
      text(label,o.x,o.y-45,8,'#254440','center','Arial');text('E · PLAY',o.x,o.y+53,10,isNear?'#f4d28b':'#aac2ae','center','Arial');
    }else{
      if(isNear){ellipse(o.x,o.y+4,51,38,'#f8d38914');ctx.strokeStyle='#f1cd77';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(o.x,o.y+4,44,30,0,0,Math.PI*2);ctx.stroke()}
      ellipse(o.x+4,o.y+17,37,15,'#0e292c40');rect(o.x-30,o.y-9,60,34,'#a7956d',4);rect(o.x-34,o.y-17,68,21,'#e0c99a',4);
      rect(o.x-25,o.y-39,50,29,o.type==='challenge'?'#7e5b3c':'#294e49',3);
      if(icons[o.icon]?.complete)ctx.drawImage(icons[o.icon],o.x-18,o.y-50,36,36);
      if(seen){ellipse(o.x+26,o.y-40,9,9,'#d3b269');text('✓',o.x+26,o.y-37,11,'#214438','center','Arial')}
      const label=o.type==='challenge'?'ROOM CHALLENGE':o.type==='reference'?'REFERENCES':o.type==='video'?'VIDEO':o.type==='exit'?'EXIT TICKET':String(rooms.find(r=>r.id===o.room).exhibits.findIndex(e=>e.id===o.id)+1).padStart(2,'0');
      text(label,o.x,o.y+45,o.type==='exhibit'?12:8,'#f1deb0','center','Arial');
    }
    if(isNear){const bob=Math.sin(frame/13)*3;text('▼',o.x,o.y-(o.type==='arcade'?77:66)+bob,15,'#ffe3a1','center','Arial')}
  }
  function avatar(x,y,dir,moving,npc=false){
    const gait=moving?Math.sin(player.walk)*4:0;
    ellipse(x+2,y+6,16,7,'#09282e50');
    rect(x-10,y-6,8,15+gait,'#223c3e',2);rect(x+2,y-6,8,15-gait,'#223c3e',2);
    rect(x-11,y+6+gait,10,5,'#132b33',2);rect(x+2,y+6-gait,10,5,'#132b33',2);
    rect(x-13,y-27,26,24,npc?'#a07b51':'#397e72',5);
    rect(x-17,y-24+gait,6,17,'#d5a57c',3);rect(x+11,y-24-gait,6,17,'#d5a57c',3);
    if(dir==='down'){rect(x-4,y-25,8,15,'#eedcaa',1);rect(x-1,y-24,3,10,'#9d684f')}
    rect(x-11,y-46,22,23,'#d6a47b',6);
    rect(x-13,y-48,26,8,'#ad8957',3);rect(x-18,y-44,36,6,'#d2b071',3);rect(x-11,y-59,22,16,'#c6a56b',4);rect(x-11,y-47,22,4,'#6b5a3e');
    if(dir!=='up'){rect(x+(dir==='left'?-8:dir==='right'?5:-6),y-34,3,3,'#243b36');if(dir==='down')rect(x+4,y-34,3,3,'#243b36')}
    if(npc){rect(x-10,y-37,8,6,'#283d3540',1);rect(x+2,y-37,8,6,'#283d3540',1)}
  }
  function inRect(x,y,r){return x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h}
  function canMove(x,y){return [[-11,-7],[11,-7],[-11,7],[11,7]].every(([dx,dy])=>walkable.some(r=>inRect(x+dx,y+dy,r)))&&!obstacles.some(r=>inRect(x,y,{x:r.x-10,y:r.y-7,w:r.w+20,h:r.h+14}))}
  // Routing uses the same collision geometry as character movement.
  let navigation=null,routeClock=0,navGrid=null;
  function insideGallery(r){return inRect(player.x,player.y,{x:r.x+18,y:r.y+18,w:r.w-36,h:r.h-36})}
  function stopNavigation(){navigation=null;updateHUD()}
  function routeFromPlayer(r){
    if(!navGrid){navGrid=new Map();for(let y=100;y<2210;y+=20)for(let x=80;x<1850;x+=20)if(canMove(x,y))navGrid.set(x+','+y,{x,y})}
    let start=null,best=Infinity;
    for(const point of navGrid.values()){
      const distance=Math.hypot(point.x-player.x,point.y-player.y);
      if(distance>=best||distance>60)continue;
      const steps=Math.ceil(distance/4);let clear=true;
      for(let i=1;i<=steps;i++)if(!canMove(player.x+(point.x-player.x)*i/steps,player.y+(point.y-player.y)*i/steps)){clear=false;break}
      if(clear){start=point;best=distance}
    }
    if(!start)return [];
    const startKey=start.x+','+start.y,previous=new Map([[startKey,null]]),queue=[start];let end=null;
    for(let i=0;i<queue.length;i++){
      const point=queue[i],key=point.x+','+point.y;
      const goalX=r.side==='left'?r.x+r.w-30:r.x+30;
      if(Math.abs(point.x-goalX)<=10&&Math.abs(point.y-(r.y+210))<=10){end=key;break}
      for(const [dx,dy] of [[20,0],[-20,0],[0,20],[0,-20]]){
        const nextKey=(point.x+dx)+','+(point.y+dy),nextPoint=navGrid.get(nextKey);
        if(nextPoint&&!previous.has(nextKey)&&canMove(point.x+dx/2,point.y+dy/2)){previous.set(nextKey,key);queue.push(nextPoint)}
      }
    }
    if(!end)return [];
    const path=[];for(let key=end;key!==null;key=previous.get(key))path.push(navGrid.get(key));
    return [{x:player.x,y:player.y},...path.reverse()];
  }
  function navigateTo(exhibitId){
    const room=rooms.find(r=>r.exhibits.some(e=>e.id===exhibitId));if(!room)return;
    if(insideGallery(room)){stopNavigation();toast('You are already in '+room.name+'. Look for the exhibit stands.');return}
    navigation={roomId:room.id,exhibitId,path:routeFromPlayer(room)};routeClock=0;
    toast('Follow the gold arrows to '+room.name+'.');
  }
  function updateNavigation(dt){
    if(!navigation)return;
    const room=rooms.find(r=>r.id===navigation.roomId);
    if(insideGallery(room)){stopNavigation();toast('You have arrived at '+room.name+'.');return}
    routeClock+=dt;
    if(routeClock>.5){navigation.path=routeFromPlayer(room);routeClock=0}
    document.querySelector('#questDetail').textContent='Follow the gold arrows to '+room.name;
  }
  function drawNavigation(){
    if(!navigation)return;
    const path=navigation.path;ctx.save();ctx.strokeStyle='#ffdf80';ctx.lineWidth=3;
    ctx.shadowColor='#183b39';ctx.shadowBlur=4;
    for(let i=1;i<path.length-1;i+=3){
      const point=path[i],next=path[i+1],angle=Math.atan2(next.y-point.y,next.x-point.x);
      ctx.save();ctx.translate(point.x,point.y);ctx.rotate(angle);ctx.beginPath();ctx.moveTo(-7,-7);ctx.lineTo(2,0);ctx.lineTo(-7,7);ctx.stroke();ctx.restore();
    }
    ctx.restore();
  }
  function locationName(){const r=rooms.find(r=>inRect(player.x,player.y,r));return r?r.name:player.y>1700?'The Arcade':'Grand Hall'}
  function paused(){return !started||document.querySelector('#panel').open||document.querySelector('#welcome').open||document.hidden}
  function clearKeys(){keys.clear();touch.clear();player.moving=false}
  function interact(){if(paused()||!near)return;clearKeys();UI.interact(near)}
  function nearest(){let result=null,distance=95;objects.forEach(o=>{const d=Math.hypot(o.x-player.x,o.y-player.y);if(d<distance){distance=d;result=o}});return result}
  function resize(){vw=innerWidth;vh=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(vw*dpr);canvas.height=Math.round(vh*dpr);zoom=vw<700?.72:Math.min(1.08,Math.max(.82,vw/1350));}
  function drawMap(context,width,height){
    context.clearRect(0,0,width,height);context.fillStyle='#132f34';context.fillRect(0,0,width,height);
    const scale=Math.min((width-12)/W,(height-12)/H),ox=(width-W*scale)/2,oy=(height-H*scale)/2;
    context.save();context.translate(ox,oy);context.scale(scale,scale);
    context.fillStyle='#667c69';context.fillRect(820,80,280,1640);rooms.forEach((r,i)=>{context.fillStyle=r.color;context.fillRect(r.x,r.y,r.w,r.h);context.fillRect(r.side==='left'?730:1080,r.y+160,110,100);if(width>300){context.font='700 48px Arial';context.fillStyle='#eee4c8';context.textAlign='center';context.fillText(`${i+1}. ${r.name}`,r.x+r.w/2,r.y+220)}});
    context.fillStyle='#736349';context.fillRect(70,1700,1780,520);if(width>300){context.fillStyle='#eee4c8';context.font='700 54px Arial';context.fillText('ARCADE + EXIT TICKET',960,1950)}
    context.strokeStyle='#f0d08266';context.lineWidth=10;context.strokeRect(camera.x,camera.y,vw/zoom,vh/zoom);
    context.fillStyle='#ffdc85';context.beginPath();context.arc(player.x,player.y,width>300?28:37,0,Math.PI*2);context.fill();context.restore();
  }
  function render(now){
    const dt=Math.min((now-last)/1000,.045)||0;last=now;frame++;
    if(!paused()){
      let dx=(keys.has('d')||keys.has('arrowright')||touch.has('right')?1:0)-(keys.has('a')||keys.has('arrowleft')||touch.has('left')?1:0);
      let dy=(keys.has('s')||keys.has('arrowdown')||touch.has('down')?1:0)-(keys.has('w')||keys.has('arrowup')||touch.has('up')?1:0);
      const length=Math.hypot(dx,dy);player.moving=length>0;
      if(length){dx/=length;dy/=length;const speed=keys.has('shift')?280:190;if(canMove(player.x+dx*speed*dt,player.y))player.x+=dx*speed*dt;if(canMove(player.x,player.y+dy*speed*dt))player.y+=dy*speed*dt;player.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';player.walk+=dt*13}
      near=nearest();
    }else player.moving=false;
    const desiredX=Math.max(0,Math.min(W-vw/zoom,player.x-vw/zoom/2)),desiredY=Math.max(0,Math.min(H-vh/zoom,player.y-vh/zoom*.55));
    camera.x+=(desiredX-camera.x)*Math.min(1,dt*10);camera.y+=(desiredY-camera.y)*Math.min(1,dt*10);
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#102e35';ctx.fillRect(0,0,vw,vh);ctx.save();ctx.scale(zoom,zoom);ctx.translate(-camera.x,-camera.y);
    // Architectural outline and garden beds outside the museum walls.
    rect(36,55,1848,2200,'#1b3e40',20);for(let y=120;y<1650;y+=160){rect(26,y,22,64,'#315549',6);rect(1872,y,22,64,'#315549',6)}
    drawHall();rooms.forEach(roomDraw);arcadeDraw();updateNavigation(dt);drawNavigation();
    const sorted=[...objects,{type:'player',y:player.y}].sort((a,b)=>a.y-b.y);sorted.forEach(o=>o.type==='player'?avatar(player.x,player.y,player.dir,player.moving):drawObject(o));
    ctx.restore();
    const vignette=ctx.createRadialGradient(vw/2,vh/2,Math.min(vw,vh)*.25,vw/2,vh/2,Math.max(vw,vh)*.75);vignette.addColorStop(0,'#071a2000');vignette.addColorStop(1,'#061d254f');ctx.fillStyle=vignette;ctx.fillRect(0,0,vw,vh);
    document.querySelector('#location').textContent=locationName();
    const prompt=document.querySelector('#interaction');prompt.style.display=near&&!paused()?'flex':'none';if(near)document.querySelector('#interactionText').textContent=near.title;
    if(frame%4===0)drawMap(mctx,144,180);
    requestAnimationFrame(render);
  }
  window.addEventListener('resize',resize);window.addEventListener('blur',clearKeys);document.addEventListener('visibilitychange',clearKeys);
  document.addEventListener('keydown',e=>{
    if(paused())return;
    const key=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' ','shift'].includes(key)){e.preventDefault();keys.add(key)}
    if(e.repeat)return;
    if(key==='e'||key===' '){e.preventDefault();interact()}
    if(key==='h'){e.preventDefault();clearKeys();UI.help()}
    if(key==='j'){e.preventDefault();clearKeys();UI.journal()}
    if(key==='m'){e.preventDefault();clearKeys();UI.map()}
    if(key==='escape'){e.preventDefault();clearKeys();UI.menu()}
  });
  document.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
  document.querySelectorAll('[data-dir]').forEach(button=>{button.onpointerdown=e=>{e.preventDefault();touch.add(button.dataset.dir);button.setPointerCapture(e.pointerId)};button.onpointerup=()=>touch.delete(button.dataset.dir);button.onpointercancel=()=>touch.delete(button.dataset.dir);button.onlostpointercapture=()=>touch.delete(button.dataset.dir)});
  canvas.onclick=e=>{canvas.focus();if(paused())return;const wx=e.clientX/zoom+camera.x,wy=e.clientY/zoom+camera.y;const hit=objects.find(o=>Math.hypot(o.x-wx,o.y-20-wy)<50);if(hit){if(Math.hypot(hit.x-player.x,hit.y-player.y)<100){near=hit;interact()}else toast('Walk closer, then press E or Interact.')}};
  document.querySelector('#interactButton').onclick=interact;
  document.querySelector('#helpButton').onclick=()=>{if(started)UI.help()};document.querySelector('#menuButton').onclick=()=>{if(started)UI.menu()};document.querySelector('#mapButton').onclick=()=>{if(started)UI.map()};
  function musicUI(){const b=document.querySelector('#musicButton');b.setAttribute('aria-pressed',Jazz.isOn());b.querySelector('span').textContent=Jazz.isOn()?'Stop Music':'Play Music'}
  document.querySelector('#musicButton').onclick=async()=>{if(Jazz.isOn())Jazz.stop();else await Jazz.start();musicUI()};
  function start(){const firstVisit=!started;started=true;document.querySelector('#welcome').close();canvas.focus();if(firstVisit)Jazz.start().then(musicUI);toast('Welcome! Walk up to the curator and press E.');}
  resize();camera.x=player.x-vw/zoom/2;camera.y=player.y-vh/zoom*.55;updateHUD();requestAnimationFrame(render);
  const api={navigateTo,stopNavigation,getNavigation:()=>navigation,state,rooms,objects,player,canMove,persist,reset,toast,start,clearKeys,drawMap,musicUI,isStarted:()=>started,returnToEntrance:()=>{player.x=960;player.y=1570;clearKeys()},getLocation:locationName};
  setTimeout(()=>UI.entrance(),0);return api;
})();
