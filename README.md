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
- **En-têtes.** `Strict-Transport-Security` n'est pas dans `vercel.json` : Vercel l'envoie déjà sur ses domaines.
  La CSP est celle de la spécification, à la lettre. Conséquence connue : Lighthouse note le SEO à 92, parce que son
  audit `robots.txt` lit le fichier avec `fetch`, que la CSP bloque (`default-src 'none'`, sans `connect-src`).
  Les robots d'indexation, eux, lisent `robots.txt` normalement. Ajouter `connect-src 'self'` à la CSP fait passer
  ce score à 100 : c'est un choix à faire par le propriétaire, pas un défaut du site.
- **Poids.** `styles.css` dépasse le budget brut de la spécification (30 Ko) mais tient dans son budget compressé
  (8 Ko en Brotli) : vérifier les deux après chaque ajout. Les commentaires y sont réduits aux titres de section
  (polices, jetons, base, composants, en-tête, héros et démo, sections, pied/dock/annexes, mouvement réduit).
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
