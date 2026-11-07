// The owner's dashboard page: one self-contained HTML document that reads /api/summary every 30 seconds.
// Owner 2026-10-27: «ضبطها لي وخليها بشكل مرتب والوان» — every section has its own colour, games show their posters.
export const dashboardHtml = `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex, nofollow"/><meta name="theme-color" content="#0a1224"/><title>لوحة عبودين قيمز</title>
<style>
:root{--bg:#0a1224;--card:#121c33;--card2:#17233f;--line:#24324f;--ink:#f3f5fa;--muted:#9aa7c2;
--orange:#f39a2b;--green:#34d399;--blue:#60a5fa;--purple:#a78bfa;--pink:#f472b6;--teal:#2dd4bf;--red:#f87171;--meta:#5b8cff}
*{box-sizing:border-box}
body{margin:0;color:var(--ink);font:15px/1.6 system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;background:var(--bg);
background-image:radial-gradient(900px 500px at 100% -10%,rgba(243,154,43,.13),transparent 60%),radial-gradient(800px 500px at 0% 10%,rgba(96,165,250,.10),transparent 60%);background-attachment:fixed;min-height:100vh}
main{max-width:1200px;margin:0 auto;padding:20px 16px 56px}
h1,h2,h3{margin:0}h2{font-size:18px;display:flex;align-items:center;gap:10px}h2 small{font-weight:500}
.muted{color:var(--muted)}small{font-size:12.5px}.num{font-variant-numeric:tabular-nums}
.top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-bottom:20px}
.brand{display:flex;align-items:center;gap:12px}.logo{width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,#ffb347,#f37b1d);display:grid;place-items:center;box-shadow:0 8px 24px rgba(243,123,29,.35)}
.logo svg{width:26px;height:26px}.brand h1{font-size:22px;line-height:1.2}
.pill{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;padding:3px 10px;border-radius:999px;background:rgba(52,211,153,.12);color:var(--green);border:1px solid rgba(52,211,153,.3)}
.dot{width:8px;height:8px;border-radius:50%;background:currentColor;animation:pulse 1.8s infinite}@keyframes pulse{50%{opacity:.3}}
.seg{display:inline-flex;background:var(--card);border:1px solid var(--line);border-radius:999px;padding:4px}
.seg button{background:none;border:0;color:var(--muted);font:inherit;font-size:14px;padding:6px 16px;border-radius:999px;cursor:pointer}
.seg button[aria-pressed=true]{background:linear-gradient(135deg,#ffb347,#f37b1d);color:#1b1200;font-weight:700}
.card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:18px}
section{margin-top:14px}.head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;flex-wrap:wrap}
.ic{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;flex:none}.ic svg{width:19px;height:19px}
/* Now */
.now{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:0}
.big{position:relative;overflow:hidden;border-radius:22px;padding:20px;border:1px solid rgba(255,255,255,.08)}
.big.site{background:linear-gradient(135deg,#0f766e,#0e4f5c)}.big.play{background:linear-gradient(135deg,#c2410c,#7c2d12)}
.big .lbl{display:flex;align-items:center;gap:8px;font-weight:600;color:rgba(255,255,255,.9)}
.big b{display:block;font-size:56px;line-height:1.05;margin-top:8px}.big .sub{color:rgba(255,255,255,.8);font-size:13px;margin-top:6px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.chip{font-size:12.5px;padding:3px 10px;border-radius:999px;background:rgba(0,0,0,.25);color:#fff}
/* Tiles */
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
.tile{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px;position:relative;overflow:hidden}
.tile::after{content:"";position:absolute;inset-inline:0;top:0;height:3px;background:var(--c)}
.tile .ic{background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c)}
.tile b{display:block;font-size:30px;line-height:1.15;margin-top:10px}.tile small{display:block;margin-top:2px}
/* Chart */
.chart{position:relative}.chart svg{display:block;width:100%;height:230px}
.tip{position:absolute;pointer-events:none;background:#fff;color:#111;border-radius:10px;padding:7px 11px;font-size:13px;white-space:nowrap;transform:translate(50%,-115%);display:none;box-shadow:0 6px 20px rgba(0,0,0,.35);line-height:1.5}
.legend{display:flex;gap:14px;font-size:13px;color:var(--muted)}.legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-inline-end:6px;vertical-align:-1px}
details{margin-top:8px}summary{cursor:pointer;color:var(--muted);font-size:13px}
table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;margin-top:8px}th,td{padding:7px 8px;text-align:start;border-bottom:1px solid var(--line)}th{color:var(--muted);font-weight:600;font-size:13px}
/* Games */
.games{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.game{background:var(--card2);border:1px solid var(--line);border-radius:18px;overflow:hidden;display:flex;flex-direction:column}
.game.on{border-color:rgba(52,211,153,.55);box-shadow:0 0 0 1px rgba(52,211,153,.25),0 10px 30px rgba(52,211,153,.08)}
.cover{position:relative;aspect-ratio:16/9;overflow:hidden;background:#0d1730}.cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.cover .plat{position:absolute;top:10px;inset-inline-start:10px;font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:999px;background:rgba(10,18,36,.82);backdrop-filter:blur(4px)}
.plat.web{color:var(--blue)}.plat.quest{color:#9db7ff}
.cover .livebadge{position:absolute;bottom:10px;inset-inline-start:10px;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;padding:4px 10px;border-radius:999px;background:var(--green);color:#052e1f}
.game h3{font-size:16px;padding:12px 14px 4px}.game h3 span{font-size:12px;color:var(--muted);font-weight:500;margin-inline-start:6px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:8px 14px 14px;margin-top:auto}
.stats div{background:rgba(255,255,255,.03);border-radius:12px;padding:8px 6px;text-align:center}
.stats b{display:block;font-size:19px;line-height:1.2}.stats small{color:var(--muted);font-size:11.5px}
.stats .p b{color:var(--orange)}.stats .m b{color:var(--purple)}.stats .v b{color:var(--blue)}.stats .s b{color:var(--pink)}
.idle{opacity:.72}.idle:hover{opacity:1}
.more{margin-top:12px;background:none;border:1px dashed var(--line);color:var(--muted);border-radius:12px;padding:8px;width:100%;font:inherit;cursor:pointer}
/* Roblox + Quest */
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}
.rb{display:grid;gap:12px}.rbi{display:grid;grid-template-columns:120px 1fr;gap:12px;align-items:center;background:var(--card2);border:1px solid var(--line);border-radius:16px;padding:10px}
.rbi img{width:120px;aspect-ratio:16/10;object-fit:cover;border-radius:10px;display:block}
.rbi dl{display:grid;grid-template-columns:1fr auto;gap:2px 10px;margin:6px 0 0;font-size:13px}.rbi dd{margin:0;font-weight:700;font-variant-numeric:tabular-nums}
.empty{color:var(--muted);background:var(--card2);border:1px dashed var(--line);border-radius:14px;padding:14px;font-size:14px}
.quest p{margin:0 0 10px;color:var(--muted)}.btn{display:inline-flex;align-items:center;gap:8px;background:var(--meta);color:#fff;text-decoration:none;font-weight:700;border-radius:12px;padding:9px 14px}
.qs{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}.qs div{background:var(--card2);border-radius:14px;padding:10px 12px}.qs b{display:block;font-size:22px}
/* Audience */
.aud{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
.bars{list-style:none;margin:0;padding:0}.bars li{display:grid;grid-template-columns:minmax(0,1fr) 36% auto;gap:10px;align-items:center;padding:6px 0}
.bars .lbl{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bars .track{height:10px;background:color-mix(in srgb,var(--c) 14%,transparent);border-radius:5px;overflow:hidden}
.bars .fill{display:block;height:100%;background:var(--c);border-radius:5px}.bars .n{font-variant-numeric:tabular-nums;color:var(--muted);min-width:2ch;text-align:end}
.notes ul{margin:0;padding-inline-start:20px;color:var(--muted);font-size:13.5px}.notes li{margin:4px 0}
.pill.stale{background:rgba(248,113,113,.12);color:var(--red);border-color:rgba(248,113,113,.3)}
@media (prefers-reduced-motion:reduce){.dot{animation:none}}
@media (max-width:520px){.big b{font-size:46px}.rbi{grid-template-columns:96px 1fr}.rbi img{width:96px}}
</style></head><body><main>
<div class="top"><div class="brand"><div class="logo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="#fff"><rect x="3" y="7" width="12" height="12" rx="3" transform="rotate(-12 9 13)"/><rect x="14" y="3" width="7" height="7" rx="2" opacity=".85"/></svg></div>
<div><h1>لوحة عبودين قيمز</h1><span class="pill" id="pill"><span class="dot"></span><span id="updated">مباشر</span></span></div></div>
<div class="seg" role="group" aria-label="الفترة"><button data-range="today" aria-pressed="false">اليوم</button><button data-range="week" aria-pressed="true">٧ أيام</button><button data-range="month" aria-pressed="false">٣٠ يوم</button></div></div>

<section class="now" aria-label="الحين">
<div class="big site"><div class="lbl"><span class="dot"></span>بالموقع الحين</div><b class="num" id="n-live">–</b><div class="sub" id="n-live-sub"></div></div>
<div class="big play"><div class="lbl"><span class="dot"></span>يلعبون الحين</div><b class="num" id="n-play">–</b><div class="sub" id="n-play-sub"></div><div class="chips" id="n-play-chips"></div></div>
</section>

<section class="tiles" aria-label="الأرقام">
<div class="tile" style="--c:var(--blue)"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg></div><b class="num" id="t-visits">–</b><small class="muted">زيارات · <span class="rl"></span></small></div>
<div class="tile" style="--c:var(--purple)"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div><b class="num" id="t-views">–</b><small class="muted">مشاهدات صفحات · <span class="rl"></span></small></div>
<div class="tile" style="--c:var(--orange)"><div class="ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l13 7-13 7z"/></svg></div><b class="num" id="t-plays">–</b><small class="muted">مرات لعب · <span class="rl"></span></small></div>
<div class="tile" style="--c:var(--teal)"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div><b class="num" id="t-min">–</b><small class="muted">دقائق لعب · <span class="rl"></span></small></div>
<div class="tile" style="--c:var(--pink)"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg></div><b class="num" id="t-store">–</b><small class="muted">ضغطات المتجر · <span id="t-store-l"></span></small></div>
<div class="tile" style="--c:var(--green)"><div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg></div><b class="num" id="t-peak">–</b><small class="muted" id="t-peak-l">أعلى تواجد اليوم</small></div>
</section>

<section class="card"><div class="head"><h2><span class="ic" style="background:rgba(96,165,250,.16);color:var(--blue)"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg></span>الزيارات آخر ٣٠ يوم</h2>
<div class="legend"><span><i style="background:var(--blue)"></i>زيارات</span><span><i style="background:var(--purple);height:3px;vertical-align:3px"></i>مشاهدات</span></div></div>
<div class="chart" id="chart"><svg aria-hidden="true"></svg><div class="tip" id="tip"></div></div>
<details><summary>عرض الأرقام كجدول</summary><table id="daily-table"></table></details></section>

<section class="card"><div class="head"><h2><span class="ic" style="background:rgba(243,154,43,.16);color:var(--orange)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4"/><circle cx="16" cy="11" r="1" fill="currentColor"/><circle cx="18" cy="13" r="1" fill="currentColor"/></svg></span>ألعابنا <small class="muted" id="g-range"></small></h2></div>
<div class="games" id="games"></div><button class="more" id="more" hidden></button>
</section>

<section class="two">
<div class="card"><div class="head"><h2><span class="ic" style="background:rgba(248,113,113,.16);color:var(--red)"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.2 2 2 18.8 18.8 22 22 5.2zm8.4 13.2-4.8-.9.9-4.8 4.8.9z"/></svg></span>روبلوكس <small class="muted">أرقام روبلوكس الرسمية</small></h2></div><div class="rb" id="roblox"></div></div>
<div class="card quest"><div class="head"><h2><span class="ic" style="background:rgba(91,140,255,.16);color:var(--meta)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="4"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/></svg></span>ميتا كويست</h2></div>
<div class="qs" id="quest"></div>
<a class="btn" href="https://developers.meta.com/horizon/manage/" target="_blank" rel="noopener noreferrer">افتح لوحة مطوري ميتا ↗</a></div>
</section>

<section class="aud">
<div class="card" style="--c:var(--orange)"><h2 style="margin-bottom:10px">📄 أكثر الصفحات <small class="muted">٧ أيام</small></h2><ul class="bars" id="pages"></ul></div>
<div class="card" style="--c:var(--green)"><h2 style="margin-bottom:10px">🌍 الدول <small class="muted">٧ أيام</small></h2><ul class="bars" id="countries"></ul></div>
<div class="card" style="--c:var(--purple)"><h2 style="margin-bottom:10px">📱 الأجهزة <small class="muted">٧ أيام</small></h2><ul class="bars" id="devices"></ul></div>
<div class="card" style="--c:var(--blue)"><h2 style="margin-bottom:10px">🔗 من وين جوا <small class="muted">٧ أيام</small></h2><ul class="bars" id="refs"></ul></div>
</section>
<section class="card notes"><h2 style="margin-bottom:8px">📝 ملاحظات</h2><ul>
<li>«مرات اللعب» = ضغطات زر «العب الآن» في موقعنا. من ٧ نوفمبر ٢٠٢٦ ألعاب الويب تنفتح في تبويب لحالها برا الموقع، فـ«يلعبون الحين» و«دقائق اللعب» لها ما تنحسب.</li>
<li>ميتا ما تعطي أرقام المبيعات واللاعبين برا لوحة المطورين؛ قسم ميتا كويست فيه زيارات صفحات ألعاب كويست في موقعنا وضغطات زر المتجر.</li>
<li id="note-roblox" hidden>أرقام روبلوكس تطلع بعد ربط أرقام التجارب (Start Place ID).</li>
<li>بدون كوكيز وبدون تخزين عناوين IP. العدّ بتوقيت السعودية من يوم تركيب العداد، والصفحة تتحدث كل ٣٠ ثانية.</li></ul></section>
</main>
<script>
const SITE='https://abodengames.com/',$=id=>document.getElementById(id),fmt=n=>n==null?'–':Number(n).toLocaleString('ar-SA');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RANGE={today:'اليوم',week:'آخر ٧ أيام',month:'آخر ٣٠ يوم'};let range='week',data=null,showAll=false;
let regions;try{regions=new Intl.DisplayNames(['ar'],{type:'region'});}catch{}
const flag=c=>/^[A-Z]{2}$/.test(c)?String.fromCodePoint(...[...c].map(x=>127397+x.charCodeAt(0))):'🏳️';
const country=c=>c==='??'?'🏳️ غير معروف':flag(c)+' '+(regions?.of(c)||c);
const DEVICES={mobile:'📱 جوال',desktop:'💻 كمبيوتر',tablet:'📲 تابلت',quest:'🥽 نظارة Meta Quest'};
const sum=(a,f)=>a.reduce((s,x)=>s+(f(x)||0),0);
function bars(id,rows,label){const max=Math.max(1,...rows.map(r=>r.n));$(id).innerHTML=rows.length?rows.map(r=>'<li><span class="lbl" title="'+esc(label(r))+'">'+esc(label(r))+'</span><span class="track"><span class="fill" style="width:'+(r.n/max*100).toFixed(1)+'%"></span></span><span class="n">'+fmt(r.n)+'</span></li>').join(''):'<li class="muted">ما فيه بيانات للحين</li>';}
function pageName(route){const g=data.games.find(g=>g.page===route||g.play===route);if(g)return (g.play===route?'▶ ':'')+g.title;return {'/':'الرئيسية','/games/':'الألعاب','/ar/':'الواقع المعزز','/roblox/':'روبلوكس','/studio/':'الاستديو','/team/':'الفريق','/support/':'الدعم','/contact/':'تواصل معنا'}[route]||route;}
function chart(){
 const svg=document.querySelector('#chart svg'),W=svg.clientWidth||800,H=230,pad={t:14,b:26,l:6,r:34},d=data.daily,max=Math.max(4,...d.map(x=>Math.max(x.visits,x.views)));
 const step=Math.pow(10,Math.floor(Math.log10(max))),top=Math.ceil(max/step)*step,band=(W-pad.l-pad.r)/d.length,bw=Math.max(3,Math.min(18,band-4));
 const y=v=>H-pad.b-(v/top)*(H-pad.t-pad.b),cxOf=i=>W-pad.r-band*(i+0.5);
 let s='<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#93c5fd"/><stop offset="1" stop-color="#3b82f6"/></linearGradient></defs>';
 for(let i=0;i<=4;i++){const v=top*i/4,yy=y(v);s+='<line x1="'+pad.l+'" x2="'+(W-pad.r)+'" y1="'+yy+'" y2="'+yy+'" stroke="#24324f"/><text x="'+(W-pad.r+6)+'" y="'+(yy+4)+'" fill="#9aa7c2" font-size="11">'+fmt(Math.round(v))+'</text>';}
 d.forEach((x,i)=>{const cx=cxOf(i),h=H-pad.b-y(x.visits),x0=cx-bw/2;
  if(h>0){const r=Math.min(4,h,bw/2);s+='<path d="M'+x0+','+(H-pad.b)+'V'+(H-pad.b-h+r)+'q0,-'+r+' '+r+',-'+r+'H'+(x0+bw-r)+'q'+r+',0 '+r+','+r+'V'+(H-pad.b)+'Z" fill="url(#g)"/>';}
  if(i%5===0||i===d.length-1)s+='<text x="'+cx+'" y="'+(H-7)+'" fill="#9aa7c2" font-size="11" text-anchor="middle">'+x.day.slice(5).replace('-','/')+'</text>';});
 s+='<polyline fill="none" stroke="#a78bfa" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="'+d.map((x,i)=>cxOf(i)+','+y(x.views)).join(' ')+'"/>';
 const last=d.length-1;s+='<circle cx="'+cxOf(last)+'" cy="'+y(d[last].views)+'" r="4" fill="#a78bfa" stroke="#121c33" stroke-width="2"/>';
 d.forEach((x,i)=>{s+='<rect x="'+(cxOf(i)-band/2)+'" y="0" width="'+band+'" height="'+H+'" fill="transparent" data-i="'+i+'"/>';});
 svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.innerHTML=s;
}
const tip=$('tip'),csvg=document.querySelector('#chart svg');
csvg.addEventListener('pointermove',e=>{const i=e.target.dataset?.i;if(i==null){tip.style.display='none';return;}const x=data.daily[i],b=$('chart').getBoundingClientRect();tip.innerHTML='<b>'+x.day+'</b><br/><span style="color:#2563eb">■</span> زيارات '+fmt(x.visits)+'<br/><span style="color:#7c3aed">■</span> مشاهدات '+fmt(x.views);tip.style.display='block';tip.style.left=(e.clientX-b.left)+'px';tip.style.top=(e.clientY-b.top)+'px';});
csvg.addEventListener('pointerleave',()=>tip.style.display='none');
function gameCard(g){
 const on=g.liveNow>0,quest=g.platform==='quest',r=range;
 const cells=[g.plays?['p',fmt(g.plays[r]),'مرات لعب']:null,g.minutes?['m',fmt(g.minutes[r]),'دقائق لعب']:null,['v',fmt(g.pageViews[r]),'زيارات صفحتها'],g.storeClicks?['s',fmt(r==='month'?g.storeClicks.month:g.storeClicks.week),'ضغطات المتجر']:null].filter(Boolean).slice(0,3);
 return '<article class="game'+(on?' on':'')+'"><div class="cover">'+(g.image?'<img src="'+SITE+esc(g.image)+'" alt="" loading="lazy"/>':'')+'<span class="plat '+(quest?'quest':'web')+'">'+(quest?'Meta Quest':'ويب')+'</span>'+(on?'<span class="livebadge"><span class="dot"></span>'+fmt(g.liveNow)+' يلعب الحين</span>':'')+'</div><h3>'+esc(g.title)+'<span>'+esc(g.titleEn||'')+'</span></h3><div class="stats">'+cells.map(c=>'<div class="'+c[0]+'"><b class="num">'+c[1]+'</b><small>'+c[2]+'</small></div>').join('')+'</div></article>';
}
function render(){
 if(!data)return;const t=data.totals[range],r=range,G=data.games;
 const rbPlaying=sum(data.roblox,x=>x.playing),liveGames=G.filter(g=>g.liveNow>0).sort((a,b)=>b.liveNow-a.liveNow);
 $('n-live').textContent=fmt(data.live.total);$('n-live-sub').textContent='منهم '+fmt(data.live.total-data.live.playing)+' يتصفحون الموقع';
 $('n-play').textContent=fmt(data.live.playing+rbPlaying);$('n-play-sub').textContent='ألعاب الويب '+fmt(data.live.playing)+' · روبلوكس '+fmt(rbPlaying);
 $('n-play-chips').innerHTML=liveGames.map(g=>'<span class="chip">'+esc(g.title)+' · '+fmt(g.liveNow)+'</span>').join('')+data.roblox.filter(x=>x.playing).map(x=>'<span class="chip">'+esc(x.title)+' · '+fmt(x.playing)+'</span>').join('');
 document.querySelectorAll('.rl').forEach(e=>e.textContent=RANGE[r]);$('g-range').textContent=RANGE[r];
 $('t-visits').textContent=fmt(t.visits);$('t-views').textContent=fmt(t.views);
 $('t-plays').textContent=fmt(sum(G,g=>g.plays?.[r]));$('t-min').textContent=fmt(sum(G,g=>g.minutes?.[r]));
 $('t-store').textContent=fmt(sum(G,g=>g.storeClicks?.[r==='month'?'month':'week']));$('t-store-l').textContent=r==='month'?'آخر ٣٠ يوم':'آخر ٧ أيام';
 $('t-peak').textContent=fmt(data.peak.today);$('t-peak-l').textContent='أعلى تواجد اليوم · بالأسبوع '+fmt(data.peak.week);
 const score=g=>g.liveNow*1e6+(g.plays?.[r]||0)*1e3+g.pageViews[r];
 const rows=[...G].sort((a,b)=>score(b)-score(a)),active=rows.filter(g=>score(g)>0),shown=showAll||active.length===0?rows:active;
 $('games').innerHTML=shown.map(g=>gameCard(g).replace('class="game','class="game'+(score(g)?'':' idle'))).join('');
 const hidden=rows.length-shown.length;$('more').hidden=!hidden&&!showAll;$('more').textContent=showAll?'إخفاء الألعاب بدون نشاط':'عرض باقي الألعاب ('+fmt(hidden)+' بدون نشاط '+RANGE[r]+')';
 $('roblox').innerHTML=data.roblox.length?data.roblox.map(x=>'<div class="rbi">'+(x.image?'<img src="'+SITE+esc(x.image)+'" alt="" loading="lazy"/>':'<div></div>')+'<div><b>'+esc(x.title)+'</b>'+(x.error?'<p class="muted" style="margin:4px 0 0">تعذّر الوصول لروبلوكس الحين.</p>':'<dl><dt class="muted">🟢 يلعبون الحين</dt><dd>'+fmt(x.playing)+'</dd><dt class="muted">👣 الزيارات</dt><dd>'+fmt(x.visits)+'</dd><dt class="muted">⭐ المفضلة</dt><dd>'+fmt(x.favorites)+'</dd><dt class="muted">👍 الإعجاب</dt><dd>'+(x.up+x.down?Math.round(x.up/(x.up+x.down)*100)+'٪':'–')+'</dd></dl>')+'</div></div>').join(''):'<div class="empty">قريبًا</div>';
 $('note-roblox').hidden=data.roblox.length>0;
 const Q=G.filter(g=>g.platform==='quest');
 $('quest').innerHTML=Q.map(g=>'<div><small class="muted">'+esc(g.title)+'</small><b class="num">'+fmt(g.pageViews[r])+'</b><small class="muted">زيارة · '+fmt(g.storeClicks?.[r==='month'?'month':'week'])+' ضغطة متجر</small></div>').join('');
 bars('pages',data.pages,x=>pageName(x.route));bars('countries',data.countries,x=>country(x.value));bars('devices',data.devices,x=>DEVICES[x.value]||x.value);bars('refs',data.refs,x=>x.value==='(مباشر)'?'↩︎ مباشر (بدون رابط)':x.value);
 $('daily-table').innerHTML='<thead><tr><th>اليوم</th><th>زيارات</th><th>مشاهدات</th></tr></thead><tbody>'+[...data.daily].reverse().map(x=>'<tr><td>'+x.day+'</td><td>'+fmt(x.visits)+'</td><td>'+fmt(x.views)+'</td></tr>').join('')+'</tbody>';
 chart();$('updated').textContent='مباشر · آخر تحديث '+new Date(data.now).toLocaleTimeString('ar-SA',{hour:'numeric',minute:'2-digit'});
}
async function load(){try{const res=await fetch('/api/summary',{cache:'no-store'});if(!res.ok)throw 0;data=await res.json();$('pill').classList.remove('stale');render();}catch{$('pill').classList.add('stale');$('updated').textContent='ما تحدّث، بنعيد المحاولة';}}
document.querySelectorAll('[data-range]').forEach(b=>b.addEventListener('click',()=>{range=b.dataset.range;document.querySelectorAll('[data-range]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
$('more').addEventListener('click',()=>{showAll=!showAll;render();});
addEventListener('resize',()=>data&&chart());load();setInterval(()=>{if(!document.hidden)load();},30000);
</script></body></html>`;
