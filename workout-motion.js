(function(){
  'use strict';

  let raf=0;

  function planInfo(){
    try{
      const raw=(window.S&&S.planStartedAt)||new Date().toISOString().slice(0,10);
      const start=new Date(raw+'T00:00:00');
      const today=new Date();
      start.setHours(0,0,0,0);today.setHours(0,0,0,0);
      const day=Math.max(1,Math.floor((today-start)/86400000)+1);
      const week=Math.max(1,Math.min(4,Math.floor((day-1)/7)+1));
      return {day:day,week:week,pct:Math.max(0,Math.min(100,day/28*100))};
    }catch(e){return {day:1,week:1,pct:4}}
  }

  function addPlanHead(){
    const hub=document.querySelector('#workoutStudio .my60-training-hub');
    if(!hub||hub.querySelector('.my60-plan-head'))return;
    const p=planInfo();
    const head=document.createElement('section');
    head.className='my60-plan-head';
    head.innerHTML='<div class="my60-plan-head-copy"><span>Неделя '+p.week+' из 4</span><b>Тренировки для тонуса</b><small>День '+Math.min(p.day,28)+' из 28 · сегодня главное — просто начать</small></div>'+
      '<button type="button" onclick="window.openPlanStartSettings&&openPlanStartSettings()">Изменить старт</button>'+
      '<div class="my60-plan-head-bar"><i style="width:'+p.pct+'%"></i></div>';
    hub.insertBefore(head,hub.firstChild);
  }

  function phaseGroups(svg){
    return Array.from(svg.children).filter(function(n){return n.tagName&&n.tagName.toLowerCase()==='g'}).slice(0,2);
  }

  function setMotionMode(box,steps){
    const svg=box.querySelector('svg');if(!svg)return;
    const groups=phaseGroups(svg);if(groups.length<2)return;
    const paths=Array.from(svg.children).filter(function(n){return n.tagName&&n.tagName.toLowerCase()==='path'});
    box.classList.toggle('steps-mode',!!steps);
    box.dataset.motionMode=steps?'steps':'motion';
    if(steps){
      svg.setAttribute('viewBox','0 0 300 170');
      groups[0].setAttribute('transform','translate(0 0)');
      groups[1].setAttribute('transform','translate(150 0)');
      paths.forEach(function(p){p.style.display=''});
    }else{
      svg.setAttribute('viewBox','0 0 150 170');
      groups[0].setAttribute('transform','translate(0 0)');
      groups[1].setAttribute('transform','translate(0 0)');
      paths.forEach(function(p){p.style.display='none'});
    }
    const btn=box.querySelector('.my60-motion-toggle');
    const badge=box.querySelector('.my60-motion-badge');
    if(btn)btn.textContent=steps?'▶ Анимация':'По шагам';
    if(badge)badge.textContent=steps?'СТАРТ → ДВИЖЕНИЕ':'СМОТРИ ДВИЖЕНИЕ';
  }

  function prepareMotionBox(box,withToggle){
    if(!box||box.dataset.motionReady==='1')return;
    const svg=box.querySelector(':scope > svg');if(!svg)return;
    const groups=phaseGroups(svg);if(groups.length<2)return;
    box.dataset.motionReady='1';
    box.classList.add('my60-motion-box');
    svg.classList.add('my60-motion-svg');
    groups[0].classList.add('my60-phase-start');
    groups[1].classList.add('my60-phase-move');
    if(withToggle){
      const tools=document.createElement('div');
      tools.className='my60-motion-tools';
      tools.innerHTML='<span class="my60-motion-badge">СМОТРИ ДВИЖЕНИЕ</span><button type="button" class="my60-motion-toggle">По шагам</button>';
      tools.querySelector('button').addEventListener('click',function(){setMotionMode(box,box.dataset.motionMode!=='steps')});
      box.appendChild(tools);
    }
    setMotionMode(box,false);
  }

  function enhanceVisuals(){
    addPlanHead();
    document.querySelectorAll('.my60-demo').forEach(function(box){prepareMotionBox(box,true)});
    document.querySelectorAll('.my60-today-visual').forEach(function(box){prepareMotionBox(box,false)});
  }

  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(function(){raf=0;enhanceVisuals()});
  }

  function injectStyle(){
    if(document.getElementById('my60MotionStyle'))return;
    const st=document.createElement('style');st.id='my60MotionStyle';
    st.textContent=`
      #plan .plan-hero,#plan .plan-start-card{display:none!important}
      body.my60-workout-open .nav,body.my60-workout-open .fab{display:none!important}
      .my60-plan-head{position:relative;overflow:hidden;background:#fff;border:1px solid rgba(21,25,23,.06);border-radius:25px;padding:17px 17px 20px;box-shadow:0 10px 30px rgba(23,31,27,.05)}
      .my60-plan-head-copy{padding-right:92px}.my60-plan-head-copy span{display:block;font-size:11px;letter-spacing:.11em;text-transform:uppercase;color:#b0646c;font-weight:850}.my60-plan-head-copy b{display:block;font-size:22px;letter-spacing:-.035em;margin:4px 0}.my60-plan-head-copy small{display:block;color:#858b86;font-size:11px;line-height:1.4}.my60-plan-head>button{position:absolute;right:14px;top:15px;border:0;border-radius:13px;background:#f3f1ed;color:#666c68;padding:9px 10px;font-size:10px;font-weight:800}.my60-plan-head-bar{position:absolute;left:17px;right:17px;bottom:10px;height:5px;border-radius:99px;background:#ecece8;overflow:hidden}.my60-plan-head-bar i{display:block;height:100%;border-radius:99px;background:#c76f77}
      .my60-motion-box{position:relative;isolation:isolate}.my60-motion-svg{overflow:visible}
      .my60-motion-box:not(.steps-mode) .my60-phase-start{animation:my60PhaseStart 2.7s ease-in-out infinite;transform-origin:center}.my60-motion-box:not(.steps-mode) .my60-phase-move{animation:my60PhaseMove 2.7s ease-in-out infinite;transform-origin:center}
      @keyframes my60PhaseStart{0%,36%{opacity:1;transform:translateY(0) scale(1)}48%,88%{opacity:.08;transform:translateY(4px) scale(.985)}100%{opacity:1;transform:translateY(0) scale(1)}}
      @keyframes my60PhaseMove{0%,36%{opacity:.08;transform:translateY(-3px) scale(.985)}48%,88%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:.08;transform:translateY(-3px) scale(.985)}}
      .my60-motion-tools{position:absolute;left:12px;right:12px;bottom:10px;z-index:5;display:flex;justify-content:space-between;align-items:center;pointer-events:none}.my60-motion-tools span{border-radius:999px;padding:7px 9px;background:rgba(255,255,255,.92);box-shadow:0 5px 16px rgba(23,31,27,.08);font-size:9px;letter-spacing:.1em;color:#6d716e;font-weight:900}.my60-motion-tools button{pointer-events:auto;border:0;border-radius:999px;padding:8px 11px;background:#171d1a;color:#fff;font-size:10px;font-weight:850;box-shadow:0 6px 16px rgba(23,31,27,.16)}
      .my60-demo{min-height:270px}.my60-demo:not(.steps-mode) svg{max-width:310px!important}.my60-demo.steps-mode svg{max-width:100%!important}.my60-today-visual:not(.steps-mode) svg{max-width:300px!important}
      .my60-player-actions{position:sticky!important;bottom:calc(env(safe-area-inset-bottom) + 5px);z-index:8;padding:7px;border-radius:21px;background:rgba(245,243,239,.90);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}.my60-player-actions .main{min-height:56px!important}
      .my60-preview-item .my60-preview-thumb svg,.my60-rest-next svg{animation:none!important}
      @media(max-width:430px){.my60-plan-head{border-radius:22px;padding:15px 14px 19px}.my60-plan-head-copy{padding-right:78px}.my60-plan-head-copy b{font-size:20px}.my60-plan-head>button{right:11px;top:12px;padding:8px}.my60-demo{height:286px!important;min-height:286px}.my60-demo:not(.steps-mode) svg{max-width:290px!important}.my60-motion-tools{left:9px;right:9px;bottom:8px}.my60-player-copy{padding-bottom:12px!important}}
      @media(prefers-reduced-motion:reduce){.my60-phase-start,.my60-phase-move{animation:none!important}.my60-phase-move{opacity:0!important}}
    `;
    document.head.appendChild(st);
  }

  function boot(){
    injectStyle();schedule();
    const obs=new MutationObserver(schedule);obs.observe(document.body,{childList:true,subtree:true});
    document.addEventListener('click',function(e){if(e.target.closest('.nav button'))setTimeout(schedule,80)});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
