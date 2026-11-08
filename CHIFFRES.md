# Où vit chaque chiffre de stillapp.fr (version « Lumière »)

Le site n'a pas d'étape de build : chaque chiffre est écrit en clair dans le HTML (et, pour la démo, dans `main.js`).
Ce fichier n'est pas publié (`.vercelignore`). **À relire à chaque changement de l'app, du prix ou de la fiche App Store.**
Règle de vérité : un chiffre publié est vrai dans la version en ligne de l'app **et** dans la suivante ; en cas de doute,
on retire la phrase.

Les emplacements sont donnés par section (`#id`) et sélecteur dans `index.html`, sauf mention. Pour chercher un chiffre,
tolérer les espaces insécables écrites `&nbsp;` dans le source : `grep -n '4,99&nbsp;€' index.html`.

Aucun chiffre nouveau par rapport à la version précédente du site : seuls ses emplacements ont changé, plus la notation
« 4-2-6 » de Double Inspire (ci-dessous), tirée des phases de l'app, et les précautions des CGU § 3 (FAQ 8).
Recette finale du 8 novembre 2026 : le prix n'apparaît plus qu'en phrase exacte (décision D 4), la mention de l'étude
Balban et al. est retirée (aucune caution scientifique), la séance offerte et les 16 séances Alvéo+ sont marquées sur
chaque séance. Polissage du 8 novembre : les séances deviennent des barres de lumière longues comme leur durée ; la
marque d'accès est un cadenas d'un trait (« avec Alvéo+ » lu par les lecteurs d'écran) sur les seize séances Alvéo+,
« Offerte » et « Gratuite » restent écrits, et l'en-tête de chaque pilier compte ses séances Alvéo+. Polissage 2
(8 novembre) : une carte par pilier (l'orbe libre quitte la galerie : elle a sa section), le rythme de chaque séance
n'est plus écrit en chiffres sur la carte (son motif le dessine, les lecteurs d'écran le lisent en clair), deux lignes
d'usage changent (« Avant de prendre la parole », « Avant le sport ») ; écrans : la durée remplace la séance dans
#orbe-libre, le calendrier du Profil remplace l'écran des jalons, le bas de l'intro d'une séance (« Essayer
30 secondes ») entre dans #seances. Aucun chiffre nouveau.

## Séances

