// Clickjacking guard: GitHub Pages cannot send frame headers, so refuse to render inside another site's frame.
if(typeof window!=='undefined'&&window.top!==window.self){try{window.top.location.replace(window.location.href);}catch{document.documentElement.style.display='none';}}
export const normalizeSearch = value => String(value).normalize('NFKD').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').toLocaleLowerCase('ar').trim();
export function filterProjects(projects, query, category) {
 const terms=normalizeSearch(query).split(/\s+/).filter(Boolean);
 return projects.filter(p=>(category==='all'||p.category===category)&&terms.every(t=>normalizeSearch(p.search).includes(t)));
}
export function composeMessage({kind,name,subject,device,message}) {
 return [kind==='support'?'طلب دعم — عبودين قيمز':'تواصل — عبودين قيمز',name?`الاسم: ${name}`:'',`الموضوع: ${subject}`,device?`الجهاز: ${device}`:'','',message].filter((s,i)=>s||i===4).join('\n');
}
if(typeof document!=='undefined') {
 const EN=document.documentElement.lang==='en',L=(ar,en)=>EN?en:ar;
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#mobile-nav');
 function closeMenu(){if(!menu||!nav)return;nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',L('فتح القائمة','Open menu'));}
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';nav.hidden=open;menu.setAttribute('aria-expanded',String(!open));menu.setAttribute('aria-label',open?L('فتح القائمة','Open menu'):L('إغلاق القائمة','Close menu'));});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav&&!nav.hidden){closeMenu();menu.focus();}});
 document.addEventListener('click',event=>{if(nav&&!nav.hidden&&!event.target.closest('.site-header'))closeMenu();});
 matchMedia('(min-width:861px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
 const search=document.querySelector('#search'),cards=[...document.querySelectorAll('#game-grid [data-project]')],filters=[...document.querySelectorAll('[data-filter]')];
 let category='all';
 function updateGames(){
  const visible=new Set(filterProjects(cards.map((el,i)=>({i,category:el.dataset.category,search:el.dataset.search})),search?.value||'',category).map(x=>x.i));
  cards.forEach((card,i)=>{card.hidden=!visible.has(i);});
  filters.forEach(button=>{const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  const count=document.querySelector('#results-count');if(count)count.textContent=EN?`${visible.size} of ${cards.length} games`:`${visible.size} من ${cards.length} ألعاب`;
  const empty=document.querySelector('#no-results');if(empty)empty.hidden=visible.size>0;
 }
 search?.addEventListener('input',updateGames);
 filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;updateGames();}));
 document.querySelector('#reset-search')?.addEventListener('click',()=>{category='all';search.value='';updateGames();search.focus();});
 document.addEventListener('keydown',event=>{if(event.key==='/'&&search&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.target.closest('input,textarea,select,[contenteditable]')){event.preventDefault();search.focus();}});
 // Support: a ?game= link from a game page goes into the email subject.
 const supportMail=document.querySelector('[data-support-mail]'),game=new URLSearchParams(location.search).get('game');
 if(supportMail&&game&&game.length<=80){
  const subject=EN?`Support — ${game}`:`دعم — ${game}`;supportMail.href=`mailto:${supportMail.dataset.supportMail}?subject=${encodeURIComponent(subject)}`;
  const note=document.querySelector('[data-support-game]');if(note){note.textContent=EN?`Your message is about: ${game}`:`رسالتك عن: ${game}`;note.hidden=false;}
 }

 // Play page: focus the game for keyboard play and offer full screen where the browser allows it.
 const frame=document.querySelector('.play-frame');
 // iPhone: a game's sound plays even with the silent switch on (Safari 16.4+)
 if(frame){try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}}
 frame?.addEventListener('load',()=>frame.focus());
 // Time-limited offers: hide once their last day (Riyadh time) has passed.
 document.querySelectorAll('[data-ends]').forEach(el=>{const end=new Date(el.dataset.ends+'T23:59:59+03:00');if(!isNaN(end)&&Date.now()>end)el.hidden=true;});
 // Home «جديد» bar: show one addition at a time, every 5 s; pauses on hover/focus, swipe on touch, still with reduced motion.
 const news=document.querySelector('.news-bar'),items=[...document.querySelectorAll('[data-news-item]')];
 if(news&&items.length>1){
  let at=0,timer;const count=news.querySelector('[data-news-count]');
  const show=i=>{at=(i+items.length)%items.length;items.forEach((el,j)=>el.classList.toggle('is-active',j===at));if(count)count.textContent=`${at+1}/${items.length}`;};
  const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const stop=()=>clearInterval(timer),start=()=>{stop();if(!still)timer=setInterval(()=>show(at+1),5000);};
  news.querySelector('[data-news-next]')?.addEventListener('click',()=>{show(at+1);start();});
  news.querySelector('[data-news-prev]')?.addEventListener('click',()=>{show(at-1);start();});
  news.addEventListener('mouseenter',stop);news.addEventListener('mouseleave',start);
  news.addEventListener('focusin',stop);news.addEventListener('focusout',start);
  let x0=null;const track=news.querySelector('.news-track');
  track.addEventListener('touchstart',ev=>{x0=ev.touches[0].clientX;},{passive:true});
  track.addEventListener('touchend',ev=>{if(x0===null)return;const dx=ev.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40){show(at+((dx>0)===EN?-1:1));start();}},{passive:true});
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  start();
 }
}
// Owner-only visit counter (stats-worker/): one beacon per page view, a heartbeat each minute while the page is visible
// (that is how the dashboard knows who is on the site or in a game right now), and a note when a store button is pressed.
// No cookies; a random id lives only as long as this browser tab. Off when the page has no stats-endpoint meta,
// and for visitors who ask not to be tracked (Global Privacy Control / Do Not Track).
if(typeof document!=='undefined'){
 const endpoint=document.querySelector('meta[name="stats-endpoint"]')?.content;
 const optOut=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1';
 if(endpoint&&!optOut){
  let id='',isNew=0;
  try{id=sessionStorage.getItem('aboden-stats')||'';}catch{}
  if(!id){id=Array.from(crypto.getRandomValues(new Uint8Array(10)),b=>(b%36).toString(36)).join('');isNew=1;try{sessionStorage.setItem('aboden-stats',id);}catch{}}
  const send=o=>{const body=JSON.stringify({id,p:location.pathname,...o});try{if(navigator.sendBeacon?.(endpoint,new Blob([body],{type:'text/plain'})))return;}catch{}fetch(endpoint,{method:'POST',body,keepalive:true,mode:'no-cors'}).catch(()=>{});};
  let ref='';try{const r=document.referrer&&new URL(document.referrer);if(r&&r.host!==location.host)ref=r.hostname.toLowerCase();}catch{}
  send({t:'v',n:isNew,r:ref});
  let last=Date.now();
  const beat=()=>{if(document.visibilityState==='visible'){last=Date.now();send({t:'p'});}};
  setInterval(beat,60000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&Date.now()-last>30000)beat();});
  document.addEventListener('click',event=>{const a=event.target.closest?.('a[href]');if(!a)return;if(a.dataset.play){send({t:'e',e:'play',p:`/play/${a.dataset.play}/`});return;}try{const h=new URL(a.href).hostname;if(/(^|\.)meta\.com$|(^|\.)oculus\.com$/.test(h))send({t:'e',e:'store'});else if(/(^|\.)roblox\.com$/.test(h))send({t:'e',e:'roblox'});}catch{}});
 }
}
