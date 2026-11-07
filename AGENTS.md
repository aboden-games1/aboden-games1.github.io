# Aboden Fun World: publishing policy

> **Read `PUBLISHING.md` first.** Owner, 2026-10-21: «من اليوم ورايح بتكون مسؤول عن الموقع … ولن يتم أي شي إلا عن طريقك». It is the rulebook for adding a game, Quest title, AR experience, Roblox item or news item: where each category appears, what the owner must supply, and the build/verify/deploy steps.

- Work only in this repository. Never modify a linked project's repository or deployment.
- The owner must explicitly approve EACH repository before it is added to the website.
- Approval of the design, implementation or publication does NOT approve any repositories.
- `src/data/catalog.json` must contain only exact repositories explicitly recorded in `src/data/approvals.json`.
- Do not discover/import repositories at runtime, call the GitHub API from the browser, or publish pending/private repository metadata.
- Record each approval with its exact repository, date and a faithful description of the owner's instruction. Do not invent approval.
- Use actual screenshots/assets from approved projects. No invented gameplay, reviews, player counts, compatibility badges, or working launch links.
- A project without a verified live URL has no play/open action. Never substitute its GitHub source URL as a play link.
- The owner requested completing publication on 2026-10-02. Screenshot approval originally covered nine projects; subsequent removal leaves eight currently approved repositories in approvals.json.
- Owner instruction: «احذف الرماية بالواقع المعزز». AR-Shooter must stay out of the directory, search, detail routes, published covers and license source list unless explicitly reapproved. Do not delete or modify its original repository.
- Owner instruction: «عدل صورة هجولة وحط صورة الواجهه للعبه اللي فيها شاص». Use the actual Hajwala images/menu/menu-bg.jpg artwork, verified against its source Git blob. Do not invent artwork or use the old racetrack screenshot.
- ~~Keep preview mode and noindex until public indexing is explicitly approved.~~ Superseded 2026-10-21: the owner opened search indexing (see the last section).
- Pages is deployed by GitHub Actions (Settings → Pages → Source: GitHub Actions; owner request 2026-11-06 after Search Console «Indexed, though blocked by robots.txt»). `deploy.yml` validates, builds Astro, assembles `_site/` with `scripts/build-pages-artifact.mjs` (the build + files published earlier that `.pages-files.json` lists) and deploys only that, so repository files are never served (they answer 404). The generated root HTML/CSS/JS in the repository is the last branch-published copy, kept as a fallback (switching Source back to «Deploy from a branch», main, root, serves it); it is no longer updated.
- Edit `src/` and `public/`, NOT generated root HTML/CSS/JS. `scripts/sync-pages.mjs` belongs to the old branch publishing and is no longer run.
- Keep Arabic RTL/mobile-first design. Respect browser zoom and reduced-motion preferences.
- Run `npm test` and `npm run build` before release. Do not bypass approval validation.
- The portal itself is not a project card. Future repositories still require explicit approval.

- Owner-approved Dahrooj artwork exception: the owner attached 074E9DC1-BAAC-4DF1-9681-28DA210356C9.jpeg and explicitly requested replacing its portal cover. Use public/assets/projects/dahrooj-poster-80d2b29c.jpeg with the SHA-256 recorded in cover-sources.json. This is approved promotional artwork, not an in-game screenshot. Do not regenerate or replace it with another poster; retain the full composition. This does not authorize game-repository changes.

## Owner-authorized studio migration — 2026-10-15

- The owner explicitly requested copying this site to `aboden-games1/aboden-games1.github.io`, redesigning it as the official studio, and retaining EVERY game/policy file. The source repository and linked game repositories must remain untouched.
- Preserve `dahrooj-cover.jpg`, `dahrooj-icon.png`, `dahrooj-privacy.html`, and the existing CNAME byte-for-byte. Keep the old privacy URL working. Its identical organized copy lives in `public/privacy-policies/dahrooj-meta-quest.html`.
- Privacy pages must not appear in navigation, game cards, search results or sitemap. Direct policy links must remain available for stores.
- Never delete any game/policy file during builds or migration. The sync script now retains previous generated files.
- No repository/source links or internal repository names in public site UI. Preserve legally required attribution text.
- The Meta Quest Dahrooj content was already on the destination site at af212c4. Its inclusion is preservation of existing studio content, not approval to import a new repository.
- Use the exact approved white/navy logo and Cairo fonts. Contact details and team members must come from the owner; never invent a working inbox or send-success state.
- Indexing: see the 2026-10-21 section. Run npm test, npm run build, and python3 scripts/verify-build.py before release.