| Chiffre | Source (dépôt de l'app) | Emplacements |
|---|---|---|
| 17 séances | `lib/sessions.ts:74-297` | `<meta name="description">` ; JSON-LD (`description`) ; `#respirer .heros__chapo` ; `#seances h2` ; les 17 `.seance` des cinq `.pilier` de `#seances .piliers` |
| 1 séance offerte (Double Inspire), 16 Alvéo+ | `lib/entitlements.ts:71-77` | meta description et JSON-LD (« dont une offerte ») ; `.heros__chapo` ; `#seances .intro` ; `.seance__acces` « Offerte » (une seule) ; cadenas `.cadenas` (`role="img"`, `aria-label="avec Alvéo+"`) sur seize séances ; `.pilier__compte` (« 5 séances, dont 4 avec Alvéo+ », « 3 séances avec Alvéo+ » ×4 : 4 + 12 = 16) ; `.programme__detail` (« avec Alvéo+ ») ; `#seances .volet--essai` (image : « Essayer 30 secondes ») ; `#prix .offre` Gratuit (« La séance Double Inspire ») ; `.offre--plus` (« Les 16 autres séances guidées ») ; FAQ 1 et 2 ; `#rythmes .rythme--2i .rythme__source` (« La séance offerte ») |
| Piliers et nombre de séances : Apaiser 5, Dormir 3, Concentrer 3, Équilibrer 3, Énergiser 3 | `lib/sessions.ts` | `.pilier__compte` des cinq piliers |
| Durées des 17 séances (Double Inspire 1, SOS stress 1, Relâcher 5, Paix intérieure 8, Refuge 15, Nuit paisible 5, Rendormissement 2, Corps lourd 10, Avant réunion 3, Clarté mentale 5, Performance 10, Matin équilibré 5, Midi pivot 5, Transition soir 5, Réveil corps 3, Boost aprem 3, Avant effort 5) | `lib/sessions.ts` (champ `duration`, en secondes) | `.seance__duree` (« 5 min », au bout de la barre) ; longueur de la barre : classe `.t1` à `.t15` de chaque `.seance` (`--d` dans `styles.css`, durée / 15 de la largeur de la carte) |
| Rythme de chaque séance (5-5, 4-4-4-4, 4-7-8, 4-8, 4-4 ; Double Inspire = inspire 4 s, un peu plus 2 s, expire 6 s) | `lib/sessions.ts` (`protocolId`), `lib/breathingProtocols.ts:50-188` | n'est plus écrit en chiffres sur les cartes (polissage 2 : les codes précédaient leur explication) ; texte lu dans `.seance__duree .vh` (« inspire 4 secondes, retiens 7, expire 8 ») ; motif de la barre (`<pattern>` `#m55`, `#m44`, `#m4444`, `#m478`, `#m426`, `#m48` du sprite SVG), tracé au vrai tempo : une seconde vaut 3,5 px, la même échelle pour toutes |
| Moments d'usage des séances (« À tout moment », « Coup de stress », « Avant de dormir », « Avant de prendre la parole », « Avant le sport »…) | contextes de `lib/sessions.ts:6-12` et titres ; aucune promesse | `.seance__usage` |
| Programme « 7 jours pour mieux dormir », pilier Dormir, une séance par jour pendant sept jours, Alvéo+ | `lib/programs.ts:21-43`, `components/ProgramCard.tsx:52-56` | `#seances .programme` (sept points, symbole `#c7`) ; `.offre--plus` ; FAQ 2 ; visible aussi en bas de l'écran d'accueil (`e-accueil`, titre seulement) |

## L'orbe et la démo

| Chiffre | Source | Emplacements |
|---|---|---|
| Durées 1, 2, 5, 10, 15 min ; gratuite | `lib/sessionSettings.ts:31`, `lib/sessionLaunch.ts:73-74` | meta description et JSON-LD (« de 1 à 15 ») ; `.heros__chapo` ; `#orbe-libre h2` et `.intro` ; `#orbe-libre .ecran--duree` (capture du sélecteur 1, 2, 5, 10, 15 min et son texte alternatif) ; `.offre` Gratuit ; FAQ 1 ; `.demo__fin-texte` (« jusqu'à 15 minutes ») ; `#app .ecran--accueil` (texte alternatif « 1 min ») |
| Rythme 5-5 : cinq secondes, cinq secondes, six respirations par minute ; la démo fait 6 cycles de 10 s = 60 s | `lib/breathingProtocols.ts:52-68` | `#orbe-libre .intro` ; `#rythmes .rythme--55` ; FAQ 1 ; `main.js` (`PHASE = 5000`, `PHASES = 12`) ; `.demo__fin-titre` « Six respirations. » ; `.demo__progression` « Respiration 1 sur 6 » ; annonces de `main.js` (en pause, le minuteur garde le temps réellement restant ; à la reprise, la minute repart du début de la phase en cours : « Reprise au début de l'inspire ») |
| Amplitude de l'orbe 0,65 → 1,15 de l'app, ramenée à 0,565 → 1,00 ; fin à 0,9 (l'orbe s'épanouit) | `lib/breathingProtocols.ts:68` | `main.js` (`K_MIN`, `K_MAX`, `K_FIN`) |
| Ambiances (forêt, vagues, pluie, drone, ou rien), fonds, carillons, vibrations | `lib/sessionSettings.ts:1-28` | `#orbe-libre .intro` ; texte alternatif de `.ecran--reglages` |

## Rythmes

| Chiffre | Source | Emplacements |
|---|---|---|
| Six rythmes dans les séances | six `protocolId` dans `lib/sessions.ts` | `#rythmes h2` ; les six `.rythme` |
| Phases : 5-5 ; 4-4-4-4 ; 4-7-8 ; 4 + 2 + 6 ; 4-8 ; 4-4 (écrites « Inspire 4 s · Retiens 7 s · Expire 8 s », l'unité partout) | `lib/breathingProtocols.ts:50-188` | `.rythme__phases` ; arcs SVG de chaque `.anneau` (`stroke-dasharray` proportionnels, longueur de chemin 100) ; durées d'animation dans `styles.css` (`10s`, `16s`, `19s`, `12s`, `12s`, `8s` pour `.souffle` et `.aiguille`) et images clés `r55` à `r44` |
| Nombre de séances par rythme : 5-5 l'orbe libre et six séances, carré quatre, 4-7-8 trois et le programme, Double Inspire une, 4-8 une (Corps lourd), 4-4 deux | `lib/sessions.ts` | `.rythme__source` |
| Sources citées comme inspirations (Servan-Schreiber et O'Hare ; Mark Divine ; Andrew Weil ; soupir physiologique, sans nom d'étude ni d'auteur : le site ne cite aucune étude) | `locales/fr/protocols.json` | `.rythme__source` |
| Deux rythmes avec rétention (4-7-8, carré) | `lib/breathingProtocols.ts` | `#rythmes .intro` ; FAQ 8 ; pied (`.legal`) |
| Précautions avant usage (troubles cardiovasculaires ou respiratoires, asthme, anxiété sévère, panique, troubles dissociatifs, grossesse, traitement agissant sur le rythme cardiaque ou respiratoire) ; s'arrêter en cas de gêne ; ne pas pratiquer en conduisant | CGU en ligne § 3 et § 6 ; fiche de vérité § 6.4 | FAQ 8 (deux paragraphes) ; pied (`.legal`) |

## Contenu gratuit, rappels, données

| Chiffre | Source | Emplacements |
|---|---|---|
| Aperçu de 30 secondes de chaque séance, sans limite | `app/session.tsx:383-417`, `app/session-intro.tsx:151-177` | `#seances .intro` ; `#seances .volet--essai` (capture du bas de l'intro d'une séance Alvéo+ : « Essayer 30 secondes », « Plus tard ») ; `.offre` Gratuit ; FAQ 1 |
| Trois rappels (matin, midi, soir), heures au choix, désactivés par défaut ; 09:00, 13:00, 20:00 sur la capture | `lib/notifications.ts:99-121`, `lib/preferences.ts:57` | `#suivi .fait` « Des rappels, si tu veux » ; texte alternatif de `#suivi .volet--rappels` (le groupe des trois créneaux seulement : l'écran entier porte « Choisis jusqu'à 3 moments », écart de texte relevé par la fiche de vérité) |
| Calendrier du Profil (novembre 2026, aujourd'hui entouré) | présent dans la version en ligne et dans la suivante ; **capture à remplacer à la sortie de la 1.4.0** (Profil refondu ; les jalons affichés sous le calendrier passent de 3 à 7, d'où le recadrage sur le calendrier seul) | `#suivi .volet--calendrier` et son texte alternatif |
| Un favori gratuit, illimités avec Alvéo+ | `lib/favorites.ts:4`, `:31` | `.offre` Gratuit ; `.offre--plus` ; FAQ 1 et 2 |
| Données RevenueCat dès l'ouverture (identifiant aléatoire, IDFV, modèle, versions, dates, IP pour le pays) | fiche de vérité § 6.1 | FAQ 5 |

## Prix (à changer le jour où le prix change dans App Store Connect)

| Chiffre | Source | Emplacements |
|---|---|---|
| « En France : 4,99 € par mois ou 29,99 € par an (soit 2,49 € par mois), TTC. Ailleurs, le prix s'affiche dans ta devise sur l'App Store. » | App Store Connect ; décision du propriétaire (D 4) | `.offre--plus .offre__tarif` (les deux montants en `<strong>`, mis en valeur, dans la phrase même) et FAQ 2 : **mot pour mot, deux fois, nulle part ailleurs**. Aucun montant hors de cette phrase |
| 0 € (gratuit, sans limite de durée) | l'app est gratuite au téléchargement | `.offre .offre__tarif` (carte Gratuit) |
| Essai : formule annuelle seulement, premier abonnement, éligibilité Apple, **aucune durée écrite** | `app/paywall.tsx:210-224` | premier `.offre__conditions` ; FAQ 3 |
| Résiliation au moins 24 h avant la fin de la période | `locales/fr/paywall.json:49-52` | second `.offre__conditions` ; FAQ 4 |
| Prix de l'offre dans le JSON-LD (`"price": "0"`, `EUR`) | téléchargement gratuit | JSON-LD (`offers`) |

## Note et avis (à mettre à jour à chaque relevé, ou à retirer si la note baisse sans mise à jour)

| Chiffre | Source | Emplacements |
|---|---|---|
| 5,0 sur 5 · 8 notes · App Store France · relevé le 4 novembre 2026 | fiche App Store France | `#avis .avis__note` (un seul paragraphe). Jamais dans le héros ni dans le JSON-LD |
| Avis de Rose88rjkg, 19 mai 2026, cité mot pour mot avec « […] » | flux d'avis France | `#avis .citation--grande` |
| Avis de Wario513, 21 mai 2026, extrait mot pour mot | flux d'avis France (20 mai 17 h 28 heure du Pacifique, soit le 21 mai à Paris) | `#avis .citation` (la seconde) |

## App Store et compatibilité

| Chiffre | Source | Emplacements |
|---|---|---|
| Identifiant App Store 6763119413 | App Store Connect | `<meta name="apple-itunes-app">` ; JSON-LD (`installUrl`, `sameAs`) ; les sept liens de l'accueil (pilule de l'en-tête, badge du héros, badge de fin de démo `.badge--fin`, appel `#avis .avis__appel`, appel `#prix .prix__appel`, badge de `#installer`, lien du pied) ; QR (`assets/img/qr-app-store.svg`, à régénérer si l'adresse change) ; `mentions-legales.html` (pilule, pied) ; `404.html` (pilule, lien, pied) |
| iOS 15.1 ou plus récent | fiche App Store (« Nécessite iOS 15.1 ») | JSON-LD (`operatingSystem`) ; `#installer .intro` ; FAQ 6 ; ligne Cisco du crédit des marques (pied) |
| Pour iPhone ; ni Android ni iPad annoncé ; français et anglais | fiche App Store ; `app.json:17` | h1 ; `.heros__mention` ; `#installer` ; FAQ 6 |

## Dates

| Chiffre | Emplacements |
|---|---|
| © 2026 | pied de `index.html` et de `mentions-legales.html` (la 404 a un pied réduit, sans ©) |
| `lastmod` 2026-11-08 | `sitemap.xml` (à mettre à la date de mise en ligne) |

## Après une modification

1. Chercher l'ancien chiffre dans `index.html`, `mentions-legales.html`, `404.html` et `main.js`.
2. Vérifier que la phrase reste vraie dans les deux versions de l'app (en ligne et à venir).
3. Si un fichier de `/assets/` change, le renommer : il est servi avec un cache d'un an.
4. Aucun script en ligne : `vercel.json` n'a pas à changer tant qu'il n'en est pas ajouté.
