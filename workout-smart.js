(function(){
'use strict';

const STORE='my60-workout-smart-v1';
let state={focus:'all',time:20,energy:'normal',seed:0};

const focusLabels={all:'Всё тело',abs:'Пресс',glutes:'Ягодицы',pilates:'Пилатес',back:'Спина',yoga:'Йога',cardio:'Кардио',arms:'Руки'};
const timeLabels={10:'10–15 мин',20:'20–25 мин',30:'30+ мин'};

const pools={
  all:[
    {kind:'base',id:'STRENGTH',title:'Силовая · всё тело',why:'тонус всего тела'},
    {kind:'base',id:'STRENGTH_B',title:'Силовая B · всё тело',why:'другая силовая связка'},
    {kind:'variety',id:'PILATES_MORNING',title:'Пилатес утром',why:'мягко включить всё тело'},
    {kind:'variety',id:'CARDIO_WALK',title:'Шаги дома',why:'движение без прыжков'}
  ],
  abs:[
    {kind:'variety',id:'ABS_EXPRESS',title:'Пресс · 12 минут',why:'коротко и по делу'},
    {kind:'variety',id:'ABS_LOWER_2',title:'Низ живота · медленно',why:'контроль нижней части кора'},
    {kind:'variety',id:'ABS_WAIST_2',title:'Талия и косые',why:'боковая линия корпуса'},
    {kind:'variety',id:'ABS_DEEP_2',title:'Глубокий кор',why:'стабилизация живота'},
    {kind:'variety',id:'ABS_STANDING',title:'Пресс стоя',why:'без упражнений лёжа'},
    {kind:'variety',id:'ABS_SLOW',title:'Пресс · спокойный темп',why:'техника без спешки'}
  ],
  glutes:[
    {kind:'variety',id:'GLUTES_BRIDGE',title:'Ягодицы · мосты',why:'акцент на большую ягодичную'},
    {kind:'variety',id:'GLUTES_SIDE',title:'Ягодицы · боковой акцент',why:'средняя ягодичная'},
    {kind:'variety',id:'GLUTES_CONTROL',title:'Ягодицы · медленно',why:'без прыжков и спешки'},
    {kind:'variety',id:'LEGS_SCULPT',title:'Ноги + ягодицы',why:'бёдра и ягодицы'},
    {kind:'variety',id:'LOWER_BALANCE',title:'Низ тела · баланс',why:'устойчивость и контроль'},
    {kind:'base',id:'GLUTES_B',title:'Ягодицы B',why:'другая силовая последовательность'}
  ],
  pilates:[
    {kind:'variety',id:'PILATES_MORNING',title:'Пилатес утром',why:'мягко разбудить тело'},
    {kind:'variety',id:'PILATES_CORE_2',title:'Пилатес · сильный кор',why:'живот и контроль таза'},
    {kind:'variety',id:'PILATES_LOWER_2',title:'Пилатес · ноги и ягодицы',why:'низ тела без прыжков'},
    {kind:'variety',id:'PILATES_POSTURE_2',title:'Пилатес · осанка',why:'спина и лопатки'},
    {kind:'variety',id:'PILATES_STANDING',title:'Пилатес стоя',why:'баланс и тонус'},
    {kind:'variety',id:'PILATES_RELAX',title:'Пилатес · восстановление',why:'медленная практика'}
  ],
  back:[
    {kind:'variety',id:'POSTURE_DESK',title:'Осанка после рабочего дня',why:'шея, грудной отдел, лопатки'},
    {kind:'variety',id:'POSTURE_UPPER',title:'Верх спины и лопатки',why:'осанка и плечи'},
    {kind:'variety',id:'BACK_MOBILITY',title:'Мобильная спина',why:'мягкое движение позвоночника'},
    {kind:'base',id:'BACK',title:'Здоровая спина',why:'спина и разгрузка'},
    {kind:'base',id:'POSTURE',title:'Осанка и лопатки',why:'укрепление верхней части спины'}
  ],
  yoga:[
    {kind:'variety',id:'YOGA_SLEEP',title:'Йога · 10 минут сна',why:'очень спокойная практика'},
    {kind:'variety',id:'YOGA_EVENING_2',title:'Йога перед сном',why:'мягко замедлиться'},
    {kind:'variety',id:'YOGA_HIPS_2',title:'Йога · раскрытие таза',why:'бёдра и ягодицы'},
    {kind:'variety',id:'YOGA_BACK_2',title:'Йога · спина и плечи',why:'после сидячего дня'},
    {kind:'variety',id:'YOGA_STRETCH',title:'Йога · растяжка всего тела',why:'мягкая гибкость'},
    {kind:'base',id:'YOGA',title:'Йога · мягкий поток',why:'гибкость и дыхание'}
  ],
  cardio:[
    {kind:'variety',id:'CARDIO_WALK',title:'Кардио · шаги дома',why:'без прыжков'},
    {kind:'variety',id:'CARDIO_BOX',title:'Кардио-бокс',why:'руки, кор и пульс'},
    {kind:'base',id:'CARDIO',title:'Кардио без прыжков',why:'умеренная нагрузка'},
    {kind:'base',id:'INTERVAL',title:'Интервальная без прыжков',why:'чуть интенсивнее'}
  ],
  arms:[
    {kind:'base',id:'UPPER',title:'Руки и плечи A',why:'верх тела'},
    {kind:'base',id:'UPPER_B',title:'Руки и плечи B',why:'другая последовательность'},
    {kind:'base',id:'STRENGTH_B',title:'Силовая B',why:'руки плюс всё тело'},
    {kind:'variety',id:'POSTURE_UPPER',title:'Верх спины и лопатки',why:'плечи и верх спины'}
  ]
};

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function load(){try{const x=JSON.parse(localStorage.getItem(STORE)||'null');if(x&&typeof x==='object')state={...state,...x}}catch(e){}}
function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch(e){}}
function available(x){if(x.kind==='variety')return !!(window.My60Variety&&typeof My60Variety.has==='function'&&My60Variety.has(x.id));return !!(window.My60Library&&typeof My60Library.preview==='function')}
function softIds(){return new Set(['PILATES_RELAX','YOGA_SLEEP','YOGA_EVENING_2','BACK_MOBILITY','YOGA_BACK_2','POSTURE_DESK'])}
function energeticIds(){return new Set(['CARDIO','INTERVAL','CARDIO_WALK','CARDIO_BOX','STRENGTH','STRENGTH_B','LEGS_SCULPT'])}
function score(x){let n=0;if(state.time===10){if(/12 минут|10 минут|корот|сон/i.test(x.title+' '+x.why))n+=4;if(x.kind==='variety')n+=1}else if(state.time===30){if(x.kind==='base')n+=2;if(/силовая|ноги \+|интервальная/i.test(x.title))n+=2}else{n+=2}
if(state.energy==='low'&&softIds().has(x.id))n+=8;if(state.energy==='low'&&energeticIds().has(x.id))n-=6;if(state.energy==='high'&&energeticIds().has(x.id))n+=6;if(state.energy==='high'&&softIds().has(x.id))n-=2;return n}
function choices(){const arr=(pools[state.focus]||pools.all).filter(available).map((x,i)=>({...x,_i:i,_s:score(x)}));arr.sort((a,b)=>b._s-a._s||((a._i+state.seed)%17)-((b._i+state.seed)%17));if(arr.length<3&&state.focus!=='all')arr.push(...pools.all.filter(available));const seen=new Set();return arr.filter(x=>{const k=x.kind+':'+x.id;if(seen.has(k))return false;seen.add(k);return true}).slice(0,3)}
function openWorkout(kind,id){if(kind==='variety'&&window.My60Variety)return My60Variety.preview(id);if(window.My60Library)return My60Library.preview(id)}
function setFocus(v){state.focus=v;save();render()}
function setTime(v){state.time=+v;save();render()}
function setEnergy(v){state.energy=v;save();render()}
function shuffle(){state.seed=(state.seed+1)%97;save();render()}

function style(){if(document.getElementById('my60SmartStyle'))return;const st=document.createElement('style');st.id='my60SmartStyle';st.textContent=`
.my60-smart{margin:12px 0;background:linear-gradient(155deg,#181d1a,#292f2b);color:#fff;border-radius:26px;padding:16px;box-shadow:0 14px 34px rgba(19,25,22,.14)}.my60-smart-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.my60-smart-head span{font-size:9px;text-transform:uppercase;letter-spacing:.13em;opacity:.55;font-weight:850}.my60-smart-head b{display:block;font-size:21px;margin-top:4px;letter-spacing:-.03em}.my60-smart-head button{border:0;border-radius:13px;background:rgba(255,255,255,.1);color:#fff;padding:9px 10px;font-size:10px;font-weight:800}.my60-smart-label{font-size:9px;opacity:.55;text-transform:uppercase;letter-spacing:.1em;margin:14px 0 7px;font-weight:850}.my60-smart-scroll{display:flex;gap:6px;overflow:auto;scrollbar-width:none}.my60-smart-scroll::-webkit-scrollbar{display:none}.my60-smart-scroll button{white-space:nowrap;border:0;border-radius:999px;background:rgba(255,255,255,.09);color:rgba(255,255,255,.72);padding:9px 11px;font-size:10px;font-weight:800}.my60-smart-scroll button.active{background:#fff;color:#171d1a}.my60-smart-seg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.my60-smart-seg button{border:0;border-radius:12px;padding:9px 5px;background:rgba(255,255,255,.09);color:rgba(255,255,255,.7);font-size:9px;font-weight:850}.my60-smart-seg button.active{background:#fff;color:#171d1a}.my60-smart-results{display:grid;grid-template-columns:1fr;gap:7px;margin-top:13px}.my60-smart-card{border:1px solid rgba(255,255,255,.08);border-radius:17px;background:rgba(255,255,255,.07);padding:11px 12px;color:#fff;text-align:left;display:flex;justify-content:space-between;gap:10px;align-items:center}.my60-smart-card b{display:block;font-size:12px;line-height:1.25}.my60-smart-card span{display:block;font-size:9px;opacity:.58;margin-top:3px}.my60-smart-card i{font-style:normal;font-size:18px;opacity:.8}.my60-smart-foot{font-size:9px;line-height:1.4;opacity:.45;margin-top:10px}@media(max-width:430px){.my60-smart{padding:14px;border-radius:23px}.my60-smart-head b{font-size:19px}}
`;document.head.appendChild(st)}
function markup(){const rec=choices();return '<section class="my60-smart" id="my60Smart"><div class="my60-smart-head"><div><span>Быстрый подбор</span><b>Что тренируем сегодня?</b></div><button onclick="My60Smart.shuffle()">↻ Другие</button></div><div class="my60-smart-label">Зона</div><div class="my60-smart-scroll">'+Object.entries(focusLabels).map(([id,n])=>'<button class="'+(state.focus===id?'active':'')+'" onclick="My60Smart.focus(\''+id+'\')">'+n+'</button>').join('')+'</div><div class="my60-smart-label">Время</div><div class="my60-smart-seg">'+Object.entries(timeLabels).map(([id,n])=>'<button class="'+(+state.time===+id?'active':'')+'" onclick="My60Smart.time('+id+')">'+n+'</button>').join('')+'</div><div class="my60-smart-label">Как по силам</div><div class="my60-smart-seg"><button class="'+(state.energy==='low'?'active':'')+'" onclick="My60Smart.energy(\'low\')">Мягко</button><button class="'+(state.energy==='normal'?'active':'')+'" onclick="My60Smart.energy(\'normal\')">Обычно</button><button class="'+(state.energy==='high'?'active':'')+'" onclick="My60Smart.energy(\'high\')">Бодро</button></div><div class="my60-smart-results">'+rec.map(x=>'<button class="my60-smart-card" onclick="My60Smart.open(\''+x.kind+'\',\''+x.id+'\')"><div><b>'+esc(x.title)+'</b><span>'+esc(x.why)+'</span></div><i>›</i></button>').join('')+'</div><div class="my60-smart-foot">Подбор помогает выбрать формат занятия, но не заменяет самочувствие: при боли тренировку лучше остановить.</div></section>'}
function ensure(){const studio=document.getElementById('workoutStudio');if(!studio)return false;if(document.getElementById('my60Smart'))return true;const hub=studio.querySelector('.my60-v4')||studio.querySelector('.my60-library2')?.parentElement;if(!hub)return false;const variety=document.getElementById('my60Variety');if(variety)variety.insertAdjacentHTML('beforebegin',markup());else{const lib=studio.querySelector('.my60-library2');if(lib)lib.insertAdjacentHTML('afterend',markup());else hub.insertAdjacentHTML('beforeend',markup())}return true}
function render(){const el=document.getElementById('my60Smart');if(el)el.outerHTML=markup();else ensure()}
function boot(){load();style();window.My60Smart={focus:setFocus,time:setTime,energy:setEnergy,shuffle,open:openWorkout};let tries=0;const iv=setInterval(()=>{tries++;if(ensure()||tries>50)clearInterval(iv)},150);document.addEventListener('my60:workouts-ready',()=>setTimeout(ensure,80))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();