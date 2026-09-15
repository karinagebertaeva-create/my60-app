(function(){
'use strict';

const STORE='my60-workout-challenges-v1';
const PENDING='my60-workout-challenge-pending-v1';
let hooked=false;

const PROGRAMS={
  abs30:{
    title:'Живот · 30 дней',emoji:'◎',tag:'Кор + талия',note:'Укрепляем глубокий кор и мышцы живота. Локально сжечь жир на животе упражнениями нельзя — изменение объёмов зависит и от общего снижения веса.',
    cycle:[
      ['ABS','Пресс без прыжков'],['PILATES_CORE','Пилатес · кор'],[null,'Восстановление'],['CORE','Кор и талия'],['ABS','Пресс без прыжков'],['YOGA','Йога и дыхание'],[null,'Отдых']
    ]
  },
  glutes30:{
    title:'Ягодицы · 30 дней',emoji:'◡',tag:'Ягодицы + ноги',note:'Чередуем силовую нагрузку и восстановление, чтобы мышцы успевали отдыхать.',
    cycle:[
      ['GLUTES','Ягодицы · тонус'],['LOWER','Ноги и ягодицы'],['STRETCH','Растяжка'],['GLUTES','Ягодицы · тонус'],['PILATES','Пилатес · всё тело'],['MOBILITY','Мобилизация'],[null,'Отдых']
    ]
  },
  posture:{
    title:'Красивая осанка',emoji:'↟',tag:'Спина + лопатки',note:'Работаем со спиной, лопатками, грудным отделом и мягкой мобильностью без резких движений.',
    cycle:[
      ['POSTURE','Осанка и лопатки'],['BACK','Здоровая спина'],['YOGA_BACK','Йога · спина'],['POSTURE','Осанка и лопатки'],['PILATES','Пилатес'],['STRETCH','Мягкая растяжка'],[null,'Отдых']
    ]
  },
  pilatesSlim:{
    title:'Пилатес для похудения',emoji:'◌',tag:'Тонус + движение',note:'Пилатес помогает регулярно двигаться, укреплять тело и повышать общий расход энергии. Снижение веса в первую очередь зависит от общего энергетического баланса.',
    cycle:[
      ['PILATES','Пилатес · всё тело'],['PILATES_CORE','Пилатес · кор'],['CARDIO','Кардио без прыжков'],['PILATES','Пилатес · всё тело'],['MOBILITY','Мобилизация'],['PILATES_CORE','Пилатес · кор'],[null,'Отдых']
    ]
  },
  eveningYoga:{
    title:'Йога вечером',emoji:'☾',tag:'Расслабление',note:'Мягкая вечерняя практика: дыхание, спина, таз и растяжка. Без задачи «сжечь максимум калорий».',
    cycle:[
      ['YOGA','Мягкий поток'],['YOGA_BACK','Спина и плечи'],['STRETCH','Растяжка'],['YOGA','Мягкий поток'],['MOBILITY','Мобилизация'],['YOGA_BACK','Спина и плечи'],[null,'Отдых']
    ]
  }
};

function read(key,def){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v==null?def:v}catch(e){return def}}
function write(key,v){try{localStorage.setItem(key,JSON.stringify(v))}catch(e){}}
function state(){const s=read(STORE,{programs:{}});if(!s.programs)s.programs={};return s}
function pstate(id){const s=state();if(!s.programs[id])s.programs[id]={startedAt:null,done:[]};return {root:s,p:s.programs[id]}}
function saveProgram(id,p,root){root.programs[id]=p;write(STORE,root)}
function dayData(id,n){const p=PROGRAMS[id];const base=p.cycle[(n-1)%p.cycle.length];return {n,type:base[0],label:base[1]}}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function todayIndex(startedAt){if(!startedAt)return 1;const a=new Date(startedAt+'T00:00:00'),b=new Date();b.setHours(0,0,0,0);return Math.max(1,Math.min(30,Math.floor((b-a)/86400000)+1))}
function fmtDate(v){if(!v)return'';return new Date(v+'T00:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'})}

