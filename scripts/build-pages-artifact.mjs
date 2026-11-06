import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

// Owner request 2026-11-06 (Search Console: «Indexed, though blocked by robots.txt»): GitHub Pages publishes only this
// folder, so repository source (src/, tests/, scripts/, *.md …) is no longer served and returns 404.
// _site = the Astro build (dist/) + files published earlier that the build no longer produces (.pages-files.json;
// owner rule: never drop a previously published game or policy file) + build-info.json for the live check.
const root = process.cwd(), dist = join(root, 'dist'), out = join(root, '_site');
const rootFiles = new Set(['index.html', '404.html', 'app.js', 'site.css', 'favicon.svg', 'favicon.ico', 'robots.txt', 'sitemap.xml', 'sitemap-index.xml', 'build-info.json', 'CNAME', 'dahrooj-cover.jpg', 'dahrooj-icon.png', 'dahrooj-privacy.html', 'site.webmanifest', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'df1dae49e31b378c3f151625ceca736b.txt']);
const siteDirs = new Set(['assets', 'images', 'projects', 'licenses', '_astro', 'games', 'studio', 'team', 'support', 'contact', 'ar', 'ar-lab', 'roblox', 'en', 'play', '.well-known', 'privacy-policies']);
function safe(path) {
  const parts = String(path).split('/');
  if (path.includes('\\') || parts.some(p => !p || p === '.' || p === '..') || (!rootFiles.has(path) && !siteDirs.has(parts[0]))) throw new Error(`Refusing path outside the site: ${path}`);
  let at = root;
  for (const part of parts) { at = join(at, part); if (existsSync(at) && lstatSync(at).isSymbolicLink()) throw new Error(`Refusing symlink: ${path}`); }
  return path;
}
const walk = (folder, prefix = '') => readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
  if (entry.isSymbolicLink() || !(entry.isDirectory() || entry.isFile())) throw new Error(`Unsupported entry in the build: ${prefix}${entry.name}`);
  return entry.isDirectory() ? walk(join(folder, entry.name), `${prefix}${entry.name}/`) : [safe(prefix + entry.name)];
});

if (!existsSync(join(dist, 'index.html'))) throw new Error('Build the site before assembling the Pages artifact');
const built = walk(dist);
rmSync(out, { recursive: true, force: true });
cpSync(dist, out, { recursive: true });
const retained = [];
for (const path of JSON.parse(readFileSync('.pages-files.json', 'utf8'))) {
  safe(path);
  if (path === 'build-info.json' || built.includes(path) || !existsSync(join(root, path))) continue;
  mkdirSync(dirname(join(out, path)), { recursive: true });
  cpSync(join(root, path), join(out, path));
  retained.push(path);
}
const source = process.env.GITHUB_SHA;
if (source) {
  if (!/^[a-f0-9]{40}$/.test(source)) throw new Error('Invalid source commit');
  writeFileSync(join(out, 'build-info.json'), JSON.stringify({ source }) + '\n');
}
for (const must of ['index.html', '404.html', 'CNAME', 'robots.txt', 'sitemap.xml', 'dahrooj-privacy.html', 'privacy-policies/dahrooj-meta-quest.html']) if (!existsSync(join(out, must))) throw new Error(`Pages artifact lacks ${must}`);
for (const never of ['src', 'tests', 'scripts', 'migration', 'privacy-drafts', 'stats-worker', 'public', 'node_modules', '.github', 'AGENTS.md', 'README.md', 'PUBLISHING.md', 'package.json', 'Text.text']) if (existsSync(join(out, never))) throw new Error(`Repository file in the Pages artifact: ${never}`);
console.log(`Pages artifact: ${built.length} built files + ${retained.length} retained earlier files${retained.length ? ` (${retained.join(', ')})` : ''}.`);
