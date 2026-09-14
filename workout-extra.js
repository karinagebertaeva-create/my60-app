(function(){
'use strict';

const SESSION='my60-workout-session-v3';
const QUICK='my60-workout-quick-v1';
const INTENSITY='my60-workout-intensity-v1';
let hooked=false,busy=false,lastAdjusted='';

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function read(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
function write(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function intensity(){return localStorage.getItem(INTENSITY)||'normal'}
function setIntensity(v){localStorage.setItem(INTENSITY,v);renderControls()}
function loadSession(){return read(SESSION)}
function saveSession(s){write(SESSION,s)}
function quickMode(){return read(QUICK)}
function clearQuick(){write(QUICK,null)}

const quicks=[
  {id:'wake',title:'Разбудить тело',sub:'5 мин · мягкая мобилизация',type:'MOBILITY',max:4,rest:10,emoji:'☀️'},
  {id:'abs',title:'Пресс экспресс',sub:'8 мин · живот и кор',type:'ABS',max:4,rest:15,emoji:'◎'},
  {id:'glutes',title:'Ягодицы экспресс',sub:'10 мин · без прыжков',type:'GLUTES',max:5,rest:15,emoji:'◡'},
  {id:'back',title:'Спина + осанка',sub:'10 мин · разгрузка',type:'POSTURE',max:5,rest:15,emoji:'↟'},
  {id:'warm',title:'Разминка',sub:'4–5 мин · перед занятием',type:'MOBILITY',max:4,rest:8,emoji:'↗'},
  {id:'cool',title:'Заминка',sub:'6–8 мин · после занятия',type:'STRETCH',max:5,rest:8,emoji:'◌'}
];

function injectStyle(){
  if(document.getElementById('my60ExtraStyle'))return;
  const st=document.createElement('style');st.id='my60ExtraStyle';st.textContent=`
    .my60-extra-panel{background:#fff;border:1px solid rgba(21,25,23,.06);border-radius:27px;padding:16px;box-shadow:0 10px 30px rgba(23,31,27,.05)}
    .my60-extra-title{display:flex;justify-content:space-between;gap:12px;align-items:end;margin-bottom:12px}.my60-extra-title span{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#929792;font-weight:850}.my60-extra-title b{display:block;font-size:20px;letter-spacing:-.03em;margin-top:3px}.my60-extra-title small{font-size:10px;color:#969b97;text-align:right}
    .my60-levels{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;padding:5px;background:#f2f2ef;border-radius:17px}.my60-levels button{border:0;border-radius:13px;padding:10px 7px;background:transparent;color:#747a75;font-size:11px;font-weight:850}.my60-levels button.active{background:#171d1a;color:#fff;box-shadow:0 6px 14px rgba(23,31,27,.13)}
    .my60-level-note{font-size:10px;color:#8c918d;line-height:1.4;margin:9px 2px 0}.my60-level-note b{color:#5e6460}
    .my60-quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.my60-quick-card{border:1px solid rgba(21,25,23,.07);background:#fafaf8;border-radius:19px;padding:12px;text-align:left;color:#222825;min-height:90px}.my60-quick-card i{display:grid;place-items:center;width:30px;height:30px;border-radius:10px;background:#f4e9e7;color:#a85e66;font-style:normal;font-size:16px;margin-bottom:8px}.my60-quick-card b{display:block;font-size:13px;line-height:1.15}.my60-quick-card span{display:block;font-size:9px;color:#8c918d;margin-top:4px;line-height:1.3}
    .my60-quick-banner{position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top) + 10px);z-index:10070;width:min(520px,calc(100% - 28px));padding:9px 12px;border-radius:16px;background:rgba(23,29,26,.92);color:#fff;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);font-size:10px;font-weight:800;text-align:center;pointer-events:none;box-shadow:0 10px 30px rgba(0,0,0,.18)}
    .my60-feedback{margin-top:16px;padding-top:15px;border-top:1px solid rgba(21,25,23,.08)}.my60-feedback>b{display:block;font-size:13px;margin-bottom:9px}.my60-feedback div{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.my60-feedback button{border:0;border-radius:14px;padding:11px 7px;background:#f2f2ef;color:#606660;font-weight:800;font-size:11px}.my60-feedback button.saved{background:#dff0df;color:#397148}.my60-feedback small{display:block;color:#929792;font-size:9px;line-height:1.35;margin-top:8px}
    .my60-extra-skip{display:block;width:100%;border:0;border-radius:14px;padding:10px;background:#f3f1ed;color:#6d726e;font-size:11px;font-weight:800;margin-top:9px}
    @media(max-width:430px){.my60-extra-panel{padding:14px;border-radius:23px}.my60-quick-grid{gap:7px}.my60-quick-card{padding:11px;min-height:86px}.my60-extra-title b{font-size:18px}}
  `;document.head.appendChild(st);
}

function levelDescription(v){
  if(v==='easy')return '<b>Легко:</b> по одному подходу каждого упражнения, отдых чуть длиннее.';
  if(v==='active')return '<b>Бодро:</b> обычное число подходов, но короче паузы между ними.';
  return '<b>Обычно:</b> выполняется программа с указанными подходами и стандартным отдыхом.';
}

function controlsMarkup(){
  const v=intensity();
  return '<section class="my60-extra-panel" id="my60ExtraPanel"><div class="my60-extra-title"><div><span>Под тебя сегодня</span><b>Как тренируемся?</b></div><small>Можно менять каждый день</small></div>'+
    '<div class="my60-levels"><button class="'+(v==='easy'?'active':'')+'" onclick="My60Extra.level(\'easy\')">Легко</button><button class="'+(v==='normal'?'active':'')+'" onclick="My60Extra.level(\'normal\')">Обычно</button><button class="'+(v==='active'?'active':'')+'" onclick="My60Extra.level(\'active\')">Бодро</button></div>'+
    '<div class="my60-level-note">'+levelDescription(v)+'</div>'+
    '<div class="my60-quick-grid">'+quicks.map(q=>'<button class="my60-quick-card" onclick="My60Extra.quick(\''+q.id+'\')"><i>'+q.emoji+'</i><b>'+esc(q.title)+'</b><span>'+esc(q.sub)+'</span></button>').join('')+'</div></section>';
}

function injectControls(){
  const hub=document.querySelector('#workoutStudio .my60-v2-hub');if(!hub)return false;
  let panel=document.getElementById('my60ExtraPanel');
  if(panel){panel.outerHTML=controlsMarkup();return true}
  const lib=hub.querySelector('.my60-library2');
  if(lib)lib.insertAdjacentHTML('beforebegin',controlsMarkup());
  else hub.insertAdjacentHTML('beforeend',controlsMarkup());
  return true;
}
function renderControls(){injectControls()}

function showBanner(text){
  let b=document.getElementById('my60QuickBanner');if(!b){b=document.createElement('div');b.id='my60QuickBanner';b.className='my60-quick-banner';document.body.appendChild(b)}
  b.textContent=text;b.hidden=false;setTimeout(()=>{if(b)b.hidden=true},2400);
}

function startQuick(id){
  const q=quicks.find(x=>x.id===id);if(!q||!window.My60Library)return;
  write(QUICK,{id:q.id,type:q.type,max:q.max,rest:q.rest,title:q.title});
  lastAdjusted='';
  const original=window.My60Extra&&window.My60Extra._start;
  if(original)original(q.type);else My60Library.start(q.type);
  showBanner(q.title+' · короткий режим');
  setTimeout(processSession,80);
}

function finishSession(s){
  s.phase='finish';s.running=false;s.pending=null;saveSession(s);lastAdjusted='finish:'+Date.now();
  if(window.My60Extra&&My60Extra._resume)My60Extra._resume();
}

function processSession(){
  if(busy)return;
  const s=loadSession();if(!s)return;
  const q=quickMode(),lvl=intensity();
  if(s.phase==='finish')return;
  let changed=false;
  if(s.phase==='rest'){
    const signature=s.type+':'+s.e+':'+s.set+':'+JSON.stringify(s.pending||{});
    if(signature===lastAdjusted)return;
    const oneSet=!!q||lvl==='easy';
    const max=q?Math.max(1,+q.max||4):999;
    if(oneSet&&s.pending&&s.pending.e===s.e){
      if(s.e+1>=max)return finishSession(s);
      s.pending={e:s.e+1,set:0};changed=true;
    }
    if(q&&s.pending&&s.pending.e>=max)return finishSession(s);
    const target=q?Math.max(5,+q.rest||15):(lvl==='easy'?35:(lvl==='active'?15:25));
    if(s.left>target||s.left<=0){s.left=target;changed=true}
    lastAdjusted=signature;
  }
  if(q&&s.phase==='exercise'&&s.e>=Math.max(1,+q.max||4))return finishSession(s);
  if(changed){
    busy=true;saveSession(s);
    try{if(window.My60Extra&&My60Extra._resume)My60Extra._resume()}finally{setTimeout(()=>{busy=false},30)}
  }
}

function hookLibrary(){
  if(hooked||!window.My60Library)return false;
  hooked=true;
  const api=window.My60Library;
  const oStart=api.start.bind(api),oResume=api.resume.bind(api),oPrimary=api.primary.bind(api),oSkip=api.skip.bind(api),oSkipRest=api.skipRest.bind(api),oFinish=api.finish.bind(api),oClose=api.close.bind(api);
  window.My60Extra._start=oStart;window.My60Extra._resume=oResume;
  api.start=function(type){clearQuick();lastAdjusted='';oStart(type);setTimeout(processSession,40)};
  api.resume=function(){oResume();setTimeout(processSession,40)};
  api.primary=function(){oPrimary();setTimeout(processSession,30)};
  api.skip=function(){oSkip();setTimeout(processSession,30)};
  api.skipRest=function(){oSkipRest();setTimeout(processSession,30)};
  api.finish=function(){clearQuick();oFinish();setTimeout(injectControls,80)};
  api.close=function(){oClose();setTimeout(injectControls,80)};
  return true;
}

function feedbackMarkup(){
  return '<div class="my60-feedback"><b>Как тебе нагрузка?</b><div><button onclick="My60Extra.feedback(\'easy\',this)">Легко</button><button onclick="My60Extra.feedback(\'normal\',this)">В самый раз</button><button onclick="My60Extra.feedback(\'hard\',this)">Тяжело</button></div><small>Ответ сохранится и позже поможет точнее подбирать нагрузку.</small></div>';
}
function injectFeedback(){
  const f=document.querySelector('.my60-finish');if(!f||f.querySelector('.my60-feedback'))return false;
  const btn=f.querySelector(':scope > button');if(btn)btn.insertAdjacentHTML('beforebegin',feedbackMarkup());else f.insertAdjacentHTML('beforeend',feedbackMarkup());return true;
}
function feedback(v,btn){
  try{
    if(window.S){if(!S.workoutFeedback||typeof S.workoutFeedback!=='object')S.workoutFeedback={};const k=(typeof window.key==='function'?window.key():new Date().toISOString().slice(0,10));S.workoutFeedback[k]={level:v,at:Date.now()};if(typeof window.save==='function')window.save()}
  }catch(e){}
  const box=btn&&btn.parentElement;if(box)box.querySelectorAll('button').forEach(x=>x.classList.toggle('saved',x===btn));
}

function boot(){
  injectStyle();
  window.My60Extra={level:setIntensity,quick:startQuick,feedback:feedback,_start:null,_resume:null};
  let tries=0;const iv=setInterval(()=>{tries++;hookLibrary();injectControls();injectFeedback();if(tries>100)clearInterval(iv)},100);
  setInterval(processSession,400);
  const obs=new MutationObserver(()=>{hookLibrary();injectControls();injectFeedback()});obs.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