## Owner instructions — 2026-10-15 (story, team, AR, accent)

- Team provided by the owner: عبودين (design and programming with AI assistance) and the owner's children ناصر وجود ونجد (game idea and play style). Do not add other members or invent bios.
- Family image: the owner supplied an illustration on 2026-10-15, stored as `public/assets/team/aboden-family.webp`. Use only owner-supplied images here; never substitute a stock or self-generated image.
- Augmented-reality experiences have their own page at `/ar/`, separate from the games grid. Owner instruction 2026-10-15: «انقل قائمة تجارب المختبر بأوصافها وروابطها وصمم لها صور», mobile only, both shooting experiences shown. Data in `src/data/ar-experiences.json` (verbatim from the lab index), designed art in `public/assets/ar/`.
- Accent colour `--accent:#ff8a3d` (sunset orange) is approved to break the navy/white palette; use it for highlights only.

## Design refresh — 2026-10-15

- Owner asked for better image layout/quality, smaller typography and less all-navy background. Overrides live in `public/assets/refresh.css` (loaded last): fluid type scale, 4:5 poster cards (whole artwork kept with a blurred fill), sand-coloured bands (`.band-sand`).
- Owner allowed taking images from the game repositories or designing new ones. Higher-resolution copies and the designed AR-lab poster live in `public/assets/posters/`; each is recorded in `src/data/poster-sources.json` and wired through `poster`/`art` in `game-sections.json`. Original `assets/projects/` covers stay byte-identical.
- Team portraits (`public/assets/team/{aboden,nasser,joud,najd}.webp`; Joud and Najd replaced by the owner's new individual cards on 2026-10-16) are each member's full quadrant of the owner-supplied team illustration, frame and details intact, transparent background kept (WebP with alpha; never flatten to a square), no face crops, no upscaling. Show them small. The group illustration is not shown on the team page.
- ~~Search indexing stays off (noindex) until the owner says the site is finished.~~ Opened by the owner 2026-10-21.
- AR lab hosted here (owner instruction 2026-10-15: «التجارب انقل الصفحة لنفس المستودع وخليها بنفس الهوية»): the lab's runtime files from 3wasfnjd/AR-Aboden@56a234f live in `public/ar-lab/` and are served at `/ar-lab/`. Each page links `ar-lab/brand.css` (Cairo, navy/orange, branded way back to `/ar/`) and is noindex; `ar-lab/index.html` redirects to `/ar/`. Licence files (including the GPL-3.0 sand experience notice) are kept. The original repository stays untouched.
- Tools section on the studio page (owner request 2026-10-15): Claude, ChatGPT, Gemini, Tripo AI, GitHub from `src/data/tools.json`; logos from simple-icons where available, a plain name badge otherwise. The domain registrar logo is pending until the owner names the registrar.
- Owner instruction 2026-10-15 (later): «الرماية احذفها» — the «رماية عبودين» shooting-gallery experience (and its CC BY duck model) is removed from `/ar-lab/`, the AR page and the published root. «حرب الألوان AR» stays. The AR-lab card description is overridden in `game-sections.json` so it no longer lists shooting. The sand experience (GPL-3.0) is credited on the licences page.
- Studio email (owner, 2026-10-15): aboden.games@gmail.com for contact and support. Forms still only open the visitor's mail app with a prepared message; never claim the site sent it.
- Hardening (owner request 2026-10-15): every studio page sends a Content-Security-Policy meta (scripts only from this site, no plugins, no foreign base/form targets) and a strict referrer policy; `app.js` refuses to render inside another site's frame; `/.well-known/security.txt` names the studio email; GitHub Actions are pinned to commit SHAs and Dependabot watches npm and actions. Do not add inline scripts or third-party scripts to studio pages without updating the CSP. Privacy pages stay byte-identical (no CSP added there).
- Character cut-outs (owner-supplied, 2026-10-15) in `public/assets/characters/`, one per page and never grouped: Aboden in Quest 3 → home hero beside «اللعب يبدأ بفكرة» (replaces the old logo scene); Nasser with controller → games page; girl drawing (pink) → contact; girl pointing (purple) → support. Owner confirmed: جود is the pink girl (drawing), نجد is the purple girl (pointing).
- Contact and support pages (owner, 2026-10-15): no forms — the studio email is shown as text with a short paragraph on what to write. On support, a `?game=` link from a game page puts the game name into the email subject.
- deploy.yml skips publishing when main has already moved past the run's commit (the newer queued run publishes), so back-to-back merges no longer fail with rejected pushes or verification timeouts.
- The AR lab has no detail page of its own (owner, 2026-10-15): its card and launch link go to `/ar/#experiences`, and `/projects/ar-aboden/` only forwards there.
- Bilingual site (owner, 2026-10-15: «خلي الموقع عربي انجليزي»): Arabic stays at `/`, English lives at `/en/` (LTR). English pages are the Arabic render passed through `toEnglish()` with `src/data/i18n-en.json` (exact Arabic text → English). Every header has an EN/عربي switch and hreflang alternates. When you add or change Arabic UI text, add its English to `i18n-en.json`; a test fails if any Arabic text is left on an English page. AR-lab experience pages and privacy pages stay Arabic-only.
- Dahrooj Meta Quest art (owner, 2026-10-15): the owner's key art `assets/posters/dahrooj-quest-keyart.webp` replaces `dahrooj-cover.jpg` wherever the Quest edition is shown; the owner's presentation sheet `dahrooj-quest-presskit.webp` is on the Quest page. `dahrooj-cover.jpg` stays in place byte-identical (store/privacy links may use it). The web Dahrooj card keeps its approved poster.
- Owner clarified 2026-10-16: «لا، تختلف الويب عن الميتا» — the web Dahrooj card keeps its own approved poster; only the Meta Quest edition uses the key art. (Supersedes the brief same-art change.)
- Play pages (owner, 2026-10-16: replace anything that sends players to GitHub with the official site): every «العب الآن» goes to `/play/<slug>/` (and `/en/play/<slug>/`), which runs the game's live URL in a full-height iframe under the studio header (`renderPlay`). The CSP allows `frame-src https://3wasfnjd.github.io` only. No studio page may link to a github.io/github.com URL (tested); licence/attribution notices and lab runtime asset fetches are the only GitHub references left.
- Brand Kit v1 (owner, 2026-10-16: no brand page, use it only to polish the site): the kit's symbol pattern (`public/assets/brand/pattern.svg`, transparent tile) is a faint texture on the footer, platform strip, contact banner and play bar; icons for Quest/VR, AR, play and mail use the kit's UI icon shapes at its 1.8 stroke.
- Privacy policy update (owner, 2026-10-18): the owner supplied a new Dahrooj Meta Quest privacy policy (bilingual, effective 17 Oct 2026). It replaces both `public/dahrooj-privacy.html` and `public/privacy-policies/dahrooj-meta-quest.html` byte-for-byte; the expected SHA-256 in `migration/destination-original-sha256.json` is updated and the previous hash kept as "superseded". Both URLs stay live and must remain identical.

## Owner instruction — 2026-10-20 (Mafateeh)

- «الان نبي نضيفه في موقع عبودين قيمز»: the owner's Meta Quest game «مفاتيح — Mafateeh», released on the Meta Horizon Store on 2026-10-20 (https://www.meta.com/experiences/app/1431517553369145/), is added as the second Meta Quest game: a card in the games page's Quest section, a related card on the AR page, and its own page at `/games/mafateeh/` (and `/en/games/mafateeh/`). Data in `studio.json` → `mafateeh`.
- Images: the owner's key art (`assets/posters/mafateeh-quest-keyart.webp`) and the five store screenshots the owner captured on the headset (`mafateeh-quest-shot-1..5.webp`), each recorded in `poster-sources.json`. Like Dahrooj Quest, this is studio content shown by the owner's instruction, not a repository imported into the catalog; no repository link appears on the site.

## Owner instruction — 2026-10-20 (Roblox section)

- «ابي تضيف قسم جديد خاص بروبلكس بالموقع», then «اي قسم جديد مابات والالعاب — لا صور حقيقيه لروبلكس — لاتختلق»: `/roblox/` (and `/en/roblox/`) is a section for the studio's Roblox MAPS and GAMES, in the header nav and as a banner on the games page. Items come from `src/data/roblox-maps.json` (`items`, each with `kind` map|game) and each list shows «قريبًا» until the owner gives an item's name, its Roblox link and its real images.
- Never invent a map, game, link, image, description or claim for this section; no designed, generated or stand-in art (the earlier voxel poster was removed at the owner's word). The page notes that Roblox is a trademark of Roblox Corporation and the studio is not affiliated.

## Mafateeh in the browser — 2026-10-21

- Owner: «نقدر نحول مفاتيح ويب بنفس التصميم والديزاين والالغاز» then «في الويب ابيها مجانيه بعد عادي». The Quest game's own web build (built and deployed by the game's repository) is played free at `/play/mafateeh/` (`renderMafateehPlay`, iframe of `studio.json` `mafateeh.webUrl`). Its Quest page, games card and home feature link to it.
- Mafateeh is not a catalog project (catalog, approvals and cover sources are protected); do not add it there to get a play page.

## Owner instruction — 2026-10-21 (Battleship)

- «أبي أضيف لعبة جديدة لموقع عبودين قيمز» → «لعبة البارجه» → «اكتبها انت وارفع اللعبه للموقع»: the owner's web game «البارجة الحربية — Battleship» is added as a featured card at the top of the games page's web section and in the mobile list, with its own page `/games/battleship/` (and `/en/games/battleship/`) and a play page `/play/battleship/` (`renderBattleshipPlay`, iframe of `studio.json` `battleship.webUrl`). Release date 2026-10-21. The owner asked Claude to write its description and how-to-play (the how-to line is the game's own in-game text).
- Images: the owner-supplied poster (`assets/posters/battleship-poster.webp`) and six actual captures of the released web build (`battleship-shot-1..6.webp`; shot 6 added with the reconnaissance drone, owner «عدل حسب التعديل الاخير», 2026-10-21), each recorded in `poster-sources.json`. Like Mafateeh, not a catalog project (catalog, approvals and cover sources are protected); no repository link appears on the site.

- verify-build.py now fails the build if any /en/ page still shows Arabic text (outside the language switch); add missing strings to src/data/i18n-en.json.

- Home «جديد» bar (owner 2026-10-21: «الرئيسيه فقط / تمام / بدون», then «نزلها تحت البنر الرئيسي … تحت عبودين قيمز»): right under the header (first thing in main) on the home page only, no close button. Items live in src/data/news.json (newest first; currently Battleship, Mafateeh, Boulevard Jood); app.js rotates them every 5 s. Add each new item's English to i18n-en.json.

## Owner instruction — 2026-10-21 («عدل ووائم كل شي بالموقع»)

- Studio games (owner's own titles outside the protected catalog) now live in `src/data/studio-games.json` (moved from `studio.json` `quest`/`mafateeh`/`battleship`, texts unchanged). One entry builds `/games/<slug>/` (`renderStudioGame`, generic `games/[slug].astro`), `/play/<slug>/` when `webUrl` is set (shared `play/[slug].astro`), and its listings: web → featured card (newest by `released`), web grid + search + genre filter, mobile list (`mobile`), home grid; quest → Quest section, AR page related card (`mixedReality`). Detail pages rendered byte-identical to the previous hand-written ones.
- Battleship now appears in the home grid and the searchable games grid (genre «حرب»). Footer gained the Roblox link. Support FAQ's Meta Quest answer covers Dahrooj and Mafateeh.

## Owner instruction — 2026-10-21 (security + search engines)

- «الان ابيك تحمي الموقع وسد اي ثغرات … وابدا في نشر الموقع في محركات البحث». Studio pages now send `index, follow, max-image-preview:large`; play pages (`/play/…`), the AR-lab redirect project page and 404 are `noindex, follow`; AR-lab apps keep their own noindex. Privacy policies are not in the sitemap and stay byte-identical.
- `sitemap.xml` (built by `src/pages/sitemap.xml.ts` from `sitemapRoutes()`) lists every indexable page in Arabic and English with hreflang alternates (incl. x-default → Arabic). `verify-build.py` fails if it lists a missing or noindex page, or if robots.txt blocks the site.
- `robots.txt` allows the whole site and names the sitemap. It blocks nothing: since 2026-11-06 Pages publishes only the build (`_site/`), so repository files answer 404 (owner request after Search Console «Indexed, though blocked by robots.txt»; the old Disallow lines were removed so Google can see the 404s). Do not add Disallow lines for repository paths again.
- Structured data (JSON-LD, data only, CSP-safe, `<` escaped): Organization + WebSite on home, VideoGame on each game page (only facts on the page); English pages get it translated via `toEnglish()`. Game pages use their key art as `og:image`.
- IndexNow: key file `public/df1dae49e31b378c3f151625ceca736b.txt`; deploy.yml pings api.indexnow.org with the sitemap URLs after each verified publish (Bing, Yandex, Seznam, Naver). Google needs Search Console verification by the owner (pending: owner to add the property; a verification meta/file can be added on request).
- Security: `npm audit fix` (dev-server Vite/launch-editor advisories; 0 left). No secrets in the repository. Workflows keep least-privilege permissions and SHA-pinned actions.

## Owner instruction — 2026-10-22 (Roblox: عالم نجد)

- «اضفها للموقع ماب جديد روبلكس»: the Roblox experience «عالم نجد — Najd's Toybox» is first in `/roblox/` experiences, with the owner's key art (`assets/roblox/najd-toybox.webp`, `imagePosition` keeps its title in view) and two more owner images under the card (`shots` → `.roblox-gallery`, uncropped). Description verbatim from the owner, one paragraph per line; no age rating given, none shown. Share link without its tracking `stamp`.
- It leads the home «جديد» bar; Boulevard Jood left the bar (3-item limit) and stays on `/roblox/`.

## Owner instruction — 2026-10-22 (home «تحت الأضواء»)

- «الموقع جديد ممكن الان نطلع العاب الرئيسيه بعدين نحصرها على الجديد دحروج ومفاتيح والبارجة»: the spotlight now shows Dahrooj Quest, Mafateeh, Battleship, driven by `spotlight` in `studio-games.json` (`order`, `badge`, `line`, `play`, `poster`). Later it is to show only the newest additions, when the owner says. Dahrooj and Mafateeh render as before; Battleship's tall poster is shown whole on a blurred copy (`.feature-poster`). Section note now «OUR GAMES / WEB + META QUEST».
- 2026-10-22 «بعطيك صوره غيرها»: the owner's wide Battleship key art (`assets/posters/battleship-keyart.webp`, recorded in poster-sources.json) replaces the tall poster in the spotlight (`spotlight.art`); the poster stays on the game page and cards.

## Owner message — 2026-10-23 (Dahrooj on the Meta Horizon Store)

- «هذا رابط لعبة دحروج اليوم تم الاطلاق في متجر ميتا كويست بقيمة 7.99»: `dahrooj-quest` gets `storeUrl` (https://www.meta.com/experiences/app/1436171999570367/, tracking parameters dropped), `released` 2026-10-23 and `price` 7.99 USD (currency assumed from the store; owner to confirm). Its page shows the store button and price, the Quest card a release line, JSON-LD an Offer. It leads the «جديد» bar (Mafateeh left the bar) and takes the «جديد على Meta Quest» spotlight badge from Mafateeh.
- 2026-10-23, owner promo text (AR/EN): Dahrooj page shows two offers from `page.promos` — the 15-minute free trial and Black Friday 40% off with code BF2026 (23 Nov – 2 Dec 2026). `ends` → `data-ends`, and app.js hides an offer after that day (Riyadh time); remove it from the data after it ends. Price $7.99 confirmed. The «جديد» line mentions the free trial.
- 2026-10-23: owner replaced the Dahrooj store link with https://www.meta.com/experiences/1436171999570367/.

## Owner instruction — 2026-10-25 (Kassab)

- «https://3wasfnjd.github.io/Kassab/ اضفها» with ten gameplay captures and the title screen: «كسّاب — Kassab» is a studio web game (`studio-games.json`, genre قيادة, touch). Description, controls and features are taken from the game repository's own README; the title-screen dedication «اهداء لصديقي ابوحصه» is the about note. Poster = title screen; ten captures in the gallery (sources in poster-sources.json). `released` is the day it was added to the site. It is the newest web game, so it takes the featured card at the top of the web section, and it leads the «جديد» bar (Mafateeh-era items rotate out). Not added to the spotlight (owner decides).
- Gallery CSS: with an even number of shots the last spans the full width.
- 2026-10-25 «اكتب نبذة اهدا من الاستديو لصديقي محمد العمر ابوحصة صاحب كساب»: the Kassab about note is now the studio's dedication to Mohammed Al-Omar «Abu Hessa».
- 2026-10-25 «استبدلها بالبوستر»: Kassab's poster is now the owner's wide key art (`assets/posters/kassab-keyart.webp`; the title-screen poster is removed). Web games with landscape key art get `.is-wide` layouts: full-width art on the game page, a wider half in the featured card.
- 2026-10-25 «عدل معاد فيه فرمل وهاند بريك»: Kassab how-to no longer mentions brake or handbrake (the game has only the gas button).
- 2026-10-25 «الاهداء ارفعه فوق البوستر»: Kassab's dedication moved from the about section to just above the poster (`page.dedication` in studio-games.json, any studio game can use it).
- 2026-10-25 «عدل طعوس الهجولة الى تطعيس كساب في اي مكان في الصفحه»: Kassab says «تطعيس» instead of «هجولة» everywhere (tagline «تطعيس كسّاب.», description, about text, image alts, «جديد» bar); English "dune bashing".
- 2026-10-25 the owner sent the about text with its first paragraph starting «هجولة بكساب في طعوس طبيعية»; used as given (the other two paragraphs were unchanged).
- 2026-10-27 «نقدر نسوي لوحة تحكم ونشوف كم عدد زيارات العابنا وكم لاعب حاليا داخلها» → proposal approved «كاملة»: owner-only dashboard in `stats-worker/` (Cloudflare Worker), site counter in `public/app.js` switched on by `src/data/stats.json` endpoint; cookie-free, no IPs, honours GPC/DNT. Setup steps in `stats-worker/README.md`. Roblox numbers need each item's `placeId`.
- 2026-10-27 owner added the Cloudflare secrets («تم»); Worker deployed at https://aboden-stats.3wasf-njd1.workers.dev, site counter switched on (`src/data/stats.json`). Roblox placeIds still to come from the owner.
- 2026-10-27 «ضبطها لي وخليها بشكل مرتب والوان»: dashboard redesigned — coloured «now» cards, colour per tile/section, game cards with their posters (images from abodengames.com), flags for countries, idle games folded away.
- 2026-10-27 «التنبيهات نزلها عن الطبلون»: every explanatory note moved into one «ملاحظات» card at the bottom of the dashboard; the red error banner became a red state of the «مباشر» pill.
- 2026-11-06 Search Console «تمت فهرسة الصفحة على الرغم من حظرها بواسطة ملف robots.txt» → owner switched Settings → Pages → Source to GitHub Actions; `deploy.yml` deploys only the build (repository files 404, verified live), then robots.txt lost its Disallow lines. Owner then presses «Validate fix» in Search Console.
- 2026-11-06 «اضف فقط ذيبان وصدى» (after the repository report): Theeban (3wasfnjd/Theeban) and Sada (3wasfnjd/Sada) added as studio web games; text from their READMEs, images are in-game captures of the released builds (poster-sources.json). verify.yml now checks every studio web game's play URL answers 200.
- 2026-11-07 «توقف صدى لا ترفعها للموقع … تم تعديلها الى اسم طيف» + https://3wasfnjd.github.io/Tayf-Puzzle/: Sada replaced by Tayf (طيف, repo 3wasfnjd/Tayf-Puzzle); Sada's page, play page and images removed. Images are in-game captures of the Tayf web build.
- 2026-11-07 «نبي نخلي امكانية مل الشاشه ومايطلع هيدر الموقع» → approved «الزر مع ملء الشاشة التلقائي»: the play-page full-screen button shows on every device (real full screen where allowed, else body.play-immersive hides the header and bar; ✕ tab on the right edge leaves it), and a phone held sideways shows only the game automatically (refresh.css). This re-adds the 2026-10-28 landscape rule the owner had reverted, now at his request.
