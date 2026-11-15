(() => {
 'use strict';
 const scriptURL=new URL(document.currentScript.src),uiRoot=new URL('./',scriptURL),siteRoot=new URL('../../',scriptURL);
 const asset=p=>new URL(p,uiRoot).href,site=p=>new URL(p,siteRoot).href;
 const $=selector=>document.querySelector(selector);
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const data=window.PORTFOLIO_DATA;
 if(!data?.projects?.length){$('#enter').disabled=true;$('.welcome>span').textContent='작업 자료를 불러오지 못했습니다. 새로고침해 주세요.';return;}
 const screens=['login','boot','desktop'],windows=new Map(),mobile=matchMedia('(max-width:700px)');
 const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)').matches;
 let timer,z=10,active=null,folder='All',serial=0;
 const uiIcon=(name,extra='')=>`<img class="${esc(extra)}" src="${asset('ui/icons/'+name+'.png')}" alt="" draggable="false">`;
 const announce=text=>{$('#desktop-status').textContent=text;};
 const projectName=p=>p.displayTitle||p.title;
 const stage=data.profile.featured.map(id=>data.projects.find(p=>p.id===id)).filter(Boolean);
 const folderWindow=$('#featured-window'),folderTask=$('#restore');
 const stageIcon='stage';
 function clearBoot(){clearInterval(timer);clearTimeout(timer);}
 function show(name){clearBoot();screens.forEach(s=>$('#'+s).hidden=s!==name);if(name==='desktop'){openAllStage();announce('바탕화면이 열렸습니다. 폴더와 작업을 선택하세요.');}}
 function setProgress(n){$('#boot-progress').style.width=n+'%';$('#boot-percent').textContent=n+'%';$('#boot-label').textContent=n===100?'Workspace ready':'Preparing your desktop';}
 function start(){show('boot');let p=0;setProgress(0);if(reducedMotion){show('desktop');return;}timer=setInterval(()=>{p+=4;setProgress(p);if(p>=100){clearInterval(timer);timer=setTimeout(()=>show('desktop'),180);}},65);}
 $('#enter').addEventListener('click',start);$('#skip').addEventListener('click',()=>show('desktop'));
 $('#lock').addEventListener('click',()=>{[...windows.keys()].forEach(closeWindow);folderWindow.hidden=true;folderTask.setAttribute('aria-pressed','false');show('login');$('#enter').focus();});
 const categoryIcons={'Stage Design':'stage','Production Design':'production','3D':'3d','VMD':'vmd'};
 const entries=[...data.profile.categoryOrder.map(c=>[c,categoryIcons[c]||'folder',c]),['Profile.exe','profile','Profile'],['Contact.exe','contact','Contact'],['Works.exe','works','All'],['Readme.txt','readme','Readme']];
 $('.shortcuts').innerHTML=entries.map(([name,icon,destination])=>`<button class="shortcut" data-folder="${esc(destination)}" aria-label="${esc(name)} 열기">${uiIcon(icon)}<span>${esc(name)}</span></button>`).join('');
 $('.shortcuts').addEventListener('click',event=>{const button=event.target.closest('[data-folder]');if(button)openFolder(button.dataset.folder);});
 function focus(state){
  state.el.hidden=false;active=state.id;state.el.style.zIndex=String(++z);
  windows.forEach(w=>{w.el.dataset.active=String(w===state);w.task.setAttribute('aria-pressed',String(w===state&&!w.el.hidden));});
  folderWindow.dataset.active='false';folderTask.setAttribute('aria-pressed','false');
 }
 function focusFolder(){active='folder';folderWindow.style.zIndex=String(++z);folderWindow.dataset.active='true';folderTask.setAttribute('aria-pressed','true');windows.forEach(w=>{w.el.dataset.active='false';w.task.setAttribute('aria-pressed','false');});}
 function focusNext(){const next=[...windows.values()].filter(w=>!w.el.hidden).sort((a,b)=>Number(b.el.style.zIndex)-Number(a.el.style.zIndex))[0];if(next)focus(next);else if(!folderWindow.hidden)focusFolder();else active=null;}
 function minimize(state){state.el.hidden=true;state.task.setAttribute('aria-pressed','false');focusNext();announce(state.title+' 최소화');}
 function closeWindow(id){const state=windows.get(id);if(!state)return;state.el.remove();state.task.remove();windows.delete(id);if(active===id)focusNext();announce(state.title+' 닫힘');}
 function maximize(state){state.el.classList.toggle('maximized');state.el.querySelector('[data-control="maximize"]').setAttribute('aria-label',state.title+(state.el.classList.contains('maximized')?' 크기 복원':' 최대화'));focus(state);}
 function controls(title){return `<div class="controls"><button data-control="minimize" aria-label="${esc(title)} 최소화"><img src="${asset('ui/images/control-minimize.png')}" alt=""></button><button class="photo-maximize" data-control="maximize" aria-label="${esc(title)} 최대화"><img src="${asset('ui/images/control-maximize.png')}" alt=""></button><button data-control="close" aria-label="${esc(title)} 닫기"><img src="${asset('ui/images/control-close.png')}" alt=""></button></div>`;}
 function drag(bar,el){bar.addEventListener('pointerdown',event=>{
  if(mobile.matches||event.button!==0||event.target.closest('button')||el.classList.contains('maximized'))return;
  event.preventDefault();const rect=el.getBoundingClientRect(),bounds=$('#desktop').getBoundingClientRect(),dx=event.clientX-rect.left,dy=event.clientY-rect.top;bar.setPointerCapture(event.pointerId);
  const move=e=>{el.style.left=Math.max(0,Math.min(innerWidth-el.offsetWidth,e.clientX-dx))+'px';el.style.top=Math.max(39,Math.min(bounds.height-80,e.clientY-bounds.top-dy))+'px';el.style.right='auto';};
  const finish=()=>{bar.removeEventListener('pointermove',move);bar.removeEventListener('pointerup',finish);bar.removeEventListener('pointercancel',finish);};
  bar.addEventListener('pointermove',move);bar.addEventListener('pointerup',finish);bar.addEventListener('pointercancel',finish);
 });}
 function registerWindow(id,title,el,icon){
  const task=document.createElement('button');task.className='photo-task';task.type='button';task.setAttribute('aria-label',title+' 창 열기 또는 최소화');task.innerHTML=uiIcon(icon)+`<span>${esc(title)}</span>`;
  $('#photo-window-layer').append(el);$('#photo-tasks').append(task);
  const state={id,title,el,task};windows.set(id,state);el.tabIndex=-1;
  el.addEventListener('pointerdown',()=>focus(state));
  el.querySelector('[data-control="minimize"]').addEventListener('click',()=>minimize(state));
  el.querySelector('[data-control="maximize"]').addEventListener('click',()=>maximize(state));
  el.querySelector('[data-control="close"]').addEventListener('click',()=>closeWindow(id));
  task.addEventListener('click',()=>{if(!el.hidden&&active===id)minimize(state);else focus(state);});
  drag(el.querySelector('.titlebar'),el);focus(state);return state;
 }
 function openStage(p,index){
  if(windows.has(p.id)){const old=windows.get(p.id);focus(old);return old;}
  const title=projectName(p),el=document.createElement('section');el.className='os-window stage-window';el.dataset.index=index;
  el.style.setProperty('--photo-frame',`url('${asset('ui/images/'+p.id+'-frame.png')}')`);el.setAttribute('role','dialog');el.setAttribute('aria-label',title+' 작업 창');
  const image=p.coverDisplayUrl||p.coverUrl||p.thumbnail;
  el.innerHTML=`<div class="titlebar">${uiIcon(stageIcon)}<h2>${esc(title)}</h2>${controls(title)}</div><button class="photo-open" aria-label="${esc(title)} 작업 보기"><img src="${site(image)}" alt="${esc(title)} 무대 디자인"></button><div class="stage-caption"><strong>${esc(title)}</strong><span aria-hidden="true">↗</span></div><div class="stage-meta"><span>STAGE DESIGN</span><span>${esc(p.year||'')}</span></div>`;
  const state=registerWindow(p.id,title,el,stageIcon);el.querySelector('.photo-open').addEventListener('click',()=>openProject(p));return state;
 }
 function openAllStage(){stage.forEach(openStage);if(stage[0])focus(windows.get(stage[0].id));}
 function createApp(id,title,icon){
  if(windows.has(id)){focus(windows.get(id));return null;}
  const el=document.createElement('section');el.className='os-window app-window';el.setAttribute('role','dialog');el.setAttribute('aria-label',title);
  el.style.left=Math.max(12,Math.min(innerWidth-360,innerWidth>1000?240:24)+(serial++%3)*18)+'px';el.style.top=(70+(serial%3)*18)+'px';
  el.innerHTML=`<div class="titlebar">${uiIcon(icon)}<h2>${esc(title)}</h2>${controls(title)}</div><div class="app-content"></div>`;
  return registerWindow(id,title,el,icon);
 }
 function openFrame(id,title,relative,icon='works'){
  const state=createApp(id,title,icon);if(!state)return;
  const body=state.el.querySelector('.app-content');body.classList.add('frame-content');
  body.innerHTML=`<div class="frame-progress">불러오는 중…</div><iframe title="${esc(title)}" src="${site(relative)}" allow="fullscreen; clipboard-write" allowfullscreen></iframe>`;
  body.querySelector('iframe').addEventListener('load',()=>body.querySelector('.frame-progress')?.remove());state.el.focus({preventScroll:true});
 }
 function openProject(p){openFrame('project-'+p.id,projectName(p),'project.html?id='+encodeURIComponent(p.id)+'&embedded=1',categoryIcons[p.category]||'works');}
 function readme(){
  const state=createApp('readme','Readme.txt','readme');if(!state)return;
  state.el.classList.add('readme-window');state.el.querySelector('.app-content').innerHTML=`<article class="desktop-readme"><p class="small-label">JUN AYOUNG</p><h2>안녕하세요, 전아영입니다.</h2><p>${esc(data.profile.heroDescription)}</p><p>${esc(data.profile.introParagraphs[0])}</p><small>폴더를 열어 분야별 작업을, 사진 창을 눌러 작업의 자세한 내용을 볼 수 있습니다.</small></article>`;
 }
 function fileMarkup(p){const name=projectName(p),fit=p.thumbnailFit||p.imageFit;return `<button class="work-file" data-project="${esc(p.id)}" aria-label="${esc(name)} 프로젝트 열기"><span class="file-art">${p.thumbnail?`<img class="${fit==='contain'?'contain':''}" src="${site(p.thumbnail)}" alt="" loading="lazy" decoding="async">`:'<span class="file-empty">▷</span>'}</span><strong>${esc(name)}</strong><small>${esc(p.subtitle||p.category)}${p.year?' · '+esc(p.year):''}</small></button>`;}
 function renderFolder(){
  const query=$('#folder-search').value.trim().toLocaleLowerCase();
  const list=data.projects.filter(p=>(folder==='All'||p.category===folder)&&[p.title,p.displayTitle,p.subtitle,p.category].join(' ').toLocaleLowerCase().includes(query));
  $('#files').innerHTML=list.length?list.map(fileMarkup).join(''):'<p class="folder-empty">검색어에 맞는 작업이 없습니다.</p>';
  $('#folder-count').textContent=list.length+' projects';
 }
 function openFolder(name){
  if(name==='Stage Design'){openAllStage();return;}
  if(name==='Profile'){openFrame('profile','Profile.exe','profile.html?embedded=1','profile');return;}
  if(name==='Contact'){openFrame('contact','Contact.exe','contact.html?embedded=1','contact');return;}
  if(name==='Readme'){readme();return;}
  folder=name;folderWindow.hidden=false;focusFolder();
  $('#folder-title').textContent=name==='All'?'Works.exe':name;$('#folder-path').textContent='Desktop / '+(name==='All'?'All works':name);
  $('#folder-search').value='';document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===folder)));renderFolder();
 }
 $('#folder-filters').innerHTML=['All',...data.profile.categoryOrder].map(c=>`<button type="button" data-filter="${esc(c)}" aria-pressed="${c==='All'}">${esc(c==='All'?'All works':c)}</button>`).join('');
 $('#folder-filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;if(b.dataset.filter==='Stage Design'){folder='Stage Design';$('#folder-title').textContent='Stage Design';$('#folder-path').textContent='Desktop / Stage Design';$('#folder-search').value='';document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderFolder();}else openFolder(b.dataset.filter);});
 $('#folder-search').addEventListener('input',renderFolder);
 $('#files').addEventListener('click',e=>{const button=e.target.closest('[data-project]');if(!button)return;const p=data.projects.find(x=>x.id===button.dataset.project);if(p)openProject(p);});
 folderTask.addEventListener('click',()=>{if(!folderWindow.hidden&&active==='folder'){folderWindow.hidden=true;folderTask.setAttribute('aria-pressed','false');focusNext();}else openFolder('All');});
 $('.start').addEventListener('click',()=>openFolder('All'));
 const hideFolder=()=>{folderWindow.hidden=true;folderTask.setAttribute('aria-pressed','false');focusNext();};$('#close').addEventListener('click',hideFolder);$('#minimize').addEventListener('click',hideFolder);
 $('#maximize').addEventListener('click',()=>{folderWindow.classList.toggle('maximized');focusFolder();});folderWindow.addEventListener('pointerdown',focusFolder);drag(folderWindow.querySelector('.titlebar'),folderWindow);
 document.addEventListener('keydown',e=>{if(e.key!=='Escape'||['INPUT','TEXTAREA'].includes(e.target.tagName))return;if(active==='folder')hideFolder();else if(active)closeWindow(active);});
 const updateClock=()=>{const now=new Date(),clock=$('.taskbar time');clock.textContent=new Intl.DateTimeFormat('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false}).format(now);clock.dateTime=now.toISOString();clock.title=new Intl.DateTimeFormat('ko-KR',{dateStyle:'full'}).format(now);};updateClock();setInterval(updateClock,30000);
 show('login');
})();
