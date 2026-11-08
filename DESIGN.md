---
name: Alvéo · Lumière
description: Une pièce sombre où une lumière respire. Le canevas nuit chaud de l'app (« Verre et sable »), l'orbe à trois disques comme seule source, une lumière qui suit la lecture de l'aube à la nuit et revient à l'aube. Instrument Serif pour la voix, Inter pour l'interface.

# Valeurs reprises de styles.css (:root), elles-mêmes tirées de theme.ts dans le dépôt de l'app.
# styles.css fait foi ; ce bloc en est l'export lisible. Si un jeton change là-bas, changer les deux.
colors:
  # Canevas et surfaces (theme.ts : colors.bg, bgElevated, surface, surfaceHi)
  nuit: "#0C0B0E"                       # fond de page, jamais noir pur
  nuit-2: "#141317"
  surface: "#17151A"
  surface-2: "#1F1C23"
  verre-1: "rgba(255,255,255,.05)"      # survol discret
  verre-2: "rgba(255,255,255,.08)"      # boutons ronds de la démo
  verre-3: "rgba(255,255,255,.12)"
  verre-filet: "rgba(255,255,255,.14)"
  filet: "rgba(255,246,232,.10)"        # séparateurs
  filet-fort: "rgba(255,246,232,.18)"   # contour des boutons secondaires

  # Texte (blancs chauds)
  texte-1: "#F7F3EE"                    # titres, corps fort ; 17,9:1 sur nuit
  texte-2: "rgba(247,243,238,.74)"      # corps ; ≈ 10:1
  texte-3: "rgba(247,243,238,.66)"      # légendes, mentions ; ≈ 7,6:1 sur la nuit, ≥ 5,5:1 sous la lumière

  # Action : le blanc est la couleur de l'action (pilule, sélection), comme dans l'app
  action: "#FFFFFF"
  sur-action: "#0C0B0E"

  # Sable : l'orbe, la lumière, la progression ; jamais un bouton
  accent: "#D4906B"
  accent-texte: "#EFD8C4"
  focus: "#F0D5BC"
  orbe-exterieur: "#B87652"
  orbe-milieu: "#D4A88E"
  orbe-coeur: "#F0D5BC"
  # milieu de chaque anneau, ≈ +6 % de luminance : la lumière déborde du disque (couleurs de theme.ts conservées)
  orbe-exterieur-clair: "#C37D57"
  orbe-milieu-clair: "#E1B297"
  orbe-coeur-clair: "#FEE2C7"

  # Piliers (teintes des cartes et de leur lumière ; noms en clair pour le texte)
  apaiser: "rgb(122,90,128)"            # texte #E8CFE0
  dormir: "rgb(61,74,122)"              # texte #A8B6E0
  concentrer: "rgb(61,107,90)"          # texte #A8D0C0
  equilibrer: "rgb(221,185,160)"        # texte #EBCDB4
  energiser: "rgb(190,94,48)"           # texte #F0C8A0

  # Rampes de la lumière (triplets utilisés en rgba(var(--x), alpha) dans styles.css)
  orbe-1-rgb: "rgb(184,118,82)"         # = orbe-exterieur
  orbe-2-rgb: "rgb(212,168,142)"        # = orbe-milieu
  creme-rgb: "rgb(240,213,188)"         # = orbe-coeur
  sable-rgb: "rgb(212,144,107)"         # = accent
  sable-clair: "rgb(228,191,165)"
  braise: "rgb(196,124,93)"             # arrêts moyens des lueurs chaudes
  cendre: "rgb(155,100,82)"
  tison: "rgb(135,92,80)"
  brun: "rgb(88,60,60)"                 # derniers arrêts, alpha ≤ .02
  sable-gris: "rgb(195,155,132)"
  blanc-chaud: "rgb(247,243,238)"       # = texte-1, pour les alphas
  ivoire: "rgb(255,246,232)"            # filets et reflets
  blanc: "rgb(255,255,255)"             # verres
  noir: "rgb(0,0,0)"                    # ombres portées (alpha .5 à .75)
  nuit-rgb: "rgb(12,11,14)"             # en-tête translucide (.74)

  # Littéraux nommés
  noir-masque: "#000"                   # masques CSS seulement, jamais affiché
  fond-ecran: "#0E0D11"                 # fond des captures pendant leur chargement
  pilule-survol: "#F2EEE9"
  pause-survol: "#DD9C78"
  selection-texte: "#FFF8F0"
  aiguille: "#FFF6EC"                   # point de l'aiguille des anneaux
  soleil-1: "#FCEFE3"                   # cœur du soleil levant
  soleil-2: "#E4C1A4"
  soleil-3: "#C58E6B"
  blanc-hex: "#FFFFFF"
  nuit-hex: "#0C0B0E"
  apaiser-texte: "#E8CFE0"
  apaiser-nom: "#E0C0D8"
  dormir-texte: "#A8B6E0"
  concentrer-texte: "#A8D0C0"
  equilibrer-texte: "#EBCDB4"
  energiser-texte: "#F0C8A0"

  # Ciel de la page (.ciel-page, fixe) : une flaque par section, une teinte, cinq arrêts, finie sur 0 (aucun
  # plancher : la pièce reste sombre) ; crête --a sur ordinateur, du côté de l'objet, jamais sous la colonne de texte
  ciel-app: "rgb(212 144 107), crête .56, derrière les écrans (74vw, 62vh)"      # aube sable
  ciel-libre: "rgb(238 208 182), crête .46, derrière les écrans (26vw, 58vh)"    # jour crème
  ciel-seances: "rgb(196 112 84), crête .56, bas à droite (86vw, 96vh)"          # soir terracotta
  ciel-rythmes: "rgb(92 108 170), crête .66, sous les anneaux (60vw, 96vh)"      # nuit indigo
  ciel-suivi: "rgb(96 124 186), crête .62, derrière le calendrier (80vw, 60vh)"  # nuit froide
  ciel-avis: "rgb(204 128 92), crête .46, coin bas droit (86vw, 100vh)"          # braise
  ciel-prix: "rgb(212 144 107), crête .50, derrière la carte Alvéo+ (76vw, 60vh)" # sable
  ciel-questions: "rgb(190 110 80), crête .46, coin bas gauche (14vw, 100vh)"     # braise
  ciel-installer: "rgb(212 144 107), crête .62, sous le soleil levant (50vw, 108vh)" # l'aube revient
  ciel-iphone: "crête .36 à .50, centre à 106vh : une lueur au ras du bas de l'écran"
  aube-heros: "sable .62 → 0, centre 10vw au-dessus du bord du héros, sous l'orbe ; masque sur les 15 derniers %, coupée au héros"
  eclat-orbe: "rgba(212,144,107) .50 au bord du disque → 0 à 220 % de l'orbe"

