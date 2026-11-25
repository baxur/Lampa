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
    function list(url,title){Lampa.Activity.push({url:url,title:title,component:'category_full',source:'tmdb',page:1});}
    function findFilm(f){try { if(!Lampa.Search || typeof Lampa.Search.open !== 'function') throw new Error('Search API unavailable'); Lampa.Search.open({input:f[1]}); } catch(e){Lampa.Noty.show('Ошибка поиска: '+e.message); console.error('Festivals search',e);}}
    function films(group){
        var items=group.films.map(function(line){var f=line.split('|');return {title:f[0]+' — '+f[1],film:f};});
        select(group.name,items,function(item){var f=item.film;setTimeout(function(){findFilm(f);},250);},menu);
    }
    function years(){var items=[];for(var y=new Date().getFullYear();y>=1950;y--){items.push({title:String(y),year:y});}select('Лучшие фильмы по годам — TMDB',items,function(item){list('discover/movie?primary_release_year='+item.year+'&sort_by=vote_average.desc&vote_count.gte=30&include_adult=false','Лучшие фильмы '+item.year+' — TMDB');},menu);}
    function menu(){var items=groups.map(function(g,i){return {title:g.name,index:i};});items.push({title:'Лучшие фильмы по годам',index:-1});items = [items[4],items[5],items[6]].concat(items.slice(0,4));select('Кинофестивали 3.1',items,function(item){if(item.index===-1)years();else films(groups[item.index]);});}
    function init(){if(ready || window.lampa_festivals_v31)return;var target=$('.menu .menu__list').eq(0);if(!target.length)return;var button=$('<li class="menu__item selector"><div class="menu__ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3h8v6a4 4 0 0 1-8 0V3ZM8 5H3v2a5 5 0 0 0 5 5m8-7h5v2a5 5 0 0 1-5 5M12 13v6m-5 2h10"/></svg></div><div class="menu__text">Кинофестивали</div></li>');button.on('hover:enter',menu);target.append(button);ready=true;window.lampa_festivals_v31=true;}
    if(window.appready)init();else Lampa.Listener.follow('app',function(e){if(e.type==='ready')init();});
})();
