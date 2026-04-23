// Accordion

document.querySelectorAll('.guide-header').forEach(h=>{
  h.addEventListener('click',()=>h.closest('.guide-card').classList.toggle('open'));
});

// Quick links

document.querySelectorAll('.quick-link-card').forEach(card=>{
  card.addEventListener('click',()=>{
    const href=card.dataset.href;
    const tgt=card.dataset.target;
    if(href) location.href=href;
    else if(tgt) document.getElementById(tgt)?.scrollIntoView({behavior:'smooth'});
  });
});

// Theme toggle
const t=document.getElementById('theme-toggle');
if(t) t.onclick=()=>document.body.classList.toggle('dark-mode');

// Back to top
const b=document.getElementById('back-to-top');
window.addEventListener('scroll',()=>{ if(b) b.classList.toggle('visible',window.scrollY>400); });
if(b) b.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});

// Footer year
const y=document.getElementById('footer-year'); if(y) y.textContent=new Date().getFullYear();
