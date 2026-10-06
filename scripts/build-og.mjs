// Social card, 1200 × 630: the kit's presents lockup set from its parts, so the
// descriptor reads "A Masters' Union University Fest" (team review, 6 Oct 2026;
// the kit's own artwork says "MU Fest 2027"). Rendered by Chrome for the brand font.
//   node scripts/build-og.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const brand = (p) => `file://${path.join(ROOT, 'public/brand', p)}`;
const ink = (p, color) => `-webkit-mask: url('${brand(p)}') center / contain no-repeat; mask: url('${brand(p)}') center / contain no-repeat; background: ${color};`;
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=block" rel="stylesheet">
<style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#161417;font-family:'Bricolage Grotesque',sans-serif;color:#f8f5ed}
.planet{position:absolute;left:820px;top:-150px;width:560px;aspect-ratio:1.2558;rotate:-14deg;${ink('ill/ringed-planet-2.svg', '#d845fc')}}
.lock{position:absolute;left:0;right:80px;top:150px;display:grid;justify-items:center;gap:14px}
.mu{width:300px;aspect-ratio:4.7847;${ink('logo/mu-logo.svg', '#f8f5ed')}}
.presents{font-size:15px;font-weight:600;letter-spacing:.32em}
.mark{width:820px;aspect-ratio:4.8165;margin-top:6px;${ink('logo/wordmark-horizontal.svg', '#f8f5ed')}}
.fest{font-size:38px;font-weight:650;margin-top:4px}
</style></head><body>
<div class="planet"></div>
<div class="lock"><div class="mu"></div><div class="presents">PRESENTS</div><div class="mark"></div><div class="fest">A Masters' Union University Fest</div></div>
</body></html>`;
const tmp = path.join(ROOT, '.cache/og.html');
fs.mkdirSync(path.dirname(tmp), { recursive: true });
fs.writeFileSync(tmp, html);
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--window-size=1200,630', '--virtual-time-budget=10000', `--screenshot=${path.join(ROOT, 'public/og.png')}`, `file://${tmp}`], { stdio: 'ignore' });
console.log('public/og.png');