function injectStyle(){
  if(document.getElementById('my60ChallengeStyle'))return;
  const st=document.createElement('style');st.id='my60ChallengeStyle';st.textContent=`
  .my60-challenges{background:#fff;border:1px solid rgba(21,25,23,.06);border-radius:27px;padding:16px;box-shadow:0 10px 30px rgba(23,31,27,.05);margin-top:12px}
  .my60-challenges-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:12px}.my60-challenges-head span{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#929792;font-weight:850}.my60-challenges-head b{display:block;font-size:20px;letter-spacing:-.03em;margin-top:3px}.my60-challenges-head small{font-size:10px;color:#969b97;text-align:right;max-width:110px}
  .my60-challenge-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.my60-challenge-card{border:1px solid rgba(21,25,23,.07);background:linear-gradient(155deg,#fbfbf9,#f6f4f1);border-radius:20px;padding:13px;text-align:left;color:#222825;min-height:130px;position:relative;overflow:hidden}.my60-challenge-card:before{content:"";position:absolute;width:86px;height:86px;border-radius:50%;right:-28px;top:-28px;background:rgba(191,111,120,.08)}.my60-challenge-card i{display:grid;place-items:center;width:34px;height:34px;border-radius:11px;background:#f1e5e4;color:#a75d66;font-style:normal;font-size:18px;margin-bottom:10px}.my60-challenge-card b{display:block;font-size:14px;line-height:1.15;max-width:150px}.my60-challenge-card span{display:block;font-size:9px;color:#8b918d;margin-top:5px}.my60-challenge-card .progress{height:5px;background:#ebeae6;border-radius:99px;margin-top:11px;overflow:hidden}.my60-challenge-card .progress em{display:block;height:100%;background:#b86a73;border-radius:99px}.my60-challenge-card small{display:block;font-size:9px;color:#7d827e;margin-top:5px}.my60-challenge-card.active{border-color:rgba(184,106,115,.38);box-shadow:0 8px 22px rgba(184,106,115,.09)}
  .my60-challenge-sheet{position:fixed;inset:0;z-index:10060;background:rgba(12,16,14,.48);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:flex-end}.my60-challenge-sheet[hidden]{display:none!important}.my60-challenge-inner{width:100%;max-width:760px;margin:auto;background:#fafaf8;border-radius:30px 30px 0 0;padding:20px 16px calc(22px + env(safe-area-inset-bottom));max-height:91vh;overflow:auto;box-shadow:0 -24px 70px rgba(0,0,0,.2)}
  .my60-challenge-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.my60-challenge-top .icon{display:grid;place-items:center;width:42px;height:42px;border-radius:14px;background:#f1e5e4;color:#a75d66;font-size:21px}.my60-challenge-top h3{margin:4px 0 3px;font-size:23px;letter-spacing:-.04em}.my60-challenge-top p{margin:0;color:#8b918d;font-size:11px}.my60-challenge-close{border:0;width:36px;height:36px;border-radius:12px;background:#ecece8;color:#666d68;font-size:20px}
  .my60-challenge-note{font-size:10px;line-height:1.5;color:#777e79;background:#f2f0ec;border-radius:15px;padding:11px 12px;margin:13px 0}.my60-challenge-actions{display:grid;grid-template-columns:1.25fr .75fr;gap:8px;margin:12px 0}.my60-challenge-actions button{border:0;border-radius:15px;padding:12px 10px;font-size:11px;font-weight:850}.my60-challenge-start{background:#171d1a;color:#fff}.my60-challenge-reset{background:#ecece8;color:#666d68}
  .my60-days{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}.my60-day{border:1px solid rgba(21,25,23,.07);background:#fff;border-radius:15px;padding:9px 4px;text-align:center;color:#434945;min-height:66px;position:relative}.my60-day b{display:block;font-size:12px}.my60-day span{display:block;font-size:8px;line-height:1.15;color:#90958f;margin-top:4px}.my60-day.done{background:#e9f3e9;border-color:#cfe5cf;color:#397148}.my60-day.current{outline:2px solid rgba(184,106,115,.48);outline-offset:1px}.my60-day.rest{background:#f3f2ef}.my60-day .check{position:absolute;right:5px;top:4px;font-size:9px;color:#3d7c4c}
  .my60-day-detail{margin-top:13px;border:1px solid rgba(21,25,23,.07);background:#fff;border-radius:20px;padding:14px}.my60-day-detail .eyebrow{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#9a9f9b;font-weight:850}.my60-day-detail h4{margin:5px 0 5px;font-size:19px}.my60-day-detail p{font-size:10px;color:#858b86;line-height:1.45;margin:0 0 12px}.my60-day-detail .buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px}.my60-day-detail button{border:0;border-radius:14px;padding:11px 8px;font-weight:850;font-size:11px}.my60-day-detail .go{background:#171d1a;color:#fff}.my60-day-detail .mark{background:#eee9e7;color:#82545a}.my60-day-detail .unmark{background:#eef1ed;color:#606a61}
  body.my60-challenge-open{overflow:hidden}
  @media(max-width:430px){.my60-challenges{padding:14px;border-radius:23px}.my60-challenge-grid{gap:7px}.my60-challenge-card{padding:12px;min-height:125px}.my60-challenges-head b{font-size:18px}.my60-days{grid-template-columns:repeat(5,1fr);gap:6px}.my60-challenge-inner{padding-left:13px;padding-right:13px}}
  `;document.head.appendChild(st);
}

