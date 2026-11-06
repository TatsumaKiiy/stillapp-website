/* Alvéo · stillapp.fr — accueil. Ni stockage, ni requête, ni son, ni vibration ; l'état vit en mémoire. */
(() => {
'use strict';
const d = document, html = d.documentElement, heros = d.getElementById('respirer');
if (!heros) return;
const $ = (s, r = heros) => r.querySelector(s);
const $$ = (s, r = heros) => [...r.querySelectorAll(s)];
const mq = q => (window.matchMedia ? matchMedia(q) : { matches: false });
const surChangement = (m, f) => { if (m.addEventListener) m.addEventListener('change', f); else if (m.addListener) m.addListener(f); };

// Courbes exactes de React Native
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = t => ((ax * t + bx) * t + cx) * t, sy = t => ((ay * t + by) * t + cy) * t;
  const dsx = t => (3 * ax * t + 2 * bx) * t + cx;
  return x => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) { const e = sx(t) - x, dd = dsx(t); if (Math.abs(e) < 1e-6 || Math.abs(dd) < 1e-6) break; t -= e / dd; }
    let lo = 0, hi = 1;
    if (Math.abs(sx(t) - x) > 1e-5) { t = x; while (hi - lo > 1e-6) { if (sx(t) < x) lo = t; else hi = t; t = (lo + hi) / 2; } }
    return sy(t);
  };
}
const ease = bezier(0.42, 0, 1, 1); // Easing.ease
const E = t => (t < 0.5 ? ease(t * 2) / 2 : 1 - ease((1 - t) * 2) / 2); // inOut(ease)
const sortieDouce = bezier(0, 0, 0.58, 1), retourDoux = bezier(0.33, 1, 0.68, 1);

const reduit = mq('(prefers-reduced-motion: reduce)'), pointeurFin = mq('(hover: hover) and (pointer: fine)');
const grandEcran = mq('(min-width: 64rem)');
const OI = 'IntersectionObserver' in window, INERT = 'inert' in HTMLElement.prototype;

const orbe = $('.orbe'), scene = $('.heros__scene'), boutonOrbe = $('.orbe-bouton'), satellite = $('.satellite');
const mots = $$('.demo__mot span'), decomptes = $$('.demo__decompte'), minuteur = $('.demo__minuteur');
const remplissage = $('.demo__barre span'), progression = $('.demo__progression');
const pause = $('.demo__pause'), fermer = $('.demo__fermer'), finTitre = $('.demo__fin-titre');
const annonces = d.getElementById('annonces'), zoneBadge = $('.heros__action');
const groupeRepos = $$('.r').filter(el => el.tagName !== 'H1'); // le h1 reste lisible
const groupeMarche = $$('.d'), groupeFin = $$('.f');
const nom = (el, texte) => { el.querySelector('.vh').textContent = texte; };
const nomsDeDepart = () => { nom(fermer, 'Arrêter la minute'); nom(pause, 'Pause'); };

/* Démo : repos → mise en place (600 ms) → respiration (12 × 5 s) → fin ; pause ; retour (400 ms) */
const PHASE = 5000, PHASES = 12, TOTAL = PHASE * PHASES, K_MIN = 0.565, K_MAX = 1, K_FIN = 0.75, K_REPOS = 0.92;
let etat = 'repos', cause = null, t = 0, t0 = null, phase = 0, raf = 0;
let k = 1, o = 1, lum = 1, lumActive = false;
let base = null, tween = null, fondu = null; // départ de phase, animation, fondu du mot
let minMiseEnPlace = 0, minRetour = 0, minAnnonce = 0, minRamenee = 0, dernierS = -1, dernierN = -1, dernierC = -1;
let verrou = null, reposManuel = false, ratioScene = 1, ramenee = false;
// Part visible de la scène
function partVisible() {
  const r = scene.getBoundingClientRect(), h = innerHeight || html.clientHeight;
  return r.height > 0 ? Math.max(0, Math.min(r.bottom, h) - Math.max(r.top, 0)) / r.height : 1;
}

