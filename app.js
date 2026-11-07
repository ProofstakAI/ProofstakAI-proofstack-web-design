'use strict';
const projects=[
 {slug:'cinderwake',name:'Cinderwake Machine',category:'industrial',type:'Machining & fabrication',tone:'Precision, with presence.'},
 {slug:'lumenquarry',name:'Lumenquarry Electric',category:'trades',type:'Electrical services',tone:'A brighter kind of first impression.'},
 {slug:'emberstrand',name:'Emberstrand Welding',category:'trades',type:'Mobile welding',tone:'Built for people who get it done.'},
 {slug:'stonewake',name:'Stonewake Earthworks',category:'industrial',type:'Excavation & grading',tone:'Serious groundwork. Strong direction.'},
 {slug:'arcvale',name:'Arcvale Metalworks',category:'industrial',type:'Metal fabrication',tone:'Craftsmanship, brought into focus.'},
 {slug:'pistonvale',name:'Pistonvale Auto',category:'automotive',type:'Automotive services',tone:'A sharper experience, from the start.'},
 {slug:'cinderquarry',name:'Cinderquarry Welding',category:'trades',type:'Welding & fabrication',tone:'Honest work. Distinctive character.'},
 {slug:'summit-comfort-hvac',name:'Summit Comfort HVAC',category:'trades',type:'HVAC services',tone:'Real client project.',real:true}
];
const $=s=>document.querySelector(s);
const grid=$('#work-grid');
for(const p of projects){
 const article=document.createElement('article');article.className='work-card';article.dataset.category=p.category;
 const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`Explore ${p.name} interactive demo`);
 const arrow='<svg class="i-arrow" width="1em" height="1em" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 button.innerHTML=`<div class="work-picture"><img src="assets/${p.slug}-preview.webp" alt="${p.name} website concept, ${p.type.toLowerCase()}" width="1100" height="760" loading="lazy"><span class="work-badge">EXPLORE LIVE DEMO ${arrow}</span></div><div class="work-card-info"><div><div class="work-card-title"><h3>${p.name}</h3><span aria-hidden="true">${arrow}</span></div><p>${p.type} / ${p.tone}</p></div><small>${p.real?'CLIENT PROJECT':'FICTIONAL CONCEPT'}</small></div>`;
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
 $('#demo-frame').src=`demos/${project.slug}/index.html`;$('#demo-frame').title=project.real?`${project.name}: client project`:`${project.name}: interactive fictional business concept`;
 $('#demo-kind').textContent=project.real?'CLIENT PROJECT':'INTERACTIVE FICTIONAL CONCEPT';
 $('#demo-disclaimer').textContent=project.real?'Real client project. Demo form does not send or store information.':'Fictional business. Demo forms do not send or store information.';
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
let fullFilm=false,userPlaying=false,soundOn=false,idlePaused=reduced.matches,loadingFilm=false,filmBlobURL=null;
const clock=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function updateFilm(){
 const duration=fullFilm&&Number.isFinite(video.duration)?video.duration:40;
 $('#film-time').textContent=`${clock(fullFilm?video.currentTime:0)} / ${clock(duration)}`;
 if(fullFilm){seek.max=duration;seek.value=video.currentTime}
 $('#play-label').textContent=loadingFilm?'Preparing the film…':fullFilm?(video.ended?'Replay the film':video.paused?'Continue the film':'Pause the film'):'Play the full film';
 $('.play-icon').innerHTML=fullFilm&&!video.paused
  ?'<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12"/><rect x="9.5" y="2" width="3.5" height="12"/></svg>'
  :'<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l10-5.5-10-5.5z"/></svg>';
 $('#film-preview').hidden=fullFilm;
 $('#film-preview').textContent=video.paused?'Play preview':'Pause preview';
}
async function tryPlay(){if(video.error)video.load();try{await video.play();$('#film-status').textContent=fullFilm?'Original AI-generated film. Sound is optional.':'A quiet moment. The full film is yours to start.'}catch{$('#film-status').textContent='Playback is paused. Press Play to try again.'}updateFilm()}
function idle(){
 fullFilm=false;userPlaying=false;idlePaused=reduced.matches;video.pause();video.removeAttribute('src');video.muted=true;video.loop=true;source.src='assets/lagoon-loop.mp4';video.load();
 seek.disabled=true;seek.value=0;$('#film-idle').hidden=true;soundOn=false;sound.textContent='Sound off';sound.setAttribute('aria-pressed','false');
 $('#film-status').textContent='Contains a sudden shark encounter. Play when you’re ready.';
 updateFilm();if(!reduced.matches&&document.visibilityState==='visible')tryPlay();
}
play.addEventListener('click',async()=>{
 if(loadingFilm)return;
 if(!fullFilm){
  loadingFilm=true;idlePaused=true;play.disabled=true;$('#film-preview').disabled=true;video.pause();updateFilm();
  $('#film-status').textContent='Preparing the full film. This may take a moment.';
  try{
   // A local Blob avoids unreliable range requests through review-host proxies.
   // Download only after an explicit request; retain it in memory for replay.
   if(!filmBlobURL){
    const response=await fetch('assets/proof-of-possibility.mp4');
    if(!response.ok)throw new Error('Film download unavailable');
    filmBlobURL=URL.createObjectURL(await response.blob());
   }
   fullFilm=true;userPlaying=true;video.loop=false;video.src=filmBlobURL;video.load();video.muted=!soundOn;
   seek.disabled=false;$('#film-idle').hidden=false;
   const box=video.getBoundingClientRect();
   if(!document.hidden&&box.bottom>0&&box.top<innerHeight)await tryPlay();
   else $('#film-status').textContent='The film is ready. Press Continue when you’re ready.';
  }catch{
   $('#film-status').textContent='The film could not be prepared. Press Play to retry, or explore the work below.';
  }finally{
   loadingFilm=false;play.disabled=false;$('#film-preview').disabled=false;updateFilm();
  }
 }
 else if(video.paused){userPlaying=true;if(video.ended)video.currentTime=0;await tryPlay()}
 else{video.pause();userPlaying=false}
 updateFilm();
});
sound.addEventListener('click',()=>{soundOn=!soundOn;video.muted=!soundOn;sound.textContent=soundOn?'Sound on':'Sound off';sound.setAttribute('aria-pressed',String(soundOn))});
$('#film-preview').addEventListener('click',()=>{if(fullFilm)return;if(video.paused){idlePaused=false;video.loop=true;tryPlay()}else{idlePaused=true;video.pause()}updateFilm()});
$('#film-idle').addEventListener('click',idle);
seek.addEventListener('input',()=>{if(fullFilm&&Number.isFinite(video.duration))video.currentTime=Number(seek.value)});
for(const event of ['timeupdate','loadedmetadata','pause','play','ended'])video.addEventListener(event,updateFilm);
video.addEventListener('error',()=>{$('#film-status').textContent='The film could not load. Please try Play again or explore the interactive work below.'});
source.addEventListener('error',()=>{$('#film-status').textContent='The film could not load. Please try again or explore the work below.'});
const videoObserver=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting){video.pause()}else if(!fullFilm&&!reduced.matches&&!idlePaused){tryPlay()}}},{threshold:.1});videoObserver.observe(video);
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(!fullFilm&&!reduced.matches&&!idlePaused)tryPlay()});
reduced.addEventListener('change',()=>{if(reduced.matches){idlePaused=true;video.pause()}});
if(!reduced.matches)idle();
else updateFilm();

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
