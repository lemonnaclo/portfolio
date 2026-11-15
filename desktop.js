(() => {
  'use strict';
  const { esc, loadData } = window.Portfolio;
  const byId = id => document.getElementById(id);
  const login = byId('login-screen'), desktop = byId('desktop-screen'), layer = byId('window-layer');
  const loginButton = byId('login-button'), startButton = byId('start-button'), startMenu = byId('start-menu');
  const mobile = window.matchMedia('(max-width:700px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const sessionKey = 'jun-ayoung-desktop:v1';
  const windows = new Map();
  let data, zIndex = 20, activeId = null, serial = 0;
  const categoryInfo = {
    'Stage Design':{color:'#ffbdce',label:'Stage Design'},
    'Production Design':{color:'#b7a7ff',label:'Production Design'},
    '3D':{color:'#8bcff6',label:'3D'},
    'VMD':{color:'#d7b8f8',label:'VMD'}
  };
  const uiIcons = window.PORTFOLIO_UI?.icons || {};
  const icon = (name='folder',color='#91acec',extra='',key=name) => {
    const source=uiIcons[key] || uiIcons[name] || './ui/icons/folder.png';
    const extraClass=/class="([^"]+)"/.exec(extra)?.[1] || '';
    return '<img class="ui-icon '+esc(extraClass)+'" src="'+esc(source)+'" alt="" aria-hidden="true" draggable="false">';
  };
  document.querySelectorAll('[data-ui-icon]').forEach(image=>{const source=uiIcons[image.dataset.uiIcon];if(source)image.src=source;});
  function announce(text) { byId('desktop-status').textContent = text; }
  function setSession(value) { try { if(value)sessionStorage.setItem(sessionKey,'1');else sessionStorage.removeItem(sessionKey); } catch {} }
  function hasSession() { try { return sessionStorage.getItem(sessionKey)==='1'; } catch { return false; } }
  function toggleStart(open) { const next = open ?? startMenu.hidden;startMenu.hidden=!next;startButton.setAttribute('aria-expanded',String(next));if(next)startMenu.querySelector('button')?.focus(); }
  function enterDesktop(instant=false) {
    loginButton.disabled=true;
    const finish=()=>{login.hidden=true;desktop.hidden=false;login.classList.remove('leaving');setSession(true);desktop.querySelector('button.desktop-shortcut')?.focus({preventScroll:true});announce('바탕화면이 열렸습니다. 폴더 또는 프로그램을 선택하세요.');};
    if(instant || reducedMotion)finish();else{login.classList.add('leaving');setTimeout(finish,230)}
  }
  function lockDesktop() { [...windows.keys()].forEach(closeWindow);toggleStart(false);desktop.hidden=true;login.hidden=false;login.classList.remove('leaving');loginButton.disabled=false;setSession(false);loginButton.focus();announce('로그인 화면으로 돌아왔습니다.'); }
  function setActive(state) {
    if(!state || !windows.has(state.id))return;
    state.el.hidden=false;state.el.style.zIndex=String(++zIndex);activeId=state.id;
    windows.forEach(item=>{item.el.dataset.focused=String(item.id===state.id);item.task.setAttribute('aria-pressed',String(item.id===state.id&&!item.el.hidden));});
  }
  function focusNext() { const visible=[...windows.values()].filter(item=>!item.el.hidden).sort((a,b)=>Number(b.el.style.zIndex)-Number(a.el.style.zIndex));if(visible[0])setActive(visible[0]);else{activeId=null;windows.forEach(item=>item.task.setAttribute('aria-pressed','false'))} }
  function minimizeWindow(id) { const state=windows.get(id);if(!state)return;state.el.hidden=true;state.task.setAttribute('aria-pressed','false');focusNext();announce(state.title+' 최소화'); }
  function closeWindow(id) { const state=windows.get(id);if(!state)return;state.observer?.disconnect();state.el.remove();state.task.remove();windows.delete(id);if(activeId===id)focusNext();announce(state.title+' 닫힘'); }
  function clampWindow(state) {
    if(mobile.matches || state.el.classList.contains('maximized'))return;
    const rect=state.el.getBoundingClientRect(),bounds=layer.getBoundingClientRect();
    state.el.style.left=Math.max(0,Math.min(rect.left-bounds.left,bounds.width-rect.width))+'px';
    state.el.style.top=Math.max(0,Math.min(rect.top-bounds.top,bounds.height-Math.min(rect.height,90)))+'px';
  }
  function maximizeWindow(state) { state.el.classList.toggle('maximized');const max=state.el.classList.contains('maximized');state.el.querySelector('.maximize').setAttribute('aria-label',state.title+(max?' 창 크기 복원':' 창 최대화'));setActive(state);if(!max)clampWindow(state); }
  function createWindow(id,title,kind,{width=900,height=620,iconName='folder',color='#91acec'}={}) {
    if(windows.has(id)){const existing=windows.get(id);setActive(existing);return existing;}
    const el=document.createElement('section');el.className='desk-window';el.dataset.windowId=id;el.dataset.focused='true';el.setAttribute('role','dialog');el.setAttribute('aria-label',title);el.tabIndex=-1;
    const bounds=layer.getBoundingClientRect();
    const w=Math.min(width,Math.max(340,bounds.width-(bounds.width>1180?310:40))),h=Math.min(height,Math.max(300,bounds.height-65));
    const offset=(serial++%5)*23;el.style.width=w+'px';el.style.height=h+'px';el.style.left=Math.max(12,Math.min(bounds.width-w-15,(bounds.width>1180?270:(bounds.width-w)/2)+offset))+'px';el.style.top=Math.max(10,Math.min(bounds.height-h-12,65+offset))+'px';
    el.innerHTML='<div class="window-titlebar">'+icon(iconName,color,'',title)+'<h2>'+esc(title)+'</h2><div class="window-controls"><button class="window-control minimize" type="button" aria-label="'+esc(title)+' 최소화">−</button><button class="window-control maximize" type="button" aria-label="'+esc(title)+' 창 최대화">□</button><button class="window-control close" type="button" aria-label="'+esc(title)+' 닫기">×</button></div></div><div class="window-body"></div>';
    const task=document.createElement('button');task.className='taskbar-app';task.type='button';task.setAttribute('aria-label',title+' 창 열기 또는 최소화');task.innerHTML=icon(iconName,color,'',title)+'<span>'+esc(title)+'</span>';
    byId('taskbar-apps').append(task);layer.append(el);
    const state={id,title,kind,el,task,body:el.querySelector('.window-body')};windows.set(id,state);
    task.addEventListener('click',()=>{if(!el.hidden&&activeId===id)minimizeWindow(id);else setActive(state)});
    el.addEventListener('pointerdown',()=>setActive(state));
    el.querySelector('.minimize').addEventListener('click',()=>minimizeWindow(id));
    el.querySelector('.maximize').addEventListener('click',()=>maximizeWindow(state));
    el.querySelector('.close').addEventListener('click',()=>closeWindow(id));
    const titlebar=el.querySelector('.window-titlebar');titlebar.addEventListener('dblclick',event=>{if(!event.target.closest('button')&&!mobile.matches)maximizeWindow(state)});
    titlebar.addEventListener('pointerdown',event=>{
      if(mobile.matches || event.button!==0 || event.target.closest('button') || el.classList.contains('maximized'))return;
      event.preventDefault();setActive(state);const rect=el.getBoundingClientRect(),bounds=layer.getBoundingClientRect();const dx=event.clientX-rect.left,dy=event.clientY-rect.top;
      titlebar.setPointerCapture(event.pointerId);
      const move=e=>{el.style.left=Math.max(0,Math.min(e.clientX-bounds.left-dx,bounds.width-el.offsetWidth))+'px';el.style.top=Math.max(0,Math.min(e.clientY-bounds.top-dy,bounds.height-42))+'px';};
      const finish=()=>{titlebar.removeEventListener('pointermove',move);titlebar.removeEventListener('pointerup',finish);titlebar.removeEventListener('pointercancel',finish)};
      titlebar.addEventListener('pointermove',move);titlebar.addEventListener('pointerup',finish);titlebar.addEventListener('pointercancel',finish);
    });
    if('ResizeObserver' in window){state.observer=new ResizeObserver(()=>clampWindow(state));state.observer.observe(el);}
    setActive(state);el.focus({preventScroll:true});announce(title+' 실행');return state;
  }
  function updateTitle(state,title) { state.title=title;state.el.setAttribute('aria-label',title);state.el.querySelector('.window-titlebar h2').textContent=title;state.task.querySelector('span').textContent=title;state.task.setAttribute('aria-label',title+' 창 열기 또는 최소화'); }
  function openFrame(id,title,url,{iconName='app',color='#a7bbf8',width=1060,height=740}={}) {
    const exists=windows.has(id);const state=createWindow(id,title,'frame',{iconName,color,width,height});if(exists)return;
    state.body.classList.add('frame-body');
    state.body.innerHTML='<div class="frame-loading"><div><span></span>불러오는 중…</div></div><iframe class="app-frame" title="'+esc(title)+'" allow="fullscreen; clipboard-write" allowfullscreen src="'+esc(url)+'"></iframe><a class="frame-fallback" href="'+esc(url.replace(/[?&]embedded=1/,''))+'" target="_blank" rel="noopener">새 탭에서 열기 ↗</a>';
    state.body.querySelector('iframe').addEventListener('load',()=>state.body.querySelector('.frame-loading').classList.add('hidden'));
  }
  function openProject(id) { const p=data.projects.find(item=>item.id===id);if(!p)return;openFrame('project-'+id,p.displayTitle,'./project.html?id='+encodeURIComponent(id)+'&embedded=1',{color:categoryInfo[p.category]?.color,width:1120,height:780});toggleStart(false); }
  function projectFile(project) {
    const image=project.thumbnail?'<img src="'+esc(project.thumbnail)+'" alt="" class="'+((project.thumbnailFit || project.imageFit)==='contain'?'contain':'')+'" loading="lazy" decoding="async">':'<span class="file-video-placeholder"><b>▷</b><span>VIDEO FILE</span></span>';
    return '<button class="project-file" type="button" data-open-project="'+esc(project.id)+'" aria-label="'+esc(project.displayTitle)+' 프로젝트 열기"><span class="project-file-thumbnail">'+image+'</span><strong>'+esc(project.displayTitle)+'</strong><small>'+esc(project.subtitle||project.category)+(project.year?' · '+esc(project.year):'')+'</small></button>';
  }
  function openExplorer(category='All') {
    const existed=windows.has('works');const state=createWindow('works',category==='All'?'Works.exe':category,'explorer',{width:1000,height:650,color:categoryInfo[category]?.color});
    if(!existed){
      state.body.innerHTML='<div class="explorer"><div class="explorer-toolbar"><button class="explorer-home" type="button" aria-label="전체 작업 폴더로">↑</button><div class="explorer-path"></div><input class="explorer-search" type="search" placeholder="이 폴더에서 검색" aria-label="작업 파일 검색" autocomplete="off"></div><div class="explorer-layout"><nav class="explorer-sidebar" aria-label="작업 폴더"><p class="sidebar-label">WORK FOLDERS</p>'+['All',...data.profile.categoryOrder].map(cat=>'<button class="sidebar-folder" type="button" data-folder="'+esc(cat)+'" aria-pressed="false">'+icon('folder',categoryInfo[cat]?.color,'',cat)+'<span>'+esc(cat==='All'?'All works':cat)+'</span></button>').join('')+'</nav><div class="explorer-main"><div class="explorer-heading"><h3></h3><p></p></div><div class="project-files"></div></div></div><div class="window-status"><span class="item-count"></span><span>파일을 클릭하여 열기</span></div></div>';
      state.body.querySelector('.explorer-home').addEventListener('click',()=>setExplorerFolder(state,'All'));
      state.body.querySelector('.explorer-sidebar').addEventListener('click',event=>{const button=event.target.closest('[data-folder]');if(button)setExplorerFolder(state,button.dataset.folder)});
      state.body.querySelector('.explorer-search').addEventListener('input',()=>renderFiles(state));
      state.body.querySelector('.project-files').addEventListener('click',event=>{const button=event.target.closest('[data-open-project]');if(button)openProject(button.dataset.openProject)});
    }
    setExplorerFolder(state,category);toggleStart(false);
  }
  function setExplorerFolder(state,category) {
    state.category=category;updateTitle(state,category==='All'?'Works.exe':category);state.body.querySelector('.explorer-search').value='';
    state.body.querySelector('.explorer-path').innerHTML='Desktop <span>›</span> '+(category==='All'?'Works':esc(category));
    state.body.querySelectorAll('[data-folder]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.folder===category)));
    state.body.querySelector('.explorer-heading h3').textContent=category==='All'?'All works':category;
    state.body.querySelector('.explorer-heading p').textContent=category==='Stage Design'?'MAIN WORKS':'';
    renderFiles(state);
  }
  function renderFiles(state) {
    const query=state.body.querySelector('.explorer-search').value.trim().toLocaleLowerCase();
    const items=data.projects.filter(p=>(state.category==='All'||p.category===state.category)&&[p.title,p.displayTitle,p.subtitle,p.category].join(' ').toLocaleLowerCase().includes(query));
    state.body.querySelector('.project-files').innerHTML=items.length?items.map(projectFile).join(''):'<p class="folder-empty">검색어에 맞는 파일이 없습니다.</p>';
    state.body.querySelector('.item-count').textContent=items.length+'개 항목';
  }
  async function copyEmail(button,status) {
    const email=data.profile.contact.email;
    try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(email);else{const field=document.createElement('textarea');field.value=email;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const copied=document.execCommand('copy');field.remove();if(!copied)throw Error('copy')};button.textContent='복사 완료';status.textContent='이메일 주소를 복사했습니다.';}catch{status.textContent=email}
  }
  function openContact() {
    const existed=windows.has('contact'),state=createWindow('contact','Contact.exe','contact',{width:650,height:440,iconName:'mail',color:'#f3b7d3'});if(existed)return;
    const contact=data.profile.contact;
    state.body.innerHTML='<div class="contact-program">'+icon('mail','#f3b7d3','class="mail-large"')+'<h3>Contact</h3><p>JUN AYOUNG / 전아영</p><div class="contact-email-row"><a class="address-link" href="mailto:'+esc(contact.email)+'">'+esc(contact.email)+' ↗</a><button class="retro-button copy-contact" type="button">이메일 복사</button></div><div class="contact-copy-status" role="status" aria-live="polite"></div><div class="contact-links"><a href="tel:'+esc(contact.phone.replace(/[^+\d]/g,''))+'">'+esc(contact.phone)+'</a>'+contact.links.map(link=>'<a href="'+esc(link.url)+'" target="_blank" rel="noopener noreferrer">'+esc(link.label)+' ↗</a>').join('')+'</div></div>';
    state.body.querySelector('.copy-contact').addEventListener('click',event=>copyEmail(event.currentTarget,state.body.querySelector('.contact-copy-status')));toggleStart(false);
  }
  function openReadme() {
    const state=createWindow('readme','Readme.txt','readme',{width:570,height:430,iconName:'document',color:'#839fe1'});
    state.body.innerHTML='<article class="readme-program"><h3>안녕하세요, 전아영입니다.</h3><p>'+esc(data.profile.heroDescription)+'</p><p>'+esc(data.profile.introLead)+'</p><small>'+esc(data.profile.introParagraphs[0])+'</small><ul><li>폴더를 열면 분야별 작업을 볼 수 있습니다.</li><li>작업 파일을 열면 원본 이미지와 설명이 표시됩니다.</li><li>창은 이동·최소화·최대화할 수 있습니다.</li></ul></article>';toggleStart(false);
  }
  function launch(app) { if(app==='profile')openFrame('profile','Profile.exe','./profile.html?embedded=1',{iconName:'user',color:'#b4a3eb',width:1100,height:740});else if(app==='contact')openContact();else if(app==='readme')openReadme();else openExplorer('All');toggleStart(false); }
  function shortcutMarkup({title,category,app,iconName,color}) { return '<button class="desktop-shortcut" type="button" '+(category?'data-open-folder="'+esc(category)+'"':'data-open-app="'+app+'"')+' aria-label="'+esc(title)+(category?' 폴더 열기':' 실행')+'">'+icon(iconName,color,'',category || iconName)+'<span class="shortcut-label">'+esc(title)+'</span></button>'; }
  function renderDesktop() {
    const folders=data.profile.categoryOrder.map(category=>({title:category,category,iconName:'folder',color:categoryInfo[category]?.color}));
    const apps=[{title:'Profile.exe',app:'profile',iconName:'user',color:'#b4a3eb'},{title:'Contact.exe',app:'contact',iconName:'mail',color:'#f0bad2'},{title:'Works.exe',app:'works',iconName:'app',color:'#89adee'},{title:'Readme.txt',app:'readme',iconName:'document',color:'#849fdb'}];
    byId('desktop-shortcuts').innerHTML=[...folders,...apps].map(shortcutMarkup).join('');
    byId('pinned-files').innerHTML=data.profile.featured.map(id=>data.projects.find(p=>p.id===id)).filter(Boolean).map(p=>'<button class="pinned-file" type="button" data-open-project="'+esc(p.id)+'" aria-label="'+esc(p.displayTitle)+' 주요 작업 열기"><span class="pinned-thumbnail"><img src="'+esc(p.thumbnail)+'" alt="" decoding="async"></span><strong>'+esc(p.displayTitle)+'</strong><small>.stage / '+esc(p.year||'')+'</small></button>').join('');
    byId('start-apps').innerHTML=[...folders,...apps.filter(app=>app.app!=='readme')].map(item=>'<button class="start-app" type="button" '+(item.category?'data-open-folder="'+esc(item.category)+'"':'data-open-app="'+item.app+'"')+'>'+icon(item.iconName,item.color,'',item.category || item.iconName)+'<span>'+esc(item.title)+'</span></button>').join('');
  }
  desktop.addEventListener('click',event=>{const folder=event.target.closest('[data-open-folder]'),app=event.target.closest('[data-open-app]'),project=event.target.closest('[data-open-project]');if(folder)openExplorer(folder.dataset.openFolder);else if(app)launch(app.dataset.openApp);else if(project&&!project.closest('.desk-window'))openProject(project.dataset.openProject)});
  loginButton.addEventListener('click',()=>{if(data)enterDesktop()});
  byId('lock-button').addEventListener('click',lockDesktop);byId('start-lock').addEventListener('click',lockDesktop);
  startButton.addEventListener('click',()=>toggleStart());
  byId('show-desktop').addEventListener('click',()=>{windows.forEach(state=>{state.el.hidden=true;state.task.setAttribute('aria-pressed','false')});activeId=null;toggleStart(false);announce('바탕화면 보기');});
  document.addEventListener('pointerdown',event=>{if(!startMenu.hidden&&!event.target.closest('#start-menu')&&!event.target.closest('#start-button'))toggleStart(false)});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!startMenu.hidden){toggleStart(false);startButton.focus()}else if(activeId&&!['INPUT','TEXTAREA'].includes(event.target.tagName))closeWindow(activeId)}});
  startMenu.addEventListener('keydown',event=>{if(!['ArrowDown','ArrowUp'].includes(event.key))return;const buttons=Array.from(startMenu.querySelectorAll('button'));const i=buttons.indexOf(document.activeElement);event.preventDefault();buttons[(i+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length].focus()});
  window.addEventListener('resize',()=>windows.forEach(clampWindow));
  function updateClock() { const now=new Date();const clock=byId('desktop-clock');clock.textContent=new Intl.DateTimeFormat('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false}).format(now);clock.dateTime=now.toISOString();clock.parentElement.title=new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(now); }
  updateClock();setInterval(updateClock,30000);
  loadData().then(value=>{data=value;byId('login-description').textContent=data.profile.heroDescription;renderDesktop();if(hasSession())enterDesktop(true)}).catch(error=>{byId('login-description').textContent='작업 자료를 읽지 못했습니다. 아래 작업 목록에서 다시 열어 주세요.';loginButton.disabled=true;console.error(error)});
})();
