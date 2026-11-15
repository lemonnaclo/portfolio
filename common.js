(() => {
  'use strict';
  const embedded = new URLSearchParams(location.search).get('embedded') === '1';
  if (embedded) document.documentElement.classList.add('is-embedded');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let dataPromise;
  function loadData() {
    if (!dataPromise) {
      dataPromise = location.protocol === 'file:'
        ? Promise.resolve(window.PORTFOLIO_DATA)
        : fetch('./data/content.json').then(response => { if (!response.ok) throw Error('content'); return response.json(); }).catch(() => window.PORTFOLIO_DATA);
    }
    return dataPromise.then(data => { if (!data) throw Error('콘텐츠를 읽지 못했습니다.'); return data; });
  }
  function assetUrl(project, filename) {
    return './projects/' + encodeURIComponent(project.id) + '/assets/' + filename.split('/').map(encodeURIComponent).join('/');
  }
  function projectUrl(project) { return './project.html?id=' + encodeURIComponent(project.id) + (embedded ? '&embedded=1' : ''); }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealObserver;
  function reveal(root = document) {
    const elements = root.querySelectorAll('.reveal:not(.is-visible)');
    if (reduceMotion || !('IntersectionObserver' in window)) { elements.forEach(item => item.classList.add('is-visible')); return; }
    if (!revealObserver) revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: .06, rootMargin: '0px 0px 30px 0px' });
    document.documentElement.classList.add('has-reveal');
    elements.forEach(item => revealObserver.observe(item));
  }
  window.Portfolio = { esc, loadData, assetUrl, projectUrl, reveal };
  document.getElementById('current-year')?.replaceChildren(String(new Date().getFullYear()));
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const closeMenu = () => { menuButton?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('is-open'); };
  menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); nav?.classList.toggle('is-open', open); });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  let queued = false;
  const updateScroll = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (height > 0 ? Math.min(1, window.scrollY / height) : 0) + ')';
    queued = false;
  };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } }, {passive:true});
  window.addEventListener('resize', updateScroll);
  updateScroll();
})();