typography:
  scale:
    # Rampe en px (clé) et rem (valeur) : toute taille littérale et chaque borne de clamp() tombe sur un pas.
    "11": "0.6875rem"    # indice dans l'orbe (mobile)
    "12": "0.75rem"      # étiquettes des cartes, indice de l'orbe (ordinateur)
    "13": "0.8125rem"    # micro : mentions, conditions, légende de la démo
    "15": "0.9375rem"    # petit : légendes, navigation
    "16": "1rem"         # minuteur, lien d'évitement
    "17": "1.0625rem"    # corps
    "18": "1.125rem"     # questions de la FAQ
    "20": "1.25rem"      # intro (haut de plage)
    "22": "1.375rem"     # h3 (bas de plage), nom des cartes, taille mini du mot de l'orbe
    "24": "1.5rem"       # voix (bas), mot-symbole
    "28": "1.75rem"      # h3 (haut), citation (bas), signature du pied, offres (bas), mot-guide (bas)
    "34": "2.125rem"     # h2 (bas)
    "36": "2.25rem"      # montants (bas), titre de fin de démo (bas), offres (haut)
    "38": "2.375rem"     # h1 et appel (bas)
    "40": "2.5rem"       # voix (haut), mot-guide (haut)
    "48": "3rem"         # citation (haut), montants (haut)
    "60": "3.75rem"      # h2 (haut), titre de fin de démo (haut)
    "72": "4.5rem"       # appel (haut)
    "76": "4.75rem"      # (ancien plafond du h1)
    "96": "6rem"         # h1 (haut, dès 2118 px de large)
  serif:
    fontFamily: "Instrument Serif, Serif repli, Georgia, serif"
    role: "titres et voix ; romain pour les titres, italique réservé à la voix de l'app"
  sans:
    fontFamily: "Inter, Sans repli, -apple-system, system-ui, sans-serif"
    role: "interface et corps"
  display:                               # h1 du héros
    fontFamily: "{typography.serif}"
    fontSize: "clamp(2.375rem, 1.5rem + 3.4vw, 6rem)"      # 38 px à 390, 73 px à 1440, 89 px à 1920, 96 px au-delà ; 3 lignes partout
    fontWeight: 400
    letterSpacing: "-0.02em"
    lineHeight: 1.02
  appel:                                 # h2 de l'appel final, jamais plus grand que le h1
    fontSize: "clamp(2.375rem, 1.5rem + 3.3vw, 4.5rem)"
  headline:                              # h2 de section
    fontFamily: "{typography.serif}"
    fontSize: "clamp(2.125rem, 1.35rem + 2.55vw, 3.75rem)" # 34 px à 390, 58 px à 1440
    fontWeight: 400
    letterSpacing: "-0.015em"
    lineHeight: 1.04
  title:                                 # h3 : piliers, rythmes, faits, offres
    fontFamily: "{typography.serif}"
    fontSize: "clamp(1.375rem, 1.25rem + .5vw, 1.75rem)"
    lineHeight: 1.3
  voix:                                  # citations, « Continue sur ton iPhone »
    fontFamily: "{typography.serif}"
    fontSize: "clamp(1.5rem, 1.25rem + 1.2vw, 2.5rem)"
    lineHeight: 1.25                     # 1,3 pour l'appel de fin ; la grande citation (3rem) à 1,16
  intro:
    fontFamily: "{typography.sans}"
    fontSize: "clamp(1.0625rem, .98rem + .34vw, 1.25rem)"
    lineHeight: 1.6
    maxWidth: "58ch"
  body:
    fontFamily: "{typography.sans}"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  petit: { fontSize: "0.9375rem" }
  micro: { fontSize: "0.8125rem", lineHeight: 1.55 }
  chiffres: "font-variant-numeric: tabular-nums (minuteur, durées, prix, note)"

