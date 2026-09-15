(function(){
'use strict';

const SOURCES=[
  '/workout-ux.js?v=63',
  '/workout-motion.js?v=63',
  '/workout-library.js?v=63',
  '/workout-extra.js?v=63',
  '/workout-challenges.js?v=63'
];
let started=false;
let ready=false;

function authVisible(){
  const gate=document.getElementById('authGate');
  return !!(gate && !gate.hidden);
}
function unlocked(){
  const gate=document.getElementById('authGate');
  const shell=document.getElementById('appShell');
  return !!(gate && gate.hidden && shell && !shell.hidden);
}
function planOpen(){
  const plan=document.getElementById('plan');
  return !!(plan && plan.classList.contains('active'));
}
function loadScript(src){
  return new Promise((resolve,reject)=>{
    const exists=[...document.scripts].find(s=>s.src && s.src.includes(src.split('?')[0]));
    if(exists){resolve();return;}
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.onload=resolve;
    s.onerror=()=>reject(new Error('Не загрузился модуль тренировок: '+src));
    document.body.appendChild(s);
  });
}
function addGuardStyle(){
  if(document.getElementById('workout-safe-guard'))return;
  const st=document.createElement('style');
  st.id='workout-safe-guard';
  st.textContent=`
    #authGate:not([hidden]) ~ [class^="my60-"],
    #authGate:not([hidden]) ~ [class*=" my60-"]{
      visibility:hidden!important;
      pointer-events:none!important;
    }
    #authGate:not([hidden]) ~ #appShell{pointer-events:none!important}
  `;
  document.head.appendChild(st);
}
function protectLogin(){
  if(!authVisible())return;
  document.body.classList.remove('my60-workout-open','my60-challenge-open');
  document.querySelectorAll('#my60QuickBanner,#my60ChallengeSheet').forEach(el=>el.hidden=true);
}
function showError(){
  const host=document.getElementById('workoutStudio');
  if(!host || host.querySelector('.my60-safe-error'))return;
  host.insertAdjacentHTML('afterbegin','<div class="my60-safe-error" style="padding:14px;border-radius:18px;background:#fff3f1;color:#7d4f52;margin-bottom:10px;font-size:12px">Не удалось загрузить тренировки. Закрой и снова открой раздел «План».</div>');
}
async function start(){
  if(started || ready || !unlocked())return;
  started=true;
  try{
    for(const src of SOURCES) await loadScript(src);
    ready=true;
    document.dispatchEvent(new CustomEvent('my60:workouts-ready'));
  }catch(e){
    console.error(e);
    started=false;
    showError();
  }
}
function maybeStart(){
  protectLogin();
  if(unlocked() && planOpen()) start();
}

addGuardStyle();
protectLogin();

document.addEventListener('click',function(e){
  const b=e.target.closest && e.target.closest('button');
  if(!b)return;
  const action=b.getAttribute('onclick')||'';
  if(action.includes("tab('plan'") || action.includes('tab("plan"')) setTimeout(maybeStart,40);
});

const gate=document.getElementById('authGate');
if(gate)new MutationObserver(maybeStart).observe(gate,{attributes:true,attributeFilter:['hidden','class']});
const plan=document.getElementById('plan');
if(plan)new MutationObserver(maybeStart).observe(plan,{attributes:true,attributeFilter:['class']});
window.addEventListener('pageshow',maybeStart);
window.My60WorkoutLoader={load:start,get ready(){return ready}};
})();