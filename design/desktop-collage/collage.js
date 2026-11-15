(() => {
 'use strict';
 const $=s=>document.querySelector(s),screens=['login','boot','desktop','thumbnails'];
 const stage=[{title:'필로우맨',id:'stage-pillowman',year:'2024'},{title:'살아있는 이중생 각하',id:'stage-living-double-life',year:'2022'},{title:'당신을 기다리고 있어',id:'stage-waiting-for-you',year:'2021'}].map(p=>({...p,candidate:'thumbs/'+p.id+'.jpg',reason:'무대 디자인'}));
 const windows=new Map();let z=10,timer;
 function show(name){clearInterval(timer);clearTimeout(timer);screens.forEach(s=>$('#'+s).hidden=s!==name);document.querySelectorAll('[data-screen]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.screen===name)));if(name==='boot')setProgress(64);}
 function setProgress(n){$('#boot-progress').style.width=n+'%';$('#boot-percent').textContent=n+'%';$('#boot-label').textContent=n===100?'Workspace ready':'Preparing your desktop';}
 function start(){show('boot');let p=0;setProgress(0);if(matchMedia('(prefers-reduced-motion:reduce)').matches){setProgress(100);timer=setTimeout(()=>show('desktop'),450);return;}timer=setInterval(()=>{p+=4;setProgress(p);if(p>=100){clearInterval(timer);timer=setTimeout(()=>show('desktop'),350)}},105);}
 document.querySelectorAll('[data-screen]').forEach(b=>b.onclick=()=>show(b.dataset.screen));$('#enter').onclick=start;$('#skip').onclick=()=>show('desktop');$('#lock').onclick=()=>show('login');
 const entries=[['Stage Design','stage','Stage Design'],['Production Design','production','Production Design'],['3D','3d','3D'],['VMD','vmd','VMD'],['Profile.exe','profile','Profile'],['Contact.exe','contact','Contact'],['Works.exe','works','All'],['Readme.txt','readme','Readme']];
 $('.shortcuts').innerHTML=entries.map(([name,icon,folder])=>`<button class="shortcut" data-folder="${folder}" aria-label="${name} 열기"><img src="./ui/icons/${icon}.png" alt=""><span>${name}</span></button>`).join('');
 const modal=$('.image-preview');
 function preview(p){$('#preview-title').textContent=p.title;$('#preview-image').src='./'+p.candidate;$('#preview-image').alt=p.title;modal.showModal();}
 $('#preview-close').onclick=()=>modal.close();
 function focus(w){windows.forEach(state=>{state.el.dataset.active=String(state===w);state.task.setAttribute('aria-pressed',String(state===w&&!state.el.hidden));});w.el.style.zIndex=++z;}
 function focusNext(){const next=[...windows.values()].filter(w=>!w.el.hidden).sort((a,b)=>Number(b.el.style.zIndex)-Number(a.el.style.zIndex))[0];if(next)focus(next);}
 function drag(bar,el){bar.addEventListener('pointerdown',event=>{if(innerWidth<=700||event.button!==0||event.target.closest('button')||el.classList.contains('maximized'))return;event.preventDefault();const rect=el.getBoundingClientRect(),bounds=$('#desktop').getBoundingClientRect(),dx=event.clientX-rect.left,dy=event.clientY-rect.top;bar.setPointerCapture(event.pointerId);const move=e=>{el.style.left=Math.max(0,Math.min(innerWidth-el.offsetWidth,e.clientX-dx))+'px';el.style.top=Math.max(40,Math.min(bounds.height-85,e.clientY-bounds.top-dy))+'px';el.style.right='auto';};const finish=()=>{bar.removeEventListener('pointermove',move);bar.removeEventListener('pointerup',finish);bar.removeEventListener('pointercancel',finish)};bar.addEventListener('pointermove',move);bar.addEventListener('pointerup',finish);bar.addEventListener('pointercancel',finish);});}
 function openStage(p,index){
  if(windows.has(p.id)){const old=windows.get(p.id);old.el.hidden=false;focus(old);return old;}
  const el=document.createElement('section');el.className='os-window stage-window';el.dataset.index=index;el.style.setProperty('--photo-frame',`url('./ui/images/${p.id}-frame.png')`);el.setAttribute('role','dialog');el.setAttribute('aria-label',p.title+' 작업 창');
  el.innerHTML=`<div class="titlebar"><img src="./ui/icons/stage.png" alt=""><h2>${p.title}</h2><div class="controls"><button class="photo-minimize" aria-label="${p.title} 최소화"><img src="./ui/images/control-minimize.png" alt=""></button><button class="photo-maximize" aria-label="${p.title} 최대화"><img src="./ui/images/control-maximize.png" alt=""></button><button class="photo-close" aria-label="${p.title} 닫기"><img src="./ui/images/control-close.png" alt=""></button></div></div><button class="photo-open" aria-label="${p.title} 작업 보기"><img src="./${p.candidate}" alt="${p.title} 무대 디자인"></button><div class="stage-caption"><strong>${p.title}</strong><span aria-hidden="true">↗</span></div><div class="stage-meta"><span>STAGE DESIGN</span><span>${p.year}</span></div>`;
  const task=document.createElement('button');task.className='photo-task';task.setAttribute('aria-label',p.title+' 창 열기 또는 최소화');task.innerHTML=`<img src="./ui/icons/stage.png" alt=""><span>${p.title}</span>`;
  $('#photo-window-layer').append(el);$('#photo-tasks').append(task);const state={el,task,p};windows.set(p.id,state);
  el.addEventListener('pointerdown',()=>focus(state));el.querySelector('.photo-open').onclick=()=>preview(p);
  el.querySelector('.photo-minimize').onclick=()=>{el.hidden=true;task.setAttribute('aria-pressed','false');focusNext();};
  el.querySelector('.photo-close').onclick=()=>{el.remove();task.remove();windows.delete(p.id);focusNext();};
  el.querySelector('.photo-maximize').onclick=()=>{el.classList.toggle('maximized');el.querySelector('.photo-maximize').setAttribute('aria-label',p.title+(el.classList.contains('maximized')?' 크기 복원':' 최대화'));focus(state);};
  task.onclick=()=>{if(!el.hidden&&el.dataset.active==='true'){el.hidden=true;task.setAttribute('aria-pressed','false');focusNext();}else{el.hidden=false;focus(state);}};
  drag(el.querySelector('.titlebar'),el);focus(state);return state;
 }
 function openAllStage(){stage.forEach(openStage);focus(windows.get(stage[0].id));}
 function fileMarkup(p){return `<button class="work-file" data-project="${p.id}"><span class="file-art"><img src="./${p.candidate}" alt="${p.title}"></span><strong>${p.title}</strong><small>${p.year||p.reason}</small></button>`;}
 function openFolder(folder){
  if(folder==='Stage Design'){openAllStage();return;}
  const win=$('#featured-window');win.hidden=false;win.style.zIndex=++z;$('#folder-title').textContent=folder;$('#folder-path').textContent='Desktop / '+folder;
  let list=stage;if(folder==='Production Design')list=PROPOSALS.filter(p=>p.id.startsWith('production'));else if(folder==='3D')list=PROPOSALS.filter(p=>p.id.startsWith('3d'));else if(folder==='VMD')list=PROPOSALS.filter(p=>p.id.startsWith('vmd'));else if(folder==='All')list=[...stage,...PROPOSALS];
  if(folder==='Contact'||folder==='Profile'||folder==='Readme'){$('#files').innerHTML='<div style="grid-column:1/-1;padding:12px"><p style="font-size:22px">JUN AYOUNG</p><p style="margin-top:15px;color:#8a83a1">공간 디자인 · 콘텐츠 기획</p><p style="margin-top:20px">lemonnaclo@gmail.com</p><p style="color:#9b96ad;margin-top:10px">로그인·부팅·팝업 외형을 확인하는 적용 전 시안입니다.</p></div>';$('#folder-count').textContent='Preview';return;}
  $('#files').innerHTML=list.map(fileMarkup).join('');$('#folder-count').textContent=list.length+' projects';
 }
 $('.shortcuts').onclick=e=>{const b=e.target.closest('[data-folder]');if(b)openFolder(b.dataset.folder)};
 $('#restore').onclick=()=>{if($('#featured-window').hidden)openFolder('All');else $('#featured-window').hidden=true;};$('.start').onclick=()=>openFolder('All');$('#close').onclick=$('#minimize').onclick=()=>$('#featured-window').hidden=true;$('#maximize').onclick=()=>$('#featured-window').classList.toggle('maximized');
 $('#files').onclick=e=>{const b=e.target.closest('[data-project]');if(!b)return;const p=[...stage,...PROPOSALS].find(x=>x.id===b.dataset.project);if(stage.some(s=>s.id===p.id))openStage(p,stage.findIndex(s=>s.id===p.id));else preview(p);};
 $('#featured-window').addEventListener('pointerdown',()=>$('#featured-window').style.zIndex=++z);drag($('#featured-window .titlebar'),$('#featured-window'));
 $('#comparisons').innerHTML=PROPOSALS.map(p=>`<article class="comparison"><h2>${String(p.number).padStart(2,'0')}　${p.title}</h2><div><figure><img src="./${p.before}" alt="현재 ${p.title}"><figcaption>현재</figcaption></figure><figure><img src="./${p.candidate}" alt="추천 ${p.title}"><figcaption><b>추천 후보</b></figcaption></figure></div><p>${p.reason}</p></article>`).join('');
 const updateClock=()=>$('.taskbar time').textContent=new Intl.DateTimeFormat('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());updateClock();setInterval(updateClock,30000);
 openAllStage();const initial=new URLSearchParams(location.search).get('screen');show(screens.includes(initial)?initial:'login');
})();
