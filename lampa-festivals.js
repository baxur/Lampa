(function () {
    'use strict';
    var ready = false;
    var groups = [
        {name:'Канны — Золотая пальмовая ветвь', films:['2025|Anora|2024','2024|Anatomy of a Fall|2023','2023|Triangle of Sadness|2022']},
        {name:'Венеция — Золотой лев', films:[]},
        {name:'Берлин — Золотой медведь', films:[]},
        {name:'Оскар — Лучший фильм', films:[]}
    ];
    // Award year | original/international title | release year.
    groups[0].films = ['2026|Fjord|2026','2025|It Was Just an Accident|2025','2024|Anora|2024','2023|Anatomy of a Fall|2023','2022|Triangle of Sadness|2022','2021|Titane|2021','2019|Parasite|2019','2018|Shoplifters|2018','2017|The Square|2017','2016|I, Daniel Blake|2016','2015|Dheepan|2015','2014|Winter Sleep|2014','2013|Blue Is the Warmest Colour|2013','2012|Amour|2012','2011|The Tree of Life|2011','2010|Uncle Boonmee Who Can Recall His Past Lives|2010','2009|The White Ribbon|2009','2008|The Class|2008','2007|4 Months, 3 Weeks and 2 Days|2007','2006|The Wind That Shakes the Barley|2006','2005|L Enfant|2005','2004|Fahrenheit 9/11|2004','2003|Elephant|2003','2002|The Pianist|2002','2001|The Son’s Room|2001','2000|Dancer in the Dark|2000'];
    groups[1].films = ['2026|Woman Unknown|2026','2025|Father Mother Sister Brother|2025','2024|The Room Next Door|2024','2023|Poor Things|2023','2022|All the Beauty and the Bloodshed|2022','2021|Happening|2021','2020|Nomadland|2020','2019|Joker|2019','2018|Roma|2018','2017|The Shape of Water|2017','2016|The Woman Who Left|2016','2015|From Afar|2015','2014|A Pigeon Sat on a Branch Reflecting on Existence|2014','2013|Sacro GRA|2013','2012|Pieta|2012','2011|Faust|2011','2010|Somewhere|2010'];
    groups[2].films = ['2026|Yellow Letters|2026','2025|Dreams (Sex Love)|2025','2024|Dahomey|2024','2023|On the Adamant|2023','2022|Alcarras|2022','2021|Bad Luck Banging or Loony Porn|2021','2020|There Is No Evil|2020','2019|Synonyms|2019','2018|Touch Me Not|2018','2017|On Body and Soul|2017','2016|Fire at Sea|2016','2015|Taxi|2015','2014|Black Coal, Thin Ice|2014','2013|Child’s Pose|2013','2012|Caesar Must Die|2012','2011|A Separation|2011','2010|Honey|2010'];
    groups[3].films = ['2026|One Battle After Another|2025','2025|Anora|2024','2024|Oppenheimer|2023','2023|Everything Everywhere All at Once|2022','2022|CODA|2021','2021|Nomadland|2020','2020|Parasite|2019','2019|Green Book|2018','2018|The Shape of Water|2017','2017|Moonlight|2016','2016|Spotlight|2015','2015|Birdman|2014','2014|12 Years a Slave|2013','2013|Argo|2012','2012|The Artist|2011','2011|The King’s Speech|2010','2010|The Hurt Locker|2008'];

    groups.push({name:"Канны 2026 — призёры",films:["2026|Fjord|2026", "2026|Minotaur|2026", "2026|La Bola Negra|2026", "2026|Fatherland|2026", "2026|A Man of His Time|2026", "2026|The Dreamed Adventure|2026", "2026|All of a Sudden|2026", "2026|Coward|2026"]});
    groups.push({name:"Канны 2026 — весь конкурс",films:["2026|Fjord|2026", "2026|Minotaur|2026", "2026|La Bola Negra|2026", "2026|Fatherland|2026", "2026|A Man of His Time|2026", "2026|The Dreamed Adventure|2026", "2026|All of a Sudden|2026", "2026|Coward|2026", "2026|Amarga Navidad|2026", "2026|A Woman’s Life|2026", "2026|Parallel Tales|2026", "2026|Paper Tiger|2026", "2026|The Unknown|2026", "2026|Another Day|2026", "2026|Sheep in the Box|2026", "2026|Hope|2026", "2026|Nagi Notes|2026", "2026|Gentle Monster|2026", "2026|The Birthday Party|2026", "2026|Moulin|2026", "2026|The Man I Love|2026", "2026|The Beloved|2026"]});
    function select(title, items, callback, back) {
        Lampa.Select.show({title:title,items:items,onSelect:callback,onBack:back || function(){Lampa.Controller.toggle('menu');}});
    }
    function openCard(card){
        card.source='tmdb'; card.media_type='movie';
        Lampa.Activity.push({id:card.id,method:'movie',source:'tmdb',component:'full',card:card});
    }
    function request(url,done,fail){
        try { Lampa.Api.sources.tmdb.list({url:url,page:1,source:'tmdb'},done,fail); } catch(e){fail(e);}
    }
    function normalize(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\u0400-\u04ff]/g,'');}
    function resolve(f,done){
        request('search/movie?query='+encodeURIComponent(f[1])+'&year='+f[2],function(data){
            var hits=(data&&data.results)||[]; var exact=hits.filter(function(c){return String(c.release_date||'').slice(0,4)===f[2]&&(normalize(c.title)===normalize(f[1])||normalize(c.original_title)===normalize(f[1]));});
            if(exact.length===1){exact[0].source='tmdb';done(exact[0]);}else done(null);
        },function(){done(null);});
    }
    function search(f){if(Lampa.Search&&Lampa.Search.open)Lampa.Search.open({input:f[1]});else Lampa.Noty.show('Поиск: '+f[1]);}
    function grid(title,cards,missing,back){
        if(!cards.length){fallback(title,missing,back);return;}
        Lampa.Activity.push({title:title,component:'festivals_grid_v3',url:'',source:'tmdb',page:1,films:cards,missing:missing});
    }
    function fallback(title,missing,back){
        if(!missing.length){Lampa.Noty.show('Нет результатов TMDB');back();return;}
        select(title+' — поиск',missing.map(function(f){return {title:f[0]+' — '+f[1],film:f};}),function(i){search(i.film);},back);
    }
    function films(group){
        var rows=group.films.map(function(s){return s.split('|');}),cards=[],missing=[],i=0;
        Lampa.Noty.show('Загрузка постеров: '+group.name);
        function next(){if(i>=rows.length){grid(group.name,cards,missing,menu);return;}var f=rows[i++];resolve(f,function(c){if(c)cards.push(c);else missing.push(f);next();});}
        next();
    }
    function years(){var items=[];for(var y=new Date().getFullYear();y>=1950;y--)items.push({title:String(y),year:y});select('Лучшие фильмы по годам — TMDB',items,function(item){var title='Лучшие фильмы '+item.year;request('discover/movie?primary_release_year='+item.year+'&sort_by=vote_average.desc&vote_count.gte=100&include_adult=false',function(d){var cards=(d&&d.results)||[];if(cards.length)grid(title,cards,[],years);else {Lampa.Noty.show('TMDB не вернул фильмы');years();}},function(){Lampa.Noty.show('Ошибка подключения к TMDB');years();});},menu);}
    function component(object){
        var html=$('<div class="festivals-v3" style="padding:1.5em"><div class="festivals-v3-grid" style="display:flex;flex-wrap:wrap;gap:1em"></div></div>');
        var scroll=new Lampa.Scroll({mask:true,over:true}); var last;
        var self=this;
        this.create=function(){
            var target=html.find('.festivals-v3-grid');
            object.films.forEach(function(c){var el=$('<div class="selector" style="width:9em;position:relative"><div style="height:13.5em;background:#333;border-radius:.5em;overflow:hidden"><img style="width:100%;height:100%;object-fit:cover"/></div><div class="festival-title" style="margin-top:.4em"></div><div class="festival-meta" style="opacity:.7;font-size:.85em"></div></div>');
                if(c.poster_path)el.find('img').attr('src','https://image.tmdb.org/t/p/w342'+c.poster_path);else el.find('img').remove();
                el.find('.festival-title').text(c.title||c.original_title);el.find('.festival-meta').text(String(c.release_date||'').slice(0,4)+'  ★ '+Number(c.vote_average||0).toFixed(1));
                el.on('hover:focus',function(){last=el[0];scroll.update(el);});el.on('hover:enter',function(){openCard(c);});target.append(el);
            });
            if(object.missing.length){var extra=$('<div class="selector" style="padding:1em;border:1px solid #888"></div>').text('Найти остальные фильмы ('+object.missing.length+')');extra.on('hover:focus',function(){last=extra[0];scroll.update(extra);});extra.on('hover:enter',function(){fallback(object.title,object.missing,function(){Lampa.Controller.toggle('content');});});target.append(extra);}
            scroll.append(html);return this.render();
        };
        this.render=function(){return scroll.render();};
        this.start=function(){Lampa.Controller.add('content',{toggle:function(){Lampa.Controller.collectionSet(html);Lampa.Controller.collectionFocus(last||false,html);},up:function(){Lampa.Navigator.move('up');},down:function(){Lampa.Navigator.move('down');},left:function(){if(Lampa.Navigator.canmove('left'))Lampa.Navigator.move('left');else Lampa.Controller.toggle('menu');},right:function(){Lampa.Navigator.move('right');},back:function(){Lampa.Activity.backward();}});Lampa.Controller.toggle('content');};
        this.pause=function(){};this.stop=function(){};this.destroy=function(){scroll.destroy();html.remove();};
    }
    function menu(){var items=groups.map(function(g,i){return {title:g.name,index:i};});items.push({title:'Лучшие фильмы по годам',index:-1});items=[items[4],items[5],items[6]].concat(items.slice(0,4));select('Кинофестивали',items,function(item){if(item.index===-1)years();else films(groups[item.index]);});}
    function init(){if(ready || window.lampa_festivals_v3)return;var target=$('.menu .menu__list').eq(0);if(!target.length)return;var button=$('<li class="menu__item selector"><div class="menu__ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3h8v6a4 4 0 0 1-8 0V3ZM8 5H3v2a5 5 0 0 0 5 5m8-7h5v2a5 5 0 0 1-5 5M12 13v6m-5 2h10"/></svg></div><div class="menu__text">Кинофестивали</div></li>');button.on('hover:enter',menu);Lampa.Component.add('festivals_grid_v3',component);target.append(button);ready=true;window.lampa_festivals_v3=true;}
    if(window.appready)init();else Lampa.Listener.follow('app',function(e){if(e.type==='ready')init();});
})();
