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

  function navButtonFor(section){
    const buttons=Array.from(document.querySelectorAll('.nav button'));
    const map={today:0,food:1,progress:2,plan:3,more:4};
    return buttons[map[section]||0]||buttons[0];
  }

  function dailyAction(action){
    if(action==='wellness')return openEntryForm('wellness');
    if(action==='steps')return openEntryForm('steps');
    if(action==='water')return addWater(250);
    if(action==='weight')return openEntryForm('weight');
    if(action==='food')return tab('food',navButtonFor('food'));
    if(action==='plan')return tab('plan',navButtonFor('plan'));
  }

  function dailyCommandMarkup(){
    return '<div class="daily-command" id="dailyCommand">'+
      '<div class="daily-command-head"><div><span>План дня</span><h3 id="dailyCommandTitle">Три главных шага</h3><p id="dailyCommandSub">MY 60 выберет только то, что важно сегодня.</p></div><div class="daily-score" id="dailyScore"><b>0%</b><span>дня</span></div></div>'+
      '<div class="daily-priorities" id="dailyPriorities"></div>'+
      '<div class="daily-route" id="dailyRoute"></div>'+
      '<div class="daily-left" id="dailyLeft"></div>'+
    '</div>';
  }

  function todayFoodSummary(){
    const list=(S.food&&S.food[key()])||[];
    return list.reduce(function(a,x){a.cal+=+x.cal||0;a.p+=+x.p||0;return a},{cal:0,p:0});
  }

  function todayWorkoutPlan(){
    if(typeof dayPlanForDate!=='function')return null;
    return dayPlanForDate(new Date());
  }

  function dailyTaskData(){
    const w=todayWellness(),food=todayFoodSummary(),stepsNow=+(S.steps[key()]||0),waterNow=+(S.water[key()]||0),g=appGoals();
    const stepGoalNow=typeof target==='function'?target():g.steps;
    const calGoal=g.calories;
    const workoutPlan=todayWorkoutPlan(),doneWork=(S.workouts[key()]||[]);
    const tasks=[];

    tasks.push({
      id:'wellness',title:'Чек-ин состояния',sub:w?'Готово · рекомендации уже подстроены':'Сон, энергия, голод и стресс',
      done:!!w,action:'wellness',cta:w?'Изменить':'Заполнить',icon:'♡',priority:w?8:1
    });

    if(food.cal<=0){
      tasks.push({id:'food',title:'Записать первый приём пищи',sub:'Так MY 60 сможет считать остаток и белок',done:false,action:'food',cta:'Открыть питание',icon:'○',priority:2});
    }else if(food.p<g.protein*.86){
      tasks.push({id:'protein',title:'Добрать белок',sub:'Сейчас '+Math.round(food.p)+' г · цель '+Math.round(g.protein)+' г',done:false,action:'food',cta:'Подобрать еду',icon:'P',priority:2});
    }else{
      tasks.push({id:'protein',title:'Белок на сегодня',sub:Math.round(food.p)+' г · хороший уровень',done:true,action:'food',cta:'Посмотреть',icon:'✓',priority:9});
    }

    if(workoutPlan&&(workoutPlan.type==='A'||workoutPlan.type==='B')){
      const wd=doneWork.indexOf(workoutPlan.type)>=0;
      const gentle=w&&((w.sleep&&w.sleep<6.5)||w.energy<=4||w.stress>=8);
      tasks.push({
        id:'workout',title:wd?'Силовая выполнена':'Тренировка '+workoutPlan.type,
        sub:wd?'Готово на сегодня':(gentle?'Сегодня можно облегчить или перенести':'30–35 минут · по плану сегодня'),
        done:wd,action:'plan',cta:wd?'Готово':'Открыть план',icon:'A',priority:wd?10:3
      });
    }

    tasks.push({
      id:'steps',title:'Шаги',sub:stepsNow.toLocaleString('ru-RU')+' из '+Math.round(stepGoalNow).toLocaleString('ru-RU'),
      done:stepsNow>=stepGoalNow,action:'steps',cta:stepsNow>=stepGoalNow?'Готово':'Добавить шаги',icon:'↗',priority:4
    });
    tasks.push({
      id:'water',title:'Вода',sub:waterNow.toLocaleString('ru-RU')+' из '+Math.round(g.water).toLocaleString('ru-RU')+' мл',
      done:waterNow>=g.water,action:'water',cta:waterNow>=g.water?'Готово':'+250 мл',icon:'◌',priority:5
    });

    const calOkay=food.cal>=calGoal*.78&&food.cal<=calGoal*1.12;
    if(food.cal>0)tasks.push({
      id:'calories',title:'Баланс питания',sub:Math.round(food.cal)+' из '+calGoal+' ккал',
      done:calOkay,action:'food',cta:'Посмотреть',icon:'≈',priority:6
    });

    return tasks;
  }

  function updateDailyCommand(){
    const root=document.getElementById('dailyCommand');if(!root||!window.S)return;
    const tasks=dailyTaskData(),done=tasks.filter(function(t){return t.done}).length;
    const score=tasks.length?Math.round(done/tasks.length*100):0;
    const scoreEl=document.getElementById('dailyScore');
    if(scoreEl){scoreEl.querySelector('b').textContent=score+'%';scoreEl.style.setProperty('--daily-p',score+'%')}

    const priorities=document.getElementById('dailyPriorities');
    const chosen=tasks.slice().sort(function(a,b){
      if(a.done!==b.done)return a.done?1:-1;
      return a.priority-b.priority;
    }).slice(0,3);
    if(priorities)priorities.innerHTML=chosen.map(function(t,i){
      return '<button type="button" class="daily-priority '+(t.done?'done':'')+'" onclick="dailyAction(\''+t.action+'\')">'+
        '<div class="daily-priority-num">'+(t.done?'✓':'0'+(i+1))+'</div><div class="daily-priority-copy"><b>'+t.title+'</b><small>'+t.sub+'</small></div><span>'+t.cta+'</span>'+
      '</button>';
    }).join('');

    const route=document.getElementById('dailyRoute');
    if(route){
      const hour=new Date().getHours(),w=todayWellness(),weightDone=!!(S.weights&&S.weights[key()]),food=todayFoodSummary(),stepsDone=+(S.steps[key()]||0)>0;
      const segments=[
        {name:'Утро',state:(w||weightDone)?'done':(hour<12?'now':'miss'),text:w?'чек-ин готов':weightDone?'вес записан':'чек-ин + вес по желанию'},
        {name:'День',state:food.cal>0?'done':(hour>=12&&hour<18?'now':'wait'),text:food.cal>0?'питание ведётся':'еда + вода + движение'},
        {name:'Вечер',state:stepsDone&&hour>=18?'done':(hour>=18?'now':'wait'),text:hour>=18?'закрыть остаток дня':'итоги и план на завтра'}
      ];
      route.innerHTML=segments.map(function(s){return '<div class="route-segment '+s.state+'"><i></i><div><b>'+s.name+'</b><small>'+s.text+'</small></div></div>'}).join('');
    }

    const left=document.getElementById('dailyLeft');
    if(left){
      const remaining=tasks.filter(function(t){return !t.done});
      if(!remaining.length){
        left.innerHTML='<div class="daily-left-mark">✓</div><div><span>На сегодня достаточно</span><b>Главные пункты закрыты</b><p>Не нужно добирать активность или еду только ради красивого процента.</p></div>';
      }else{
        const first=remaining.slice().sort(function(a,b){return a.priority-b.priority})[0];
        left.innerHTML='<div class="daily-left-mark">→</div><div><span>Следующий шаг</span><b>'+first.title+'</b><p>'+first.sub+'</p></div>';
      }
    }

    const title=document.getElementById('dailyCommandTitle'),sub=document.getElementById('dailyCommandSub');
    if(title)title.textContent=score>=80?'День почти собран':score>=40?'Держим ритм':'Начнём с малого';
    if(sub)sub.textContent=score>=80?'Осталось совсем немного. Не нужно делать больше плана.':score>=40?'Закрывай пункты по одному — порядок не важен.':'Выбери только первый пункт. Остальное MY 60 подстроит дальше.';
  }


  function tomorrowDate(){
    const d=new Date();d.setDate(d.getDate()+1);return d;
  }

  function tomorrowFocus(){
    const food=todayFoodSummary(),w=todayWellness(),stepsNow=+(S.steps[key()]||0);
    const stepGoalNow=typeof target==='function'?target():((S.profile&&+S.profile.steps)||7000);
    const plan=typeof dayPlanForDate==='function'?dayPlanForDate(tomorrowDate()):null;
    if(w&&((w.sleep&&w.sleep<6.5)||w.energy<=4||w.stress>=8))return {title:'Восстановление',text:'Завтра не добавляем нагрузку сверх плана. Сон, обычная еда и спокойный ритм — приоритет.',icon:'☾'};
    if(food.p>0&&food.p<appGoals().protein*.86)return {title:'Белок с первого приёма пищи',text:'Сегодня белка было меньше ориентира. Завтра проще начать с яйца, творога, йогурта или другого привычного белкового продукта.',icon:'P'};
    if(plan&&(plan.type==='A'||plan.type==='B'))return {title:'Силовая '+plan.type,text:'Завтра по плану тренировка '+plan.type+'. Достаточно 30–35 минут без попытки сделать больше.',icon:'A'};
    if(stepsNow>0&&stepsNow<stepGoalNow*.7)return {title:'Немного больше движения',text:'Не нужно резко повышать шаги. Добавь одну короткую прогулку в удобное время.',icon:'↗'};
    return {title:'Повторить рабочий ритм',text:'Сегодня нет сигнала, что завтра нужно что-то ужесточать. Повторяем базовый план.',icon:'✓'};
  }

  function tomorrowPrep(){
    const plan=typeof dayPlanForDate==='function'?dayPlanForDate(tomorrowDate()):null;
    const items=[];
    if(plan&&(plan.type==='A'||plan.type==='B'))items.push('Оставить 30–35 минут под силовую '+plan.type);
    items.push('Подготовить белковый продукт на первый приём пищи');
    items.push('Поставить воду на видное место');
    return items.slice(0,3);
  }

  function eveningCardMarkup(){
    return '<div class="evening-card" id="eveningCard"></div>';
  }

  function ensureDayCloseState(){
    if(!window.S)return;
    if(!S.dayClosed||typeof S.dayClosed!=='object')S.dayClosed={};
  }

  function closeToday(){
    ensureDayCloseState();
    S.dayClosed[key()]=true;
    if(typeof save==='function')save();
    updateEveningCard();
  }

  function reopenToday(){
    ensureDayCloseState();
    delete S.dayClosed[key()];
    if(typeof save==='function')save();
    updateEveningCard();
  }

  function updateEveningCard(){
    const card=document.getElementById('eveningCard');if(!card||!window.S)return;
    ensureDayCloseState();
    const hour=new Date().getHours(),closed=!!S.dayClosed[key()];
    const food=todayFoodSummary(),stepsNow=+(S.steps[key()]||0),waterNow=+(S.water[key()]||0),w=todayWellness(),g=appGoals();
    const stepGoalNow=typeof target==='function'?target():g.steps;
    const calGoal=g.calories;
    const tomorrow=tomorrowDate(),tPlan=typeof dayPlanForDate==='function'?dayPlanForDate(tomorrow):null,focus=tomorrowFocus(),prep=tomorrowPrep();
    const tomorrowLabel=tomorrow.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'short'});
    const todayChecks=[
      {name:'Питание',done:food.cal>0,text:food.cal>0?Math.round(food.cal)+' ккал':'не записано'},
      {name:'Белок',done:food.p>=g.protein*.86,text:food.p?Math.round(food.p)+' г':'—'},
      {name:'Шаги',done:stepsNow>=stepGoalNow,text:stepsNow.toLocaleString('ru-RU')},
      {name:'Вода',done:waterNow>=g.water,text:waterNow+' мл'},
      {name:'Чек-ин',done:!!w,text:w?'готов':'нет'}
    ];
    const doneCount=todayChecks.filter(function(x){return x.done}).length;
    const daySummary=doneCount>=4?'День собран достаточно':doneCount>=2?'База дня есть':'Сегодня было мало данных — и это тоже нормально';
    const tomorrowActivity=tPlan?(
      tPlan.type==='A'||tPlan.type==='B'?'Силовая '+tPlan.type:
      tPlan.type==='rest'?'Восстановление':
      tPlan.type==='mobility'?'Мобилизация + шаги':
      tPlan.type==='walk'?'Активный день':'Свободная активность'
    ):'По плану';

    if(hour<17&&!closed){
      card.dataset.state='preview';
      card.innerHTML=
        '<div class="evening-preview-head"><div><span>Завтра</span><h3>'+tomorrowActivity+'</h3><p>'+tomorrowLabel+' · план уже готов</p></div><div class="evening-preview-icon">→</div></div>'+
        '<div class="tomorrow-focus-mini"><i>'+focus.icon+'</i><div><b>'+focus.title+'</b><p>'+focus.text+'</p></div></div>';
      return;
    }

    card.dataset.state=closed?'closed':'evening';
    card.innerHTML=
      '<div class="evening-head"><div><span>'+(closed?'День завершён':'Вечерний итог')+'</span><h3>'+daySummary+'</h3><p>'+(closed?'Можно отпустить сегодняшний день и перейти к завтра.':'Посмотри итог и закрой день без попытки исправить всё вечером.')+'</p></div><div class="evening-moon">'+(closed?'✓':'☾')+'</div></div>'+
      '<div class="evening-checks">'+todayChecks.map(function(x){return '<div class="'+(x.done?'done':'')+'"><i>'+(x.done?'✓':'•')+'</i><span>'+x.name+'</span><b>'+x.text+'</b></div>'}).join('')+'</div>'+
      '<div class="tomorrow-card">'+
        '<div class="tomorrow-head"><div><span>План на завтра</span><b>'+tomorrowActivity+'</b><small>'+tomorrowLabel+'</small></div><div class="tomorrow-focus-icon">'+focus.icon+'</div></div>'+
        '<div class="tomorrow-focus"><b>'+focus.title+'</b><p>'+focus.text+'</p></div>'+
        '<div class="tomorrow-prep">'+prep.map(function(x){return '<div><i>✓</i><span>'+x+'</span></div>'}).join('')+'</div>'+
      '</div>'+
      (closed
        ? '<button class="evening-reopen" type="button" onclick="reopenToday()">Изменить записи сегодняшнего дня</button>'
        : '<button class="evening-close" type="button" onclick="closeToday()">Завершить день</button>');
  }

  window.closeToday=closeToday;
  window.reopenToday=reopenToday;

  window.dailyAction=dailyAction;

  function todayMenuCardMarkup(){
    return '<div class="today-menu-card" id="todayMenuCard"></div>';
  }

  function currentMenuDay(){
    if(typeof planDayNumber!=='function'||typeof ensureWeeklyMenu!=='function')return null;
    const day=planDayNumber();
    if(day<=0||day>28)return {dayNumber:day,day:null,index:null};
    const index=(day-1)%7;
    const menu=ensureWeeklyMenu();
    return {dayNumber:day,day:menu[index],index:index};
  }

  function menuMealAddedToday(meal){
    const list=(S.food&&S.food[key()])||[];
    return list.some(function(x){return x.menuPlanId===meal.id});
  }

  function addTodayMenuMeal(type){
    const info=currentMenuDay();if(!info||!info.day)return;
    const meal=menuMealById(type,info.day[type]);if(!meal)return;
    const undo=foodUndoSnapshot(key());
    const mealMap={breakfast:'Завтрак',lunch:'Обед',snack:'Перекус',dinner:'Ужин'};
    if(!S.food[key()])S.food[key()]=[];
    if(!menuMealAddedToday(meal)){
      S.food[key()].push({
        meal:mealMap[type],
        name:meal.title,
        cal:meal.kcal,p:meal.p,f:meal.f,c:meal.c,
        menuPlanId:meal.id
      });
      if(typeof save==='function')save();
      showFoodUndo('Добавлено: '+meal.title,undo);
    }
  }

  function openWeeklyMenuFromToday(){
    if(typeof tab!=='function')return;
    tab('plan',navButtonFor('plan'));
    setTimeout(function(){
      const el=document.getElementById('weeklyMenu');
      if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
    },220);
  }

  function updateTodayMenuCard(){
    const card=document.getElementById('todayMenuCard');if(!card||!window.S)return;
    const info=currentMenuDay();
    if(!info)return;

    if(info.dayNumber<=0){
      const start=planStartDate();
      card.dataset.state='waiting';
      card.innerHTML=
        '<div class="today-menu-head"><div><span>Меню дня</span><h3>Начнём '+start.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})+'</h3><p>Меню привязано к старту программы и появится здесь в первый день.</p></div><div class="today-menu-mark">○</div></div>'+
        '<button class="today-menu-open" type="button" onclick="openWeeklyMenuFromToday()">Посмотреть меню заранее</button>';
      return;
    }

    if(info.dayNumber>28||!info.day){
      card.dataset.state='complete';
      card.innerHTML=
        '<div class="today-menu-head"><div><span>Меню дня</span><h3>Первый цикл завершён</h3><p>28-дневное меню пройдено. В «Плане» можно собрать следующий цикл.</p></div><div class="today-menu-mark">✓</div></div>'+
        '<button class="today-menu-open" type="button" onclick="openWeeklyMenuFromToday()">Открыть меню недели</button>';
      return;
    }

    const types=['breakfast','lunch','snack','dinner'];
    const labels={breakfast:'Завтрак',lunch:'Обед',snack:'Перекус',dinner:'Ужин'};
    const icons={breakfast:'☼',lunch:'◐',snack:'◇',dinner:'☾'};
    const meals=types.map(function(type){
      const meal=menuMealById(type,info.day[type]);
      return {type:type,meal:meal,done:menuMealAddedToday(meal)};
    });
    const totals=weeklyMenuDayTotals(info.day);
    const next=meals.find(function(x){return !x.done})||null;
    const doneCount=meals.filter(function(x){return x.done}).length;

    card.dataset.state=doneCount===4?'done':'active';
    card.innerHTML=
      '<div class="today-menu-head"><div><span>Меню дня · день '+info.dayNumber+'</span><h3>'+(next?'Что есть сегодня':'Меню на сегодня добавлено')+'</h3><p>'+Math.round(totals.kcal)+' ккал · Б '+Math.round(totals.p)+' г · можно менять в разделе «План».</p></div><div class="today-menu-mark">'+(doneCount===4?'✓':doneCount+'/4')+'</div></div>'+
      (next?'<div class="today-menu-next"><span>Следующий приём пищи</span><b>'+labels[next.type]+' · '+next.meal.title+'</b><small>'+next.meal.kcal+' ккал · Б '+next.meal.p+' г</small><button type="button" onclick="addTodayMenuMeal(\''+next.type+'\')">Добавить '+labels[next.type].toLowerCase()+'</button></div>':'')+
      '<div class="today-menu-list">'+meals.map(function(x){
        return '<div class="today-menu-row '+(x.done?'done':'')+'">'+
          '<i>'+icons[x.type]+'</i>'+
          '<div><span>'+labels[x.type]+'</span><b>'+x.meal.title+'</b><small>'+x.meal.kcal+' ккал · Б '+x.meal.p+' г</small></div>'+
          '<button type="button" '+(x.done?'disabled':'onclick="addTodayMenuMeal(\''+x.type+'\')"')+'>'+(x.done?'✓':'+')+'</button>'+
        '</div>';
      }).join('')+'</div>'+
      '<button class="today-menu-open" type="button" onclick="openWeeklyMenuFromToday()">Изменить меню недели</button>';
  }

  window.addTodayMenuMeal=addTodayMenuMeal;
  window.openWeeklyMenuFromToday=openWeeklyMenuFromToday;

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
    let dc=document.getElementById('dailyCommand');
    if(!dc){
      const anchor=document.getElementById('todayWellnessCard')||sec.querySelector('.quick-strip')||hero;
      if(anchor)anchor.insertAdjacentHTML('afterend',dailyCommandMarkup());
    }
    const oldWell=sec.querySelector('#wellText')&&sec.querySelector('#wellText').closest('.card');
    if(oldWell)oldWell.classList.add('today-legacy-wellness');
    const oldCheck=sec.querySelector('#score')&&sec.querySelector('#score').closest('.card');
    if(oldCheck)oldCheck.classList.add('today-legacy-check');
    updateDailyCommand();
    let tm=document.getElementById('todayMenuCard');
    if(!tm){
      const anchor=document.getElementById('dailyCommand')||document.getElementById('todayWellnessCard')||sec.querySelector('.quick-strip')||hero;
      if(anchor)anchor.insertAdjacentHTML('afterend',todayMenuCardMarkup());
    }
    updateTodayMenuCard();
    let ec=document.getElementById('eveningCard');
    if(!ec){
      const anchor=document.getElementById('dailyCommand')||document.getElementById('todayWellnessCard')||sec.querySelector('.quick-strip')||hero;
      if(anchor)anchor.insertAdjacentHTML('afterend',eveningCardMarkup());
    }
    updateEveningCard();
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
    {id:'base-spaghetti-gravy',name:'Спагетти с подливой, домашние',kcal100:160,p100:6.5,f100:4.5,c100:24.0,defaultGrams:250},
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
    {id:'base-latte',name:'Латте без сахара',kcal100:55,p100:3.0,f100:2.8,c100:4.5},
    {id:'base-adrenaline-rush-449',name:'Adrenaline Rush, классический 449 мл',kcal100:54,p100:0.5,f100:0,c100:12.5,caffeine100:30,defaultGrams:449,mealDefault:'Напиток'}
  ];

  function ensureProductLibrary(){
    if(!window.S)return [];
    if(!Array.isArray(S.productLibrary))S.productLibrary=[];
    S.productLibrary.forEach(function(p,i){
      if(!p.id)p.id='p'+i+'-'+String(p.name||'').toLowerCase().replace(/[^a-zа-яё0-9]+/gi,'-');
      if(typeof p.favorite!=='boolean')p.favorite=false;
      if(!p.lastUsed)p.lastUsed=0;
      if(normalizeProductName(p.name)==='adrenaline rush классический 449 мл'){
        p.defaultGrams=449;
        p.mealDefault='Напиток';
        p.caffeine100=30;
      }
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
      '<div class="library-top"><div><div class="label">Мои продукты</div><div class="library-title">Быстрый выбор</div><div class="library-base-note">В поиске также '+builtInProducts.length+' продуктов и блюд MY 60</div></div><span class="library-count" id="libraryCount">0</span></div>'+
      '<div id="favoriteProducts"></div>'+
      '<div id="recentProducts"></div>'+
    '</div>';
  }

  function calculatorMarkup(){
    return '<div class="card calorie-card" id="calorieCalculator">'+
      '<div class="calorie-head"><div><div class="label">Быстро добавить</div><div class="big calorie-title">Найди продукт</div><div class="muted">Выбери из базы MY 60 или из своих сохранённых — КБЖУ подставится автоматически.</div></div><div class="calorie-icon"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg></div></div>'+
      '<div class="smart-search-block product-search-wrap"><div class="search-icon"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg></div><input id="calcName" autocomplete="off" placeholder="Творог, картошка, гуляш…" onfocus="productSearch(this.value)" oninput="clearSelectedProductMeta();productSearch(this.value)"><div class="product-suggestions" id="productSuggestions"></div></div>'+
      '<div class="quick-food-row">'+
        '<button type="button" onclick="quickFood(\'base-cottage-5\')">Творог</button>'+
        '<button type="button" onclick="quickFood(\'base-egg\')">Яйцо</button>'+
        '<button type="button" onclick="quickFood(\'base-chicken-breast-boiled\')">Курица</button>'+
        '<button type="button" onclick="quickFood(\'base-buckwheat\')">Гречка</button>'+
        '<button type="button" onclick="quickFood(\'base-potato-puree\')">Пюре</button>'+
        '<button type="button" onclick="quickFood(\'base-goulash\')">Гуляш</button>'+
        '<button type="button" onclick="quickFood(\'base-spaghetti-gravy\')">Спагетти</button>'+
        '<button type="button" onclick="addAdrenalineRush449()">Adrenaline · 449 мл</button>'+
      '</div>'+
      productLibraryMarkup()+
      '<div class="calc-fields">'+
        '<div><label>Приём пищи</label><select id="calcMeal"><option>Завтрак</option><option>Обед</option><option>Перекус</option><option>Ужин</option><option>Напиток</option><option>Другое</option></select></div>'+
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

  function entryCaffeineMg(x){
    return Math.max(0,+((x&&x.caffeineMg)||0));
  }

  function adjustDayCaffeine(delta,k){
    const dayKey=k||key();
    const next=Math.max(0,(+(S.caf&&S.caf[dayKey]||0))+(+delta||0));
    if(!S.caf)S.caf={};
    S.caf[dayKey]=round1(next);
  }

  function selectedProductCaffeine100(){
    const calc=document.getElementById('calorieCalculator');
    return calc?(+calc.dataset.caffeine100||0):0;
  }

  function clearSelectedProductMeta(){
    const calc=document.getElementById('calorieCalculator');
    if(calc){
      calc.dataset.caffeine100='';
      calc.dataset.productId='';
      calc.dataset.defaultGrams='';
      calc.dataset.mealDefault='';
    }
  }

  window.clearSelectedProductMeta=clearSelectedProductMeta;

  let foodUndoState=null,foodUndoTimer=null;

  function foodUndoSnapshot(dateKey){
    const k=dateKey||key();
    const hasFood=!!(S.food&&Object.prototype.hasOwnProperty.call(S.food,k));
    const hasCaf=!!(S.caf&&Object.prototype.hasOwnProperty.call(S.caf,k));
    return {
      dateKey:k,
      hasFood:hasFood,
      food:hasFood?JSON.parse(JSON.stringify(S.food[k]||[])):null,
      hasCaf:hasCaf,
      caf:hasCaf?(+S.caf[k]||0):null
    };
  }

  function ensureFoodUndoToast(){
    let el=document.getElementById('foodUndoToast');
    if(el)return el;
    el=document.createElement('div');
    el.id='foodUndoToast';
    el.className='food-undo-toast';
    el.innerHTML='<div><span id="foodUndoText">Готово</span><button type="button" onclick="undoLastFoodAction()">Отменить</button></div>';
    document.body.appendChild(el);
    return el;
  }

  function showFoodUndo(message,snapshot){
    if(!snapshot)return;
    foodUndoState=snapshot;
    clearTimeout(foodUndoTimer);
    const el=ensureFoodUndoToast(),txt=document.getElementById('foodUndoText');
    if(txt)txt.textContent=message||'Изменение сохранено';
    el.classList.remove('undone');
    requestAnimationFrame(function(){el.classList.add('show')});
    foodUndoTimer=setTimeout(function(){
      el.classList.remove('show');
      foodUndoState=null;
    },6000);
  }

  function undoLastFoodAction(){
    const snap=foodUndoState;if(!snap)return;
    clearTimeout(foodUndoTimer);
    if(!S.food)S.food={};
    if(!S.caf)S.caf={};
    if(snap.hasFood)S.food[snap.dateKey]=JSON.parse(JSON.stringify(snap.food||[]));
    else delete S.food[snap.dateKey];
    if(snap.hasCaf)S.caf[snap.dateKey]=snap.caf;
    else delete S.caf[snap.dateKey];
    foodUndoState=null;
    if(typeof save==='function')save();
    const el=ensureFoodUndoToast(),txt=document.getElementById('foodUndoText');
    if(txt)txt.textContent='Отменено';
    el.classList.add('undone','show');
    foodUndoTimer=setTimeout(function(){el.classList.remove('show')},1200);
  }

  window.undoLastFoodAction=undoLastFoodAction;

  function applyProductToCalculator(p){
    if(!p)return;
    const values={calcName:p.name,calcKcal100:p.kcal100,calcP100:p.p100,calcF100:p.f100,calcC100:p.c100};
    Object.keys(values).forEach(function(k){
      const el=document.getElementById(k);
      if(el)el.value=values[k]==null?'':values[k];
    });
    const calc=document.getElementById('calorieCalculator');
    if(calc){
      calc.dataset.caffeine100=p.caffeine100?String(p.caffeine100):'';
      calc.dataset.productId=p.id||'';
      calc.dataset.defaultGrams=p.defaultGrams?String(p.defaultGrams):'';
      calc.dataset.mealDefault=p.mealDefault||'';
    }
    hideProductSuggestions();
    const meal=document.getElementById('calcMeal');
    if(meal&&p.mealDefault)meal.value=p.mealDefault;
    const grams=document.getElementById('calcGrams');
    if(grams){
      grams.value=p.defaultGrams?String(p.defaultGrams):'';
      if(!p.defaultGrams)setTimeout(function(){grams.focus()},40);
    }
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
      const popular=['Яйцо куриное, варёное','Творог 5%','Куриная грудка, варёная','Картофель варёный','Картошка жареная','Картофельное пюре с молоком и маслом','Гуляш из говядины','Гречка варёная','Спагетти с подливой, домашние','Adrenaline Rush, классический 449 мл'];
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

  function isAdrenalineProduct(p){
    return !!p&&(p.id==='base-adrenaline-rush-449'||normalizeProductName(p.name)==='adrenaline rush классический 449 мл');
  }

  function chooseProductSuggestion(source,id){
    const p=source==='saved'
      ? ensureProductLibrary().find(function(x){return x.id===id})
      : builtInProducts.find(function(x){return x.id===id});
    if(isAdrenalineProduct(p)){hideProductSuggestions();addAdrenalineRush449();return}
    applyProductToCalculator(p);
  }

  function selectSavedProduct(id){
    const p=ensureProductLibrary().find(function(x){return x.id===id});
    if(isAdrenalineProduct(p)){addAdrenalineRush449();return}
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
    p.caffeine100=selectedProductCaffeine100()||0;
    const calc=document.getElementById('calorieCalculator');
    p.defaultGrams=calc&&+calc.dataset.defaultGrams?+calc.dataset.defaultGrams:(p.defaultGrams||0);
    p.mealDefault=calc&&calc.dataset.mealDefault?calc.dataset.mealDefault:(p.mealDefault||'');
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
        '<div class="macro-card protein"><div class="macro-top"><span>Белок</span><b><i id="dashP">0</i> / <i id="dashPGoal">105</i> г</b></div><div class="macro-track"><span id="dashPBar"></span></div><small id="dashPLeft">осталось 105 г</small></div>'+
        '<div class="macro-card fat"><div class="macro-top"><span>Жиры</span><b><i id="dashF">0</i> / 55 г</b></div><div class="macro-track"><span id="dashFBar"></span></div><small id="dashFLeft">осталось 55 г</small></div>'+
        '<div class="macro-card carbs"><div class="macro-top"><span>Углеводы</span><b><i id="dashC">0</i> / 155 г</b></div><div class="macro-track"><span id="dashCBar"></span></div><small id="dashCLeft">осталось 155 г</small></div>'+
      '</div>'+
      '<div class="meal-pulse" id="mealPulse"></div>'+
    '</div>';
  }

  function smartMealSectionMarkup(){
    return '<div class="smart-meal-section" id="smartMealSection">'+
      '<div class="smart-tip" id="smartNutritionTip"></div>'+
    '</div>';
  }

  function addAdrenalineRush449(){
    if(!window.S||typeof key!=='function')return;
    const undo=foodUndoSnapshot(key());
    const p=builtInProducts.find(function(x){return x.id==='base-adrenaline-rush-449'});
    if(!p)return;
    const amount=449,factor=amount/100;
    const caffeine=round1((+p.caffeine100||0)*factor);
    if(!S.food[key()])S.food[key()]=[];
    S.food[key()].push({
      meal:'Напиток',
      name:'Adrenaline Rush · 449 мл',
      baseName:p.name,
      grams:amount,
      unit:'мл',
      kcal100:p.kcal100,p100:p.p100,f100:p.f100,c100:p.c100,
      caffeine100:p.caffeine100,
      caffeineMg:caffeine,
      caffeineAt:Date.now(),
      cal:Math.round((+p.kcal100||0)*factor),
      p:round1((+p.p100||0)*factor),
      f:round1((+p.f100||0)*factor),
      c:round1((+p.c100||0)*factor),
      productId:p.id
    });
    adjustDayCaffeine(caffeine,key());
    if(typeof save==='function')save();
    showFoodUndo('Adrenaline добавлен · 449 мл',undo);
  }

  window.addAdrenalineRush449=addAdrenalineRush449;

  function quickFood(id){
    if(id==='base-adrenaline-rush-449'){addAdrenalineRush449();return}
    const p=builtInProducts.find(function(x){return x.id===id});
    if(!p)return;
    applyProductToCalculator(p);
    const calc=document.getElementById('calorieCalculator');
    if(calc)calc.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function tipButton(id,label){
    return '<button type="button" onclick="quickFood(\''+id+'\')">'+escapeHtml(label)+'</button>';
  }

  function baseProduct(id){
    return builtInProducts.find(function(x){return x.id===id});
  }

  function comboTotals(combo){
    return combo.items.reduce(function(a,it){
      const p=baseProduct(it.id);if(!p)return a;
      const factor=(+it.grams||0)/100;
      a.cal+=(+p.kcal100||0)*factor;
      a.p+=(+p.p100||0)*factor;
      a.f+=(+p.f100||0)*factor;
      a.c+=(+p.c100||0)*factor;
      return a;
    },{cal:0,p:0,f:0,c:0});
  }

  function smartMealLibrary(){
    return [
      {id:'cottage-banana',meal:'Завтрак',title:'Творог + банан',note:'Сытный сладкий завтрак без сложной готовки',items:[{id:'base-cottage-5',grams:180},{id:'base-banana',grams:80}]},
      {id:'eggs-buckwheat',meal:'Завтрак',title:'Яйца + гречка',note:'Тёплый вариант с белком и гарниром',items:[{id:'base-egg',grams:100},{id:'base-buckwheat',grams:130}]},
      {id:'chicken-buckwheat',meal:'Обед',title:'Курица + гречка',note:'Много белка и понятная порция',items:[{id:'base-chicken-breast-boiled',grams:150},{id:'base-buckwheat',grams:150}]},
      {id:'chicken-potato',meal:'Обед',title:'Курица + картофель',note:'Обычная домашняя еда, без «диетического» ощущения',items:[{id:'base-chicken-breast-boiled',grams:130},{id:'base-potato-boiled',grams:200}]},
      {id:'yogurt-berries',meal:'Перекус',title:'Йогурт + клубника',note:'Лёгкий перекус с белком',items:[{id:'base-greek-yogurt',grams:200},{id:'base-strawberry',grams:150}]},
      {id:'cottage-apple',meal:'Перекус',title:'Творог + яблоко',note:'Когда хочется чего-то сладкого и сытного',items:[{id:'base-cottage-5',grams:150},{id:'base-apple',grams:130}]},
      {id:'chicken-salad',meal:'Ужин',title:'Курица + греческий салат',note:'Белковый ужин с овощами',items:[{id:'base-chicken-breast-boiled',grams:130},{id:'base-greek-salad',grams:180}]},
      {id:'egg-potato',meal:'Ужин',title:'Яйца + картофель',note:'Простой домашний вариант на вечер',items:[{id:'base-egg',grams:100},{id:'base-potato-boiled',grams:180}]}
    ];
  }

  function nextMealName(){
    const hour=new Date().getHours();
    const list=(S.food&&S.food[key()])||[];
    const has=function(m){return list.some(function(x){return x.meal===m})};
    if(hour<11&&!has('Завтрак'))return 'Завтрак';
    if(hour<15&&!has('Обед'))return 'Обед';
    if(hour<18&&!has('Перекус'))return 'Перекус';
    return 'Ужин';
  }

  function smartMealOptions(sum,goals){
    const left=Math.max(0,goals.cal-sum.cal),proteinLeft=Math.max(0,goals.p-sum.p),meal=nextMealName();
    let pool=smartMealLibrary().filter(function(x){return x.meal===meal});
    const all=smartMealLibrary();
    if(pool.length<3)pool=pool.concat(all.filter(function(x){return x.meal!==meal}));
    pool=pool.filter(function(x){
      const t=comboTotals(x);
      if(left>0&&left<220)return t.cal<=260;
      if(left>220&&left<450)return t.cal<=470;
      return true;
    });
    pool.sort(function(a,b){
      const ta=comboTotals(a),tb=comboTotals(b);
      const proteinBias=proteinLeft>25;
      const sa=(proteinBias?-ta.p:0)+Math.abs((left||350)-ta.cal)/500;
      const sb=(proteinBias?-tb.p:0)+Math.abs((left||350)-tb.cal)/500;
      if(a.meal===meal&&b.meal!==meal)return -1;
      if(b.meal===meal&&a.meal!==meal)return 1;
      return sa-sb;
    });
    const seen={};
    return pool.filter(function(x){if(seen[x.id])return false;seen[x.id]=true;return true}).slice(0,3);
  }

  function smartMealItemText(combo){
    return combo.items.map(function(it){
      const p=baseProduct(it.id);
      return p?(p.name.replace(', варёная','').replace(' куриное, варёное','')+' '+it.grams+' г'):'';
    }).filter(Boolean).join(' + ');
  }

  function addSmartMeal(id){
    const combo=smartMealLibrary().find(function(x){return x.id===id});if(!combo||!window.S)return;
    const undo=foodUndoSnapshot(key());
    if(!S.food[key()])S.food[key()]=[];
    combo.items.forEach(function(it){
      const p=baseProduct(it.id);if(!p)return;
      const factor=(+it.grams||0)/100;
      S.food[key()].push({
        meal:combo.meal,
        name:p.name+' · '+Math.round(it.grams)+' г',
        baseName:p.name,
        grams:+it.grams||0,
        kcal100:+p.kcal100||0,
        p100:+p.p100||0,
        f100:+p.f100||0,
        c100:+p.c100||0,
        cal:round1((+p.kcal100||0)*factor),
        p:round1((+p.p100||0)*factor),
        f:round1((+p.f100||0)*factor),
        c:round1((+p.c100||0)*factor),
        smartMeal:combo.id
      });
    });
    if(typeof save==='function')save();
    showFoodUndo('Добавлен вариант: '+combo.title,undo);
  }

  window.addSmartMeal=addSmartMeal;


  function updateNutritionDashboard(){
    if(!window.S||typeof key!=='function')return;
    const list=(S.food&&S.food[key()])||[];
    const sum=list.reduce(function(a,x){a.cal+=+x.cal||0;a.p+=+x.p||0;a.f+=+x.f||0;a.c+=+x.c||0;return a},{cal:0,p:0,f:0,c:0});
    const appG=appGoals(),goals={cal:appG.calories,p:appG.protein,f:55,c:155};
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
    const mealName=nextMealName();
    const options=smartMealOptions(sum,goals);
    let title='',copy='';
    if(left<0){
      title='Ориентир уже набран';
      copy='Не нужно компенсировать это голоданием. Ниже — варианты только на случай реального голода.';
    }else if(proteinLeft>30){
      title='Следующий приём пищи — с белком';
      copy='MY 60 подобрал варианты под остаток дня. Порции примерные — их можно менять после добавления.';
    }else if(left<=220){
      title='Осталось немного';
      copy='Если голода нет, можно ничего не добавлять. Если есть — выбери более лёгкий вариант.';
    }else{
      title='Что съесть дальше?';
      copy='Готовые варианты для '+mealName.toLowerCase()+'. Один тап — и весь вариант попадёт в дневник.';
    }
    tip.innerHTML=
      '<div class="smart-meal-head"><div><span>MY 60 · следующий приём пищи</span><b>'+title+'</b><p>'+copy+'</p></div><div class="smart-meal-mark">✦</div></div>'+
      '<div class="smart-meal-options">'+options.map(function(o,idx){
        const t=comboTotals(o);
        return '<button type="button" class="smart-meal-option '+(idx===0?'featured':'alternative')+'" onclick="addSmartMeal(\''+o.id+'\')">'+
          (idx===0?'<div class="smart-meal-best">Лучший вариант сейчас</div>':'')+
          '<div class="smart-meal-option-top"><span>'+o.meal+'</span><b>'+Math.round(t.cal)+' ккал</b></div>'+
          '<div class="smart-meal-main"><div><h4>'+o.title+'</h4><p>'+o.note+'</p></div><div class="smart-meal-protein"><small>Белок</small><b>'+Math.round(t.p)+' г</b></div></div>'+
          '<div class="smart-meal-items"><span>Порция</span><b>'+smartMealItemText(o)+'</b></div>'+
          '<div class="smart-meal-macros"><span>Б '+Math.round(t.p)+' г</span><span>Ж '+Math.round(t.f)+' г</span><span>У '+Math.round(t.c)+' г</span></div>'+
          '<div class="smart-meal-add"><span>Добавить весь вариант</span><i>＋</i></div>'+
        '</button>';
      }).join('')+'</div>'+
      '<div class="smart-meal-foot">Порции — ориентир для удобства, а не обязательное количество.</div>';
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
    const undo=foodUndoSnapshot(key());
    if(!S.food[key()])S.food[key()]=[];
    src.forEach(function(x){S.food[key()].push(Object.assign({},x,{copiedFrom:yesterdayKey()}));if(entryCaffeineMg(x))adjustDayCaffeine(entryCaffeineMg(x),key())});
    if(typeof save==='function')save();
    renderFoodTools();
    showFoodUndo('Повторён '+meal.toLowerCase()+' со вчера',undo);
  }

  function copyYesterdayAll(){
    if(!window.S||typeof key!=='function')return;
    const src=((S.food&&S.food[yesterdayKey()])||[]);
    if(!src.length){
      const card=document.getElementById('foodToolsCard');
      if(card){card.classList.add('nudge');setTimeout(function(){card.classList.remove('nudge')},500)}
      return;
    }
    const undo=foodUndoSnapshot(key());
    if(!S.food[key()])S.food[key()]=[];
    src.forEach(function(x){S.food[key()].push(Object.assign({},x,{copiedFrom:yesterdayKey()}));if(entryCaffeineMg(x))adjustDayCaffeine(entryCaffeineMg(x),key())});
    if(typeof save==='function')save();
    renderFoodTools();
    showFoodUndo('Вчерашний день добавлен',undo);
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

  function mealDiaryMarkup(){
    return '<div class="meal-diary" id="mealDiary">'+
      '<div class="meal-diary-head"><div><div class="label">Сегодня</div><h3>Дневник питания</h3><p>Каждый приём пищи отдельно — сразу видно калории и белок.</p></div><button type="button" onclick="openMealAdd(\'Завтрак\')">+ Добавить</button></div>'+
      '<div class="meal-diary-list" id="mealDiaryList"></div>'+
    '</div>';
  }

  function mealIcon(meal){
    return meal==='Завтрак'?'☼':meal==='Обед'?'◐':meal==='Перекус'?'◇':meal==='Ужин'?'☾':'•';
  }

  function openMealAdd(meal){
    const select=document.getElementById('calcMeal');
    if(select)select.value=meal;
    const calc=document.getElementById('calorieCalculator');
    if(calc)calc.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(function(){
      const input=document.getElementById('calcName');
      if(input){input.focus();if(typeof searchProducts==='function')searchProducts(input.value)}
    },260);
  }

  function deleteMealEntry(index){
    const list=(S.food&&S.food[key()])||[],x=list[index];
    const undo=foodUndoSnapshot(key());
    if(typeof foodDel==='function')foodDel(index);
    if(x)showFoodUndo('Удалено: '+String(x.baseName||x.name||'запись').replace(/\s*·.*$/,''),undo);
  }


  function editableFoodEntry(index){
    const list=(S.food&&S.food[key()])||[],x=list[index];
    if(!x)return null;
    let grams=+x.grams||0;
    if(!grams){
      const m=String(x.name||'').match(/·\s*([\d.,]+)\s*г\s*$/i);
      if(m)grams=parseFloat(m[1].replace(',','.'))||0;
    }
    if(!(grams>0))grams=100;
    const factor=grams/100;
    const baseName=(x.baseName||String(x.name||'Еда').replace(/\s*·\s*[\d.,]+\s*г\s*$/i,'')).trim()||'Еда';
    return {
      index:index,
      item:x,
      meal:x.meal||'Другое',
      baseName:baseName,
      grams:grams,
      kcal100:x.kcal100!=null?+x.kcal100:((+x.cal||0)/(factor||1)),
      p100:x.p100!=null?+x.p100:((+x.p||0)/(factor||1)),
      f100:x.f100!=null?+x.f100:((+x.f||0)/(factor||1)),
      c100:x.c100!=null?+x.c100:((+x.c||0)/(factor||1)),
      caffeine100:x.caffeine100!=null?+x.caffeine100:(entryCaffeineMg(x)/(factor||1)),
      caffeineMg:entryCaffeineMg(x)
    };
  }

  function foodEditorTotals(){
    const gramsEl=document.getElementById('foodEditGrams');
    const grams=gramsEl?(+gramsEl.value||0):0;
    const kcal100=+(gramsEl&&gramsEl.dataset.kcal100||0);
    const p100=+(gramsEl&&gramsEl.dataset.p100||0);
    const f100=+(gramsEl&&gramsEl.dataset.f100||0);
    const c100=+(gramsEl&&gramsEl.dataset.c100||0);
    const caffeine100=+(gramsEl&&gramsEl.dataset.caffeine100||0);
    const k=grams/100;
    return {grams:grams,kcal:round1(kcal100*k),p:round1(p100*k),f:round1(f100*k),c:round1(c100*k),caffeine:round1(caffeine100*k)};
  }

  function updateFoodEditorPreview(){
    const t=foodEditorTotals(),out=document.getElementById('foodEditPreview');
    if(!out)return;
    out.innerHTML='<div><span>Порция</span><b>'+Math.round(t.grams)+' г</b></div><div><span>Калории</span><b>'+Math.round(t.kcal)+' ккал</b></div><div><span>Белок</span><b>'+round1(t.p)+' г</b></div><div><span>Жиры / углеводы</span><b>'+round1(t.f)+' / '+round1(t.c)+' г</b></div>'+(t.caffeine?'<div class="food-edit-caffeine"><span>Кофеин</span><b>'+Math.round(t.caffeine)+' мг</b></div>':'');
  }

  function openFoodEntryEditor(index){
    const e=editableFoodEntry(index);if(!e)return;
    const sheetEl=document.getElementById('sheet'),modalEl=document.getElementById('modal');
    if(!sheetEl||!modalEl)return;
    const meals=['Завтрак','Обед','Перекус','Ужин','Другое','Напиток'];
    sheetEl.innerHTML=
      '<div class="food-edit-sheet">'+
        '<div class="food-edit-head"><div><div class="label">Дневник питания</div><h3>'+escapeHtml(e.baseName)+'</h3><p>Исправь порцию или перенеси запись в другой приём пищи.</p></div><div class="food-edit-mark">✎</div></div>'+
        '<label class="food-edit-field"><span>Приём пищи</span><select id="foodEditMeal">'+meals.map(function(m){return '<option '+(m===e.meal?'selected':'')+'>'+m+'</option>'}).join('')+'</select></label>'+
        '<label class="food-edit-field"><span>Порция</span><div class="food-edit-grams"><input id="foodEditGrams" type="number" inputmode="decimal" min="1" step="1" value="'+round1(e.grams)+'" data-kcal100="'+round1(e.kcal100)+'" data-p100="'+round1(e.p100)+'" data-f100="'+round1(e.f100)+'" data-c100="'+round1(e.c100)+'" data-caffeine100="'+round1(e.caffeine100||0)+'" oninput="updateFoodEditorPreview()"><i>г</i></div></label>'+
        '<div class="food-edit-preview" id="foodEditPreview"></div>'+
        '<div class="food-edit-actions"><button type="button" class="btn" onclick="saveFoodEntryEdit('+index+')">Сохранить</button><button type="button" class="btn soft" onclick="duplicateFoodEntry('+index+')">Добавить ещё такую же</button></div>'+
        '<button type="button" class="food-edit-delete" onclick="deleteFoodEntryFromEditor('+index+')">Удалить запись</button>'+
      '</div>';
    modalEl.classList.add('open');
    updateFoodEditorPreview();
  }

  function saveFoodEntryEdit(index){
    const e=editableFoodEntry(index);if(!e)return;
    const mealEl=document.getElementById('foodEditMeal'),gramsEl=document.getElementById('foodEditGrams');
    const meal=mealEl?mealEl.value:e.meal,grams=gramsEl?(+gramsEl.value||0):0;
    if(!(grams>0))return;
    const t=foodEditorTotals(),x=e.item;
    x.meal=meal;
    x.baseName=e.baseName;
    x.grams=grams;
    const oldCaffeine=entryCaffeineMg(x);
    x.kcal100=e.kcal100;x.p100=e.p100;x.f100=e.f100;x.c100=e.c100;x.caffeine100=e.caffeine100||0;
    x.name=e.baseName+' · '+Math.round(grams)+' г';
    x.cal=t.kcal;x.p=t.p;x.f=t.f;x.c=t.c;
    const newCaffeine=t.caffeine||0;
    x.caffeineMg=newCaffeine;
    if(newCaffeine!==oldCaffeine)adjustDayCaffeine(newCaffeine-oldCaffeine,key());
    if(typeof save==='function')save();
    if(typeof closeM==='function')closeM();
  }

  function duplicateFoodEntry(index){
    const e=editableFoodEntry(index);if(!e)return;
    const undo=foodUndoSnapshot(key());
    const mealEl=document.getElementById('foodEditMeal'),gramsEl=document.getElementById('foodEditGrams');
    const meal=mealEl?mealEl.value:e.meal,grams=gramsEl?(+gramsEl.value||0):e.grams;
    if(!(grams>0))return;
    const t=foodEditorTotals();
    if(!S.food[key()])S.food[key()]=[];
    S.food[key()].push({
      meal:meal,baseName:e.baseName,grams:grams,
      kcal100:e.kcal100,p100:e.p100,f100:e.f100,c100:e.c100,caffeine100:e.caffeine100||0,
      name:e.baseName+' · '+Math.round(grams)+' г',
      cal:t.kcal,p:t.p,f:t.f,c:t.c,caffeineMg:t.caffeine||0,caffeineAt:t.caffeine?Date.now():0,
      copiedEntry:true
    });
    if(t.caffeine)adjustDayCaffeine(t.caffeine,key());
    if(typeof save==='function')save();
    if(typeof closeM==='function')closeM();
    showFoodUndo('Добавлена ещё одна порция',undo);
  }

  function deleteFoodEntryFromEditor(index){
    const list=(S.food&&S.food[key()])||[],x=list[index];
    const undo=foodUndoSnapshot(key());
    if(typeof closeM==='function')closeM();
    if(typeof foodDel==='function')foodDel(index);
    if(x)showFoodUndo('Удалено: '+String(x.baseName||x.name||'запись').replace(/\s*·.*$/,''),undo);
  }

  window.openFoodEntryEditor=openFoodEntryEditor;
  window.updateFoodEditorPreview=updateFoodEditorPreview;
  window.saveFoodEntryEdit=saveFoodEntryEdit;
  window.duplicateFoodEntry=duplicateFoodEntry;
  window.deleteFoodEntryFromEditor=deleteFoodEntryFromEditor;

  function renderMealDiary(){
    const root=document.getElementById('mealDiaryList');if(!root||!window.S)return;
    const entries=((S.food&&S.food[key()])||[]).map(function(x,i){return {item:x,index:i}});
    const meals=['Завтрак','Обед','Перекус','Ужин','Другое','Напиток'];
    const visible=meals.filter(function(meal){
      return ['Завтрак','Обед','Перекус','Ужин'].indexOf(meal)>=0||entries.some(function(e){return e.item.meal===meal});
    });

    root.innerHTML=visible.map(function(meal){
      const items=entries.filter(function(e){return e.item.meal===meal});
      const sum=items.reduce(function(a,e){
        a.cal+=+e.item.cal||0;a.p+=+e.item.p||0;return a;
      },{cal:0,p:0});
      const empty=!items.length;
      return '<div class="meal-diary-card '+(empty?'empty':'')+'">'+
        '<div class="meal-card-head">'+
          '<div class="meal-name"><i>'+mealIcon(meal)+'</i><div><b>'+meal+'</b><small>'+(empty?'Пока ничего не добавлено':items.length+' '+(items.length===1?'позиция':'позиций'))+'</small></div></div>'+
          '<div class="meal-total"><b>'+Math.round(sum.cal)+' ккал</b><small>'+(sum.p?('Б '+Math.round(sum.p)+' г'):'—')+'</small></div>'+
        '</div>'+
        (empty
          ? '<button class="meal-empty-add" type="button" onclick="openMealAdd(\''+meal+'\')"><span>＋</span><div><b>Добавить '+meal.toLowerCase()+'</b><small>Найти продукт или блюдо</small></div></button>'
          : '<div class="meal-items">'+items.map(function(e){
              const x=e.item;
              return '<div class="meal-item"><button type="button" class="meal-item-edit" onclick="openFoodEntryEditor('+e.index+')"><div class="meal-item-main"><b>'+escapeHtml(x.name||'Еда')+'</b><small>'+Math.round(+x.cal||0)+' ккал · Б '+round1(+x.p||0)+' · Ж '+round1(+x.f||0)+' · У '+round1(+x.c||0)+(entryCaffeineMg(x)?' · ⚡ '+Math.round(entryCaffeineMg(x))+' мг кофеина':'')+'</small></div><span>Изм.</span></button><button type="button" class="meal-item-delete" aria-label="Удалить" onclick="deleteMealEntry('+e.index+')">×</button></div>';
            }).join('')+'</div><button class="meal-add-more" type="button" onclick="openMealAdd(\''+meal+'\')">+ Добавить ещё</button>')+
      '</div>';
    }).join('');
  }

  window.openMealAdd=openMealAdd;
  window.deleteMealEntry=deleteMealEntry;

  function caffeineTrackerMarkup(){
    return '<div class="caffeine-tracker" id="caffeineTracker">'+
      '<div class="caffeine-tracker-head"><div><div class="label">Кофеин сегодня</div><h3><span id="caffeineTodayMg">0</span> мг</h3><p id="caffeineTrackerSub">Собираю напитки и ручные записи.</p></div><div class="caffeine-ring" id="caffeineRing"><div><b id="caffeinePct">0%</b><span>лимита</span></div></div></div>'+
      '<div class="caffeine-track"><span id="caffeineTrackBar"></span></div>'+
      '<div class="caffeine-breakdown" id="caffeineBreakdown"></div>'+
      '<div class="caffeine-note" id="caffeineNote"></div>'+
      '<div class="caffeine-actions"><button type="button" onclick="addAdrenalineRush449()">+ Adrenaline · 1 банка</button><button type="button" onclick="openEntryForm(\'caffeine\')">+ Кофеин вручную</button></div>'+
    '</div>';
  }

  function caffeineLinkedEntries(k){
    return ((S.food&&S.food[k])||[]).filter(function(x){return entryCaffeineMg(x)>0});
  }

  function caffeineManualMg(k){
    const total=+(S.caf&&S.caf[k]||0);
    const linked=caffeineLinkedEntries(k).reduce(function(a,x){return a+entryCaffeineMg(x)},0);
    return Math.max(0,total-linked);
  }

  function caffeineEntryTimeLabel(x){
    if(!(x&&+x.caffeineAt))return '';
    const d=new Date(+x.caffeineAt);
    if(isNaN(d.getTime()))return '';
    return d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
  }

  function updateCaffeineTracker(){
    const root=document.getElementById('caffeineTracker');
    if(!root||!window.S)return;
    const g=appGoals(),total=Math.max(0,+(S.caf&&S.caf[key()]||0)),limit=g.caffeine||400;
    const pct=Math.max(0,Math.min(100,total/limit*100));
    const today=document.getElementById('caffeineTodayMg'),ring=document.getElementById('caffeineRing'),pctEl=document.getElementById('caffeinePct'),bar=document.getElementById('caffeineTrackBar');
    if(today)today.textContent=Math.round(total);
    if(ring)ring.style.setProperty('--caf-p',pct+'%');
    if(pctEl)pctEl.textContent=Math.round(pct)+'%';
    if(bar)bar.style.width=pct+'%';

    const linked=caffeineLinkedEntries(key()),manual=caffeineManualMg(key());
    const breakdown=document.getElementById('caffeineBreakdown');
    if(breakdown){
      const rows=linked.map(function(x){
        const tm=caffeineEntryTimeLabel(x);
        return '<div><i>⚡</i><div><b>'+escapeHtml(x.baseName||x.name||'Напиток')+'</b><small>'+Math.round(entryCaffeineMg(x))+' мг'+(tm?' · '+tm:'')+'</small></div></div>';
      });
      if(manual>0)rows.push('<div><i>＋</i><div><b>Добавлено вручную</b><small>'+Math.round(manual)+' мг</small></div></div>');
      breakdown.innerHTML=rows.length?rows.join(''):'<div class="caffeine-empty"><i>○</i><div><b>Пока ничего</b><small>Кофеин появится здесь вместе с напитками из дневника.</small></div></div>';
    }

    const sub=document.getElementById('caffeineTrackerSub');
    if(sub)sub.textContent='Твой ориентир · '+Math.round(limit)+' мг';

    const note=document.getElementById('caffeineNote');
    if(note){
      const late=linked.some(function(x){
        if(!(x&&+x.caffeineAt))return false;
        return new Date(+x.caffeineAt).getHours()>=18;
      });
      if(total>limit){
        note.className='caffeine-note over';
        note.innerHTML='<b>Выше выбранного ориентира</b><span>Не нужно ничего компенсировать. Просто учти суммарный кофеин сегодня.</span>';
      }else if(late){
        note.className='caffeine-note evening';
        note.innerHTML='<b>Кофеин добавлен вечером</b><span>Обрати внимание, влияет ли он у тебя на засыпание и качество сна.</span>';
      }else if(total>0){
        note.className='caffeine-note normal';
        note.innerHTML='<b>Осталось '+Math.max(0,Math.round(limit-total))+' мг до твоего ориентира</b><span>Это информационный счётчик, а не обязательная цель «добрать» кофеин.</span>';
      }else{
        note.className='caffeine-note normal';
        note.innerHTML='<b>Кофеин не нужно «добивать» до лимита</b><span>Здесь просто отображается то, что ты действительно добавила.</span>';
      }
    }
  }

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
      dash=document.getElementById('nutritionDashboard');
    }
    let smartSection=document.getElementById('smartMealSection');
    if(!smartSection){
      if(dash)dash.insertAdjacentHTML('afterend',smartMealSectionMarkup());
      else sec.insertAdjacentHTML('afterbegin',smartMealSectionMarkup());
      smartSection=document.getElementById('smartMealSection');
    }
    const legacyDiary=document.getElementById('foodList');
    const legacyDiaryCard=legacyDiary&&legacyDiary.closest('.card');
    if(legacyDiaryCard)legacyDiaryCard.classList.add('food-diary-legacy-hidden');
    let premiumDiary=document.getElementById('mealDiary');
    if(!premiumDiary){
      if(legacyDiaryCard)legacyDiaryCard.insertAdjacentHTML('beforebegin',mealDiaryMarkup());
      else sec.insertAdjacentHTML('beforeend',mealDiaryMarkup());
      premiumDiary=document.getElementById('mealDiary');
    }
    let caffeineTracker=document.getElementById('caffeineTracker');
    if(!caffeineTracker){
      if(premiumDiary)premiumDiary.insertAdjacentHTML('afterend',caffeineTrackerMarkup());
      else sec.insertAdjacentHTML('beforeend',caffeineTrackerMarkup());
      caffeineTracker=document.getElementById('caffeineTracker');
    }
    let tools=document.getElementById('foodToolsCard');
    if(!tools){
      if(premiumDiary)premiumDiary.insertAdjacentHTML('afterend',foodToolsMarkup());
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
    if(caffeineCard)caffeineCard.classList.add('caffeine-card','caffeine-legacy-hidden');
    renderMealDiary();
    renderFoodTools();
    renderProductLibrary();
    updateCalorieDaily();
    updateNutritionDashboard();
    updateCaffeineTracker();
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
    const undo=foodUndoSnapshot(key());
    rememberCurrentProduct(name);
    const caffeine100=selectedProductCaffeine100();
    const caffeineMg=round1(caffeine100*t.grams/100);
    if(!S.food[key()])S.food[key()]=[];
    S.food[key()].push({
      meal:meal,
      name:name+' · '+Math.round(t.grams)+' г',
      baseName:name,
      grams:t.grams,
      kcal100:num('calcKcal100'),
      p100:num('calcP100'),
      f100:num('calcF100'),
      c100:num('calcC100'),
      caffeine100:caffeine100||0,
      caffeineMg:caffeineMg||0,
      caffeineAt:caffeineMg?Date.now():0,
      cal:t.kcal,
      p:t.p,
      f:t.f,
      c:t.c
    });
    if(caffeineMg)adjustDayCaffeine(caffeineMg,key());
    if(typeof save==='function')save();
    showFoodUndo('Добавлено: '+name,undo);
    ['calcName','calcGrams','calcKcal100','calcP100','calcF100','calcC100'].forEach(function(id){
      const el=document.getElementById(id); if(el)el.value='';
    });
    clearSelectedProductMeta();
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
    if(!S.planStartedAt){
      const candidates=[];
      Object.keys(S.workouts||{}).forEach(function(k){
        const arr=S.workouts[k]||[];
        if(arr.indexOf('A')>=0||arr.indexOf('B')>=0)candidates.push(k);
      });
      Object.keys(S.planChecks||{}).forEach(function(k){
        const bucket=S.planChecks[k]||{};
        const has=['A','B'].some(function(type){
          const work=bucket[type];
          return Array.isArray(work)&&work.some(function(ex){
            return ex===true||(Array.isArray(ex)&&ex.some(Boolean));
          });
        });
        if(has)candidates.push(k);
      });
      S.planStartedAt=candidates.length?candidates.sort()[0]:key();
      if(typeof persist==='function')persist();
    }
  }

  function planStartDate(){
    ensurePlanState();
    const raw=S.planStartedAt||key();
    const d=new Date(raw+'T00:00:00');
    return isNaN(d.getTime())?new Date():d;
  }

  function planDayNumber(){
    const start=planStartDate(),today=new Date();
    start.setHours(0,0,0,0);today.setHours(0,0,0,0);
    return Math.floor((today-start)/86400000)+1;
  }

  function planWeekNumber(){
    const day=planDayNumber();
    if(day<=0)return 1;
    return Math.max(1,Math.min(4,Math.floor((day-1)/7)+1));
  }

  function formatPlanStartDate(){
    return planStartDate().toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
  }

  function planStartMarkup(){
    return '<div class="plan-start-card">'+
      '<div class="plan-start-progress"><div><span>Программа 28 дней</span><b id="planDayNumber">День 1 из 28</b><small id="planStartDateLabel">Старт — сегодня</small></div><div class="plan-day-bar"><span id="planDayBar"></span></div></div>'+
      '<button type="button" onclick="openPlanStartSettings()">Изменить старт</button>'+
    '</div>';
  }

  function openPlanStartSettings(){
    ensurePlanState();
    const sheetEl=document.getElementById('sheet'),modalEl=document.getElementById('modal');
    if(!sheetEl||!modalEl)return;
    sheetEl.innerHTML=
      '<div class="plan-start-sheet">'+
        '<div class="plan-start-sheet-head"><div><div class="label">Мой план</div><h3>Дата старта программы</h3><p>От неё считаются неделя программы и день из 28. Старые записи веса не влияют на старт.</p></div><div class="plan-start-mark">28</div></div>'+
        '<label class="plan-start-field"><span>Начало программы</span><input id="planStartInput" type="date" value="'+escapeHtml(S.planStartedAt||key())+'"></label>'+
        '<div class="plan-start-note">Изменение даты не удаляет вес, питание, тренировки или другие записи. Меняется только отсчёт программы.</div>'+
        '<button class="btn plan-start-save" type="button" onclick="savePlanStartDate()">Сохранить дату старта</button>'+
      '</div>';
    modalEl.classList.add('open');
  }

  function savePlanStartDate(){
    const el=document.getElementById('planStartInput');
    if(!el||!/^\d{4}-\d{2}-\d{2}$/.test(el.value))return;
    S.planStartedAt=el.value;
    if(typeof save==='function')save();
    if(typeof closeM==='function')closeM();
  }

  function updatePlanStart(){
    const day=planDayNumber(),displayDay=Math.max(0,Math.min(28,day)),pct=day<=0?0:Math.min(100,displayDay/28*100);
    const dayEl=document.getElementById('planDayNumber');
    const dateEl=document.getElementById('planStartDateLabel');
    const bar=document.getElementById('planDayBar');
    if(dayEl){
      if(day<=0){
        const daysLeft=Math.abs(day)+1;
        dayEl.textContent=daysLeft===1?'Старт завтра':'До старта '+daysLeft+' дн.';
      }else{
        dayEl.textContent=day>28?'Первые 28 дней завершены':'День '+displayDay+' из 28';
      }
    }
    if(dateEl)dateEl.textContent='Старт — '+formatPlanStartDate();
    if(bar)bar.style.width=pct+'%';
  }

  window.openPlanStartSettings=openPlanStartSettings;
  window.savePlanStartDate=savePlanStartDate;

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
        '<div><span>Белок</span><b id="planProteinTarget">105</b><small>г / день</small></div>'+
      '</div>'+
      planStartMarkup()+
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
    const planDay=planDayNumber();
    if(planDay<=0){
      const start=planStartDate(),label=start.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'});
      card.innerHTML='<div class="today-plan-top"><div><span>До старта программы</span><h3>Начинаем '+label+'</h3><p>Сегодня ничего догонять не нужно. Программа начнётся с выбранной даты.</p></div><div class="plan-duration"><b>28 дней</b><small>программа</small></div></div><div class="today-plan-note">Можно просто подготовиться: выбрать удобное время для первой тренировки и оставить обычный режим питания и активности.</div>';
      return;
    }
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
    const proteinTarget=document.getElementById('planProteinTarget');if(proteinTarget)proteinTarget.textContent=Math.round(appGoals().protein);
    const sub=document.getElementById('planHeroSub');if(sub)sub.textContent=settings.note+' · ориентир '+settings.steps.toLocaleString('ru-RU')+' шагов в день';
    updatePlanStart();
    const dates=weekDates();
    const workoutsDone=dates.reduce(function(n,d){return n+(S.workouts[key(d)]||[]).filter(function(x){return x==='A'||x==='B'}).length},0);
    const stepDays=dates.filter(function(d){return +(S.steps[key(d)]||0)>=settings.steps}).length;
    const score=planDayNumber()<=0?0:Math.min(100,Math.round((Math.min(workoutsDone/settings.strength,1)*55)+(stepDays/7*45)));
    const ring=document.getElementById('planRing'),pct=document.getElementById('planRingPct');
    if(ring)ring.style.setProperty('--plan-p',score+'%');
    if(pct)pct.textContent=score+'%';
    updateWeekRoute();renderTodayPlan();renderWorkoutPicker();renderInteractiveWorkout();updatePlanInsight();
  }


  let progressPeriod=30;

  function achievementStats(){
    const foodDays=Object.keys(S.food||{}).filter(function(k){return (S.food[k]||[]).length>0}).length;
    const wellDays=Object.keys(S.well||{}).filter(function(k){return !!S.well[k]}).length;
    const weightEntries=Object.entries(S.weights||{}).sort();
    const weights=weightEntries.map(function(x){return +x[1]}).filter(Boolean);
    const lowest=weights.length?Math.min.apply(null,weights):(+START||0);

    const measures=Object.entries(S.measures||{}).filter(function(x){return x[1]&&+x[1].waist}).sort();
    const firstWaist=measures.length?+measures[0][1].waist:0;
    const minWaist=measures.length?Math.min.apply(null,measures.map(function(x){return +x[1].waist})):0;
    const waistLost=firstWaist&&minWaist?Math.max(0,firstWaist-minWaist):0;

    const workoutDays=Object.keys(S.workouts||{}).filter(function(k){
      return (S.workouts[k]||[]).some(function(x){return x==='A'||x==='B'});
    });
    const totalStrength=workoutDays.reduce(function(n,k){
      return n+(S.workouts[k]||[]).filter(function(x){return x==='A'||x==='B'}).length;
    },0);

    const weekBuckets={};
    workoutDays.forEach(function(k){
      const d=new Date(k+'T00:00:00'),day=(d.getDay()+6)%7,monday=new Date(d);
      monday.setDate(d.getDate()-day);
      const wk=key(monday);
      weekBuckets[wk]=(weekBuckets[wk]||0)+(S.workouts[k]||[]).filter(function(x){return x==='A'||x==='B'}).length;
    });
    const bestStrengthWeek=Object.keys(weekBuckets).length?Math.max.apply(null,Object.values(weekBuckets)):0;

    const bestSteps=Object.keys(S.steps||{}).reduce(function(m,k){return Math.max(m,+S.steps[k]||0)},0);
    const planDay=typeof planDayNumber==='function'?planDayNumber():0;
    const pair=progressPhotoPair();

    return {
      foodDays:foodDays,wellDays:wellDays,lowest:lowest,
      weightLost:(+START||0)&&lowest?Math.max(0,(+START)-lowest):0,
      waistLost:waistLost,totalStrength:totalStrength,bestStrengthWeek:bestStrengthWeek,
      bestSteps:bestSteps,planDay:planDay,photoPair:!!pair
    };
  }

  function achievementDefinitions(){
    const s=achievementStats();
    const defs=[
      {id:'first-workout',icon:'A',title:'Первая силовая',sub:'Начать тренировочный путь',done:s.totalStrength>=1,progress:Math.min(1,s.totalStrength/1),value:s.totalStrength+' / 1'},
      {id:'two-strength',icon:'2',title:'Две силовые за неделю',sub:'Рабочий ритм без перегруза',done:s.bestStrengthWeek>=2,progress:Math.min(1,s.bestStrengthWeek/2),value:Math.min(s.bestStrengthWeek,2)+' / 2'},
      {id:'food-seven',icon:'○',title:'7 дней с питанием',sub:'Собрать данные без обязательной серии подряд',done:s.foodDays>=7,progress:Math.min(1,s.foodDays/7),value:Math.min(s.foodDays,7)+' / 7'},
      {id:'well-seven',icon:'♡',title:'7 чек-инов',sub:'Замечать сон, энергию и голод',done:s.wellDays>=7,progress:Math.min(1,s.wellDays/7),value:Math.min(s.wellDays,7)+' / 7'},
      {id:'minus-one',icon:'−1',title:'Минус 1 кг',sub:'Первая заметная отметка пути',done:s.weightLost>=1,progress:Math.min(1,s.weightLost/1),value:round1(Math.min(s.weightLost,1))+' кг'},
      {id:'waist-two',icon:'↔',title:'Талия −2 см',sub:'Изменение тела, не только весов',done:s.waistLost>=2,progress:Math.min(1,s.waistLost/2),value:round1(Math.min(s.waistLost,2))+' см'},
      {id:'steps-ten',icon:'↗',title:'10 000 шагов',sub:'Один активный день',done:s.bestSteps>=10000,progress:Math.min(1,s.bestSteps/10000),value:Math.round(Math.min(s.bestSteps,10000)).toLocaleString('ru-RU')},
      {id:'photo-pair',icon:'▣',title:'Фото-сравнение',sub:'Два фото одного ракурса',done:s.photoPair,progress:s.photoPair?1:0,value:s.photoPair?'Готово':'0 / 1'},
      {id:'day-fourteen',icon:'14',title:'14 дней программы',sub:'Половина первого цикла',done:s.planDay>=14,progress:Math.max(0,Math.min(1,s.planDay/14)),value:Math.max(0,Math.min(s.planDay,14))+' / 14'},
      {id:'day-twenty-eight',icon:'28',title:'28 дней программы',sub:'Первый цикл MY 60 завершён',done:s.planDay>=28,progress:Math.max(0,Math.min(1,s.planDay/28)),value:Math.max(0,Math.min(s.planDay,28))+' / 28'}
    ];
    return defs;
  }

  function achievementsMarkup(){
    return '<div class="achievements-card" id="achievementsCard">'+
      '<div class="achievements-head"><div><div class="label">Мои победы</div><h3>Прогресс, который уже есть</h3><p>Без стриков и обнулений. Открытое достижение остаётся твоим.</p></div><div class="achievement-count" id="achievementCount">0 / 10</div></div>'+
      '<div class="achievement-next" id="achievementNext"></div>'+
      '<div class="achievement-grid" id="achievementGrid"></div>'+
    '</div>';
  }

  function updateAchievements(){
    const grid=document.getElementById('achievementGrid');
    if(!grid||!window.S)return;
    const defs=achievementDefinitions(),done=defs.filter(function(x){return x.done});
    const count=document.getElementById('achievementCount');
    if(count)count.textContent=done.length+' / '+defs.length;

    grid.innerHTML=defs.map(function(a){
      const pct=Math.round(a.progress*100);
      return '<div class="achievement-item '+(a.done?'done':'locked')+'">'+
        '<div class="achievement-icon">'+(a.done?'✓':a.icon)+'</div>'+
        '<div class="achievement-copy"><b>'+a.title+'</b><small>'+a.sub+'</small><div class="achievement-mini"><span style="width:'+pct+'%"></span></div><i>'+a.value+'</i></div>'+
      '</div>';
    }).join('');

    const next=document.getElementById('achievementNext');
    if(next){
      const locked=defs.filter(function(x){return !x.done}).sort(function(a,b){return b.progress-a.progress});
      if(!locked.length){
        next.innerHTML='<div class="achievement-next-mark">✓</div><div><span>Первый набор собран</span><b>Все базовые победы открыты</b><p>Дальше важнее удерживать удобный ритм, а не собирать значки любой ценой.</p></div>';
      }else{
        const a=locked[0],pct=Math.round(a.progress*100);
        next.innerHTML='<div class="achievement-next-mark">'+a.icon+'</div><div><span>Ближе всего</span><b>'+a.title+'</b><p>'+a.sub+' · '+a.value+'</p><div class="achievement-next-bar"><i style="width:'+pct+'%"></i></div></div>';
      }
    }
  }

  let bodyMetric='waist';

  function bodyMetricDefinitions(){
    return {
      waist:{label:'Талия',unit:'см'},
      belly:{label:'Живот',unit:'см'},
      hips:{label:'Бёдра',unit:'см'},
      chest:{label:'Грудь',unit:'см'},
      thigh:{label:'Бедро',unit:'см'}
    };
  }

  function bodyMeasurementEntries(metric){
    return Object.entries(S.measures||{})
      .filter(function(x){return x[1]&&(+x[1][metric]>0)})
      .map(function(x){return [x[0],+x[1][metric]]})
      .sort();
  }

  function bodyProgressMarkup(){
    return '<div class="body-progress-card" id="bodyProgressCard">'+
      '<div class="body-progress-head"><div><div class="label">Объёмы тела</div><h3>Изменения в сантиметрах</h3><p>Смотри не только на вес. Выбери параметр — MY 60 покажет динамику.</p></div><button type="button" onclick="openEntryForm(\'measure\')">+ Замеры</button></div>'+
      '<div class="body-metric-tabs" id="bodyMetricTabs"></div>'+
      '<div class="body-change-hero" id="bodyChangeHero"></div>'+
      '<canvas id="bodyProgressChart"></canvas>'+
      '<div class="body-measure-grid" id="bodyMeasureGrid"></div>'+
    '</div>';
  }

  function setBodyMetric(metric){
    const defs=bodyMetricDefinitions();
    if(!defs[metric])metric='waist';
    bodyMetric=metric;
    updateBodyProgress();
    setTimeout(drawBodyProgressChart,20);
  }

  function bodyMetricSummary(metric){
    const data=bodyMeasurementEntries(metric);
    if(!data.length)return {count:0,first:null,last:null,delta:null};
    const first=data[0],last=data[data.length-1];
    return {count:data.length,first:first,last:last,delta:last[1]-first[1]};
  }

  function updateBodyProgress(){
    const root=document.getElementById('bodyProgressCard');
    if(!root||!window.S)return;
    const defs=bodyMetricDefinitions();

    const tabs=document.getElementById('bodyMetricTabs');
    if(tabs)tabs.innerHTML=Object.keys(defs).map(function(k){
      return '<button type="button" class="'+(k===bodyMetric?'active':'')+'" onclick="setBodyMetric(\''+k+'\')">'+defs[k].label+'</button>';
    }).join('');

    const summary=bodyMetricSummary(bodyMetric),hero=document.getElementById('bodyChangeHero');
    if(hero){
      if(summary.count){
        const d=summary.delta||0;
        const sign=d<0?'−':d>0?'+':'';
        hero.innerHTML='<div><span>'+defs[bodyMetric].label+'</span><b>'+round1(summary.last[1])+' '+defs[bodyMetric].unit+'</b><small>сейчас</small></div>'+
          '<div><span>Первый замер</span><b>'+round1(summary.first[1])+' '+defs[bodyMetric].unit+'</b><small>'+new Date(summary.first[0]+'T00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'})+'</small></div>'+
          '<div class="'+(d<0?'down':d>0?'up':'flat')+'"><span>Изменение</span><b>'+sign+round1(Math.abs(d))+' '+defs[bodyMetric].unit+'</b><small>'+summary.count+' замер'+(summary.count===1?'':'а')+'</small></div>';
      }else{
        hero.innerHTML='<div class="body-empty"><span>'+defs[bodyMetric].label+'</span><b>Пока нет данных</b><small>Добавь первый замер — дальше динамика появится автоматически.</small></div>';
      }
    }

    const grid=document.getElementById('bodyMeasureGrid');
    if(grid){
      grid.innerHTML=Object.keys(defs).map(function(k){
        const s=bodyMetricSummary(k),d=s.delta||0;
        return '<button type="button" class="'+(k===bodyMetric?'active ':'')+(s.count?'has-data':'empty')+'" onclick="setBodyMetric(\''+k+'\')">'+
          '<span>'+defs[k].label+'</span><b>'+(s.count?round1(s.last[1])+' см':'—')+'</b>'+
          '<small>'+(s.count>1?((d<0?'−':d>0?'+':'')+round1(Math.abs(d))+' см от первого'):(s.count===1?'нужен ещё замер':'нет данных'))+'</small>'+
        '</button>';
      }).join('');
    }
  }

  function drawBodyProgressChart(){
    const cv=document.getElementById('bodyProgressChart');
    if(!cv||!window.S)return;
    const data=bodyMeasurementEntries(bodyMetric);
    const rect=cv.getBoundingClientRect(),W=Math.max(280,Math.floor(rect.width||280)),H=170,dpr=Math.min(window.devicePixelRatio||1,2);
    cv.width=W*dpr;cv.height=H*dpr;
    const ctx=cv.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    if(data.length<2){
      ctx.fillStyle='#929894';ctx.font='600 11px -apple-system,BlinkMacSystemFont,sans-serif';
      ctx.fillText(data.length?'Добавь ещё один замер для графика':'Добавь первый замер',15,32);
      return;
    }
    const vals=data.map(function(x){return x[1]}),mn=Math.min.apply(null,vals)-1,mx=Math.max.apply(null,vals)+1;
    const px=15,py=16,usableW=W-px*2,usableH=H-py*2;
    ctx.strokeStyle='#e7e9e5';ctx.lineWidth=1;
    for(let i=0;i<4;i++){const y=py+usableH*i/3;ctx.beginPath();ctx.moveTo(px,y);ctx.lineTo(W-px,y);ctx.stroke()}
    const pts=data.map(function(x,i){
      return {x:px+usableW*i/(data.length-1),y:py+usableH*(mx-x[1])/(mx-mn)};
    });
    const fill=ctx.createLinearGradient(0,py,0,H-py);
    fill.addColorStop(0,'rgba(189,110,120,.18)');fill.addColorStop(1,'rgba(189,110,120,0)');
    ctx.beginPath();ctx.moveTo(pts[0].x,H-py);pts.forEach(function(p){ctx.lineTo(p.x,p.y)});ctx.lineTo(pts[pts.length-1].x,H-py);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
    ctx.beginPath();pts.forEach(function(p,i){i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});ctx.strokeStyle='#bd6e78';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
    pts.forEach(function(p,i){if(i===0||i===pts.length-1){ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle=i===pts.length-1?'#78927e':'#bd6e78';ctx.fill()}});
  }

  window.setBodyMetric=setBodyMetric;

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
      bodyProgressMarkup()+
      achievementsMarkup()+
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

    updateBodyProgress();
    updateAchievements();
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
    if(measure)measure.classList.add('progress-detail-card','progress-measure-legacy');
    if(gallery)gallery.classList.add('progress-detail-card','progress-gallery-legacy');
    if(milestones)milestones.classList.add('progress-detail-card');
    updateProgressExperience();
    if(sec.classList.contains('active'))setTimeout(function(){drawProgressChart();drawBodyProgressChart()},30);
  }

  window.setProgressPeriod=setProgressPeriod;


  function weekKeysEndingToday(offset){
    const out=[];
    for(let i=6+offset;i>=offset;i--)out.push(dateKeyOffset(i));
    return out;
  }

  function weeklyMetrics(keys){
    const weightEntries=Object.entries(S.weights||{}).filter(function(x){return keys.indexOf(x[0])>=0}).sort();
    const foodDays=keys.map(function(k){
      const list=(S.food&&S.food[k])||[];
      return list.reduce(function(a,x){a.cal+=+x.cal||0;a.p+=+x.p||0;return a},{cal:0,p:0});
    });
    const loggedFood=foodDays.filter(function(x){return x.cal>0});
    const stepVals=keys.map(function(k){return +(S.steps[k]||0)}).filter(function(v){return v>0});
    const sleepVals=keys.map(function(k){return +(S.well[k]&&S.well[k].sleep||0)}).filter(function(v){return v>0});
    const workouts=keys.reduce(function(n,k){
      return n+((S.workouts[k]||[]).filter(function(x){return x==='A'||x==='B'}).length);
    },0);
    const checkins=keys.filter(function(k){return !!(S.well&&S.well[k])}).length;
    const lastWeight=weightEntries.length?+weightEntries[weightEntries.length-1][1]:null;
    const firstWeight=weightEntries.length?+weightEntries[0][1]:null;
    return {
      weights:weightEntries,
      firstWeight:firstWeight,
      lastWeight:lastWeight,
      weightDelta:(firstWeight!=null&&lastWeight!=null)?lastWeight-firstWeight:null,
      avgCalories:loggedFood.length?averageNumber(loggedFood.map(function(x){return x.cal})):0,
      avgProtein:loggedFood.length?averageNumber(loggedFood.map(function(x){return x.p})):0,
      foodLogged:loggedFood.length,
      avgSteps:stepVals.length?averageNumber(stepVals):0,
      stepLogged:stepVals.length,
      avgSleep:sleepVals.length?averageNumber(sleepVals):0,
      sleepLogged:sleepVals.length,
      workouts:workouts,
      checkins:checkins
    };
  }

  function weeklyDashboardMarkup(){
    return '<div class="weekly-experience" id="weeklyExperience">'+
      '<div class="weekly-hero">'+
        '<div class="weekly-copy"><div class="label">MY 60 · 7 дней</div><h3>Итог недели</h3><p id="weeklyHeroText">Собираю твои данные за последние 7 дней.</p><div class="weekly-dates" id="weeklyDates">—</div></div>'+
        '<div class="weekly-ring" id="weeklyRing"><div><b id="weeklyRhythm">0%</b><span>ритм</span></div></div>'+
      '</div>'+
      '<div class="weekly-kpis">'+
        '<div><span>Вес</span><b id="weeklyWeight">—</b><small id="weeklyWeightDelta">нет данных</small></div>'+
        '<div><span>Питание</span><b id="weeklyCalories">—</b><small>ср. ккал</small></div>'+
        '<div><span>Белок</span><b id="weeklyProtein">—</b><small>ср. г / день</small></div>'+
        '<div><span>Шаги</span><b id="weeklySteps">—</b><small>среднее</small></div>'+
        '<div><span>Сон</span><b id="weeklySleep">—</b><small>среднее</small></div>'+
        '<div><span>Силовые</span><b id="weeklyWorkouts">0</b><small>за неделю</small></div>'+
      '</div>'+
      '<div class="weekly-analysis" id="weeklyAnalysis"></div>'+
      '<div class="next-week-card" id="nextWeekCard"></div>'+
    '</div>';
  }

  function weeklyRhythmScore(m){
    const calGoal=(S.profile&&+S.profile.calories)||1500;
    const stepGoal=typeof target==='function'?target():((S.profile&&+S.profile.steps)||7000);
    const proteinGoal=appGoals().protein;
    let score=0,parts=0;
    if(m.foodLogged){score+=Math.min(1,m.foodLogged/5)*20;parts+=20}
    if(m.avgCalories){const diff=Math.abs(m.avgCalories-calGoal)/calGoal;score+=(diff<=.12?20:diff<=.22?12:6);parts+=20}
    if(m.avgProtein){score+=Math.min(1,m.avgProtein/proteinGoal)*20;parts+=20}
    if(m.avgSteps){score+=Math.min(1,m.avgSteps/stepGoal)*20;parts+=20}
    if(m.avgSleep){score+=Math.min(1,m.avgSleep/7)*10;parts+=10}
    score+=Math.min(1,m.workouts/2)*10;parts+=10;
    return parts?Math.max(0,Math.min(100,Math.round(score))):0;
  }

  function weeklyAnalysisItems(m){
    const items=[];
    const calGoal=(S.profile&&+S.profile.calories)||1500;
    const stepGoal=typeof target==='function'?target():((S.profile&&+S.profile.steps)||7000);

    if(m.weightDelta!=null&&m.weights.length>=2){
      if(m.weightDelta<-0.15)items.push({state:'good',icon:'↘',title:'Вес движется вниз',text:'За неделю изменение '+round1(Math.abs(m.weightDelta))+' кг. Сохраняем текущий курс и не ужесточаем план.'});
      else if(m.weightDelta>0.15)items.push({state:'neutral',icon:'≈',title:'Вес выше начала недели',text:'Одна неделя ещё не повод менять питание. Смотрим ещё на средний вес, талию и следующие измерения.'});
      else items.push({state:'neutral',icon:'→',title:'Вес почти стабилен',text:'Для выводов о плато лучше смотреть 2–3 недели подряд, а не несколько дней.'});
    }else{
      items.push({state:'neutral',icon:'○',title:'Не хватает измерений веса',text:'Два–три утренних измерения в неделю уже дадут более понятную тенденцию.'});
    }

    if(m.avgProtein&&m.avgProtein<85)items.push({state:'focus',icon:'P',title:'Белок — главный фокус',text:'Среднее около '+Math.round(m.avgProtein)+' г. На следующей неделе проще всего добавить белок к 2–3 основным приёмам пищи.'});
    else if(m.avgProtein>=95)items.push({state:'good',icon:'✓',title:'Белок держится хорошо',text:'Среднее около '+Math.round(m.avgProtein)+' г в дни с записями. Это можно оставить без изменений.'});

    if(m.avgSteps&&m.avgSteps<stepGoal*.75)items.push({state:'focus',icon:'↗',title:'Движения можно немного добавить',text:'Среднее '+Math.round(m.avgSteps).toLocaleString('ru-RU')+' шагов. Лучше добавить короткие прогулки, а не резко поднимать цель.'});
    else if(m.avgSteps>=stepGoal*.9)items.push({state:'good',icon:'✓',title:'Шаги близко к цели',text:'Среднее '+Math.round(m.avgSteps).toLocaleString('ru-RU')+' — хороший рабочий ритм.'});

    if(m.avgSleep&&m.avgSleep<6.5)items.push({state:'focus',icon:'☾',title:'Восстановление просит внимания',text:'Средний сон '+round1(m.avgSleep)+' ч. На следующей неделе лучше не добавлять нагрузку раньше, чем улучшится сон.'});

    if(m.workouts>=2)items.push({state:'good',icon:'A',title:'Силовые закрыты',text:m.workouts+' тренировки за 7 дней — достаточно. Дополнительные нужны только по желанию и при хорошем восстановлении.'});
    else items.push({state:'focus',icon:'A',title:'Силовые: '+m.workouts+' из 2',text:'На следующей неделе оставляем две короткие тренировки A/B с паузой между ними.'});

    return items.slice(0,4);
  }

  function nextWeekPlan(m){
    const calGoal=(S.profile&&+S.profile.calories)||1500;
    const steps=typeof target==='function'?target():((S.profile&&+S.profile.steps)||7000);
    const focuses=[];
    if(!m.foodLogged||m.foodLogged<4)focuses.push('Записывать питание хотя бы 4–5 дней');
    if(m.avgProtein<appGoals().protein*.86)focuses.push('Белок '+Math.round(appGoals().protein)+' г в день');
    if(m.avgSteps<steps*.85)focuses.push('Добавить 1–2 короткие прогулки');
    if(m.avgSleep&&m.avgSleep<6.5)focuses.push('Сон и восстановление важнее лишней нагрузки');
    if(m.workouts<2)focuses.push('Силовые A + B');
    if(!focuses.length)focuses.push('Повторить текущий ритм без усложнения');

    let headline='Сохраняем курс';
    if(m.avgSleep&&m.avgSleep<6.5)headline='Неделя восстановления';
    else if(m.avgProtein<90)headline='Неделя белка';
    else if(m.avgSteps<steps*.8)headline='Неделя движения';
    else if(m.workouts<2)headline='Неделя двух силовых';

    return {headline:headline,calories:calGoal,steps:steps,protein:Math.round(appGoals().protein)+' г',strength:'2',focuses:focuses.slice(0,3)};
  }

  function updateWeeklyExperience(){
    if(!window.S)return;
    const keys=weekKeysEndingToday(0),m=weeklyMetrics(keys),score=weeklyRhythmScore(m);
    const ring=document.getElementById('weeklyRing'),rh=document.getElementById('weeklyRhythm');
    if(ring)ring.style.setProperty('--week-p',score+'%');
    if(rh)rh.textContent=score+'%';

    const dates=document.getElementById('weeklyDates');
    if(dates)dates.textContent=new Date(keys[0]+'T00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'})+' — '+new Date(keys[6]+'T00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'});
    const hero=document.getElementById('weeklyHeroText');
    if(hero)hero.textContent=score>=80?'Неделя выглядит устойчиво. Не нужно усложнять то, что уже работает.':score>=55?'Есть рабочая база. Ниже — один-два фокуса, которые дадут больше всего пользы.':'Данных или стабильности пока мало. Следующая неделя будет про простые базовые действия.';

    const weight=document.getElementById('weeklyWeight'),wd=document.getElementById('weeklyWeightDelta');
    if(weight)weight.textContent=m.lastWeight!=null?round1(m.lastWeight)+' кг':'—';
    if(wd)wd.textContent=m.weightDelta!=null?((m.weightDelta<0?'−':m.weightDelta>0?'+':'')+round1(Math.abs(m.weightDelta))+' кг за неделю'):'нужно ≥2 измерений';

    const cal=document.getElementById('weeklyCalories'),pr=document.getElementById('weeklyProtein'),st=document.getElementById('weeklySteps'),sl=document.getElementById('weeklySleep'),wo=document.getElementById('weeklyWorkouts');
    if(cal)cal.textContent=m.avgCalories?Math.round(m.avgCalories):'—';
    if(pr)pr.textContent=m.avgProtein?Math.round(m.avgProtein):'—';
    if(st)st.textContent=m.avgSteps?Math.round(m.avgSteps).toLocaleString('ru-RU'):'—';
    if(sl)sl.textContent=m.avgSleep?round1(m.avgSleep)+' ч':'—';
    if(wo)wo.textContent=m.workouts;

    const analysis=document.getElementById('weeklyAnalysis'),items=weeklyAnalysisItems(m);
    if(analysis)analysis.innerHTML='<div class="weekly-section-title"><span>Что видно по неделе</span><b>Без догадок — только по твоим записям</b></div><div class="weekly-analysis-list">'+items.map(function(x){return '<div class="weekly-analysis-item" data-state="'+x.state+'"><i>'+x.icon+'</i><div><b>'+x.title+'</b><p>'+x.text+'</p></div></div>'}).join('')+'</div>';

    const plan=nextWeekPlan(m),card=document.getElementById('nextWeekCard');
    if(card)card.innerHTML=
      '<div class="next-week-head"><div><span>Следующие 7 дней</span><h3>'+plan.headline+'</h3><p>Цели не ужесточаем автоматически. Меняем только главный фокус.</p></div><div class="next-week-mark">→</div></div>'+
      '<div class="next-week-targets"><div><span>Ккал</span><b>'+plan.calories+'</b></div><div><span>Белок</span><b>'+plan.protein+'</b></div><div><span>Шаги</span><b>'+Math.round(plan.steps).toLocaleString('ru-RU')+'</b></div><div><span>Силовые</span><b>'+plan.strength+'</b></div></div>'+
      '<div class="next-week-focus">'+plan.focuses.map(function(x,i){return '<div><span>0'+(i+1)+'</span><b>'+x+'</b></div>'}).join('')+'</div>';
  }

  let historyMonthOffset=0;

  function historyCardMarkup(){
    return '<div class="history-card" id="historyCard">'+
      '<div class="history-head"><div><div class="label">История</div><h3>Календарь дней</h3><p>Нажми на дату, чтобы увидеть всё, что было записано.</p></div><div class="history-nav"><button type="button" onclick="changeHistoryMonth(-1)">‹</button><b id="historyMonthLabel">—</b><button type="button" id="historyNextBtn" onclick="changeHistoryMonth(1)">›</button></div></div>'+
      '<div class="history-weekdays"><span>ПН</span><span>ВТ</span><span>СР</span><span>ЧТ</span><span>ПТ</span><span>СБ</span><span>ВС</span></div>'+
      '<div class="history-grid" id="historyGrid"></div>'+
      '<div class="history-legend"><span><i class="dot weight"></i>вес</span><span><i class="dot food"></i>еда</span><span><i class="dot workout"></i>тренировка</span><span><i class="dot well"></i>чек-ин</span></div>'+
    '</div>';
  }

  function historyMonthDate(){
    const d=new Date();
    d.setDate(1);
    d.setMonth(d.getMonth()+historyMonthOffset);
    d.setHours(0,0,0,0);
    return d;
  }

  function dayHasAnyData(k){
    return Boolean(
      (S.weights&&S.weights[k])||
      (S.food&&S.food[k]&&S.food[k].length)||
      (S.steps&&S.steps[k])||
      (S.water&&S.water[k])||
      (S.well&&S.well[k])||
      (S.workouts&&S.workouts[k]&&S.workouts[k].length)||
      (S.measures&&S.measures[k])||
      (S.caf&&S.caf[k])||
      (S.notes&&S.notes.some(function(n){return n.date===k}))
    );
  }

  function changeHistoryMonth(delta){
    const next=historyMonthOffset+delta;
    if(next>0)return;
    historyMonthOffset=Math.max(-24,next);
    renderHistoryCalendar();
  }

  function renderHistoryCalendar(){
    const grid=document.getElementById('historyGrid');
    if(!grid||!window.S)return;
    const month=historyMonthDate(),year=month.getFullYear(),m=month.getMonth();
    const label=document.getElementById('historyMonthLabel');
    if(label)label.textContent=month.toLocaleDateString('ru-RU',{month:'long',year:'numeric'});
    const next=document.getElementById('historyNextBtn');
    if(next)next.disabled=historyMonthOffset>=0;
    const firstWeekday=(month.getDay()+6)%7;
    const daysInMonth=new Date(year,m+1,0).getDate();
    const todayKey=key();
    let html='';
    for(let i=0;i<firstWeekday;i++)html+='<div class="history-day empty"></div>';
    for(let d=1;d<=daysInMonth;d++){
      const dt=new Date(year,m,d),k=key(dt),future=k>todayKey,has=dayHasAnyData(k);
      const marks=[];
      if(S.weights&&S.weights[k])marks.push('<i class="weight"></i>');
      if(S.food&&S.food[k]&&S.food[k].length)marks.push('<i class="food"></i>');
      if(S.workouts&&S.workouts[k]&&S.workouts[k].length)marks.push('<i class="workout"></i>');
      if(S.well&&S.well[k])marks.push('<i class="well"></i>');
      html+='<button type="button" class="history-day '+(k===todayKey?'today ':'')+(has?'has-data ':'')+(future?'future':'')+'" data-date="'+k+'" '+(future?'disabled':'onclick="openHistoryDay(this.dataset.date)"')+'>'+
        '<b>'+d+'</b><div class="history-day-marks">'+marks.join('')+'</div>'+
      '</button>';
    }
    grid.innerHTML=html;
  }

  function dayFoodTotals(k){
    const list=(S.food&&S.food[k])||[];
    return list.reduce(function(a,x){
      a.cal+=+x.cal||0;a.p+=+x.p||0;a.f+=+x.f||0;a.c+=+x.c||0;return a;
    },{cal:0,p:0,f:0,c:0});
  }

  function historyDayTitle(k){
    return new Date(k+'T00:00').toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'});
  }

  function openHistoryDay(k){
    if(typeof sheet==='undefined'||typeof modal==='undefined')return;
    const food=(S.food&&S.food[k])||[],tot=dayFoodTotals(k),well=S.well&&S.well[k],work=(S.workouts&&S.workouts[k])||[];
    const meals=['Завтрак','Обед','Перекус','Ужин','Другое','Напиток'];
    const foodHtml=food.length?meals.map(function(m){
      const items=food.filter(function(x){return x.meal===m});
      if(!items.length)return '';
      const kc=Math.round(items.reduce(function(a,x){return a+(+x.cal||0)},0));
      return '<div class="history-meal"><div class="history-meal-head"><b>'+m+'</b><span>'+kc+' ккал</span></div>'+
        items.map(function(x){return '<div><span>'+escapeHtml(x.name||'Еда')+'</span><small>'+Math.round(+x.cal||0)+' ккал</small></div>'}).join('')+
      '</div>';
    }).join(''):'<div class="history-empty-block">Питание в этот день не записано.</div>';

    const weight=(S.weights&&S.weights[k])?round1(+S.weights[k])+' кг':'—';
    const steps=(S.steps&&S.steps[k])?Math.round(+S.steps[k]).toLocaleString('ru-RU'):'—';
    const water=(S.water&&S.water[k])?Math.round(+S.water[k])+' мл':'—';
    const caffeine=(S.caf&&S.caf[k])?Math.round(+S.caf[k])+' мг':'—';

    const wellHtml=well
      ? '<div class="history-well-grid"><div><span>Сон</span><b>'+(well.sleep?round1(+well.sleep)+' ч':'—')+'</b></div><div><span>Голод</span><b>'+(+well.hunger||5)+'/10</b></div><div><span>Энергия</span><b>'+(+well.energy||5)+'/10</b></div><div><span>Стресс</span><b>'+(+well.stress||5)+'/10</b></div></div>'+(well.note?'<div class="history-note">'+escapeHtml(well.note)+'</div>':'')
      : '<div class="history-empty-block">Чек-ин не заполнен.</div>';

    const repeatBtn=food.length&&k!==key()
      ? '<button class="btn history-repeat-btn" type="button" data-date="'+k+'" onclick="repeatHistoryFood(this.dataset.date)">Повторить питание сегодня</button>'
      : '';

    sheet.innerHTML=
      '<div class="history-sheet">'+
        '<div class="history-sheet-head"><div><div class="label">История дня</div><h3>'+historyDayTitle(k)+'</h3></div><div class="history-date-badge">'+new Date(k+'T00:00').getDate()+'</div></div>'+
        '<div class="history-summary-grid"><div><span>Вес</span><b>'+weight+'</b></div><div><span>Шаги</span><b>'+steps+'</b></div><div><span>Вода</span><b>'+water+'</b></div><div><span>Кофеин</span><b>'+caffeine+'</b></div></div>'+
        '<div class="history-section"><div class="history-section-head"><span>Питание</span><b>'+Math.round(tot.cal)+' ккал · Б '+round1(tot.p)+' · Ж '+round1(tot.f)+' · У '+round1(tot.c)+'</b></div>'+foodHtml+'</div>'+
        '<div class="history-section"><div class="history-section-head"><span>Самочувствие</span><b>'+(well?'заполнено':'нет записи')+'</b></div>'+wellHtml+'</div>'+
        '<div class="history-section"><div class="history-section-head"><span>Тренировки</span><b>'+work.length+'</b></div>'+(work.length?'<div class="history-workouts">'+work.map(function(x){return '<span>Силовая '+escapeHtml(x)+'</span>'}).join('')+'</div>':'<div class="history-empty-block">Тренировок не записано.</div>')+'</div>'+
        '<div class="history-edit-block"><div class="history-edit-title"><span>Добавить или исправить</span><b>Запись сохранится за эту дату</b></div><div class="history-edit-grid">'+
          '<button type="button" onclick="openHistoryEntry(\'weight\',\''+k+'\')"><i>⚖</i><span>Вес</span></button>'+
          '<button type="button" onclick="openHistoryEntry(\'steps\',\''+k+'\')"><i>↗</i><span>Шаги</span></button>'+
          '<button type="button" onclick="openHistoryEntry(\'food\',\''+k+'\')"><i>○</i><span>Еда</span></button>'+
          '<button type="button" onclick="openHistoryEntry(\'water\',\''+k+'\')"><i>◌</i><span>Вода</span></button>'+
          '<button type="button" onclick="openHistoryEntry(\'wellness\',\''+k+'\')"><i>♡</i><span>Чек-ин</span></button>'+
          '<button type="button" onclick="openHistoryEntry(\'measure\',\''+k+'\')"><i>↔</i><span>Замеры</span></button>'+
          '<button type="button" onclick="openHistoryEntry(\'photo\',\''+k+'\')"><i>▣</i><span>Фото</span></button>'+
        '</div></div>'+
        repeatBtn+
      '</div>';
    modal.classList.add('open');
  }

  function openHistoryEntry(type,k){
    if(typeof openEntryForm!=='function')return;
    openEntryForm(type,k);
  }

  window.openHistoryEntry=openHistoryEntry;

  function repeatHistoryFood(k){
    const src=(S.food&&S.food[k])||[];
    if(!src.length)return;
    const undo=foodUndoSnapshot(key());
    if(!S.food[key()])S.food[key()]=[];
    src.forEach(function(x){S.food[key()].push(Object.assign({},x,{copiedFrom:k}));if(entryCaffeineMg(x))adjustDayCaffeine(entryCaffeineMg(x),key())});
    if(typeof save==='function')save();
    if(typeof closeM==='function')closeM();
    showFoodUndo('Питание из истории добавлено',undo);
  }

  window.changeHistoryMonth=changeHistoryMonth;
  window.openHistoryDay=openHistoryDay;
  window.repeatHistoryFood=repeatHistoryFood;

  function ensureProfileGoals(){
    if(!window.S||!S.profile)return {calories:1500,protein:105,steps:7000,water:1800,caffeine:400,goal:60};
    if(!(+S.profile.calories>0))S.profile.calories=1500;
    if(!(+S.profile.protein>0))S.profile.protein=105;
    if(!(+S.profile.steps>0))S.profile.steps=7000;
    if(!(+S.profile.water>0))S.profile.water=1800;
    if(!(+S.profile.caffeine>0))S.profile.caffeine=400;
    return S.profile;
  }

  function appGoals(){
    const p=ensureProfileGoals();
    return {
      calories:+p.calories||1500,
      protein:+p.protein||105,
      steps:+p.steps||7000,
      water:+p.water||1800,
      caffeine:+p.caffeine||400,
      goal:+p.goal||60
    };
  }

  function goalsCardMarkup(){
    return '<div class="goals-card" id="goalsCard">'+
      '<div class="goals-card-head"><div><div class="label">Персонализация</div><h3>Мои цели</h3><p>Эти значения используются по всему MY 60.</p></div><button type="button" onclick="openGoalsSettings()">Изменить</button></div>'+
      '<div class="goals-overview">'+
        '<div><span>Вес</span><b id="goalSettingWeight">—</b><small>цель</small></div>'+
        '<div><span>Ккал</span><b id="goalSettingCalories">—</b><small>в день</small></div>'+
        '<div><span>Белок</span><b id="goalSettingProtein">—</b><small>г / день</small></div>'+
        '<div><span>Шаги</span><b id="goalSettingSteps">—</b><small>в день</small></div>'+
        '<div><span>Вода</span><b id="goalSettingWater">—</b><small>мл / день</small></div>'+
        '<div><span>Кофеин</span><b id="goalSettingCaffeine">—</b><small>мг / день</small></div>'+
      '</div>'+
      '<div class="goals-note">Меняй цели осознанно. MY 60 не будет автоматически снижать калории из-за нескольких дней без изменения веса.</div>'+
    '</div>';
  }

  function updateGoalsCard(){
    const root=document.getElementById('goalsCard');if(!root||!window.S)return;
    const g=appGoals();
    const map={
      goalSettingWeight:round1(g.goal)+' кг',
      goalSettingCalories:Math.round(g.calories),
      goalSettingProtein:Math.round(g.protein)+' г',
      goalSettingSteps:Math.round(g.steps).toLocaleString('ru-RU'),
      goalSettingWater:Math.round(g.water)+' мл',
      goalSettingCaffeine:Math.round(g.caffeine)+' мг'
    };
    Object.keys(map).forEach(function(id){const el=document.getElementById(id);if(el)el.textContent=map[id]});
  }

  function openGoalsSettings(){
    if(typeof sheet==='undefined'||typeof modal==='undefined'||!S.profile)return;
    const g=appGoals();
    sheet.innerHTML=
      '<div class="goals-sheet">'+
        '<div class="goals-sheet-head"><div><div class="label">Настройки MY 60</div><h3>Мои цели</h3><p>После сохранения все экраны пересчитаются автоматически.</p></div><div class="goals-sheet-mark">60</div></div>'+
        '<div class="goals-form-grid">'+
          '<label><span>Цель веса</span><div><input id="settingsGoalWeight" type="number" inputmode="decimal" step=".1" min="35" max="200" value="'+round1(g.goal)+'"><i>кг</i></div></label>'+
          '<label><span>Калории</span><div><input id="settingsCalories" type="number" inputmode="numeric" step="10" min="1000" max="4000" value="'+Math.round(g.calories)+'"><i>ккал</i></div></label>'+
          '<label><span>Белок</span><div><input id="settingsProtein" type="number" inputmode="numeric" step="5" min="40" max="250" value="'+Math.round(g.protein)+'"><i>г</i></div></label>'+
          '<label><span>Шаги</span><div><input id="settingsSteps" type="number" inputmode="numeric" step="500" min="1000" max="30000" value="'+Math.round(g.steps)+'"><i>шагов</i></div></label>'+
          '<label><span>Вода</span><div><input id="settingsWater" type="number" inputmode="numeric" step="100" min="500" max="5000" value="'+Math.round(g.water)+'"><i>мл</i></div></label>'+
          '<label><span>Кофеин</span><div><input id="settingsCaffeine" type="number" inputmode="numeric" step="25" min="50" max="1000" value="'+Math.round(g.caffeine)+'"><i>мг</i></div></label>'+
        '</div>'+
        '<div class="goals-safety">Это пользовательские цели трекера, а не автоматическое медицинское назначение. Если меняешь калории существенно, лучше делать это осознанно, а не из-за краткосрочного скачка веса.</div>'+
        '<button class="btn goals-save" type="button" onclick="saveGoalsSettings()">Сохранить цели</button>'+
      '</div>';
    modal.classList.add('open');
  }

  function saveGoalsSettings(){
    if(!S.profile)return;
    const get=function(id){const el=document.getElementById(id);return el?(+el.value||0):0};
    const goal=get('settingsGoalWeight'),cal=get('settingsCalories'),protein=get('settingsProtein'),steps=get('settingsSteps'),water=get('settingsWater'),caffeine=get('settingsCaffeine');
    if(!(goal>=35&&goal<=200&&cal>=1000&&cal<=4000&&protein>=40&&protein<=250&&steps>=1000&&steps<=30000&&water>=500&&water<=5000&&caffeine>=50&&caffeine<=1000))return;
    S.profile.goal=goal;
    S.profile.calories=Math.round(cal);
    S.profile.protein=Math.round(protein);
    S.profile.steps=Math.round(steps);
    S.profile.water=Math.round(water);
    S.profile.caffeine=Math.round(caffeine);
    GOAL=goal;
    if(typeof applyProfile==='function')applyProfile();
    if(typeof save==='function')save();
    if(typeof closeM==='function')closeM();
  }

  window.openGoalsSettings=openGoalsSettings;
  window.saveGoalsSettings=saveGoalsSettings;

  function decorateMore(){
    const sec=document.getElementById('more');if(!sec)return;
    const oldSummary=sec.querySelector('#summary')&&sec.querySelector('#summary').closest('.card');
    if(oldSummary)oldSummary.classList.add('more-summary-legacy');
    let exp=document.getElementById('weeklyExperience');
    if(!exp){
      const title=sec.querySelector('.premium-section-title');
      if(title)title.insertAdjacentHTML('afterend',weeklyDashboardMarkup());
      else sec.insertAdjacentHTML('afterbegin',weeklyDashboardMarkup());
    }
    updateWeeklyExperience();
    let history=document.getElementById('historyCard');
    if(!history){
      const anchor=document.getElementById('weeklyExperience');
      if(anchor)anchor.insertAdjacentHTML('afterend',historyCardMarkup());
      else sec.insertAdjacentHTML('afterbegin',historyCardMarkup());
    }
    renderHistoryCalendar();
    let goals=document.getElementById('goalsCard');
    if(!goals){
      const anchor=document.getElementById('historyCard')||document.getElementById('weeklyExperience');
      if(anchor)anchor.insertAdjacentHTML('afterend',goalsCardMarkup());
      else sec.insertAdjacentHTML('afterbegin',goalsCardMarkup());
    }
    updateGoalsCard();
  }

  function weeklyMenuLibrary(){
    return {
      breakfast:[
        {id:'b1',title:'Омлет, сыр и овощи',kcal:360,p:26,f:18,c:24,ingredients:[['Яйца',2,'шт'],['Сыр',30,'г'],['Овощи',180,'г'],['Хлеб',40,'г']]},
        {id:'b2',title:'Творог с бананом',kcal:350,p:30,f:10,c:37,ingredients:[['Творог 5%',180,'г'],['Бананы',100,'г'],['Мёд',8,'г']]},
        {id:'b3',title:'Овсянка + яйца',kcal:390,p:23,f:14,c:43,ingredients:[['Овсянка',50,'г'],['Яйца',2,'шт'],['Яблоки',100,'г']]},
        {id:'b4',title:'Йогурт, ягоды и овсянка',kcal:330,p:24,f:7,c:41,ingredients:[['Греческий йогурт',220,'г'],['Ягоды',120,'г'],['Овсянка',35,'г']]}
      ],
      lunch:[
        {id:'l1',title:'Курица, гречка и салат',kcal:455,p:48,f:11,c:42,ingredients:[['Куриное филе',150,'г'],['Гречка сухая',55,'г'],['Овощи',200,'г']]},
        {id:'l2',title:'Гуляш с пюре и овощами',kcal:480,p:35,f:17,c:48,ingredients:[['Говядина',140,'г'],['Картофель',230,'г'],['Овощи',180,'г']]},
        {id:'l3',title:'Курица с рисом и салатом',kcal:465,p:46,f:10,c:47,ingredients:[['Куриное филе',150,'г'],['Рис сухой',55,'г'],['Овощи',200,'г']]},
        {id:'l4',title:'Говядина с макаронами',kcal:490,p:37,f:16,c:50,ingredients:[['Говядина',130,'г'],['Макароны сухие',65,'г'],['Томатный соус',60,'г'],['Овощи',150,'г']]}
      ],
      snack:[
        {id:'s1',title:'Творог + яблоко',kcal:225,p:23,f:8,c:18,ingredients:[['Творог 5%',150,'г'],['Яблоки',130,'г']]},
        {id:'s2',title:'Йогурт + ягоды',kcal:190,p:19,f:5,c:18,ingredients:[['Греческий йогурт',200,'г'],['Ягоды',120,'г']]},
        {id:'s3',title:'Творог + банан',kcal:235,p:23,f:8,c:24,ingredients:[['Творог 5%',150,'г'],['Бананы',90,'г']]},
        {id:'s4',title:'Йогурт + яблоко',kcal:205,p:18,f:5,c:23,ingredients:[['Греческий йогурт',180,'г'],['Яблоки',130,'г']]}
      ],
      dinner:[
        {id:'d1',title:'Курица, картофель и салат',kcal:410,p:43,f:10,c:38,ingredients:[['Куриное филе',140,'г'],['Картофель',200,'г'],['Овощи',180,'г']]},
        {id:'d2',title:'Рыба, картофель и овощи',kcal:415,p:35,f:14,c:37,ingredients:[['Рыба',160,'г'],['Картофель',200,'г'],['Овощи',180,'г']]},
        {id:'d3',title:'Курица, гречка и овощи',kcal:420,p:44,f:10,c:39,ingredients:[['Куриное филе',140,'г'],['Гречка сухая',50,'г'],['Овощи',200,'г']]},
        {id:'d4',title:'Омлет, сыр и овощи',kcal:385,p:29,f:21,c:20,ingredients:[['Яйца',3,'шт'],['Сыр',30,'г'],['Овощи',220,'г'],['Хлеб',30,'г']]}
      ]
    };
  }

  function defaultWeeklyMenu(){
    return [
      {breakfast:'b1',lunch:'l1',snack:'s1',dinner:'d3'},
      {breakfast:'b3',lunch:'l3',snack:'s2',dinner:'d2'},
      {breakfast:'b2',lunch:'l4',snack:'s4',dinner:'d1'},
      {breakfast:'b4',lunch:'l2',snack:'s3',dinner:'d4'},
      {breakfast:'b3',lunch:'l1',snack:'s1',dinner:'d2'},
      {breakfast:'b1',lunch:'l3',snack:'s2',dinner:'d3'},
      {breakfast:'b2',lunch:'l2',snack:'s4',dinner:'d1'}
    ];
  }

  function ensureWeeklyMenu(){
    if(!Array.isArray(S.weeklyMenu)||S.weeklyMenu.length!==7){
      S.weeklyMenu=defaultWeeklyMenu();
    }
    return S.weeklyMenu;
  }

  function menuMealById(type,id){
    const list=weeklyMenuLibrary()[type]||[];
    return list.find(function(x){return x.id===id})||list[0];
  }

  function menuWeekStartDate(){
    const start=planStartDate();
    const day=planDayNumber();
    const week=day<=0?1:planWeekNumber();
    const d=new Date(start);
    d.setDate(start.getDate()+(week-1)*7);
    d.setHours(0,0,0,0);
    return d;
  }

  function menuDateForDay(index){
    const d=menuWeekStartDate();
    d.setDate(d.getDate()+index);
    return d;
  }

  function weeklyMenuDayTotals(day){
    const types=['breakfast','lunch','snack','dinner'];
    return types.reduce(function(a,type){
      const m=menuMealById(type,day[type]);
      a.kcal+=m.kcal;a.p+=m.p;a.f+=m.f;a.c+=m.c;return a;
    },{kcal:0,p:0,f:0,c:0});
  }

  function weeklyMenuMarkup(){
    return '<div class="weekly-menu" id="weeklyMenu">'+
      '<div class="weekly-menu-head"><div><div class="label">Питание на 7 дней</div><h3>Меню недели</h3><p>Примерно под твои цели. Любой приём пищи можно заменить одним нажатием.</p></div><button type="button" onclick="resetWeeklyMenu()">Сбросить меню</button></div>'+
      '<div class="weekly-menu-days" id="weeklyMenuDays"></div>'+
      '<div class="weekly-shop" id="weeklyShop"></div>'+
    '</div>';
  }

  function swapWeeklyMeal(dayIndex,type){
    const menu=ensureWeeklyMenu(),list=weeklyMenuLibrary()[type]||[],current=menuMealById(type,menu[dayIndex][type]);
    const i=list.findIndex(function(x){return x.id===current.id});
    menu[dayIndex][type]=list[(i+1)%list.length].id;
    S.shop={};
    if(typeof save==='function')save();
    renderWeeklyMenu();
  }

  function resetWeeklyMenu(){
    S.weeklyMenu=defaultWeeklyMenu();
    S.shop={};
    if(typeof save==='function')save();
    renderWeeklyMenu();
  }

  function addWeeklyMenuDay(dayIndex){
    const menu=ensureWeeklyMenu(),day=menu[dayIndex];
    const date=menuDateForDay(dayIndex),dateKey=key(date);
    const undo=foodUndoSnapshot(dateKey),before=((S.food&&S.food[dateKey])||[]).length;
    const mealMap={breakfast:'Завтрак',lunch:'Обед',snack:'Перекус',dinner:'Ужин'};
    if(!S.food[dateKey])S.food[dateKey]=[];
    ['breakfast','lunch','snack','dinner'].forEach(function(type){
      const m=menuMealById(type,day[type]);
      const exists=S.food[dateKey].some(function(x){return x.menuPlanId===m.id});
      if(!exists)S.food[dateKey].push({
        meal:mealMap[type],name:m.title,cal:m.kcal,p:m.p,f:m.f,c:m.c,menuPlanId:m.id
      });
    });
    if(typeof save==='function')save();
    renderWeeklyMenu();
    if((S.food[dateKey]||[]).length>before)showFoodUndo('Меню дня добавлено в дневник',undo);
  }

  function weeklyShoppingList(){
    const menu=ensureWeeklyMenu(),map={};
    menu.forEach(function(day){
      ['breakfast','lunch','snack','dinner'].forEach(function(type){
        const meal=menuMealById(type,day[type]);
        meal.ingredients.forEach(function(it){
          const keyName=it[0]+'|'+it[2];
          if(!map[keyName])map[keyName]={name:it[0],qty:0,unit:it[2]};
          map[keyName].qty+=+it[1]||0;
        });
      });
    });
    return Object.keys(map).map(function(k){return map[k]}).sort(function(a,b){return a.name.localeCompare(b.name,'ru')});
  }

  function formatShopQty(x){
    if(x.unit==='г'&&x.qty>=1000)return round1(x.qty/1000)+' кг';
    return Math.round(x.qty)+' '+x.unit;
  }

  function renderWeeklyMenu(){
    const root=document.getElementById('weeklyMenuDays');
    if(!root||!window.S)return;
    const menu=ensureWeeklyMenu(),today=key();
    const labels={breakfast:'Завтрак',lunch:'Обед',snack:'Перекус',dinner:'Ужин'};
    root.innerHTML=menu.map(function(day,i){
      const date=menuDateForDay(i),dk=key(date),tot=weeklyMenuDayTotals(day);
      return '<div class="weekly-menu-day '+(dk===today?'today':'')+'">'+
        '<div class="weekly-menu-day-head"><div><span>День '+(i+1)+'</span><h4>'+date.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'short'})+'</h4></div><div class="weekly-menu-day-total"><b>'+Math.round(tot.kcal)+' ккал</b><small>Б '+Math.round(tot.p)+' г</small></div></div>'+
        '<div class="weekly-menu-meals">'+['breakfast','lunch','snack','dinner'].map(function(type){
          const m=menuMealById(type,day[type]);
          return '<div class="weekly-menu-meal"><div><span>'+labels[type]+'</span><b>'+m.title+'</b><small>'+m.kcal+' ккал · Б '+m.p+' г</small></div><button type="button" onclick="swapWeeklyMeal('+i+',\''+type+'\')">Заменить</button></div>';
        }).join('')+'</div>'+
        '<button class="weekly-menu-add" type="button" onclick="addWeeklyMenuDay('+i+')">'+((S.food[dk]||[]).some(function(x){return x.menuPlanId})?'Добавлено в дневник ✓':'Добавить этот день в дневник')+'</button>'+
      '</div>';
    }).join('');

    const shop=document.getElementById('weeklyShop');
    if(shop){
      const items=weeklyShoppingList();
      shop.innerHTML='<div class="weekly-shop-head"><div><span>Автосписок</span><h4>Покупки на эту неделю</h4><p>Пересчитывается после каждой замены блюда.</p></div><button type="button" onclick="resetShop();renderWeeklyMenu()">Сбросить ✓</button></div>'+
        '<div class="weekly-shop-list">'+items.map(function(x,i){
          return '<label><input type="checkbox" '+(S.shop[i]?'checked':'')+' onchange="sh('+i+');renderWeeklyMenu()"><span>'+escapeHtml(x.name)+'</span><b>'+formatShopQty(x)+'</b></label>';
        }).join('')+'</div>';
    }
  }

  window.swapWeeklyMeal=swapWeeklyMeal;
  window.resetWeeklyMenu=resetWeeklyMenu;
  window.addWeeklyMenuDay=addWeeklyMenuDay;
  window.renderWeeklyMenu=renderWeeklyMenu;

  function decoratePlan(){
    const sec=document.getElementById('plan');if(!sec)return;
    const oldCards=Array.from(sec.children).filter(function(x){return x.classList&&x.classList.contains('card')});
    oldCards.forEach(function(c,i){
      if(i===0||c.classList.contains('work'))c.classList.add('plan-legacy-hidden');
      if(c.querySelector&&c.querySelector('#menu'))c.classList.add('plan-menu-card','plan-legacy-hidden');
      if(c.classList.contains('shop'))c.classList.add('plan-shop-card','plan-legacy-hidden');
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
    let weekly=document.getElementById('weeklyMenu');
    if(!weekly){
      const studio=document.getElementById('workoutStudio');
      if(studio)studio.insertAdjacentHTML('afterend',weeklyMenuMarkup());
      else if(exp)exp.insertAdjacentHTML('beforeend',weeklyMenuMarkup());
    }
    updatePlanExperience();
    renderWeeklyMenu();
  }

  window.selectPlanWorkout=selectPlanWorkout;
  window.togglePlanExercise=togglePlanExercise;
  window.togglePlanSet=togglePlanSet;
  window.resetCurrentWorkout=resetCurrentWorkout;
  window.showExerciseInfo=showExerciseInfo;
  window.startTodayWorkout=startTodayWorkout;
  window.completePremiumWorkout=completePremiumWorkout;

  function decorate(){
    decorateNav();sectionTitles();decorateToday();decorateFood();decorateProgress();decoratePlan();decorateMore();updateRing();
  }
  document.addEventListener('DOMContentLoaded',decorate);
  if(typeof window.render==='function'){
    const oldRender=window.render;
    window.render=function(){oldRender.apply(this,arguments);decorate();updateRing();}
  }
  if(typeof window.draw==='function')window.draw=premiumDraw;
  if(typeof window.tab==='function'){
    const oldTab=window.tab;
    window.tab=function(id,b){oldTab(id,b);requestAnimationFrame(()=>{decorate();if(id==='progress')setTimeout(()=>{premiumDraw();drawProgressChart();drawBodyProgressChart();},60);});}
  }
  window.addEventListener('resize',()=>{if((function(){var p=document.getElementById('progress');return p&&p.classList.contains('active')})()){premiumDraw();drawProgressChart();drawBodyProgressChart();}});
})();