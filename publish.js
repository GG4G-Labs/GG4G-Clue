#!/usr/bin/env node
'use strict';

// Publishes the clue photo: copies it beside index.html as photo.jpg (or
// photo.png), points the page at it with a fresh version so no phone shows a
// cached older picture, commits, pushes, and waits until GitHub Pages serves
// it. Run by "Publish clue photo.bat"; needs git with push access to
// GG4G-Labs/GG4G-Clue, which Git for Windows' credential manager remembers
// after the first push.
//
//   node publish.js <photo.jpg|photo.png>

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HERE = __dirname;
const SITE = 'https://gg4g-labs.github.io/GG4G-Clue/';
const BIG_MB = 8;

function fail(msg) {
  console.error('\n  ' + msg + '\n');
  process.exit(1);
}
function git(...args) {
  return execFileSync('git', args, { cwd: HERE, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

const src = process.argv[2];
if (!src) fail('Drop a photo onto "Publish clue photo.bat", or double-click it and pick one.');
if (!fs.existsSync(src)) fail(`There is no file at ${src}`);
const ext = path.extname(src).toLowerCase();
if (!['.jpg', '.jpeg', '.png'].includes(ext)) fail('The photo must be a .jpg or .png.');
const mb = fs.statSync(src).size / 1048576;
if (mb > BIG_MB) console.log(`  The photo is ${mb.toFixed(1)} MB. It will work, but it is slow on mobile data; a phone's "medium" size is plenty.`);

// Up to date first, so a push from another machine is never fought.
try { git('pull', '--rebase', '--quiet'); } catch (e) { fail('Could not update from GitHub. Is this PC online?\n  ' + (e.stderr || e.message)); }

const name = ext === '.png' ? 'photo.png' : 'photo.jpg';
for (const old of ['photo.jpg', 'photo.png']) if (old !== name && fs.existsSync(path.join(HERE, old))) fs.unlinkSync(path.join(HERE, old));
fs.copyFileSync(src, path.join(HERE, name));

const stamp = Date.now();
const indexPath = path.join(HERE, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const next = html.replace(/(<!-- PHOTO --><img id="photo" src=")[^"]*(")/, `$1${name}?v=${stamp}$2`);
if (next === html) fail('index.html has lost its <!-- PHOTO --> marker, so the page cannot be pointed at the photo.');
fs.writeFileSync(indexPath, next);

try {
  git('add', '-A', '.');
  git('commit', '-q', '-m', `Clue photo ${new Date(stamp).toISOString().slice(0, 16).replace('T', ' ')}`);
  git('push', '--quiet');
} catch (e) {
  fail('Could not send the photo to GitHub.\n  ' + (e.stderr || e.message));
}
console.log('  Sent. Waiting for the page to update (usually under a minute)...');

(async () => {
  const want = `${SITE}${name}?v=${stamp}`;
  const until = Date.now() + 4 * 60000;
  while (Date.now() < until) {
    try {
      const page = await (await fetch(`${SITE}?check=${Date.now()}`, { cache: 'no-store' })).text();
      if (page.includes(`v=${stamp}`) && (await fetch(want, { method: 'HEAD' })).ok) {
        console.log(`\n  Live: ${SITE}\n  Scan the label's QR code on a phone to check.\n`);
        return;
      }
    } catch (e) { /* not yet, or offline for a moment */ }
    await new Promise((r) => setTimeout(r, 5000));
  }
  console.log(`\n  Sent, but the page had not updated after 4 minutes. Open ${SITE} in a moment and check the photo.\n`);
})();
