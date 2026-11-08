/* Alvéo · stillapp.fr — accueil. Ni stockage, ni requête, ni son, ni vibration ; l'état vit en mémoire. */
(() => {
'use strict';
const d = document, html = d.documentElement, heros = d.getElementById('respirer');
html.classList.add('js');
const mq = q => (window.matchMedia ? matchMedia(q) : { matches: false });
const surChangement = (m, f) => { if (m.addEventListener) m.addEventListener('change', f); else if (m.addListener) m.addListener(f); };
const reduit = mq('(prefers-reduced-motion: reduce)'), pointeurFin = mq('(hover: hover) and (pointer: fine)'), large = mq('(min-width: 48rem)'), ordinateur = mq('(min-width: 64rem)');
const OI = 'IntersectionObserver' in window, INERT = 'inert' in HTMLElement.prototype;
const $all = (s, r = d) => [...r.querySelectorAll(s)];
// Les lectures de mise en page attendent la première image : le script ne force jamais le premier calcul
const apresPremiereImage = f => requestAnimationFrame(() => setTimeout(f, 0));

// Effacés = inertes (repli : aria-hidden, tabindex=-1)
function rendreInerte(el, oui) {
  if (!el) return;
  if (INERT) { el.inert = oui; return; }
  const F = 'button,a[href],[tabindex],summary', T = 'data-tabindex';
  if (oui) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden');
  (el.matches(F) ? [el] : $all(F, el)).forEach(c => {
    const v = c.getAttribute(T);
    if (oui) { if (v === null) c.setAttribute(T, c.getAttribute('tabindex') || ''); c.setAttribute('tabindex', '-1'); }
    else if (v !== null) { if (v) c.setAttribute('tabindex', v); else c.removeAttribute('tabindex'); c.removeAttribute(T); }
  });
}

/* ========== En-tête : verre dès 24 px ========== */
function majDefile() { html.classList.toggle('defile', (scrollY || 0) > 24); }
// lire scrollY au démarrage forcerait le premier calcul de mise en page : on attend la première image
apresPremiereImage(majDefile);

/* ========== Démo « J'ai 1 minute » (moteur v1, mise en scène v2) ========== */
let majParticules = () => {};
if (heros) (() => {
  const $ = (s, r = heros) => r.querySelector(s);
  const $$ = (s, r = heros) => [...r.querySelectorAll(s)];
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
  const sortieDouce = bezier(0, 0, 0.58, 1), retourDoux = bezier(0.33, 1, 0.68, 1), epanouir = bezier(0.23, 1, 0.32, 1);

  const orbe = $('.orbe'), coeur = $('.coeur'), piece = $('.piece'), scene = $('.heros__scene'), bloc = $('.heros__orbe'), lumiere = $('.heros__lumiere');
  const boutonOrbe = $('.orbe-bouton'), consigne = $('.orbe-bouton__indice'), satellite = $('.satellite');
  const mots = $$('.demo__mot span'), decomptes = $$('.demo__decompte'), minuteur = $('.demo__minuteur');
  const remplissage = $('.demo__barre span'), progression = $('.demo__progression');
  const pause = $('.demo__pause'), fermer = $('.demo__fermer'), finTitre = $('.demo__fin-titre');
  const annonces = d.getElementById('annonces'), entete = d.querySelector('.entete');
  const groupeRepos = $$('.r'), groupeMarche = $$('.d'), groupeFin = $$('.f');
  const nom = (el, texte) => { el.querySelector('.vh').textContent = texte; };
  const nomsDeDepart = () => { nom(fermer, 'Arrêter la minute'); nom(pause, 'Pause'); };

  /* Repos → mise en place (600 ms) → respiration (12 × 5 s) → fin ; pause ; retour (400 ms) */
  const PHASE = 5000, PHASES = 12, TOTAL = PHASE * PHASES, K_MIN = 0.565, K_MAX = 1, K_FIN = 0.9, K_REPOS = 0.92;
  let etat = 'repos', cause = null, t = 0, t0 = null, phase = 0, raf = 0;
  let k = 1, o = 1, lum = 1, lumActive = false;
  let base = null, tween = null, fondu = null, glisse = null;
  let minMiseEnPlace = 0, minRetour = 0, minAnnonce = 0, minRamenee = 0, dernierS = -1, dernierN = -1, dernierC = -1;
  let verrou = null, reposManuel = false, ratioScene = 1, ramenee = false;

  function partVisible() {
    const r = scene.getBoundingClientRect(), h = innerHeight || html.clientHeight;
    return r.height > 0 ? Math.max(0, Math.min(r.bottom, h) - Math.max(r.top, 0)) / r.height : 1;
  }
  // Chaque image ne touche que transform et opacity, posés sur l'élément lui-même : aucune variable héritée,
  // aucun calque repeint. Mouvement normal : l'orbe entière grossit et s'éclaire ; réduit : seuls le cœur et la pièce.
  // La lueur de la pièce suit le souffle (0,35 à l'expire, 0,65 à l'inspire), en mouvement normal et pendant la
  // respiration seulement : une seule opacité écrite, sur l'élément lui-même ; ailleurs, la feuille de style décide.
  let ecritK = null, ecritO = null, ecritL = null, ecritP = null;
  function poser() {
    const tk = 'scale(' + k.toFixed(4) + ')', to = lumActive ? '' : o.toFixed(4), tl = lumActive ? lum.toFixed(4) : '';
    const tp = etat === 'respiration' && !reduit.matches ? (0.35 + 0.3 * Math.max(0, Math.min(1, (k - K_MIN) / (K_MAX - K_MIN)))).toFixed(3) : '';
    if (tk !== ecritK) { orbe.style.transform = tk; ecritK = tk; }
    if (to !== ecritO) { orbe.style.opacity = to; ecritO = to; }
    if (tl !== ecritL) { coeur.style.opacity = tl; piece.style.opacity = tl; ecritL = tl; }
    if (tp !== ecritP) { if (tp) lumiere.style.opacity = tp; else lumiere.style.removeProperty('opacity'); ecritP = tp; }
  }
  const motDe = i => (i % 2 === 0 ? 'Inspire' : 'Expire');
  const baseDePhase = i => (i % 2 === 0 ? { p0: 0, k0: K_MIN, o0: 0.85, l0: 0.55 } : { p0: 0, k0: K_MAX, o0: 1, l0: 1 });
  const baseActuelle = p => ({ p0: p, k0: k, o0: o, l0: lumActive ? lum : o });
  const enMarche = () => etat === 'mise-en-place' || etat === 'respiration' || etat === 'pause';

  // Sur ordinateur, l'orbe glisse au centre de la pièce pendant la minute (600 ms), puis revient plus vite (450 ms) ;
  // transform seul, et un nouveau glissement repart de la position affichée (interruptible)
  function glisser(avant, duree) {
    if (glisse) { glisse.cancel(); glisse = null; }
    const apres = bloc.getBoundingClientRect(), dx = avant.left - apres.left, dy = avant.top - apres.top;
    if ((Math.abs(dx) < 1 && Math.abs(dy) < 1) || !bloc.animate) return;
    try {
      glisse = bloc.animate([{ translate: dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px' }, { translate: '0px 0px' }], { duration: duree, easing: 'cubic-bezier(.77,0,.175,1)' });
      glisse.onfinish = () => { glisse = null; };
    } catch (e) { glisse = null; }
  }
  // Pendant la minute, l'en-tête s'efface ; à la fin, il revient (la pilule se retire tant que le badge est visible).
  // Pendant la minute et à la fin, le reste de la page est inerte : la tabulation reste dans la pièce.
  const autres = $all('.evitement, main > section:not(#respirer), .pied', d);
  function changerEtat(e) {
    const mode = e === 'mise-en-place' || e === 'respiration' || e === 'pause' ? 'marche' : e === 'fin' ? 'fin' : 'repos';
    const avant = mode !== heros.dataset.mode && ordinateur.matches && !reduit.matches ? bloc.getBoundingClientRect() : null;
    etat = e;
    heros.dataset.etat = e;
    heros.dataset.mode = mode;
    heros.classList.toggle('en-pause', e === 'pause');
    html.classList.toggle('minute', mode === 'marche');
    rendreInerte(entete, mode === 'marche');
    inertes();
    majRepos();
    if (avant) glisser(avant, mode === 'repos' ? 450 : 600);
  }
  function inertes() {
    const repos = etat === 'repos' || etat === 'retour', marche = enMarche(), fin = etat === 'fin';
    groupeRepos.forEach(el => rendreInerte(el, !repos));
    groupeMarche.forEach(el => rendreInerte(el, !marche));
    groupeFin.forEach(el => rendreInerte(el, !fin));
    rendreInerte(fermer, !(marche || fin));
    autres.forEach(el => rendreInerte(el, marche || fin));
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
    if (c !== dernierC) { decomptes.forEach(el => { el.textContent = reduit.matches ? c : ''; }); dernierC = c; }
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
    if (d.hidden) { fondu = null; ecrireMot(texte, '1'); return; }
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
  function viderMot() { fondu = null; ecrireMot('', '0'); }
  // Vider puis remplir : deux annonces identiques sont lues
  function annoncer(texte) {
    clearTimeout(minAnnonce);
    annonces.textContent = '';
    minAnnonce = setTimeout(() => { annonces.textContent = texte; }, 60);
  }
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
    poser();
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
    // sur ordinateur, la minute se compose en haut de la page (l'orbe au centre de la pièce) : on y remonte
    const remonter = ordinateur.matches && (scrollY || 0) > 2;
    if ((remonter || partVisible() < 0.5) && scene.scrollIntoView) {
      ramenee = true;
      if (remonter) scrollTo({ top: 0, behavior: reduit.matches ? 'auto' : 'smooth' });
      else scene.scrollIntoView({ block: 'center', behavior: reduit.matches ? 'auto' : 'smooth' });
      minRamenee = setTimeout(() => {
        ramenee = false;
        if (etat === 'respiration' && partVisible() < 0.5) pauser('defilement');
      }, 1200);
    }
    clearTimeout(minMiseEnPlace);
    minMiseEnPlace = setTimeout(() => respirer(0, true), 600);
  }
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
    dernierC = -1;
    nom(pause, 'Pause');
    changerEtat('respiration');
    changerMot(motDe(depuis));
    annoncer(premiereFois ? 'Une minute de respiration commence. Inspire.' : 'Reprise au début de l’' + motDe(depuis).toLowerCase() + '.');
    marquer('phase-' + depuis);
    lancerBoucle();
    if (premiereFois && !ramenee && partVisible() < 0.5) pauser('defilement');
  }
  // En pause, le minuteur garde le temps réellement restant ; la reprise repart du début de la phase, et la pause le dit
  function pauser(c) {
    if (etat === 'mise-en-place') { clearTimeout(minMiseEnPlace); tween = null; t = 0; phase = 0; }
    else if (etat !== 'respiration') return;
    arreterBoucle();
    cause = c;
    afficherTemps(phase, Math.max(0, (t - phase * PHASE) / PHASE));
    const reprise = 'Reprise au début de l’' + motDe(phase).toLowerCase();
    decomptes.forEach(el => { el.textContent = reprise; });
    dernierC = -1;
    nom(pause, 'Reprendre');
    changerEtat('pause');
    changerMot('En pause');
    relacherVerrou();
    const n = Math.ceil((TOTAL - t) / 1000);
    annoncer('En pause, il reste ' + n + ' ' + (n > 1 ? 'secondes. ' : 'seconde. ') + reprise + '.');
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
    else { lumActive = false; animerVers({ k: K_FIN, o: 1, lum: 1 }, 1200, epanouir); }
    finTitre.focus({ preventScroll: true });
    annoncer('Six respirations. La minute est terminée. Continue sur ton iPhone.');
  }
  // ✕, Échap, « Fermer » → RETOUR (400 ms) → REPOS
  function arreter() {
    if (etat === 'repos' || etat === 'retour') return;
    const depuisFin = etat === 'fin';
    const actif = d.activeElement, focusIci = !actif || actif === d.body || heros.contains(actif);
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
    if (focusIci) boutonOrbe.focus({ preventScroll: partVisible() >= 0.5 });
    if (!depuisFin) annoncer('Minute arrêtée.');
    clearTimeout(minRetour);
    minRetour = setTimeout(versRepos, reduit.matches ? 0 : 400);
  }
  function versRepos() {
    tween = null;
    arreterBoucle();
    [orbe, coeur, piece].forEach(el => { el.style.removeProperty('transform'); el.style.removeProperty('opacity'); });
    ecritK = ecritO = ecritL = null;
    lumActive = false; k = 1; o = 1;
    remettreTemps();
    nomsDeDepart();
    changerEtat('repos');
  }
  function surTouche(e) {
    if (e.key === 'Escape' && etat !== 'repos' && etat !== 'retour') { e.preventDefault(); arreter(); }
  }
  boutonOrbe.addEventListener('click', lancer);
  $$('.demo__recommencer').forEach(b => b.addEventListener('click', lancer));
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
    dernierC = -1;
    poser();
  });

  /* Le reflet suit le pointeur (ordinateur, souris) : le cœur de l'orbe se décale de ±8 px, au repos seulement,
     amorti dans le temps (k = 1 − e^(−dt/120 ms)) ; rien n'est lu dans la mise en page */
  let rx = 0, ry = 0, cx = 0, cy = 0, rafC = 0, tC = 0;
  const reflet = () => pointeurFin.matches && !reduit.matches && etat === 'repos' && !reposManuel && !d.hidden && ratioScene > 0;
  function suivre(maintenant) {
    rafC = 0;
    const dt = tC ? Math.min(64, maintenant - tC) : 16, a = 1 - Math.exp(-dt / 120), on = reflet();
    tC = maintenant;
    const gx = on ? rx : 0, gy = on ? ry : 0;
    cx += (gx - cx) * a; cy += (gy - cy) * a;
    const fini = Math.abs(gx - cx) < 0.05 && Math.abs(gy - cy) < 0.05;
    if (fini) { cx = gx; cy = gy; tC = 0; }
    if (cx || cy) coeur.style.translate = cx.toFixed(2) + 'px ' + cy.toFixed(2) + 'px'; else coeur.style.removeProperty('translate');
    if (!fini) rafC = requestAnimationFrame(suivre);
  }
  const relancerReflet = () => { if (!rafC && (reflet() || cx || cy)) rafC = requestAnimationFrame(suivre); };
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    rx = (e.clientX / (innerWidth || 1) - 0.5) * 16; ry = (e.clientY / (innerHeight || 1) - 0.5) * 16;
    if (reflet()) relancerReflet();
  }, { passive: true });

  /* Orbe au repos : pastille pause (bouton bascule), hors écran (< 10 %), onglet masqué */
  const majRepos = () => { heros.classList.toggle('heros--fige', reposManuel || ratioScene < 0.1 || d.hidden); majParticules(); relancerReflet(); };
  function majSatellite() {
    satellite.setAttribute('aria-pressed', String(reposManuel));
    html.classList.toggle('calme', reposManuel);
  }
  satellite.addEventListener('click', () => { if (etat === 'repos') { reposManuel = !reposManuel; majSatellite(); majRepos(); } });
  if (OI) {
    new IntersectionObserver(entrees => {
      entrees.forEach(en => { ratioScene = en.isIntersecting ? en.intersectionRatio : 0; });
      majRepos();
      if (ratioScene >= 0.5) { ramenee = false; clearTimeout(minRamenee); }
      else if (etat === 'respiration' && !ramenee) pauser('defilement');
    }, { threshold: [0, 0.1, 0.5, 1] }).observe(scene);
  }
  const quitter = () => { if (etat === 'respiration' || etat === 'mise-en-place') pauser('onglet'); };
  d.addEventListener('visibilitychange', () => { if (d.hidden) quitter(); majRepos(); });
  addEventListener('pagehide', quitter);
  addEventListener('pageshow', e => { if (!e.persisted) return; if (etat === 'retour') versRepos(); majRepos(); });

  // Une seule consigne, un seul verbe, celui du pointeur ; la ligne sous l'orbe ne fait que préciser
  const majConsigne = () => { if (consigne) consigne.textContent = (pointeurFin.matches ? 'Cliquer' : 'Toucher') + ' pour commencer'; };
  majConsigne();
  surChangement(pointeurFin, majConsigne);

  /* Particules : la poussière dorée de l'app, canvas léger (1×, 30 images/s), seulement l'orbe visible et au repos */
  const toile = heros.querySelector('.particules');
  let ctx = null, grains = [], rafP = 0, tP = 0, tDessin = 0, W = 0, H = 0, particulesActives = false;
  // la toile couvre le héros (100svh) : la taille de la fenêtre suffit, sans lire la mise en page
  function dimensionner() {
    W = innerWidth || 1; H = innerHeight || 1;
    toile.width = W; toile.height = H;
  }
  function semer() {
    grains = [];
    const n = large.matches ? 44 : 26;
    for (let i = 0; i < n; i++) grains.push({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.1, v: 3 + Math.random() * 5, a: 0.12 + Math.random() * 0.38, s: Math.random() * 6.28, w: 0.3 + Math.random() * 0.5 });
  }
  function dessiner(dt) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#F0D5BC';
    for (const g of grains) {
      if (dt) { g.y -= (g.v * dt) / H; g.s += g.w * dt; if (g.y < -0.02) { g.y = 1.02; g.x = Math.random(); } }
      const x = g.x * W + Math.sin(g.s) * 6, y = g.y * H, bord = Math.min(1, y / 80, (H - y) / 80);
      ctx.globalAlpha = g.a * Math.max(0, bord);
      ctx.beginPath(); ctx.arc(x, y, g.r, 0, 6.2832); ctx.fill();
    }
  }
  function boucleP(maintenant) {
    rafP = 0;
    if (!particulesActives) return;
    rafP = requestAnimationFrame(boucleP);
    if (tDessin && maintenant - tDessin < 32) return; // 30 images/s suffisent à une poussière qui monte de 3 à 8 px/s
    const dt = tP ? Math.min(0.05, (maintenant - tP) / 1000) : 0;
    tP = maintenant; tDessin = maintenant;
    dessiner(dt);
  }
  majParticules = () => {
    if (!ctx) return;
    const veut = !reduit.matches && !d.hidden && ratioScene > 0 && !reposManuel && etat === 'repos';
    if (veut && !particulesActives) { particulesActives = true; tP = 0; tDessin = 0; if (!rafP) rafP = requestAnimationFrame(boucleP); }
    else if (!veut && particulesActives) { particulesActives = false; if (rafP) cancelAnimationFrame(rafP); rafP = 0; }
  };
  if (toile && toile.getContext) apresPremiereImage(() => {
    ctx = toile.getContext('2d', { alpha: true });
    if (!ctx) return;
    dimensionner(); semer(); dessiner(0);
    toile.classList.add('particules--prete');
    let rafR = 0;
    addEventListener('resize', () => { if (!rafR) rafR = requestAnimationFrame(() => { rafR = 0; dimensionner(); dessiner(0); }); }, { passive: true });
    surChangement(reduit, () => { majParticules(); if (reduit.matches) dessiner(0); });
    majParticules();
  });

  heros.dataset.mode = 'repos';
  majSatellite();
  inertes();
  majRepos();
})();

