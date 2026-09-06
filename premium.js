(function(){
  const icons={
    today:'<svg viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5"/><path d="M6.5 9.5V20h11V9.5"/><path d="M9.5 20v-6h5v6"/></svg>',
    food:'<svg viewBox="0 0 24 24"><path d="M7 3v7M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 10v11"/><path d="M15 3v18M15 3c3 1 4.5 4 4.5 7H15"/></svg>',
    progress:'<svg viewBox="0 0 24 24"><path d="M4 18 9 13l4 3 7-9"/><path d="M15 7h5v5"/></svg>',
    plan:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="m8 12 2.5 2.5L16.5 8.5"/></svg>',
    more:'<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
    plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'
  };
  const sectionNames={
    food:['Питание','Баланс дня'],
    progress:['Прогресс','Твоя динамика'],
    plan:['План','Путь к цели'],
    more:['Мой журнал','Итоги и заметки']
  };
  function greet(){
    const h=new Date().getHours();
    return h<12?'Доброе утро':h<18?'Добрый день':'Добрый вечер';
  }
  function initial(){
    try{
      const n=(window.S&&S.profile&&S.profile.name||'').trim();
      return n&&n!=='Моя цель'?n.charAt(0).toUpperCase():'60';
    }catch(e){return '60'}
  }
  function decorateNav(){
    const ids=['today','food','progress','plan','more'];
    document.querySelectorAll('.nav button').forEach((b,i)=>{
      const ico=b.querySelector('.ico');
      if(ico&&ids[i]) ico.innerHTML=icons[ids[i]];
    });
    const fab=document.querySelector('.fab');
    if(fab) fab.innerHTML=icons.plus;
  }
  function sectionTitles(){
    Object.keys(sectionNames).forEach(id=>{
      const sec=document.getElementById(id);
      if(!sec||sec.querySelector('.premium-section-title'))return;
      const t=document.createElement('div');
      t.className='premium-section-title';
      t.innerHTML='<div class="eyebrow">'+sectionNames[id][0]+'</div><h2>'+sectionNames[id][1]+'</h2>';
      sec.insertBefore(t,sec.firstChild);
    });
  }
  function todayWellness(){
    if(!window.S||typeof key!=='function')return null;
    const w=S.well&&S.well[key()];
    if(!w)return null;
    return {
      sleep:+w.sleep||0,
      hunger:+w.hunger||5,
      energy:+w.energy||5,
      stress:+w.stress||5,
      sweet:+w.sweet||5,
      note:w.note||''
    };
  }

  function wellnessMode(w){
    if(!w)return {id:'empty',title:'Добавь чек-ин',sub:'MY 60 подстроит рекомендации по еде и тренировке под твой сегодняшний ресурс.'};
    if((w.sleep&&w.sleep<6.5)||w.energy<=4||w.stress>=8)return {id:'gentle',title:'Бережный режим',sub:'Сегодня лучше снизить нагрузку и не требовать от себя идеального дня.'};
    if((!w.sleep||w.sleep>=7)&&w.energy>=7&&w.stress<=5)return {id:'good',title:'Хороший ресурс',sub:'Энергии достаточно — можно спокойно держаться обычного плана.'};
    return {id:'normal',title:'Обычный режим',sub:'Нормальный день: ориентируйся на голод, энергию и план без перегибов.'};
  }

  function wellnessRecommendations(w){
    if(!w)return [];
    const r=[];
    if(w.sleep&&w.sleep<6.5)r.push({icon:'☾',title:'Сон ниже привычного',text:'Не компенсируй усталость жёсткой тренировкой. Лучше обычная активность или облегчённая силовая.'});
    if(w.energy<=4)r.push({icon:'↘',title:'Энергии мало',text:'Если силовая стоит по плану, можно сократить подходы или перенести её на день, когда будет больше сил.'});
    if(w.stress>=7)r.push({icon:'≈',title:'Стресс высокий',text:'Сделай день проще: обычная еда, комфортные шаги и без попыток «отработать» калории.'});
    if(w.hunger>=7)r.push({icon:'○',title:'Голод высокий',text:'Не затягивай с приёмом пищи. Белок + гарнир + овощи обычно насыщают лучше, чем перекусы на ходу.'});
    if(w.sweet>=7)r.push({icon:'◇',title:'Сильно хочется сладкого',text:'Сначала нормальный приём пищи. Если сладкого всё ещё хочется — лучше запланировать порцию, а не запрещать себе.'});
    if(!r.length)r.push({icon:'✓',title:'Можно идти по обычному плану',text:'По чек-ину нет сигнала, что сегодня нужно специально облегчать день.'});
    return r.slice(0,3);
  }

  function wellnessInsightMarkup(){
    return '<div class="today-wellness-card" id="todayWellnessCard"></div>';
  }

  function updateTodayWellness(){
    const card=document.getElementById('todayWellnessCard');
    if(!card)return;
    const w=todayWellness(),mode=wellnessMode(w);
    if(!w){
      card.innerHTML='<div class="wellness-summary-head"><div><span>Как ты сегодня?</span><h3>'+mode.title+'</h3><p>'+mode.sub+'</p></div><div class="wellness-summary-icon">♡</div></div><button class="wellness-open" onclick="openEntryForm(\'wellness\')">Заполнить чек-ин</button>';
      card.dataset.mode='empty';
      return;
    }
    const metrics=[
      ['Сон',w.sleep?round1(w.sleep)+' ч':'—'],
      ['Голод',w.hunger+'/10'],
      ['Энергия',w.energy+'/10'],
      ['Стресс',w.stress+'/10'],
      ['Сладкое',w.sweet+'/10']
    ];
    const recs=wellnessRecommendations(w);
    card.dataset.mode=mode.id;
    card.innerHTML=
      '<div class="wellness-summary-head"><div><span>Как ты сегодня?</span><h3>'+mode.title+'</h3><p>'+mode.sub+'</p></div><button class="wellness-edit" onclick="openEntryForm(\'wellness\')">Изменить</button></div>'+
      '<div class="wellness-metrics">'+metrics.map(function(x){return '<div><span>'+x[0]+'</span><b>'+x[1]+'</b></div>'}).join('')+'</div>'+
      '<div class="wellness-advice">'+recs.map(function(x){return '<div class="wellness-advice-item"><i>'+x.icon+'</i><div><b>'+x.title+'</b><p>'+x.text+'</p></div></div>'}).join('')+'</div>';
  }

  function decorateToday(){
    const sec=document.getElementById('today');
    if(!sec)return;
    let welcome=sec.querySelector('.premium-welcome');
    if(!welcome){
      welcome=document.createElement('div');
      welcome.className='premium-welcome';
      welcome.innerHTML='<div><div class="eyebrow">MY 60 · сегодня</div><h2><span id="premiumGreeting"></span></h2></div><div class="avatar" id="premiumAvatar"></div>';
      sec.insertBefore(welcome,sec.firstChild);
    }
    const gr=document.getElementById('premiumGreeting');
    if(gr)gr.textContent=greet();
    const av=document.getElementById('premiumAvatar');
    if(av)av.textContent=initial();

    const hero=sec.querySelector('.hero');
    if(hero&&!hero.querySelector('.premium-ring')){
      const ring=document.createElement('div');
      ring.className='premium-ring';
      ring.innerHTML='<b id="premiumPct">0%</b>';
      hero.appendChild(ring);
    }
    let qs=sec.querySelector('.quick-strip');
    if(!qs&&hero){
      qs=document.createElement('div');
      qs.className='quick-strip';
      qs.innerHTML=
        '<button onclick="openEntryForm(\'weight\')"><span class="qi"><svg viewBox="0 0 24 24"><path d="M5 19h14"/><path d="M7 19l1.2-9h7.6L17 19"/><path d="M9 10a3 3 0 0 1 6 0"/><path d="M12 8.5v2.5"/></svg></span>Вес</button>'+
        '<button onclick="openEntryForm(\'food\')"><span class="qi"><svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M7 12a5 5 0 0 1 10 0"/><path d="M4 16h16"/><path d="M8 19h8"/></svg></span>Еда</button>'+
        '<button onclick="addWater(250)"><span class="qi"><svg viewBox="0 0 24 24"><path d="M12 3s5 5.4 5 10a5 5 0 0 1-10 0c0-4.6 5-10 5-10Z"/><path d="M10 15c.5.7 1.1 1 2 1.1"/></svg></span>+250 мл</button>'+
        '<button onclick="openEntryForm(\'steps\')"><span class="qi"><svg viewBox="0 0 24 24"><path d="M9 4c1.7 2.6 1.8 5.1.7 7.6L8 15"/><path d="M8 15c-1.1 1.6-.7 3.5.9 4.4 1.6.9 3.5.3 4.4-1.3l1.4-2.4"/><path d="M15 5c1.2 1.9 1.4 3.8.7 5.7"/></svg></span>Шаги</button>';
      hero.insertAdjacentElement('afterend',qs);
    }
    let wc=document.getElementById('todayWellnessCard');
    if(!wc){
      const anchor=sec.querySelector('.quick-strip')||hero;
      if(anchor)anchor.insertAdjacentHTML('afterend',wellnessInsightMarkup());
    }
    updateTodayWellness();
  }
  function updateRing(){
    const bar=document.getElementById('goalBar'),ring=document.querySelector('.premium-ring'),pct=document.getElementById('premiumPct');
    if(!bar||!ring)return;
    const n=Math.max(0,Math.min(100,parseFloat(bar.style.width)||0));
    ring.style.setProperty('--p',n+'%');
    if(pct)pct.textContent=Math.round(n)+'%';
  }
  function premiumDraw(){
    const cv=document.getElementById('chart');
    if(!cv||!window.S)return;
    const ctx=cv.getContext('2d'),r=cv.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const W=Math.max(300,Math.floor(r.width)),H=220;
    cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,W,H);
    const data=Object.entries(S.weights||{}).sort().slice(-30);
    if(data.length<2){
      ctx.fillStyle='#929a95';ctx.font='600 13px -apple-system,BlinkMacSystemFont,sans-serif';
      ctx.fillText('Добавь ещё одно измерение — здесь появится график',18,42);return;
    }
    const vals=data.map(x=>+x[1]),mn=Math.min(...vals)-.4,mx=Math.max(...vals)+.4,padX=18,padY=22;
    ctx.strokeStyle='#e5e9e4';ctx.lineWidth=1;
    for(let i=0;i<4;i++){
      const y=padY+(H-padY*2)*i/3;ctx.beginPath();ctx.moveTo(padX,y);ctx.lineTo(W-padX,y);ctx.stroke();
    }
    const pts=data.map((x,i)=>({
      x:padX+(W-padX*2)*i/(data.length-1),
      y:padY+(H-padY*2)*(mx-(+x[1]))/(mx-mn)
    }));
    const fill=ctx.createLinearGradient(0,padY,0,H-padY);
    fill.addColorStop(0,'rgba(128,104,240,.22)');fill.addColorStop(1,'rgba(128,104,240,0)');
    ctx.beginPath();ctx.moveTo(pts[0].x,H-padY);pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.lineTo(p.x,p.y));ctx.lineTo(pts[pts.length-1].x,H-padY);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
    const line=ctx.createLinearGradient(padX,0,W-padX,0);line.addColorStop(0,'#8068f0');line.addColorStop(1,'#ff7f8f');
    ctx.strokeStyle=line;ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
    pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
    const last=pts[pts.length-1];ctx.beginPath();ctx.arc(last.x,last.y,4.5,0,Math.PI*2);ctx.fillStyle='#ff7f8f';ctx.fill();
    ctx.beginPath();ctx.arc(last.x,last.y,8,0,Math.PI*2);ctx.strokeStyle='rgba(255,127,143,.22)';ctx.lineWidth=4;ctx.stroke();
  }

  const builtInProducts=[
    {id:'base-egg',name:'Яйцо куриное, варёное',kcal100:155,p100:12.6,f100:10.6,c100:1.1},
    {id:'base-egg-fried',name:'Яйцо жареное',kcal100:196,p100:13.6,f100:14.8,c100:1.0},
    {id:'base-omelet',name:'Омлет с молоком',kcal100:154,p100:10.0,f100:11.9,c100:1.9},
    {id:'base-cottage-0',name:'Творог 0–2%',kcal100:89,p100:18.0,f100:1.8,c100:3.3},
    {id:'base-cottage-5',name:'Творог 5%',kcal100:121,p100:17.2,f100:5.0,c100:1.8},
    {id:'base-cottage-9',name:'Творог 9%',kcal100:159,p100:16.7,f100:9.0,c100:2.0},
    {id:'base-kefir-1',name:'Кефир 1%',kcal100:40,p100:3.0,f100:1.0,c100:4.0},
    {id:'base-kefir-25',name:'Кефир 2,5%',kcal100:53,p100:2.9,f100:2.5,c100:4.0},
    {id:'base-milk-25',name:'Молоко 2,5%',kcal100:52,p100:2.8,f100:2.5,c100:4.7},
    {id:'base-yogurt-natural',name:'Йогурт натуральный без сахара',kcal100:61,p100:4.3,f100:3.0,c100:4.7},
    {id:'base-greek-yogurt',name:'Йогурт греческий 2%',kcal100:73,p100:9.0,f100:2.0,c100:4.0},
    {id:'base-sour-cream-15',name:'Сметана 15%',kcal100:162,p100:2.6,f100:15.0,c100:3.6},
    {id:'base-cheese-hard',name:'Сыр твёрдый',kcal100:350,p100:25.0,f100:27.0,c100:1.5},
    {id:'base-mozzarella',name:'Моцарелла',kcal100:280,p100:22.0,f100:21.0,c100:2.2},
    {id:'base-butter',name:'Масло сливочное 82%',kcal100:748,p100:0.5,f100:82.0,c100:0.8},
    {id:'base-chicken-breast-boiled',name:'Куриная грудка, варёная',kcal100:165,p100:31.0,f100:3.6,c100:0},
    {id:'base-chicken-breast-baked',name:'Куриная грудка, запечённая',kcal100:171,p100:30.0,f100:4.8,c100:0},
    {id:'base-chicken-thigh',name:'Куриное бедро без кожи, готовое',kcal100:209,p100:26.0,f100:11.0,c100:0},
    {id:'base-turkey',name:'Индейка, филе готовое',kcal100:135,p100:29.0,f100:1.6,c100:0},
    {id:'base-beef-boiled',name:'Говядина отварная',kcal100:187,p100:26.0,f100:9.0,c100:0},
    {id:'base-beef-stewed',name:'Говядина тушёная',kcal100:205,p100:25.0,f100:11.0,c100:2.0},
    {id:'base-goulash',name:'Гуляш из говядины',kcal100:145,p100:12.5,f100:8.5,c100:5.0},
    {id:'base-meatballs',name:'Котлета домашняя мясная',kcal100:230,p100:16.0,f100:16.0,c100:6.0},
    {id:'base-meatballs-chicken',name:'Котлета куриная',kcal100:180,p100:19.0,f100:10.0,c100:4.0},
    {id:'base-minced-beef',name:'Фарш говяжий готовый',kcal100:250,p100:26.0,f100:16.0,c100:0},
    {id:'base-liver',name:'Печень говяжья тушёная',kcal100:170,p100:25.0,f100:6.0,c100:5.0},
    {id:'base-salmon',name:'Лосось запечённый',kcal100:208,p100:22.0,f100:13.0,c100:0},
    {id:'base-trout',name:'Форель запечённая',kcal100:190,p100:26.0,f100:9.0,c100:0},
    {id:'base-cod',name:'Треска готовая',kcal100:105,p100:23.0,f100:0.9,c100:0},
    {id:'base-tuna',name:'Тунец в собственном соку',kcal100:116,p100:26.0,f100:1.0,c100:0},
    {id:'base-shrimp',name:'Креветки варёные',kcal100:99,p100:24.0,f100:0.3,c100:0.2},
    {id:'base-potato-raw',name:'Картофель сырой',kcal100:77,p100:2.0,f100:0.1,c100:17.0},
    {id:'base-potato-boiled',name:'Картофель варёный',kcal100:82,p100:2.0,f100:0.1,c100:18.0},
    {id:'base-potato-baked',name:'Картофель запечённый без масла',kcal100:93,p100:2.5,f100:0.1,c100:21.0},
    {id:'base-potato-fried',name:'Картошка жареная',kcal100:192,p100:2.8,f100:9.5,c100:24.0},
    {id:'base-potato-puree',name:'Картофельное пюре с молоком и маслом',kcal100:113,p100:2.1,f100:4.2,c100:17.0},
    {id:'base-rice-white',name:'Рис белый варёный',kcal100:130,p100:2.7,f100:0.3,c100:28.0},
    {id:'base-rice-brown',name:'Рис бурый варёный',kcal100:123,p100:2.7,f100:1.0,c100:25.6},
    {id:'base-buckwheat',name:'Гречка варёная',kcal100:110,p100:4.2,f100:1.1,c100:21.3},
    {id:'base-oatmeal-water',name:'Овсяная каша на воде',kcal100:88,p100:3.0,f100:1.7,c100:15.0},
    {id:'base-oatmeal-milk',name:'Овсяная каша на молоке',kcal100:113,p100:4.0,f100:4.0,c100:16.0},
    {id:'base-pasta',name:'Макароны варёные',kcal100:131,p100:5.0,f100:1.1,c100:25.0},
    {id:'base-couscous',name:'Кускус готовый',kcal100:112,p100:3.8,f100:0.2,c100:23.2},
    {id:'base-bulgur',name:'Булгур варёный',kcal100:83,p100:3.1,f100:0.2,c100:18.6},
    {id:'base-quinoa',name:'Киноа варёная',kcal100:120,p100:4.4,f100:1.9,c100:21.3},
    {id:'base-bread-white',name:'Хлеб белый',kcal100:265,p100:8.5,f100:3.2,c100:49.0},
    {id:'base-bread-rye',name:'Хлеб ржаной',kcal100:214,p100:6.6,f100:1.2,c100:43.0},
    {id:'base-lavash',name:'Лаваш тонкий',kcal100:275,p100:9.0,f100:1.2,c100:57.0},
    {id:'base-crispbread',name:'Хлебцы цельнозерновые',kcal100:350,p100:10.0,f100:4.0,c100:65.0},
    {id:'base-apple',name:'Яблоко',kcal100:52,p100:0.3,f100:0.2,c100:14.0},
    {id:'base-banana',name:'Банан',kcal100:89,p100:1.1,f100:0.3,c100:22.8},
    {id:'base-orange',name:'Апельсин',kcal100:47,p100:0.9,f100:0.1,c100:11.8},
    {id:'base-mandarin',name:'Мандарин',kcal100:53,p100:0.8,f100:0.3,c100:13.3},
    {id:'base-pear',name:'Груша',kcal100:57,p100:0.4,f100:0.1,c100:15.2},
    {id:'base-grapes',name:'Виноград',kcal100:69,p100:0.7,f100:0.2,c100:18.1},
    {id:'base-peach',name:'Персик',kcal100:39,p100:0.9,f100:0.3,c100:9.5},
    {id:'base-watermelon',name:'Арбуз',kcal100:30,p100:0.6,f100:0.2,c100:7.6},
    {id:'base-melon',name:'Дыня',kcal100:34,p100:0.8,f100:0.2,c100:8.2},
    {id:'base-strawberry',name:'Клубника',kcal100:32,p100:0.7,f100:0.3,c100:7.7},
    {id:'base-blueberry',name:'Черника',kcal100:57,p100:0.7,f100:0.3,c100:14.5},
    {id:'base-raspberry',name:'Малина',kcal100:52,p100:1.2,f100:0.7,c100:11.9},
    {id:'base-cucumber',name:'Огурец',kcal100:15,p100:0.7,f100:0.1,c100:3.6},
    {id:'base-tomato',name:'Помидор',kcal100:18,p100:0.9,f100:0.2,c100:3.9},
    {id:'base-cabbage',name:'Капуста белокочанная',kcal100:25,p100:1.3,f100:0.1,c100:5.8},
    {id:'base-carrot',name:'Морковь',kcal100:41,p100:0.9,f100:0.2,c100:9.6},
    {id:'base-beet',name:'Свёкла варёная',kcal100:44,p100:1.7,f100:0.2,c100:10.0},
    {id:'base-broccoli',name:'Брокколи',kcal100:34,p100:2.8,f100:0.4,c100:6.6},
    {id:'base-cauliflower',name:'Цветная капуста',kcal100:25,p100:1.9,f100:0.3,c100:5.0},
    {id:'base-zucchini',name:'Кабачок',kcal100:17,p100:1.2,f100:0.3,c100:3.1},
    {id:'base-pepper',name:'Перец сладкий',kcal100:31,p100:1.0,f100:0.3,c100:6.0},
    {id:'base-onion',name:'Лук репчатый',kcal100:40,p100:1.1,f100:0.1,c100:9.3},
    {id:'base-avocado',name:'Авокадо',kcal100:160,p100:2.0,f100:14.7,c100:8.5},
    {id:'base-corn',name:'Кукуруза консервированная',kcal100:86,p100:3.2,f100:1.2,c100:16.3},
    {id:'base-peas',name:'Горошек зелёный консервированный',kcal100:68,p100:4.3,f100:0.4,c100:12.0},
    {id:'base-beans',name:'Фасоль красная варёная',kcal100:127,p100:8.7,f100:0.5,c100:22.8},
    {id:'base-lentils',name:'Чечевица варёная',kcal100:116,p100:9.0,f100:0.4,c100:20.1},
    {id:'base-chickpeas',name:'Нут варёный',kcal100:164,p100:8.9,f100:2.6,c100:27.4},
    {id:'base-almond',name:'Миндаль',kcal100:579,p100:21.2,f100:49.9,c100:21.6},
    {id:'base-walnut',name:'Грецкий орех',kcal100:654,p100:15.2,f100:65.2,c100:13.7},
    {id:'base-peanut',name:'Арахис',kcal100:567,p100:25.8,f100:49.2,c100:16.1},
    {id:'base-peanut-butter',name:'Арахисовая паста',kcal100:588,p100:25.0,f100:50.0,c100:20.0},
    {id:'base-honey',name:'Мёд',kcal100:304,p100:0.3,f100:0,c100:82.4},
    {id:'base-sugar',name:'Сахар',kcal100:387,p100:0,f100:0,c100:100},
    {id:'base-chocolate-dark',name:'Шоколад тёмный 70%',kcal100:598,p100:7.8,f100:42.6,c100:45.9},
    {id:'base-chocolate-milk',name:'Шоколад молочный',kcal100:535,p100:7.7,f100:29.7,c100:59.4},
    {id:'base-cookie',name:'Печенье песочное',kcal100:450,p100:6.0,f100:18.0,c100:68.0},
    {id:'base-icecream',name:'Мороженое пломбир',kcal100:227,p100:3.7,f100:15.0,c100:20.4},
    {id:'base-caesar',name:'Салат Цезарь с курицей',kcal100:190,p100:11.0,f100:13.0,c100:7.0},
    {id:'base-olivier',name:'Салат Оливье',kcal100:198,p100:5.5,f100:15.0,c100:10.0},
    {id:'base-greek-salad',name:'Салат Греческий',kcal100:110,p100:4.0,f100:8.0,c100:5.5},
    {id:'base-vinaigrette',name:'Винегрет',kcal100:122,p100:1.7,f100:7.0,c100:13.0},
    {id:'base-borscht',name:'Борщ с говядиной',kcal100:65,p100:3.5,f100:3.0,c100:6.0},
    {id:'base-chicken-soup',name:'Суп куриный с лапшой',kcal100:55,p100:4.0,f100:2.0,c100:5.0},
    {id:'base-lentil-soup',name:'Суп чечевичный',kcal100:78,p100:4.5,f100:2.2,c100:10.5},
    {id:'base-pilaf',name:'Плов с говядиной',kcal100:185,p100:6.5,f100:8.0,c100:22.0},
    {id:'base-manti',name:'Манты с мясом',kcal100:220,p100:10.0,f100:10.0,c100:22.0},
    {id:'base-dumplings',name:'Пельмени отварные',kcal100:245,p100:11.0,f100:12.0,c100:25.0},
    {id:'base-dolma',name:'Долма с мясом и рисом',kcal100:170,p100:8.0,f100:9.0,c100:14.0},
    {id:'base-stuffed-pepper',name:'Перец фаршированный мясом и рисом',kcal100:145,p100:7.5,f100:8.0,c100:10.0},
    {id:'base-cabbage-rolls',name:'Голубцы с мясом и рисом',kcal100:140,p100:7.0,f100:8.0,c100:10.0},
    {id:'base-pasta-bolognese',name:'Паста болоньезе',kcal100:170,p100:8.0,f100:6.0,c100:21.0},
    {id:'base-beef-stroganoff',name:'Бефстроганов из говядины',kcal100:180,p100:13.0,f100:12.0,c100:5.0},
    {id:'base-chicken-cream',name:'Курица в сливочном соусе',kcal100:175,p100:16.0,f100:11.0,c100:3.0},
    {id:'base-casserole-cottage',name:'Запеканка творожная',kcal100:180,p100:13.0,f100:7.0,c100:17.0},
    {id:'base-syrniki',name:'Сырники',kcal100:220,p100:14.0,f100:9.0,c100:21.0},
    {id:'base-pancakes',name:'Блины домашние',kcal100:230,p100:6.0,f100:9.0,c100:31.0},
    {id:'base-pancakes-oat',name:'Овсяноблин',kcal100:180,p100:10.0,f100:8.0,c100:17.0},
    {id:'base-sandwich-chicken',name:'Сэндвич с курицей',kcal100:210,p100:12.0,f100:8.0,c100:24.0},
    {id:'base-shawarma',name:'Шаурма с курицей',kcal100:220,p100:11.0,f100:10.0,c100:22.0},
    {id:'base-pizza-cheese',name:'Пицца сырная',kcal100:266,p100:11.0,f100:10.0,c100:33.0},
    {id:'base-pizza-chicken',name:'Пицца с курицей',kcal100:245,p100:13.0,f100:9.0,c100:29.0},
    {id:'base-mayo',name:'Майонез',kcal100:680,p100:1.0,f100:75.0,c100:1.0},
    {id:'base-ketchup',name:'Кетчуп',kcal100:112,p100:1.3,f100:0.2,c100:25.8},
    {id:'base-olive-oil',name:'Оливковое масло',kcal100:884,p100:0,f100:100,c100:0},
    {id:'base-sunflower-oil',name:'Подсолнечное масло',kcal100:884,p100:0,f100:100,c100:0},
    {id:'base-coffee-milk',name:'Кофе с молоком без сахара',kcal100:20,p100:1.0,f100:1.0,c100:2.0},
    {id:'base-cappuccino',name:'Капучино без сахара',kcal100:45,p100:2.5,f100:2.3,c100:3.5},
    {id:'base-latte',name:'Латте без сахара',kcal100:55,p100:3.0,f100:2.8,c100:4.5}
  ];

  function ensureProductLibrary(){
    if(!window.S)return [];
    if(!Array.isArray(S.productLibrary))S.productLibrary=[];
    S.productLibrary.forEach(function(p,i){
      if(!p.id)p.id='p'+i+'-'+String(p.name||'').toLowerCase().replace(/[^a-zа-яё0-9]+/gi,'-');
      if(typeof p.favorite!=='boolean')p.favorite=false;
      if(!p.lastUsed)p.lastUsed=0;
    });
    return S.productLibrary;
  }

  function escapeHtml(value){
    return String(value==null?'':value).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function productLibraryMarkup(){
    return '<div class="product-library" id="productLibrary">'+
      '<div class="library-top"><div><div class="label">Мои продукты</div><div class="library-title">Быстрый выбор</div><div class="library-base-note">В поиске также 118 продуктов и блюд MY 60</div></div><span class="library-count" id="libraryCount">0</span></div>'+
      '<div id="favoriteProducts"></div>'+
      '<div id="recentProducts"></div>'+
    '</div>';
  }

  function calculatorMarkup(){
    return '<div class="card calorie-card" id="calorieCalculator">'+
      '<div class="calorie-head"><div><div class="label">Быстро добавить</div><div class="big calorie-title">Найди продукт</div><div class="muted">Выбери из базы MY 60 или из своих сохранённых — КБЖУ подставится автоматически.</div></div><div class="calorie-icon"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg></div></div>'+
      '<div class="smart-search-block product-search-wrap"><div class="search-icon"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg></div><input id="calcName" autocomplete="off" placeholder="Творог, картошка, гуляш…" onfocus="productSearch(this.value)" oninput="productSearch(this.value)"><div class="product-suggestions" id="productSuggestions"></div></div>'+
      '<div class="quick-food-row">'+
        '<button type="button" onclick="quickFood(\'base-cottage-5\')">Творог</button>'+
        '<button type="button" onclick="quickFood(\'base-egg\')">Яйцо</button>'+
        '<button type="button" onclick="quickFood(\'base-chicken-breast-boiled\')">Курица</button>'+
        '<button type="button" onclick="quickFood(\'base-buckwheat\')">Гречка</button>'+
        '<button type="button" onclick="quickFood(\'base-potato-puree\')">Пюре</button>'+
        '<button type="button" onclick="quickFood(\'base-goulash\')">Гуляш</button>'+
      '</div>'+
      productLibraryMarkup()+
      '<div class="calc-fields">'+
        '<div><label>Приём пищи</label><select id="calcMeal"><option>Завтрак</option><option>Обед</option><option>Перекус</option><option>Ужин</option><option>Другое</option></select></div>'+
        '<div><label>Вес порции, г</label><input id="calcGrams" type="number" inputmode="decimal" min="0" step="1" placeholder="150" oninput="calorieCalc()"></div>'+
        '<div class="calc-wide"><label>Ккал / 100 г</label><input id="calcKcal100" type="number" inputmode="decimal" min="0" step="1" placeholder="120" oninput="calorieCalc()"></div>'+
      '</div>'+
      '<div class="calc-macros-title"><span>КБЖУ на 100 г</span><span class="muted">можно поправить вручную</span></div>'+
      '<div class="calc-macros">'+
        '<label><span>Белки</span><input id="calcP100" type="number" inputmode="decimal" min="0" step=".1" placeholder="0" oninput="calorieCalc()"></label>'+
        '<label><span>Жиры</span><input id="calcF100" type="number" inputmode="decimal" min="0" step=".1" placeholder="0" oninput="calorieCalc()"></label>'+
        '<label><span>Углеводы</span><input id="calcC100" type="number" inputmode="decimal" min="0" step=".1" placeholder="0" oninput="calorieCalc()"></label>'+
      '</div>'+
      '<div class="calc-result">'+
        '<div class="calc-kcal"><span>Порция</span><strong id="calcKcalResult">0</strong><small>ккал</small></div>'+
        '<div class="calc-result-macros"><span>Б <b id="calcPResult">0</b> г</span><span>Ж <b id="calcFResult">0</b> г</span><span>У <b id="calcCResult">0</b> г</span></div>'+
      '</div>'+
      '<button class="btn calc-add" id="calcAddButton" onclick="addCalculatedFood()" disabled>Добавить в дневник</button>'+
      '<div class="calc-daily"><span>Сегодня <b id="calcDailyUsed">0</b> ккал</span><span>Осталось <b id="calcDailyLeft">—</b> ккал</span></div>'+
    '</div>';
  }

  function renderProductLibrary(){
    if(!document.getElementById('productLibrary'))return;
    const list=ensureProductLibrary();
    const favorites=list.filter(function(p){return p.favorite}).sort(function(a,b){return (b.lastUsed||0)-(a.lastUsed||0)});
    const recent=list.slice().sort(function(a,b){return (b.lastUsed||0)-(a.lastUsed||0)}).slice(0,6);
    const count=document.getElementById('libraryCount');
    if(count)count.textContent=list.length;
    const fav=document.getElementById('favoriteProducts');
    const rec=document.getElementById('recentProducts');
    function item(p){
      return '<div class="saved-product">'+
        '<button class="saved-main" type="button" onclick="selectSavedProduct(\''+escapeHtml(p.id)+'\')">'+
          '<span class="saved-name">'+escapeHtml(p.name)+'</span>'+
          '<span class="saved-meta">'+Math.round(+p.kcal100||0)+' ккал · Б '+round1(+p.p100||0)+' · Ж '+round1(+p.f100||0)+' · У '+round1(+p.c100||0)+'</span>'+
        '</button>'+
        '<button class="favorite-btn '+(p.favorite?'on':'')+'" type="button" aria-label="Избранное" onclick="toggleFavoriteProduct(\''+escapeHtml(p.id)+'\')">'+(p.favorite?'★':'☆')+'</button>'+
      '</div>';
    }
    if(fav){
      fav.innerHTML=favorites.length
        ? '<div class="library-section"><div class="library-label">★ Избранное</div><div class="saved-list">'+favorites.slice(0,8).map(item).join('')+'</div></div>'
        : '';
    }
    if(rec){
      rec.innerHTML=recent.length
        ? '<div class="library-section"><div class="library-label">Недавние</div><div class="saved-list">'+recent.map(item).join('')+'</div></div>'
        : '<div class="library-empty">После первого добавления продукт сохранится здесь автоматически.</div>';
    }
  }

  function normalizeProductName(v){
    return String(v||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9]+/gi,' ').trim();
  }

  function applyProductToCalculator(p){
    if(!p)return;
    const values={calcName:p.name,calcKcal100:p.kcal100,calcP100:p.p100,calcF100:p.f100,calcC100:p.c100};
    Object.keys(values).forEach(function(k){
      const el=document.getElementById(k);
      if(el)el.value=values[k]==null?'':values[k];
    });
    hideProductSuggestions();
    const grams=document.getElementById('calcGrams');
    if(grams){grams.value='';setTimeout(function(){grams.focus()},40)}
    calorieCalc();
  }

  function allSearchProducts(){
    const saved=ensureProductLibrary().map(function(p){return Object.assign({source:'saved'},p)});
    const seen={};
    saved.forEach(function(p){seen[normalizeProductName(p.name)]=true});
    const base=builtInProducts.filter(function(p){return !seen[normalizeProductName(p.name)]}).map(function(p){return Object.assign({source:'base'},p)});
    return saved.concat(base);
  }

  function productSearch(query){
    const box=document.getElementById('productSuggestions');
    if(!box)return;
    const q=normalizeProductName(query);
    let items=allSearchProducts();
    if(q){
      items=items.filter(function(p){return normalizeProductName(p.name).includes(q)});
      items.sort(function(a,b){
        const an=normalizeProductName(a.name),bn=normalizeProductName(b.name);
        const as=an.startsWith(q)?0:1,bs=bn.startsWith(q)?0:1;
        if(as!==bs)return as-bs;
        if(a.source!==b.source)return a.source==='saved'?-1:1;
        return an.localeCompare(bn,'ru');
      });
    }else{
      const popular=['Яйцо куриное, варёное','Творог 5%','Куриная грудка, варёная','Картофель варёный','Картошка жареная','Картофельное пюре с молоком и маслом','Гуляш из говядины','Гречка варёная'];
      items=items.filter(function(p){return p.source==='saved'||popular.indexOf(p.name)>=0});
      items.sort(function(a,b){
        if(a.source!==b.source)return a.source==='saved'?-1:1;
        return (b.lastUsed||0)-(a.lastUsed||0);
      });
    }
    items=items.slice(0,8);
    if(!items.length){
      box.innerHTML='<div class="suggestion-empty">Не нашла в базе — введи КБЖУ вручную, после добавления продукт сохранится.</div>';
      box.classList.add('show');
      return;
    }
    box.innerHTML=items.map(function(p){
      const tag=p.source==='saved'?'Мой':'База';
      return '<button type="button" class="product-suggestion" onmousedown="event.preventDefault()" onclick="chooseProductSuggestion(\''+p.source+'\',\''+escapeHtml(p.id)+'\')">'+
        '<span class="suggestion-main"><b>'+escapeHtml(p.name)+'</b><small>'+tag+' · '+Math.round(+p.kcal100||0)+' ккал / 100 г</small></span>'+
        '<span class="suggestion-macros">Б '+round1(+p.p100||0)+' · Ж '+round1(+p.f100||0)+' · У '+round1(+p.c100||0)+'</span>'+
      '</button>';
    }).join('');
    box.classList.add('show');
  }

  function hideProductSuggestions(){
    const box=document.getElementById('productSuggestions');
    if(box)box.classList.remove('show');
  }

  function chooseProductSuggestion(source,id){
    const p=source==='saved'
      ? ensureProductLibrary().find(function(x){return x.id===id})
      : builtInProducts.find(function(x){return x.id===id});
    applyProductToCalculator(p);
  }

  function selectSavedProduct(id){
    const p=ensureProductLibrary().find(function(x){return x.id===id});
    applyProductToCalculator(p);
  }

  function toggleFavoriteProduct(id){
    const p=ensureProductLibrary().find(function(x){return x.id===id});
    if(!p)return;
    p.favorite=!p.favorite;
    if(typeof save==='function')save();
    renderProductLibrary();
  }

  function rememberCurrentProduct(name){
    const library=ensureProductLibrary();
    const clean=String(name||'').trim();
    if(!clean)return;
    const norm=clean.toLowerCase().replace(/\s+/g,' ');
    let p=library.find(function(x){return String(x.name||'').trim().toLowerCase().replace(/\s+/g,' ')===norm});
    if(!p){
      p={id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),favorite:false};
      library.push(p);
    }
    p.name=clean;
    p.kcal100=num('calcKcal100');
    p.p100=num('calcP100');
    p.f100=num('calcF100');
    p.c100=num('calcC100');
    p.lastUsed=Date.now();
    if(library.length>100){
      const removable=library.filter(function(x){return !x.favorite}).sort(function(a,b){return (a.lastUsed||0)-(b.lastUsed||0)});
      while(library.length>100&&removable.length){
        const drop=removable.shift();
        const i=library.indexOf(drop);if(i>=0)library.splice(i,1);
      }
    }
  }

  function nutritionDashboardMarkup(){
    return '<div class="nutrition-dashboard" id="nutritionDashboard">'+
      '<div class="nutrition-hero">'+
        '<div class="nutrition-hero-copy"><div class="label">Сегодня</div><div class="nutrition-status" id="nutritionStatus">Баланс дня</div><div class="nutrition-left"><strong id="nutritionLeft">—</strong><span>ккал осталось</span></div><div class="nutrition-sub" id="nutritionSub">Собираем твой день</div></div>'+
        '<div class="nutrition-ring" id="nutritionRing"><div><b id="nutritionPct">0%</b><span>нормы</span></div></div>'+
      '</div>'+
      '<div class="macro-grid">'+
        '<div class="macro-card protein"><div class="macro-top"><span>Белок</span><b><i id="dashP">0</i> / 105 г</b></div><div class="macro-track"><span id="dashPBar"></span></div><small id="dashPLeft">осталось 105 г</small></div>'+
        '<div class="macro-card fat"><div class="macro-top"><span>Жиры</span><b><i id="dashF">0</i> / 55 г</b></div><div class="macro-track"><span id="dashFBar"></span></div><small id="dashFLeft">осталось 55 г</small></div>'+
        '<div class="macro-card carbs"><div class="macro-top"><span>Углеводы</span><b><i id="dashC">0</i> / 155 г</b></div><div class="macro-track"><span id="dashCBar"></span></div><small id="dashCLeft">осталось 155 г</small></div>'+
      '</div>'+
      '<div class="meal-pulse" id="mealPulse"></div>'+
      '<div class="smart-tip" id="smartNutritionTip"></div>'+
    '</div>';
  }

  function quickFood(id){
    const p=builtInProducts.find(function(x){return x.id===id});
    if(!p)return;
    applyProductToCalculator(p);
    const calc=document.getElementById('calorieCalculator');
    if(calc)calc.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function tipButton(id,label){
    return '<button type="button" onclick="quickFood(\''+id+'\')">'+escapeHtml(label)+'</button>';
  }

  function updateNutritionDashboard(){
    if(!window.S||typeof key!=='function')return;
    const list=(S.food&&S.food[key()])||[];
    const sum=list.reduce(function(a,x){a.cal+=+x.cal||0;a.p+=+x.p||0;a.f+=+x.f||0;a.c+=+x.c||0;return a},{cal:0,p:0,f:0,c:0});
    const goals={cal:(S.profile&&+S.profile.calories)||1500,p:105,f:55,c:155};
    const left=Math.round(goals.cal-sum.cal);
    const pct=Math.max(0,Math.min(100,sum.cal/goals.cal*100));
    const leftEl=document.getElementById('nutritionLeft');
    const status=document.getElementById('nutritionStatus');
    const sub=document.getElementById('nutritionSub');
    const ring=document.getElementById('nutritionRing');
    const pctEl=document.getElementById('nutritionPct');
    if(leftEl)leftEl.textContent=Math.abs(left);
    if(status)status.textContent=left>=0?'Баланс дня':'Норма набрана';
    if(sub)sub.textContent=left>=0?('Съедено '+Math.round(sum.cal)+' из '+goals.cal+' ккал'):('Выше ориентира на '+Math.abs(left)+' ккал — просто продолжай день спокойно');
    const leftLabel=leftEl&&leftEl.nextElementSibling;
    if(leftLabel)leftLabel.textContent=left>=0?'ккал осталось':'ккал выше ориентира';
    if(ring)ring.style.setProperty('--food-p',pct+'%');
    if(pctEl)pctEl.textContent=Math.round(pct)+'%';

    [['P','p',goals.p],['F','f',goals.f],['C','c',goals.c]].forEach(function(x){
      const val=Math.round(sum[x[1]]*10)/10;
      const el=document.getElementById('dash'+x[0]);
      const bar=document.getElementById('dash'+x[0]+'Bar');
      const le=document.getElementById('dash'+x[0]+'Left');
      if(el)el.textContent=val;
      if(bar)bar.style.width=Math.min(100,val/x[2]*100)+'%';
      if(le)le.textContent=val>=x[2]?'цель выполнена':'осталось '+Math.round((x[2]-val)*10)/10+' г';
    });

    const mealNames=['Завтрак','Обед','Перекус','Ужин'];
    const mealIcons={'Завтрак':'☀','Обед':'◐','Перекус':'◇','Ужин':'☾'};
    const pulse=document.getElementById('mealPulse');
    if(pulse){
      pulse.innerHTML=mealNames.map(function(m){
        const items=list.filter(function(x){return x.meal===m});
        const kc=Math.round(items.reduce(function(a,x){return a+(+x.cal||0)},0));
        return '<div class="meal-slot '+(items.length?'filled':'')+'"><span>'+mealIcons[m]+'</span><div><b>'+m+'</b><small>'+(items.length?kc+' ккал':'пока пусто')+'</small></div></div>';
      }).join('');
    }

    const tip=document.getElementById('smartNutritionTip');
    if(!tip)return;
    const proteinLeft=goals.p-sum.p;
    const hour=new Date().getHours();
    let title='',copy='',buttons='';
    if(!list.length){
      title=hour<12?'Начни день с белка':'Соберём первый приём пищи';
      copy='Хорошая база — белок + привычный гарнир. Выбери вариант, укажи граммы и добавь.';
      buttons=tipButton('base-cottage-5','Творог 5%')+tipButton('base-egg','Яйцо')+tipButton('base-buckwheat','Гречка');
    }else if(left<0){
      title='День уже собран';
      copy='Не нужно ничего компенсировать голоданием. Если позже проголодаешься, выбирай обычную лёгкую еду по аппетиту.';
      buttons=tipButton('base-greek-yogurt','Греческий йогурт')+tipButton('base-cucumber','Огурец');
    }else if(proteinLeft>30&&left>250){
      title='Сейчас выгоднее добрать белок';
      copy='По сегодняшнему дневнику белка пока меньше ориентира. Эти продукты удобно впишутся в оставшиеся калории.';
      buttons=tipButton('base-chicken-breast-boiled','Курица')+tipButton('base-cottage-5','Творог')+tipButton('base-greek-yogurt','Йогурт');
    }else if(left<=220){
      title='До ориентира осталось немного';
      copy='Если голод есть — выбери небольшую порцию. Если голода нет, не нужно доедать цифру ради цифры.';
      buttons=tipButton('base-greek-yogurt','Йогурт')+tipButton('base-strawberry','Клубника');
    }else{
      title='Баланс выглядит хорошо';
      copy='Белок уже близко к цели. Остаток дня можно собрать из обычной еды без жёстких ограничений.';
      buttons=tipButton('base-potato-boiled','Картофель')+tipButton('base-greek-salad','Греческий салат')+tipButton('base-chicken-breast-boiled','Курица');
    }
    tip.innerHTML='<div class="tip-icon">✦</div><div class="tip-copy"><span>Рекомендация MY 60</span><b>'+title+'</b><p>'+copy+'</p><div class="tip-actions">'+buttons+'</div></div>';
  }


  let recipeDraft=[];
  let recipePendingProduct=null;
  let editingRecipeId=null;

  function ensureRecipes(){
    if(!window.S)return [];
    if(!Array.isArray(S.recipes))S.recipes=[];
    return S.recipes;
  }

  function yesterdayKey(){
    const d=new Date();d.setDate(d.getDate()-1);return key(d);
  }

  function foodToolsMarkup(){
    return '<div class="food-tools-card" id="foodToolsCard">'+
      '<div class="food-tools-head"><div><div class="label">Быстрые действия</div><h3>Ещё быстрее</h3><p>Повтори привычную еду или сохрани домашнее блюдо один раз.</p></div><div class="food-tools-mark">✦</div></div>'+
      '<div class="food-tool-actions">'+
        '<button type="button" class="food-tool primary" onclick="copyYesterdayAll()"><span>↻</span><div><b>Повторить вчера</b><small id="yesterdaySummary">Проверяю дневник…</small></div></button>'+
        '<button type="button" class="food-tool" onclick="openRecipeBuilder()"><span>＋</span><div><b>Создать блюдо</b><small>Ингредиенты → КБЖУ на 100 г</small></div></button>'+
      '</div>'+
      '<div class="yesterday-meals" id="yesterdayMeals"></div>'+
      '<div class="saved-recipes" id="savedRecipes"></div>'+
    '</div>';
  }

  function renderFoodTools(){
    const root=document.getElementById('foodToolsCard');if(!root||!window.S)return;
    const y=(S.food&&S.food[yesterdayKey()])||[];
    const summary=document.getElementById('yesterdaySummary');
    const kcal=Math.round(y.reduce(function(a,x){return a+(+x.cal||0)},0));
    if(summary)summary.textContent=y.length?(y.length+' записей · '+kcal+' ккал'):'Вчера записей нет';

    const meals=document.getElementById('yesterdayMeals');
    if(meals){
      const order=['Завтрак','Обед','Перекус','Ужин','Другое','Напиток'];
      const existing=order.filter(function(m){return y.some(function(x){return x.meal===m})});
      meals.innerHTML=existing.length
        ? '<div class="tool-subtitle">Повторить только приём пищи</div><div class="meal-copy-row">'+existing.map(function(m){
            const items=y.filter(function(x){return x.meal===m});
            const k=Math.round(items.reduce(function(a,x){return a+(+x.cal||0)},0));
            return '<button type="button" onclick="copyYesterdayMeal(\''+escapeHtml(m)+'\')"><b>'+escapeHtml(m)+'</b><small>'+k+' ккал</small></button>';
          }).join('')+'</div>'
        : '';
    }

    const recipes=document.getElementById('savedRecipes');
    if(recipes){
      const list=ensureRecipes();
      recipes.innerHTML=list.length
        ? '<div class="recipes-head"><div class="tool-subtitle">Мои блюда</div><span>'+list.length+'</span></div><div class="recipe-list">'+list.slice().sort(function(a,b){return (b.updatedAt||0)-(a.updatedAt||0)}).map(function(r){
            return '<div class="recipe-item"><button class="recipe-use" type="button" onclick="useRecipe(\''+r.id+'\')"><b>'+escapeHtml(r.name)+'</b><small>'+Math.round(+r.kcal100||0)+' ккал · Б '+round1(+r.p100||0)+' · Ж '+round1(+r.f100||0)+' · У '+round1(+r.c100||0)+' / 100 г</small></button><button class="recipe-more" type="button" onclick="openRecipeBuilder(\''+r.id+'\')">Изм.</button></div>';
          }).join('')+'</div>'
        : '<div class="recipes-empty">Здесь появятся твои домашние блюда: гуляш, пюре, суп, салат — любое.</div>';
    }
  }

  function copyYesterdayMeal(meal){
    if(!window.S||typeof key!=='function')return;
    const src=((S.food&&S.food[yesterdayKey()])||[]).filter(function(x){return x.meal===meal});
    if(!src.length)return;
    if(!S.food[key()])S.food[key()]=[];
    src.forEach(function(x){S.food[key()].push(Object.assign({},x,{copiedFrom:yesterdayKey()}))});
    if(typeof save==='function')save();
    renderFoodTools();
  }

  function copyYesterdayAll(){
    if(!window.S||typeof key!=='function')return;
    const src=((S.food&&S.food[yesterdayKey()])||[]);
    if(!src.length){
      const card=document.getElementById('foodToolsCard');
      if(card){card.classList.add('nudge');setTimeout(function(){card.classList.remove('nudge')},500)}
      return;
    }
    if(!S.food[key()])S.food[key()]=[];
    src.forEach(function(x){S.food[key()].push(Object.assign({},x,{copiedFrom:yesterdayKey()}))});
    if(typeof save==='function')save();
    renderFoodTools();
  }

  function recipeProductByRef(source,id){
    return source==='saved'
      ? ensureProductLibrary().find(function(x){return x.id===id})
      : builtInProducts.find(function(x){return x.id===id});
  }

  function openRecipeBuilder(id){
    editingRecipeId=id||null;
    recipePendingProduct=null;
    const existing=id?ensureRecipes().find(function(r){return r.id===id}):null;
    recipeDraft=existing&&Array.isArray(existing.ingredients)?existing.ingredients.map(function(x){return Object.assign({},x)}):[];
    if(typeof sheet==='undefined'||typeof modal==='undefined')return;
    sheet.innerHTML=
      '<div class="recipe-builder">'+
        '<div class="recipe-builder-head"><div><div class="label">Мои блюда</div><h3>'+(existing?'Редактировать блюдо':'Новое блюдо')+'</h3><p>Добавляй ингредиенты из базы. Вес готового блюда нужен, чтобы точно посчитать КБЖУ на 100 г.</p></div><div class="recipe-orb">◌</div></div>'+
        '<label class="recipe-field"><span>Название блюда</span><input id="recipeName" value="'+escapeHtml(existing?existing.name:'')+'" placeholder="Например, мой гуляш"></label>'+
        '<div class="recipe-add-box"><div class="recipe-search-wrap"><label>Ингредиент</label><input id="recipeIngredientSearch" autocomplete="off" placeholder="Начни вводить: говядина…" oninput="recipeIngredientSearch(this.value)" onfocus="recipeIngredientSearch(this.value)"><div id="recipeIngredientSuggestions" class="recipe-suggestions"></div></div><label class="recipe-grams"><span>Вес, г</span><input id="recipeIngredientGrams" type="number" inputmode="decimal" min="1" placeholder="200"></label><button class="recipe-add-btn" type="button" onclick="addRecipeIngredient()">Добавить ингредиент</button></div>'+
        '<div id="recipeDraftList"></div>'+
        '<label class="recipe-field final-weight"><span>Вес готового блюда, г</span><input id="recipeFinalWeight" type="number" inputmode="decimal" min="1" value="'+(existing&&existing.finalWeight?existing.finalWeight:'')+'" placeholder="Например, 950" oninput="renderRecipeDraft()"><small>После приготовления взвесь всё блюдо целиком.</small></label>'+
        '<div class="recipe-result" id="recipeResult"></div>'+
        '<button class="btn recipe-save" type="button" onclick="saveRecipe()">'+(existing?'Сохранить изменения':'Сохранить блюдо')+'</button>'+
        (existing?'<button class="recipe-delete" type="button" onclick="deleteRecipe(\''+existing.id+'\')">Удалить блюдо</button>':'')+
      '</div>';
    modal.classList.add('open');
    renderRecipeDraft();
  }

  function recipeIngredientSearch(query){
    const box=document.getElementById('recipeIngredientSuggestions');if(!box)return;
    const q=normalizeProductName(query);
    let items=allSearchProducts();
    if(q)items=items.filter(function(p){return normalizeProductName(p.name).includes(q)});
    else items=items.slice().sort(function(a,b){return a.source==='saved'?-1:1}).slice(0,8);
    items=items.slice(0,8);
    box.innerHTML=items.length?items.map(function(p){
      return '<button type="button" onmousedown="event.preventDefault()" onclick="chooseRecipeIngredient(\''+p.source+'\',\''+p.id+'\')"><b>'+escapeHtml(p.name)+'</b><small>'+Math.round(+p.kcal100||0)+' ккал / 100 г</small></button>';
    }).join(''):'<div class="recipe-search-empty">Не нашла. Сначала сохрани продукт через основной калькулятор.</div>';
    box.classList.add('show');
  }

  function chooseRecipeIngredient(source,id){
    const p=recipeProductByRef(source,id);if(!p)return;
    recipePendingProduct={source:source,id:id,name:p.name,kcal100:+p.kcal100||0,p100:+p.p100||0,f100:+p.f100||0,c100:+p.c100||0};
    const input=document.getElementById('recipeIngredientSearch'),box=document.getElementById('recipeIngredientSuggestions'),grams=document.getElementById('recipeIngredientGrams');
    if(input)input.value=p.name;
    if(box)box.classList.remove('show');
    if(grams)setTimeout(function(){grams.focus()},30);
  }

  function addRecipeIngredient(){
    const gramsEl=document.getElementById('recipeIngredientGrams');
    const grams=gramsEl?(+gramsEl.value||0):0;
    if(!recipePendingProduct||grams<=0)return;
    recipeDraft.push(Object.assign({},recipePendingProduct,{grams:grams}));
    recipePendingProduct=null;
    const search=document.getElementById('recipeIngredientSearch');
    if(search)search.value='';
    if(gramsEl)gramsEl.value='';
    renderRecipeDraft();
    if(search)search.focus();
  }

  function removeRecipeIngredient(i){
    recipeDraft.splice(i,1);renderRecipeDraft();
  }

  function recipeTotals(){
    return recipeDraft.reduce(function(a,x){
      const k=(+x.grams||0)/100;
      a.weight+=+x.grams||0;
      a.kcal+=(+x.kcal100||0)*k;
      a.p+=(+x.p100||0)*k;
      a.f+=(+x.f100||0)*k;
      a.c+=(+x.c100||0)*k;
      return a;
    },{weight:0,kcal:0,p:0,f:0,c:0});
  }

  function renderRecipeDraft(){
    const list=document.getElementById('recipeDraftList'),result=document.getElementById('recipeResult');
    const total=recipeTotals();
    if(list){
      list.innerHTML=recipeDraft.length
        ? '<div class="recipe-draft-title">Ингредиенты <span>'+recipeDraft.length+'</span></div><div class="recipe-draft-items">'+recipeDraft.map(function(x,i){
            return '<div><div><b>'+escapeHtml(x.name)+'</b><small>'+Math.round(+x.grams||0)+' г · '+Math.round((+x.kcal100||0)*(+x.grams||0)/100)+' ккал</small></div><button type="button" onclick="removeRecipeIngredient('+i+')">×</button></div>';
          }).join('')+'</div>'
        : '<div class="recipe-draft-empty">Выбери первый ингредиент выше.</div>';
    }
    if(result){
      const fwEl=document.getElementById('recipeFinalWeight'),fw=fwEl?(+fwEl.value||0):0;
      const factor=fw>0?100/fw:0;
      result.innerHTML='<div><span>Всего в ингредиентах</span><b>'+Math.round(total.kcal)+' ккал</b><small>'+Math.round(total.weight)+' г до приготовления</small></div><div class="recipe-per100"><span>На 100 г готового блюда</span><b>'+(fw?Math.round(total.kcal*factor):'—')+' ккал</b><small>'+(fw?('Б '+round1(total.p*factor)+' · Ж '+round1(total.f*factor)+' · У '+round1(total.c*factor)):'Укажи итоговый вес')+'</small></div>';
    }
  }

  function saveRecipe(){
    const nameEl=document.getElementById('recipeName'),fwEl=document.getElementById('recipeFinalWeight');
    const name=nameEl?nameEl.value.trim():'',fw=fwEl?(+fwEl.value||0):0,total=recipeTotals();
    if(!name||!recipeDraft.length||fw<=0)return;
    const factor=100/fw;
    const recipes=ensureRecipes();
    let r=editingRecipeId?recipes.find(function(x){return x.id===editingRecipeId}):null;
    if(!r){r={id:'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)};recipes.push(r)}
    r.name=name;r.finalWeight=fw;r.ingredients=recipeDraft.map(function(x){return Object.assign({},x)});
    r.kcal100=round1(total.kcal*factor);r.p100=round1(total.p*factor);r.f100=round1(total.f*factor);r.c100=round1(total.c*factor);r.updatedAt=Date.now();

    const lib=ensureProductLibrary();
    let p=lib.find(function(x){return x.recipeId===r.id});
    if(!p){p={id:'recipe-'+r.id,recipeId:r.id,favorite:true,lastUsed:0};lib.push(p)}
    p.name=r.name;p.kcal100=r.kcal100;p.p100=r.p100;p.f100=r.f100;p.c100=r.c100;p.recipeId=r.id;
    if(typeof save==='function')save();
    if(typeof closeM==='function')closeM();
    renderFoodTools();renderProductLibrary();
  }

  function useRecipe(id){
    const r=ensureRecipes().find(function(x){return x.id===id});if(!r)return;
    applyProductToCalculator({name:r.name,kcal100:r.kcal100,p100:r.p100,f100:r.f100,c100:r.c100});
    const calc=document.getElementById('calorieCalculator');if(calc)calc.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function deleteRecipe(id){
    const recipes=ensureRecipes(),i=recipes.findIndex(function(x){return x.id===id});
    if(i>=0)recipes.splice(i,1);
    const lib=ensureProductLibrary(),li=lib.findIndex(function(x){return x.recipeId===id});
    if(li>=0)lib.splice(li,1);
    if(typeof save==='function')save();
    if(typeof closeM==='function')closeM();
    renderFoodTools();renderProductLibrary();
  }

  window.copyYesterdayAll=copyYesterdayAll;
  window.copyYesterdayMeal=copyYesterdayMeal;
  window.openRecipeBuilder=openRecipeBuilder;
  window.recipeIngredientSearch=recipeIngredientSearch;
  window.chooseRecipeIngredient=chooseRecipeIngredient;
  window.addRecipeIngredient=addRecipeIngredient;
  window.removeRecipeIngredient=removeRecipeIngredient;
  window.renderRecipeDraft=renderRecipeDraft;
  window.saveRecipe=saveRecipe;
  window.useRecipe=useRecipe;
  window.deleteRecipe=deleteRecipe;

  function decorateFood(){
    const sec=document.getElementById('food');
    if(!sec)return;
    const legacy=sec.querySelector(':scope > .card');
    if(legacy)legacy.classList.add('food-legacy-summary');
    let dash=document.getElementById('nutritionDashboard');
    if(!dash){
      const title=sec.querySelector('.premium-section-title');
      if(title)title.insertAdjacentHTML('afterend',nutritionDashboardMarkup());
      else sec.insertAdjacentHTML('afterbegin',nutritionDashboardMarkup());
    }
    let tools=document.getElementById('foodToolsCard');
    if(!tools){
      const diary=document.getElementById('foodList');
      const diaryCard=diary&&diary.closest('.card');
      if(diaryCard)diaryCard.insertAdjacentHTML('beforebegin',foodToolsMarkup());
      else sec.insertAdjacentHTML('beforeend',foodToolsMarkup());
      tools=document.getElementById('foodToolsCard');
    }
    let calc=document.getElementById('calorieCalculator');
    if(!calc){
      if(tools)tools.insertAdjacentHTML('afterend',calculatorMarkup());
      else sec.insertAdjacentHTML('beforeend',calculatorMarkup());
      calc=document.getElementById('calorieCalculator');
    }
    const diary=document.getElementById('foodList');
    const diaryCard=diary&&diary.closest('.card');
    if(diaryCard){
      diaryCard.classList.add('food-diary-card');
      const lab=diaryCard.querySelector('.label');
      if(lab)lab.textContent='Дневник питания';
    }
    const caffeine=document.getElementById('caf');
    const caffeineCard=caffeine&&caffeine.closest('.card');
    if(caffeineCard)caffeineCard.classList.add('caffeine-card');
    renderFoodTools();
    renderProductLibrary();
    updateCalorieDaily();
    updateNutritionDashboard();
    calorieCalc();
  }

  function num(id){
    const el=document.getElementById(id);
    return el ? (parseFloat(String(el.value||'').replace(',','.'))||0) : 0;
  }

  function round1(v){ return Math.round((v||0)*10)/10; }

  function calorieCalc(){
    const grams=num('calcGrams');
    const factor=grams/100;
    const kcal=Math.round(num('calcKcal100')*factor);
    const p=round1(num('calcP100')*factor);
    const f=round1(num('calcF100')*factor);
    const c=round1(num('calcC100')*factor);
    const kr=document.getElementById('calcKcalResult');
    const pr=document.getElementById('calcPResult');
    const fr=document.getElementById('calcFResult');
    const cr=document.getElementById('calcCResult');
    const add=document.getElementById('calcAddButton');
    if(kr)kr.textContent=kcal;
    if(pr)pr.textContent=p;
    if(fr)fr.textContent=f;
    if(cr)cr.textContent=c;
    if(add)add.disabled=!(grams>0 && num('calcKcal100')>0);
    return {grams:grams,kcal:kcal,p:p,f:f,c:c};
  }

  function updateCalorieDaily(){
    if(!window.S || typeof key!=='function')return;
    const list=(S.food&&S.food[key()])||[];
    const used=Math.round(list.reduce(function(sum,x){return sum+(+x.cal||0)},0));
    const goal=(S.profile&&+S.profile.calories)||1500;
    const usedEl=document.getElementById('calcDailyUsed');
    const leftEl=document.getElementById('calcDailyLeft');
    if(usedEl)usedEl.textContent=used;
    if(leftEl)leftEl.textContent=Math.max(0,goal-used);
  }

  function addCalculatedFood(){
    if(!window.S || typeof key!=='function')return;
    const t=calorieCalc();
    if(!(t.grams>0 && t.kcal>0))return;
    const nameEl=document.getElementById('calcName');
    const mealEl=document.getElementById('calcMeal');
    const name=(nameEl&&nameEl.value.trim())||'Продукт';
    const meal=(mealEl&&mealEl.value)||'Другое';
    rememberCurrentProduct(name);
    if(!S.food[key()])S.food[key()]=[];
    S.food[key()].push({
      meal:meal,
      name:name+' · '+Math.round(t.grams)+' г',
      cal:t.kcal,
      p:t.p,
      f:t.f,
      c:t.c
    });
    if(typeof save==='function')save();
    ['calcName','calcGrams','calcKcal100','calcP100','calcF100','calcC100'].forEach(function(id){
      const el=document.getElementById(id); if(el)el.value='';
    });
    calorieCalc();
    updateCalorieDaily();
    renderProductLibrary();
    const btn=document.getElementById('calcAddButton');
    if(btn){
      const old=btn.textContent;
      btn.textContent='Добавлено и сохранено ✓';
      setTimeout(function(){if(btn)btn.textContent=old},1100);
    }
  }

  window.calorieCalc=calorieCalc;
  window.addCalculatedFood=addCalculatedFood;
  window.selectSavedProduct=selectSavedProduct;
  window.toggleFavoriteProduct=toggleFavoriteProduct;
  window.productSearch=productSearch;
  window.chooseProductSuggestion=chooseProductSuggestion;
  window.quickFood=quickFood;
  document.addEventListener('click',function(e){if(!e.target.closest('.product-search-wrap'))hideProductSuggestions()});


  const planExerciseInfo={
    A:[
      {name:'Приседания к стулу',dose:'3 × 10',focus:'Ноги · ягодицы',tip:'Стопы примерно на ширине плеч. Таз уводи назад к стулу, колени направляй по линии стоп. Поднимайся без рывка.'},
      {name:'Ягодичный мост',dose:'3 × 12',focus:'Ягодицы',tip:'Ляг на спину, стопы ближе к тазу. Подними таз и мягко сожми ягодицы наверху. Не переразгибай поясницу.'},
      {name:'Тяга к поясу',dose:'3 × 10',focus:'Спина · руки',tip:'Корпус устойчивый. Тяни вес локтями назад к поясу, плечи не поднимай к ушам. Возвращай медленно.'},
      {name:'Отжимания от стены/стола',dose:'3 × 8–10',focus:'Грудь · руки',tip:'Тело держи одной линией. Сгибай локти под комфортным углом и приближай грудь к опоре, затем плавно выжимай себя назад.'},
      {name:'Румынская тяга',dose:'3 × 10',focus:'Задняя поверхность бедра',tip:'Колени слегка мягкие. Таз отводи назад, спина нейтральная. Опускай вес вдоль ног только до комфортного натяжения.'},
      {name:'Dead bug',dose:'2 × 8 / сторона',focus:'Кор',tip:'Поясница спокойно прижата к полу. Поочерёдно вытягивай противоположные руку и ногу, не спеша и без прогиба.'}
    ],
    B:[
      {name:'Выпады назад / присед',dose:'3 × 8 / ногу',focus:'Ноги · ягодицы',tip:'Шагай назад достаточно далеко, чтобы передняя стопа оставалась устойчивой. Если выпады неудобны — замени на присед к стулу.'},
      {name:'Ягодичный мост',dose:'3 × 15',focus:'Ягодицы',tip:'Поднимай таз за счёт ягодиц, задержись наверху на секунду и опускайся контролируемо.'},
      {name:'Тяга к поясу',dose:'3 × 12',focus:'Спина · руки',tip:'Сохраняй длинную спину и тяни локти назад. Не дёргай вес и не округляй плечи.'},
      {name:'Жим бутылок вверх',dose:'3 × 10',focus:'Плечи · руки',tip:'Держи корпус собранным. Выжимай бутылки вверх без резкого прогиба в пояснице, опускай до комфортного уровня.'},
      {name:'Румынская тяга',dose:'3 × 10',focus:'Задняя поверхность бедра',tip:'Движение начинается тазом назад. Вес близко к ногам, шея продолжает линию спины.'},
      {name:'Bird dog',dose:'2 × 8 / сторона',focus:'Кор · спина',tip:'На четвереньках вытягивай противоположные руку и ногу. Таз не разворачивай, движение делай медленно.'}
    ]
  };

  function ensurePlanState(){
    if(!window.S)return;
    if(!S.planChecks||typeof S.planChecks!=='object')S.planChecks={};
  }

  function planWeekNumber(){
    try{
      const keys=Object.keys(S.weights||{}).sort();
      if(!keys.length)return 1;
      const first=new Date(keys[0]+'T00:00:00');
      const days=Math.max(0,Math.floor((new Date()-first)/86400000));
      return Math.max(1,Math.min(4,Math.floor(days/7)+1));
    }catch(e){return 1}
  }

  function weekPlanSettings(w){
    const data=[
      {steps:7000,strength:2,note:'Входим в ритм спокойно'},
      {steps:8000,strength:2,note:'Закрепляем привычки'},
      {steps:8750,strength:2,note:'Добавляем немного движения'},
      {steps:9500,strength:2,note:'Смотрим на восстановление'}
    ];
    return data[Math.max(0,Math.min(3,w-1))];
  }

  function dayPlanForDate(d){
    const day=d.getDay();
    if(day===1)return {type:'A',title:'Силовая A',sub:'Всё тело · база',duration:'30–35 мин'};
    if(day===4)return {type:'B',title:'Силовая B',sub:'Всё тело · вариация',duration:'30–35 мин'};
    if(day===2||day===5)return {type:'walk',title:'Активный день',sub:'Шаги + лёгкая прогулка',duration:'20–40 мин'};
    if(day===3)return {type:'mobility',title:'Мягкое восстановление',sub:'Ходьба + 8–10 минут мобилизации',duration:'10–30 мин'};
    if(day===6)return {type:'optional',title:'Свободный выбор',sub:'Прогулка или лёгкая активность',duration:'по самочувствию'};
    return {type:'rest',title:'Восстановление',sub:'Спокойный день без обязательной тренировки',duration:'отдых'};
  }

  function planDashboardMarkup(){
    return '<div class="plan-experience" id="planExperience">'+
      '<div class="plan-hero">'+
        '<div class="plan-copy"><div class="label">Твой маршрут</div><div class="plan-week-label">Неделя <span id="planWeekNo">1</span> из 4</div><h3 id="planHeroTitle">Держим ритм, не идеальность</h3><p id="planHeroSub">Сегодня покажу только то, что действительно нужно сделать.</p></div>'+
        '<div class="plan-ring" id="planRing"><div><b id="planRingPct">0%</b><span>недели</span></div></div>'+
      '</div>'+
      '<div class="plan-targets">'+
        '<div><span>Шаги</span><b id="planStepTarget">7 000</b><small>в день</small></div>'+
        '<div><span>Силовые</span><b id="planStrengthTarget">2</b><small>за неделю</small></div>'+
        '<div><span>Белок</span><b>100–110</b><small>г / день</small></div>'+
      '</div>'+
      '<div class="week-route" id="weekRoute"></div>'+
      '<div class="today-plan-card" id="todayPlanCard"></div>'+
      '<div class="workout-studio" id="workoutStudio">'+
        '<div class="studio-head"><div><div class="label">Силовые тренировки</div><h3>Выбери тренировку</h3><p>MY 60 подскажет, какая следующая. Во время тренировки отмечай каждый подход отдельно.</p></div><div class="studio-week-badge" id="studioWeekBadge">0 / 2</div></div>'+
        '<div class="workout-picker" id="workoutPicker"></div>'+
        '<div class="active-workout-head"><div><span id="activeWorkoutBadge">Тренировка A</span><h4 id="activeWorkoutTitle">Всё тело · база</h4><small id="activeWorkoutMeta">6 упражнений · 30–35 мин</small></div><button class="workout-reset" onclick="resetCurrentWorkout()">Сбросить</button></div>'+
        '<div class="workout-progress"><div><span id="workoutProgressText">0 подходов</span><b id="workoutProgressPct">0%</b></div><div class="workout-progress-bar"><span id="workoutProgressBar"></span></div></div>'+
        '<div class="next-exercise" id="nextExercise"></div>'+
        '<div id="interactiveWorkoutList"></div>'+
        '<button class="btn workout-finish" id="workoutFinishBtn" onclick="completePremiumWorkout()">Завершить тренировку</button>'+
      '</div>'+
      '<div class="plan-insight" id="planInsight"></div>'+
    '</div>';
  }

  let activePlanWorkout='A';

  function weekDates(){
    const now=new Date(),day=(now.getDay()+6)%7,monday=new Date(now);
    monday.setHours(0,0,0,0);monday.setDate(now.getDate()-day);
    return Array.from({length:7},function(_,i){const d=new Date(monday);d.setDate(monday.getDate()+i);return d});
  }

  function weekWorkoutDone(type){
    return weekDates().some(function(d){return (S.workouts[key(d)]||[]).indexOf(type)>=0});
  }

  function suggestedWorkout(){
    const today=dayPlanForDate(new Date());
    if((today.type==='A'||today.type==='B')&&!weekWorkoutDone(today.type))return today.type;
    if(!weekWorkoutDone('A'))return 'A';
    if(!weekWorkoutDone('B'))return 'B';
    return today.type==='B'?'B':'A';
  }

  function updateWeekRoute(){
    const el=document.getElementById('weekRoute');if(!el)return;
    const today=key();
    const letters=['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
    el.innerHTML=weekDates().map(function(d,i){
      const k=key(d),plan=dayPlanForDate(d),done=(S.workouts[k]||[]).length>0;
      const tag=plan.type==='A'||plan.type==='B'?plan.type:(plan.type==='rest'?'—':'•');
      return '<div class="route-day '+(k===today?'today':'')+' '+(done?'done':'')+'">'+
        '<span>'+letters[i]+'</span><b>'+d.getDate()+'</b><i>'+tag+'</i>'+
      '</div>';
    }).join('');
  }

  function renderTodayPlan(){
    const card=document.getElementById('todayPlanCard');if(!card)return;
    const d=new Date(),plan=dayPlanForDate(d),settings=weekPlanSettings(planWeekNumber());
    const steps=+(S.steps[key()]||0),workouts=S.workouts[key()]||[];
    let action='',state='';
    if(plan.type==='A'||plan.type==='B'){
      const done=workouts.indexOf(plan.type)>=0;
      const w=todayWellness(),gentle=w&&((w.sleep&&w.sleep<6.5)||w.energy<=4||w.stress>=8);
      state=done?'Готово на сегодня':(gentle?'Сегодня лучше бережно':'Сегодня по плану');
      action=done
        ? '<button class="plan-primary done" disabled>Тренировка выполнена ✓</button>'
        : '<button class="plan-primary '+(gentle?'soft-plan':'')+'" onclick="startTodayWorkout(\''+plan.type+'\')">'+(gentle?'Открыть облегчённую тренировку ':'Начать тренировку ')+plan.type+'</button>';
    }else if(plan.type==='walk'||plan.type==='mobility'||plan.type==='optional'){
      state=steps>=settings.steps?'Цель движения выполнена':'День движения';
      action='<button class="plan-primary '+(steps>=settings.steps?'done':'')+'" onclick="tab(\'today\',document.querySelector(\'.nav button\'))">'+(steps>=settings.steps?'Шаги выполнены ✓':'Перейти к шагам')+'</button>';
    }else{
      state='Восстановление';
      action='<button class="plan-primary soft-plan" onclick="tab(\'today\',document.querySelector(\'.nav button\'))">Посмотреть мой день</button>';
    }
    const wellness=todayWellness(),gentleDay=wellness&&((wellness.sleep&&wellness.sleep<6.5)||wellness.energy<=4||wellness.stress>=8);
    card.innerHTML='<div class="today-plan-top"><div><span>'+state+'</span><h3>'+plan.title+'</h3><p>'+plan.sub+'</p></div><div class="plan-duration"><b>'+plan.duration+'</b><small>ориентир</small></div></div>'+
      '<div class="today-plan-note">'+(plan.type==='A'||plan.type==='B'?(gentleDay?'По чек-ину ресурс сегодня ниже обычного. Можно сделать меньше подходов или перенести силовую — это не считается срывом плана.':'Работай в спокойном темпе. Между подходами отдыхай примерно 45–90 секунд и останавливайся при острой боли.'):plan.type==='rest'?'Отдых — часть плана. Достаточно обычной повседневной активности и комфортного режима.':'Цель — набрать движение без ощущения наказания. Можно разбить прогулку на несколько коротких выходов.')+'</div>'+action;
  }

  function renderWorkoutPicker(){
    const picker=document.getElementById('workoutPicker');if(!picker)return;
    const recommended=suggestedWorkout();
    const data={
      A:{title:'Силовая A',sub:'База всего тела',detail:'ноги · ягодицы · спина · кор'},
      B:{title:'Силовая B',sub:'Вариация всего тела',detail:'ноги · плечи · спина · кор'}
    };
    picker.innerHTML=['A','B'].map(function(type){
      const d=data[type],done=weekWorkoutDone(type),active=activePlanWorkout===type;
      return '<button type="button" class="workout-choice '+(active?'active ':'')+(done?'done ':'')+'" onclick="selectPlanWorkout(\''+type+'\')">'+
        '<div class="choice-top"><span class="choice-letter">'+type+'</span><span class="choice-state">'+(done?'Выполнена ✓':recommended===type?'Следующая':'На неделе')+'</span></div>'+
        '<b>'+d.title+'</b><small>'+d.sub+'</small><i>'+d.detail+'</i>'+
      '</button>';
    }).join('');
    const badge=document.getElementById('studioWeekBadge');
    if(badge){
      const count=(weekWorkoutDone('A')?1:0)+(weekWorkoutDone('B')?1:0);
      badge.textContent=count+' / 2';
      badge.classList.toggle('done',count>=2);
    }
  }

  function selectPlanWorkout(type){
    activePlanWorkout=type==='B'?'B':'A';
    const studio=document.getElementById('workoutStudio');if(studio)studio.dataset.userPicked='1';
    renderWorkoutPicker();
    renderInteractiveWorkout();
  }

  function exerciseSetCount(ex){
    const m=String(ex.dose||'').match(/^(\d+)/);
    return m?Math.max(1,+m[1]):1;
  }

  function exerciseReps(ex){
    const parts=String(ex.dose||'').split('×');
    return parts.length>1?parts.slice(1).join('×').trim():ex.dose;
  }

  function getExerciseSetState(type,i){
    ensurePlanState();
    const bucket=S.planChecks[key()]||{},work=bucket[type]||[],old=work[i],sets=exerciseSetCount((planExerciseInfo[type]||[])[i]||{});
    if(old===true)return Array.from({length:sets},function(){return true});
    if(Array.isArray(old))return Array.from({length:sets},function(_,s){return !!old[s]});
    return Array.from({length:sets},function(){return false});
  }

  function exerciseDone(type,i){
    const state=getExerciseSetState(type,i);
    return state.length>0&&state.every(Boolean);
  }

  function togglePlanSet(type,i,setIndex){
    ensurePlanState();
    const dk=key();
    if(!S.planChecks[dk])S.planChecks[dk]={};
    if(!Array.isArray(S.planChecks[dk][type]))S.planChecks[dk][type]=[];
    const state=getExerciseSetState(type,i);
    state[setIndex]=!state[setIndex];
    S.planChecks[dk][type][i]=state;
    if(typeof save==='function')save();
    renderInteractiveWorkout();
  }

  function togglePlanExercise(type,i){
    const current=getExerciseSetState(type,i),all=current.every(Boolean);
    current.forEach(function(_,s){current[s]=!all});
    ensurePlanState();
    const dk=key();
    if(!S.planChecks[dk])S.planChecks[dk]={};
    if(!Array.isArray(S.planChecks[dk][type]))S.planChecks[dk][type]=[];
    S.planChecks[dk][type][i]=current;
    if(typeof save==='function')save();
    renderInteractiveWorkout();
  }

  function resetCurrentWorkout(){
    ensurePlanState();
    if(S.planChecks[key()]&&S.planChecks[key()][activePlanWorkout]){
      S.planChecks[key()][activePlanWorkout]=[];
      if(typeof save==='function')save();
    }
    renderInteractiveWorkout();
  }

  function showExerciseInfo(type,i){
    const ex=(planExerciseInfo[type]||[])[i];if(!ex)return;
    if(typeof sheet==='undefined'||typeof modal==='undefined')return;
    sheet.innerHTML='<div class="exercise-sheet"><div class="exercise-sheet-icon">'+(i+1)+'</div><div class="label">'+escapeHtml(ex.focus)+'</div><h3>'+escapeHtml(ex.name)+'</h3><div class="exercise-dose">'+escapeHtml(ex.dose)+'</div><p>'+escapeHtml(ex.tip)+'</p><div class="exercise-safety">Отдых между подходами: примерно 45–90 секунд. Движение должно оставаться контролируемым и комфортным. При острой боли остановись.</div><button class="btn" style="width:100%" onclick="closeM()">Понятно</button></div>';
    modal.classList.add('open');
  }

  function renderInteractiveWorkout(){
    const list=document.getElementById('interactiveWorkoutList');if(!list)return;
    const type=activePlanWorkout,items=planExerciseInfo[type]||[];
    const totalSets=items.reduce(function(n,ex){return n+exerciseSetCount(ex)},0);
    let doneSets=0,nextIndex=-1;
    items.forEach(function(ex,i){
      const state=getExerciseSetState(type,i);
      doneSets+=state.filter(Boolean).length;
      if(nextIndex<0&&!state.every(Boolean))nextIndex=i;
    });
    list.innerHTML=items.map(function(ex,i){
      const state=getExerciseSetState(type,i),done=state.every(Boolean),current=i===nextIndex;
      const setButtons=state.map(function(v,s){
        return '<button type="button" class="set-chip '+(v?'done':'')+'" onclick="togglePlanSet(\''+type+'\','+i+','+s+')"><span>'+(v?'✓':(s+1))+'</span><small>подход</small></button>';
      }).join('');
      return '<div class="exercise-card '+(done?'done ':'')+(current?'current':'')+'">'+
        '<div class="exercise-card-top">'+
          '<button class="exercise-number" onclick="togglePlanExercise(\''+type+'\','+i+')">'+(done?'✓':(i+1))+'</button>'+
          '<button class="exercise-main" onclick="showExerciseInfo(\''+type+'\','+i+')"><b>'+escapeHtml(ex.name)+'</b><small>'+escapeHtml(ex.focus)+'</small></button>'+
          '<div class="exercise-reps"><b>'+escapeHtml(exerciseReps(ex))+'</b><small>повторы</small></div>'+
        '</div>'+
        '<div class="set-row">'+setButtons+'<button class="how-btn" onclick="showExerciseInfo(\''+type+'\','+i+')">Как делать</button></div>'+
      '</div>';
    }).join('');

    const n=totalSets?Math.round(doneSets/totalSets*100):0;
    const text=document.getElementById('workoutProgressText'),pct=document.getElementById('workoutProgressPct'),bar=document.getElementById('workoutProgressBar');
    if(text)text.textContent=doneSets+' из '+totalSets+' подходов';
    if(pct)pct.textContent=n+'%';
    if(bar)bar.style.width=n+'%';

    const meta={A:{title:'Всё тело · база'},B:{title:'Всё тело · вариация'}};
    const badge=document.getElementById('activeWorkoutBadge'),title=document.getElementById('activeWorkoutTitle'),metaEl=document.getElementById('activeWorkoutMeta');
    if(badge)badge.textContent='Тренировка '+type;
    if(title)title.textContent=meta[type].title;
    if(metaEl)metaEl.textContent=items.length+' упражнений · '+totalSets+' подходов · 30–35 мин';

    const next=document.getElementById('nextExercise');
    if(next){
      if(nextIndex<0){
        next.innerHTML='<span class="next-mark done">✓</span><div><small>Все подходы готовы</small><b>Можно завершать тренировку</b></div>';
      }else{
        const ex=items[nextIndex],state=getExerciseSetState(type,nextIndex),nextSet=state.findIndex(function(v){return !v});
        next.innerHTML='<span class="next-mark">'+(nextIndex+1)+'</span><div><small>Сейчас</small><b>'+escapeHtml(ex.name)+' · подход '+(nextSet+1)+'</b></div>';
      }
    }

    const finish=document.getElementById('workoutFinishBtn');
    const already=(S.workouts[key()]||[]).indexOf(type)>=0;
    if(finish){
      finish.textContent=already?'Тренировка '+type+' выполнена ✓':(doneSets===totalSets?'Завершить тренировку '+type:'Выполни все подходы · '+doneSets+'/'+totalSets);
      finish.disabled=already||doneSets<totalSets;
      finish.classList.toggle('complete',already);
    }
  }

  function startTodayWorkout(type){
    selectPlanWorkout(type);
    const studio=document.getElementById('workoutStudio');
    if(studio)studio.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function completePremiumWorkout(){
    const type=activePlanWorkout;
    if((S.workouts[key()]||[]).indexOf(type)<0){
      if(!S.workouts[key()])S.workouts[key()]=[];
      S.workouts[key()].push(type);
    }
    if(typeof save==='function')save();
    updatePlanExperience();
  }

  function updatePlanInsight(){
    const el=document.getElementById('planInsight');if(!el)return;
    const dates=weekDates(),settings=weekPlanSettings(planWeekNumber());
    const completed=dates.reduce(function(n,d){return n+(S.workouts[key(d)]||[]).filter(function(x){return x==='A'||x==='B'}).length},0);
    const stepVals=dates.map(function(d){return +(S.steps[key(d)]||0)}).filter(function(v){return v>0});
    const avg=stepVals.length?Math.round(stepVals.reduce(function(a,b){return a+b},0)/stepVals.length):0;
    let title,copy;
    if(completed>=settings.strength){
      title='Силовые недели уже закрыты';
      copy='Отлично. Остальные дни можно оставить для шагов и восстановления — добавлять тренировку только ради галочки не нужно.';
    }else if(completed===1){
      title='Осталась одна силовая';
      copy='Неделя уже движется. Вторую силовую удобнее поставить с перерывом хотя бы в один день от первой.';
    }else{
      title='Начни с одной понятной тренировки';
      copy='Не нужно выполнять весь план сразу. Открой A, двигайся по упражнениям сверху вниз и отмечай выполненное.';
    }
    el.innerHTML='<div class="insight-mark">✦</div><div><span>Фокус недели</span><b>'+title+'</b><p>'+copy+'</p><div class="insight-stats"><i>'+completed+' / '+settings.strength+' силовых</i><i>'+(avg?avg.toLocaleString('ru-RU'):'—')+' ср. шагов</i></div></div>';
  }

  function updatePlanExperience(){
    ensurePlanState();
    if(!document.getElementById('workoutStudio')?.dataset.userPicked){activePlanWorkout=suggestedWorkout();}
    const w=planWeekNumber(),settings=weekPlanSettings(w);
    const no=document.getElementById('planWeekNo');if(no)no.textContent=w;
    const st=document.getElementById('planStepTarget');if(st)st.textContent=settings.steps.toLocaleString('ru-RU');
    const strength=document.getElementById('planStrengthTarget');if(strength)strength.textContent=settings.strength;
    const sub=document.getElementById('planHeroSub');if(sub)sub.textContent=settings.note+' · ориентир '+settings.steps.toLocaleString('ru-RU')+' шагов в день';
    const dates=weekDates();
    const workoutsDone=dates.reduce(function(n,d){return n+(S.workouts[key(d)]||[]).filter(function(x){return x==='A'||x==='B'}).length},0);
    const stepDays=dates.filter(function(d){return +(S.steps[key(d)]||0)>=settings.steps}).length;
    const score=Math.min(100,Math.round((Math.min(workoutsDone/settings.strength,1)*55)+(stepDays/7*45)));
    const ring=document.getElementById('planRing'),pct=document.getElementById('planRingPct');
    if(ring)ring.style.setProperty('--plan-p',score+'%');
    if(pct)pct.textContent=score+'%';
    updateWeekRoute();renderTodayPlan();renderWorkoutPicker();renderInteractiveWorkout();updatePlanInsight();
  }


  let progressPeriod=30;

  function progressExperienceMarkup(){
    return '<div class="progress-experience" id="progressExperience">'+
      '<div class="progress-hero">'+
        '<div class="progress-hero-copy"><div class="label">Твой прогресс</div><div class="progress-current"><strong id="progressCurrentWeight">—</strong><span>кг сейчас</span></div><div class="progress-change" id="progressChangeText">Добавь измерения веса</div></div>'+
        '<div class="progress-goal-ring" id="progressGoalRing"><div><b id="progressGoalPct">0%</b><span>к цели</span></div></div>'+
      '</div>'+
      '<div class="progress-period"><button id="progress7" onclick="setProgressPeriod(7)">7 дней</button><button id="progress30" onclick="setProgressPeriod(30)">30 дней</button></div>'+
      '<div class="progress-chart-card"><div class="progress-chart-head"><div><span>Динамика веса</span><b id="progressTrendTitle">Смотрим тенденцию</b></div><div class="trend-pill" id="progressTrendPill">—</div></div><canvas id="premiumProgressChart"></canvas><div class="progress-chart-foot"><span id="progressPeriodStart">—</span><span id="progressPeriodEnd">—</span></div></div>'+
      '<div class="progress-stat-grid">'+
        '<div><span>Средний вес</span><b id="progressAvgWeight">—</b><small id="progressAvgNote">за период</small></div>'+
        '<div><span>Талия</span><b id="progressWaist">—</b><small id="progressWaistNote">нет замеров</small></div>'+
        '<div><span>Шаги</span><b id="progressAvgSteps">—</b><small>среднее / день</small></div>'+
        '<div><span>Силовые</span><b id="progressWorkoutCount">0</b><small id="progressWorkoutNote">за период</small></div>'+
      '</div>'+
      '<div class="progress-insight" id="progressInsight"></div>'+
      '<div class="photo-compare-card" id="photoCompareCard"></div>'+
    '</div>';
  }

  function setProgressPeriod(days){
    progressPeriod=days===7?7:30;
    const a=document.getElementById('progress7'),b=document.getElementById('progress30');
    if(a)a.classList.toggle('active',progressPeriod===7);
    if(b)b.classList.toggle('active',progressPeriod===30);
    updateProgressExperience();
    setTimeout(drawProgressChart,30);
  }

  function dateKeyOffset(daysAgo){
    const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-daysAgo);return key(d);
  }

  function progressWeightEntries(){
    const cutoff=dateKeyOffset(progressPeriod-1);
    return Object.entries(S.weights||{}).filter(function(x){return x[0]>=cutoff}).sort();
  }

  function periodKeys(days){
    const out=[];
    for(let i=days-1;i>=0;i--)out.push(dateKeyOffset(i));
    return out;
  }

  function averageNumber(arr){
    return arr.length?arr.reduce(function(a,b){return a+b},0)/arr.length:0;
  }

  function nearestWeightBefore(targetKey){
    const all=Object.entries(S.weights||{}).sort();
    let found=null;
    all.forEach(function(x){if(x[0]<=targetKey)found=x});
    return found;
  }

  function progressTrend(){
    const data=progressWeightEntries();
    if(data.length<2)return {delta:0,label:'Мало данных',direction:'flat'};
    const first=+data[0][1],last=+data[data.length-1][1],delta=last-first;
    if(delta<-0.15)return {delta:delta,label:'Тренд вниз',direction:'down'};
    if(delta>0.15)return {delta:delta,label:'Тренд вверх',direction:'up'};
    return {delta:delta,label:'Вес стабилен',direction:'flat'};
  }

  function progressPhotoPair(){
    const photos=(S.photos||[]).slice().sort(function(a,b){return String(a.date).localeCompare(String(b.date))});
    const preferred=['front','side','back'];
    for(const type of preferred){
      const same=photos.filter(function(p){return p.type===type&&p.data});
      if(same.length>=2)return {type:type,first:same[0],last:same[same.length-1]};
    }
    return null;
  }

  function updateProgressExperience(){
    if(!window.S)return;
    const latest=lastWeight(),start=+START||latest,goal=+GOAL||latest;
    const total=start-goal,done=start-latest,pct=total>0?Math.max(0,Math.min(100,done/total*100)):0;
    const current=document.getElementById('progressCurrentWeight');
    if(current)current.textContent=round1(latest);
    const ring=document.getElementById('progressGoalRing'),pctEl=document.getElementById('progressGoalPct');
    if(ring)ring.style.setProperty('--goal-p',pct+'%');
    if(pctEl)pctEl.textContent=Math.round(pct)+'%';

    const data=progressWeightEntries(),trend=progressTrend();
    const change=document.getElementById('progressChangeText');
    if(change){
      if(data.length>=2){
        const d=trend.delta;
        change.textContent=(d<0?'−':d>0?'+':'')+round1(Math.abs(d))+' кг за '+progressPeriod+' дней';
      }else change.textContent='Добавь хотя бы 2 измерения за период';
    }

    const p7=document.getElementById('progress7'),p30=document.getElementById('progress30');
    if(p7)p7.classList.toggle('active',progressPeriod===7);
    if(p30)p30.classList.toggle('active',progressPeriod===30);

    const avg=data.length?averageNumber(data.map(function(x){return +x[1]})):0;
    const avgEl=document.getElementById('progressAvgWeight');
    if(avgEl)avgEl.textContent=avg?round1(avg)+' кг':'—';

    const measures=Object.entries(S.measures||{}).filter(function(x){return x[1]&&+x[1].waist}).sort();
    const mCut=dateKeyOffset(progressPeriod-1);
    const pm=measures.filter(function(x){return x[0]>=mCut});
    const latestM=measures.length?measures[measures.length-1]:null;
    const firstM=pm.length?pm[0]:null;
    const waist=document.getElementById('progressWaist'),waistNote=document.getElementById('progressWaistNote');
    if(waist)waist.textContent=latestM?round1(+latestM[1].waist)+' см':'—';
    if(waistNote){
      if(firstM&&latestM&&firstM!==latestM){
        const wd=(+latestM[1].waist)-(+firstM[1].waist);
        waistNote.textContent=(wd<0?'−':wd>0?'+':'')+round1(Math.abs(wd))+' см за период';
      }else waistNote.textContent=latestM?'нужен ещё замер':'нет замеров';
    }

    const keys=periodKeys(progressPeriod);
    const stepVals=keys.map(function(k){return +(S.steps[k]||0)}).filter(function(v){return v>0});
    const avgSteps=stepVals.length?Math.round(averageNumber(stepVals)):0;
    const stepsEl=document.getElementById('progressAvgSteps');
    if(stepsEl)stepsEl.textContent=avgSteps?avgSteps.toLocaleString('ru-RU'):'—';

    const workoutCount=keys.reduce(function(n,k){
      return n+((S.workouts[k]||[]).filter(function(x){return x==='A'||x==='B'}).length);
    },0);
    const wo=document.getElementById('progressWorkoutCount');
    if(wo)wo.textContent=workoutCount;
    const woNote=document.getElementById('progressWorkoutNote');
    if(woNote)woNote.textContent='за '+progressPeriod+' дней';

    const title=document.getElementById('progressTrendTitle'),pill=document.getElementById('progressTrendPill');
    if(title)title.textContent=trend.label;
    if(pill){pill.textContent=data.length>=2?((trend.delta<0?'−':trend.delta>0?'+':'')+round1(Math.abs(trend.delta))+' кг'):'—';pill.dataset.dir=trend.direction}

    const st=document.getElementById('progressPeriodStart'),en=document.getElementById('progressPeriodEnd');
    if(st)st.textContent=data.length?new Date(data[0][0]+'T00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'}):'—';
    if(en)en.textContent=data.length?new Date(data[data.length-1][0]+'T00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'}):'—';

    const insight=document.getElementById('progressInsight');
    if(insight){
      let head='',copy='',mark='✦';
      if(data.length<2){
        head='Пока рано оценивать тенденцию';
        copy='Добавляй вес регулярно. Один день почти ничего не говорит — полезнее смотреть среднее и направление за неделю.';
      }else if(trend.direction==='down'){
        head='Направление хорошее';
        copy='Вес за период движется вниз. Смотри не на отдельные скачки, а на общую линию и средний вес.';
        mark='↘';
      }else if(trend.direction==='up'){
        head='Не делаем вывод по одной неделе';
        copy='Вес сейчас выше начала периода. Это может быть вода, соль, цикл или содержимое ЖКТ — важнее посмотреть ещё несколько измерений и талию.';
        mark='≈';
      }else{
        head='Вес сейчас в плато';
        copy='Если так держится 2–3 недели подряд, тогда уже есть смысл пересматривать план. Несколько стабильных дней — нормальная часть процесса.';
        mark='→';
      }
      insight.innerHTML='<div class="progress-insight-mark">'+mark+'</div><div><span>Вывод MY 60</span><b>'+head+'</b><p>'+copy+'</p></div>';
    }

    const photo=document.getElementById('photoCompareCard'),pair=progressPhotoPair();
    if(photo){
      if(pair){
        const label={front:'Спереди',side:'Сбоку',back:'Сзади'}[pair.type]||'Фото';
        photo.innerHTML='<div class="photo-compare-head"><div><span>Фото прогресса</span><b>'+label+' · раньше / сейчас</b></div><button onclick="openEntryForm(\'photo\')">+ Фото</button></div><div class="photo-compare-grid"><div><img src="'+pair.first.data+'"><small>'+new Date(pair.first.date+'T00:00').toLocaleDateString('ru-RU')+'</small></div><div><img src="'+pair.last.data+'"><small>'+new Date(pair.last.date+'T00:00').toLocaleDateString('ru-RU')+'</small></div></div>';
      }else{
        photo.innerHTML='<div class="photo-compare-head"><div><span>Фото прогресса</span><b>Сравнение появится автоматически</b><p>Добавь хотя бы два фото одного ракурса.</p></div><button onclick="openEntryForm(\'photo\')">+ Фото</button></div>';
      }
    }
  }

  function drawProgressChart(){
    const cv=document.getElementById('premiumProgressChart');
    if(!cv||!window.S)return;
    const rect=cv.getBoundingClientRect(),W=Math.max(300,Math.floor(rect.width||300)),H=210,dpr=Math.min(window.devicePixelRatio||1,2);
    cv.width=W*dpr;cv.height=H*dpr;
    const ctx=cv.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    const data=progressWeightEntries();
    if(data.length<2){
      ctx.fillStyle='#929894';ctx.font='600 12px -apple-system,BlinkMacSystemFont,sans-serif';
      ctx.fillText('Добавь ещё несколько измерений веса',16,36);return;
    }
    const vals=data.map(function(x){return +x[1]}),mn=Math.min.apply(null,vals)-.35,mx=Math.max.apply(null,vals)+.35;
    const px=16,py=18,usableW=W-px*2,usableH=H-py*2;
    ctx.strokeStyle='#e7e9e5';ctx.lineWidth=1;
    for(let i=0;i<4;i++){const y=py+usableH*i/3;ctx.beginPath();ctx.moveTo(px,y);ctx.lineTo(W-px,y);ctx.stroke()}
    const pts=data.map(function(x,i){return {x:px+usableW*i/(data.length-1),y:py+usableH*(mx-(+x[1]))/(mx-mn)}});
    const fill=ctx.createLinearGradient(0,py,0,H-py);fill.addColorStop(0,'rgba(120,146,126,.20)');fill.addColorStop(1,'rgba(120,146,126,0)');
    ctx.beginPath();ctx.moveTo(pts[0].x,H-py);pts.forEach(function(p){ctx.lineTo(p.x,p.y)});ctx.lineTo(pts[pts.length-1].x,H-py);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
    ctx.beginPath();pts.forEach(function(p,i){i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});ctx.strokeStyle='#78927e';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
    const last=pts[pts.length-1];ctx.beginPath();ctx.arc(last.x,last.y,5,0,Math.PI*2);ctx.fillStyle='#bd6e78';ctx.fill();
  }

  function decorateProgress(){
    const sec=document.getElementById('progress');if(!sec)return;
    const legacy=sec.querySelector(':scope > .card');
    if(legacy)legacy.classList.add('progress-legacy-hidden');
    let exp=document.getElementById('progressExperience');
    if(!exp){
      const title=sec.querySelector('.premium-section-title');
      if(title)title.insertAdjacentHTML('afterend',progressExperienceMarkup());
      else sec.insertAdjacentHTML('afterbegin',progressExperienceMarkup());
    }
    const measure=sec.querySelector('#measureList')&&sec.querySelector('#measureList').closest('.card');
    const gallery=sec.querySelector('#gallery')&&sec.querySelector('#gallery').closest('.card');
    const milestones=sec.querySelector('#milestones')&&sec.querySelector('#milestones').closest('.card');
    if(measure)measure.classList.add('progress-detail-card');
    if(gallery)gallery.classList.add('progress-detail-card','progress-gallery-legacy');
    if(milestones)milestones.classList.add('progress-detail-card');
    updateProgressExperience();
    if(sec.classList.contains('active'))setTimeout(drawProgressChart,30);
  }

  window.setProgressPeriod=setProgressPeriod;

  function decoratePlan(){
    const sec=document.getElementById('plan');if(!sec)return;
    const oldCards=Array.from(sec.children).filter(function(x){return x.classList&&x.classList.contains('card')});
    oldCards.forEach(function(c,i){
      if(i===0||c.classList.contains('work'))c.classList.add('plan-legacy-hidden');
      if(c.querySelector&&c.querySelector('#menu'))c.classList.add('plan-menu-card');
      if(c.classList.contains('shop'))c.classList.add('plan-shop-card');
    });
    let exp=document.getElementById('planExperience');
    if(!exp){
      const title=sec.querySelector('.premium-section-title');
      if(title)title.insertAdjacentHTML('afterend',planDashboardMarkup());
      else sec.insertAdjacentHTML('afterbegin',planDashboardMarkup());
    }
    const menuCard=sec.querySelector('.plan-menu-card');
    if(menuCard){
      const label=menuCard.querySelector('.label');if(label)label.textContent='Меню на неделю';
    }
    updatePlanExperience();
  }

  window.selectPlanWorkout=selectPlanWorkout;
  window.togglePlanExercise=togglePlanExercise;
  window.togglePlanSet=togglePlanSet;
  window.resetCurrentWorkout=resetCurrentWorkout;
  window.showExerciseInfo=showExerciseInfo;
  window.startTodayWorkout=startTodayWorkout;
  window.completePremiumWorkout=completePremiumWorkout;

  function decorate(){
    decorateNav();sectionTitles();decorateToday();decorateFood();decorateProgress();decoratePlan();updateRing();
  }
  document.addEventListener('DOMContentLoaded',decorate);
  if(typeof window.render==='function'){
    const oldRender=window.render;
    window.render=function(){oldRender.apply(this,arguments);decorate();updateRing();}
  }
  if(typeof window.draw==='function')window.draw=premiumDraw;
  if(typeof window.tab==='function'){
    const oldTab=window.tab;
    window.tab=function(id,b){oldTab(id,b);requestAnimationFrame(()=>{decorate();if(id==='progress')setTimeout(()=>{premiumDraw();drawProgressChart();},60);});}
  }
  window.addEventListener('resize',()=>{if((function(){var p=document.getElementById('progress');return p&&p.classList.contains('active')})())premiumDraw();});
})();