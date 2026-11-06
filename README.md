# stillapp.fr

Site vitrine d'**Alvéo**, l'app de respiration guidée pour iPhone ([App Store](https://apps.apple.com/app/id6763119413)).
Une page d'accueil où l'on respire une minute avec l'orbe de l'app, une page de mentions légales et une page 404.

Site statique : HTML, CSS et JavaScript sans framework, sans dépendance et **sans étape de build**.
Ce qui est dans ce dossier est exactement ce qui est publié, sauf `README.md`, `CHIFFRES.md` et `outils/`.

## Structure

```
index.html              accueil (héros et démo, moments, app, prix, questions…)
mentions-legales.html   servie à /mentions-legales (cleanUrls)
404.html                servie par Vercel avec le statut 404
styles.css              feuille unique, partagée par les trois pages
main.js                 accueil seulement : démo « J'ai 1 minute », dock, heure, « Pour maintenant »
                        (Échap pendant la minute : le focus revient sur l'orbe, ramenée à l'écran si besoin,
                        sauf si le visiteur a tabulé ailleurs dans la page, où le focus reste)
vercel.json             URL propres, redirections, en-têtes (CSP, Permissions-Policy, cache)
robots.txt, sitemap.xml
favicon.ico, icon.svg, apple-touch-icon.png, og.jpg (image de partage 1200 × 630)
assets/fonts/           Instrument Serif et Inter (WOFF2, sous-ensembles latins) et leurs licences OFL
assets/img/             badge officiel Apple, QR code, icône, écrans de l'app (WebP)
outils/                 préparation des images, une fois, hors ligne (non publié)
CHIFFRES.md             où vit chaque chiffre du site (non publié)
```

## Prévisualiser

N'importe quel serveur statique suffit :

```
python3 -m http.server 8080
```

puis http://localhost:8080. Pour reproduire exactement la production (en-têtes de sécurité, URL sans `.html`,
page 404) : `npx vercel dev`.

## Déployer

Projet Vercel relié au domaine `stillapp.fr`, sans commande de build ni dossier de sortie (racine du dépôt).
Chaque poussée sur la branche principale publie le site. `.vercelignore` écarte `README.md`, `CHIFFRES.md` et `outils/`.

À savoir avant de modifier :

- **Script en ligne et CSP.** L'unique script en ligne, `document.documentElement.classList.add('js')`, est autorisé par
  son empreinte SHA-256 dans `vercel.json`. Changer un seul caractère impose de recalculer l'empreinte :
  `printf '%s' "document.documentElement.classList.add('js')" | openssl dgst -sha256 -binary | openssl base64`.
  Aucun attribut `style=""` ni `onclick=""` dans le HTML.
- **Cache.** Les fichiers de `/assets/` sont servis un an, `immutable` : tout fichier modifié doit changer de nom
  (suffixe `-v2`) et ses références être mises à jour. HTML, CSS et JS sont revalidés à chaque visite.
- **Badge App Store.** `assets/img/badge-app-store-fr.svg` est le badge officiel d'Apple, copié à l'octet près :
  ne jamais le modifier, le recolorer ni l'animer.
- **Rien n'est enregistré** dans le navigateur (ni cookie, ni `localStorage`) et aucune requête ne part ailleurs que
  vers stillapp.fr : les mentions légales l'affirment.
- **Images.** `python3 outils/preparer-images.py --help` (Pillow) : les sources se donnent en arguments.
- **En-têtes.** La CSP est celle de la spécification (§ 6.7) avec un seul écart volontaire, décidé par le propriétaire :
  `connect-src 'self'`. Sans lui, l'audit `robots.txt` de Lighthouse (qui lit le fichier avec `fetch` depuis la page)
  échouait et le score SEO restait à 92 ; même origine seulement, aucune ressource tierce n'est autorisée pour autant.
  `Strict-Transport-Security` est déclaré avec `includeSubDomains`, comme dans la spécification : Vercel n'envoie par
  défaut que `max-age=63072000`. À vérifier sur l'aperçu Vercel après le premier déploiement (`curl -I`).
- **Poids.** `styles.css` et `main.js` dépassent le budget brut de la spécification (30 et 20 Ko) mais tiennent dans
  leur budget compressé (8 et 7 Ko en Brotli, qualité 11) : vérifier les deux après chaque ajout
  (`node -e 'const z=require("zlib"),f=require("fs");console.log(z.brotliCompressSync(f.readFileSync("styles.css"),{params:{[z.constants.BROTLI_PARAM_QUALITY]:11}}).length)'`).
  La feuille ne contient aucun commentaire, chaque octet comptant dans ce budget ; elle se lit dans cet ordre : polices,
  jetons, base, composants, en-tête, héros et démo (colonne mobile, hauteur courte, ordinateur, paysage), sections,
  pied, dock, annexes, mouvement réduit.
- **Validation.** `html-validate index.html mentions-legales.html 404.html` avec les préréglages `recommended` et `a11y` :
  0 erreur. Le préréglage `document` ajoute la règle `require-sri`, qui réclame un attribut `integrity` sur `styles.css`
  et `main.js` : faux positif pour des fichiers de même origine revalidés à chaque visite (ne pas ajouter d'`integrity`,
  qui serait à recalculer à chaque modification).
- **Paysage.** Dans une fenêtre large et basse (de 640 à 1023 px de large, 631 px de haut au plus : iPhone en paysage,
  fenêtre d'ordinateur zoomée à 200 %), le héros passe en double page comme sur ordinateur (orbe à gauche, textes et
  badge à droite), et le badge reste visible pendant la démo. En dessous de 640 px de large (iPhone SE de 1ʳᵉ génération
  en paysage), la colonne mobile reste telle quelle.
- **Hauteur courte.** La rupture « hauteur courte » du héros (chapô sous la mention, orbe réduite) s'étend jusqu'à
  631 px de haut, et non 600 comme dans la spécification : entre 601 et 631 px, la formule normale donnait une orbe de
  193 à 223 px, plus petite qu'à 600 px. Pendant la minute, en hauteur courte, le minuteur garde la place du titre et
  la légende « Démo sans son ni vibration… » est masquée.
- **Smart App Banner.** Dans Safari sur iPhone, la bannière de l'App Store (`apple-itunes-app`) s'insère au-dessus de la
  page à la première visite (environ 84 pt) : la ligne de flottaison de la spécification est mesurée sans elle. Bannière
  affichée, le badge du héros est coupé de 15 à 27 px sur un iPhone SE ou dans Safari avec ses barres (390 × 664) ; la
  bannière est elle-même un bouton d'installation et disparaît au défilement. À contrôler sur un iPhone réel.
- **Dock.** Sa seconde ligne (« Gratuit · pour iPhone ») se replie sur deux lignes quand la place manque (320 px de large,
  texte agrandi) et la capsule grandit ; elle ne tronque jamais. Le dock et la pilule de l'en-tête s'effacent 96 px
  avant que le bloc d'action final (badge, QR, mention) n'entre dans la fenêtre, et non dès le haut de la section
  `#installer` : l'appel reste visible pendant toute la FAQ.
- **Jetons de `styles.css`.** Ceux de la charte gardent les noms de la spécification (`--nuit`, `--texte-2`, `--t-h1`…).
  Les jetons internes sont courts : `--h` hauteur utile de la fenêtre (`100vh`, ou `100svh` sous `@supports` : jamais
  de `svh` dans une variable hors de ce bloc), `--g` gouttière, `--mg`/`--md` marges gauche et droite, `--at` espace
  texte → contenu, `--ct` largeur du conteneur, `--cs`/`--ca` courbes de sortie et d'aube, `--ds`/`--de`/`--re`/`--da`/
  `--dt`/`--dg` durées et retards, `--f1`…`--f4` cascade des textes de fin de démo. `--k`, `--o` et `--lum` sont posés
  par `main.js` sur l'orbe.

## Règles de vérité des contenus

Chaque fait publié doit être vrai dans la version de l'app en ligne **et** dans la suivante : aucune fonction absente,
aucune allégation de santé ou d'efficacité, aucun concurrent nommé. En cas de doute sur une phrase, on la retire.
Les chiffres (séances, durées, prix, note, dates des avis, iOS) sont recensés avec leur source et **tous** leurs
emplacements dans `CHIFFRES.md` : à relire à chaque changement de l'app, du prix ou de la fiche App Store.