/* ========== Lumière de la page : la section qui passe la mi-hauteur allume sa couche du ciel ==========
   Écritures au seul changement de section : html[data-ciel], la couche allumée (.cp--on) et, le temps de son fondu,
   celle qui s'éteint (.cp--off) ; les autres couches ne sont pas rendues. Le lien de la section prend aria-current. */
if (OI) {
  const liens = $all('.entete__nav a'), groupe = { libre: 'app' };
  let allumee = null, eteinte = null, minEteinte = 0;
  const allumer = nom => {
    if (html.dataset.ciel === nom) return;
    html.dataset.ciel = nom;
    const couche = d.querySelector('.cp--' + nom);
    if (couche !== allumee) {
      if (eteinte && eteinte !== couche) eteinte.classList.remove('cp--off');
      if (allumee) allumee.classList.replace('cp--on', 'cp--off');
      if (couche) { couche.classList.remove('cp--off'); couche.classList.add('cp--on'); }
      eteinte = allumee; allumee = couche;
      // le fondu fini (600 ms), la couche éteinte n'est plus rendue : au repos, une seule couche vit
      clearTimeout(minEteinte);
      minEteinte = setTimeout(() => { if (eteinte) eteinte.classList.remove('cp--off'); eteinte = null; }, 700);
    }
    const cible = '#' + (groupe[nom] || nom);
    liens.forEach(a => { if (a.getAttribute('href') === cible) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  };
  const ioCiel = new IntersectionObserver(entrees => entrees.forEach(en => { if (en.isIntersecting) allumer(en.target.dataset.ciel); }), { rootMargin: '-50% 0px -50% 0px' });
  $all('[data-ciel]').forEach(s => ioCiel.observe(s));
}

/* ========== Un seul appel à la fois : la pilule de l'en-tête se retire tant qu'un badge ou un appel est à l'écran ========== */
const badges = $all('.badge, .appel');
if (OI && badges.length) {
  const vus = new Set();
  // un badge passé sous l'en-tête ne compte plus comme visible
  const ioBadges = new IntersectionObserver(entrees => {
    entrees.forEach(en => { if (en.isIntersecting) vus.add(en.target); else vus.delete(en.target); });
    html.classList.toggle('badge-en-vue', vus.size > 0);
  }, { rootMargin: '-64px 0px 0px 0px' });
  badges.forEach(b => ioBadges.observe(b));
}

/* ========== Piliers : la bande se prend au clavier quand elle déborde (sous 64rem) ==========
   Lue après la mise en page (ResizeObserver) : aucune mise en page forcée au chargement. */
const bande = d.querySelector('.piliers');
if (bande && window.ResizeObserver) {
  new ResizeObserver(() => { if (bande.scrollWidth > bande.clientWidth + 1) bande.tabIndex = 0; else bande.removeAttribute('tabindex'); }).observe(bande);
}

/* ========== Liens de la page : défilement doux pour ce geste-là seulement ========== */
let minDoux = 0;
d.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a || reduit.matches) return;
  html.classList.add('doux');
  clearTimeout(minDoux);
  minDoux = setTimeout(() => html.classList.remove('doux'), 1200);
});