function programProgress(id){const {p}=pstate(id);return Array.isArray(p.done)?p.done.length:0}
function panelMarkup(){
  return '<section class="my60-challenges" id="my60Challenges"><div class="my60-challenges-head"><div><span>Готовые программы</span><b>Выбери свою цель</b></div><small>30 дней · с восстановлением</small></div><div class="my60-challenge-grid">'+Object.entries(PROGRAMS).map(([id,p])=>{
    const {p:ps}=pstate(id),done=programProgress(id),cur=todayIndex(ps.startedAt),active=!!ps.startedAt;
    return '<button class="my60-challenge-card '+(active?'active':'')+'" onclick="My60Challenges.open(\''+id+'\')"><i>'+p.emoji+'</i><b>'+esc(p.title)+'</b><span>'+esc(p.tag)+'</span><div class="progress"><em style="width:'+Math.round(done/30*100)+'%"></em></div><small>'+(active?'День '+cur+' · ':'')+done+' из 30 выполнено</small></button>';
  }).join('')+'</div></section>';
}
function ensurePanel(){
  if(document.getElementById('my60Challenges'))return true;
  const hub=document.querySelector('#workoutStudio .my60-v2-hub')||document.getElementById('workoutStudio');if(!hub)return false;
  const extra=document.getElementById('my60ExtraPanel');
  if(extra)extra.insertAdjacentHTML('afterend',panelMarkup());
  else{const lib=hub.querySelector('.my60-library2');if(lib)lib.insertAdjacentHTML('beforebegin',panelMarkup());else hub.insertAdjacentHTML('afterbegin',panelMarkup())}
  return true;
}
function refreshPanel(){const old=document.getElementById('my60Challenges');if(old)old.outerHTML=panelMarkup();else ensurePanel()}

