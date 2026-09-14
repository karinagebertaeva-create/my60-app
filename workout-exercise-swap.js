(function(){
'use strict';

const SESSION='my60-workout-session-v3';
const STORE='my60-exercise-swaps-v1';
let raf=0;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function read(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
function write(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function session(){return read(SESSION)}
function allSwaps(){return read(STORE)||{}}
function swapKey(s){return s?(s.started||'session')+':'+s.type+':'+s.e:''}
function currentSwap(s){const x=allSwaps();return x[swapKey(s)]||null}
function saveSwap(s,a){const x=allSwaps();if(a)x[swapKey(s)]=a;else delete x[swapKey(s)];write(STORE,x)}

const ALTS={
  lunge:[
    {name:'Присед к стулу',family:'squat',focus:'Ноги · ягодицы',why:'Без шага назад',how:['Поставь стул позади и стой устойчиво.','Отведи таз назад, слегка коснись стула и встань через всю стопу.'],tip:'Колени направляй по линии носков.'},
    {name:'Ягодичный мост',family:'bridge',focus:'Ягодицы',why:'Без нагрузки стоя',how:['Ляг на спину, стопы ближе к тазу.','Подними таз, мягко сожми ягодицы и опусти.'],tip:'Не переразгибай поясницу.'},
    {name:'Отведение ноги назад с опорой',family:'leglift',focus:'Ягодицы',why:'Легче для коленей',how:['Держись за устойчивую опору.','Отведи ногу назад без раскачки корпуса и верни.'],tip:'Амплитуда небольшая, поясница спокойная.'}
  ],
  push:[
    {name:'Отжимания от стены',family:'pushwall',focus:'Грудь · руки',why:'Самый лёгкий вариант',how:['Ладони на стене чуть шире плеч.','Согни локти, приблизь грудь к стене и плавно выжми себя назад.'],tip:'Тело держи одной линией.'},
    {name:'Жим ладонями перед грудью',family:'presspalms',focus:'Грудь · руки',why:'Без опоры на кисти',how:['Соедини ладони перед грудью.','На выдохе мягко дави ладонями друг в друга и отпускай.'],tip:'Не поднимай плечи к ушам.'},
    {name:'Разведение рук лёжа',family:'arms',focus:'Грудь · плечи',why:'Без нагрузки на запястья',how:['Ляг на спину, руки вверх, локти мягкие.','Медленно разведи руки в стороны и верни.'],tip:'Используй очень лёгкий вес или делай без веса.'}
  ],
  sideplank:[
    {name:'Dead bug',family:'deadbug',focus:'Глубокий кор',why:'Без опоры на руку',how:['Ляг на спину, колени над тазом.','Медленно удлини противоположные руку и ногу и вернись.'],tip:'Поясница остаётся спокойно на полу.'},
    {name:'Касание пяток лёжа',family:'deadbug',focus:'Талия',why:'Мягче для плеч',how:['Ляг на спину, стопы на полу.','Слегка приподними лопатки и тянись рукой к одноимённой пятке.'],tip:'Шею не тяни.'},
    {name:'Bird dog',family:'birddog',focus:'Кор · спина',why:'Больше стабильности',how:['Встань на четвереньки.','Вытяни противоположные руку и ногу, не разворачивая таз.'],tip:'Если кистям неудобно — опирайся на кулаки или предплечья.'}
  ],
  deadbug:[
    {name:'Скольжение пяткой',family:'heelslide',focus:'Низ живота',why:'Проще контролировать',how:['Ляг на спину, колени согнуты.','Медленно скользи одной пяткой вперёд и верни, затем поменяй ногу.'],tip:'Поясница не должна заметно отрываться.'},
    {name:'Марш лёжа',family:'deadbug',focus:'Глубокий кор',why:'Лёгкий вариант',how:['Ляг на спину, стопы на полу.','Поочерёдно приподнимай одну стопу на несколько сантиметров.'],tip:'Таз не раскачивай.'},
    {name:'Bird dog',family:'birddog',focus:'Кор · спина',why:'Другой формат',how:['Встань на четвереньки.','Вытяни противоположные руку и ногу и вернись.'],tip:'Двигайся медленно.'}
  ],
  bridge:[
    {name:'Ракушка лёжа на боку',family:'clam',focus:'Ягодицы · таз',why:'Без подъёма таза',how:['Ляг на бок, колени согнуты, стопы вместе.','Открой верхнее колено, не заваливая таз назад, и закрой.'],tip:'Амплитуда небольшая и контролируемая.'},
    {name:'Отведение ноги лёжа на боку',family:'leglift',focus:'Ягодицы',why:'Акцент на бок ягодицы',how:['Ляг на бок, нижнюю ногу можно согнуть.','Подними верхнюю ногу и медленно опусти.'],tip:'Носок направлен вперёд, таз не разворачивай.'},
    {name:'Сжатие ягодиц лёжа',family:'breathe',focus:'Ягодицы · таз',why:'Очень мягко',how:['Ляг удобно, ноги согнуты.','На выдохе мягко напряги ягодицы на 2–3 секунды и расслабь.'],tip:'Без задержки дыхания.'}
  ],
  squat:[
    {name:'Присед к стулу короче',family:'squat',focus:'Ноги · ягодицы',why:'Меньше глубина',how:['Стой перед стулом, стопы устойчиво.','Садись назад только до комфортной глубины и вставай.'],tip:'Глубина не важнее комфорта.'},
    {name:'Ягодичный мост',family:'bridge',focus:'Ягодицы',why:'Без нагрузки стоя',how:['Ляг на спину, стопы на полу.','Подними таз и опусти контролируемо.'],tip:'Работай ягодицами, не поясницей.'},
    {name:'Вставание со стула',family:'squat',focus:'Ноги',why:'Самый понятный вариант',how:['Сядь на устойчивый стул ближе к краю.','Наклони корпус чуть вперёд и встань через всю стопу, затем сядь обратно.'],tip:'Можно слегка помогать руками о бёдра.'}
  ],
  overhead:[
    {name:'Разведение рук в стороны без веса',family:'arms',focus:'Плечи',why:'Легче для плеч',how:['Стой ровно, руки вдоль тела.','Подними руки в стороны до комфортной высоты и опусти.'],tip:'Не поднимай плечи к ушам.'},
    {name:'Скольжение руками по стене',family:'wallslide',focus:'Плечи · осанка',why:'Мягкая амплитуда',how:['Встань спиной к стене.','Скользи руками вверх и вниз только в безболезненном диапазоне.'],tip:'Не выпячивай рёбра.'},
    {name:'Жим одной рукой поочерёдно',family:'overhead',focus:'Плечи · руки',why:'Проще контролировать',how:['Держи лёгкий вес у одного плеча.','Выжми одну руку вверх, опусти и поменяй сторону.'],tip:'Корпус не наклоняй.'}
  ],
  pull:[
    {name:'Сведение лопаток стоя',family:'row',focus:'Верх спины',why:'Без веса',how:['Стой ровно, руки согнуты перед собой.','Отведи локти назад, мягко сведи лопатки и верни.'],tip:'Плечи остаются опущенными.'},
    {name:'Скольжение руками по стене',family:'wallslide',focus:'Осанка · лопатки',why:'Мягче для поясницы',how:['Встань спиной к стене.','Скользи руками вверх и вниз, сохраняя шею расслабленной.'],tip:'Работай только без боли.'},
    {name:'Bird dog',family:'birddog',focus:'Спина · кор',why:'Без дополнительного веса',how:['Встань на четвереньки.','Вытяни противоположные руку и ногу и медленно вернись.'],tip:'Таз не разворачивай.'}
  ],
  yoga:[
    {name:'Поза ребёнка',family:'child',focus:'Спина · дыхание',why:'Мягкое восстановление',how:['Опустись тазом к пяткам.','Вытяни руки вперёд и спокойно дыши.'],tip:'Если неудобно коленям — подложи мягкую опору.'},
    {name:'Кошка-корова',family:'catcow',focus:'Позвоночник',why:'Мягкая подвижность',how:['Встань на четвереньки.','На выдохе округлись, на вдохе мягко раскрой грудь.'],tip:'Без резких прогибов.'},
    {name:'Дыхание лёжа',family:'breathe',focus:'Восстановление',why:'Самый спокойный вариант',how:['Ляг удобно, ладони на рёбрах.','Дыши спокойно, удлиняя выдох.'],tip:'Не форсируй дыхание.'}
  ]
};

function family(name){const n=(name||'').toLowerCase();if(n.includes('выпад'))return'lunge';if(n.includes('отжим'))return'push';if(n.includes('боковая планка')||n.includes('планка'))return'sideplank';if(n.includes('dead bug')||n.includes('касание пяток')||n.includes('скольжение пяткой')||n.includes('марш в ягодичном'))return'deadbug';if(n.includes('ягодич')||n.includes('frog')||n.includes('мост'))return'bridge';if(n.includes('присед')||n.includes('вставание со стула'))return'squat';if(n.includes('жим')||n.includes('разгибание рук'))return'overhead';if(n.includes('тяга')||n.includes('обратные разведения')||n.includes('y-подъёмы'))return'pull';if(n.includes('собака')||n.includes('кобр')||n.includes('поза ребён')||n.includes('кошка')||n.includes('скрут')||n.includes('йога'))return'yoga';return'generic'}

function figure(f){
  const common='<style>.b{stroke:#2f3431;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;fill:none}.h{fill:#2f3431}.a{stroke:#c76f77;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;fill:none}.g{stroke:#c7c5bf;stroke-width:4;stroke-linecap:round;fill:none}.m2{animation:m2 2.5s ease-in-out infinite}@keyframes m2{0%,35%{opacity:.08}48%,88%{opacity:1}100%{opacity:.08}}.m1{animation:m1 2.5s ease-in-out infinite}@keyframes m1{0%,35%{opacity:1}48%,88%{opacity:.08}100%{opacity:1}}</style>';
  const stand='<circle class="h" cx="75" cy="45" r="11"/><path class="b" d="M75 58 L75 101 M75 72 L50 89 M75 72 L100 89 M75 101 L60 143 M75 101 L90 143"/>';
  const P={
    squat:[stand,'<circle class="h" cx="75" cy="60" r="11"/><path class="b" d="M74 73 L63 104 M69 82 L43 98 M69 82 L96 96 M63 104 L43 124 L61 144 M63 104 L96 121 L102 145"/>'],
    bridge:['<circle class="h" cx="36" cy="113" r="10"/><path class="b" d="M46 113 L82 114 L106 131 M82 114 L99 94 M106 131 L125 131"/><path class="g" d="M18 140 H132"/>','<circle class="h" cx="36" cy="113" r="10"/><path class="b" d="M46 112 L78 99 L104 82 M104 82 L123 114 M123 114 L132 114"/><path class="g" d="M18 140 H132"/>'],
    deadbug:['<circle class="h" cx="35" cy="118" r="9"/><path class="b" d="M45 117 L76 116 M76 116 L95 87 M76 116 L99 130 M65 113 L54 81 M66 113 L83 80"/><path class="g" d="M18 139 H132"/>','<circle class="h" cx="35" cy="118" r="9"/><path class="b" d="M45 117 L76 116 M76 116 L116 129 M76 116 L91 87 M65 113 L34 80 M66 113 L84 82"/><path class="g" d="M18 139 H132"/>'],
    heelslide:['<circle class="h" cx="35" cy="118" r="9"/><path class="b" d="M45 117 L76 116 M76 116 L95 100 L111 129 M76 116 L92 132"/><path class="g" d="M18 139 H132"/>','<circle class="h" cx="35" cy="118" r="9"/><path class="b" d="M45 117 L76 116 M76 116 L120 132 M76 116 L92 132"/><path class="g" d="M18 139 H132"/>'],
    birddog:['<circle class="h" cx="96" cy="80" r="10"/><path class="b" d="M85 84 L60 99 L82 110 M62 98 L44 131 M82 110 L103 134 M72 95 L105 103"/><path class="g" d="M26 139 H129"/>','<circle class="h" cx="96" cy="80" r="10"/><path class="b" d="M85 84 L60 98 L82 110 M60 98 L28 78 M82 110 L121 123 M70 96 L101 103"/><path class="g" d="M20 139 H132"/>'],
    pushwall:['<path class="g" d="M119 34 V146"/>'+stand,'<path class="g" d="M119 34 V146"/><circle class="h" cx="102" cy="73" r="10"/><path class="b" d="M93 80 L69 94 L46 123 M69 94 L105 100 L117 86 M46 123 L31 145 M46 123 L65 145"/>'],
    presspalms:[stand,'<circle class="h" cx="75" cy="45" r="11"/><path class="b" d="M75 58 L75 101 M75 73 L58 84 L74 84 M75 73 L92 84 L76 84 M75 101 L60 143 M75 101 L90 143"/><path class="a" d="M70 84 H80"/>'],
    arms:[stand,'<circle class="h" cx="75" cy="45" r="11"/><path class="b" d="M75 58 L75 101 M75 72 L39 72 M75 72 L111 72 M75 101 L60 143 M75 101 L90 143"/>'],
    leglift:[stand,'<circle class="h" cx="75" cy="45" r="11"/><path class="b" d="M75 58 L75 101 M75 72 L50 89 M75 72 L100 89 M75 101 L60 143 M75 101 L114 119"/>'],
    clam:['<circle class="h" cx="36" cy="113" r="9"/><path class="b" d="M45 112 L73 112 L101 128 M73 112 L99 100 M101 128 L124 132"/><path class="g" d="M20 140 H132"/>','<circle class="h" cx="36" cy="113" r="9"/><path class="b" d="M45 112 L73 112 L101 128 M73 112 L101 91 M101 128 L124 132"/><path class="g" d="M20 140 H132"/>'],
    wallslide:['<path class="g" d="M36 28 V148"/>'+stand,'<path class="g" d="M36 28 V148"/><circle class="h" cx="66" cy="48" r="10"/><path class="b" d="M62 60 L62 104 M62 73 L50 48 L52 29 M62 73 L77 48 L79 29 M62 104 L51 145 M62 104 L74 145"/>'],
    row:[stand,'<circle class="h" cx="75" cy="45" r="11"/><path class="b" d="M75 58 L75 101 M75 72 L52 82 L63 94 M75 72 L98 82 L87 94 M75 101 L60 143 M75 101 L90 143"/>'],
    overhead:[stand,'<circle class="h" cx="75" cy="45" r="11"/><path class="b" d="M75 58 L75 101 M75 72 L54 44 M75 72 L96 44 M75 101 L60 143 M75 101 L90 143"/>'],
    child:['<circle class="h" cx="102" cy="96" r="9"/><path class="b" d="M93 100 L68 111 L46 128 M70 111 L105 131 M46 128 L35 143"/><path class="g" d="M22 146 H130"/>','<circle class="h" cx="97" cy="112" r="9"/><path class="b" d="M88 116 L60 125 L39 135 M62 126 L111 132 M39 135 L27 145"/><path class="g" d="M22 146 H130"/>'],
    catcow:['<circle class="h" cx="104" cy="83" r="9"/><path class="b" d="M94 88 Q75 78 54 95 M55 95 L42 132 M78 90 L92 128 M55 95 L80 108"/><path class="g" d="M24 139 H128"/>','<circle class="h" cx="104" cy="92" r="9"/><path class="b" d="M94 95 Q76 112 54 99 M55 99 L42 132 M78 104 L92 132 M55 99 L80 111"/><path class="g" d="M24 139 H128"/>'],
    breathe:[stand,'<circle class="h" cx="75" cy="45" r="11"/><path class="b" d="M75 58 L75 101 M75 72 L50 89 M75 72 L100 89 M75 101 L60 143 M75 101 L90 143"/><path class="a" d="M50 86 Q75 62 100 86"/>']
  };
  const v=P[f]||P.breathe;
  return '<svg viewBox="0 0 150 170" aria-hidden="true">'+common+'<g class="m1">'+v[0]+'</g><g class="m2">'+v[1]+'</g></svg>';
}

function alternatives(name){const f=family(name);return ALTS[f]||[
  {name:'Сделать меньше амплитуду',family:'breathe',focus:'Облегчённый вариант',why:'Сохраняем упражнение',how:['Займи исходное положение упражнения.','Сделай движение медленнее и в меньшей амплитуде.'],tip:'Остановись при острой боли.'},
  {name:'Мягкая мобилизация',family:'catcow',focus:'Восстановление',why:'Если упражнение сегодня не подходит',how:['Встань или сядь устойчиво.','Сделай несколько спокойных движений плечами и позвоночником.'],tip:'Движение должно оставаться комфортным.'}
]}

function originalName(){const h=document.querySelector('.my60-player.open .my60-player-copy h2');return h?h.dataset.originalName||h.textContent.trim():''}
function openSwap(){
  const s=session();if(!s||s.phase!=='exercise')return;
  const baseName=originalName();const list=alternatives(baseName);
  let el=document.getElementById('my60ExerciseSwap');
  if(!el){el=document.createElement('div');el.id='my60ExerciseSwap';el.className='my60-ex-swap';document.body.appendChild(el)}
  const active=currentSwap(s);
  el.innerHTML='<div class="my60-ex-sheet"><div class="my60-ex-head"><button onclick="My60ExerciseSwap.close()">×</button><div><span>ЗАМЕНИТЬ УПРАЖНЕНИЕ</span><b>'+esc(baseName)+'</b></div><i></i></div><p class="my60-ex-intro">Выбери удобный вариант. Количество подходов остаётся таким же, чтобы не усложнять тренировку.</p><div class="my60-ex-grid">'+list.map((a,i)=>'<button class="my60-ex-option '+(active&&active.name===a.name?'active':'')+'" onclick="My60ExerciseSwap.pick('+i+')"><div class="my60-ex-visual">'+figure(a.family)+'</div><div><strong>'+esc(a.name)+'</strong><span>'+esc(a.why)+'</span><small>'+esc(a.focus)+'</small></div></button>').join('')+'</div>'+(active?'<button class="my60-ex-original" onclick="My60ExerciseSwap.original()">Вернуть исходное упражнение</button>':'')+'<div class="my60-ex-warning">Если появляется острая боль, выраженное головокружение или необычный дискомфорт — упражнение лучше прекратить.</div></div>';
  el.classList.add('open');document.body.classList.add('my60-workout-open');
}
function closeSwap(){const el=document.getElementById('my60ExerciseSwap');if(el)el.classList.remove('open')}
function pick(i){const s=session();if(!s)return;const list=alternatives(originalName());const a=list[i];if(!a)return;saveSwap(s,a);closeSwap();applySwap()}
function original(){const s=session();if(s)saveSwap(s,null);closeSwap();applySwap()}

function applySwap(){
  const s=session();if(!s||s.phase!=='exercise')return;
  const card=document.querySelector('.my60-player.open .my60-player-card');if(!card)return;
  const h=card.querySelector('.my60-player-copy h2');if(!h)return;
  if(!h.dataset.originalName)h.dataset.originalName=h.textContent.trim();
  const base=h.dataset.originalName,sw=currentSwap(s);
  let btn=card.querySelector('.my60-replace-exercise');
  if(!btn){btn=document.createElement('button');btn.type='button';btn.className='my60-replace-exercise';btn.onclick=openSwap;const tip=card.querySelector('.my60-tip');(tip||h).insertAdjacentElement('afterend',btn)}
  if(!sw){
    h.textContent=base;btn.innerHTML='<span>↻</span><b>Заменить упражнение</b><small>если неудобно или не подходит сегодня</small>';
    const old=card.querySelector('.my60-swap-guide');if(old)old.remove();
    return;
  }
  h.textContent=sw.name;
  btn.innerHTML='<span>✓</span><b>Упражнение заменено</b><small>нажми, чтобы выбрать другой вариант</small>';
  const demo=card.querySelector('.my60-demo');if(demo){demo.innerHTML=figure(sw.family);demo.classList.add('my60-alt-demo')}
  const oldHow=card.querySelector('.my60-how');if(oldHow)oldHow.style.display='none';
  const oldTip=card.querySelector('.my60-tip');if(oldTip)oldTip.style.display='none';
  let guide=card.querySelector('.my60-swap-guide');if(!guide){guide=document.createElement('div');guide.className='my60-swap-guide';btn.insertAdjacentElement('beforebegin',guide)}
  guide.innerHTML='<div><i>1</i><p>'+esc(sw.how[0])+'</p></div><div><i>2</i><p>'+esc(sw.how[1])+'</p></div><aside><b>Важно:</b> '+esc(sw.tip)+'</aside>';
}

function injectButton(){
  const s=session();if(!s||s.phase!=='exercise')return false;
  const card=document.querySelector('.my60-player.open .my60-player-card');if(!card)return false;
  applySwap();return true;
}

function injectStyle(){if(document.getElementById('my60ExerciseSwapStyle'))return;const st=document.createElement('style');st.id='my60ExerciseSwapStyle';st.textContent=`
.my60-replace-exercise{width:100%;border:1px solid rgba(21,25,23,.07);background:#f7f6f3;border-radius:16px;padding:11px 12px;margin-top:10px;display:grid;grid-template-columns:30px 1fr;column-gap:9px;text-align:left;color:#303531}.my60-replace-exercise>span{grid-row:1/3;width:30px;height:30px;border-radius:10px;background:#efe5e2;color:#a75f67;display:grid;place-items:center;font-size:16px}.my60-replace-exercise b{font-size:12px;align-self:end}.my60-replace-exercise small{font-size:9px;color:#8d928e;align-self:start}.my60-swap-guide{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.my60-swap-guide>div{background:#f7f7f4;border-radius:15px;padding:10px}.my60-swap-guide i{width:21px;height:21px;border-radius:50%;background:#222825;color:#fff;display:grid;place-items:center;font-size:9px;font-style:normal;font-weight:900;margin-bottom:6px}.my60-swap-guide p{margin:0;font-size:10px;line-height:1.4;color:#5f6561}.my60-swap-guide aside{grid-column:1/-1;border-left:3px solid #c76f77;background:#fbf3f1;border-radius:12px;padding:9px 10px;font-size:10px;color:#685b5b}.my60-alt-demo svg{width:100%;height:100%;max-width:270px!important}
.my60-ex-swap{position:fixed;inset:0;z-index:10150;background:rgba(12,16,14,.50);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:none;align-items:flex-end}.my60-ex-swap.open{display:flex}.my60-ex-sheet{width:min(100%,560px);margin:0 auto;background:#f7f6f2;border-radius:30px 30px 0 0;padding:18px 14px calc(18px + env(safe-area-inset-bottom));max-height:91vh;overflow:auto;box-shadow:0 -20px 60px rgba(0,0,0,.18)}.my60-ex-head{display:grid;grid-template-columns:42px 1fr 42px;align-items:center;margin-bottom:8px}.my60-ex-head button{width:40px;height:40px;border:0;border-radius:50%;background:#fff;font-size:24px;color:#333936}.my60-ex-head div{text-align:center}.my60-ex-head span{display:block;font-size:9px;letter-spacing:.12em;color:#a3646a;font-weight:900}.my60-ex-head b{font-size:14px}.my60-ex-intro{font-size:11px;line-height:1.45;color:#7b817c;text-align:center;margin:8px 15px 13px}.my60-ex-grid{display:flex;flex-direction:column;gap:9px}.my60-ex-option{display:grid;grid-template-columns:105px 1fr;gap:11px;align-items:center;border:1px solid rgba(21,25,23,.06);background:#fff;border-radius:21px;padding:9px;text-align:left;color:#222825}.my60-ex-option.active{border-color:#c76f77;background:#fff8f6}.my60-ex-visual{height:88px;border-radius:16px;background:#f1ece6;display:grid;place-items:center;overflow:hidden}.my60-ex-visual svg{width:100%;height:84px}.my60-ex-option strong{display:block;font-size:13px;line-height:1.2}.my60-ex-option span{display:block;font-size:10px;color:#858b86;margin-top:4px}.my60-ex-option small{display:block;font-size:9px;color:#b0646c;font-weight:850;margin-top:6px}.my60-ex-original{width:100%;border:0;border-radius:15px;background:#fff;padding:12px;margin-top:10px;color:#5f6561;font-size:11px;font-weight:850}.my60-ex-warning{font-size:9px;line-height:1.4;color:#979b98;text-align:center;margin:11px 18px 0}
@media(max-width:430px){.my60-ex-sheet{border-radius:27px 27px 0 0}.my60-ex-option{grid-template-columns:96px 1fr}.my60-ex-visual{height:82px}.my60-swap-guide{grid-template-columns:1fr}.my60-swap-guide aside{grid-column:auto}}
`;document.head.appendChild(st)}

function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;injectButton()})}
function boot(){injectStyle();window.My60ExerciseSwap={open:openSwap,close:closeSwap,pick:pick,original:original};const obs=new MutationObserver(schedule);obs.observe(document.body,{childList:true,subtree:true});document.addEventListener('click',e=>{if(e.target.closest('.my60-player-actions,.my60-preview-start,.my60-card2,.my60-smart-actions'))setTimeout(schedule,70)});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();