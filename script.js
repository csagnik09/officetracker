(function(){
  var KEY='officeLogbook.v1';
  var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  var state={settings:{name:'',org:'',target:8,sat:false},days:{}};
  var now=new Date(), view={y:now.getFullYear(),m:now.getMonth()};
  var $=function(id){return document.getElementById(id)};

  function load(){
    try{var r=localStorage.getItem(KEY);if(r){var p=JSON.parse(r);
      if(p&&p.settings)Object.assign(state.settings,p.settings);
      if(p&&p.days)state.days=p.days;}}catch(e){}
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){toast('Could not save in this browser')}}
  function toast(t){var el=$('toast');el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){el.classList.remove('on')},2200)}
  function pad(n){return n<10?'0'+n:''+n}
  function key(y,m,d){return y+'-'+pad(m+1)+'-'+pad(d)}
  function isWork(y,m,d){var w=new Date(y,m,d).getDay();return w!==0&&(w!==6||state.settings.sat)}
  function countT(y,m,t){var n=0,p=y+'-'+pad(m+1)+'-';for(var k in state.days){if(k.indexOf(p)===0&&state.days[k]===t)n++}return n}
  function count(y,m){var c=0,p=y+'-'+pad(m+1)+'-';for(var k in state.days){if(k.indexOf(p)===0&&state.days[k]==='O')c++}return c}

  function render(){
    var s=state.settings,y=view.y,m=view.m;
    $('title').textContent=(s.name?s.name+"'s":'My')+' Office Days';
    $('sub').textContent=s.org?s.org+' · hybrid attendance':'Hybrid attendance tracker';
    document.title=$('title').textContent;
    $('mLabel').textContent=MONTHS[m]+' '+y;
    $('yLabel').textContent='Year overview, '+y;

    var dim=new Date(y,m+1,0).getDate(), first=(new Date(y,m,1).getDay()+6)%7;
    var dow=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    $('dow').innerHTML=dow.map(function(d){return '<div>'+d+'</div>'}).join('');
    var html='',i;
    for(i=0;i<first;i++)html+='<div></div>';
    var todayKey=key(now.getFullYear(),now.getMonth(),now.getDate());
    for(var d=1;d<=dim;d++){
      var k=key(y,m,d),st=state.days[k]||'',w=isWork(y,m,d);
      var lab={O:'OFFICE',W:'HOME',L:'LEAVE'}[st]||'';
      html+='<button class="day '+st+(w?'':' off')+(k===todayKey?' today':'')+'" data-d="'+d+'"'+(w?'':' disabled')+
        ' aria-label="'+MONTHS[m]+' '+d+': '+(lab||'not marked')+'"><span class="n">'+d+'</span>'+(lab?'<span class="stamp">'+lab+'</span>':'')+'</button>';
    }
    $('cal').innerHTML=html;

    var c=count(y,m),t=s.target,pct=Math.min(100,Math.round(c/t*100));
    $('cnt').textContent=c;$('tgt').textContent=t;
    $('fill').style.width=pct+'%';$('ring').style.setProperty('--p',pct);$('cO').textContent=c;$('cH').textContent=countT(y,m,'W');$('cL').textContent=countT(y,m,'L');$('pb').setAttribute('aria-valuenow',pct);
    var need=t-c,msg;
    var cur=(y===now.getFullYear()&&m===now.getMonth());
    var past=(y<now.getFullYear()||(y===now.getFullYear()&&m<now.getMonth()));
    var left=0;
    if(cur){for(var x=now.getDate();x<=dim;x++){if(isWork(y,m,x)&&state.days[key(y,m,x)]!=='L'&&state.days[key(y,m,x)]!=='O')left++}}
    if(need<=0)msg='Target met'+(c>t?' with '+(c-t)+' extra':'')+'. Nice work.';
    else if(past)msg='Missed the target by '+need+' day'+(need>1?'s':'')+'.';
    else if(cur){msg=need+' more office day'+(need>1?'s':'')+' needed. '+left+' working day'+(left===1?'':'s')+' left this month.';
      if(left<need)msg=need+' more needed but only '+left+' working days remain. Target will be missed.';}
    else msg=need+' office days to go this month.';
    $('msg').textContent=msg;

    var yh='';
    for(var mm=0;mm<12;mm++){
      var cc=count(y,mm),pp=Math.min(100,cc/t*100);
      var over=(y<now.getFullYear()||(y===now.getFullYear()&&mm<now.getMonth()));
      yh+='<button class="mo'+(mm===m?' cur':'')+(over&&cc<t?' miss':'')+'" data-m="'+mm+'"><b>'+MONTHS[mm].slice(0,3)+'</b><small>'+cc+'/'+t+'</small><div class="mb"><i style="width:'+pp+'%"></i></div></button>';
    }
    $('year').innerHTML=yh;
  }

  $('cal').addEventListener('click',function(e){
    var b=e.target.closest('.day');if(!b||b.disabled)return;
    var k=key(view.y,view.m,+b.dataset.d),order=['','O','W','L'];
    var nx=order[(order.indexOf(state.days[k]||'')+1)%4];
    if(nx)state.days[k]=nx;else delete state.days[k];
    save();render();
    var again=document.querySelector('.day[data-d="'+b.dataset.d+'"]');if(again)again.focus();
  });
  $('year').addEventListener('click',function(e){var b=e.target.closest('.mo');if(b){view.m=+b.dataset.m;render()}});
  function shift(n){view.m+=n;if(view.m<0){view.m=11;view.y--}if(view.m>11){view.m=0;view.y++}render()}
  $('prev').onclick=function(){shift(-1)};$('next').onclick=function(){shift(1)};

  function sheet(on){$('set').classList.toggle('show',on)}
  $('bSet').onclick=function(){sheet(true)};
  $('bClose').onclick=function(){sheet(false)};
  $('set').addEventListener('click',function(e){if(e.target===this)sheet(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')sheet(false)});
  $('bToday').onclick=function(){view.y=now.getFullYear();view.m=now.getMonth();render()};
  var tx=null;
  $('cal').addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  $('cal').addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)>70)shift(dx<0?1:-1)},{passive:true});
  function bind(id,fn){$(id).addEventListener('input',function(){fn(this);save();render()})}
  bind('sName',function(el){state.settings.name=el.value.trim()});
  bind('sOrg',function(el){state.settings.org=el.value.trim()});
  bind('sTarget',function(el){var v=parseInt(el.value,10);if(v>0&&v<=31)state.settings.target=v});
  $('sSat').addEventListener('change',function(){state.settings.sat=this.checked;save();render()});

  $('bPrint').onclick=function(){window.print()};
  $('bExp').onclick=function(){
    try{
      var blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
      var a=document.createElement('a');a.href=URL.createObjectURL(blob);
      a.download='office-logbook-'+now.getFullYear()+'.json';document.body.appendChild(a);a.click();a.remove();
      toast('Backup downloaded');
    }catch(e){toast('Export not available here. Try Print instead.')}
  };
  $('bImp').onclick=function(){$('file').click()};
  $('file').addEventListener('change',function(){
    var f=this.files[0];if(!f)return;var r=new FileReader();
    r.onload=function(){try{var p=JSON.parse(r.result);
      if(!p||typeof p.days!=='object')throw 0;
      state.days=p.days;if(p.settings)Object.assign(state.settings,p.settings);
      save();fillSettings();render();toast('Logbook imported');
    }catch(e){toast('That file is not a valid logbook backup')}};
    r.readAsText(f);this.value='';
  });

  function fillSettings(){var s=state.settings;$('sName').value=s.name;$('sOrg').value=s.org;$('sTarget').value=s.target;$('sSat').checked=s.sat}
  load();fillSettings();render();
})();