function poser() {
  orbe.style.setProperty('--k', k.toFixed(4));
  orbe.style.setProperty('--o', o.toFixed(4));
  if (lumActive) orbe.style.setProperty('--lum', lum.toFixed(4)); else orbe.style.removeProperty('--lum');
}
const motDe = i => (i % 2 === 0 ? 'Inspire' : 'Expire');
const baseDePhase = i => (i % 2 === 0 ? { p0: 0, k0: K_MIN, o0: 0.85, l0: 0.55 } : { p0: 0, k0: K_MAX, o0: 1, l0: 1 });
const baseActuelle = p => ({ p0: p, k0: k, o0: o, l0: lumActive ? lum : o });
const enMarche = () => etat === 'mise-en-place' || etat === 'respiration' || etat === 'pause';

function changerEtat(e) {
  etat = e;
  heros.dataset.etat = e;
  heros.dataset.mode = enMarche() ? 'marche' : e === 'fin' ? 'fin' : 'repos';
  inertes();
  majAppel();
  majRepos();
}

// Effacés = inertes (repli : aria-hidden, tabindex=-1)
function rendreInerte(el, oui) {
  if (INERT) { el.inert = oui; return; }
  const F = 'button,a[href],[tabindex]', T = 'data-tabindex';
  if (oui) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden');
  (el.matches(F) ? [el] : $$(F, el)).forEach(c => {
    const v = c.getAttribute(T);
    if (oui) { if (v === null) c.setAttribute(T, c.getAttribute('tabindex') || ''); c.setAttribute('tabindex', '-1'); }
    else if (v !== null) { if (v) c.setAttribute('tabindex', v); else c.removeAttribute('tabindex'); c.removeAttribute(T); }
  });
}
function inertes() {
  const repos = etat === 'repos' || etat === 'retour', marche = enMarche(), fin = etat === 'fin';
  groupeRepos.forEach(el => rendreInerte(el, !repos));
  groupeMarche.forEach(el => rendreInerte(el, !marche));
  groupeFin.forEach(el => rendreInerte(el, !fin));
  rendreInerte(fermer, !(marche || fin));
}

// Boucle unique ; le temps vient de l'horodatage de l'image
function boucle(maintenant) {
  raf = 0;
  let encore = false;
  if (tween) {
    if (tween.debut === null) tween.debut = maintenant;
    const x = Math.min(1, (maintenant - tween.debut) / tween.duree), y = tween.courbe(x), v = c => tween.de[c] + (tween.a[c] - tween.de[c]) * y;
    k = v('k'); o = v('o'); lum = v('lum');
    if (x < 1) encore = true; else tween = null;
  }
  if (etat === 'respiration') {
    if (t0 === null) t0 = maintenant - t;
    t = maintenant - t0;
    if (t >= TOTAL) { t = TOTAL; afficherTemps(PHASES - 1, 1); poser(); finir(); return; }
    const i = Math.floor(t / PHASE), p = (t - i * PHASE) / PHASE;
    if (i !== phase) { phase = i; base = baseDePhase(i); changerMot(motDe(i)); annoncer(motDe(i)); marquer('phase-' + i); }
    calculer(p, i % 2 === 0);
    afficherTemps(i, p);
    encore = true;
  }
  if (fondu) { avancerFondu(maintenant); if (fondu) encore = true; }
  poser();
  if (encore && !raf) raf = requestAnimationFrame(boucle);
}
const lancerBoucle = () => { if (!raf) raf = requestAnimationFrame(boucle); };
const arreterBoucle = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };

// k = kDépart + (cible − kDépart) × E(p), rebasé en cours de phase
function calculer(p, inspire) {
  const e0 = E(base.p0), f = base.p0 >= 1 ? 1 : (E(p) - e0) / (1 - e0);
  if (reduit.matches) {
    k = 1; o = 1; lumActive = true;
    lum = base.l0 + ((inspire ? 1 : 0.55) - base.l0) * f; // la lumière guide
  } else {
    lumActive = false;
    k = base.k0 + ((inspire ? K_MAX : K_MIN) - base.k0) * f;
    o = base.o0 + ((inspire ? 1 : 0.85) - base.o0) * f;
  }
}
function animerVers(cible, duree, courbe) {
  tween = { debut: null, duree, courbe, de: { k, o, lum: lumActive ? lum : o }, a: cible };
  lancerBoucle();
}

