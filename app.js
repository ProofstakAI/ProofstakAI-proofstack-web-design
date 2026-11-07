'use strict';
const projects=[
 {slug:'cinderwake',name:'Cinderwake Machine',category:'industrial',type:'Machining & fabrication',tone:'Precision, with presence.'},
 {slug:'lumenquarry',name:'Lumenquarry Electric',category:'trades',type:'Electrical services',tone:'A brighter kind of first impression.'},
 {slug:'emberstrand',name:'Emberstrand Welding',category:'trades',type:'Mobile welding',tone:'Built for people who get it done.'},
 {slug:'stonewake',name:'Stonewake Earthworks',category:'industrial',type:'Excavation & grading',tone:'Serious groundwork. Strong direction.'},
 {slug:'arcvale',name:'Arcvale Metalworks',category:'industrial',type:'Metal fabrication',tone:'Craftsmanship, brought into focus.'},
 {slug:'pistonvale',name:'Pistonvale Auto',category:'automotive',type:'Automotive services',tone:'A sharper experience, from the start.'},
 {slug:'cinderquarry',name:'Cinderquarry Welding',category:'trades',type:'Welding & fabrication',tone:'Honest work. Distinctive character.'},
 {slug:'summit-comfort-hvac',name:'Summit Comfort HVAC',category:'trades',type:'HVAC services',tone:'Comfort, with a clear next step.'}
];
const $=s=>document.querySelector(s);
const grid=$('#work-grid');
for(const p of projects){
 const article=document.createElement('article');article.className='work-card';article.dataset.category=p.category;
 const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`Explore ${p.name} interactive demo`);
 const arrow='<svg class="i-arrow" width="1em" height="1em" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 button.innerHTML=`<div class="work-picture"><img src="assets/${p.slug}-preview.webp" alt="${p.name} website concept, ${p.type.toLowerCase()}" width="1100" height="760" loading="lazy"><span class="work-badge">EXPLORE LIVE DEMO ${arrow}</span></div><div class="work-card-info"><div><div class="work-card-title"><h3>${p.name}</h3><span aria-hidden="true">${arrow}</span></div><p>${p.type} / ${p.tone}</p></div><small>FICTIONAL CONCEPT</small></div>`;
 button.addEventListener('click',()=>openDemo(p,button));article.append(button);grid.append(article);
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 const filter=button.dataset.filter;
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
 let count=0;document.querySelectorAll('.work-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.category!==filter;if(!card.hidden)count++});
 $('#work-count').textContent=`${count} interactive concept${count===1?'':'s'}`;
}));
const dialog=$('#demo-dialog');let returnFocus=null;
function openDemo(project,trigger){
 returnFocus=trigger;$('#demo-title').textContent=project.name;
 $('#demo-frame').src=`demos/${project.slug}/index.html`;$('#demo-frame').title=`${project.name}: interactive fictional business concept`;
 $('#demo-kind').textContent='INTERACTIVE FICTIONAL CONCEPT';
 $('#demo-disclaimer').textContent='Fictional business. Demo forms do not send or store information.';
 $('#demo-open').href=`demos/${project.slug}/index.html`;
 setDevice('desktop');dialog.showModal();document.body.style.overflow='hidden';
}
function setDevice(device){$('#demo-frame').classList.toggle('mobile',device==='mobile');document.querySelectorAll('[data-device]').forEach(b=>{const active=b.dataset.device===device;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))})}
document.querySelectorAll('[data-device]').forEach(b=>b.addEventListener('click',()=>setDevice(b.dataset.device)));
$('#demo-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{$('#demo-frame').removeAttribute('src');document.body.style.overflow='';returnFocus?.focus()});
const menu=$('.menu-toggle'),nav=$('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.querySelector('span').textContent='+'}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.querySelector('span').textContent=open?'−':'+'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
window.addEventListener('resize',()=>{if(innerWidth>760)closeMenu()});

const video=$('#showreel'),source=$('#film-source'),play=$('#film-play'),seek=$('#film-seek'),sound=$('#film-sound');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let filmReady=false,soundOn=false,userPaused=false,loadingFilm=false,filmBlobURL=null;
const clock=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function updateFilm(){
 const duration=Number.isFinite(video.duration)?video.duration:40;
 $('#film-time').textContent=`${clock(video.currentTime||0)} / ${clock(duration)}`;
 seek.max=duration;seek.value=video.currentTime||0;
 seek.disabled=!filmReady||!Number.isFinite(video.duration);
 play.disabled=loadingFilm;
 $('#play-label').textContent=loadingFilm?'Loading film…':video.paused?'Play film':'Pause film';
 $('.play-icon').innerHTML=!video.paused
  ?'<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12"/><rect x="9.5" y="2" width="3.5" height="12"/></svg>'
  :'<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l10-5.5-10-5.5z"/></svg>';
}
async function tryPlay(){
 try{
  await video.play();
  $('#film-status').textContent='Looping showcase. Illustrative AI trade footage and authentic fictional website captures.';
 }catch{
  $('#film-status').textContent='Your browser paused autoplay. Use Play film to continue.';
 }
 updateFilm();
}
async function prepareFilm(explicit=false){
 if(loadingFilm)return;
 if(!filmReady){
  loadingFilm=true;updateFilm();
  $('#film-status').textContent='Loading the looping showcase…';
  try{
   // Load automatically; the in-memory Blob also supports seeking on review hosts
   // whose media proxy does not reliably handle HTTP byte-range requests.
   if(!filmBlobURL){
    const response=await fetch(source.dataset.src);
    if(!response.ok)throw new Error('Film download unavailable');
    filmBlobURL=URL.createObjectURL(await response.blob());
   }
   video.autoplay=(!reduced.matches||explicit)&&!userPaused;
   video.src=filmBlobURL;video.loop=true;video.muted=!soundOn;video.load();filmReady=true;
  }catch{
   $('#film-status').textContent='The film could not be prepared. Use Play film to retry, or explore the work below.';
  }finally{
   loadingFilm=false;updateFilm();
  }
 }
 if(filmReady&&!userPaused&&!document.hidden&&(!reduced.matches||explicit))await tryPlay();
}
play.addEventListener('click',async()=>{
 if(loadingFilm)return;
 if(!filmReady||video.paused){userPaused=false;await prepareFilm(true)}
 else{userPaused=true;video.pause();$('#film-status').textContent='Film paused. Use Play film to resume.'}
 updateFilm();
});
sound.addEventListener('click',()=>{soundOn=!soundOn;video.muted=!soundOn;sound.textContent=soundOn?'Sound on':'Sound off';sound.setAttribute('aria-pressed',String(soundOn))});
seek.addEventListener('input',()=>{if(filmReady&&Number.isFinite(video.duration))video.currentTime=Number(seek.value)});
for(const event of ['timeupdate','loadedmetadata','pause','play','ended'])video.addEventListener(event,updateFilm);
video.addEventListener('error',()=>{$('#film-status').textContent='The film could not load. Please try Play again or explore the interactive work below.'});
source.addEventListener('error',()=>{$('#film-status').textContent='The film could not load. Please try again or explore the work below.'});
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(!userPaused&&!reduced.matches)prepareFilm()});
reduced.addEventListener('change',()=>{if(reduced.matches){video.pause();$('#film-status').textContent='Reduced motion: static poster. Play film is optional.'}else if(!userPaused)prepareFilm()});
if(!reduced.matches)prepareFilm();
else{$('#film-status').textContent='Reduced motion: static poster. Play film is optional.';updateFilm()}

