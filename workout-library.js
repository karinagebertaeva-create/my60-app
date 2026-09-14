(function(){
'use strict';

const W={
  STRENGTH:{title:'Силовая · всё тело',duration:'28–35 мин',tone:'Сила и тонус',category:'strength',level:'Средняя',items:[
    ['Присед к стулу','3 × 12','Ноги · ягодицы','Таз уводи назад, колени по линии стоп. Поднимайся через всю стопу.'],
    ['Ягодичный мост','3 × 15','Ягодицы','Подними таз на выдохе, мягко сожми ягодицы и опусти без рывка.'],
    ['Тяга бутылок к поясу','3 × 12','Спина · руки','Спина длинная, локти тяни назад к поясу.'],
    ['Отжимания от стола','3 × 8–12','Грудь · руки','Тело одной линией. Чем выше опора, тем легче.'],
    ['Румынская тяга с бутылками','3 × 12','Ягодицы · задняя поверхность бедра','Таз назад, спина нейтральная, вес близко к ногам.'],
    ['Жим бутылок вверх','3 × 10','Плечи · руки','Не прогибай поясницу, выжимай вверх плавно.'],
    ['Dead bug','2 × 8 / сторона','Кор','Поясница спокойно прижата к полу, движение медленное.']
  ]},
  LOWER:{title:'Силовая · ноги и ягодицы',duration:'25–32 мин',tone:'Низ тела',category:'strength',level:'Средняя',items:[
    ['Присед к стулу','3 × 12','Бёдра · ягодицы','Садись тазом назад и вставай через всю стопу.'],
    ['Выпад назад с опорой','3 × 8 / ногу','Ноги · ягодицы','Держись за опору и работай только в комфортной глубине.'],
    ['Ягодичный мост с паузой','3 × 15','Ягодицы','Задержись наверху на 1–2 секунды.'],
    ['Шаг на невысокую ступень','3 × 10 / ногу','Ноги · ягодицы','Вся стопа на устойчивой ступени, поднимайся рабочей ногой.'],
    ['Отведение ноги назад','3 × 12 / ногу','Ягодицы','Корпус не раскачивай, поясницу не прогибай.'],
    ['Подъёмы на носки','3 × 15','Икры','Поднимай пятки плавно и так же медленно опускай.']
  ]},
  UPPER:{title:'Силовая · руки и плечи',duration:'22–28 мин',tone:'Верх тела',category:'strength',level:'Средняя',items:[
    ['Отжимания от стола','3 × 8–12','Грудь · трицепс','Держи тело одной линией.'],
    ['Тяга бутылок к поясу','3 × 12','Спина · бицепс','Тяни локти назад, плечи не поднимай к ушам.'],
    ['Жим бутылок вверх','3 × 10','Плечи','Корпус устойчивый, без прогиба в пояснице.'],
    ['Разведение рук в стороны','2 × 12','Плечи','Лёгкий вес, локти слегка согнуты.'],
    ['Сгибание рук с бутылками','3 × 12','Бицепс','Локти остаются близко к корпусу.'],
    ['Разгибание рук из-за головы','2 × 10','Трицепс','Движение только в локтях, без рывка.']
  ]},
  GLUTES:{title:'Ягодицы · тонус',duration:'22–28 мин',tone:'Ягодицы и бёдра',category:'strength',level:'Средняя',items:[
    ['Ягодичный мост с паузой','3 × 15','Ягодицы','В верхней точке задержись и не перегибай поясницу.'],
    ['Присед к стулу','3 × 12','Ягодицы · бёдра','Таз назад, колени по линии носков.'],
    ['Отведение ноги назад','3 × 12 / ногу','Ягодицы','Двигай ногой без раскачки корпуса.'],
    ['Отведение ноги лёжа на боку','3 × 12 / сторону','Средняя ягодичная','Таз не заваливай назад.'],
    ['Румынская тяга с бутылками','3 × 10','Ягодицы · задняя поверхность бедра','Таз назад, спина длинная.'],
    ['Frog pumps','2 × 20','Ягодицы','Колени разведены комфортно, движение короткое и контролируемое.']
  ]},
  CORE:{title:'Кор и талия',duration:'18–24 мин',tone:'Стабильный корпус',category:'core',level:'Средняя',items:[
    ['Dead bug','3 × 8 / сторону','Глубокий кор','Поясница прижата, амплитуда только комфортная.'],
    ['Bird dog','3 × 8 / сторону','Кор · спина','Таз не разворачивай.'],
    ['Касание пяток лёжа','3 × 12 / сторону','Косые мышцы живота','Не тяни шею, движение короткое.'],
    ['Марш в ягодичном мосту','3 × 8 / ногу','Кор · ягодицы','Сохраняй таз примерно на одном уровне.'],
    ['Боковая планка с колен','2 × 20 сек / сторону','Кор · боковая линия','Плечо не проваливай, таз держи поднятым.'],
    ['Стоя колено к противоположному локтю','2 × 12 / сторону','Кор · координация','Не гонись за скоростью.']
  ]},
  ABS:{title:'Пресс и живот · без прыжков',duration:'16–22 мин',tone:'Живот и глубокий кор',category:'core',level:'Средняя',items:[
    ['Dead bug — пятка вниз','3 × 10 / сторону','Низ живота','На выдохе опускай пятку, поясница остаётся спокойно на полу.'],
    ['Касание пяток лёжа','3 × 14 / сторону','Косые мышцы живота','Лопатки слегка приподняты, шея расслаблена.'],
    ['Bird dog','3 × 8 / сторону','Кор · спина','Вытягивайся длинно, таз не разворачивай.'],
    ['Боковая планка с колен','2 × 25 сек / сторону','Боковая линия','Дыши спокойно, не задерживай дыхание.'],
    ['Марш в ягодичном мосту','3 × 8 / ногу','Кор · низ живота','Не раскачивай таз.'],
    ['Стоя колено к противоположному локтю','3 × 12 / сторону','Пресс · координация','Подкручивай корпус мягко, без рывков.']
  ]},
  BACK:{title:'Здоровая спина',duration:'18–24 мин',tone:'Спина и разгрузка',category:'back',level:'Лёгкая',items:[
    ['Кошка-корова','2 × 8','Позвоночник','Двигай позвоночником плавно вместе с дыханием.'],
    ['Bird dog','3 × 8 / сторону','Спина · кор','Не разворачивай таз.'],
    ['Тяга к поясу','3 × 12','Спина · руки','Тяни локти назад к тазу, плечи опущены.'],
    ['Скольжение руками по стене','2 × 12','Лопатки · плечи','Поднимай руки только без боли.'],
    ['Наклоны-таз назад без веса','3 × 12','Задняя цепь','Сохраняй длинную спину.'],
    ['Поза ребёнка','2 × 30 сек','Спина · дыхание','Расслабь плечи и дыши спокойно.']
  ]},
  POSTURE:{title:'Осанка и лопатки',duration:'15–20 мин',tone:'Осанка',category:'back',level:'Лёгкая',items:[
    ['Скольжение руками по стене','3 × 10','Лопатки · плечи','Рёбра не выпячивай, плечи не тяни к ушам.'],
    ['Обратные разведения','3 × 10','Верх спины','Лёгкий вес, движение от лопаток.'],
    ['Y-подъёмы лёжа/в наклоне','2 × 10','Лопатки','Небольшая амплитуда, шея расслаблена.'],
    ['Тяга бутылок к поясу','3 × 12','Спина','Локти назад, грудная клетка открыта.'],
    ['Раскрытие груди у стены','2 × 30 сек / сторону','Грудь · плечи','Поворачивай корпус мягко, без боли.'],
    ['Bird dog','2 × 8 / сторону','Кор · осанка','Вытягивайся длинно и стабильно.']
  ]},
  PILATES:{title:'Пилатес · всё тело',duration:'20–26 мин',tone:'Контроль и тонус',category:'pilates',level:'Лёгкая',items:[
    ['Дыхание и нейтральный таз','2 мин','Дыхание · кор','На выдохе мягко подтяни низ живота.'],
    ['Dead bug — обучение','2 × 8 / сторону','Кор','Двигайся медленно, не отрывая поясницу.'],
    ['Ягодичный мост','3 × 12','Ягодицы · таз','Поднимай таз на выдохе.'],
    ['Bird dog','2 × 8 / сторону','Спина · кор','Таз остаётся ровным.'],
    ['Отведение ноги лёжа на боку','2 × 12 / сторону','Ягодицы · бёдра','Корпус не заваливай назад.'],
    ['Боковая планка с колен','2 × 20 сек / сторону','Кор','Дыши спокойно.'],
    ['Скольжение руками по стене','2 × 10','Осанка','Двигайся без боли и подъёма плеч.']
  ]},
  PILATES_CORE:{title:'Пилатес · кор и талия',duration:'16–22 мин',tone:'Глубокий кор',category:'pilates',level:'Лёгкая',items:[
    ['Дыхание и нейтральный таз','90 сек','Дыхание · глубокий кор','На выдохе мягко активируй низ живота.'],
    ['Dead bug — пятка вниз','3 × 8 / сторону','Низ живота','Поясница остаётся на полу.'],
    ['Касание пяток лёжа','2 × 12 / сторону','Талия','Не тяни шею.'],
    ['Марш в ягодичном мосту','2 × 8 / ногу','Кор · ягодицы','Таз ровный.'],
    ['Bird dog','2 × 8 / сторону','Кор · спина','Двигайся медленно.'],
    ['Боковая планка с колен','2 × 20 сек / сторону','Боковая линия','Сохраняй дыхание.']
  ]},
  YOGA:{title:'Йога · мягкий поток',duration:'18–24 мин',tone:'Гибкость и дыхание',category:'yoga',level:'Лёгкая',items:[
    ['Дыхание стоя','60 сек','Дыхание','Выпрямись и сделай несколько спокойных циклов дыхания.'],
    ['Кошка-корова','2 × 8','Позвоночник','Чередуй округление и мягкое раскрытие спины.'],
    ['Собака мордой вниз','2 × 30 сек','Спина · ноги','Колени можно слегка согнуть, спину удлиняй.'],
    ['Низкий выпад','2 × 30 сек / сторону','Бёдра · таз','Таз направляй вперёд мягко, без боли.'],
    ['Поза кобры мягкая','2 × 20 сек','Грудь · спина','Поднимай грудь невысоко, не зажимай поясницу.'],
    ['Поза ребёнка','45 сек','Спина · дыхание','Расслабь плечи, спокойно дыши.']
  ]},
  YOGA_BACK:{title:'Йога · спина и плечи',duration:'14–20 мин',tone:'Мягкая спина',category:'yoga',level:'Лёгкая',items:[
    ['Кошка-корова','2 × 8','Позвоночник','Двигайся плавно с дыханием.'],
    ['Поза ребёнка','45 сек','Спина','Плечи расслаблены.'],
    ['Собака мордой вниз','2 × 30 сек','Спина · плечи','Удлиняй спину, колени можно согнуть.'],
    ['Раскрытие груди у стены','2 × 30 сек / сторону','Грудь · плечи','Без боли и рывков.'],
    ['Поза кобры мягкая','2 × 20 сек','Грудной отдел','Не стремись подняться высоко.'],
    ['Скрутка лёжа','2 × 30 сек / сторону','Спина · бока','Плечи оставляй на полу.']
  ]},
  PELVIC:{title:'Тазовое дно · мягко',duration:'12–18 мин',tone:'Дыхание и контроль',category:'pelvic',level:'Очень лёгкая',items:[
    ['Диафрагмальное дыхание','2 мин','Дыхание · тазовое дно','На вдохе расслабь низ живота и тазовое дно, на выдохе мягко собери без натуживания.'],
    ['Мягкий лифт тазового дна','2 × 6','Тазовое дно','Сокращение лёгкое, без задержки дыхания и без сильного сжатия.'],
    ['Скольжение пяткой лёжа','2 × 8 / сторону','Кор · таз','На выдохе медленно выдвигай пятку и возвращай.'],
    ['Ягодичный мост с выдохом','2 × 10','Ягодицы · таз','Поднимай таз на выдохе, без давления вниз.'],
    ['Ракушка лёжа на боку','2 × 12 / сторону','Ягодицы · таз','Стопы вместе, верхнее колено открывай без разворота таза.'],
    ['Bird dog лёгкий','2 × 6 / сторону','Кор · таз','Сначала можно вытягивать только руку или только ногу.']
  ]},
  MOBILITY:{title:'Мобилизация всего тела',duration:'12–18 мин',tone:'Подвижность',category:'recovery',level:'Очень лёгкая',items:[
    ['Кошка-корова','2 × 8','Позвоночник','Плавное движение с дыханием.'],
    ['Круги плечами','2 × 10','Плечи','Двигай плечами медленно и широко.'],
    ['Раскрытие груди у стены','2 × 30 сек / сторону','Грудь','Без боли.'],
    ['Наклоны-таз назад без веса','2 × 12','Таз · задняя поверхность бедра','Спина длинная.'],
    ['Боковой шаг + мягкий присед','2 × 10 / сторону','Таз · бёдра','Движение мягкое и контролируемое.'],
    ['Поза ребёнка','45 сек','Спина','Расслабь дыхание.']
  ]},
  CARDIO:{title:'Кардио без прыжков',duration:'18–24 мин',tone:'Пульс без ударной нагрузки',category:'cardio',level:'Средняя',items:[
    ['Марш на месте','3 × 45 сек','Кардио · всё тело','Держи бодрый, но контролируемый темп.'],
    ['Шаг в сторону + касание','3 × 40 сек','Кардио · ноги','Добавь движения руками.'],
    ['Подъём колен поочерёдно','3 × 40 сек','Кардио · кор','Не сутулься.'],
    ['Присед + подъём рук','3 × 12','Ноги · пульс','Без прыжка, темп умеренный.'],
    ['Шаг конькобежца без прыжка','3 × 40 сек','Кардио · ягодицы','Переноси вес мягко.'],
    ['Бокс стоя','3 × 45 сек','Кардио · руки','Удары контролируемые, локоть не блокируй.']
  ]},
  INTERVAL:{title:'Интервальная · без прыжков',duration:'16–20 мин',tone:'Интенсивнее, но бережно',category:'cardio',level:'Выше средней',items:[
    ['Марш с высоким коленом','3 × 40 сек','Кардио · кор','Поднимай колени до комфортной высоты.'],
    ['Присед + подъём рук','3 × 40 сек','Ноги · пульс','Работай в своём темпе.'],
    ['Бокс стоя','3 × 40 сек','Кардио · руки','Корпус собран.'],
    ['Шаг конькобежца без прыжка','3 × 40 сек','Кардио · ягодицы','Шаг широкий, но мягкий.'],
    ['Стоя колено к противоположному локтю','3 × 40 сек','Кор · кардио','Чередуй стороны без рывков.']
  ]},
  STRETCH:{title:'Растяжка всего тела',duration:'10–16 мин',tone:'Восстановление',category:'recovery',level:'Очень лёгкая',items:[
    ['Поза ребёнка','45 сек','Спина','Спокойное дыхание.'],
    ['Собака мордой вниз','2 × 30 сек','Спина · ноги','Колени можно согнуть.'],
    ['Низкий выпад','2 × 30 сек / сторону','Передняя поверхность бедра','Не проваливайся в поясницу.'],
    ['Раскрытие груди у стены','2 × 30 сек / сторону','Грудь · плечи','Поворачивай корпус мягко.'],
    ['Скрутка лёжа','2 × 30 сек / сторону','Спина · бока','Плечи на полу.'],
    ['Дыхание лёжа','60 сек','Восстановление','Замедли дыхание и расслабь живот.']
  ]}
};

const schedule=['STRETCH','STRENGTH','PILATES','BACK','LOWER','YOGA','CORE'];
const categoryOrder=['all','strength','pilates','yoga','back','core','pelvic','cardio','recovery'];
const categoryLabel={all:'Все',strength:'Силовые',pilates:'Пилатес',yoga:'Йога',back:'Спина',core:'Пресс и кор',pelvic:'Тазовое дно',cardio:'Кардио',recovery:'Восстановление'};
const sessionKey='my60-workout-session-v3';
let activeCategory='all',tick=null,guard=false;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function key(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function currentType(){return schedule[new Date().getDay()]||'STRENGTH'}
function item(t,i){const r=W[t]&&W[t].items[i];return r?{name:r[0],dose:r[1],focus:r[2],tip:r[3]}:null}
function done(t,d){try{return !!(window.S&&S.workouts&&Array.isArray(S.workouts[key(d)])&&S.workouts[key(d)].indexOf(t)>=0)}catch(e){return false}}
function saveState(){try{if(typeof window.save==='function')window.save()}catch(e){}}
function markDone(t){try{if(!window.S)return;const k=typeof window.key==='function'?window.key():key();if(!S.workouts[k])S.workouts[k]=[];if(S.workouts[k].indexOf(t)<0)S.workouts[k].push(t);saveState()}catch(e){}}
function family(name){const n=name.toLowerCase();if(n.includes('кошка'))return'catcow';if(n.includes('ребён'))return'child';if(n.includes('собака'))return'dog';if(n.includes('кобр'))return'cobra';if(n.includes('скрут'))return'twist';if(n.includes('присед'))return'squat';if(n.includes('ягодичн')||n.includes('frog')||n.includes('мост'))return'bridge';if(n.includes('румын')||n.includes('наклоны-таз'))return'hinge';if(n.includes('тяга')||n.includes('обратные разведения'))return'pull';if(n.includes('отжим'))return'push';if(n.includes('dead bug')||n.includes('касание пяток')||n.includes('скольжение пяткой'))return'deadbug';if(n.includes('bird dog'))return'birddog';if(n.includes('выпад'))return'lunge';if(n.includes('жим бутылок')||n.includes('разгибание рук'))return'overhead';if(n.includes('разведение рук')||n.includes('y-подъёмы')||n.includes('круги плеч'))return'arms';if(n.includes('сгибание рук'))return'curl';if(n.includes('отведение ноги')||n.includes('ракушка'))return'leglift';if(n.includes('носочки')||n.includes('носки'))return'calf';if(n.includes('скольжение руками'))return'wallarms';if(n.includes('планка'))return'sideplank';if(n.includes('колено к противоположному'))return'cross';if(n.includes('ступень'))return'step';if(n.includes('марш')||n.includes('подъём колен'))return'march';if(n.includes('бокс'))return'box';if(n.includes('конькобеж'))return'skater';if(n.includes('шаг в сторону')||n.includes('боковой шаг'))return'sidestep';if(n.includes('дыхание')||n.includes('тазового дна')||n.includes('лифт тазового'))return'breathe';if(n.includes('раскрытие груди'))return'chest';return'generic'}
const guide={squat:['Старт: стопы устойчиво, корпус высокий.','Таз назад и вниз, затем встань через всю стопу.'],bridge:['Ляг на спину, колени согнуты, стопы на полу.','Подними таз и контролируемо вернись.'],hinge:['Колени мягкие, спина длинная.','Отведи таз назад и вернись, не округляя поясницу.'],pull:['Наклони корпус с ровной спиной.','Потяни локти назад к поясу и медленно распрями руки.'],push:['Упрись руками в устойчивую опору.','Согни локти и плавно выжми себя назад.'],deadbug:['Ляг на спину, поясница спокойно прижата.','Медленно удлини руку/ногу или пятку и вернись.'],birddog:['Встань на четвереньки.','Вытяни противоположные руку и ногу, таз ровный.'],lunge:['Стой ровно, при необходимости держись.','Сделай шаг назад и мягко согни ноги.'],overhead:['Вес у плеч, корпус собран.','Выжми руки вверх и опусти без прогиба.'],arms:['Плечи опущены, локти мягкие.','Подними/отведи руки и медленно верни.'],curl:['Локти у корпуса.','Согни руки и медленно опусти вес.'],leglift:['Корпус остаётся устойчивым.','Отведи/открой ногу без раскачки таза.'],calf:['Стой ровно и держись за опору.','Поднимись на носки и медленно опустись.'],wallarms:['Спина у стены, плечи опущены.','Скользи руками вверх и вниз без боли.'],sideplank:['Опора на предплечье и колени.','Подними таз и удерживай ровную линию.'],cross:['Стой устойчиво.','Подними колено к противоположному локтю.'],step:['Вся стопа на устойчивой ступени.','Поднимись рабочей ногой и контролируемо спустись.'],march:['Стой ровно, плечи расслаблены.','Чередуй подъём колен и движение рук.'],box:['Кулаки перед собой, колени мягкие.','Поочерёдно выпрямляй руки вперёд.'],skater:['Начни с мягких коленей.','Переноси вес широким шагом из стороны в сторону.'],sidestep:['Слегка согни колени.','Шагни в сторону и мягко вернись.'],breathe:['Займи удобное положение и расслабь плечи.','Дыши спокойно; на выдохе мягко активируй низ живота.'],chest:['Поставь ладонь/предплечье на стену.','Мягко поверни корпус от руки.'],catcow:['Встань на четвереньки.','Чередуй мягкое округление и раскрытие позвоночника.'],child:['Опустись тазом к пяткам.','Вытяни руки вперёд и расслабь спину.'],dog:['Ладони и стопы на полу, колени можно согнуть.','Уведи таз вверх и назад, удлиняя спину.'],cobra:['Ляг на живот, ладони возле груди.','Мягко приподними грудь, оставляя таз на полу.'],twist:['Ляг на спину, колени согнуты.','Опусти колени в сторону, плечи оставь на полу.'],generic:['Займи устойчивое стартовое положение.','Двигайся медленно и контролируемо по описанию.']};

function svg(name){const f=family(name);const C='<style>.b{stroke:#2f3431;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;fill:none}.h{fill:#2f3431}.a{stroke:#c76f77;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;fill:none}.g{stroke:#c7c5bf;stroke-width:4;stroke-linecap:round;fill:none}</style>';const frame=(x,l,b)=>'<g transform="translate('+x+' 0)"><rect x="4" y="5" width="142" height="158" rx="24" fill="#fbfaf7"/><text x="18" y="28" font-size="12" font-weight="800" fill="#8c8e89">'+l+'</text>'+b+'</g>';const stand='<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L51 93 M74 76 L97 93 M74 103 L60 144 M74 103 L88 144"/>';const P={
 squat:[stand,'<circle class="h" cx="74" cy="61" r="11"/><path class="b" d="M73 74 L63 105 M68 83 L40 98 M68 83 L96 96 M63 105 L42 124 L61 144 M63 105 L96 121 L102 145"/><path class="a" d="M38 146 H108"/>'],
 bridge:['<circle class="h" cx="35" cy="111" r="10"/><path class="b" d="M46 111 L82 112 L106 130 M82 112 L99 92 M106 130 L124 130 M99 92 L119 92"/><path class="g" d="M18 137 H132"/>','<circle class="h" cx="35" cy="113" r="10"/><path class="b" d="M46 112 L77 99 L103 82 M103 82 L122 113 M122 113 L132 113 M103 82 L119 82"/><path class="a" d="M56 108 Q78 83 103 82"/><path class="g" d="M18 137 H132"/>'],
 hinge:[stand,'<circle class="h" cx="101" cy="71" r="11"/><path class="b" d="M90 72 L63 93 L64 118 M70 92 L52 121 M70 92 L86 122 M64 118 L49 145 M64 118 L82 145"/><path class="a" d="M62 88 Q45 93 39 108"/>'],
 pull:['<circle class="h" cx="101" cy="66" r="11"/><path class="b" d="M90 70 L62 91 L64 119 M70 91 L47 123 M70 91 L91 124 M64 119 L49 145 M64 119 L82 145"/>','<circle class="h" cx="101" cy="66" r="11"/><path class="b" d="M90 70 L62 91 L64 119 M70 91 L43 102 M43 102 L58 116 M70 91 L97 101 M97 101 L83 116 M64 119 L49 145 M64 119 L82 145"/><path class="a" d="M44 102 Q68 87 96 101"/>'],
 push:['<path class="g" d="M118 38 V145"/><circle class="h" cx="88" cy="66" r="10"/><path class="b" d="M79 73 L61 90 L44 123 M61 90 L98 92 L116 76 M44 123 L31 145 M44 123 L64 145"/>','<path class="g" d="M118 38 V145"/><circle class="h" cx="103" cy="75" r="10"/><path class="b" d="M94 82 L69 94 L45 123 M69 94 L104 100 L116 86 M45 123 L31 145 M45 123 L64 145"/><path class="a" d="M104 100 L116 86"/>'],
 deadbug:['<circle class="h" cx="35" cy="118" r="9"/><path class="b" d="M45 117 L76 116 M76 116 L94 87 M76 116 L99 130 M65 113 L54 81 M66 113 L83 80"/><path class="g" d="M18 139 H132"/>','<circle class="h" cx="35" cy="118" r="9"/><path class="b" d="M45 117 L76 116 M76 116 L114 128 M76 116 L91 87 M65 113 L35 80 M66 113 L84 82"/><path class="a" d="M38 80 L28 70 M114 128 L128 132"/><path class="g" d="M18 139 H132"/>'],
 birddog:['<circle class="h" cx="95" cy="80" r="10"/><path class="b" d="M84 84 L59 99 L82 110 M62 98 L44 131 M82 110 L103 134 M72 95 L105 103"/><path class="g" d="M26 139 H129"/>','<circle class="h" cx="95" cy="80" r="10"/><path class="b" d="M84 84 L60 98 L82 110 M60 98 L30 78 M82 110 L120 123 M70 96 L101 103"/><path class="a" d="M30 78 L18 70 M120 123 L132 128"/><path class="g" d="M20 139 H132"/>'],
 lunge:[stand,'<circle class="h" cx="73" cy="51" r="11"/><path class="b" d="M73 64 L73 101 M73 75 L51 91 M73 75 L95 91 M73 101 L45 119 L31 145 M73 101 L102 119 L110 145"/><path class="a" d="M40 119 H106"/>'],
 overhead:[stand,'<circle class="h" cx="74" cy="55" r="11"/><path class="b" d="M74 68 L74 108 M74 78 L53 45 M74 78 L95 45 M74 108 L60 145 M74 108 L88 145"/><path class="a" d="M53 45 L48 30 M95 45 L100 30"/>'],
 arms:[stand,'<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 75 L37 75 M74 75 L111 75 M74 103 L60 144 M74 103 L88 144"/><path class="a" d="M37 75 H111"/>'],
 curl:[stand,'<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 75 L53 91 L59 70 M74 75 L95 91 L89 70 M74 103 L60 144 M74 103 L88 144"/><path class="a" d="M53 91 L59 70 M95 91 L89 70"/>'],
 leglift:[stand,'<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L52 94 M74 76 L96 94 M74 103 L60 144 M74 103 L113 119"/><path class="a" d="M86 136 Q104 130 113 119"/>'],
 calf:[stand,'<circle class="h" cx="74" cy="43" r="11"/><path class="b" d="M74 56 L74 99 M74 71 L53 88 M74 71 L95 88 M74 99 L61 137 M74 99 L87 137"/><path class="a" d="M56 143 Q73 134 92 143"/>'],
 wallarms:['<path class="g" d="M35 28 V148"/>'+stand,'<path class="g" d="M35 28 V148"/><circle class="h" cx="64" cy="50" r="10"/><path class="b" d="M60 62 L60 105 M60 74 L48 48 L50 29 M60 74 L75 48 L77 29 M60 105 L50 145 M60 105 L72 145"/><path class="a" d="M49 48 L50 29 M75 48 L77 29"/>'],
 sideplank:['<circle class="h" cx="44" cy="103" r="9"/><path class="b" d="M53 105 L82 111 L107 129 M64 108 L48 132 M107 129 L124 139"/><path class="g" d="M25 145 H130"/>','<circle class="h" cx="44" cy="87" r="9"/><path class="b" d="M53 89 L82 99 L108 118 M65 94 L48 130 M108 118 L125 137"/><path class="a" d="M51 89 Q78 93 108 118"/><path class="g" d="M25 145 H130"/>'],
 cross:[stand,'<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 102 M74 76 L51 66 M74 76 L91 91 M74 102 L57 144 M74 102 L96 119 L82 127"/><path class="a" d="M91 91 L82 127"/>'],
 step:['<path class="g" d="M74 126 H128 V146 H74"/>'+stand,'<path class="g" d="M74 126 H128 V146 H74"/><circle class="h" cx="91" cy="39" r="10"/><path class="b" d="M91 51 L91 92 M91 92 L82 126 M91 92 L108 126 M91 64 L72 82 M91 64 L110 82"/><path class="a" d="M75 126 H112"/>'],
 march:[stand,'<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L52 88 M74 76 L96 64 M74 103 L57 144 M74 103 L101 109 L87 128"/><path class="a" d="M101 109 L87 128"/>'],
 box:[stand,'<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L48 66 M74 76 L119 73 M74 103 L60 144 M74 103 L88 144"/><path class="a" d="M89 74 H122"/>'],
 skater:[stand,'<circle class="h" cx="90" cy="52" r="10"/><path class="b" d="M90 64 L81 102 M85 77 L59 89 M85 77 L111 94 M81 102 L58 129 M81 102 L110 140"/><path class="a" d="M42 144 H116"/>'],
 sidestep:[stand,'<circle class="h" cx="82" cy="52" r="10"/><path class="b" d="M82 64 L82 103 M82 77 L60 92 M82 77 L104 92 M82 103 L47 140 M82 103 L105 142"/><path class="a" d="M46 144 H109"/>'],
 breathe:[stand,'<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 105 M74 76 L55 95 M74 76 L93 95 M74 105 L60 144 M74 105 L88 144"/><path class="a" d="M48 88 Q74 62 100 88"/>'],
 chest:['<path class="g" d="M116 30 V146"/>'+stand,'<path class="g" d="M116 30 V146"/><circle class="h" cx="59" cy="47" r="10"/><path class="b" d="M59 59 L64 103 M62 75 L46 96 M62 75 L114 75 M64 103 L50 144 M64 103 L79 144"/><path class="a" d="M65 75 H114"/>'],
 catcow:['<circle class="h" cx="104" cy="83" r="9"/><path class="b" d="M94 88 Q75 78 54 95 M55 95 L42 132 M78 90 L92 128 M55 95 L80 108"/><path class="g" d="M24 139 H128"/>','<circle class="h" cx="104" cy="92" r="9"/><path class="b" d="M94 95 Q76 112 54 99 M55 99 L42 132 M78 104 L92 132 M55 99 L80 111"/><path class="a" d="M55 98 Q75 119 96 96"/><path class="g" d="M24 139 H128"/>'],
 child:['<circle class="h" cx="103" cy="95" r="9"/><path class="b" d="M93 99 L68 110 L46 128 M70 111 L105 130 M46 128 L35 143"/><path class="g" d="M22 146 H130"/>','<circle class="h" cx="97" cy="112" r="9"/><path class="b" d="M88 116 L60 125 L39 135 M62 126 L111 132 M39 135 L27 145"/><path class="a" d="M61 126 H112"/><path class="g" d="M22 146 H130"/>'],
 dog:['<circle class="h" cx="104" cy="78" r="9"/><path class="b" d="M94 83 L68 98 L46 131 M68 98 L94 126 M46 131 L31 145 M94 126 L111 145"/>','<circle class="h" cx="111" cy="105" r="9"/><path class="b" d="M101 109 L70 85 L42 129 M70 85 L92 142 M42 129 L29 145 M92 142 L108 145"/><path class="a" d="M68 84 Q81 69 95 88"/>'],
 cobra:['<circle class="h" cx="42" cy="123" r="9"/><path class="b" d="M51 124 L83 127 L116 137 M66 126 L54 143 M83 127 L96 143"/><path class="g" d="M22 146 H130"/>','<circle class="h" cx="56" cy="91" r="9"/><path class="b" d="M63 98 Q75 111 83 127 L116 137 M68 108 L54 140 M82 124 L96 143"/><path class="a" d="M61 100 Q73 103 82 126"/><path class="g" d="M22 146 H130"/>'],
 twist:['<circle class="h" cx="35" cy="118" r="9"/><path class="b" d="M45 117 L76 116 M76 116 L95 100 M76 116 L95 132"/><path class="g" d="M18 139 H132"/>','<circle class="h" cx="35" cy="118" r="9"/><path class="b" d="M45 117 L76 116 M76 116 L104 128 M76 116 L103 105"/><path class="a" d="M77 116 Q95 118 105 130"/><path class="g" d="M18 139 H132"/>'],
 generic:[stand,'<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L45 80 M74 76 L103 80 M74 103 L56 140 M74 103 L92 140"/><path class="a" d="M42 80 H106"/>']
};const v=P[f]||P.generic;return '<svg viewBox="0 0 300 170" role="img" aria-label="Схема '+esc(name)+'">'+C+frame(0,'СТАРТ',v[0])+frame(150,'ДВИЖЕНИЕ',v[1])+'<path d="M142 84h16" stroke="#c76f77" stroke-width="4" stroke-linecap="round"/><path d="M154 77l8 7-8 7" fill="none" stroke="#c76f77" stroke-width="4"/></svg>'}
function parseDose(s){s=String(s||'');const sm=s.match(/^(\d+)\s*[×x]/i),sets=sm?Math.max(1,+sm[1]):1,sec=s.match(/(?:×\s*)?(\d+)\s*сек/i),min=!sec?s.match(/^(\d+)\s*мин/i):null;return{sets:sets,seconds:sec?+sec[1]:(min?+min[1]*60:0)}}
function totalSets(t){return W[t].items.reduce((n,r)=>n+parseDose(r[1]).sets,0)}
function completedSets(s){let n=0;for(let i=0;i<s.e;i++)n+=parseDose(W[s.type].items[i][1]).sets;return n+s.set}
function load(){try{const x=JSON.parse(localStorage.getItem(sessionKey)||'null');return x&&W[x.type]?x:null}catch(e){return null}}
function store(s){try{s?localStorage.setItem(sessionKey,JSON.stringify(s)):localStorage.removeItem(sessionKey)}catch(e){}}
function injectStyle(){if(document.getElementById('my60LibraryStyle'))return;const st=document.createElement('style');st.id='my60LibraryStyle';st.textContent=`
#workoutStudio .studio-head,#workoutStudio .fitify-builder,#workoutStudio .workout-focus-tabs,#workoutStudio .workout-picker,#workoutStudio .active-workout-head,#workoutStudio .workout-progress,#workoutStudio .workout-timer,#workoutStudio .next-exercise,#workoutStudio #interactiveWorkoutList,#workoutStudio .workout-finish{display:none!important}
.my60-v2-hub{display:flex;flex-direction:column;gap:14px}.my60-library2{background:#fff;border:1px solid rgba(21,25,23,.06);border-radius:27px;padding:16px;box-shadow:0 10px 30px rgba(23,31,27,.05)}
.my60-cat-scroll{display:flex;gap:7px;overflow:auto;scrollbar-width:none;margin:0 -2px 14px;padding:2px}.my60-cat-scroll::-webkit-scrollbar{display:none}.my60-cat-scroll button{flex:none;border:0;border-radius:999px;padding:9px 12px;background:#f2f2ef;color:#6e746f;font-size:11px;font-weight:800}.my60-cat-scroll button.active{background:#171d1a;color:#fff}
.my60-grid2{display:grid;grid-template-columns:1fr 1fr;gap:9px}.my60-card2{border:1px solid rgba(21,25,23,.07);background:#fafaf8;border-radius:20px;padding:13px;text-align:left;color:#222825;min-height:112px}.my60-card2 strong{display:block;font-size:14px;line-height:1.18}.my60-card2 span{display:block;color:#8a8f8c;font-size:10px;margin-top:6px}.my60-card2 small{display:block;margin-top:8px;color:#b0646c;font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.07em}.my60-card2.today{border-color:#c76f77;background:#fbf3f1}
.my60-library-title{display:flex;justify-content:space-between;align-items:end;margin-bottom:12px}.my60-library-title span{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#929792;font-weight:850}.my60-library-title b{display:block;font-size:21px;margin-top:3px}.my60-library-title i{font-style:normal;color:#9a9e9a;font-size:11px}
.my60-pelvic-note{margin-top:10px;padding:10px 11px;border-radius:13px;background:#f6f1ec;color:#71665f;font-size:11px;line-height:1.4}
@media(max-width:430px){.my60-grid2{grid-template-columns:1fr 1fr}.my60-card2{padding:12px;min-height:108px}.my60-card2 strong{font-size:13px}}
`;document.head.appendChild(st)}
function weekStrip(){const now=new Date(),off=(now.getDay()+6)%7,mon=new Date(now);mon.setDate(now.getDate()-off);let out='<div class="my60-week-strip">';const labels=['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(mon.getDate()+i);const t=schedule[d.getDay()]||'STRENGTH',today=key(d)===key(now);out+='<div class="my60-day '+(today?'today ':'')+(done(t,d)?'done':'')+'"><span>'+labels[i]+'</span><b>'+(done(t,d)?'✓':d.getDate())+'</b></div>'}return out+'</div>'}
function hubMarkup(){const type=currentType(),m=W[type],resume=load(),first=item(type,0),types=Object.keys(W).filter(t=>activeCategory==='all'||W[t].category===activeCategory);return '<div class="my60-training-hub my60-v2-hub">'+weekStrip()+(resume?'<button class="my60-resume" onclick="My60Library.resume()"><b>Продолжить тренировку</b><span>'+esc(W[resume.type].title)+' · упражнение '+(resume.e+1)+' из '+W[resume.type].items.length+'</span></button>':'')+'<section class="my60-today-card"><div class="my60-today-visual">'+svg(first.name)+'</div><div class="my60-today-copy"><span>Сегодня · '+esc(m.tone)+'</span><h3>'+esc(m.title)+'</h3><p>'+esc(m.duration)+' · '+m.items.length+' упражнений · '+esc(m.level)+'</p><div class="my60-today-actions"><button class="my60-primary" onclick="My60Library.start(\''+type+'\')">'+(done(type)?'Повторить тренировку':'▶ Начать тренировку')+'</button><button class="my60-secondary" onclick="My60Library.preview(\''+type+'\')">Список</button></div></div></section><section class="my60-library2"><div class="my60-library-title"><div><span>Библиотека</span><b>Тренировки под настроение</b></div><i>'+Object.keys(W).length+' программ</i></div><div class="my60-cat-scroll">'+categoryOrder.map(c=>'<button class="'+(c===activeCategory?'active':'')+'" onclick="My60Library.filter(\''+c+'\')">'+categoryLabel[c]+'</button>').join('')+'</div><div class="my60-grid2">'+types.map(t=>'<button class="my60-card2 '+(t===type?'today':'')+'" onclick="My60Library.preview(\''+t+'\')"><strong>'+esc(W[t].title)+'</strong><span>'+esc(W[t].duration)+' · '+W[t].items.length+' упражнений</span><small>'+esc(W[t].tone)+'</small></button>').join('')+'</div>'+(activeCategory==='pelvic'?'<div class="my60-pelvic-note">Тазовое дно тренируем мягко: без натуживания и задержки дыхания. Если появляется боль, выраженная тяжесть или давление вниз — упражнение лучше остановить.</div>':'')+'</section></div>'}
function renderHub(){injectStyle();const studio=document.getElementById('workoutStudio');if(!studio)return false;guard=true;studio.dataset.my60Library='2';studio.innerHTML=hubMarkup();guard=false;return true}
function overlay(id,cls){let el=document.getElementById(id);if(!el){el=document.createElement('div');el.id=id;el.className=cls;document.body.appendChild(el)}return el}
function close(){document.querySelectorAll('.my60-preview,.my60-player').forEach(x=>x.classList.remove('open'));document.body.classList.remove('my60-workout-open');if(tick){clearInterval(tick);tick=null}}
function preview(type){if(!W[type])return;const m=W[type],root=overlay('my60WorkoutPreview','my60-preview');root.innerHTML='<div class="my60-overlay-inner"><div class="my60-overlay-top"><button onclick="My60Library.close()">×</button><div><span>'+esc(m.tone)+'</span><b>'+esc(m.title)+'</b></div><i></i></div><div class="my60-preview-hero"><span>'+esc(m.level)+'</span><h2>'+esc(m.title)+'</h2><p>'+esc(m.duration)+' · '+m.items.length+' упражнений</p><button class="my60-preview-start" onclick="My60Library.start(\''+type+'\')">▶ Начать</button></div><div class="my60-preview-list">'+m.items.map((r,i)=>'<div class="my60-preview-item"><div class="my60-preview-thumb">'+svg(r[0])+'</div><div><b>'+(i+1)+'. '+esc(r[0])+'</b><span>'+esc(r[2])+'</span><small>'+esc(r[1])+'</small></div></div>').join('')+'</div></div>';root.classList.add('open');document.body.classList.add('my60-workout-open')}
function newSession(type){const d=parseDose(W[type].items[0][1]);return{type:type,e:0,set:0,phase:'exercise',left:d.seconds||0,running:false,pending:null,started:Date.now()}}
function start(type){if(!W[type])return;const s=newSession(type);store(s);renderPlayer(s)}function resume(){const s=load();if(s)renderPlayer(s)}function timerText(v){return Math.floor(v/60)+':'+String(v%60).padStart(2,'0')}
function startTick(){if(tick)clearInterval(tick);tick=setInterval(()=>{const s=load();if(!s||!s.running)return;if(s.left>0)s.left--;if(s.left<=0){s.running=false;store(s);if(s.phase==='rest')advance(s);else completeSet(s);return}store(s);const el=document.getElementById('my60Clock');if(el)el.textContent=timerText(Math.max(0,s.left))},1000)}
function renderPlayer(s){if(!s||!W[s.type])return;close();const root=overlay('my60WorkoutPlayer','my60-player');root.classList.add('open');document.body.classList.add('my60-workout-open');if(s.phase==='finish')return finishMarkup(root,s);if(s.phase==='rest')return restMarkup(root,s);const ex=item(s.type,s.e),d=parseDose(ex.dose),g=guide[family(ex.name)]||guide.generic,pct=Math.round(completedSets(s)/totalSets(s.type)*100),dots=Array.from({length:d.sets},(_,i)=>'<i class="'+(i<s.set?'done':i===s.set?'now':'')+'"></i>').join('');root.innerHTML='<div class="my60-overlay-inner"><div class="my60-overlay-top"><button onclick="My60Library.close()">×</button><div><span>'+esc(W[s.type].title)+'</span><b>Упражнение '+(s.e+1)+' из '+W[s.type].items.length+'</b></div><button onclick="My60Library.preview(\''+s.type+'\')" style="font-size:16px">≡</button></div><div class="my60-progress"><span style="width:'+pct+'%"></span></div><div class="my60-player-card"><div class="my60-demo">'+svg(ex.name)+'</div><div class="my60-player-copy"><span>'+esc(ex.focus)+'</span><h2>'+esc(ex.name)+'</h2><div class="my60-dose">'+esc(ex.dose)+'</div><div class="my60-set-row"><div class="my60-set-dots">'+dots+'</div><span>Подход '+(s.set+1)+' из '+d.sets+'</span></div><div class="my60-how"><div><i>1</i><p>'+esc(g[0])+'</p></div><div><i>2</i><p>'+esc(g[1])+'</p></div></div><div class="my60-tip"><b>Важно:</b> '+esc(ex.tip)+'</div>'+(d.seconds?'<div class="my60-timer" style="--p:'+(s.left/d.seconds*100)+'%"><div><b id="my60Clock">'+timerText(s.left)+'</b><small>'+(s.running?'идёт время':'таймер')+'</small></div></div>':'')+'</div></div><div class="my60-player-actions"><button class="back" onclick="My60Library.back()">‹</button><button class="main" onclick="My60Library.primary()">'+(d.seconds?(s.running?'Пауза':'Старт '+timerText(d.seconds)):'Подход выполнен ✓')+'</button><button class="skip" onclick="My60Library.skip()">›</button></div></div>';store(s);if(s.running)startTick()}
function primary(){const s=load();if(!s)return;if(s.phase==='rest'){s.running=!s.running;store(s);renderPlayer(s);return}const d=parseDose(W[s.type].items[s.e][1]);if(d.seconds){s.running=!s.running;if(s.left<=0)s.left=d.seconds;store(s);renderPlayer(s)}else completeSet(s)}
function completeSet(s){const d=parseDose(W[s.type].items[s.e][1]);s.running=false;if(s.set+1<d.sets)s.pending={e:s.e,set:s.set+1};else if(s.e+1<W[s.type].items.length)s.pending={e:s.e+1,set:0};else{s.phase='finish';store(s);return renderPlayer(s)}s.phase='rest';s.left=20;s.running=true;store(s);renderPlayer(s)}
function advance(s){const p=s.pending||{e:Math.min(s.e+1,W[s.type].items.length-1),set:0};s.e=p.e;s.set=p.set;s.pending=null;s.phase='exercise';const d=parseDose(W[s.type].items[s.e][1]);s.left=d.seconds||0;s.running=false;store(s);renderPlayer(s)}
function skip(){const s=load();if(!s)return;if(s.phase==='rest')return advance(s);if(s.e+1>=W[s.type].items.length){s.phase='finish';store(s);return renderPlayer(s)}s.e++;s.set=0;const d=parseDose(W[s.type].items[s.e][1]);s.left=d.seconds||0;s.running=false;store(s);renderPlayer(s)}
function back(){const s=load();if(!s)return;if(s.phase==='rest'){s.phase='exercise';s.pending=null}else if(s.set>0)s.set--;else if(s.e>0){s.e--;s.set=Math.max(0,parseDose(W[s.type].items[s.e][1]).sets-1)}const d=parseDose(W[s.type].items[s.e][1]);s.left=d.seconds||0;s.running=false;store(s);renderPlayer(s)}
function restMarkup(root,s){const p=s.pending||{e:Math.min(s.e+1,W[s.type].items.length-1),set:0},next=item(s.type,p.e);root.innerHTML='<div class="my60-overlay-inner"><div class="my60-overlay-top"><button onclick="My60Library.close()">×</button><div><span>Отдых</span><b>'+esc(W[s.type].title)+'</b></div><i></i></div><div class="my60-rest-card"><span>Восстанови дыхание</span><h2>Отдых</h2><p>Следующий подход начнётся автоматически</p><div class="my60-timer" style="--p:'+(s.left/20*100)+'%"><div><b id="my60Clock">'+timerText(s.left)+'</b><small>отдых</small></div></div><div class="my60-rest-next"><div>'+svg(next.name)+'</div><div><span>Дальше</span><b>'+esc(next.name)+'</b><small>'+esc(next.dose)+'</small></div></div><div class="my60-player-actions"><button onclick="My60Library.moreRest()">+15</button><button class="main" onclick="My60Library.skipRest()">Пропустить отдых</button><button onclick="My60Library.primary()">'+(s.running?'Ⅱ':'▶')+'</button></div></div></div>';store(s);if(s.running)startTick()}
function moreRest(){const s=load();if(!s||s.phase!=='rest')return;s.left+=15;store(s);renderPlayer(s)}function skipRest(){const s=load();if(s&&s.phase==='rest')advance(s)}
function finishMarkup(root,s){markDone(s.type);store(null);root.innerHTML='<div class="my60-overlay-inner"><div class="my60-finish"><div class="my60-finish-mark">✓</div><h2>Тренировка готова</h2><p>'+esc(W[s.type].title)+' · '+W[s.type].items.length+' упражнений. На сегодня достаточно.</p><button onclick="My60Library.finish()">Готово</button></div></div>';renderHub()}
function finish(){close();renderHub()}
function filter(c){activeCategory=categoryOrder.includes(c)?c:'all';renderHub()}
window.My60Library={start,resume,preview,close,primary,skip,back,moreRest,skipRest,finish,filter};
function boot(){injectStyle();let tries=0;const iv=setInterval(()=>{tries++;if(renderHub()||tries>80)clearInterval(iv)},100);const obs=new MutationObserver(()=>{if(guard)return;const studio=document.getElementById('workoutStudio');if(studio&&!studio.querySelector('.my60-v2-hub'))requestAnimationFrame(renderHub)});obs.observe(document.body,{childList:true,subtree:true});document.addEventListener('click',e=>{if(e.target.closest('.nav button'))setTimeout(renderHub,150)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
