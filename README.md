# stillapp.fr, version « Lumière »

Site d'**Alvéo**, l'app de respiration guidée pour iPhone ([App Store](https://apps.apple.com/app/id6763119413)).
Une page d'accueil, les mentions légales, la politique de confidentialité et les conditions d'utilisation de l'app,
et une page 404.

Site statique : HTML, CSS et JavaScript sans framework, sans dépendance et **sans étape de build**. Ce qui est dans ce
dossier est exactement ce qui est publié, sauf les fichiers listés dans `.vercelignore` (`README.md`, `CHIFFRES.md`,
`PRODUCT.md`, `DESIGN.md`, `.impeccable/`, `outils/`), qui répondent 404 en ligne.

## L'idée

Une pièce sombre où une lumière respire. L'orbe de l'app, à l'échelle réelle, est la source de lumière de la page :
un éclat de 220 % l'entoure, seize rayons s'en échappent, et un horizon d'aube s'allume sous elle, dans le héros
seulement. Plus bas, la pièce reste sombre : chaque section reçoit une seule flaque de lumière, d'une teinte, du côté
de son objet (écrans, cartes, anneaux), comme si l'orbe éclairait la scène de côté ; la teinte change comme une
journée (l'aube derrière les écrans de l'app, le jour crème de l'orbe libre, le soir et la nuit sur les séances et
les rythmes, la nuit froide de la pratique) et l'aube revient pour l'appel final, où l'orbe se lève sur l'horizon du
pied de page. Le héros est la démo « J'ai 1 minute » : six respirations 5-5 au vrai
rythme, sur la page. Sur ordinateur, quand la minute commence, la page s'éteint, l'orbe glisse au centre de la pièce,
la lueur de la pièce suit le souffle, et à la fin l'orbe s'y épanouit sous l'appel à installer.

## Structure

```
index.html              accueil : héros et démo, l'app, l'orbe libre, séances (et le programme), rythmes,
                        pratique, avis, prix, questions, appel final
mentions-legales.html   servie à /mentions-legales (cleanUrls)
confidentialite.html    politique de confidentialité de l'app, servie à /confidentialite
conditions.html         conditions d'utilisation de l'app, servies à /conditions
404.html                servie par Vercel avec le statut 404
styles.css              feuille unique, partagée par les cinq pages (jetons, base, en-tête, héros et démo,
                        sections, entrées, parallaxe, mouvement réduit, annexes, pages légales et leur impression)
main.js                 accueil seulement : démo, pause de l'orbe et de la lumière, glissement de la minute, ciel
                        de la page (data-ciel), entrées, anneaux, repli de la parallaxe, reflet au pointeur, pilule
                        de l'en-tête
vercel.json             URL propres, redirections (dont /privacy et /terms vers les pages légales), CSP, cache
robots.txt, sitemap.xml
favicon.ico, icon.svg, apple-touch-icon.png   inchangés
og.jpg                  image de partage 1200 × 630 : le héros réel, capturé (voir « Images »)
assets/fonts/           Instrument Serif et Inter (WOFF2, sous-ensembles latins) et leurs licences OFL, inchangés
assets/img/             badge officiel Apple et QR code (inchangés), icône, écrans de l'app (e-accueil, e-seance,
                        e-duree, e-reglages : 440, 660 et 880 px), volets (calendrier, essai, rappels), rayons de
                        l'orbe (rayons-orbe-v2.webp), grain.png
outils/                 preparer-images.py : refait les écrans, les rappels, les rayons et le grain (non publié)
```

## La lumière

- **Une source, une direction.** Chaque lumière est un dégradé radial d'une seule teinte, en cinq à six arrêts,
  posé en `closest-side` (ou à rayons explicites) pour finir sur son bord. Aucun flou animé, aucune ombre colorée sans
  décalage, aucun violet saturé, néon ou cyan.
- **L'orbe** (héros) reprend les trois disques et les trois halos de l'app (`theme.ts`, une seule rampe réglée par
  variables), plus une lueur de pièce (`.piece`, 440 % de l'orbe, avec son grain), **un éclat** (`.bloom`, 220 % de
  l'orbe, .50 au bord du disque, .40 à 53 %, .23 à 64 %, .10 à 76 %, .03 à 89 %, 0 au bord) et seize rayons doux.
  Mesuré sur les pixels à 1440 × 900 (DPR 2) : à 40 px du disque, le fond garde 38 à 44 % de la luminance du disque
  (11 % avant) ; entre deux rayons, à 1,3 rayon, il vaut environ (94, 65, 52). Les rayons sont une image
  (`assets/img/rayons-orbe-v2.webp`, 640 × 640, 23 Ko, gain ×3 par rapport à la v1, d'où le nouveau nom : `/assets/`
  est servi `immutable`) où le flou et le masque radial sont déjà cuits ; ils sont immobiles et respirent avec l'orbe.
- **Pendant la minute**, seuls `transform` et `opacity` changent à chaque image, posés directement sur l'élément
  (`.orbe` en mouvement normal ; le cœur `.coeur` et la lueur `.piece` en mouvement réduit), plus l'opacité de
  `.heros__lumiere`, qui suit le souffle (.35 à l'expire, .65 à l'inspire, en mouvement normal seulement). Aucune
  variable CSS héritée, aucun calque repeint ; la poussière en canvas s'arrête et s'efface. À la fin, l'orbe s'épanouit
  (0,9) et son éclat revient à pleine intensité en 1,2 s.
- **L'aube du héros** est un horizon sous l'orbe (sous elle sur ordinateur et en paysage, au bas de la colonne sur
  iPhone) : un radial d'une teinte centré 10vw au-dessus du bord du héros, éteint par un masque linéaire sur les 15
  derniers % de la hauteur, et coupé au héros (`.heros__lumiere { overflow: hidden }`) : elle ne passe plus sous la
  section suivante. En fenêtre basse (≤ 31,25rem), la mention sous le badge passe en `texte-1`.
- **Le ciel de la page** (`.ciel-page`, `position: fixed`, derrière tout le contenu) porte neuf couches, une par
  section, chacune **une seule flaque** radiale d'une teinte, cinq arrêts finis sur 0 (aucun plancher : la pièce reste
  sombre) : aube sable (L'app), jour crème (L'orbe libre), soir terracotta (Séances), nuit indigo (Rythmes), nuit
  froide (Ta pratique), braise (Avis, Questions), sable derrière la carte Alvéo+ (Prix), aube revenue (Installer). Sur
  ordinateur, la flaque se tient derrière l'objet de la section, jamais sous la colonne de texte ; sur iPhone, c'est
  une lueur au ras du bas de l'écran. La section qui passe la mi-hauteur s'allume (`.cp--on`, fondu de 600 ms en
  `cubic-bezier(.23,1,.32,1)`, `@starting-style`), la précédente s'éteint (`.cp--off`) ; les sept autres couches ne
  sont pas rendues (`display: none`), ni leurs animations. Le script n'écrit qu'au changement de section (un
  `IntersectionObserver`) ; rien n'est écrit au défilement. Sans JavaScript, pas de ciel : la page reste lisible sur
  la nuit.
- **Mouvement du ciel** : chaque couche glisse de 18 à 32vh pendant la traversée de sa section (`animation-timeline`
  sur la `view-timeline` de la section, partagée par `timeline-scope`, sous `@supports`), soit ≈ 0,1× le défilement,
  et respire en 32 s (`scale` 1 → 1,07), seulement quand elle est rendue. Sans `animation-timeline`, le ciel reste
  fixe (0×) et se fond d'une section à l'autre.
- **L'orbe** garde les couleurs de `theme.ts` ; chaque anneau s'éclaire d'environ 6 % en son milieu et son bord
  s'adoucit sur 1,5 % du rayon : la lumière déborde du disque au lieu de l'entourer.
- **Pointeur** (ordinateur, souris seulement) : le cœur de l'orbe (deux disques intérieurs) se décale de ±8 px vers le
  pointeur, au repos seulement, amorti dans le temps (`k = 1 − e^(−dt/120 ms)`, même vitesse à 60 et à 120 Hz) ; aucune
  boîte n'est lue pendant l'animation.
- **Grain** : `assets/img/grain.png` (128 × 128, alpha ≤ 3,9 % cuit dans le fichier), posé une fois en couche fixe
  **entre la lumière et le contenu** : jamais sur le texte ni sur les écrans. La lueur de l'orbe porte son propre grain.
- **L'horizon** : la section finale coupe son débordement (`overflow: clip`) : le soleil levant s'arrête net sur le
  filet du pied de page, et la page s'arrête au bas du pied (aucune bande noire à faire défiler).
- **Pause** : la pastille à côté de l'orbe (bouton bascule, `aria-pressed`) met en pause l'orbe, la poussière, le reflet
  et la respiration du ciel (WCAG 2.2.2). Les anneaux des rythmes ont leur propre bouton bascule.
- **Mesures** : luma médiane (Y' 601) de chaque vue, héros et sections, voir « Tests ».

## La parallaxe

Sur ordinateur (dès 64rem) pour le héros et les écrans de l'app ; sur iPhone, rien ne glisse sur le texte, seul le ciel
glisse. Tout passe par `transform` ou `translate`.

| Plan | Vitesse apparente | Comment |
|---|---|---|
| Ciel de la page | 0× (fixe) + glissement ≈ 0,08 à 0,12× | fixe derrière tout ; sa couche active glisse de 18vh pendant la traversée de sa section (28vh pour les séances sur ordinateur ; 32vh pour les séances et 26vh pour les rythmes, la pratique et le prix sur iPhone) |
| Aube du héros | ≈ 0,15× | descend de 85vh pendant le premier écran, puis s'éteint (la lumière reste à l'horizon) |
| Orbe du héros et sa consigne | ≈ 0,6× | descendent ensemble de 40vh, se réduisent à 0,9 et s'effacent |
| Écran du milieu (la séance) | ≈ 0,67 à 0,70× | −34 % → +16 % de sa hauteur sur 22 à 78 % de la traversée de la composition |
| Écran avant (l'accueil) | ≈ 0,77 à 0,79× | −16 % → +16 % |
| Contenu | 1× | |
| Poussière du héros | ≈ 1,1× | monte de 10vh pendant le premier écran : le premier plan |

Deux écrans dans #app depuis le polissage 2 (l'accueil devant, la séance derrière). **Aucun écran ne sort de #app**
(contrôle dans « Tests »). Natif (`animation-timeline: view()` / `scroll(root)` et une
`view-timeline` nommée sur la composition) quand le navigateur le sait, sous `@supports` ; sinon, repli
`requestAnimationFrame` borné dans `main.js` (lecture passive du défilement, écritures `translate3d` seulement, mêmes
plages). Tout est coupé sous `prefers-reduced-motion: reduce`. Aucun texte ni aucune barre n'est soumis à la parallaxe.

## Le mouvement

- **Un seul moment d'auteur** : l'entrée du héros (la lumière monte en 1,4 s, l'orbe s'allume en 1,2 s, puis le
  titre, le chapô et l'action, à 150 ms d'écart).
- **La minute** (ordinateur) : l'orbe glisse au centre de la pièce en 600 ms (`cubic-bezier(.77,0,.175,1)`, technique
  FLIP : mise en page finale en CSS, déplacement en `translate` par l'API Web Animations) ; à la fin, elle remonte un
  peu, s'épanouit (échelle 0,9, éclat plein, 1,2 s en `cubic-bezier(.23,1,.32,1)`) et la fin se compose dessous,
  centrée ; elle revient à sa colonne en 450 ms à l'arrêt. Interruptible : un nouveau glissement repart de la position
  affichée. Aucun déplacement en mouvement réduit.
- **Entrées au défilement, robustes** : un élément n'est caché (ou sa lumière baissée) que pendant qu'il attend juste
  sous le bord de l'écran, au cours d'un défilement vers le bas ; jamais au chargement. À l'arrêt du défilement
  (1,2 s), tout ce qui attend reprend son état final. Entrées : les deux écrans de l'app (fondu et 24 px,
  700/650 ms, 0/90 ms : l'accueil, puis la séance), la lumière des cartes de pilier (80 ms d'écart), le
  bord lumineux d'Alvéo+, le soleil de l'appel final. Le ciel, lui, se fond d'une section à l'autre. Texte et barres
  ne bougent jamais. Les questions s'ouvrent en fondu d'opacité de 200 ms, sans déplacement.
- **Courbes** : entrées et lumière `cubic-bezier(.23,1,.32,1)`, déplacements `cubic-bezier(.77,0,.175,1)`, jamais
  d'`ease-in` ni de rebond. Pressions 140 ms à `scale(.97)`, survols seulement sous
  `(hover: hover) and (pointer: fine)`.
- **Défilement doux** : seulement pour un clic sur un lien de la page (classe `.doux` posée 1,2 s par le script) ;
  un défilement programmé reste instantané.
- **Mouvement réduit** : pas de parallaxe, pas d'entrée, ciel fixe qui se fond en 400 ms, orbe figée, anneaux figés
  (bouton masqué), démo guidée par la lumière du cœur de l'orbe sans changement d'échelle, avec le décompte chiffré
  sous le mot ; les changements d'état restent des fondus de 200 ms.

## Tailles et cas limites

- **Héros à 100svh exactement** de 320 × 568 à 2560 × 1440 : l'orbe suit la hauteur (`min(52svh, 40vw)` sur
  ordinateur, `100svh - 500px` sur iPhone court) et le badge reste au-dessus du pli partout. Sous 36rem de haut,
  l'orbe ne porte plus que « J'ai 1 minute » et le chapô passe à 15 px. Sur grand écran, le h1
  monte jusqu'à 6rem (toujours en trois lignes) et le contenu s'élargit jusqu'à 105rem.
- **Paysage** (de 40 à 64rem de large, 500 px de haut au plus : iPhone couché, fenêtre basse, zoom 200 %) : le héros
  passe en double page comme sur ordinateur ; pendant la minute, les commandes se placent à gauche de l'orbe et le
  groupe minuteur, orbe, mot et décompte remonte de 3,5rem (`translate`, 400 ms à l'aller, 300 ms au retour) pour
  tenir dans la hauteur, barres de Safari comprises (mesuré de 667 × 330 à 1000 × 500 : 25 px de marge au moins).
  Sur iPhone court (36rem de haut au plus), il remonte de 2rem pour que la légende reste au-dessus du bord, et à la fin
  la phrase sur l'app s'efface, comme en paysage, pour que « Recommencer la minute » reste à l'écran. Pendant la
  minute, la colonne de texte, vide à l'œil, ne prend plus les touchers (`pointer-events: none`) : en paysage, elle
  recouvrait le bouton pause.
- **Texte agrandi** : les groupes insécables (dates, noms, phases des rythmes, « abonnement Alvéo+ en option ») et
  l'en-tête dépendent de requêtes de conteneur en `em` (`container-type: inline-size` sur `.conteneur`, l'action du
  héros et la barre d'en-tête) : à 200 % de texte, ils reviennent à la ligne, la navigation puis le mot-symbole cèdent
  la place, la pilule garde son verbe (« Télécharger »). Sous 10,125 em de barre (320 px à 175 % de texte, 390 px à
  200 %), la pilule ne tient plus à côté de la marque et se retire ; l'App Store reste au pied de page. Le titre des
  pages annexes ne dépasse pas 20 % de la largeur de la colonne (`cqi`), pour que « confidentialité » tienne sur une
  ligne ; au texte normal, rien ne change dès 210 px de large.
- **Écrans sur iPhone et tablette** (sous 64rem) : l'écran de devant fait 80 % de la composition (≈ 72vw sur iPhone) ;
  de l'écran arrière ne dépasse que son bord droit, choisi sans texte (l'orbe, la croix et les réglages de la séance ;
  « Off » et « Minuit » des réglages, en entier), coupé au bord de la fenêtre (`overflow-x: clip`). Vérifié à 320,
  375, 390 et 820 px.
- **Séances** : sous 64rem, une bande à faire glisser au doigt (`scroll-snap`, cartes de `min(80vw, 21rem)`, la
  suivante visible au bord ; le script la rend focusable au clavier quand elle déborde) ; 3 colonnes de 64 à 80rem
  (le programme en sixième carte), 5 au-delà avec le programme en pleine largeur.
- **Sans JavaScript** : tout le contenu est là ; l'orbe s'affiche sans bouton ni pastille, la consigne « Une minute,
  ici, sans son. » garde sa place sans se montrer (aucun décalage à l'arrivée du script), aucune entrée n'est armée.
  La pilule de l'en-tête, dont le retrait suit le script, reste alors affichée au-dessus du badge du héros : deux
  appels, mais jamais deux badges.

## La démo « J'ai 1 minute »

Le moteur de la v1 est repris (minutage sur l'horodatage des images, courbes exactes de React Native, pause onglet
masqué ou orbe à moins de 50 % à l'écran, Wake Lock, annonces `aria-live`, Échap, focus rendu à l'orbe, mouvement
réduit en direct). Changements :

- **Pause** : le minuteur garde le temps réellement restant ; la minute ne revient au début de la phase en cours qu'à
  la reprise, et la pause le dit (« Reprise au début de l'inspire »).
- **Mot seul** : comme dans l'app (`SessionGuideText`), le mot-guide s'affiche seul ; le décompte chiffré 5-4-3-2-1
  n'existe plus qu'en mouvement réduit, où l'orbe ne change pas de taille.
- **Fin** : sur ordinateur comme sur iPhone, l'orbe s'épanouit et la fin se compose dessous, centrée : « Six
  respirations. », la phrase sur l'app, un seul point focal (« Continue sur ton iPhone » puis le badge, le même badge
  officiel, un seul visible) et « Recommencer la minute » en lien. L'en-tête revient (sa pilule se retire tant que le
  badge est visible).
- **Focus** : pendant la minute et à la fin, le reste de la page (lien d'évitement, sections, pied) est inerte, comme
  l'en-tête pendant la minute : la tabulation tourne entre Pause et Arrêter, puis à la fin entre le titre, le badge,
  Recommencer, Fermer et l'en-tête.

## Images

- **Écrans de l'app** : captures Simulateur du 2 novembre (1206 × 2622), barre d'état retirée, WebP qualité 82 à 440,
  660 et 880 px de large (`e-*.webp` ; le 660 sert les écrans de devant sur iPhone) : accueil (08, coupé au-dessus de
  la description du programme, 1206 × 2180), séance (24, 1206 × 2180), durée (10 : le sélecteur 1, 2, 5, 10, 15 min,
  coupé au-dessus de la carte du programme, 1206 × 1900), réglages en séance (26, 1206 × 2180). **Un seul écran
  « orbe + Inspire »** sur la page (la séance) : l'orbe n'apparaît pas deux fois à l'identique.
- **Avis** : cinq étoiles en émoji (⭐️, demande du propriétaire) au-dessus de chaque avis et devant la note ;
  exact, car une moyenne de 5,0 sur 8 notes impose que les huit notes soient de 5 étoiles. Elles sont lues
  « 5 étoiles sur 5 » par les lecteurs d'écran (`role="img"`) et s'affichent avec la police d'émoji du système.
- **Volets** (une partie d'écran recadrée, WebP qualité 84) : le calendrier du Profil (image reconstituée d'après le code de
  l'app 1.4.0, avec quinze jours de séance d'illustration : `outils/calendrier-profil/`), le bas de l'intro
  d'une séance Alvéo+ (20 : « Essayer 30 secondes », « Plus tard », sans le texte d'introduction ni l'« effet
  physiologique », allégations, et sous la pastille de l'aperçu, dont le libellé est coupé sur la capture), les
  rappels (34, le seul groupe des trois créneaux : l'écran entier porte « Choisis jusqu'à 3 moments », écart de texte
  relevé par la fiche de vérité).
- **Écartés** : le premier souffle (« L'orbe suit ton souffle. » : la mesure n'est jamais réutilisée, § 10.1 de la
  fiche de vérité), la séance commandes masquées (doublon de la séance), le profil avec ses trois jalons (sept dans la
  1.4.0), la fin de séance (« 1 jours de suite »), le paywall et la fin d'aperçu (allégations, prix en dollars), les
  suggestions de l'accueil (Double Inspire n'y est pas épinglée, alors qu'elle l'est pour un non-abonné dans les deux
  versions), la liste des séances (non chargée sur les captures). `outils/preparer-images.py --captures …` les refait
  à l'identique. Aucun iPhone dessiné : cadres « écran » arrondis, ombre douce décalée, reflet, lueur derrière.
- `rayons-orbe-v2.webp` : `outils/preparer-images.py --rayons` (aucune source : calculé, gain 3,9).
- `og.jpg` : capture Playwright du héros à 1200 × 630, prise à 2× puis réduite, avec le seul titre et l'orbe (lisibles
  dans une carte de partage d'environ 500 px : navigation, chapô, badge, mention et consignes retirés pour la capture),
  JPEG qualité 86.
- Les fichiers de `/assets/` sont servis un an, `immutable` : tout fichier modifié change de nom.

## Budgets mesurés

| | Brut | Brotli (q 11) | Budget brut |
|---|---|---|---|
| `index.html` | 44,8 Ko | 8,4 Ko | 60 Ko |
| `styles.css` | 54,8 Ko | 11,8 Ko | 60 Ko (55 Ko visés depuis le polissage 2) |
| `main.js` | 34,2 Ko | 10,1 Ko | 45 Ko |

Le polissage 2 a payé la refonte du ciel, des cartes de pilier et des volets par des retraits : les planchers et les
variantes du ciel, la galerie en liste et son échelle, l'écran arrière de #app, les poids de police redondants, des
commentaires resserrés (59,1 → 54,8 Ko). Transfert de l'accueil : 215 à 220 Kio selon l'outil (Lighthouse mobile,
taste `perf.mjs`), 19 requêtes, dont 68 Kio de polices ; 24 fichiers dans `assets/img`, et Lighthouse ne relève plus
aucune image trop grande sur iPhone (42 Kio avant la taille 660).

## Tests (recette du 8 novembre 2026 après le polissage 2, serveur qui applique `vercel.json`)

| Contrôle | Résultat |
|---|---|
| Lighthouse mobile, accueil | 99 à 100 / 100 / 100 / 100 selon les passes ; LCP 1,8 à 1,9 s (le h1) ; CLS 0 ; TBT 0 à 60 ms ; 0 Kio d'images trop grandes. Restent 2 à 4 tâches de 51 à 111 ms selon la passe, la première mise en page de la page : une trace Chromium (processeur ÷ 4) n'en voit qu'une, de 135 ms (84 ms de mise en page, 23 ms de styles) ; même ordre qu'avant le polissage (comparaison alternée : 82 à 109 ms avant, 67 à 92 ms après) |
| Lighthouse ordinateur, accueil | 100 / 100 / 100 / 100 ; LCP 0,4 s ; CLS 0 ; TBT 0 ms |
| Lighthouse, mentions légales | 100 × 4 en mobile (LCP 1,6 à 1,7 s) et en ordinateur (la 404 n'est pas mesurable : statut 404) |
| taste `perf.mjs` | 0 FAIL, 6 WARN déjà expliqués (police de repli locale comptée comme famille, icône, badge vectoriel et tuile de grain « agrandis ») ; 0 tâche longue, blocage 0 ms, décalage 0 ; 217 à 220 Kio, 19 à 21 requêtes |
| Fluidité (Chromium sans accélération graphique) | 1440 × 900 : 60 images/s au repos et pendant la minute (aucune image au-delà de 25 ms) ; défilement à la molette sur toute la page : 95e centile 33 ms, 0 image au-delà de 34 ms (3 avant), 3 à processeur ÷ 4 (13 avant), aucune tâche longue, CLS 0 ; iPhone (processeur ÷ 4) : 60 images/s au repos, pendant la minute et au défilement. L'aube passait par un masque CSS, trop cher sans GPU (images perdues pendant la minute) : elle est désormais éteinte par un fondu de nuit peint dans le même dégradé, dans une boîte à sa taille |
| Ciel de la page | une seule couche rendue au repos (la précédente le temps de son fondu de 600 ms) ; tous les 500 px à 1440 : 38 à 78 % des pixels sous la luminance 20 hors héros (11 à 75 % avant), fond des colonnes de texte ≤ 23 hors textes posés dans un objet ; point le plus clair hors texte ≥ 100 près des écrans, des cartes et du soleil final ; à 390 : ≥ 35 % sauf deux vues du prix où les deux cartes de verre remplissent l'écran (32 à 34 %) |
| Parallaxe des écrans | accueil 0,77 à 0,79×, séance 0,67 à 0,70× de 1280 × 720 à 1920 × 1080 ; marge minimale dans #app de 20 px, de 1024 × 600 à 2560 × 1440 |
| Contraste sur les pixels (fond au 30e centile de chaque huitième de ligne, méthode du critique) | chaque texte centré dans la fenêtre : 0 sous le seuil AA à 320 × 568, 390 × 844, 844 × 390, 820 × 1180, 1024 × 768 et 1440 × 900 (100 à 148 textes par taille) ; héros mesuré à 14 tailles de 320 × 568 à 2560 × 1440 : pire cas 4,94:1 (le chapô dans l'éclat de l'orbe, iPad mini en portrait), 5,1:1 et plus ailleurs ; mention sous le badge à 844 × 390 : 16,2:1 (3,9:1 avant) ; intro de #app à 844 × 390 et 820 × 1180 sur la nuit |
| Démo en temps réel | 12 phases de 5 s, 60,03 s à 1440 et à 390 (écart maximal 31 et 32 ms) ; pause (temps restant gardé), reprise au début de la phase, onglet masqué, Échap, mouvement réduit (échelle 1, la lumière du cœur guide) |
| Commandes de la minute | au repos, en marche, en pause et à la fin, chaque commande reçoit le toucher, de 320 × 568 à 1920 × 1080 en passant par le paysage (667 × 330 à 1000 × 500) ; pastille pause à 14 px de l'anneau partout, dans la fenêtre à 200 % de texte |
| axe-core 4 | 0 violation sur 28 états : repos, démo en cours, pause, fin, FAQ ouverte, bas de page, à 390 × 844 et 1440 × 900, normal et mouvement réduit, plus mentions légales et 404 |
| html-validate 9 (`recommended` + `a11y`) | 0 erreur sur les trois pages |
| Détecteur Impeccable | fichiers et page servie à 390 × 844 et 1440 × 900 : `overused-font` (charte) et `radial-halo` (la scène de lumière), rien d'autre |
| Console, CSP, réseau | 0 erreur JavaScript (seule ligne : le statut 404 voulu de `/nexiste-pas`, que Chrome journalise), 0 violation de CSP, 0 requête hors origine, 0 échec, ni cookie ni stockage ; 69 requêtes sur trois pages et deux tailles |
| Débordement horizontal | aucun de 320 à 1920 px sur les trois pages ; aucun au zoom 200 % ni à 200 % de texte |
| Badge au-dessus du pli | 375 × 667 (bas du badge à 575 px), 390 × 844 (718), 1366 × 768 (590), 1440 × 900 (660), 320 × 568 (492) ; héros à 100svh exactement de 320 × 568 à 2560 × 1440 ; jamais deux badges visibles ensemble ; la pilule se retire aussi devant les deux appels en texte |
| Hauteurs | #seances : 1 075 px à 1440 (1,19 écran ; 1 820 avant) et 1 059 px à 390 (1,25 écran ; 2 856 avant) |
| Pages légales (recette du 12 novembre 2026, après la revue) | `/confidentialite` et `/conditions`, avec l'accueil, les mentions légales et la 404 : html-validate 0 erreur ; axe-core 0 violation à 390 et 1280 ; 0 violation de CSP, 0 erreur JavaScript, 0 requête hors origine, ni cookie ni stockage ; contraste mesuré de 6,59:1 au moins ; 0 lien interne cassé, `/privacy` et `/terms` en 308 ; texte de 125 à 200 % de 320 à 1280 px : en-tête sans débordement (la pilule se retire sous 10,125 em de barre) et aucun mot coupé dans les titres des pages légales ; au texte normal, styles calculés identiques à la version précédente sur l'accueil (particules exceptées), les mentions légales, les conditions et la 404 |
| Non mesuré ici | un vrai iPhone 12 et un MacBook Air sous Safari (demandé avant livraison) |

## À savoir avant de modifier

- **CSP.** `script-src 'self'`, `style-src 'self'` : aucun script en ligne (la classe `js` est posée par `main.js`),
  aucun attribut `style=""`, aucune balise `<style>`. Les valeurs dynamiques passent par
  `element.style.setProperty`, `transform`, `opacity` ou `translate` en JavaScript, et par l'API Web Animations
  (`element.animate`). Le bloc JSON-LD n'est pas exécuté.
- **Pages légales.** Le texte de `confidentialite.html` et de `conditions.html` a été vérifié ligne à ligne contre le
  code de l'app et sa Privacy Label (dépôt still-legal, commit b80b21c) ; seuls ont changé en les installant ici les
  passages sur l'hébergement de ces pages (§ 3 et § 8 de la politique : Vercel, polices du site, aucun outil de mesure
  d'audience, et la garantie qui encadre l'adresse IP reçue par Vercel et GitHub) et les liens internes. Ne pas
  retoucher ce texte sans refaire cette vérification, et changer alors « Dernière mise à jour ». Il vouvoie, comme un
  texte juridique, quand le reste du site tutoie. Les anciennes adresses GitHub Pages
  (`tatsumakiiy.github.io/still-legal/privacy.html`, `terms.html`), que l'app 1.3.1 ouvre encore, redirigent ici dès
  que still-legal est fusionné (voir « Mise en ligne des pages légales »).
- **Data Privacy Framework.** Le § 3 de la politique dit que Vercel et GitHub adhèrent au cadre de protection des
  données UE-États-Unis. Vérifié le 12 novembre 2026 sur la liste officielle (`dataprivacyframework.gov/list`) :
  Vercel Inc. (Covina, Californie) et GitHub (San Francisco) y sont actifs pour l'UE, données hors RH comprises ;
  renouvellement dû le 29 avril 2027 pour Vercel, le 3 août 2027 pour GitHub. À revérifier à ces dates : une
  certification non renouvelée rend la phrase fausse. (L'accord de traitement des données de Vercel, avec ses clauses
  contractuelles types, ne vaut que pour les offres Pro et Enterprise : la phrase ne s'y appuie pas.)
- **Badge App Store.** `assets/img/badge-app-store-fr.svg` est le badge officiel, copié à l'octet près : ne jamais le
  modifier. Tant qu'un badge est à l'écran, la pilule de l'en-tête se retire : un seul appel à la fois. Après les avis
  et sous les prix, l'appel est un lien texte, jamais un second badge.
- **Prix.** La phrase « En France : … » est écrite mot pour mot deux fois (carte Alvéo+ et FAQ 2), nulle part ailleurs
  sur l'accueil ; aucun montant hors de cette phrase (`CHIFFRES.md`). Dans la carte, elle est composée en bloc par des
  `<span>` (« En France : » en libellé, une ligne par montant, unité accolée par des espaces insécables) sans changer un
  mot. Les conditions d'utilisation (`conditions.html`, § 7) écrivent aussi les deux montants, dans leur propre phrase :
  un changement de prix les touche aussi (voir « Pages légales »).
- **Rien n'est enregistré** dans le navigateur et aucune requête ne part ailleurs que vers stillapp.fr.
- **Polices.** Instrument Serif et Inter sont imposées par la charte de l'app ; la règle `overused-font` du détecteur
  Impeccable est une exception assumée. Les titres sont en romain ; l'italique est réservé à la voix de l'app
  (« J'ai 1 minute », les mots-guides, « Continue sur ton iPhone », « Respirer, un instant. »).
- **Raccourcis `font:`** : aucun raccourci `font` ne contient de `var()` (longhands à la place), sinon l'analyse
  statique du détecteur lit toutes les tailles à 16 px.
- **Détecteur.** Restent deux constats documentés : `overused-font` (charte) et `radial-halo` (la scène de lumière,
  exigence du brief, construite comme une matière : une source, une teinte, grain fichier). Les barres de séance ont
  une ombre neutre décalée (une ombre colorée sur fond sombre relèverait de `dark-glow`). La grande citation des avis
  (3rem, interlignage 1,16 demandé par la direction artistique) porte `data-impeccable-ignore="tight-leading"` : la
  règle vise le texte courant, pas une citation d'affichage.

## Mise en ligne des pages légales (une seule fois, dans cet ordre)

L'app 1.3.1 ouvre `https://tatsumakiiy.github.io/still-legal/privacy.html` et `terms.html` : ces adresses ne doivent
jamais mener à une 404, et la politique affirme (§ 8) qu'elles « renvoient ici ». La fenêtre entre les deux étapes doit
donc être courte.

1. Publier ce site (fusion dans `main` ; Vercel déploie).
2. Vérifier la production : `curl -sI https://stillapp.fr/confidentialite` et `https://stillapp.fr/conditions`
   répondent 200 ; `curl -sI https://stillapp.fr/privacy` et `https://stillapp.fr/terms` répondent 308, avec
   `location: /confidentialite` et `/conditions`.
3. Aussitôt après, fusionner la branche `claude/pages-legales-alveo` dans le `main` du dépôt still-legal. GitHub Pages
   republie en une à deux minutes, puis son cache peut servir l'ancienne page une dizaine de minutes encore.
4. Vérifier : `curl -s https://tatsumakiiy.github.io/still-legal/privacy.html | grep refresh` montre
   `url=https://stillapp.fr/confidentialite` (`terms.html` mène à `/conditions`, `index.html` à `/mentions-legales`) ;
   dans Safari, l'ancienne adresse ouvre la nouvelle page.

Jamais dans l'autre ordre : still-legal fusionné avant le site enverrait l'app 1.3.1 sur une 404.

## Prévisualiser

```
python3 -m http.server 8080
```

Pour les en-têtes réels (CSP, URL sans `.html`, 404) : `npx vercel dev`, ou le serveur de recette de la refonte.

## Règles de vérité

Chaque fait publié est vrai dans la version de l'app en ligne **et** dans la suivante : aucune fonction absente (pas de
widget, pas d'iPad), aucune allégation de santé ou d'efficacité, aucune caution scientifique (pas d'étude citée),
rien d'« anonyme » ni de « 100 % local ». Les chiffres sont recensés avec leur source et leurs emplacements dans
`CHIFFRES.md`.