/* ========== Entrées : armées juste sous la fenêtre quand on descend, jamais au chargement ==========
   Un élément n'est caché (ou sa lumière baissée) que pendant qu'il attend sous le bord de l'écran ;
   à l'arrêt du défilement, tout ce qui attend reprend son état final. Texte et cartes ne bougent jamais. */
const SEUILS = { ecrans: 0.86, piliers: 0.92, bord: 0.86, soleil: 0.98 };
let enAttente = reduit.matches ? [] : $all('[data-entree]'), yEntrees = 0, minRepos = 0;
const hautDe = el => el.getBoundingClientRect().top;
function liberer(el) { el.classList.remove('entree-attente'); el._arme = false; }
function armer(vh) {
  for (const el of enAttente) {
    if (el._arme) continue;
    const top = hautDe(el);
    if (top >= vh * 0.98 && top < vh * 1.6) { el.classList.add('entree-attente'); el._arme = true; }
  }
}
function majEntrees(y, vh) {
  if (!enAttente.length) return;
  const descend = y > yEntrees;
  yEntrees = y;
  enAttente = enAttente.filter(el => {
    const top = hautDe(el);
    if (el._arme) {
      if (top < vh * (SEUILS[el.dataset.entree] || 0.9)) { liberer(el); return false; }
      if (top > vh * 1.9) liberer(el);
      return true;
    }
    if (top < vh) return false; // déjà à l'écran ou dépassé : reste tel quel
    if (descend && top < vh * 1.6) { el.classList.add('entree-attente'); el._arme = true; }
    return true;
  });
  clearTimeout(minRepos);
  minRepos = setTimeout(() => {
    const h = innerHeight || html.clientHeight;
    enAttente.forEach(el => { if (el._arme) liberer(el); });
    enAttente = enAttente.filter(el => hautDe(el) >= h);
  }, 1200);
}
if (enAttente.length) {
  const intention = () => armer(innerHeight || html.clientHeight);
  addEventListener('wheel', e => { if (e.deltaY > 0) intention(); }, { passive: true });
  addEventListener('touchstart', intention, { passive: true });
  addEventListener('keydown', e => { if (['PageDown', 'ArrowDown', ' ', 'End', 'Spacebar'].includes(e.key)) intention(); });
  surChangement(reduit, () => { if (reduit.matches) { enAttente.forEach(liberer); enAttente = []; } });
}

