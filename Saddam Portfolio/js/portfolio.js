const tabs=[...document.querySelectorAll('.tab')],bg=document.querySelector('.pill-bg'),cards=[...document.querySelectorAll('.pcard')];
const dlg=document.getElementById('lb');
function moveBg(){const t=tabs.find(x=>x.getAttribute('aria-selected')==='true');bg.style.left=t.offsetLeft+'px';bg.style.width=t.offsetWidth+'px'}
function filter(cat){let n=0;cards.forEach(c=>{const show=c.dataset.cat===cat;c.hidden=!show;if(show){c.classList.remove('in');c.style.setProperty('--d',(n++*.08)+'s')}});
requestAnimationFrame(()=>requestAnimationFrame(()=>cards.forEach(c=>{if(!c.hidden)c.classList.add('in')})))}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>{tabs.forEach(x=>x.setAttribute('aria-selected',x===t));moveBg();filter(t.dataset.cat)});
t.addEventListener('keydown',e=>{const j={ArrowRight:1,ArrowLeft:-1}[e.key];if(j){const n=tabs[(i+j+tabs.length)%tabs.length];n.focus();n.click()}})});
addEventListener('resize',moveBg);
if(document.fonts)document.fonts.ready.then(moveBg);
moveBg();filter(tabs[0].dataset.cat);
cards.forEach(c=>c.addEventListener('click',()=>{
const d=c.dataset,img=document.getElementById('lbimg');
img.style.background=c.querySelector('.thumb').style.background;
img.innerHTML=c.querySelector('.thumb svg').outerHTML;
document.getElementById('lbbadge').hidden=!!d.doc;
document.getElementById('lbcat').textContent=d.cat;
document.getElementById('lbtitle').textContent=c.querySelector('b').textContent;
document.getElementById('lbdesc').textContent=d.long;
const dn=document.getElementById('lbdoc');
dn.innerHTML='';dn.className='';
if(d.doc){const a=document.createElement('a');a.className='btn fill';a.href=d.doc;a.target='_blank';a.rel='noopener';a.textContent='View document';dn.append(a)}
else{dn.className='docnote';dn.textContent='No document has been added yet. This is placeholder material, not my actual work.'}
dlg.showModal()}));
document.querySelector('.lbclose').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