rounded:
  marque: ".5rem"                       # icône de l'en-tête
  pied-logo: ".625rem"
  qr: ".75rem"
  badge-zone: ".875rem"                 # zone de clic autour du badge
  carte: "1.25rem"
  barre: "2px"                          # barre de progression de la démo
  barre-defilement: "8px"
  disque: "50%"
  offre: "1.75rem"
  ecran: "clamp(1.125rem, 2.8vw, 1.875rem)"
  volet: "5.25%/11.2%"                  # rayon réel du groupe de l'app, en proportion
  pilule: "999px"

spacing:
  base: "4px"
  gouttiere: "1.25rem (mobile) · 1.5rem (≥ 48rem)"
  marges: "max(1.25rem, safe-area) · 2.5rem (≥ 48rem) · 3.5rem (≥ 64rem)"
  largeur: "105rem"                     # 1680 px : le héros et les sections occupent le grand écran
  section: "clamp(5rem, 3rem + 5vw, 8rem)"    # haut et bas de chaque section : 120 px à 1440, 80 px sur iPhone
  titre-intro: "1.5rem"                        # plus d'air au-dessus d'un titre qu'en dessous

motion:
  entree: "cubic-bezier(.23,1,.32,1) (aussi pour la lumière : plus de courbe propre à la lumière)"
  deplacement: "cubic-bezier(.77,0,.175,1)"
  souffle: "cubic-bezier(.42,0,.58,1) par phase ; courbes exactes de React Native dans la démo"
  pression: "140ms, scale(.97)"
  ui: "240ms"
  etats-demo: "400ms"
  entree-heros: "aube 1400ms, orbe 1200ms, textes 600 à 700ms à 150ms d'écart"
  entrees-defilement: "écrans 700/650ms à 0/90ms (accueil, séance), 24 px ; lumière des cartes de pilier 80ms d'écart"
  ciel: "fondu 600ms cubic-bezier(.23,1,.32,1) au changement de section ; seules la couche allumée et la précédente sont rendues ; respire en 32s (scale 1 → 1,07), glisse ≈ 0,1× avec sa section ; en pause sur demande"
  questions: "fondu d'opacité 200ms à l'ouverture, sans déplacement"
  rayons: "immobiles (flou et masque cuits dans rayons-orbe-v2.webp, gain ×3) ; ils respirent avec l'orbe"
  glissement-minute: "600ms, cubic-bezier(.77,0,.175,1), translate seul (FLIP) ; aucun en mouvement réduit"
  epanouissement-fin: "orbe à 0,9 et éclat plein en 1200ms, cubic-bezier(.23,1,.32,1)"
  souffle-piece: "lueur de la pièce .35 à l'expire, .65 à l'inspire (opacité seule, mouvement normal)"
  reflet-pointeur: "cœur de l'orbe ±8 px, amorti k = 1 − e^(−dt/120 ms), au repos seulement"
  parallaxe-ecrans: "séance (milieu) ≈ 0,7× (−34 % → +16 %), accueil (avant) ≈ 0,8× (−16 % → +16 %) sur 22–78 % de la composition ; marge ≥ 20 px dans #app"