/* ========== Rythmes : anneaux vivants en vue, pause accessible (bouton bascule) ========== */
const anneaux = d.querySelector('.anneaux'), pauseAnneaux = d.querySelector('.pause-anneaux');
if (anneaux) {
  let figes = false;
  if (OI) new IntersectionObserver(entrees => entrees.forEach(en => anneaux.classList.toggle('anneaux--vivants', en.isIntersecting)), { threshold: 0.05 }).observe(anneaux);
  else anneaux.classList.add('anneaux--vivants');
  if (pauseAnneaux) {
    pauseAnneaux.hidden = reduit.matches;
    surChangement(reduit, () => { pauseAnneaux.hidden = reduit.matches; });
    pauseAnneaux.addEventListener('click', () => {
      figes = !figes;
      anneaux.classList.toggle('anneaux--figes', figes);
      pauseAnneaux.setAttribute('aria-pressed', String(figes));
    });
  }
}

/* ========== Parallaxe : repli script, borné, quand le navigateur ignore animation-timeline ==========
   Plans : écrans de l'app ≈ 0,45 / 0,6 / 0,8× sur la traversée de leur composition (22 à 78 %, décalages en % de
   leur hauteur, comme la version native), contenu 1×, poussière du héros 1,1×. Sur ordinateur seulement.
   Sans animation-timeline, le ciel de la page reste fixe (il ne fait que se fondre d'une section à l'autre). */
