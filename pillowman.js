(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 if(new URLSearchParams(location.search).get('embedded')==='1')document.documentElement.classList.add('is-embedded');
 const regions=JSON.parse($('region-data').textContent);
 function crop(region,index){
  const {page,x,y,w,h,label}=region;
  return `<button type="button" class="crop-button" data-art="${index}" aria-label="${label} 확대"><span class="crop" style="aspect-ratio:${w}/${h}"><img src="./projects/stage-pillowman/assets/authored-layout/page-${page}.png" alt="${label}" loading="lazy" decoding="async" style="width:${3200/w*100}%;left:${-x/w*100}%;top:${-y/h*100}%"></span></button>`;
 }
 document.querySelectorAll('[data-region]').forEach(target=>{const index=Number(target.dataset.region);target.outerHTML=crop(regions[index],index);});
 document.querySelectorAll('.crop-button[data-art]').forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.art);$('art-label').textContent=regions[index].label;$('art-target').innerHTML=crop(regions[index],index);$('art-target').classList.remove('enlarged');$('art-zoom').textContent='더 크게 보기';$('art-dialog').showModal();document.body.classList.add('modal-open');$('art-scroll').scrollTo(0,0);
 }));
 $('art-close').addEventListener('click',()=>$('art-dialog').close());$('art-dialog').addEventListener('close',()=>document.body.classList.remove('modal-open'));
 $('art-zoom').addEventListener('click',()=>{const large=$('art-target').classList.toggle('enlarged');$('art-zoom').textContent=large?'화면에 맞추기':'더 크게 보기';});
})();
