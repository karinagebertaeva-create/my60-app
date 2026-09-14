(function(){
'use strict';

const META={
  STRENGTH:{title:'Силовая · всё тело',short:'Силовая',duration:'28–35 мин',kind:'strength'},
  LOWER:{title:'Силовая · ноги и ягодицы',short:'Ноги + ягодицы',duration:'25–32 мин',kind:'strength'},
  UPPER:{title:'Силовая · руки и плечи',short:'Руки + плечи',duration:'22–28 мин',kind:'strength'},
  GLUTES:{title:'Ягодицы · тонус',short:'Ягодицы',duration:'22–28 мин',kind:'strength'},
  CORE:{title:'Кор и талия',short:'Кор',duration:'18–24 мин',kind:'core'},
  ABS:{title:'Пресс и живот · без прыжков',short:'Пресс + живот',duration:'16–22 мин',kind:'core'},
  BACK:{title:'Здоровая спина',short:'Спина',duration:'18–24 мин',kind:'back'},
  POSTURE:{title:'Осанка и лопатки',short:'Осанка',duration:'15–20 мин',kind:'back'},
  PILATES:{title:'Пилатес · всё тело',short:'Пилатес',duration:'20–26 мин',kind:'pilates'},
  PILATES_CORE:{title:'Пилатес · кор и талия',short:'Пилатес кор',duration:'16–22 мин',kind:'pilates'},
  YOGA:{title:'Йога · мягкий поток',short:'Йога',duration:'18–24 мин',kind:'yoga'},
  YOGA_BACK:{title:'Йога · спина и плечи',short:'Йога спина',duration:'15–20 мин',kind:'yoga'},
  PELVIC:{title:'Тазовое дно · мягко',short:'Тазовое дно',duration:'12–18 мин',kind:'pelvic'},
  MOBILITY:{title:'Мобилизация всего тела',short:'Мобилизация',duration:'12–18 мин',kind:'recovery'},
  CARDIO:{title:'Кардио · без прыжков',short:'Кардио',duration:'18–24 мин',kind:'cardio'},
  INTERVAL:{title:'Интервальная · без прыжков',short:'Интервальная',duration:'16–20 мин',kind:'cardio'},
  STRETCH:{title:'Растяжка всего тела',short:'Растяжка',duration:'10–16 мин',kind:'recovery'}
};

const WEEKS=[
  {title:'Входим в ритм',note:'2 силовые + кор, спина и мягкое восстановление',days:['STRENGTH','PILATES_CORE','BACK','LOWER','POSTURE','YOGA','STRETCH']},
  {title:'Тонус и осанка',note:'Низ и верх тела чередуются с прессом и йогой',days:['LOWER','PILATES','UPPER','ABS','BACK','YOGA_BACK','STRETCH']},
  {title:'Сильнее и выносливее',note:'Силовая база, ягодицы и один более активный день',days:['STRENGTH','PELVIC','GLUTES','POSTURE','INTERVAL','PILATES_CORE','YOGA']},
  {title:'Закрепляем привычку',note:'Сила, кор, спина и восстановление без перегруза',days:['LOWER','BACK','UPPER','ABS','PELVIC','YOGA_BACK','STRETCH']}
];
const DAYS=['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
let viewWeek=null,raf=0,guard=false;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function dateKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function startDate(){
  try{
    const raw=(window.S&&S.planStartedAt)||dateKey(new Date());
    const d=new Date(raw+'T00:00:00');
    if(!isNaN(d.getTime()))return d;
  }catch(e){}
  const d=new Date();d.setHours(0,0,0,0);return d;
}
function position(){
  const s=startDate(),t=new Date();s.setHours(0,0,0,0);t.setHours(0,0,0,0);
  const raw=Math.floor((t-s)/86400000)+1;
  const day=Math.max(1,Math.min(28,raw));
  return {raw:raw,day:day,week:Math.floor((day-1)/7),dayInWeek:(day-1)%7,pct:Math.max(0,Math.min(100,raw/28*100))};
}
function dayDate(week,day){const d=startDate();d.setDate(d.getDate()+week*7+day);return d}
function done(type,d){try{return !!(window.S&&S.workouts&&Array.isArray(S.workouts[dateKey(d)])&&S.workouts[dateKey(d)].indexOf(type)>=0)}catch(e){return false}}
function todayWellness(){try{return window.S&&S.well&&S.well[dateKey(new Date())]||null}catch(e){return null}}
function gentleAlternative(type){
  if(type==='ABS'||type==='CORE')return 'PILATES_CORE';
  if(type==='BACK'||type==='POSTURE')return 'YOGA_BACK';
  if(['STRENGTH','LOWER','UPPER','GLUTES','INTERVAL','CARDIO'].indexOf(type)>=0)return 'PILATES';
  return type;
}
function recommendation(){
  const p=position(),planned=WEEKS[p.week].days[p.dayInWeek],w=todayWellness();
  const low=!!(w&&(((+w.sleep||0)>0&&+w.sleep<6.2)||(+w.energy||5)<=3||(+w.stress||5)>=8));
  const recommended=low?gentleAlternative(planned):planned;
  return {planned:planned,recommended:recommended,low:low,well:w,pos:p};
}
function start(type){if(window.My60Library&&My60Library.start)My60Library.start(type)}
function preview(type){if(window.My60Library&&My60Library.preview)My60Library.preview(type)}

function weekMarkup(week){
  const p=position(),cfg=WEEKS[week];
  return '<div class="my60-smart-week-days">'+cfg.days.map(function(type,i){
    const d=dayDate(week,i),isToday=dateKey(d)===dateKey(new Date()),isDone=done(type,d),past=d<new Date(new Date().setHours(0,0,0,0));
    return '<button type="button" class="my60-smart-day '+(isToday?'today ':'')+(isDone?'done ':'')+(past&&!isDone?'past ':'')+'" onclick="My60Plan.preview(\''+type+'\')">'+
      '<span>'+DAYS[i]+'</span><b>'+(isDone?'✓':d.getDate())+'</b><small>'+esc(META[type].short)+'</small></button>';
  }).join('')+'</div>';
}
function planMarkup(){
  const r=recommendation(),p=r.pos,cfg=WEEKS[p.week],planned=META[r.planned],rec=META[r.recommended];
  if(viewWeek===null)viewWeek=p.week;
  const complete=done(r.recommended,new Date())||done(r.planned,new Date());
  return '<section class="my60-smart-plan">'+
    '<div class="my60-smart-top"><div><span>ПРОГРАММА 28 ДНЕЙ</span><h3>Неделя '+(p.week+1)+' из 4 · '+esc(cfg.title)+'</h3><p>День '+p.day+' из 28 · '+esc(cfg.note)+'</p></div><div class="my60-smart-progress"><b>'+Math.round(p.pct)+'%</b></div></div>'+
    '<div class="my60-smart-bar"><i style="width:'+p.pct+'%"></i></div>'+
    '<div class="my60-week-tabs">'+WEEKS.map(function(w,i){return '<button class="'+(viewWeek===i?'active':'')+'" onclick="My60Plan.week('+i+')">'+(i+1)+'</button>'}).join('')+'</div>'+
    '<div id="my60SmartWeek">'+weekMarkup(viewWeek)+'</div>'+
    '<div class="my60-smart-today '+(r.low?'gentle':'')+'">'+
      '<div class="my60-smart-kicker">'+(r.low?'Сегодня бережный режим':'Сегодня по программе')+'</div>'+
      '<h2>'+esc(rec.title)+'</h2><p>'+esc(rec.duration)+' · пошаговая визуальная тренировка</p>'+
      (r.low&&r.recommended!==r.planned?'<div class="my60-smart-note">По чек‑ину сегодня ресурс ниже обычного. Вместо «'+esc(planned.short)+'» предлагаю более мягкую тренировку. План не сбивается.</div>':'')+
      '<div class="my60-smart-actions"><button class="main '+(complete?'done':'')+'" onclick="My60Plan.start(\''+r.recommended+'\')">'+(complete?'Повторить тренировку':'▶ Начать')+'</button><button onclick="My60Plan.preview(\''+r.recommended+'\')">Упражнения</button><button onclick="My60Plan.swap()">Заменить</button></div>'+
      (r.low&&r.recommended!==r.planned?'<button class="my60-planned-anyway" onclick="My60Plan.start(\''+r.planned+'\')">Всё равно сделать по плану · '+esc(planned.short)+'</button>':'')+
    '</div>'+
  '</section>';
}

function swapMarkup(){
  const choices=['STRENGTH','LOWER','GLUTES','ABS','BACK','POSTURE','PILATES','PILATES_CORE','YOGA','YOGA_BACK','PELVIC','CARDIO','STRETCH'];
  return '<div class="my60-swap-inner"><div class="my60-swap-head"><button onclick="My60Plan.closeSwap()">×</button><div><span>ЗАМЕНА НА СЕГОДНЯ</span><b>Что хочется сделать?</b></div><i></i></div><div class="my60-swap-grid">'+choices.map(function(t){return '<button onclick="My60Plan.pick(\''+t+'\')"><b>'+esc(META[t].title)+'</b><span>'+esc(META[t].duration)+'</span></button>'}).join('')+'</div><p class="my60-swap-note">Замена не удаляет план. Ты просто выбираешь подходящую тренировку на сегодня.</p></div>';
}
function openSwap(){let el=document.getElementById('my60PlanSwap');if(!el){el=document.createElement('div');el.id='my60PlanSwap';el.className='my60-plan-swap';document.body.appendChild(el)}el.innerHTML=swapMarkup();el.classList.add('open');document.body.classList.add('my60-workout-open')}
function closeSwap(){const el=document.getElementById('my60PlanSwap');if(el)el.classList.remove('open');document.body.classList.remove('my60-workout-open')}
function pick(type){closeSwap();preview(type)}
function setWeek(i){viewWeek=Math.max(0,Math.min(3,+i||0));render()}

function injectStyle(){if(document.getElementById('my60PlanStyle'))return;const st=document.createElement('style');st.id='my60PlanStyle';st.textContent=`
  #workoutStudio .my60-plan-head,#workoutStudio>.my60-training-hub>.my60-week-strip,#workoutStudio>.my60-training-hub>.my60-today-card{display:none!important}
  .my60-smart-plan{display:flex;flex-direction:column;gap:12px;background:#fff;border:1px solid rgba(21,25,23,.06);border-radius:29px;padding:17px;box-shadow:0 14px 38px rgba(23,31,27,.07)}
  .my60-smart-top{display:grid;grid-template-columns:1fr 54px;gap:10px;align-items:start}.my60-smart-top span{font-size:10px;letter-spacing:.13em;color:#b0646c;font-weight:900}.my60-smart-top h3{font-size:22px;line-height:1.08;letter-spacing:-.035em;margin:5px 0}.my60-smart-top p{margin:0;color:#848a85;font-size:11px;line-height:1.45}.my60-smart-progress{width:52px;height:52px;border-radius:50%;background:#f6ecea;display:grid;place-items:center;color:#9b565f}.my60-smart-progress b{font-size:13px}.my60-smart-bar{height:6px;border-radius:99px;background:#ecece8;overflow:hidden}.my60-smart-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#c76f77,#d8959b)}
  .my60-week-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.my60-week-tabs button{border:0;border-radius:12px;background:#f2f2ef;color:#7c827d;padding:8px;font-size:11px;font-weight:850}.my60-week-tabs button.active{background:#171d1a;color:#fff}
  .my60-smart-week-days{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}.my60-smart-day{border:0;background:#f6f6f3;border-radius:14px;padding:7px 2px;color:#747a75;min-width:0}.my60-smart-day span{display:block;font-size:8px;font-weight:900}.my60-smart-day b{display:grid;place-items:center;width:27px;height:27px;margin:5px auto;border-radius:50%;background:#fff;font-size:10px}.my60-smart-day small{display:block;font-size:7px;line-height:1.1;height:16px;overflow:hidden}.my60-smart-day.today{background:#faeeee;color:#804b52}.my60-smart-day.today b{background:#c76f77;color:#fff}.my60-smart-day.done{background:#eaf4eb;color:#497052}.my60-smart-day.done b{background:#70a27b;color:#fff}.my60-smart-day.past:not(.done){opacity:.55}
  .my60-smart-today{border-radius:24px;padding:18px;background:linear-gradient(145deg,#171d1a,#27312b);color:#fff}.my60-smart-today.gentle{background:linear-gradient(145deg,#4b4d45,#687064)}.my60-smart-kicker{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6);font-weight:850}.my60-smart-today h2{font-size:25px;line-height:1.05;letter-spacing:-.04em;margin:5px 0 6px}.my60-smart-today>p{margin:0;color:rgba(255,255,255,.66);font-size:12px}.my60-smart-note{margin-top:12px;border-radius:14px;padding:10px 11px;background:rgba(255,255,255,.10);font-size:11px;line-height:1.45;color:rgba(255,255,255,.82)}.my60-smart-actions{display:grid;grid-template-columns:1fr auto auto;gap:7px;margin-top:15px}.my60-smart-actions button{border:0;border-radius:14px;padding:12px 11px;background:rgba(255,255,255,.1);color:#fff;font-size:11px;font-weight:850}.my60-smart-actions .main{background:#fff;color:#171d1a;font-size:12px}.my60-smart-actions .main.done{background:#dff0df;color:#356242}.my60-planned-anyway{width:100%;margin-top:8px;border:0;background:transparent;color:rgba(255,255,255,.72);font-size:10px;text-decoration:underline;text-underline-offset:3px;padding:6px}
  .my60-plan-swap{position:fixed;inset:0;z-index:11000;display:none;background:#f5f3ef;overflow:auto;padding:calc(env(safe-area-inset-top) + 14px) 14px calc(env(safe-area-inset-bottom) + 20px)}.my60-plan-swap.open{display:block}.my60-swap-inner{width:min(100%,560px);margin:auto}.my60-swap-head{display:grid;grid-template-columns:46px 1fr 46px;align-items:center;margin-bottom:14px}.my60-swap-head>button{width:42px;height:42px;border:0;border-radius:50%;background:#fff;font-size:25px}.my60-swap-head div{text-align:center}.my60-swap-head span{display:block;font-size:9px;letter-spacing:.13em;color:#9b6167;font-weight:900}.my60-swap-head b{font-size:16px}.my60-swap-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.my60-swap-grid button{border:1px solid rgba(21,25,23,.06);background:#fff;border-radius:19px;padding:14px;text-align:left;color:#222825}.my60-swap-grid b{display:block;font-size:13px;line-height:1.2}.my60-swap-grid span{display:block;color:#8b908c;font-size:10px;margin-top:6px}.my60-swap-note{text-align:center;color:#8b908c;font-size:10px;line-height:1.4;margin:16px 20px}
  @media(max-width:430px){.my60-smart-plan{padding:14px;border-radius:25px}.my60-smart-top h3{font-size:20px}.my60-smart-day{padding:6px 1px}.my60-smart-day b{width:25px;height:25px}.my60-smart-today h2{font-size:23px}.my60-smart-actions{grid-template-columns:1fr 1fr}.my60-smart-actions .main{grid-column:1/-1}.my60-swap-grid{grid-template-columns:1fr 1fr}}
`;document.head.appendChild(st)}

function render(){
  const hub=document.querySelector('#workoutStudio .my60-v2-hub');if(!hub)return false;
  guard=true;
  let plan=hub.querySelector('.my60-smart-plan');
  const html=planMarkup();
  if(plan)plan.outerHTML=html;else hub.insertAdjacentHTML('afterbegin',html);
  guard=false;return true;
}
function scheduleRender(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;render()})}
function boot(){
  injectStyle();let tries=0;const iv=setInterval(function(){tries++;if(render()||tries>100)clearInterval(iv)},100);
  const obs=new MutationObserver(function(){if(!guard)scheduleRender()});obs.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',function(e){if(e.target.closest('.nav button'))setTimeout(render,180)});
}
window.My60Plan={start:start,preview:preview,week:setWeek,swap:openSwap,closeSwap:closeSwap,pick:pick};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