const natif = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));
let plans = [], rafS = 0, parallaxeActive = false, herosActif = false;
const blocHeros = heros && heros.querySelector('.heros__orbe'), aube = heros && heros.querySelector('.aube'), poussiere = heros && heros.querySelector('.particules'), compo = d.querySelector('.composition');
function mesurer() {
  const y = scrollY || 0;
  plans = [];
  if (!parallaxeActive || !compo) return;
  const rc = compo.getBoundingClientRect(), top = rc.top + y, ch = rc.height;
  plans = $all('.plan', compo).map(el => {
    const cs = getComputedStyle(el);
    return { el, de: parseFloat(cs.getPropertyValue('--de')) || 0, a: parseFloat(cs.getPropertyValue('--a')) || 0, h: el.offsetHeight, top, ch };
  });
}
function poser() {
  rafS = 0;
  const y = scrollY || 0, vh = innerHeight || html.clientHeight;
  majDefile();
  majEntrees(y, vh);
  if (parallaxeActive) {
    for (const p of plans) {
      const brut = (vh - (p.top - y)) / (vh + p.ch), pr = Math.min(1, Math.max(0, (brut - 0.22) / 0.56));
      const ty = (p.de + (p.a - p.de) * pr) * p.h / 100;
      if (Math.abs(ty - (p.el._ty || 0)) > 0.1) { p.el._ty = ty; p.el.style.transform = 'translate3d(0,' + ty.toFixed(1) + 'px,0)'; }
    }
  }
  if (herosActif && blocHeros) {
    const q = Math.min(1, y / vh);
    blocHeros.style.transform = 'translate3d(0,' + (q * vh * 0.4).toFixed(1) + 'px,0) scale(' + (1 - q * 0.1).toFixed(4) + ')';
    blocHeros.style.opacity = Math.max(0, q < 0.4 ? 1 : 1 - (q - 0.4) / 0.45).toFixed(3);
    if (aube) { aube.style.transform = 'translate3d(0,' + (q * vh * 0.85).toFixed(1) + 'px,0)'; aube.style.opacity = (q < 0.6 ? 1 - q * 0.25 : 0.85 * (1 - (q - 0.6) / 0.4)).toFixed(3); }
    if (poussiere) poussiere.style.transform = 'translate3d(0,' + (-q * vh * 0.1).toFixed(1) + 'px,0)';
  }
}
function majParallaxe() {
  const veut = !natif && !reduit.matches && ordinateur.matches;
  if (!veut && parallaxeActive) plans.forEach(p => { p.el.style.removeProperty('transform'); p.el._ty = 0; });
  if (!veut && herosActif) [blocHeros, aube, poussiere].forEach(el => { if (el) { el.style.removeProperty('transform'); el.style.removeProperty('opacity'); } });
  parallaxeActive = veut; herosActif = veut;
  mesurer();
  poser();
}
addEventListener('scroll', () => { if (!rafS) rafS = requestAnimationFrame(poser); }, { passive: true });
let rafM = 0;
addEventListener('resize', () => { if (!rafM) rafM = requestAnimationFrame(() => { rafM = 0; majParallaxe(); }); }, { passive: true });
addEventListener('load', () => { if (parallaxeActive) mesurer(); }, { once: true });
surChangement(reduit, majParallaxe);
surChangement(ordinateur, majParallaxe);
if (!natif) apresPremiereImage(majParallaxe);
})();
