// Indonesia in Numbers — entry program (Node 22, standard library only).
//
// The site is this repository's app/ folder: plain static files a browser opens
// at app/index.html (HTML pages, one stylesheet, three scripts, no build step),
// its figures held in app/data.js with a source and a year each. Nothing the
// site runs, styles or shows loads over the network.
//
// The program hands the site in: it copies app/ and screenshots/ from beside
// this file to /output and writes /output/dossier.json — the screenshots, the
// first load's files and bytes, and the source the judge reads — with the
// vendored make.fun library. Leave vendor/makefun-frontend.ts as it is: the
// scorer requires dossier.json to be byte for byte what its own copy writes.
//
// Serve it locally with any static server over app/ (for example
// `python3 -m http.server --directory app`), then open http://localhost:8000.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function countFiles(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    total += entry.isDirectory() ? countFiles(path) : 1;
  }
  return total;
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(out, 'dossier.json'), dossier);

const appFiles = countFiles(join(out, 'app'));
const shotFiles = readdirSync(join(out, 'screenshots')).filter((f) => {
  return statSync(join(out, 'screenshots', f)).isFile();
});
console.log(
  `Indonesia in Numbers: ${appFiles} files in app/, ${shotFiles.length} screenshots, ` +
  `dossier.json ${dossier.length} bytes -> ${out}`,
);
