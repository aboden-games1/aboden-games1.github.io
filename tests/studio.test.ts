import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { loadCatalog } from '../src/lib/catalog.ts';
import {renderHome,renderGames,renderProject,renderStudio,renderTeam,renderSupport,renderContact,renderQuest,renderLicenses,renderAR,toEnglish,renderPlay} from '../src/lib/site.ts';
import {filterProjects,composeMessage} from '../public/app.js';
const read=(p:string)=>readFileSync(p,'utf8');
const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
test('destination game images, domain and policy remain byte-identical',()=>{
 const files=JSON.parse(read('migration/destination-original-sha256.json'));
 for(const name of ['CNAME','dahrooj-cover.jpg','dahrooj-icon.png','dahrooj-privacy.html']){
  assert.equal(hash(name),files[name],name);assert.equal(hash('public/'+name),files[name]);
 }
 assert.equal(hash('public/privacy-policies/dahrooj-meta-quest.html'),files['dahrooj-privacy.html']);
});
test('every migrated source file is retained; game covers, approvals and catalog are byte-identical',()=>{
 const files=JSON.parse(read('migration/source-inventory.json')).files;
 for(const [name,digest] of Object.entries(files)) {
  assert.ok(existsSync(name),`Missing original file: ${name}`);
  if(/^(public\/)?assets\/projects\//.test(name)||/^src\/data\/(catalog|approvals|cover-sources)\.json$/.test(name))assert.equal(hash(name),digest,`Changed protected game content: ${name}`);
 }
});
test('all public studio HTML removes repository links and internal repository names',()=>{
 const pages=[renderHome(),renderGames(),renderStudio(),renderTeam(),renderSupport(),renderContact(),renderQuest(),renderLicenses(),renderAR(),...loadCatalog().map(p=>renderProject(p))];
 for(const html of pages){
  assert.doesNotMatch(html,/href=["'][^"']*(?:github\.com|api\.github\.com|raw\.githubusercontent\.com)/i);
  // The owner-requested tools section may name GitHub as a tool; everything else must not.
  assert.doesNotMatch(html.replace(/<section class="tools"[\s\S]*?<\/section>/,'').replace(/<[^>]*>/g,''),/GitHub|مستودع|3wasfnjd\//i);
  assert.doesNotMatch(html,/\{\{[A-Z_]+\}\}/);
  assert.match(html,/<meta name="robots" content="(?:no)?index, follow/);assert.doesNotMatch(html,/nofollow/);
  assert.doesNotMatch(html,/href="[^"']*(?:privacy-policies|dahrooj-privacy)/);
 }
});
test('game platform sections distinguish touch web games and Quest',()=>{
 const html=renderGames();for(const id of ['web','mobile','quest'])assert.ok(html.includes(`id="${id}"`));
 assert.match(html,/نسخ متصفح/);assert.match(html,/دحروج/);
 const groups=JSON.parse(read('src/data/game-sections.json'));
 assert.deepEqual(Object.keys(groups).sort(),loadCatalog().map(p=>p.slug).sort());
 assert.equal(groups['ar-aboden'].mobile,false);
 // Dahrooj Quest launched on the Meta Horizon Store 2026-10-23: its page links the store listing.
 assert.match(renderQuest(),/href="https:\/\/www\.meta\.com\/experiences\/1436171999570367\/" target="_blank" rel="noopener noreferrer"/);
});
test('contact and support show the studio email as text, no forms',()=>{
 const studio=JSON.parse(read('src/data/studio.json'));
 assert.equal(studio.contactEmail,'aboden.games@gmail.com');assert.equal(studio.supportEmail,'aboden.games@gmail.com');
 const contact=renderContact();assert.doesNotMatch(contact,/<form/);assert.ok(contact.includes('>aboden.games@gmail.com</a>'));assert.match(contact,/راسلنا على الإيميل/);
 const support=renderSupport();assert.doesNotMatch(support,/<form/);assert.ok(support.includes('data-support-mail="aboden.games@gmail.com"'));assert.doesNotMatch(support,/تم الإرسال|أُرسلت بنجاح/);
 assert.deepEqual(studio.team.map((m:any)=>m.name),['عبودين','ناصر','جود','نجد']);
});
test('team story and photo slot render without inventing a photo',()=>{
 const team=renderTeam(),studioPage=renderStudio();
 for(const name of ['عبودين','ناصر','جود','نجد'])assert.ok(team.includes(name));
 assert.match(studioPage,/id="story"/);assert.match(studioPage,/الذكاء الاصطناعي/);
 if(!JSON.parse(read('src/data/studio.json')).familyPhoto)assert.match(team,/صورة الفريق قريبًا/);
});
test('augmented reality has its own page, separate from the games grid',()=>{
 const ar=renderAR(),games=renderGames();
 assert.match(ar,/مختبر عبودين/);assert.match(ar,/الكتابة على الرمل/);
 assert.ok(ar.includes('/ar-lab/arena.html'));assert.doesNotMatch(ar,/3wasfnjd\.github\.io\/AR-Aboden/);
 assert.doesNotMatch(games.split('id="game-grid"')[1].split('</div><div class="empty-state"')[0],/projects\/ar-aboden\//);
 assert.ok(games.includes('href="/ar/"'));assert.ok(renderHome().includes('href="/ar/"'));
});
test('Arabic search intersects text and genre and handles no results',()=>{
 const projects=[{category:'أكشن',search:'بوم BOOM مطاردات'},{category:'قيادة',search:'هجولة Hajwala'}];
 assert.equal(filterProjects(projects,'بُوم','all').length,1);
 assert.equal(filterProjects(projects,'boom','قيادة').length,0);
 assert.equal(filterProjects(projects,'HAJWALA','قيادة').length,1);
 assert.equal(filterProjects(projects,'غير موجود','all').length,0);
});
test('support message includes user-selected details as text',()=>{
 const text=composeMessage({kind:'support',name:'عبدالله',subject:'دحروج — Meta Quest',device:'Quest 3',message:'المشكلة عند البدء'});
 for(const phrase of ['عبدالله','دحروج — Meta Quest','Quest 3','المشكلة عند البدء'])assert.ok(text.includes(phrase));
});
test('AR page lists the lab experiences, mobile only, with designed art and live links',()=>{
 const ar=renderAR(),list=JSON.parse(read('src/data/ar-experiences.json')).experiences;
 assert.equal(list.length,8);
 for(const x of list){assert.ok(ar.includes(x.title));assert.ok(existsSync('public/'+x.image));assert.ok(ar.includes('/ar-lab/'+x.file));assert.ok(existsSync('public/ar-lab/'+x.file));}
 assert.ok(!ar.includes('رماية عبودين'));assert.ok(!existsSync('public/ar-lab/gallery.html'));assert.ok(ar.includes('حرب الألوان AR'));
 assert.equal((ar.match(/data-experience/g)||[]).length,8);assert.equal((ar.match(/للجوال فقط<\/span><a class="card-play"/g)||[]).length,8);
});
test('studio page shows the tools the owner asked for',()=>{
 const html=renderStudio();for(const n of ['Claude','ChatGPT','Gemini','Tripo AI','GitHub'])assert.ok(html.includes(n));
});
test('licences page credits the GPL sand experience',()=>{const html=renderLicenses();assert.match(html,/Sandboard/);assert.ok(html.includes('ar-lab/js/sand/LICENSE.txt'));});
test('every studio page carries the content security policy and referrer policy',()=>{
 for(const html of [renderHome(),renderGames(),renderStudio(),renderTeam(),renderSupport(),renderContact(),renderAR(),renderLicenses()]){
  assert.match(html,/http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self';/);
  assert.match(html,/name="referrer" content="strict-origin-when-cross-origin"/);
 }
 assert.ok(existsSync('public/.well-known/security.txt'));
});
test('English edition: every page fully translated, LTR, linked both ways',()=>{
 const pages=[renderHome(),renderGames(),renderStudio(),renderTeam(),renderSupport(),renderContact(),renderQuest(),renderLicenses(),renderAR(),...loadCatalog().map(p=>renderProject(p))];
 for(const ar of pages){
  assert.match(ar,/class="lang-switch" href="\/en\//);
  const en=toEnglish(ar);
  assert.match(en,/<html lang="en" dir="ltr">/);
  const text=en.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<a class="lang-switch"[^>]*>عربي<\/a>/,'');
  const visible=text.replace(/<[^>]*>/g,' ');
  const attrs=[...text.matchAll(/ (?:alt|aria-label|title|placeholder|content)="([^"]*)"/g)].map(m=>m[1]).join(' ');
  const left=(visible+' '+attrs).match(/[\u0600-\u06FF][^<>"]{0,40}/g);
  assert.equal(left,null,'untranslated: '+(left||[]).slice(0,5).join(' | '));
  assert.match(en,/class="lang-switch" href="\/(?!en\/)[^"]*" hreflang="ar"/);
  assert.doesNotMatch(en.replace(/<a class="lang-switch"[^>]*>عربي<\/a>/,"").replace(/hreflang="ar" href="[^"]*"/,""),/href="\/(games|ar|studio|team|support|contact|licenses|projects)\//);
 }
});
test('games open in their own tab (owner 2026-11-07); old play pages forward there; no github.com links in the studio UI',()=>{
 const games=loadCatalog().filter(p=>p.liveUrl&&p.slug!=='ar-aboden');
 for(const p of games){
  const html=renderPlay(p);
  assert.ok(html.includes(`<meta http-equiv="refresh" content="0; url=${p.liveUrl}"/>`)); // old play links forward to the game (owner 2026-11-07)
  const en=toEnglish(html);assert.match(en,/<html lang="en"/);
  assert.equal((en.replace(/<a class="lang-switch"[^>]*>عربي<\/a>/,'').replace(/<[^>]*>/g,' ').match(/[\u0600-\u06FF]/g)||[]).length,0);
 }
 for(const html of [renderHome(),renderGames(),...games.map(p=>renderProject(p))]){assert.doesNotMatch(html,/href="https?:\/\/(?:www\.)?github\.com/);for(const m of html.matchAll(/href="(https:\/\/3wasfnjd\.github\.io\/[^"]*)"([^>]*)>/g))assert.match(m[2],/target="_blank" rel="noopener noreferrer" data-play=/);}
});
test('search: sitemap lists every indexable page in both languages, play pages stay noindex, JSON-LD is safe',async()=>{
 const {sitemapRoutes,renderSitemap,renderStudioPlay,renderStudioGame,studioGames}=await import('../src/lib/site.ts');
 const xml=renderSitemap('2026-10-21'),routes=sitemapRoutes();
 assert.equal((xml.match(/<url>/g)||[]).length,routes.length*2);
 for(const r of ['','games/','roblox/',...studioGames().map(g=>`games/${g.slug}/`)]){assert.ok(xml.includes(`<loc>https://abodengames.com/${r}</loc>`));assert.ok(xml.includes(`<loc>https://abodengames.com/en/${r}</loc>`));}
 assert.doesNotMatch(xml,/play\/|privacy|ar-lab|404/);
 for(const g of studioGames().filter(g=>g.webUrl))assert.match(renderStudioPlay(g.slug),/content="noindex, follow"/);
 const game=renderStudioGame(studioGames()[0].slug),ld=game.match(/<script type="application\/ld\+json">([^<]*)<\/script>/);
 assert.ok(ld);assert.equal(JSON.parse(ld![1])['@type'],'VideoGame');
});