const deux = n => (n < 10 ? '0' : '') + n;
function afficherTemps(i, p) {
  const s = Math.ceil((TOTAL - t) / 1000), n = Math.min(6, Math.floor(i / 2) + 1), c = Math.max(1, 5 - Math.floor(p * 5));
  if (s !== dernierS) { minuteur.textContent = deux(Math.floor(s / 60)) + ':' + deux(s % 60); dernierS = s; }
  remplissage.style.transform = 'scaleX(' + (t / TOTAL).toFixed(5) + ')';
  if (n !== dernierN) { progression.textContent = 'Respiration ' + n + ' sur 6'; dernierN = n; }
  if (c !== dernierC) { decomptes.forEach(el => { el.textContent = c; }); dernierC = c; }
}
function remettreTemps() {
  t = 0; phase = 0; dernierS = dernierN = dernierC = -1;
  minuteur.textContent = '01:00';
  remplissage.style.transform = 'scaleX(0)';
  progression.textContent = 'Respiration 1 sur 6';
  decomptes.forEach(el => { el.textContent = ''; });
}

// Mot-guide : fondus de 200 puis 300 ms en inOut(ease), dans la boucle (150 ms en mouvement réduit)
const ecrireMot = (texte, op) => mots.forEach(el => { if (texte !== null) el.textContent = texte; el.style.opacity = op; });
function changerMot(texte) {
  if (d.hidden) { fondu = null; ecrireMot(texte, '1'); return; } // onglet masqué : pas d'image
  const op = parseFloat(mots[0].style.opacity), o0 = isFinite(op) ? op : 1;
  const sortie = !mots[0].textContent || reduit.matches ? 0 : 200;
  fondu = { debut: null, texte, o0, sortie, entree: reduit.matches ? 150 : 300, change: false };
  lancerBoucle();
}
function avancerFondu(maintenant) {
  const f = fondu;
  if (f.debut === null) f.debut = maintenant;
  const ecoule = maintenant - f.debut;
  if (ecoule < f.sortie) { ecrireMot(null, (f.o0 * (1 - E(ecoule / f.sortie))).toFixed(3)); return; }
  const p = Math.min(1, (ecoule - f.sortie) / f.entree);
  ecrireMot(f.change ? null : f.texte, E(p).toFixed(3));
  f.change = true;
  if (p >= 1) fondu = null;
}
function viderMot() {
  fondu = null;
  ecrireMot('', '0');
}
// Vider puis remplir : deux annonces identiques sont lues
function annoncer(texte) {
  clearTimeout(minAnnonce);
  annonces.textContent = '';
  minAnnonce = setTimeout(() => { annonces.textContent = texte; }, 60);
}
// Marques de recette (critère 19)
function marquer(n) {
  try { if (n === 'debut') performance.clearMarks(); performance.mark('alveo-' + n); } catch (e) { /* absente */ }
}

// Écran gardé allumé (sans l'API, la pause couvre le verrouillage)
function demanderVerrou() {
  if (verrou || !navigator.wakeLock) return;
  try {
    navigator.wakeLock.request('screen').then(v => {
      if (etat !== 'mise-en-place' && etat !== 'respiration') { v.release().catch(() => {}); return; }
      verrou = v;
      v.addEventListener('release', () => { if (verrou === v) verrou = null; });
    }).catch(() => {});
  } catch (e) { /* refusé */ }
}
function relacherVerrou() {
  if (!verrou) return;
  const v = verrou;
  verrou = null;
  v.release().catch(() => {});
}