components:
  appel-texte:                           # après les avis et sous les prix : même destination que le badge, sans second badge
    textColor: "{colors.texte-1}"
    decoration: "souligné sable .6, décalage .3em, flèche SVG d'un trait"
    minHeight: "2.75rem"
  programme:                             # « 7 jours pour mieux dormir » : dernière carte de la bande, pleine largeur dès 80rem
    background: "linear-gradient(165deg, teinte .36, teinte .10 55%, blanc .015) sur nuit .66"
    rounded: "{rounded.carte}"
  pilule:
    backgroundColor: "{colors.action}"
    textColor: "{colors.sur-action}"
    rounded: "{rounded.pilule}"
    minHeight: "2.75rem"
    padding: "0 1.25rem"
  bouton-rond:                           # pause, croix, pastille de l'orbe
    backgroundColor: "{colors.verre-2}"
    borderColor: "{colors.verre-filet}"
    size: "2.75rem (pause de la démo 3.5rem, fond {colors.accent})"
  bouton-secondaire:                     # Recommencer, Figer les anneaux
    borderColor: "{colors.filet-fort}"
    textColor: "{colors.texte-2}"
    rounded: "{rounded.pilule}"
    minHeight: "2.75rem"
  carte-pilier:                          # une carte haute par pilier, sa lumière posée en haut
    background: "teinte .10 → 0 sur 45 %, sur nuit .66 ; lueur radiale de la teinte (.50 → 0) centrée au-dessus du bord haut"
    rounded: "{rounded.carte}"
    border: "{colors.filet}"
    shadow: "0 24px 48px -28px rgba(0,0,0,.85)"
    largeur: "min(80vw, 21rem) dans la bande (sous 64rem) ; 3 colonnes de 64 à 80rem ; 5 colonnes au-delà, programme dessous"
  barre-seance:                          # une séance = une barre de lumière dans sa carte, longue comme sa durée
    width: "durée / 15 de la largeur utile (15 min = toute la largeur), 1,75rem au moins ; la durée écrite au bout"
    height: "18px"
    background: "linear-gradient(90deg, teinte .78, teinte .46)"
    shadow: "inset 0 1px 0 ivoire .2"
    rythme: "motif SVG du rythme, 1 s = 3,5 px, trait crème .66 de 1,5 px"
  cadenas:                               # séances Alvéo+ : un trait, « Alvéo+ » lu par les lecteurs d'écran
    size: ".875rem"
    stroke: "{colors.texte-3}, 1,8"
  offre:
    background: "linear-gradient(180deg, blanc .055, blanc .025) sur nuit .62 (Alvéo+ : .72) : verre sombre, la lumière vit autour"
    borderColor: "{colors.filet}"
    rounded: "{rounded.offre}"
  offre-plus:
    border: "dégradé crème → sable de 1 px (masque), lueur de coin sable"
  volet:                                 # une partie d'écran recadrée (calendrier, essai, rappels)
    rounded: "{rounded.ecran} ; rappels : 5.25%/11.2% (le rayon réel du groupe)"
    shadow: "0 30px 60px -24px rgba(0,0,0,.8), 0 10px 24px -12px rgba(0,0,0,.55)"
  ecran:
    proportion: "1206 × 2180 (1:1,81), barre d'état retirée ; la durée 1206 × 1900, coupée au-dessus du programme"
    rounded: "{rounded.ecran}"
    shadow: "0 28px 70px -18px rgba(0,0,0,.65), 0 8px 20px -10px rgba(0,0,0,.5)"
    reflet: "linear-gradient(160deg, crème .13, .045 16 %, transparent 38 %)"
    lueur: "radial-gradient(closest-side) teinte .34 → 0 derrière, plus large que l'écran (sable ; crème pour l'orbe libre ; nuit froide pour la série)"
