(function(){
  const icons={
    today:'<svg viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5"/><path d="M6.5 9.5V20h11V9.5"/><path d="M9.5 20v-6h5v6"/></svg>',
    food:'<svg viewBox="0 0 24 24"><path d="M7 3v7M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 10v11"/><path d="M15 3v18M15 3c3 1 4.5 4 4.5 7H15"/></svg>',
    progress:'<svg viewBox="0 0 24 24"><path d="M4 18 9 13l4 3 7-9"/><path d="M15 7h5v5"/></svg>',
    plan:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="m8 12 2.5 2.5L16.5 8.5"/></svg>',
    more:'<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
    plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'
  };
  const sectionNames={
    food:['Питание','Баланс дня'],
    progress:['Прогресс','Твоя динамика'],
    plan:['План','Путь к цели'],
    more:['Мой журнал','Итоги и заметки']
  };
  function greet(){
    const h=new Date().getHours();
    return h<12?'Доброе утро':h<18?'Добрый день':'Добрый вечер';
  }
  function initial(){
    try{
      const n=(window.S&&S.profile&&S.profile.name||'').trim();
      return n&&n!=='Моя цель'?n.charAt(0).toUpperCase():'60';
    }catch(e){return '60'}
  }
  function decorateNav(){
    const ids=['today','food','progress','plan','more'];
    document.querySelectorAll('.nav button').forEach((b,i)=>{
      const ico=b.querySelector('.ico');
      if(ico&&ids[i]) ico.innerHTML=icons[ids[i]];
    });
    const fab=document.querySelector('.fab');
    if(fab) fab.innerHTML=icons.plus;
  }
  function sectionTitles(){
    Object.keys(sectionNames).forEach(id=>{
      const sec=document.getElementById(id);
      if(!sec||sec.querySelector('.premium-section-title'))return;
      const t=document.createElement('div');
      t.className='premium-section-title';
      t.innerHTML='<div class="eyebrow">'+sectionNames[id][0]+'</div><h2>'+sectionNames[id][1]+'</h2>';
      sec.insertBefore(t,sec.firstChild);
    });
  }
  function decorateToday(){
    const sec=document.getElementById('today');
    if(!sec)return;
    let welcome=sec.querySelector('.premium-welcome');
    if(!welcome){
      welcome=document.createElement('div');
      welcome.className='premium-welcome';
      welcome.innerHTML='<div><div class="eyebrow">MY 60 · сегодня</div><h2><span id="premiumGreeting"></span></h2></div><div class="avatar" id="premiumAvatar"></div>';
      sec.insertBefore(welcome,sec.firstChild);
    }
    const gr=document.getElementById('premiumGreeting');
    if(gr)gr.textContent=greet();
    const av=document.getElementById('premiumAvatar');
    if(av)av.textContent=initial();

    const hero=sec.querySelector('.hero');
    if(hero&&!hero.querySelector('.premium-ring')){
      const ring=document.createElement('div');
      ring.className='premium-ring';
      ring.innerHTML='<b id="premiumPct">0%</b>';
      hero.appendChild(ring);
    }
    let qs=sec.querySelector('.quick-strip');
    if(!qs&&hero){
      qs=document.createElement('div');
      qs.className='quick-strip';
      qs.innerHTML=
        '<button onclick="openEntryForm(\'weight\')"><span class="qi"><svg viewBox="0 0 24 24"><path d="M5 19h14"/><path d="M7 19l1.2-9h7.6L17 19"/><path d="M9 10a3 3 0 0 1 6 0"/><path d="M12 8.5v2.5"/></svg></span>Вес</button>'+
        '<button onclick="openEntryForm(\'food\')"><span class="qi"><svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M7 12a5 5 0 0 1 10 0"/><path d="M4 16h16"/><path d="M8 19h8"/></svg></span>Еда</button>'+
        '<button onclick="addWater(250)"><span class="qi"><svg viewBox="0 0 24 24"><path d="M12 3s5 5.4 5 10a5 5 0 0 1-10 0c0-4.6 5-10 5-10Z"/><path d="M10 15c.5.7 1.1 1 2 1.1"/></svg></span>+250 мл</button>'+
        '<button onclick="openEntryForm(\'steps\')"><span class="qi"><svg viewBox="0 0 24 24"><path d="M9 4c1.7 2.6 1.8 5.1.7 7.6L8 15"/><path d="M8 15c-1.1 1.6-.7 3.5.9 4.4 1.6.9 3.5.3 4.4-1.3l1.4-2.4"/><path d="M15 5c1.2 1.9 1.4 3.8.7 5.7"/></svg></span>Шаги</button>';
      hero.insertAdjacentElement('afterend',qs);
    }
  }
  function updateRing(){
    const bar=document.getElementById('goalBar'),ring=document.querySelector('.premium-ring'),pct=document.getElementById('premiumPct');
    if(!bar||!ring)return;
    const n=Math.max(0,Math.min(100,parseFloat(bar.style.width)||0));
    ring.style.setProperty('--p',n+'%');
    if(pct)pct.textContent=Math.round(n)+'%';
  }
  function premiumDraw(){
    const cv=document.getElementById('chart');
    if(!cv||!window.S)return;
    const ctx=cv.getContext('2d'),r=cv.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const W=Math.max(300,Math.floor(r.width)),H=220;
    cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,W,H);
    const data=Object.entries(S.weights||{}).sort().slice(-30);
    if(data.length<2){
      ctx.fillStyle='#929a95';ctx.font='600 13px -apple-system,BlinkMacSystemFont,sans-serif';
      ctx.fillText('Добавь ещё одно измерение — здесь появится график',18,42);return;
    }
    const vals=data.map(x=>+x[1]),mn=Math.min(...vals)-.4,mx=Math.max(...vals)+.4,padX=18,padY=22;
    ctx.strokeStyle='#e5e9e4';ctx.lineWidth=1;
    for(let i=0;i<4;i++){
      const y=padY+(H-padY*2)*i/3;ctx.beginPath();ctx.moveTo(padX,y);ctx.lineTo(W-padX,y);ctx.stroke();
    }
    const pts=data.map((x,i)=>({
      x:padX+(W-padX*2)*i/(data.length-1),
      y:padY+(H-padY*2)*(mx-(+x[1]))/(mx-mn)
    }));
    const fill=ctx.createLinearGradient(0,padY,0,H-padY);
    fill.addColorStop(0,'rgba(128,104,240,.22)');fill.addColorStop(1,'rgba(128,104,240,0)');
    ctx.beginPath();ctx.moveTo(pts[0].x,H-padY);pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.lineTo(p.x,p.y));ctx.lineTo(pts[pts.length-1].x,H-padY);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
    const line=ctx.createLinearGradient(padX,0,W-padX,0);line.addColorStop(0,'#8068f0');line.addColorStop(1,'#ff7f8f');
    ctx.strokeStyle=line;ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
    pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
    const last=pts[pts.length-1];ctx.beginPath();ctx.arc(last.x,last.y,4.5,0,Math.PI*2);ctx.fillStyle='#ff7f8f';ctx.fill();
    ctx.beginPath();ctx.arc(last.x,last.y,8,0,Math.PI*2);ctx.strokeStyle='rgba(255,127,143,.22)';ctx.lineWidth=4;ctx.stroke();
  }
  function decorate(){
    decorateNav();sectionTitles();decorateToday();updateRing();
  }
  document.addEventListener('DOMContentLoaded',decorate);
  if(typeof window.render==='function'){
    const oldRender=window.render;
    window.render=function(){oldRender.apply(this,arguments);decorate();updateRing();}
  }
  if(typeof window.draw==='function')window.draw=premiumDraw;
  if(typeof window.tab==='function'){
    const oldTab=window.tab;
    window.tab=function(id,b){oldTab(id,b);requestAnimationFrame(()=>{decorate();if(id==='progress')setTimeout(premiumDraw,60);});}
  }
  window.addEventListener('resize',()=>{if((function(){var p=document.getElementById('progress');return p&&p.classList.contains('active')})())premiumDraw();});
})();