function lireEchelle() {
  const r = /matrix\(([^,]+),/.exec(getComputedStyle(orbe).transform || ''), v = r ? parseFloat(r[1]) : 1;
  return isFinite(v) ? Math.min(1, Math.max(0.5, v)) : 1;
}

// REPOS ou FIN → MISE EN PLACE
function lancer() {
  if (etat !== 'repos' && etat !== 'fin') return;
  demanderVerrou();
  clearTimeout(minRetour);
  if (etat === 'repos') { k = lireEchelle(); o = 1; lumActive = false; }
  tween = null;
  poser(); // échelle du moment, avant l'arrêt du repos
  remettreTemps();
  viderMot();
  nomsDeDepart();
  changerEtat('mise-en-place');
  marquer('debut');
  d.addEventListener('keydown', surTouche);
  pause.focus({ preventScroll: true });
  if (reduit.matches) { k = 1; o = 1; lum = 0.55; lumActive = true; poser(); }
  else animerVers({ k: K_MIN, o: 0.85, lum: 0.85 }, 600, sortieDouce);
  clearTimeout(minRamenee);
  ramenee = false;
  if (partVisible() < 0.5 && scene.scrollIntoView) {
    // On ramène l'orbe sous les yeux ; ce défilement-là ne met pas en pause
    ramenee = true;
    scene.scrollIntoView({ block: 'center', behavior: reduit.matches ? 'auto' : 'smooth' });
    minRamenee = setTimeout(() => {
      ramenee = false;
      if (etat === 'respiration' && partVisible() < 0.5) pauser('defilement');
    }, 1200);
  }
  clearTimeout(minMiseEnPlace);
  minMiseEnPlace = setTimeout(() => respirer(0, true), 600);
}

// Depuis le début de la phase ; à la reprise, l'échelle part de sa valeur en pause
function respirer(depuis, premiereFois) {
  clearTimeout(minMiseEnPlace);
  tween = null;
  phase = depuis;
  t = depuis * PHASE;
  if (premiereFois) {
    k = reduit.matches ? 1 : K_MIN; o = reduit.matches ? 1 : 0.85; lum = 0.55; lumActive = reduit.matches;
    base = baseDePhase(0);
  } else base = baseActuelle(0);
  t0 = null;
  cause = null;
  nom(pause, 'Pause');
  changerEtat('respiration');
  changerMot(motDe(depuis));
  annoncer(premiereFois ? 'Une minute de respiration commence. Inspire.' : 'Reprise. ' + motDe(depuis) + '.');
  marquer('phase-' + depuis);
  lancerBoucle();
  if (premiereFois && !ramenee && partVisible() < 0.5) pauser('defilement');
}

function pauser(c) {
  if (etat === 'mise-en-place') { clearTimeout(minMiseEnPlace); tween = null; t = 0; phase = 0; }
  else if (etat !== 'respiration') return;
  arreterBoucle();
  cause = c;
  nom(pause, 'Reprendre');
  changerEtat('pause');
  changerMot('En pause');
  relacherVerrou();
  const n = Math.ceil((TOTAL - t) / 1000);
  annoncer('En pause. Il reste ' + n + ' ' + (n > 1 ? 'secondes.' : 'seconde.'));
}
function reprendre() {
  if (etat !== 'pause') return;
  demanderVerrou();
  respirer(phase, false);
}

function finir() {
  arreterBoucle();
  fondu = null;
  relacherVerrou();
  minuteur.textContent = '00:00';
  remplissage.style.transform = 'scaleX(1)';
  nom(fermer, 'Fermer');
  marquer('fin');
  changerEtat('fin');
  if (reduit.matches) { tween = null; k = 1; o = 1; lum = 1; lumActive = true; poser(); }
  else { lumActive = false; animerVers({ k: K_FIN, o: 1, lum: 1 }, 1000, sortieDouce); }
  finTitre.focus({ preventScroll: true });
  annoncer('Six respirations. La minute est terminée. Continue dans l’app.');
}

// ✕, Échap, « Fermer » → RETOUR (400 ms) → REPOS
function arreter() {
  if (etat === 'repos' || etat === 'retour') return;
  const depuisFin = etat === 'fin';
  const actif = d.activeElement, focusIci = !actif || actif === d.body || heros.contains(actif); // parti lire ailleurs : le focus y reste
  clearTimeout(minMiseEnPlace);
  clearTimeout(minRamenee);
  ramenee = false;
  arreterBoucle();
  relacherVerrou();
  d.removeEventListener('keydown', surTouche);
  cause = null;
  changerEtat('retour');
  viderMot();
  lumActive = false;
  if (reduit.matches) { tween = null; k = 1; o = 1; poser(); }
  else animerVers({ k: K_REPOS, o: 1, lum: 1 }, 400, retourDoux);
  if (focusIci) boutonOrbe.focus({ preventScroll: partVisible() >= 0.5 }); // orbe hors écran : ramenée sous les yeux
  if (!depuisFin) annoncer('Minute arrêtée.');
  clearTimeout(minRetour);
  minRetour = setTimeout(versRepos, reduit.matches ? 0 : 400);
}
function versRepos() {
  tween = null;
  arreterBoucle();
  ['--k', '--o', '--lum'].forEach(p => orbe.style.removeProperty(p));
  lumActive = false; k = 1; o = 1;
  remettreTemps();
  nomsDeDepart();
  changerEtat('repos');
}

function surTouche(e) {
  if (e.key === 'Escape' && etat !== 'repos' && etat !== 'retour') { e.preventDefault(); arreter(); }
}
boutonOrbe.addEventListener('click', lancer);
$$('.demo__recommencer').forEach(b => b.addEventListener('click', lancer)); // mobile et ordinateur
fermer.addEventListener('click', arreter);
pause.addEventListener('click', () => { if (etat === 'respiration') pauser('manuelle'); else if (etat === 'pause') reprendre(); });

// Mouvement réduit en direct, sans saut
surChangement(reduit, () => {
  if (etat === 'respiration') {
    const i = Math.floor(t / PHASE), p = Math.min(1, (t - i * PHASE) / PHASE);
    if (reduit.matches) { k = 1; lum = lumActive ? lum : o; o = 1; lumActive = true; } else lumActive = false;
    base = baseActuelle(p);
  } else if (etat === 'pause' || etat === 'mise-en-place') {
    if (reduit.matches) { lum = lumActive ? lum : o; k = 1; o = 1; lumActive = true; tween = null; }
    else { o = lumActive ? lum : o; lumActive = false; }
  } else if (etat === 'fin') {
    tween = null;
    if (reduit.matches) { k = 1; o = 1; lum = 1; lumActive = true; } else { k = K_FIN; o = 1; lumActive = false; }
  } else return;
  poser();
});

/* Orbe au repos : satellite, hors écran (< 10 %), onglet masqué */
const majRepos = () => heros.classList.toggle('heros--fige', reposManuel || ratioScene < 0.1 || d.hidden);
function majSatellite() {
  satellite.classList.toggle('satellite--lecture', reposManuel);
  nom(satellite, reposManuel ? 'Relancer l’orbe' : 'Mettre l’orbe en pause');
}
satellite.addEventListener('click', () => { if (etat === 'repos') { reposManuel = !reposManuel; majSatellite(); majRepos(); } });
if (OI) {
  new IntersectionObserver(entrees => {
    entrees.forEach(en => { ratioScene = en.isIntersecting ? en.intersectionRatio : 0; });
    majRepos();
    if (ratioScene >= 0.5) { ramenee = false; clearTimeout(minRamenee); }
    else if (etat === 'respiration' && !ramenee) pauser('defilement');
    majAppel();
  }, { threshold: [0, 0.1, 0.5, 1] }).observe(scene);
}

// Onglet masqué, page quittée : pause, jamais de reprise automatique
const quitter = () => { if (etat === 'respiration' || etat === 'mise-en-place') pauser('onglet'); arreterHeure(); };
d.addEventListener('visibilitychange', () => {
  if (d.hidden) quitter(); else { majHeure(); armerHeure(); }
  majRepos();
});
addEventListener('pagehide', quitter);
addEventListener('pageshow', e => {
  if (!e.persisted) return;
  if (etat === 'retour') versRepos();
  poserMaintenant(); majRepos(); majHeure(); armerHeure(); majAppel();
});

/* Dock et pilule de l'en-tête (§ 3.11) */
const dock = d.getElementById('dock'), piluleEntete = $('.pilule--entete', d), piluePrix = $('.pilule--prix', d);
const installer = d.getElementById('installer'), appelFinal = installer && installer.querySelector('.appel');
const MARGE_APPEL = 96; // 6 rem : l'appel s'efface avant que le bloc d'action final n'entre dans la fenêtre
let badgeVisible = true, prixVisible = false;
// Position réelle : un saut (Fin, ancre) peut franchir le bloc sans croiser de seuil
const appelAtteint = () => !!appelFinal && appelFinal.getBoundingClientRect().top < (innerHeight || html.clientHeight) + MARGE_APPEL;
function majAppel() {
  const lecture = etat === 'pause' && cause === 'defilement', demo = enMarche() && !lecture;
  // Sous 64 rem, le badge est masqué pendant la démo : en pause au défilement, sa zone ne retient plus l'appel
  const badge = badgeVisible && !(lecture && ratioScene < 0.5 && !grandEcran.matches);
  const visible = OI && !badge && !demo && !prixVisible && !appelAtteint();
  html.classList.toggle('montre-appel', visible);
  if (dock) rendreInerte(dock, !visible);
  if (piluleEntete) rendreInerte(piluleEntete, !visible);
}
const observer = (el, f, options) => { if (OI && el) new IntersectionObserver(e => { f(e[e.length - 1]); majAppel(); }, options).observe(el); };
observer(zoneBadge, en => { badgeVisible = en.isIntersecting; });
observer(piluePrix, en => { prixVisible = en.isIntersecting; });
observer(appelFinal, () => {}, { rootMargin: '0px 0px ' + MARGE_APPEL + 'px 0px' });
observer($('.pied', d), () => {});
observer($('.sentinelle', d), en => html.classList.toggle('defile', !en.isIntersecting)); // verre dès 24 px
surChangement(grandEcran, majAppel);

/* « Pour maintenant » : heure locale, rien n'est envoyé */
function momentPour(date) {
  const h = date.getHours();
  if (date.getDay() === 0 && h >= 9 && h <= 20) return 'dimanche';
  return h <= 1 || h >= 21 ? 'lit' : h <= 4 ? 'nuit' : h <= 8 ? 'reveil' : h <= 10 ? 'reunion' : h <= 12 ? 'acceleration' : h <= 16 ? 'dejeuner' : 'travail';
}
function poserMaintenant() {
  const ancienne = $('.maintenant', d), li = $('.moment[data-moment="' + momentPour(new Date()) + '"]', d);
  if (!li || (ancienne && ancienne.parentNode === li)) return;
  if (ancienne) ancienne.remove();
  const p = d.createElement('p');
  p.className = 'maintenant';
  p.innerHTML = '<svg class="mo" aria-hidden="true"><use href="#mo"/></svg>Pour maintenant';
  li.prepend(p);
}
poserMaintenant();

/* « Il est 15 h 12 », juste à la minute */
const heure = d.getElementById('heure');
let minHeure = 0, installerProche = false;
function majHeure() {
  const n = new Date();
  if (heure) heure.textContent = 'Il est ' + n.getHours() + ' h ' + deux(n.getMinutes());
}
function arreterHeure() { clearTimeout(minHeure); minHeure = 0; }
function armerHeure() {
  arreterHeure();
  if (!installerProche || d.hidden) return;
  const n = new Date();
  minHeure = setTimeout(() => { majHeure(); armerHeure(); }, 60050 - n.getSeconds() * 1000 - n.getMilliseconds());
}
majHeure();
observer(installer, en => { installerProche = en.isIntersecting; if (installerProche) { majHeure(); armerHeure(); } else arreterHeure(); }, { rootMargin: '0px 0px 200px 0px' });

/* Android, indice, bande des écrans */
if (/Android/i.test(navigator.userAgent)) { $('.heros__android').hidden = false; html.classList.add('android'); }
const indice = d.getElementById('indice');
const majIndice = () => { indice.textContent = (pointeurFin.matches ? 'Clique sur' : 'Touche') + ' l’orbe : une minute, ici, sans son.'; };
majIndice();
surChangement(pointeurFin, majIndice);

// Focalisable seulement si elle défile
const bande = $('.bande', d), etiquette = bande && bande.getAttribute('aria-label');
let minBande = 0;
function majBande() {
  minBande = 0;
  if (!bande) return;
  const defile = bande.scrollWidth > bande.clientWidth + 1;
  ['tabindex', 'aria-label'].forEach((a, i) => { if (defile) bande.setAttribute(a, i ? etiquette : '0'); else bande.removeAttribute(a); });
}
majBande();
addEventListener('resize', () => { if (!minBande) minBande = requestAnimationFrame(majBande); }, { passive: true });

heros.dataset.mode = 'repos';
majSatellite();
inertes();
majRepos();
})();