function ensureSheet(){
  let sheet=document.getElementById('my60ChallengeSheet');if(sheet)return sheet;
  sheet=document.createElement('div');sheet.id='my60ChallengeSheet';sheet.className='my60-challenge-sheet';sheet.hidden=true;sheet.addEventListener('click',e=>{if(e.target===sheet)close()});document.body.appendChild(sheet);return sheet;
}
function daysMarkup(id,selected){
  const {p}=pstate(id),done=new Set(p.done||[]),cur=todayIndex(p.startedAt);
  return Array.from({length:30},(_,i)=>{const d=dayData(id,i+1),isDone=done.has(i+1);return '<button class="my60-day '+(isDone?'done ':'')+(cur===i+1?'current ':'')+(!d.type?'rest':'')+'" onclick="My60Challenges.select(\''+id+'\','+(i+1)+')">'+(isDone?'<i class="check">✓</i>':'')+'<b>'+(i+1)+'</b><span>'+esc(d.label)+'</span></button>'}).join('');
}
function detailMarkup(id,n){
  const d=dayData(id,n),{p}=pstate(id),done=(p.done||[]).includes(n);
  if(!d.type)return '<div class="my60-day-detail"><div class="eyebrow">День '+n+' · восстановление</div><h4>'+esc(d.label)+'</h4><p>Сегодня можно сделать спокойную прогулку, немного подвигаться и дать мышцам восстановиться.</p><div class="buttons"><button class="mark" onclick="My60Challenges.mark(\''+id+'\','+n+')">'+(done?'Выполнено ✓':'Отметить день')+'</button><button class="unmark" onclick="My60Challenges.close()">Закрыть</button></div></div>';
  return '<div class="my60-day-detail"><div class="eyebrow">День '+n+' · тренировка</div><h4>'+esc(d.label)+'</h4><p>Откроем упражнения, технику и затем можно сразу начать занятие.</p><div class="buttons"><button class="go" onclick="My60Challenges.go(\''+id+'\','+n+',\''+d.type+'\')">▶ Открыть тренировку</button><button class="'+(done?'unmark':'mark')+'" onclick="My60Challenges.mark(\''+id+'\','+n+')">'+(done?'Снять отметку':'Отметить выполнено')+'</button></div></div>';
}
function renderSheet(id,selected){
  const p=PROGRAMS[id];if(!p)return;const {root,p:ps}=pstate(id);selected=selected||todayIndex(ps.startedAt);
  const sheet=ensureSheet();sheet.dataset.program=id;sheet.dataset.day=String(selected);
  sheet.innerHTML='<div class="my60-challenge-inner"><div class="my60-challenge-top"><div style="display:flex;gap:11px"><div class="icon">'+p.emoji+'</div><div><p>'+esc(p.tag)+'</p><h3>'+esc(p.title)+'</h3><p>'+(ps.startedAt?'Старт '+fmtDate(ps.startedAt)+' · день '+todayIndex(ps.startedAt):'Можно начать с сегодняшнего дня')+'</p></div></div><button class="my60-challenge-close" onclick="My60Challenges.close()">×</button></div><div class="my60-challenge-note">'+esc(p.note)+'</div><div class="my60-challenge-actions"><button class="my60-challenge-start" onclick="My60Challenges.begin(\''+id+'\')">'+(ps.startedAt?'Продолжить с дня '+todayIndex(ps.startedAt):'Начать программу')+'</button><button class="my60-challenge-reset" onclick="My60Challenges.reset(\''+id+'\')">Сбросить</button></div><div class="my60-days">'+daysMarkup(id,selected)+'</div>'+detailMarkup(id,selected)+'</div>';
  sheet.hidden=false;document.body.classList.add('my60-challenge-open');
  if(!ps.startedAt){saveProgram(id,ps,root)}
}
function open(id){renderSheet(id)}
function close(){const s=document.getElementById('my60ChallengeSheet');if(s)s.hidden=true;document.body.classList.remove('my60-challenge-open')}
function select(id,n){renderSheet(id,n);setTimeout(()=>{const s=document.getElementById('my60ChallengeSheet');if(s){const d=s.querySelector('.my60-day-detail');if(d)d.scrollIntoView({behavior:'smooth',block:'nearest'})}},20)}
function begin(id){const {root,p}=pstate(id);if(!p.startedAt)p.startedAt=new Date().toISOString().slice(0,10);saveProgram(id,p,root);refreshPanel();renderSheet(id,todayIndex(p.startedAt))}
function reset(id){if(!confirm('Сбросить прогресс этой программы?'))return;const s=state();s.programs[id]={startedAt:null,done:[]};write(STORE,s);refreshPanel();renderSheet(id,1)}
function mark(id,n){const {root,p}=pstate(id);if(!p.startedAt)p.startedAt=new Date().toISOString().slice(0,10);const set=new Set(p.done||[]);set.has(n)?set.delete(n):set.add(n);p.done=[...set].sort((a,b)=>a-b);saveProgram(id,p,root);refreshPanel();renderSheet(id,n)}
function go(id,n,type){
  const {root,p}=pstate(id);if(!p.startedAt)p.startedAt=new Date().toISOString().slice(0,10);saveProgram(id,p,root);write(PENDING,{id,day:n,type,at:Date.now()});close();refreshPanel();
  if(window.My60Library){if(typeof My60Library.preview==='function')My60Library.preview(type);else if(typeof My60Library.start==='function')My60Library.start(type)}
}
function completePending(){const q=read(PENDING,null);if(!q)return;const {root,p}=pstate(q.id);const set=new Set(p.done||[]);set.add(+q.day);p.done=[...set].sort((a,b)=>a-b);saveProgram(q.id,p,root);localStorage.removeItem(PENDING);setTimeout(refreshPanel,100)}

function hookLibrary(){
  if(hooked||!window.My60Library||typeof My60Library.finish!=='function')return false;
  hooked=true;const old=My60Library.finish.bind(My60Library);
  My60Library.finish=function(){const r=old();completePending();setTimeout(ensurePanel,120);return r};
  return true;
}
function boot(){
  injectStyle();ensureSheet();window.My60Challenges={open,close,select,begin,reset,mark,go};
  let tries=0;const iv=setInterval(()=>{tries++;const a=ensurePanel(),b=hookLibrary();if((a&&b)||tries>40)clearInterval(iv)},250);
  document.addEventListener('my60:workouts-ready',()=>{setTimeout(()=>{ensurePanel();hookLibrary()},80)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();