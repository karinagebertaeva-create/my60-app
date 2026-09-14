(function(){
'use strict';

const SESSION='my60-workout-session-v3';
const FLOW='my60-workout-flow-v1';
const QUICK='my60-workout-quick-v1';
const LOCAL_HISTORY='my60-workout-history-v1';
const LOCAL_FAV='my60-workout-favorites-v1';
const ACTIVE='my60-workout-active-v1';
let hooked=false,raf=0;

const META={
 STRENGTH:{title:'Силовая · всё тело',minutes:32,zones:['Руки','Плечи','Кор','Ягодицы','Ноги']},
 LOWER:{title:'Силовая · ноги и ягодицы',minutes:28,zones:['Ягодицы','Ноги']},
 UPPER:{title:'Силовая · руки и плечи',minutes:25,zones:['Руки','Плечи','Спина']},
 GLUTES:{title:'Ягодицы · тонус',minutes:25,zones:['Ягодицы','Ноги']},
 CORE:{title:'Кор и талия',minutes:21,zones:['Пресс','Кор']},
 ABS:{title:'Пресс и живот',minutes:19,zones:['Пресс','Кор']},
 BACK:{title:'Здоровая спина',minutes:21,zones:['Спина','Кор']},
 POSTURE:{title:'Осанка и лопатки',minutes:18,zones:['Спина','Плечи']},
 PILATES:{title:'Пилатес · всё тело',minutes:23,zones:['Кор','Ягодицы','Спина']},
 PILATES_CORE:{title:'Пилатес · кор и талия',minutes:19,zones:['Пресс','Кор']},
 YOGA:{title:'Йога · мягкий поток',minutes:21,zones:['Спина','Ноги','Плечи']},
 YOGA_BACK:{title:'Йога · спина и плечи',minutes:18,zones:['Спина','Плечи']},
 PELVIC:{title:'Тазовое дно · мягко',minutes:15,zones:['Тазовое дно','Кор']},
 MOBILITY:{title:'Мобилизация всего тела',minutes:15,zones:['Всё тело']},
 CARDIO:{title:'Кардио · без прыжков',minutes:21,zones:['Ноги','Кор']},
 INTERVAL:{title:'Интервальная · без прыжков',minutes:18,zones:['Ноги','Кор','Ягодицы']},
 STRETCH:{title:'Растяжка всего тела',minutes:13,zones:['Всё тело']}
};
const TYPES=Object.keys(META);
const dayNames=['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ'];

function read(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
function write(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function key(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function saveApp(){try{if(typeof window.save==='function')window.save()}catch(e){}}
function history(){try{if(window.S&&Array.isArray(S.workoutHistory))return S.workoutHistory}catch(e){}return read(LOCAL_HISTORY)||[]}
function setHistory(v){v=v.slice(-180);try{if(window.S){S.workoutHistory=v;saveApp();return}}catch(e){}write(LOCAL_HISTORY,v)}
function favorites(){try{if(window.S&&Array.isArray(S.workoutFavorites))return S.workoutFavorites}catch(e){}return read(LOCAL_FAV)||[]}
function setFavorites(v){v=[...new Set(v.filter(x=>META[x]))];try{if(window.S){S.workoutFavorites=v;saveApp();return}}catch(e){}write(LOCAL_FAV,v)}
function active(){return read(ACTIVE)}
function setActive(v){write(ACTIVE,v)}
function session(){return read(SESSION)}
function flow(){return read(FLOW)}
function quick(){return read(QUICK)}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function record(type,opts){
 if(!META[type])return;
 opts=opts||{};
 const now=Date.now(),a=active(),s=session();
 const started=(a&&a.started)||s&&s.started||now-META[type].minutes*60000;
 const mins=Math.max(1,Math.min(180,Math.round((now-started)/60000)));
 const id=(a&&a.id)||String(started)+'-'+type;
 const h=history();
 if(h.some(x=>x.id===id))return;
 h.push({id:id,type:type,title:opts.title||META[type].title,date:key(),finishedAt:now,minutes:mins,quick:!!opts.quick,zones:META[type].zones});
 setHistory(h);renderPanel();
}

function hook(){
 if(hooked||!window.My60Library)return false;
 hooked=true;
 const api=window.My60Library;
 const oStart=api.start.bind(api),oFinish=api.finish.bind(api);
 api.start=function(type){
   const q=quick();
   if(!q||!['warm','cool'].includes(q.id))setActive({id:Date.now()+'-'+type,type:type,started:Date.now()});
   return oStart(type);
 };
 api.finish=function(){
   const f=flow(),s=session(),q=quick();
   let type=null,title=null,isQuick=false;
   if(f&&f.stage==='main'){type=f.mainType;}
   else if(!f&&q&&q.id&&!['warm','cool'].includes(q.id)){type=q.type||(s&&s.type);title=q.title;isQuick=true;}
   else if(!f&&!q&&s){type=s.type;}
   if(type)record(type,{title:title,quick:isQuick});
   const r=oFinish();
   if(!f||f.stage==='cooldown')setActive(null);
   return r;
 };
 return true;
}

function toggleFavorite(type){
 if(!META[type])return;
 const f=favorites(),i=f.indexOf(type);
 if(i>=0)f.splice(i,1);else f.push(type);
 setFavorites(f);renderPanel();decorateCards();renderManager();
}
function isFavorite(type){return favorites().indexOf(type)>=0}
function start(type){if(window.My60Library&&My60Library.start)My60Library.start(type)}
function preview(type){if(window.My60Library&&My60Library.preview)My60Library.preview(type)}

function lastDays(n){const out=[];for(let i=n-1;i>=0;i--){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-i);out.push(d)}return out}
function mergedDates(){
 const map={};
 history().forEach(r=>{if(r&&r.date){if(!map[r.date])map[r.date]=[];map[r.date].push(r)}});
 try{if(window.S&&S.workouts)Object.keys(S.workouts).forEach(d=>{if(!Array.isArray(S.workouts[d]))return;if(!map[d])map[d]=[];S.workouts[d].forEach(t=>{if(!map[d].some(x=>x.type===t))map[d].push({type:t,date:d,minutes:0,title:META[t]?META[t].title:t,zones:META[t]?META[t].zones:[]})})})}catch(e){}
 return map;
}
function streak(){
 const map=mergedDates();let n=0,d=new Date();d.setHours(0,0,0,0);
 if(!map[key(d)]){d.setDate(d.getDate()-1)}
 while(map[key(d)]&&map[key(d)].length){n++;d.setDate(d.getDate()-1)}
 return n;
}
function stats(){
 const days=lastDays(7),map=mergedDates();let sessions=0,minutes=0,zones={};
 days.forEach(d=>(map[key(d)]||[]).forEach(r=>{sessions++;minutes+=+r.minutes||0;(r.zones||META[r.type]&&META[r.type].zones||[]).forEach(z=>zones[z]=(zones[z]||0)+1)}));
 return {days:days,map:map,sessions:sessions,minutes:minutes,streak:streak(),zones:zones};
}

function bars(s){
 const max=Math.max(1,...s.days.map(d=>(s.map[key(d)]||[]).reduce((n,r)=>n+(+r.minutes||0),0)));
 return '<div class="my60-prog-bars">'+s.days.map(d=>{const m=(s.map[key(d)]||[]).reduce((n,r)=>n+(+r.minutes||0),0),h=m?Math.max(15,Math.round(m/max*100)):7;return '<div><i><b style="height:'+h+'%"></b></i><span>'+dayNames[d.getDay()]+'</span></div>'}).join('')+'</div>';
}
function zonesMarkup(s){const z=Object.entries(s.zones).sort((a,b)=>b[1]-a[1]).slice(0,6);if(!z.length)return '<div class="my60-zones-empty">После тренировок здесь появятся зоны, которые уже получили нагрузку.</div>';return '<div class="my60-zone-pills">'+z.map(x=>'<span>'+esc(x[0])+' <b>'+x[1]+'</b></span>').join('')+'</div>'}
function favMarkup(){const f=favorites();if(!f.length)return '<button class="my60-empty-fav" onclick="My60Progress.manage()">♡ Добавить любимые тренировки</button>';return '<div class="my60-fav-row">'+f.slice(0,5).map(t=>'<button onclick="My60Progress.preview(\''+t+'\')"><span>♥</span><b>'+esc(META[t].title)+'</b></button>').join('')+'</div>'}
function recentMarkup(){const h=history().slice().sort((a,b)=>(b.finishedAt||0)-(a.finishedAt||0)).slice(0,4);if(!h.length)return '<div class="my60-history-empty">Пока пусто. Первая завершённая тренировка появится здесь.</div>';return '<div class="my60-history-list">'+h.map(r=>'<div><i>✓</i><p><b>'+esc(r.title||META[r.type]&&META[r.type].title||r.type)+'</b><span>'+esc(r.date||'')+(r.minutes?' · '+r.minutes+' мин':'')+'</span></p></div>').join('')+'</div>'}

function panelMarkup(){
 const s=stats();
 return '<section class="my60-progress-panel" id="my60ProgressPanel">'+
 '<div class="my60-progress-head"><div><span>МОЯ АКТИВНОСТЬ</span><b>Прогресс тренировок</b></div><button onclick="My60Progress.history()">Вся история</button></div>'+
 '<div class="my60-progress-stats"><div><b>'+s.sessions+'</b><span>тренировок<br>за 7 дней</span></div><div><b>'+s.minutes+'</b><span>минут<br>за 7 дней</span></div><div><b>'+s.streak+'</b><span>дней<br>серия</span></div></div>'+bars(s)+
 '<div class="my60-progress-sub"><b>Что уже тренировалось</b>'+zonesMarkup(s)+'</div>'+
 '<div class="my60-progress-sub"><div class="my60-progress-subhead"><b>Избранное</b><button onclick="My60Progress.manage()">Настроить</button></div>'+favMarkup()+'</div>'+
 '<div class="my60-progress-sub"><div class="my60-progress-subhead"><b>Последние занятия</b><button onclick="My60Progress.history()">Смотреть все</button></div>'+recentMarkup()+'</div></section>';
}

function injectStyle(){
 if(document.getElementById('my60ProgressStyle'))return;
 const st=document.createElement('style');st.id='my60ProgressStyle';st.textContent=`
 .my60-progress-panel{background:#fff;border:1px solid rgba(21,25,23,.06);border-radius:27px;padding:16px;box-shadow:0 10px 30px rgba(23,31,27,.05)}.my60-progress-head,.my60-progress-subhead{display:flex;justify-content:space-between;gap:10px;align-items:center}.my60-progress-head span{display:block;font-size:10px;letter-spacing:.12em;color:#b0646c;font-weight:900}.my60-progress-head b{display:block;font-size:20px;letter-spacing:-.03em;margin-top:3px}.my60-progress-head button,.my60-progress-subhead button{border:0;background:#f2f2ef;border-radius:999px;padding:8px 10px;color:#737974;font-size:9px;font-weight:850}.my60-progress-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:13px}.my60-progress-stats>div{background:#f7f7f4;border-radius:17px;padding:11px}.my60-progress-stats b{display:block;font-size:22px;line-height:1}.my60-progress-stats span{display:block;font-size:9px;line-height:1.3;color:#8c918d;margin-top:5px}.my60-prog-bars{height:90px;display:grid;grid-template-columns:repeat(7,1fr);gap:6px;align-items:end;margin-top:13px}.my60-prog-bars>div{text-align:center}.my60-prog-bars i{height:66px;display:flex;align-items:end;justify-content:center;border-radius:9px;background:#f2f2ef;overflow:hidden}.my60-prog-bars i b{display:block;width:100%;background:linear-gradient(#d79299,#c76f77);border-radius:8px 8px 0 0;min-height:4px}.my60-prog-bars span{font-size:8px;color:#929792;font-weight:800}.my60-progress-sub{border-top:1px solid rgba(21,25,23,.07);padding-top:13px;margin-top:13px}.my60-progress-sub>b,.my60-progress-subhead>b{font-size:12px}.my60-zone-pills{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.my60-zone-pills span{padding:7px 9px;border-radius:999px;background:#f4efeb;color:#6f625d;font-size:9px}.my60-zone-pills b{color:#ad656d}.my60-zones-empty,.my60-history-empty{margin-top:8px;color:#929792;font-size:10px;line-height:1.4}.my60-empty-fav{width:100%;border:1px dashed #d7d7d1;background:#fafaf8;border-radius:15px;padding:11px;color:#7a7f7b;font-size:10px;font-weight:800;margin-top:9px}.my60-fav-row{display:flex;gap:7px;overflow:auto;scrollbar-width:none;margin-top:9px}.my60-fav-row::-webkit-scrollbar{display:none}.my60-fav-row button{flex:0 0 150px;border:0;border-radius:16px;padding:11px;text-align:left;background:#faf1ef;color:#343936}.my60-fav-row span{color:#c76f77;font-size:13px}.my60-fav-row b{display:block;font-size:10px;line-height:1.25;margin-top:5px}.my60-history-list{display:grid;gap:7px;margin-top:9px}.my60-history-list>div{display:flex;gap:9px;align-items:center;padding:9px 10px;border-radius:14px;background:#f8f8f5}.my60-history-list i{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#e4f1e5;color:#4d7c57;font-style:normal;font-size:10px}.my60-history-list p{margin:0;min-width:0}.my60-history-list b{display:block;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.my60-history-list span{display:block;font-size:9px;color:#929792;margin-top:2px}.my60-card2{position:relative}.my60-fav-heart{position:absolute;top:8px;right:8px;width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.92);box-shadow:0 3px 10px rgba(0,0,0,.08);color:#a6aaa7;font-size:14px;z-index:2}.my60-fav-heart.on{color:#c76f77;background:#fff0ef}.my60-progress-modal{position:fixed;inset:0;z-index:10080;background:rgba(18,22,20,.43);display:none;align-items:end;justify-content:center}.my60-progress-modal.open{display:flex}.my60-progress-sheet{width:min(560px,100%);max-height:82vh;overflow:auto;background:#fbfaf7;border-radius:28px 28px 0 0;padding:18px 16px calc(22px + env(safe-area-inset-bottom));box-shadow:0 -15px 40px rgba(0,0,0,.17)}.my60-progress-sheet-head{display:flex;justify-content:space-between;align-items:center;position:sticky;top:-18px;background:#fbfaf7;padding:10px 0 12px;z-index:2}.my60-progress-sheet-head b{font-size:20px}.my60-progress-sheet-head button{border:0;width:34px;height:34px;border-radius:50%;background:#ecece8;font-size:20px}.my60-fav-manage{display:grid;grid-template-columns:1fr 1fr;gap:8px}.my60-fav-manage button{border:1px solid rgba(21,25,23,.07);border-radius:17px;background:#fff;padding:12px;text-align:left;color:#313733;min-height:75px}.my60-fav-manage button.on{background:#fff0ef;border-color:#d8959b}.my60-fav-manage b{display:block;font-size:11px;line-height:1.25}.my60-fav-manage span{display:block;font-size:18px;color:#c76f77;margin-bottom:5px}.my60-full-history{display:grid;gap:8px}.my60-full-history .row{display:flex;align-items:center;gap:10px;padding:11px;border-radius:16px;background:#fff}.my60-full-history i{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#e6f2e7;color:#4b7a55;font-style:normal}.my60-full-history p{margin:0;flex:1}.my60-full-history b{display:block;font-size:11px}.my60-full-history span{display:block;color:#929792;font-size:9px;margin-top:3px}@media(max-width:430px){.my60-progress-panel{padding:14px;border-radius:23px}.my60-progress-head b{font-size:18px}.my60-progress-stats>div{padding:10px}.my60-progress-stats b{font-size:20px}}
 `;document.head.appendChild(st);
}

function injectPanel(){const hub=document.querySelector('#workoutStudio .my60-v2-hub');if(!hub)return false;let p=document.getElementById('my60ProgressPanel');if(!p){const lib=hub.querySelector('.my60-library2');if(lib)lib.insertAdjacentHTML('beforebegin',panelMarkup());else hub.insertAdjacentHTML('beforeend',panelMarkup())}return true}
function renderPanel(){const p=document.getElementById('my60ProgressPanel');if(p)p.outerHTML=panelMarkup();else injectPanel()}

function typeFromCard(card){const s=card.getAttribute('onclick')||'';const m=s.match(/(?:preview|start)\('([^']+)'\)/);return m&&META[m[1]]?m[1]:null}
function decorateCards(){document.querySelectorAll('#workoutStudio .my60-card2').forEach(card=>{const t=typeFromCard(card);if(!t)return;let h=card.querySelector('.my60-fav-heart');if(!h){h=document.createElement('span');h.className='my60-fav-heart';h.setAttribute('role','button');h.setAttribute('aria-label','Избранное');h.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleFavorite(t)});card.appendChild(h)}h.textContent=isFavorite(t)?'♥':'♡';h.classList.toggle('on',isFavorite(t))})}

function modal(){let m=document.getElementById('my60ProgressModal');if(!m){m=document.createElement('div');m.id='my60ProgressModal';m.className='my60-progress-modal';m.addEventListener('click',e=>{if(e.target===m)closeModal()});document.body.appendChild(m)}return m}
function closeModal(){const m=document.getElementById('my60ProgressModal');if(m)m.classList.remove('open');document.body.classList.remove('my60-workout-open')}
function manage(){const m=modal();m.innerHTML='<div class="my60-progress-sheet"><div class="my60-progress-sheet-head"><b>Избранные тренировки</b><button onclick="My60Progress.close()">×</button></div><div id="my60FavManage"></div></div>';m.classList.add('open');document.body.classList.add('my60-workout-open');renderManager()}
function renderManager(){const box=document.getElementById('my60FavManage');if(!box)return;const f=favorites();box.innerHTML='<div class="my60-fav-manage">'+TYPES.filter(t=>!['MOBILITY'].includes(t)).map(t=>'<button class="'+(f.includes(t)?'on':'')+'" onclick="My60Progress.toggle(\''+t+'\')"><span>'+(f.includes(t)?'♥':'♡')+'</span><b>'+esc(META[t].title)+'</b></button>').join('')+'</div>'}
function showHistory(){const h=history().slice().sort((a,b)=>(b.finishedAt||0)-(a.finishedAt||0));const m=modal();m.innerHTML='<div class="my60-progress-sheet"><div class="my60-progress-sheet-head"><b>История тренировок</b><button onclick="My60Progress.close()">×</button></div><div class="my60-full-history">'+(h.length?h.map(r=>'<div class="row"><i>✓</i><p><b>'+esc(r.title||META[r.type]&&META[r.type].title||r.type)+'</b><span>'+esc(r.date||'')+(r.minutes?' · '+r.minutes+' мин':'')+(r.quick?' · короткая':'')+'</span></p><button class="my60-history-repeat" onclick="My60Progress.preview(\''+r.type+'\')">Повторить</button></div>').join(''):'<div class="my60-history-empty">История пока пустая.</div>')+'</div></div>';m.classList.add('open');document.body.classList.add('my60-workout-open')}

function enhance(){injectPanel();decorateCards()}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;hook();enhance()})}
function boot(){injectStyle();window.My60Progress={toggle:toggleFavorite,manage:manage,history:showHistory,close:closeModal,start:start,preview:preview};let tries=0;const iv=setInterval(()=>{tries++;hook();enhance();if(tries>120)clearInterval(iv)},100);const obs=new MutationObserver(schedule);obs.observe(document.body,{childList:true,subtree:true});document.addEventListener('click',()=>setTimeout(schedule,60))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