---

# Système de design : Alvéo · Lumière

## 1. Vue d'ensemble

**Étoile polaire : « la pièce sombre où une lumière respire ».**

La page est la nuit de l'app (`#0C0B0E`), et la seule lumière est celle de l'orbe. Sur grand écran, l'orbe est à
l'échelle réelle à droite du titre ; sur iPhone, sous le titre. Toucher l'orbe lance une vraie minute : la page s'éteint
autour, l'orbe grossit et rétrécit au rythme 5-5, un mot guide. En descendant, la lumière change comme une journée :
aube derrière les écrans de l'app, jour au-dessus de l'orbe libre, soir puis nuit sur les séances et les rythmes, et
l'aube revient à la fin, où l'orbe se lève sur l'horizon du pied de page.

Caractéristiques :

- Un seul canevas sombre et chaud, composé, jamais un thème clair inversé.
- Une seule famille de lumière par section, d'une seule teinte, sans halo violet, néon ni cyan.
- Les écrans réels de l'app, jamais un iPhone dessiné.
- Peu de cartes : les séances (objets lumineux) et les deux offres. Le reste est typographie et air.
- Aucun eyebrow, aucun numéro de section, aucun texte en dégradé, aucun verre décoratif, aucune icône emoji.

## 2. Couleurs

