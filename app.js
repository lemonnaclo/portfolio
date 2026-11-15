(async () => {
  'use strict';
  const { esc, loadData, projectUrl, reveal } = window.Portfolio;
  try {
    const data = await loadData();
    const { profile, projects } = data;
    const profileRole = document.querySelector('.profile-role');
    if (profileRole) profileRole.textContent = profile.role;
    const heroDescription = document.getElementById('hero-description');
    if (heroDescription) heroDescription.textContent = profile.heroDescription;
    const introLead = document.getElementById('intro-lead');
    if (introLead) introLead.textContent = profile.introLead;
    const introCopy = document.getElementById('intro-copy');
    if (introCopy) introCopy.innerHTML = profile.introParagraphs.map(text => '<p>' + esc(text) + '</p>').join('');
    function imageMarkup(project, featured = false) {
      if (!project.thumbnail) return '<div class="art-placeholder"><span>' + esc(project.displayTitle) + '</span><small>' + esc(project.subtitle || project.category) + '</small><span class="play-mark" aria-hidden="true">▷</span></div>';
      return '<img src="' + esc(featured ? project.coverDisplayUrl || project.coverUrl || project.thumbnail : project.thumbnail) + '" alt="' + esc(project.displayTitle) + '" loading="lazy" decoding="async" class="' + ((featured ? project.imageFit : (project.thumbnailFit || project.imageFit)) === 'contain' ? 'contain' : '') + '">';
    }
    function featuredCard(project) {
      return '<article class="featured-card reveal"><a class="work-image" href="' + projectUrl(project) + '">' + imageMarkup(project, true) + '<span class="image-open" aria-hidden="true">↗</span></a><div class="work-caption"><div><p class="work-kind">' + esc(project.category) + (project.year ? ' · ' + esc(project.year) : '') + '</p><h3><a href="' + projectUrl(project) + '">' + esc(project.displayTitle) + '</a></h3><p class="work-summary">' + esc(project.subtitle || '') + '</p></div><a class="caption-arrow" href="' + projectUrl(project) + '" aria-label="' + esc(project.displayTitle) + ' 자세히 보기">↗</a></div></article>';
    }
    if (document.getElementById('archive-grid')) {
      document.getElementById('featured-grid').innerHTML = profile.featured.map(id => projects.find(item => item.id === id)).filter(Boolean).map(featuredCard).join('');
      const categories = ['All', ...(profile.categoryOrder || ['Stage Design', 'Production Design', '3D', 'VMD'])];
      const filters = document.getElementById('category-filters');
      const search = document.getElementById('project-search');
      const grid = document.getElementById('archive-grid');
      let selected = 'All';
      filters.innerHTML = categories.map(category => '<button type="button" class="filter" data-category="' + esc(category) + '" aria-pressed="' + String(category === 'All') + '">' + esc(category) + '<sup>' + (category === 'All' ? projects.length : projects.filter(item => item.category === category).length) + '</sup></button>').join('');
      document.getElementById('archive-total').textContent = String(projects.length).padStart(2, '0') + ' works';
      function renderArchive() {
        const query = search.value.trim().toLocaleLowerCase();
        const items = projects.filter(project => (selected === 'All' || project.category === selected) && [project.title, project.displayTitle, project.subtitle, project.category].join(' ').toLocaleLowerCase().includes(query));
        grid.innerHTML = items.map(project => '<article class="archive-card"><a class="archive-image" href="' + projectUrl(project) + '">' + imageMarkup(project) + '<span class="image-open" aria-hidden="true">↗</span></a><div class="archive-caption"><p>' + esc(project.category) + (project.year ? ' / ' + esc(project.year) : '') + '</p><h3><a href="' + projectUrl(project) + '">' + esc(project.displayTitle) + '</a></h3><p class="archive-subtitle">' + esc(project.subtitle || '') + '</p></div></article>').join('');
        document.getElementById('empty-state').hidden = items.length > 0;
        document.getElementById('result-count').textContent = items.length + '개의 작업';
      }
      filters.addEventListener('click', event => { const button = event.target.closest('button[data-category]'); if (!button) return; selected = button.dataset.category; filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button))); renderArchive(); });
      filters.addEventListener('keydown', event => {
        if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
        const buttons = Array.from(filters.querySelectorAll('button'));
        const index = buttons.indexOf(document.activeElement);
        if (index < 0) return;
        event.preventDefault(); buttons[(index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length].focus();
      });
      search.addEventListener('input', renderArchive);
      renderArchive();
    }
    if (document.getElementById('profile-timeline')) {
      const educationHistory = profile.educationHistory || [profile.education];
      const historyEvents = [
        ...educationHistory.map(item => ({...item, type:'education'})),
        ...profile.experience.map(item => ({...item, type:'experience'}))
      ];
      function eventDate(item) { return item.endDate || item.startDate || (item.period.match(/\d{4}\.\d{2}/g) || ['0000.00']).at(-1).replace('.', '-'); }
      function eventYear(item) { return (item.current ? item.startDate : eventDate(item)).slice(0,4); }
      function sortEvents(items) { return items.sort((a,b) => (b.current ? '9999-12' : eventDate(b)).localeCompare(a.current ? '9999-12' : eventDate(a))); }
      function timelineEntry(item) {
        const academic = item.type === 'education';
        return '<article class="timeline-entry"><span class="timeline-entry-type">' + (academic?'학력':'경력') + '</span><p class="timeline-period">' + esc(item.period) + (item.current?'<span class="current-mark">현재</span>':'') + '</p><h4>' + esc(academic?item.school:item.company) + '</h4><p class="timeline-role">' + esc(academic?[item.major,item.degree].filter(Boolean).join(' · '):item.role) + '</p>' + (!academic && item.description?'<p class="timeline-description">'+esc(item.description)+'</p>':'') + '</article>';
      }
      const years = [...new Set(historyEvents.map(eventYear))].sort((a,b)=>b.localeCompare(a));
      document.getElementById('profile-timeline').innerHTML = years.map(year => {
        const entries = historyEvents.filter(item=>eventYear(item)===year);
        return '<li class="timeline-row"><div class="timeline-axis"><h3>'+esc(year)+'</h3><span aria-hidden="true"></span></div><div class="timeline-education">'+sortEvents(entries.filter(item=>item.type==='education')).map(timelineEntry).join('')+'</div><div class="timeline-experience">'+sortEvents(entries.filter(item=>item.type==='experience')).map(timelineEntry).join('')+'</div></li>';
      }).join('');
      const toolNames = [...new Set(profile.toolGroups.flatMap(group => group.items))];
      document.getElementById('tool-groups').innerHTML = '<ul class="tool-strip">' + toolNames.map(name=>'<li class="tool-item"><span class="tool-icon">'+(profile.toolIcons?.[name]?'<img src="'+esc(profile.toolIcons[name])+'" alt="" loading="lazy" decoding="async">':'<span>'+esc(name.slice(0,2))+'</span>')+'</span><span class="tool-name">'+esc(name)+'</span></li>').join('')+'</ul>';
    }
    if (document.getElementById('contact-email')) {
      const email = profile.contact.email;
      const emailLink = document.getElementById('contact-email');
      emailLink.href = 'mailto:' + email;
      emailLink.innerHTML = esc(email) + ' <span aria-hidden="true">↗</span>';
      document.getElementById('contact-links').innerHTML = '<a href="tel:' + esc(profile.contact.phone.replace(/[^+\d]/g, '')) + '">' + esc(profile.contact.phone) + '</a>' + profile.contact.links.map(link => '<a href="' + esc(link.url) + '" target="_blank" rel="noopener noreferrer">' + esc(link.label) + ' ↗</a>').join('');
      document.getElementById('copy-email').addEventListener('click', async event => {
        const copyButton = event.currentTarget;
        try {
          if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(email);
          else { const field = document.createElement('textarea'); field.value=email; field.style.position='fixed'; field.style.opacity='0'; document.body.append(field); field.select(); const copied=document.execCommand('copy'); field.remove(); if(!copied) throw Error('copy'); }
          document.getElementById('copy-status').textContent='이메일 주소를 복사했습니다.'; copyButton.textContent='복사 완료';
        } catch { document.getElementById('copy-status').textContent='이메일 주소: ' + email; }
      });
    }
    reveal();
  } catch (error) {
    const errorTarget = document.getElementById('archive-grid') || document.getElementById('main');
    if (errorTarget) errorTarget.insertAdjacentHTML('beforeend', '<p class="container error">내용을 읽지 못했습니다. 페이지를 새로고침해 주세요.</p>');
    console.error(error);
  }
})();
