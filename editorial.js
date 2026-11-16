(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  if(new URLSearchParams(location.search).get('embedded')==='1') document.documentElement.classList.add('is-embedded');
  const regions=JSON.parse($('region-data').textContent);
  function crop(r){return `<span class="crop" style="aspect-ratio:${r.w}/${r.h}"><img src="${esc(r.src)}" alt="${esc(r.label)}" decoding="async" style="width:${r.sw/r.w*100}%;left:${-r.x/r.w*100}%;top:${-r.y/r.h*100}%"></span>`;}
  document.querySelectorAll('.crop-button[data-art]').forEach(button=>button.addEventListener('click',()=>{
    const r=regions[Number(button.dataset.art)];
    $('art-label').textContent=r.label;
    $('art-target').innerHTML=crop(r);
    $('art-target').classList.remove('enlarged');
    $('art-zoom').textContent='더 크게 보기';
    $('art-zoom').setAttribute('aria-pressed','false');
    $('art-dialog').showModal();
    document.body.classList.add('modal-open');
    $('art-scroll').scrollTo(0,0);
  }));
  $('art-close').addEventListener('click',()=>$('art-dialog').close());
  $('art-dialog').addEventListener('close',()=>document.body.classList.remove('modal-open'));
  $('art-zoom').addEventListener('click',()=>{
    const large=$('art-target').classList.toggle('enlarged');
    $('art-zoom').textContent=large?'화면에 맞추기':'더 크게 보기';
    $('art-zoom').setAttribute('aria-pressed',String(large));
  });
})();
