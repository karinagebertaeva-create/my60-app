(function(){
'use strict';

const FLOW='my60-workout-flow-v1';
const SESSION='my60-workout-session-v3';
let hooked=false,internal=false,raf=0;

const activeTypes=['STRENGTH','LOWER','UPPER','GLUTES','CORE','ABS','BACK','POSTURE','CARDIO','INTERVAL'];
const names={STRENGTH:'Силовая · всё тело',LOWER:'Ноги и ягодицы',UPPER:'Руки и плечи',GLUTES:'Ягодицы',CORE:'Кор и талия',ABS:'Пресс и живот',BACK:'Здоровая спина',POSTURE:'Осанка',CARDIO:'Кардио',INTERVAL:'Интервальная',PILATES:'Пилатес',PILATES_CORE:'Пилатес · кор',YOGA:'Йога',YOGA_BACK:'Йога · спина',PELVIC:'Тазовое дно'};
const focus={
 STRENGTH:{zones:['shoulders','arms','core','glutes','legs'],label:'всё тело · ноги · ягодицы · спина · руки'},
 LOWER:{zones:['glutes','legs'],label:'ягодицы · бёдра · икры'},
 UPPER:{zones:['shoulders','arms','back'],label:'плечи · руки · верх спины'},
 GLUTES:{zones:['glutes','legs'],label:'ягодицы · бёдра'},
 CORE:{zones:['core'],label:'глубокий кор · талия'},
 ABS:{zones:['core'],label:'пресс · низ живота · талия'},
 BACK:{zones:['back','core'],label:'спина · лопатки · кор'},
 POSTURE:{zones:['shoulders','back','core'],label:'лопатки · плечи · осанка'},
 CARDIO:{zones:['arms','core','legs'],label:'ноги · кор · всё тело'},
 INTERVAL:{zones:['arms','core','glutes','legs'],label:'всё тело · ноги · кор'},
 PILATES:{zones:['core','glutes','back'],label:'кор · ягодицы · спина'},
 PILATES_CORE:{zones:['core'],label:'глубокий кор · талия'},
 YOGA:{zones:['shoulders','back','core','legs'],label:'спина · таз · ноги · плечи'},
 YOGA_BACK:{zones:['shoulders','back'],label:'спина · плечи · грудной отдел'},
 PELVIC:{zones:['pelvic','core'],label:'тазовое дно · глубокий кор'}
};

function read(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
function write(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function flow(){return read(FLOW)}
function session(){return read(SESSION)}
function save(v){write(FLOW,v)}
function quickActive(){try{return !!read('my60-workout-quick-v1')}catch(e){return false}}

function bodySvg(type){
 const f=focus[type]||focus.STRENGTH,z=f.zones;
 const on=n=>z.indexOf(n)>=0?' on':'';
 return '<svg viewBox="0 0 110 180" aria-label="Карта мышц"><circle class="bm-head" cx="55" cy="18" r="12"/>'+
 '<path class="bm-part bm-shoulders'+on('shoulders')+'" d="M36 40 Q55 31 74 40 L69 56 H41Z"/>'+
 '<path class="bm-part bm-back'+on('back')+'" d="M42 54 H68 L66 91 H44Z"/>'+
 '<path class="bm-part bm-core'+on('core')+'" d="M45 66 H65 L64 104 H46Z"/>'+
 '<path class="bm-part bm-pelvic'+on('pelvic')+'" d="M45 96 Q55 106 65 96 L64 116 H46Z"/>'+
 '<path class="bm-part bm-arms'+on('arms')+'" d="M34 43 L24 83 L31 87 L43 54ZM76 43 L86 83 L79 87 L67 54Z"/>'+
 '<path class="bm-part bm-glutes'+on('glutes')+'" d="M46 106 Q55 114 64 106 L66 124 H44Z"/>'+
 '<path class="bm-part bm-legs'+on('legs')+'" d="M45 120 L39 169 H49 L55 127 L61 169 H71 L65 120Z"/>'+
 '</svg>';
}

function injectStyle(){
 if(document.getElementById('my60FlowStyle'))return;
 const st=document.createElement('style');st.id='my60FlowStyle';st.textContent=`
 .my60-body-focus{display:grid;grid-template-columns:78px 1fr;gap:12px;align-items:center;margin-top:13px;padding:10px 12px;border-radius:17px;background:rgba(255,255,255,.09)}
 .my60-body-focus svg{width:72px;height:112px}.bm-head{fill:#d9d9d3}.bm-part{fill:#d9d9d3;stroke:#f6f3ee;stroke-width:1.5}.bm-part.on{fill:#d98b93}.my60-body-focus span{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.56);font-weight:900}.my60-body-focus b{display:block;font-size:13px;line-height:1.3;margin-top:4px;color:#fff}.my60-body-focus small{display:block;font-size:10px;line-height:1.4;color:rgba(255,255,255,.62);margin-top:5px}
 .my60-flow-strip{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:6px;align-items:center;margin-top:12px}.my60-flow-strip i{height:1px;background:rgba(255,255,255,.18)}.my60-flow-step{text-align:center;color:rgba(255,255,255,.46)}.my60-flow-step b{display:grid;place-items:center;width:24px;height:24px;margin:0 auto 4px;border-radius:50%;background:rgba(255,255,255,.10);font-size:10px}.my60-flow-step span{font-size:8px;font-weight:850}.my60-flow-step.active{color:#fff}.my60-flow-step.active b{background:#c76f77}.my60-flow-step.done b{background:#6f9f79;color:#fff}.my60-flow-skip{width:100%;margin-top:9px;border:0;border-radius:13px;padding:10px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.74);font-size:10px;font-weight:800}
 .my60-player-flow{margin:0 0 10px;padding:10px 12px;border-radius:16px;background:#fff;border:1px solid rgba(21,25,23,.06);box-shadow:0 7px 20px rgba(23,31,27,.05)}.my60-player-flow-top{display:flex;justify-content:space-between;align-items:center;gap:10px}.my60-player-flow-top b{font-size:11px}.my60-player-flow-top span{font-size:9px;color:#8c918d}.my60-player-flow-line{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:8px}.my60-player-flow-line i{height:5px;border-radius:99px;background:#e6e6e1}.my60-player-flow-line i.done{background:#79a783}.my60-player-flow-line i.active{background:#c76f77}.my60-player-flow button{width:100%;margin-top:8px;border:0;border-radius:12px;padding:9px;background:#f2f2ef;color:#676d68;font-size:10px;font-weight:800}
 .my60-focus-player{display:flex;gap:8px;align-items:center;margin:8px 0 0;padding:8px 10px;border-radius:13px;background:#f7f4f0}.my60-focus-player svg{width:38px;height:62px}.my60-focus-player b{font-size:10px;line-height:1.3}.my60-focus-player span{display:block;color:#8d928e;font-size:9px;margin-top:2px}
 @media(max-width:430px){.my60-body-focus{grid-template-columns:68px 1fr;padding:9px 10px}.my60-body-focus svg{width:64px;height:102px}.my60-player-flow{margin-bottom:8px}}
 `;document.head.appendChild(st);
}

function stageIndex(s){return s==='warmup'?0:s==='main'?1:2}
function stageTitle(s){return s==='warmup'?'Разминка · 1 из 3':s==='main'?'Основная часть · 2 из 3':'Заминка · 3 из 3'}
function stageName(s){return s==='warmup'?'Разминка':s==='main'?'Тренировка':'Заминка'}
function strip(stage){const i=stageIndex(stage);return '<div class="my60-flow-strip">'+[0,1,2].map((x,n)=>'<div class="my60-flow-step '+(n<i?'done ':n===i?'active':'')+'"><b>'+(n<i?'✓':n+1)+'</b><span>'+['Разминка','Тренировка','Заминка'][n]+'</span></div>'+(n<2?'<i></i>':'')).join('')+'</div>'}

function injectTodayFocus(){
 const card=document.querySelector('.my60-smart-today');if(!card)return false;
 const h2=card.querySelector('h2');if(!h2)return false;
 let type=null;
 const start=card.querySelector('.my60-smart-actions .main');
 if(start){const m=(start.getAttribute('onclick')||'').match(/start\('([^']+)'\)/);if(m)type=m[1]}
 if(!type)return false;
 const f=focus[type]||focus.STRENGTH;
 let box=card.querySelector('.my60-body-focus');
 const html=bodySvg(type)+'<div><span>Сегодня работаем</span><b>'+f.label+'</b><small>'+(activeTypes.indexOf(type)>=0?'Разминка 4–5 мин → основная часть → заминка 6–8 мин':'Мягкая самостоятельная практика без обязательной разминки')+'</small></div>';
 if(!box){box=document.createElement('div');box.className='my60-body-focus';const note=card.querySelector('.my60-smart-note');(note||card.querySelector('.my60-smart-actions')||h2).insertAdjacentElement(note?'afterend':'beforebegin',box)}
 box.innerHTML=html;
 if(activeTypes.indexOf(type)>=0){let flowEl=card.querySelector('.my60-flow-static');if(!flowEl){flowEl=document.createElement('div');flowEl.className='my60-flow-static';box.insertAdjacentElement('afterend',flowEl)}flowEl.innerHTML=strip('warmup')}
 return true;
}

function injectPlayerFlow(){
 const f=flow(),player=document.querySelector('.my60-player.open .my60-overlay-inner');if(!f||!player)return false;
 let box=player.querySelector('.my60-player-flow');
 if(!box){box=document.createElement('div');box.className='my60-player-flow';const top=player.querySelector('.my60-overlay-top');if(top)top.insertAdjacentElement('afterend',box);else player.prepend(box)}
 const i=stageIndex(f.stage);
 box.innerHTML='<div class="my60-player-flow-top"><b>'+stageTitle(f.stage)+'</b><span>'+((names[f.mainType]||'Тренировка'))+'</span></div><div class="my60-player-flow-line"><i class="'+(i>0?'done':i===0?'active':'')+'"></i><i class="'+(i>1?'done':i===1?'active':'')+'"></i><i class="'+(i===2?'active':'')+'"></i></div>'+(f.stage!=='main'?'<button onclick="My60Flow.skipStage()">'+(f.stage==='warmup'?'Пропустить разминку':'Завершить без заминки')+'</button>':'');
 return true;
}

function injectPlayerFocus(){
 const s=session();if(!s)return false;const f=focus[s.type];if(!f)return false;
 const copy=document.querySelector('.my60-player.open .my60-player-copy');if(!copy)return false;
 let box=copy.querySelector('.my60-focus-player');if(box)return true;
 box=document.createElement('div');box.className='my60-focus-player';box.innerHTML=bodySvg(s.type)+'<div><b>Главный акцент</b><span>'+f.label+'</span></div>';
 const dose=copy.querySelector('.my60-dose');if(dose)dose.insertAdjacentElement('afterend',box);else copy.prepend(box);return true;
}

function startWarmup(mainType){
 save({mainType:mainType,stage:'warmup',started:Date.now()});
 if(window.My60Extra&&typeof My60Extra.quick==='function'){internal=true;My60Extra.quick('warm');internal=false}else if(window.My60Library&&My60Flow._start){internal=true;My60Flow._start('MOBILITY');internal=false}
 setTimeout(enhance,80);
}
function startMain(f){f.stage='main';save(f);internal=true;My60Flow._start(f.mainType);internal=false;setTimeout(enhance,80)}
function startCooldown(f){f.stage='cooldown';save(f);if(window.My60Extra&&typeof My60Extra.quick==='function'){internal=true;My60Extra.quick('cool');internal=false}else{internal=true;My60Flow._start('STRETCH');internal=false}setTimeout(enhance,80)}

function hook(){
 if(hooked||!window.My60Library)return false;hooked=true;
 const api=window.My60Library;
 const oStart=api.start.bind(api),oFinish=api.finish.bind(api),oClose=api.close.bind(api);
 window.My60Flow._start=oStart;window.My60Flow._finish=oFinish;window.My60Flow._close=oClose;
 api.start=function(type){
   if(internal||quickActive()||activeTypes.indexOf(type)<0){save(null);return oStart(type)}
   startWarmup(type);
 };
 api.finish=function(){
   const f=flow();
   if(!f)return oFinish();
   oFinish();
   if(f.stage==='warmup')setTimeout(()=>startMain(f),70);
   else if(f.stage==='main')setTimeout(()=>startCooldown(f),70);
   else{save(null);setTimeout(enhance,90)}
 };
 api.close=function(){oClose();setTimeout(enhance,60)};
 return true;
}

function skipStage(){
 const f=flow();if(!f)return;
 if(My60Flow._close)My60Flow._close();
 if(f.stage==='warmup')setTimeout(()=>startMain(f),40);
 else if(f.stage==='cooldown'){save(null);setTimeout(enhance,60)}
}

function enhance(){injectTodayFocus();injectPlayerFlow();injectPlayerFocus()}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;hook();enhance()})}
function boot(){injectStyle();window.My60Flow={skipStage:skipStage,_start:null,_finish:null,_close:null};let tries=0;const iv=setInterval(()=>{tries++;hook();enhance();if(tries>120)clearInterval(iv)},100);const obs=new MutationObserver(schedule);obs.observe(document.body,{childList:true,subtree:true});document.addEventListener('click',()=>setTimeout(schedule,60))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
