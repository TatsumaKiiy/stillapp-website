// Rend calendrier.html (écrit par generer.py) en PNG à 3× : node rendre.js <dossier>
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 402, height: 600 }, deviceScaleFactor: 3 });
  await p.goto('file://' + process.argv[2] + '/calendrier.html');
  await p.evaluate(() => document.fonts.ready);
  const el = await p.$('#ecran');
  await el.screenshot({ path: process.argv[2] + '/calendrier@3x.png' });
  const box = await el.boundingBox(); console.log('taille css', box.width, box.height);
  await b.close();
})();
