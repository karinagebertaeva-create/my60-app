(function(){
  'use strict';

  const W={
    A:{title:'Всё тело · база',duration:'30–35 мин',tone:'Силовая на всё тело',items:[
      ['Приседания к стулу','3 × 10','Ноги · ягодицы','Стопы примерно на ширине плеч. Таз уводи назад к стулу, колени направляй по линии стоп. Поднимайся без рывка.'],
      ['Ягодичный мост','3 × 12','Ягодицы','Ляг на спину, стопы ближе к тазу. Подними таз и мягко сожми ягодицы наверху. Не переразгибай поясницу.'],
      ['Тяга к поясу','3 × 10','Спина · руки','Корпус устойчивый. Тяни вес локтями назад к поясу, плечи не поднимай к ушам. Возвращай медленно.'],
      ['Отжимания от стены/стола','3 × 8–10','Грудь · руки','Тело держи одной линией. Сгибай локти под комфортным углом и приближай грудь к опоре, затем плавно выжимай себя назад.'],
      ['Румынская тяга','3 × 10','Задняя поверхность бедра','Колени слегка мягкие. Таз отводи назад, спина нейтральная. Опускай вес вдоль ног только до комфортного натяжения.'],
      ['Dead bug','2 × 8 / сторона','Кор','Поясница спокойно прижата к полу. Поочерёдно вытягивай противоположные руку и ногу, не спеша и без прогиба.']
    ]},
    B:{title:'Всё тело · вариация',duration:'30–35 мин',tone:'Силовая на всё тело',items:[
      ['Выпады назад / присед','3 × 8 / ногу','Ноги · ягодицы','Шагай назад достаточно далеко, чтобы передняя стопа оставалась устойчивой. Если выпады неудобны — замени на присед к стулу.'],
      ['Ягодичный мост','3 × 15','Ягодицы','Поднимай таз за счёт ягодиц, задержись наверху на секунду и опускайся контролируемо.'],
      ['Тяга к поясу','3 × 12','Спина · руки','Сохраняй длинную спину и тяни локти назад. Не дёргай вес и не округляй плечи.'],
      ['Жим бутылок вверх','3 × 10','Плечи · руки','Держи корпус собранным. Выжимай бутылки вверх без резкого прогиба в пояснице, опускай до комфортного уровня.'],
      ['Румынская тяга','3 × 10','Задняя поверхность бедра','Движение начинается тазом назад. Вес близко к ногам, шея продолжает линию спины.'],
      ['Bird dog','2 × 8 / сторона','Кор · спина','На четвереньках вытягивай противоположные руку и ногу. Таз не разворачивай, движение делай медленно.']
    ]},
    GLUTES:{title:'Ягодицы',duration:'25–30 мин',tone:'Тонус низа тела',items:[
      ['Ягодичный мост с паузой','3 × 15','Ягодицы','В верхней точке задержись на 1–2 секунды, сохраняя рёбра спокойно опущенными и не перегибая поясницу.'],
      ['Присед к стулу','3 × 12','Ягодицы · бёдра','Садись тазом назад, слегка касайся стула и поднимайся через всю стопу. Колени направлены по линии носков.'],
      ['Отведение ноги назад','3 × 12 / ногу','Ягодицы','Держись за опору. Отводи ногу назад без раскачки корпуса и без прогиба в пояснице.'],
      ['Отведение ноги лёжа на боку','3 × 12 / сторону','Средняя ягодичная','Таз не заваливай назад. Поднимай верхнюю ногу до комфортной высоты и опускай медленно.'],
      ['Румынская тяга с бутылками','3 × 10','Ягодицы · задняя поверхность бедра','Таз уходит назад, спина остаётся длинной. Бутылки скользят близко к ногам.'],
      ['Frog pumps','2 × 20','Ягодицы','Соедини стопы, колени разведи комфортно. Поднимай таз коротким контролируемым движением, работая ягодицами.']
    ]},
    LEGS:{title:'Ноги',duration:'25–30 мин',tone:'Бёдра · ягодицы · икры',items:[
      ['Присед к стулу','3 × 12','Бёдра · ягодицы','Контролируй опускание и поднимайся через всю стопу. Не позволяй коленям резко уходить внутрь.'],
      ['Выпад назад с опорой','3 × 8 / ногу','Ноги · ягодицы','Можно держаться за стул. Сделай шаг назад и опускайся только на комфортную глубину.'],
      ['Шаг на невысокую ступень','3 × 10 / ногу','Бёдра · ягодицы','Используй устойчивую невысокую ступень. Поднимайся за счёт рабочей ноги, без толчка второй ногой.'],
      ['Подъёмы на носки','3 × 15','Икры','Держись за опору, поднимай пятки плавно и так же медленно опускай.'],
      ['Статический присед у стены','3 × 30 сек','Бёдра','Спина опирается на стену. Выбери глубину, где можешь спокойно дышать и удерживать колени без дискомфорта.'],
      ['Боковые шаги в полуприседе','2 × 12 / сторону','Ягодицы · бёдра','Делай небольшие шаги, держи колени мягкими и корпус устойчивым.']
    ]},
    CORE:{title:'Кор и талия',duration:'20–25 мин',tone:'Стабильность корпуса',items:[
      ['Dead bug','3 × 8 / сторону','Глубокий кор','Поясница остаётся спокойно прижатой к полу. Уменьши амплитуду, если начинает тянуть поясницу.'],
      ['Bird dog','3 × 8 / сторону','Кор · спина','Тянись рукой и противоположной ногой в разные стороны, не разворачивая таз.'],
      ['Касание пяток лёжа','3 × 12 / сторону','Косые мышцы живота','Лопатки слегка приподняты, двигайся коротко в сторону пятки без рывков шеей.'],
      ['Марш в ягодичном мосту','3 × 8 / ногу','Кор · ягодицы','Удерживай таз примерно на одном уровне и поочерёдно слегка отрывай стопу от пола.'],
      ['Боковая планка с колен','2 × 20 сек / сторону','Кор · боковая линия','Опора на предплечье и колени. Корпус держи в одной линии, плечо не проваливай.'],
      ['Стоя колено к противоположному локтю','2 × 12 / сторону','Кор · координация','Работай без рывков, слегка подкручивая корпус. Это не упражнение на скорость.']
    ]},
    UPPER:{title:'Руки и плечи',duration:'25–30 мин',tone:'Верх тела',items:[
      ['Отжимания от стола','3 × 8–12','Грудь · трицепс','Чем выше опора, тем легче. Держи тело одной линией и опускайся контролируемо.'],
      ['Тяга бутылок к поясу','3 × 12','Спина · бицепс','Отведи таз назад, держи спину нейтральной и тяни локти к поясу.'],
      ['Жим бутылок вверх','3 × 10','Плечи','Не прогибайся в пояснице. Выжимай вес вверх плавно и опускай до комфортной высоты.'],
      ['Разведение рук в стороны','2 × 12','Плечи','Используй лёгкие бутылки. Локти слегка согнуты, плечи не поднимай к ушам.'],
      ['Сгибание рук с бутылками','3 × 12','Бицепс','Локти остаются близко к корпусу. Не раскачивайся и опускай вес медленно.'],
      ['Разгибание рук из-за головы','2 × 10','Трицепс','Возьми одну лёгкую бутылку двумя руками. Локти направлены вперёд, движение только в локтях.']
    ]},
    BACK:{title:'Спина и осанка',duration:'20–25 мин',tone:'Лопатки · спина · задняя цепь',items:[
      ['Тяга к поясу','3 × 12','Широчайшие · руки','Тяни локти назад к тазу, не поднимая плечи к ушам.'],
      ['Обратные разведения','3 × 10','Верх спины','С лёгкими бутылками слегка наклони корпус и разводи руки в стороны, сохраняя шею расслабленной.'],
      ['Bird dog','3 × 8 / сторону','Спина · кор','Двигайся медленно и не разворачивай таз.'],
      ['Y-подъёмы лёжа/в наклоне','2 × 10','Лопатки · верх спины','Руки образуют букву Y. Поднимай их небольшой амплитудой, чувствуя работу между лопатками.'],
      ['Скольжение руками по стене','2 × 12','Осанка · плечевой пояс','Спина у стены, руки плавно скользят вверх и вниз без боли в плечах.'],
      ['Наклоны-таз назад без веса','3 × 12','Задняя цепь · поясничная стабилизация','Учись двигаться тазом назад с длинной спиной, не округляя поясницу.']
    ]},
    PILATES:{title:'Пилатес · осанка',duration:'18–22 мин',tone:'Мягкий кор и спина',items:[
      ['Дыхание и нейтральный таз','2 мин','Дыхание · глубокий кор','На выдохе мягко подтяни низ живота, не задерживая дыхание.'],
      ['Dead bug — обучение','2 × 6 / сторона','Кор · контроль поясницы','Старт: колени над тазом, руки вверх. На выдохе медленно опусти только пятку. Если поясница отрывается — вернись выше.'],
      ['Скольжение руками по стене','2 × 10','Осанка · лопатки','Веди руки вверх только без боли и подъёма плеч к ушам.'],
      ['Bird dog','2 × 6 / сторона','Спина · кор','Таз не разворачивается, движение медленное.'],
      ['Раскрытие груди у стены','2 × 30 сек / сторона','Грудь · плечи','Поверни корпус от руки очень мягко, без боли.']
    ]},
    CARDIO:{title:'Кардио без прыжков',duration:'18–25 мин',tone:'Мягко разгоняем пульс',items:[
      ['Марш на месте','3 × 45 сек','Кардио · всё тело','Поддерживай темп, при котором дыхание учащается, но движение остаётся контролируемым.'],
      ['Шаг в сторону + касание','3 × 40 сек','Кардио · ноги','Шагай вправо-влево без прыжков. Добавь движения руками, если хочется больше интенсивности.'],
      ['Подъём колен поочерёдно','3 × 40 сек','Кардио · кор','Поднимай колени до комфортной высоты, не сутулясь и не задерживая дыхание.'],
      ['Присед + подъём рук','3 × 12','Ноги · пульс','Неглубокий присед и плавный подъём рук вверх. Темп умеренный, без прыжков.'],
      ['Шаг конькобежца без прыжка','3 × 40 сек','Кардио · ягодицы','Переноси вес с ноги на ногу широким шагом, оставляя движение мягким и без прыжка.'],
      ['Бокс стоя','3 × 45 сек','Кардио · руки','Чередуй прямые удары перед собой, корпус слегка собран. Не выпрямляй локоть резко до конца.']
    ]}
  };

  const schedule=['PILATES','A','CARDIO','GLUTES','B','UPPER','CORE'];
  const labels=['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ'];
  const sessionKey='my60-workout-session-v2';
  let tick=null;

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function todayKey(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function currentType(){return schedule[new Date().getDay()]||'A'}
  function item(type,i){const row=W[type]&&W[type].items[i];return row?{name:row[0],dose:row[1],focus:row[2],tip:row[3]}:null}
  function done(type,d){try{return !!(window.S&&S.workouts&&Array.isArray(S.workouts[todayKey(d)])&&S.workouts[todayKey(d)].indexOf(type)>=0)}catch(e){return false}}
  function saveState(){try{if(typeof window.save==='function')window.save()}catch(e){}}
  function markDone(type){try{if(!window.S)return;const k=typeof window.key==='function'?window.key():todayKey();if(!S.workouts[k])S.workouts[k]=[];if(S.workouts[k].indexOf(type)<0)S.workouts[k].push(type);saveState()}catch(e){}}

  function family(name){
    const n=name.toLowerCase();
    if(n.includes('присед'))return 'squat';
    if(n.includes('ягодичн')||n.includes('frog')||n.includes('мост'))return 'bridge';
    if(n.includes('румын')||n.includes('наклоны-таз'))return 'hinge';
    if(n.includes('тяга')||n.includes('обратные разведения'))return 'pull';
    if(n.includes('отжим'))return 'push';
    if(n.includes('dead bug')||n.includes('касание пяток'))return 'deadbug';
    if(n.includes('bird dog'))return 'birddog';
    if(n.includes('выпад'))return 'lunge';
    if(n.includes('жим бутылок')||n.includes('разгибание рук'))return 'overhead';
    if(n.includes('разведение рук')||n.includes('y-подъёмы'))return 'arms';
    if(n.includes('сгибание рук'))return 'curl';
    if(n.includes('отведение ноги лёжа')||n.includes('отведение ноги назад'))return 'leglift';
    if(n.includes('подъёмы на носки'))return 'calf';
    if(n.includes('у стены')&&n.includes('присед'))return 'wall';
    if(n.includes('скольжение руками'))return 'wallarms';
    if(n.includes('планка'))return 'sideplank';
    if(n.includes('колено к противоположному'))return 'cross';
    if(n.includes('ступень'))return 'step';
    if(n.includes('марш')||n.includes('подъём колен'))return 'march';
    if(n.includes('бокс'))return 'box';
    if(n.includes('конькобеж'))return 'skater';
    if(n.includes('шаг в сторону')||n.includes('боковые шаги'))return 'sidestep';
    if(n.includes('дыхание'))return 'breathe';
    if(n.includes('раскрытие груди'))return 'chest';
    return 'generic';
  }

  const guide={
    squat:['Старт: стопы устойчиво, корпус высокий.','Таз назад и вниз, затем встань через всю стопу.'],
    bridge:['Ляг на спину, согни колени, стопы на полу.','Подними таз до ровной линии плечи–таз–колени и опусти.'],
    hinge:['Колени мягкие, спина длинная, вес близко к ногам.','Отведи таз назад, наклони корпус без округления поясницы и вернись.'],
    pull:['Наклони корпус с ровной спиной, руки вниз.','Потяни локти назад к поясу и медленно распрями руки.'],
    push:['Упрись руками в устойчивую опору, тело одной линией.','Согни локти, приблизь грудь к опоре и выжми себя назад.'],
    deadbug:['Ляг на спину, поясница спокойно прижата, руки и колени вверх.','Медленно удлини противоположные руку и ногу, затем вернись.'],
    birddog:['Встань на четвереньки, ладони под плечами, колени под тазом.','Вытяни противоположные руку и ногу, не разворачивая таз.'],
    lunge:['Стой ровно, при необходимости держись за опору.','Сделай шаг назад и мягко согни обе ноги, затем вернись.'],
    overhead:['Держи лёгкий вес у плеч, живот собран.','Выжми руки вверх без прогиба в пояснице и опусти.'],
    arms:['Плечи опусти, локти слегка мягкие.','Подними руки до комфортной линии и медленно опусти.'],
    curl:['Локти прижаты к корпусу, руки вниз.','Согни локти, подними вес к плечам и медленно опусти.'],
    leglift:['Корпус остаётся неподвижным.','Отведи рабочую ногу в нужную сторону без раскачки и верни.'],
    calf:['Стой ровно и держись за опору.','Поднимись на носки, задержись и медленно опусти пятки.'],
    wall:['Прижми спину к стене, стопы немного впереди.','Скользни вниз до комфортной глубины и удерживай положение.'],
    wallarms:['Спина у стены, локти согнуты.','Скользи руками вверх и вниз, не поднимая плечи к ушам.'],
    sideplank:['Ляг на бок, опора на предплечье и согнутые колени.','Подними таз, сохрани прямую линию плечо–таз–колени.'],
    cross:['Стой устойчиво, руки у головы или груди.','Подними колено к противоположному локтю и чередуй стороны.'],
    step:['Поставь всю стопу на устойчивую невысокую ступень.','Поднимись за счёт верхней ноги и контролируемо спустись.'],
    march:['Стой ровно, плечи расслаблены.','Поочерёдно поднимай колени и двигай руками в удобном темпе.'],
    box:['Стой устойчиво, кулаки перед лицом.','Поочерёдно выпрямляй руки вперёд без резкого блокирования локтя.'],
    skater:['Начни с мягких коленей и переноса веса.','Сделай широкий шаг в сторону и перенеси вес, затем в другую.'],
    sidestep:['Слегка согни колени, корпус устойчивый.','Шагни в сторону, приставь вторую ногу и повтори обратно.'],
    breathe:['Ляг или сядь удобно, рёбра и живот расслаблены.','Вдохни спокойно, на выдохе мягко подтяни низ живота.'],
    chest:['Поставь ладонь или предплечье на стену.','Мягко поверни корпус от руки до комфортного растяжения груди.'],
    generic:['Займи устойчивое стартовое положение.','Двигайся медленно и контролируемо по описанию упражнения.']
  };

  function svg(name){
    const f=family(name);
    const common='<style>.b{stroke:#2f3431;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;fill:none}.h{fill:#2f3431}.a{stroke:#c76f77;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;fill:none}.g{stroke:#c7c5bf;stroke-width:4;stroke-linecap:round;fill:none}</style>';
    const frame=(x,label,body)=>'<g transform="translate('+x+' 0)"><rect x="4" y="5" width="142" height="158" rx="24" fill="#fbfaf7"/><text x="18" y="28" font-size="12" font-weight="800" fill="#8c8e89">'+label+'</text>'+body+'</g>';
    const P={
      squat:[
        '<circle class="h" cx="75" cy="48" r="11"/><path class="b" d="M75 61 L75 102 M75 72 L48 86 M75 72 L102 86 M75 102 L58 142 M75 102 L92 142"/>',
        '<circle class="h" cx="74" cy="61" r="11"/><path class="b" d="M73 74 L63 105 M68 83 L40 98 M68 83 L96 96 M63 105 L42 124 L61 144 M63 105 L96 121 L102 145"/><path class="a" d="M38 146 H108"/>'
      ],
      bridge:[
        '<circle class="h" cx="35" cy="111" r="10"/><path class="b" d="M46 111 L82 112 L106 130 M82 112 L99 92 M106 130 L124 130 M99 92 L119 92"/><path class="g" d="M18 137 H132"/>',
        '<circle class="h" cx="35" cy="113" r="10"/><path class="b" d="M46 112 L77 99 L103 82 M103 82 L122 113 M122 113 L132 113 M103 82 L119 82"/><path class="a" d="M56 108 Q78 83 103 82"/><path class="g" d="M18 137 H132"/>'
      ],
      hinge:[
        '<circle class="h" cx="72" cy="47" r="11"/><path class="b" d="M72 60 L73 101 M72 72 L50 95 M72 72 L94 95 M73 101 L59 143 M73 101 L88 143"/>',
        '<circle class="h" cx="101" cy="71" r="11"/><path class="b" d="M90 72 L63 93 L64 118 M70 92 L52 121 M70 92 L86 122 M64 118 L49 145 M64 118 L82 145"/><path class="a" d="M62 88 Q45 93 39 108"/>'
      ],
      pull:[
        '<circle class="h" cx="101" cy="66" r="11"/><path class="b" d="M90 70 L62 91 L64 119 M70 91 L47 123 M70 91 L91 124 M64 119 L49 145 M64 119 L82 145"/>',
        '<circle class="h" cx="101" cy="66" r="11"/><path class="b" d="M90 70 L62 91 L64 119 M70 91 L43 102 M43 102 L58 116 M70 91 L97 101 M97 101 L83 116 M64 119 L49 145 M64 119 L82 145"/><path class="a" d="M44 102 Q68 87 96 101"/>'
      ],
      push:[
        '<path class="g" d="M118 38 V145"/><circle class="h" cx="88" cy="66" r="10"/><path class="b" d="M79 73 L61 90 L44 123 M61 90 L98 92 L116 76 M44 123 L31 145 M44 123 L64 145"/>',
        '<path class="g" d="M118 38 V145"/><circle class="h" cx="103" cy="75" r="10"/><path class="b" d="M94 82 L69 94 L45 123 M69 94 L104 100 L116 86 M45 123 L31 145 M45 123 L64 145"/><path class="a" d="M104 100 L116 86"/>'
      ],
      deadbug:[
        '<circle class="h" cx="35" cy="118" r="9"/><path class="b" d="M45 117 L76 116 M76 116 L94 87 M76 116 L99 130 M65 113 L54 81 M66 113 L83 80"/><path class="g" d="M18 139 H132"/>',
        '<circle class="h" cx="35" cy="118" r="9"/><path class="b" d="M45 117 L76 116 M76 116 L114 128 M76 116 L91 87 M65 113 L35 80 M66 113 L84 82"/><path class="a" d="M38 80 L28 70 M114 128 L128 132"/><path class="g" d="M18 139 H132"/>'
      ],
      birddog:[
        '<circle class="h" cx="95" cy="80" r="10"/><path class="b" d="M84 84 L59 99 L82 110 M62 98 L44 131 M82 110 L103 134 M72 95 L105 103"/><path class="g" d="M26 139 H129"/>',
        '<circle class="h" cx="95" cy="80" r="10"/><path class="b" d="M84 84 L60 98 L82 110 M60 98 L30 78 M82 110 L120 123 M70 96 L101 103"/><path class="a" d="M30 78 L18 70 M120 123 L132 128"/><path class="g" d="M20 139 H132"/>'
      ],
      lunge:[
        '<circle class="h" cx="73" cy="47" r="11"/><path class="b" d="M73 60 L73 102 M73 73 L51 90 M73 73 L95 90 M73 102 L60 143 M73 102 L87 143"/>',
        '<circle class="h" cx="73" cy="51" r="11"/><path class="b" d="M73 64 L73 101 M73 75 L51 91 M73 75 L95 91 M73 101 L45 119 L31 145 M73 101 L102 119 L110 145"/><path class="a" d="M40 119 H106"/>'
      ],
      overhead:[
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 74 L49 88 M74 74 L99 88 M74 103 L60 144 M74 103 L88 144"/>',
        '<circle class="h" cx="74" cy="55" r="11"/><path class="b" d="M74 68 L74 108 M74 78 L53 45 M74 78 L95 45 M74 108 L60 145 M74 108 L88 145"/><path class="a" d="M53 45 L48 30 M95 45 L100 30"/>'
      ],
      arms:[
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 75 L55 108 M74 75 L93 108 M74 103 L60 144 M74 103 L88 144"/>',
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 75 L37 75 M74 75 L111 75 M74 103 L60 144 M74 103 L88 144"/><path class="a" d="M37 75 H111"/>'
      ],
      curl:[
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 75 L55 108 M74 75 L93 108 M74 103 L60 144 M74 103 L88 144"/>',
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 75 L53 91 L59 70 M74 75 L95 91 L89 70 M74 103 L60 144 M74 103 L88 144"/><path class="a" d="M53 91 L59 70 M95 91 L89 70"/>'
      ],
      leglift:[
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L52 94 M74 76 L96 94 M74 103 L61 144 M74 103 L87 144"/>',
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L52 94 M74 76 L96 94 M74 103 L60 144 M74 103 L113 119"/><path class="a" d="M86 136 Q104 130 113 119"/>'
      ],
      calf:[
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 75 L53 92 M74 75 L95 92 M74 103 L61 144 M74 103 L87 144"/>',
        '<circle class="h" cx="74" cy="43" r="11"/><path class="b" d="M74 56 L74 99 M74 71 L53 88 M74 71 L95 88 M74 99 L61 137 M74 99 L87 137"/><path class="a" d="M56 143 Q73 134 92 143"/>'
      ],
      wall:[
        '<path class="g" d="M35 28 V148"/><circle class="h" cx="54" cy="48" r="10"/><path class="b" d="M51 60 L51 101 M51 101 L72 124 L91 145 M51 101 L44 132 L44 145"/>',
        '<path class="g" d="M35 28 V148"/><circle class="h" cx="55" cy="61" r="10"/><path class="b" d="M51 72 L51 105 M51 105 L77 105 L100 133 M51 105 L50 133 L74 145"/><path class="a" d="M50 105 H79"/>'
      ],
      wallarms:[
        '<path class="g" d="M35 28 V148"/><circle class="h" cx="64" cy="50" r="10"/><path class="b" d="M60 62 L60 105 M60 74 L45 90 L51 108 M60 74 L77 89 L71 108 M60 105 L50 145 M60 105 L72 145"/>',
        '<path class="g" d="M35 28 V148"/><circle class="h" cx="64" cy="50" r="10"/><path class="b" d="M60 62 L60 105 M60 74 L48 48 L50 29 M60 74 L75 48 L77 29 M60 105 L50 145 M60 105 L72 145"/><path class="a" d="M49 48 L50 29 M75 48 L77 29"/>'
      ],
      sideplank:[
        '<circle class="h" cx="44" cy="103" r="9"/><path class="b" d="M53 105 L82 111 L107 129 M64 108 L48 132 M107 129 L124 139"/><path class="g" d="M25 145 H130"/>',
        '<circle class="h" cx="44" cy="87" r="9"/><path class="b" d="M53 89 L82 99 L108 118 M65 94 L48 130 M108 118 L125 137"/><path class="a" d="M51 89 Q78 93 108 118"/><path class="g" d="M25 145 H130"/>'
      ],
      cross:[
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L51 64 M74 76 L97 64 M74 103 L60 144 M74 103 L88 144"/>',
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 102 M74 76 L51 66 M74 76 L91 91 M74 102 L57 144 M74 102 L96 119 L82 127"/><path class="a" d="M91 91 L82 127"/>'
      ],
      step:[
        '<path class="g" d="M74 126 H128 V146 H74"/><circle class="h" cx="53" cy="51" r="10"/><path class="b" d="M53 63 L53 104 M53 104 L39 145 M53 104 L82 126 M53 76 L34 94 M53 76 L72 94"/>',
        '<path class="g" d="M74 126 H128 V146 H74"/><circle class="h" cx="91" cy="39" r="10"/><path class="b" d="M91 51 L91 92 M91 92 L82 126 M91 92 L108 126 M91 64 L72 82 M91 64 L110 82"/><path class="a" d="M75 126 H112"/>'
      ],
      march:[
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L51 93 M74 76 L97 93 M74 103 L60 144 M74 103 L88 144"/>',
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L52 88 M74 76 L96 64 M74 103 L57 144 M74 103 L101 109 L87 128"/><path class="a" d="M101 109 L87 128"/>'
      ],
      box:[
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L56 68 M74 76 L92 68 M74 103 L60 144 M74 103 L88 144"/>',
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L48 66 M74 76 L119 73 M74 103 L60 144 M74 103 L88 144"/><path class="a" d="M89 74 H122"/>'
      ],
      skater:[
        '<circle class="h" cx="74" cy="52" r="10"/><path class="b" d="M74 64 L66 102 M70 76 L48 92 M70 76 L96 88 M66 102 L45 137 M66 102 L92 130"/>',
        '<circle class="h" cx="90" cy="52" r="10"/><path class="b" d="M90 64 L81 102 M85 77 L59 89 M85 77 L111 94 M81 102 L58 129 M81 102 L110 140"/><path class="a" d="M42 144 H116"/>'
      ],
      sidestep:[
        '<circle class="h" cx="74" cy="52" r="10"/><path class="b" d="M74 64 L74 103 M74 77 L52 92 M74 77 L96 92 M74 103 L61 144 M74 103 L87 144"/>',
        '<circle class="h" cx="82" cy="52" r="10"/><path class="b" d="M82 64 L82 103 M82 77 L60 92 M82 77 L104 92 M82 103 L47 140 M82 103 L105 142"/><path class="a" d="M46 144 H109"/>'
      ],
      breathe:[
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 105 M74 76 L55 95 M74 76 L93 95 M74 105 L60 144 M74 105 L88 144"/><path class="g" d="M52 86 Q74 69 96 86"/>',
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 105 M74 76 L55 95 M74 76 L93 95 M74 105 L60 144 M74 105 L88 144"/><path class="a" d="M48 88 Q74 62 100 88"/>'
      ],
      chest:[
        '<path class="g" d="M116 30 V146"/><circle class="h" cx="74" cy="47" r="10"/><path class="b" d="M74 59 L74 103 M74 75 L55 94 M74 75 L114 75 M74 103 L60 144 M74 103 L88 144"/>',
        '<path class="g" d="M116 30 V146"/><circle class="h" cx="59" cy="47" r="10"/><path class="b" d="M59 59 L64 103 M62 75 L46 96 M62 75 L114 75 M64 103 L50 144 M64 103 L79 144"/><path class="a" d="M65 75 H114"/>'
      ],
      generic:[
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L51 93 M74 76 L97 93 M74 103 L60 144 M74 103 L88 144"/>',
        '<circle class="h" cx="74" cy="47" r="11"/><path class="b" d="M74 60 L74 103 M74 76 L45 80 M74 76 L103 80 M74 103 L56 140 M74 103 L92 140"/><path class="a" d="M42 80 H106"/>'
      ]
    };
    const v=P[f]||P.generic;
    return '<svg viewBox="0 0 300 170" role="img" aria-label="Схема упражнения '+esc(name)+'">'+common+frame(0,'СТАРТ',v[0])+frame(150,'ДВИЖЕНИЕ',v[1])+'<path d="M142 84h16" stroke="#c76f77" stroke-width="4" stroke-linecap="round"/><path d="M154 77l8 7-8 7" fill="none" stroke="#c76f77" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function parseDose(dose){
    const s=String(dose||'');
    const setMatch=s.match(/^(\d+)\s*[×x]/i); const sets=setMatch?Math.max(1,+setMatch[1]):1;
    const sec=s.match(/(?:×\s*)?(\d+)\s*сек/i); const min=!sec?s.match(/^(\d+)\s*мин/i):null;
    return {sets:sets,seconds:sec?+sec[1]:(min?+min[1]*60:0),label:setMatch?s.split(/×/).slice(1).join('×').trim():s};
  }
  function totalSets(type){return W[type].items.reduce((n,r)=>n+parseDose(r[1]).sets,0)}
  function sessionCompletedSets(s){let n=0;for(let i=0;i<s.e;i++)n+=parseDose(W[s.type].items[i][1]).sets;n+=s.set;return n}
  function loadSession(){try{const x=JSON.parse(localStorage.getItem(sessionKey)||'null');return x&&W[x.type]?x:null}catch(e){return null}}
  function storeSession(s){try{s?localStorage.setItem(sessionKey,JSON.stringify(s)):localStorage.removeItem(sessionKey)}catch(e){}}

  function injectStyle(){if(document.getElementById('my60WorkoutUxStyle'))return;const st=document.createElement('style');st.id='my60WorkoutUxStyle';st.textContent=`
    #plan .plan-targets,#plan .week-route,#plan .today-plan-card,#plan .plan-insight{display:none!important}
    #plan .plan-start-card{margin:12px 0 16px!important}
    #workoutStudio{padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important}
    .my60-training-hub{display:flex;flex-direction:column;gap:14px;margin-top:8px}
    .my60-week-strip{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;background:#fff;padding:10px;border-radius:22px;border:1px solid rgba(21,25,23,.06);box-shadow:0 10px 30px rgba(23,31,27,.05)}
    .my60-day{border:0;background:transparent;border-radius:15px;padding:8px 2px;color:#8a8f8b;display:flex;flex-direction:column;align-items:center;gap:5px;font-size:9px;font-weight:800}
    .my60-day b{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#f1f2ef;color:#5d625f;font-size:11px}
    .my60-day.today{background:#f5ece9;color:#7a4b50}.my60-day.today b{background:#c76f77;color:#fff}.my60-day.done b{background:#dff0df;color:#34633f}
    .my60-today-card{overflow:hidden;border-radius:30px;background:linear-gradient(145deg,#171d1a,#27312b);color:white;box-shadow:0 22px 52px rgba(23,31,27,.18)}
    .my60-today-visual{height:220px;background:linear-gradient(160deg,#f7f3ee,#e9e1d7);display:flex;align-items:center;justify-content:center;padding:12px}.my60-today-visual svg{width:100%;height:100%;max-width:430px}
    .my60-today-copy{padding:20px}.my60-today-copy>span{font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:rgba(255,255,255,.58);font-weight:850}.my60-today-copy h3{font-size:28px;line-height:1.05;letter-spacing:-.04em;margin:5px 0 7px}.my60-today-copy p{margin:0;color:rgba(255,255,255,.65);font-size:13px}
    .my60-today-actions{display:grid;grid-template-columns:1fr auto;gap:9px;margin-top:17px}.my60-primary,.my60-secondary{border:0;border-radius:17px;padding:14px 16px;font-weight:850}.my60-primary{background:#fff;color:#171d1a}.my60-secondary{background:rgba(255,255,255,.10);color:#fff;min-width:92px}
    .my60-library{background:#fff;border:1px solid rgba(21,25,23,.06);border-radius:26px;padding:17px;box-shadow:0 10px 30px rgba(23,31,27,.05)}.my60-library-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:12px}.my60-library-head span{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#989c98;font-weight:800}.my60-library-head b{display:block;font-size:20px;margin-top:3px}.my60-library-head small{color:#888e8a}
    .my60-workout-scroll{display:flex;gap:9px;overflow:auto;padding-bottom:3px;scrollbar-width:none}.my60-workout-scroll::-webkit-scrollbar{display:none}.my60-workout-chip{flex:0 0 150px;border:1px solid rgba(21,25,23,.07);background:#fafaf8;border-radius:20px;padding:14px;text-align:left;color:#222825}.my60-workout-chip b{display:block;font-size:14px;line-height:1.2}.my60-workout-chip span{display:block;margin-top:6px;color:#8a8f8c;font-size:10px}.my60-workout-chip.current{border-color:#c76f77;background:#fbf3f1}
    .my60-resume{border:0;border-radius:18px;padding:13px 14px;background:#fff3d8;color:#5c4b25;text-align:left;font-weight:750}.my60-resume b{display:block;font-size:13px}.my60-resume span{font-size:11px;opacity:.7}
    .my60-preview,.my60-player{position:fixed;inset:0;z-index:10050;background:#f5f3ef;display:none;overflow:auto;padding:calc(env(safe-area-inset-top) + 12px) 14px calc(env(safe-area-inset-bottom) + 20px)}.my60-preview.open,.my60-player.open{display:block}
    body.my60-workout-open{overflow:hidden}.my60-overlay-inner{width:min(100%,560px);margin:0 auto}
    .my60-overlay-top{display:grid;grid-template-columns:46px 1fr 46px;align-items:center;margin-bottom:12px}.my60-overlay-top button{width:42px;height:42px;border:0;border-radius:50%;background:#fff;color:#2c312e;font-size:25px;box-shadow:0 7px 18px rgba(0,0,0,.06)}.my60-overlay-top div{text-align:center}.my60-overlay-top span{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#929792;font-weight:850}.my60-overlay-top b{font-size:14px}
    .my60-preview-hero{background:#171d1a;color:white;border-radius:28px;padding:22px;margin-bottom:12px}.my60-preview-hero h2{margin:4px 0 7px;font-size:27px}.my60-preview-hero p{margin:0;color:rgba(255,255,255,.66);font-size:13px}.my60-preview-start{width:100%;border:0;border-radius:18px;padding:15px;background:#c76f77;color:#fff;font-weight:850;margin-top:16px}
    .my60-preview-list{display:flex;flex-direction:column;gap:9px}.my60-preview-item{display:grid;grid-template-columns:84px 1fr;gap:12px;background:#fff;border-radius:20px;padding:9px;border:1px solid rgba(21,25,23,.06)}.my60-preview-thumb{background:#f2eee8;border-radius:15px;height:74px;display:flex;align-items:center;justify-content:center;overflow:hidden}.my60-preview-thumb svg{width:135px;height:78px}.my60-preview-item b{display:block;font-size:13px;margin-top:4px}.my60-preview-item span{display:block;color:#8a8f8c;font-size:10px;margin-top:3px}.my60-preview-item small{display:block;color:#5d625f;font-size:11px;margin-top:5px}
    .my60-progress{height:6px;background:#deded9;border-radius:99px;overflow:hidden;margin:4px 0 13px}.my60-progress span{display:block;height:100%;background:#c76f77;border-radius:99px;transition:width .25s}
    .my60-player-card{background:#fff;border-radius:30px;overflow:hidden;box-shadow:0 16px 42px rgba(23,31,27,.08)}.my60-demo{height:285px;background:linear-gradient(160deg,#fbfaf7,#efe8df);display:flex;align-items:center;justify-content:center;padding:12px}.my60-demo svg{width:100%;height:100%}
    .my60-player-copy{padding:18px 18px 15px}.my60-player-copy>span{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#b0646c;font-weight:850}.my60-player-copy h2{font-size:26px;line-height:1.08;margin:4px 0 5px;letter-spacing:-.035em}.my60-dose{display:inline-flex;margin-top:6px;border-radius:999px;padding:7px 10px;background:#f3ece9;color:#704b4f;font-size:12px;font-weight:850}
    .my60-how{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:13px}.my60-how div{background:#f7f7f4;border-radius:16px;padding:11px}.my60-how i{width:22px;height:22px;border-radius:50%;background:#222825;color:white;display:grid;place-items:center;font-style:normal;font-size:10px;font-weight:900;margin-bottom:7px}.my60-how p{font-size:11px;line-height:1.4;color:#5f6561;margin:0}.my60-tip{margin:11px 0 0;padding:10px 12px;border-left:3px solid #c76f77;background:#fbf3f1;border-radius:12px;font-size:11px;line-height:1.45;color:#685b5b}
    .my60-set-row{display:flex;justify-content:space-between;align-items:center;margin:14px 0 0}.my60-set-dots{display:flex;gap:6px}.my60-set-dots i{width:9px;height:9px;border-radius:50%;background:#d9dbd7}.my60-set-dots i.done{background:#73a47f}.my60-set-dots i.now{background:#c76f77;box-shadow:0 0 0 4px rgba(199,111,119,.12)}.my60-set-row span{font-size:11px;color:#777e79;font-weight:750}
    .my60-timer{display:grid;place-items:center;margin:14px auto 4px;width:126px;height:126px;border-radius:50%;background:conic-gradient(#c76f77 var(--p),#e3e3df 0);padding:7px}.my60-timer>div{width:100%;height:100%;border-radius:50%;background:#fff;display:grid;place-items:center;align-content:center}.my60-timer b{font-size:29px;font-variant-numeric:tabular-nums}.my60-timer small{font-size:9px;letter-spacing:.11em;text-transform:uppercase;color:#919692}
    .my60-player-actions{display:grid;grid-template-columns:48px 1fr 48px;gap:9px;margin-top:13px}.my60-player-actions button{border:0;border-radius:17px;background:#fff;height:52px;color:#2b302d;font-weight:850;box-shadow:0 8px 22px rgba(23,31,27,.07)}.my60-player-actions .main{background:#171d1a;color:#fff;font-size:14px}.my60-player-actions .skip{font-size:20px}.my60-player-actions .back{font-size:19px}
    .my60-rest-card{margin-top:70px;text-align:center}.my60-rest-card>span{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#a4a8a4;font-weight:850}.my60-rest-card h2{font-size:34px;margin:6px 0 4px}.my60-rest-card p{color:#7d827e;margin:0 0 14px}.my60-rest-next{background:#fff;border-radius:23px;padding:14px;margin:20px 0;display:grid;grid-template-columns:105px 1fr;gap:12px;text-align:left;align-items:center}.my60-rest-next div:first-child{background:#f2ede7;border-radius:18px;height:90px;overflow:hidden}.my60-rest-next svg{width:160px;height:94px}.my60-rest-next b{display:block}.my60-rest-next span{font-size:10px;color:#969a96}
    .my60-finish{margin:76px auto 0;background:#fff;border-radius:30px;padding:30px 22px;text-align:center;box-shadow:0 16px 42px rgba(23,31,27,.08)}.my60-finish-mark{width:76px;height:76px;border-radius:50%;background:#dff0df;color:#397148;display:grid;place-items:center;margin:0 auto 15px;font-size:34px}.my60-finish h2{margin:0 0 7px;font-size:28px}.my60-finish p{color:#7b817c;margin:0 0 18px}.my60-finish button{width:100%;border:0;border-radius:17px;padding:15px;background:#171d1a;color:#fff;font-weight:850}
    @media(max-width:430px){.my60-today-visual{height:205px}.my60-demo{height:260px}.my60-how{grid-template-columns:1fr}.my60-workout-chip{flex-basis:142px}.my60-today-copy h3{font-size:25px}}
  `;document.head.appendChild(st)}

  function weekStrip(){
    const now=new Date(),mondayOffset=(now.getDay()+6)%7,monday=new Date(now);monday.setDate(now.getDate()-mondayOffset);monday.setHours(0,0,0,0);
    let out='<div class="my60-week-strip">';
    for(let i=0;i<7;i++){const d=new Date(monday);d.setDate(monday.getDate()+i);const type=schedule[d.getDay()]||'A';const isToday=todayKey(d)===todayKey(now);out+='<div class="my60-day '+(isToday?'today ':'')+(done(type,d)?'done':'')+'"><span>'+labels[d.getDay()]+'</span><b>'+(done(type,d)?'✓':d.getDate())+'</b></div>'}return out+'</div>';
  }

  function hubMarkup(){
    const type=currentType(),m=W[type],resume=loadSession(),first=item(type,0);
    const others=['A','GLUTES','LEGS','CORE','UPPER','BACK','PILATES','CARDIO'];
    return '<div class="my60-training-hub">'+weekStrip()+
      (resume?'<button class="my60-resume" onclick="My60Workout.resume()"><b>Продолжить тренировку</b><span>'+esc(W[resume.type].title)+' · упражнение '+(resume.e+1)+' из '+W[resume.type].items.length+'</span></button>':'')+
      '<section class="my60-today-card"><div class="my60-today-visual">'+svg(first.name)+'</div><div class="my60-today-copy"><span>Сегодня · '+esc(m.tone)+'</span><h3>'+esc(m.title)+'</h3><p>'+esc(m.duration)+' · '+m.items.length+' упражнений · пошагово</p><div class="my60-today-actions"><button class="my60-primary" onclick="My60Workout.start(\''+type+'\')">'+(done(type)?'Повторить тренировку':'▶ Начать тренировку')+'</button><button class="my60-secondary" onclick="My60Workout.preview(\''+type+'\')">Список</button></div></div></section>'+
      '<section class="my60-library"><div class="my60-library-head"><div><span>Другие тренировки</span><b>Выбери по настроению</b></div><small>Без лишних экранов</small></div><div class="my60-workout-scroll">'+others.map(function(t){return '<button class="my60-workout-chip '+(t===type?'current':'')+'" onclick="My60Workout.preview(\''+t+'\')"><b>'+esc(W[t].title)+'</b><span>'+esc(W[t].duration)+' · '+W[t].items.length+' упражнений</span></button>'}).join('')+'</div></section></div>';
  }

  function enhance(){
    injectStyle();
    const studio=document.getElementById('workoutStudio');if(!studio)return false;
    if(studio.dataset.my60Visual==='1'){const hub=studio.querySelector('.my60-training-hub');if(hub)hub.outerHTML=hubMarkup();return true}
    studio.dataset.my60Visual='1';studio.innerHTML=hubMarkup();return true;
  }

  function overlay(id,cls){let el=document.getElementById(id);if(!el){el=document.createElement('div');el.id=id;el.className=cls;document.body.appendChild(el)}return el}
  function closeOverlays(){document.querySelectorAll('.my60-preview,.my60-player').forEach(x=>x.classList.remove('open'));document.body.classList.remove('my60-workout-open');if(tick){clearInterval(tick);tick=null}}

  function preview(type){
    if(!W[type])type='A';const m=W[type],root=overlay('my60WorkoutPreview','my60-preview');
    root.innerHTML='<div class="my60-overlay-inner"><div class="my60-overlay-top"><button onclick="My60Workout.close()">×</button><div><span>Тренировка</span><b>'+esc(m.title)+'</b></div><i></i></div><div class="my60-preview-hero"><span>'+esc(m.tone)+'</span><h2>'+esc(m.title)+'</h2><p>'+esc(m.duration)+' · '+m.items.length+' упражнений</p><button class="my60-preview-start" onclick="My60Workout.start(\''+type+'\')">▶ Начать</button></div><div class="my60-preview-list">'+m.items.map(function(r,i){return '<div class="my60-preview-item"><div class="my60-preview-thumb">'+svg(r[0])+'</div><div><b>'+(i+1)+'. '+esc(r[0])+'</b><span>'+esc(r[2])+'</span><small>'+esc(r[1])+'</small></div></div>'}).join('')+'</div></div>';
    root.classList.add('open');document.body.classList.add('my60-workout-open');
  }

  function newSession(type){const first=parseDose(W[type].items[0][1]);return {type:type,e:0,set:0,phase:'exercise',left:first.seconds||0,running:false,pending:null,started:Date.now()}}
  function start(type){if(!W[type])type='A';const s=newSession(type);storeSession(s);renderPlayer(s)}
  function resume(){const s=loadSession();if(s)renderPlayer(s)}
  function timerText(v){return Math.floor(v/60)+':'+String(v%60).padStart(2,'0')}
  function startTick(){if(tick)clearInterval(tick);tick=setInterval(function(){const s=loadSession();if(!s||!s.running)return;if(s.left>0)s.left--;if(s.left<=0){s.running=false;storeSession(s);if(s.phase==='rest')advanceAfterRest(s);else completeSet(s);return}storeSession(s);updateClock(s)},1000)}
  function updateClock(s){const el=document.getElementById('my60Clock');if(el)el.textContent=timerText(Math.max(0,s.left));const ring=document.querySelector('.my60-timer');if(ring){const d=s.phase==='rest'?25:(parseDose(W[s.type].items[s.e][1]).seconds||1);ring.style.setProperty('--p',Math.max(0,Math.min(100,s.left/d*100))+'%')}}

  function renderPlayer(s){
    if(!s||!W[s.type])return;closeOverlays();const root=overlay('my60WorkoutPlayer','my60-player');root.classList.add('open');document.body.classList.add('my60-workout-open');
    if(s.phase==='finish')return finishMarkup(root,s);
    if(s.phase==='rest')return restMarkup(root,s);
    const ex=item(s.type,s.e),d=parseDose(ex.dose),g=guide[family(ex.name)]||guide.generic,total=totalSets(s.type),doneSets=sessionCompletedSets(s),pct=Math.round(doneSets/total*100);
    const dots=Array.from({length:d.sets},(_,i)=>'<i class="'+(i<s.set?'done':i===s.set?'now':'')+'"></i>').join('');
    root.innerHTML='<div class="my60-overlay-inner"><div class="my60-overlay-top"><button onclick="My60Workout.close()">×</button><div><span>'+esc(W[s.type].title)+'</span><b>Упражнение '+(s.e+1)+' из '+W[s.type].items.length+'</b></div><button onclick="My60Workout.preview(\''+s.type+'\')" style="font-size:16px">≡</button></div><div class="my60-progress"><span style="width:'+pct+'%"></span></div><div class="my60-player-card"><div class="my60-demo">'+svg(ex.name)+'</div><div class="my60-player-copy"><span>'+esc(ex.focus)+'</span><h2>'+esc(ex.name)+'</h2><div class="my60-dose">'+esc(ex.dose)+'</div><div class="my60-set-row"><div class="my60-set-dots">'+dots+'</div><span>Подход '+(s.set+1)+' из '+d.sets+'</span></div><div class="my60-how"><div><i>1</i><p>'+esc(g[0])+'</p></div><div><i>2</i><p>'+esc(g[1])+'</p></div></div><div class="my60-tip"><b>Важно:</b> '+esc(ex.tip)+'</div>'+(d.seconds?'<div class="my60-timer" style="--p:'+(s.left/d.seconds*100)+'%"><div><b id="my60Clock">'+timerText(s.left)+'</b><small>'+ (s.running?'идёт время':'таймер') +'</small></div></div>':'')+'</div></div><div class="my60-player-actions"><button class="back" onclick="My60Workout.back()">‹</button><button class="main" onclick="My60Workout.primary()">'+(d.seconds?(s.running?'Пауза':'Старт '+d.seconds+' сек'):'Подход выполнен ✓')+'</button><button class="skip" onclick="My60Workout.skip()">›</button></div></div>';
    storeSession(s);if(s.running)startTick();
  }

  function primary(){const s=loadSession();if(!s)return;if(s.phase==='rest'){s.running=!s.running;storeSession(s);renderPlayer(s);return}const d=parseDose(W[s.type].items[s.e][1]);if(d.seconds){s.running=!s.running;if(s.left<=0)s.left=d.seconds;storeSession(s);renderPlayer(s)}else completeSet(s)}
  function completeSet(s){const d=parseDose(W[s.type].items[s.e][1]);s.running=false;if(s.set+1<d.sets){s.pending={e:s.e,set:s.set+1}}else if(s.e+1<W[s.type].items.length){s.pending={e:s.e+1,set:0}}else{s.phase='finish';storeSession(s);renderPlayer(s);return}s.phase='rest';s.left=25;s.running=true;storeSession(s);renderPlayer(s)}
  function advanceAfterRest(s){const p=s.pending||{e:Math.min(s.e+1,W[s.type].items.length-1),set:0};s.e=p.e;s.set=p.set;s.pending=null;s.phase='exercise';const d=parseDose(W[s.type].items[s.e][1]);s.left=d.seconds||0;s.running=false;storeSession(s);renderPlayer(s)}
  function skip(){const s=loadSession();if(!s)return;if(s.phase==='rest')return advanceAfterRest(s);if(s.e+1>=W[s.type].items.length){s.phase='finish';storeSession(s);renderPlayer(s);return}s.e++;s.set=0;const d=parseDose(W[s.type].items[s.e][1]);s.left=d.seconds||0;s.running=false;storeSession(s);renderPlayer(s)}
  function back(){const s=loadSession();if(!s)return;if(s.phase==='rest'){s.phase='exercise';s.pending=null;const d=parseDose(W[s.type].items[s.e][1]);s.left=d.seconds||0;s.running=false}else if(s.set>0){s.set--;const d=parseDose(W[s.type].items[s.e][1]);s.left=d.seconds||0;s.running=false}else if(s.e>0){s.e--;const d=parseDose(W[s.type].items[s.e][1]);s.set=Math.max(0,d.sets-1);s.left=d.seconds||0;s.running=false}storeSession(s);renderPlayer(s)}
  function restMarkup(root,s){const p=s.pending||{e:Math.min(s.e+1,W[s.type].items.length-1),set:0},next=item(s.type,p.e);root.innerHTML='<div class="my60-overlay-inner"><div class="my60-overlay-top"><button onclick="My60Workout.close()">×</button><div><span>Отдых</span><b>'+esc(W[s.type].title)+'</b></div><i></i></div><div class="my60-rest-card"><span>Восстанови дыхание</span><h2>Отдых</h2><p>Следующий подход начнётся автоматически</p><div class="my60-timer" style="--p:'+(s.left/25*100)+'%"><div><b id="my60Clock">'+timerText(s.left)+'</b><small>отдых</small></div></div><div class="my60-rest-next"><div>'+svg(next.name)+'</div><div><span>Дальше</span><b>'+esc(next.name)+'</b><small>'+esc(next.dose)+'</small></div></div><div class="my60-player-actions"><button onclick="My60Workout.restMore()">+15</button><button class="main" onclick="My60Workout.restSkip()">Пропустить отдых</button><button onclick="My60Workout.primary()">'+(s.running?'Ⅱ':'▶')+'</button></div></div></div>';storeSession(s);if(s.running)startTick()}
  function restMore(){const s=loadSession();if(!s||s.phase!=='rest')return;s.left+=15;storeSession(s);renderPlayer(s)}
  function restSkip(){const s=loadSession();if(!s||s.phase!=='rest')return;advanceAfterRest(s)}
  function finishMarkup(root,s){markDone(s.type);storeSession(null);root.innerHTML='<div class="my60-overlay-inner"><div class="my60-finish"><div class="my60-finish-mark">✓</div><h2>Тренировка готова</h2><p>'+esc(W[s.type].title)+' · '+W[s.type].items.length+' упражнений. Отлично — на сегодня достаточно.</p><button onclick="My60Workout.finish()">Готово</button></div></div>';enhance()}
  function finish(){closeOverlays();enhance()}

  window.My60Workout={start:start,resume:resume,preview:preview,close:closeOverlays,primary:primary,skip:skip,back:back,restMore:restMore,restSkip:restSkip,finish:finish};

  function boot(){injectStyle();let tries=0;const id=setInterval(function(){tries++;if(enhance()||tries>80)clearInterval(id)},100);document.addEventListener('click',function(e){const planBtn=e.target.closest('.nav button');if(planBtn&&/plan/.test(planBtn.getAttribute('onclick')||''))setTimeout(enhance,120)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