Stratégie : 90 % neutre chaud, un accent rare (le sable de l'orbe), le blanc pour l'action. Les teintes des piliers
ne vivent que dans leurs barres et leur lumière. Contraste du texte : `texte-1` 17,9:1, `texte-2` ≈ 10:1, `texte-3`
≈ 7,6:1 sur la nuit ; sur ordinateur, la source du ciel se tient du côté des images et le fond reste sombre sous le
texte ; mesuré sur les pixels (fond au 30e centile de chaque huitième de ligne), de 320 × 568 à 2560 × 1440, aucun
texte sous 4,5:1 (pire cas 4,94:1, le chapô dans l'éclat de l'orbe sur iPad mini en portrait ; ailleurs 5,1:1 et
plus), la plupart au-delà de 6:1. Surfaces du navigateur thématisées : sélection sable, caret sable,
barre de défilement sable fine, anneau de focus crème de 2 px.

## 3. Typographie

Deux familles, celles de l'app, auto-hébergées (WOFF2, sous-ensembles latins, `font-display: swap`, préchargées) avec
des polices de repli ajustées (`size-adjust`) pour éviter le décalage au chargement. Les titres sont en Instrument
Serif **romain** ; l'italique est un rôle, la voix de l'app : « J'ai 1 minute », « Inspire », « Expire », « En pause »,
« Continue sur ton iPhone », « Respirer, un instant. », le mot-symbole « alvéo ». Échelle des titres : h1, h2, voix et h3 sont
séparés d'au moins 1,25 fois (h1 73 px, h2 58 px, voix 37 px, h3 27 px, puis intro 20 px et corps 17 px à 1440) ;
le titre de l'appel final (72 px) ne dépasse jamais le h1. Interlignage 1,6
pour le corps, 1,3 à 1,4 pour la voix et les petits titres, 1,02 à 1,04 pour l'affichage. Mesure 58 à 62 caractères.
Typographie française : espaces insécables avant `: ; ? !` et dans les nombres, apostrophes typographiques, guillemets
« ».

## 4. Lumière et matière

- **Construction.** `radial-gradient(closest-side, teinte .30 0 %, .22 16 %, .135 32 %, .066 50 %, .024 70 %, .006 86 %,
  0 100 %)` : une teinte, sept arrêts adoucis, zéro exact sur le bord. Grain fichier (alpha ≤ 4 %) en couche fixe entre
  lumière et contenu.
- **Ciel fixe, pièce sombre.** Un seul ciel, `position: fixed`, derrière tout le contenu : une flaque radiale d'une
  teinte par section, cinq arrêts finis sur 0 (aucun plancher), posée du côté de l'objet (écrans, cartes, anneaux) et
  jamais sous la colonne de texte, comme si l'orbe éclairait la scène de côté ; sur iPhone, une lueur au ras du bas
  de l'écran. La section qui passe la mi-hauteur s'allume en 600 ms (`.cp--on`), la précédente s'éteint (`.cp--off`),
  les autres ne sont pas rendues. Mesuré tous les 500 px à 1440 : 40 à 78 % des pixels sous la luminance 20 hors
  héros, fond de la colonne de texte ≤ 26. Elle glisse ≈ 0,1× pendant la traversée de sa section
  (`animation-timeline`, sous `@supports`) et respire en 32 s.
- **L'aube du héros** est un horizon sous l'orbe, coupé au héros : centre 10vw au-dessus du bord, masque linéaire
  sur les 15 derniers % ; elle ne passe jamais sous la section suivante.
- **L'éclat de l'orbe.** Sous les disques, une couche de 220 % de l'orbe (.50 au bord du disque, 0 au bord) ; à 40 px
  du disque, le fond garde au moins 40 % de sa luminance. Les seize rayons (image, gain ×3) se voient à l'œil nu.
- **Profondeur.** Ombres décalées et douces (`0 28px 70px -18px`), reflet en biais sur le verre des écrans, lueur
  derrière chaque écran. Le seul verre translucide est l'en-tête (`blur(14px)`), avec repli opaque sous
  `prefers-reduced-transparency`.

## 5. Mouvement

Un seul moment d'auteur (l'entrée du héros), une démo qui est le produit (sur ordinateur, l'orbe glisse au centre de
la pièce pendant la minute, en 600 ms et par translate seul ; à la fin elle s'y épanouit et la fin se compose dessous),
un ciel qui change de teinte d'une section à l'autre, deux écrans qui montent dans l'aube, des anneaux qui respirent
au vrai tempo (arcs proportionnels aux phases, aiguille qui fait un tour par cycle). Parallaxe sur deux moments
porteurs de sens, sur ordinateur seulement : la scène du héros (orbe et consigne à ≈ 0,6×, aube à ≈ 0,15×, poussière à
1,1×) et la composition des écrans (la séance ≈ 0,7×, l'accueil ≈ 0,8×), plus le ciel qui glisse à ≈ 0,1×.
Aucun écran ne sort de sa section. Sur iPhone, rien ne glisse sur le texte. Rien ne rebondit, rien ne bouge sur un texte
ou une barre. Tout mouvement de plus de 5 s a une pause. Les questions s'ouvrent en fondu de 200 ms, sans déplacement.
Mouvement réduit : rien ne se déplace, la démo guide par la lumière de l'orbe.

## 6. Composants

- **Pilule d'action** : blanche, texte nuit, 44 px de haut, verbe + objet (« Télécharger Alvéo », « sur l'App Store »
  en plus quand la barre mesure 70em). Elle se retire tant qu'un badge App Store est à l'écran. La navigation est au
  vrai centre de la barre (grille 1fr auto 1fr).
- **Appel en texte** : « Télécharger Alvéo sur l'App Store » après les avis et sous les prix, lien souligné de 44 px
  de haut avec une flèche d'un trait ; jamais un second badge.
- **Badge App Store** : officiel, inchangé, 48 px (héros) et 60 px (appel final), zone de protection d'un quart de sa
  hauteur par le remplissage de son lien.
- **Orbe** : trois disques plats (#B87652, #D4A88E, #F0D5BC) et trois halos de l'app, lueur de pièce, rayons
  immobiles (image) ; bouton plein cadre « J'ai 1 minute / Toucher (ou Cliquer) pour commencer » ; une seule consigne
  dessous, sans verbe : « Une minute, ici, sans son. » ; pastille pause en satellite (bouton bascule, `aria-pressed`).
  Pendant la minute, seuls `transform` et `opacity` de l'orbe changent à chaque image (aucune variable héritée).
- **Écran** : capture réelle (barre d'état retirée ; la durée, coupée au-dessus du programme, est plus courte), cadre arrondi, reflet, ombre
  décalée, lueur ; jamais de matériel dessiné. Sous 64rem, l'écran de devant fait 80 % de la composition (≈ 72vw sur iPhone) ; de l'écran arrière ne dépasse qu'un bord sans texte. Un seul écran « orbe + Inspire » sur la page.
- **Carte de pilier** : une carte haute à la teinte du pilier, sa lumière posée en haut, nom en serif dans la couleur
  du pilier de l'app (`badgeText` de `lib/pillarColors.ts`), compte (« 5 séances, dont 4 avec Alvéo+ »), puis ses
  séances empilées : nom en serif, pastille « Offerte » (Double Inspire) ou cadenas d'un trait (« avec Alvéo+ » pour
  les lecteurs d'écran), moment d'usage, et une barre de lumière longue comme la durée (15 min = toute la largeur),
  le motif du rythme dedans (une seconde = 3,5 px pour toutes), la durée écrite au bout en chiffres tabulaires ; le
  rythme est lu en clair par les lecteurs d'écran. Sous 64rem, une bande à faire glisser (`scroll-snap`, cartes de
  80vw, la suivante visible au bord, focusable au clavier quand elle déborde) ; 3 colonnes de 64 à 80rem ; 5 au-delà.
- **Programme** : la dernière carte, à la teinte du pilier Dormir : sept points (une séance par jour), nom en serif,
  « avec Alvéo+ » ; pleine largeur sous les cinq piliers dès 80rem.
- **Volet** : une partie d'écran recadrée à ses bords (le calendrier du Profil, le bas de l'intro d'une séance, les
  rappels), même cadre, ombre et reflet que les écrans.
- **Anneau de rythme** : SVG, piste fine, arcs inspire (crème), retenue (crème 32 %), « un peu plus » (sable), expire
  (terracotta), aiguille, orbe miniature qui respire.
- **Offres** : deux cartes de verre ; Alvéo+ porte un bord lumineux crème → sable et une lueur de coin. Le prix
  d'Alvéo+ ne s'écrit que dans sa phrase exacte (« En France : … »), montants en serif dans la phrase même ; essai et
  résiliation en deux paragraphes de 15 px.
- **Questions** : `<details>` natifs, filets fins, signe + qui tourne de 45° en 240 ms.

## 7. À faire, à ne pas faire

À faire : montrer l'app réelle, écrire des faits vérifiables, laisser la lumière porter la page, garder chaque
section à une idée et un titre, tester sans JavaScript, au clavier, en mouvement réduit, à 320 px et à 200 %.

À ne pas faire : un iPhone dessiné, une promesse de santé, un chiffre sans source, un second badge dans la même
fenêtre, un `style=""`, une ressource tierce, une capture qui cache du contenu tant qu'on n'a pas défilé, une lumière
violette ou néon, un texte posé sur une lumière trop vive.
