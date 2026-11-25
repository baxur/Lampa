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
    groups[0].films = ['2025|It Was Just an Accident|2025','2024|Anora|2024','2023|Anatomy of a Fall|2023','2022|Triangle of Sadness|2022','2021|Titane|2021','2019|Parasite|2019','2018|Shoplifters|2018','2017|The Square|2017','2016|I, Daniel Blake|2016','2015|Dheepan|2015','2014|Winter Sleep|2014','2013|Blue Is the Warmest Colour|2013','2012|Amour|2012','2011|The Tree of Life|2011','2010|Uncle Boonmee Who Can Recall His Past Lives|2010'];
    groups[1].films = ['2024|The Room Next Door|2024','2023|Poor Things|2023','2022|All the Beauty and the Bloodshed|2022','2021|Happening|2021','2020|Nomadland|2020','2019|Joker|2019','2018|Roma|2018','2017|The Shape of Water|2017','2016|The Woman Who Left|2016','2015|From Afar|2015','2014|A Pigeon Sat on a Branch Reflecting on Existence|2014','2013|Sacro GRA|2013','2012|Pieta|2012','2011|Faust|2011','2010|Somewhere|2010'];
    groups[2].films = ['2025|Dreams (Sex Love)|2025','2024|Dahomey|2024','2023|On the Adamant|2023','2022|Alcarras|2022','2021|Bad Luck Banging or Loony Porn|2021','2020|There Is No Evil|2020','2019|Synonyms|2019','2018|Touch Me Not|2018','2017|On Body and Soul|2017','2016|Fire at Sea|2016','2015|Taxi|2015','2014|Black Coal, Thin Ice|2014','2013|Child’s Pose|2013','2012|Caesar Must Die|2012','2011|A Separation|2011','2010|Honey|2010'];
    groups[3].films = ['2026|One Battle After Another|2025','2025|Anora|2024','2024|Oppenheimer|2023','2023|Everything Everywhere All at Once|2022','2022|CODA|2021','2021|Nomadland|2020','2020|Parasite|2019','2019|Green Book|2018','2018|The Shape of Water|2017','2017|Moonlight|2016','2016|Spotlight|2015','2015|Birdman|2014','2014|12 Years a Slave|2013','2013|Argo|2012','2012|The Artist|2011','2011|The King’s Speech|2010','2010|The Hurt Locker|2008'];
    function select(title, items, callback, back) {
        Lampa.Select.show({title:title,items:items,onSelect:callback,onBack:back || function(){Lampa.Controller.toggle('menu');}});
    }
    function list(url,title){Lampa.Activity.push({url:url,title:title,component:'list',source:'tmdb',page:1});}
    function films(group){
        var items=group.films.map(function(line){var f=line.split('|');return {title:f[0]+' — '+f[1],film:f};});
        select(group.name,items,function(item){var f=item.film;list('search/movie?query='+encodeURIComponent(f[1])+'&year='+f[2],f[1]);},menu);
    }
    function years(){var items=[];for(var y=new Date().getFullYear();y>=1950;y--){items.push({title:String(y),year:y});}select('Лучшие фильмы по годам — TMDB',items,function(item){list('discover/movie?primary_release_year='+item.year+'&sort_by=vote_average.desc&vote_count.gte=200&include_adult=false','Лучшие фильмы '+item.year+' — TMDB');},menu);}
    function menu(){var items=groups.map(function(g,i){return {title:g.name,index:i};});items.push({title:'Лучшие фильмы по годам',index:4});select('Кинофестивали',items,function(item){if(item.index===4)years();else films(groups[item.index]);});}
    function init(){if(ready || window.lampa_festivals_v1)return;var target=$('.menu .menu__list').eq(0);if(!target.length)return;var button=$('<li class="menu__item selector"><div class="menu__ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3h8v6a4 4 0 0 1-8 0V3ZM8 5H3v2a5 5 0 0 0 5 5m8-7h5v2a5 5 0 0 1-5 5M12 13v6m-5 2h10"/></svg></div><div class="menu__text">Кинофестивали</div></li>');button.on('hover:enter',menu);target.append(button);ready=true;window.lampa_festivals_v1=true;}
    if(window.appready)init();else Lampa.Listener.follow('app',function(e){if(e.type==='ready')init();});
})();