const form=$('#brief-form'),preview=$('#brief-preview'),submitBtn=$('#brief-submit');
function encode(data){return Object.entries(data).map(([k,v])=>encodeURIComponent(k)+'='+encodeURIComponent(v)).join('&')}
form.addEventListener('submit',async e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const data=new FormData(form);
 const brief=`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nBusiness: ${data.get('business')}\nInterested in: ${data.get('type')}\n\n${data.get('message')}`;
 $('#brief-text').textContent=brief;
 $('#email-brief').href=`mailto:christian@proofstackai.com?subject=${encodeURIComponent('Website project: '+data.get('business'))}&body=${encodeURIComponent(brief)}`;
 preview.hidden=false;preview.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});
 preview.setAttribute('tabindex','-1');preview.focus({preventScroll:true});
 submitBtn.disabled=true;const originalLabel=submitBtn.innerHTML;
 $('#brief-status').textContent='SENDING…';$('#brief-help').textContent='Sending your brief…';
 try{
  const payload=Object.fromEntries(data.entries());
  const res=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:encode(payload)});
  if(!res.ok)throw new Error('Submit failed: '+res.status);
  $('#brief-status').textContent='SENT';
  $('#brief-help').textContent='Sent. We\'ll reply by email. You can still send yourself a copy below.';
 }catch{
  $('#brief-status').textContent='NOT SENT';
  $('#brief-help').textContent='Could not send automatically. Please use "Email it yourself instead" below.';
 }finally{
  submitBtn.disabled=false;submitBtn.innerHTML=originalLabel;
 }
});
$('#edit-brief').addEventListener('click',()=>{preview.hidden=true;$('#brief-status').textContent='NOT SENT';$('#brief-help').textContent='Review it, then send or email it yourself.';form.querySelector('input').focus()});
$('#clear-brief').addEventListener('click',()=>{form.reset();$('#brief-text').textContent='';$('#email-brief').href='mailto:christian@proofstackai.com';$('#brief-status').textContent='NOT SENT';$('#brief-help').textContent='Review it, then send or email it yourself.';preview.hidden=true;form.querySelector('input').focus()});
if(!reduced.matches&&'IntersectionObserver'in window){
 const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.remove('reveal-ready');e.target.classList.add('revealed');observer.unobserve(e.target)}},{threshold:.06});
 document.querySelectorAll('.section-heading,.approach-intro,.process-grid,.ownership,.faq-layout,.contact-layout').forEach(e=>{e.classList.add('reveal-ready');observer.observe(e)});
}
