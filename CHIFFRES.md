# Où vit chaque chiffre de stillapp.fr (version « Lumière »)

Le site n'a pas d'étape de build : chaque chiffre est écrit en clair dans le HTML (et, pour la démo, dans `main.js`).
Ce fichier n'est pas publié (`.vercelignore`). **À relire à chaque changement de l'app, du prix ou de la fiche App Store.**
Règle de vérité : un chiffre publié est vrai dans la version en ligne de l'app **et** dans la suivante ; en cas de doute,
on retire la phrase.

Les emplacements sont donnés par section (`#id`) et sélecteur dans `index.html`, sauf mention.
**Pages légales** (`confidentialite.html`, `conditions.html`) : leur texte, vérifié ligne à ligne contre le code de
l'app (dépôt still-legal, commit b80b21c), écrit ses propres chiffres (prix, 24 h, 17 séances, 1 à 15 min, 16 séances
Alvéo+, 30 secondes, versions 1.3.1 et 1.4.0, 12 mois, 48 h, 9+, 15 ans). Un chiffre qui change s'y reporte avec une
nouvelle vérification et une nouvelle date de « Dernière mise à jour ». Pour chercher un chiffre,
tolérer les espaces insécables écrites `&nbsp;` dans le source : `grep -n '4,99&nbsp;€' index.html`.

**Mise à jour du 14 novembre 2026, sortie de l'app 1.4.0** (build 14, commit `bcca6a0` du dépôt de l'app, en ligne sur
l'App Store ce jour-là) : catalogue v2 des séances (durées, rythmes, noms « Se rendormir » et « Second souffle »), huit
rythmes au lieu de six, programme « 7 soirs pour ralentir » (l'ancien nom promettait un résultat), « pour iPhone et
iPad », équivalent mensuel « 2,50 € » (celui qu'affiche l'app), note revérifiée le 14 novembre. Les sources ci-dessous
renvoient au dépôt de l'app à ce commit.

Avant la 1.4.0 : aucun chiffre nouveau par rapport à la version précédente du site : seuls ses emplacements ont changé, plus la notation
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
| 17 séances | `lib/sessions.ts:469-712` (catalogue v2) | `<meta name="description">` ; JSON-LD (`description`) ; `#respirer .heros__chapo` ; `#seances h2` ; les 17 `.seance` des cinq `.pilier` de `#seances .piliers` |
| 1 séance offerte (Double Inspire), 16 Alvéo+ | `lib/entitlements.ts:95-101` (`canAccessSession`) | meta description et JSON-LD (« dont une offerte ») ; `.heros__chapo` ; `#seances .intro` ; `.seance__acces` « Offerte » (une seule) ; cadenas `.cadenas` (`role="img"`, `aria-label="avec Alvéo+"`) sur seize séances ; `.pilier__compte` (« 5 séances, dont 4 avec Alvéo+ », « 3 séances avec Alvéo+ » ×4 : 4 + 12 = 16) ; `.programme__detail` (« avec Alvéo+ ») ; `#seances .volet--essai` (image : « Essayer 30 secondes ») ; `#prix .offre` Gratuit (« La séance Double Inspire ») ; `.offre--plus` (« Les 16 autres séances guidées ») ; FAQ 1 et 2 ; `#rythmes .rythme--2i .rythme__source` (« dont Double Inspire, offerte ») |
| Piliers et nombre de séances : Apaiser 5, Dormir 3, Concentrer 3, Équilibrer 3, Énergiser 3 | `lib/sessions.ts` | `.pilier__compte` des cinq piliers |
| Durée conseillée des 17 séances, arrondie à la minute comme sur les cartes de l'app (`formatSessionDuration`) : Double Inspire 1 (60 s), SOS stress 1 (60 s), Relâcher 5, Paix intérieure 5, Refuge 15, Nuit paisible 1 (76 s, quatre cycles de 4-7-8), Se rendormir 2, Corps lourd 10, Avant réunion 3 (192 s), Clarté mentale 2, Performance 10 (608 s), Matin équilibré 5, Midi pivot 3, Transition soir 5, Réveil corps 2, Second souffle 1, Avant effort 3. Quinze séances proposent d'autres durées (champ `durations`), Réveil corps et Second souffle n'en ont qu'une | `lib/sessions.ts` (champs `duration` et `durations`, en secondes) | `.seance__duree` (« 5 min », au bout de la barre) ; longueur de la barre : classe `.t1` à `.t15` de chaque `.seance` (`--d` dans `styles.css`, durée / 15 de la largeur de la carte) ; `#seances .intro` (« sa durée conseillée […] la plupart proposent d'autres durées ») |
| Rythme de chaque séance (5-5, 4-6, 4-4-4-4, 4-7-8, soupir cyclique = inspire 4 s, un peu plus 2 s, expire lentement 6 s, 4-8, 4-4, dynamique 4-2) | `lib/sessions.ts` (`protocolId`), `lib/breathingProtocols.ts:50-188` | n'est plus écrit en chiffres sur les cartes (polissage 2 : les codes précédaient leur explication) ; texte lu dans `.seance__duree .vh` (« inspire 4 secondes, retiens 7, expire 8 ») ; motif de la barre (`<pattern>` `#m55`, `#m46`, `#m44`, `#m4444`, `#m478`, `#m426`, `#m48`, `#m42` du sprite SVG), tracé au vrai tempo : une seconde vaut 3,5 px, la même échelle pour toutes |
| Moments d'usage des séances (« Où que tu sois », « Coup de stress », « Au coucher ou la nuit », « Entre deux tâches », « Avant de prendre la parole », « Avant le sport »…) | contextes de `lib/sessions.ts:6-12`, intros et consignes de `locales/fr/sessions.json` ; aucune promesse | `.seance__usage` |
| Programme « 7 soirs pour ralentir » (nom depuis le 11 novembre 2026 ; ne jamais écrire l'ancien nom), pilier Dormir, une séance par soir pendant sept soirs, de Relâcher (5-5) à Corps lourd (4-8), Alvéo+ | `lib/programs.ts` (`SEVEN_NIGHTS`, `PROGRAMS`), `locales/fr/sessions.json` (`program_7j_*`, `program_locked_progress_kept`) | `#seances .programme` (sept points, symbole `#c7`) ; `.offre--plus` ; FAQ 2 ; `#rythmes .rythme--478` (« deux soirs du programme ») |

## L'orbe et la démo

| Chiffre | Source | Emplacements |
|---|---|---|
| Durées 1, 2, 5, 10, 15 min ; gratuite | `lib/sessionSettings.ts:31`, `lib/sessionLaunch.ts:73-74` | meta description et JSON-LD (« de 1 à 15 ») ; `.heros__chapo` ; `#orbe-libre h2` et `.intro` ; `#orbe-libre .ecran--fin` (texte alternatif : « Séance libre · Cohérence cardiaque », « Encore 1 min » ; le sélecteur de durée de la 1.4.0 est une feuille native d'iOS, sans capture) ; `.offre` Gratuit ; FAQ 1 ; `.demo__fin-texte` (« jusqu'à 15 minutes ») ; `#app .ecran--accueil` (texte alternatif « 1 min ») |
| Rythme 5-5 : cinq secondes, cinq secondes, six respirations par minute ; la démo fait 6 cycles de 10 s = 60 s | `lib/breathingProtocols.ts:52-68` | `#orbe-libre .intro` ; `#rythmes .rythme--55` ; FAQ 1 ; `main.js` (`PHASE = 5000`, `PHASES = 12`) ; `.demo__fin-titre` « Six respirations. » ; `.demo__progression` « Respiration 1 sur 6 » ; annonces de `main.js` (en pause, le minuteur garde le temps réellement restant ; à la reprise, la minute repart du début de la phase en cours : « Reprise au début de l'inspire ») |
| Amplitude de l'orbe 0,65 → 1,15 de l'app, ramenée à 0,565 → 1,00 ; fin à 0,9 (l'orbe s'épanouit) | `lib/breathingProtocols.ts:68` | `main.js` (`K_MIN`, `K_MAX`, `K_FIN`) |
| Ambiances (forêt, vagues, pluie, drone, ou rien), fonds, carillons, vibrations | `lib/sessionSettings.ts:1-28` | `#orbe-libre .intro` ; texte alternatif de `.ecran--reglages` |

## Rythmes

| Chiffre | Source | Emplacements |
|---|---|---|
| Huit rythmes dans les séances (catalogue v2) | `ALL_PROTOCOLS` de `lib/breathingProtocols.ts`, huit `protocolId` dans `lib/sessions.ts` | `#rythmes h2` et `.intro` ; les huit `.rythme` |
| Phases et libellés de l'app : 5-5 ; 4-6 ; 4-4-4-4 (« Poumons vides ») ; 4-7-8 ; 4 + 2 + 6 (« Un peu plus », « Expire lentement ») ; 4-8 ; 4-4 ; 4-2 (« Relâche ») (écrites « Inspire 4 s · Retiens 7 s · Expire 8 s », l'unité partout) ; noms : Cohérence cardiaque, Cohérence 4-6, Respiration carrée, Respiration 4-7-8, Soupir cyclique, Respiration 4-8, Rythme régulier, Respiration dynamique | `lib/breathingProtocols.ts`, `locales/fr/protocols.json` | `.rythme__phases` et `.rythme__nom` ; arcs SVG de chaque `.anneau` (`stroke-dasharray` proportionnels, longueur de chemin 100) ; durées d'animation dans `styles.css` (`10s` pour 5-5 et 4-6, `16s`, `19s`, `12s`, `12s`, `8s`, `6s` pour `.souffle` et `.aiguille`) et images clés `r55`, `r46`, `r4444`, `r478`, `r2i`, `r48`, `r44`, `r42` |
| Nombre de séances par rythme : 5-5 l'orbe libre et trois séances, 4-6 quatre, carré deux, 4-7-8 une (Nuit paisible) et deux soirs du programme, soupir cyclique deux (dont Double Inspire), 4-8 deux, 4-4 une (Clarté mentale), dynamique deux (3 + 4 + 2 + 1 + 2 + 2 + 1 + 2 = 17) ; dosage : 4-7-8 « quatre cycles pour commencer, huit au plus » (`maxCycles` 8), dynamique deux minutes au plus (`maxCycles` 20) | `lib/sessions.ts`, `lib/programs.ts`, `lib/breathingProtocols.ts` | `.rythme__source` |
| Sources citées comme inspirations (Servan-Schreiber et O'Hare ; Mark Divine ; Andrew Weil ; soupir cyclique, sans nom d'étude ni d'auteur : le site ne cite aucune étude). Formulation prudente pour les quatre rythmes sans source : 4-6 « une variante douce de la cohérence », 4-8 « l'expire dure deux fois l'inspire », 4-4 « un rythme simple, sans rétention », dynamique « un rythme plus vif, sans rétention, à suivre sans forcer » (reprises de `*_source_label` et `*_source_long`) | `locales/fr/protocols.json` | `.rythme__source` |
| Deux rythmes avec rétention (4-7-8, carré) | `lib/breathingProtocols.ts` | `#rythmes .intro` ; FAQ 8 ; pied (`.legal`) |
| Précautions avant usage (troubles cardiovasculaires ou respiratoires, asthme, anxiété sévère, panique, troubles dissociatifs, grossesse, traitement agissant sur le rythme cardiaque ou respiratoire) ; s'arrêter en cas de gêne ; ne pas pratiquer en conduisant | CGU en ligne § 3 et § 6 ; fiche de vérité § 6.4 | FAQ 8 (deux paragraphes) ; pied (`.legal`) |

## Contenu gratuit, rappels, données

| Chiffre | Source | Emplacements |
|---|---|---|
| Aperçu de 30 secondes de chaque séance, sans limite | `app/session.tsx:383-417`, `app/session-intro.tsx:151-177` | `#seances .intro` ; `#seances .volet--essai` (bas de l'intro d'Avant réunion pour un non-abonné : « Aperçu gratuit de 30 secondes · séance complète avec Alvéo+ », « Essayer 30 secondes ») ; `.offre` Gratuit ; FAQ 1 |
| Trois rappels par jour, l'heure de chacun au choix (09:00, 13:00, 20:00 par défaut ; leur nom suit l'heure), désactivés par défaut | `lib/notifications.ts:38-42`, `lib/reminderSchedule.ts`, `lib/preferences.ts:78`, `locales/fr/notifications.json` | `#suivi .fait` « Des rappels, si tu veux » ; `#suivi .volet--rappels` et son texte alternatif (les trois rappels aux horaires par défaut, rendus depuis la 1.4.0) |
| Carte de la série du Profil (« 5 jours de série », « Fait pour aujourd'hui · encore 9 jours avant deux semaines de série », quatre jours de séance cette semaine) | **données de démonstration** des captures App Store de la 1.4.0 (« Camille »), écran rendu depuis le code de la 1.4.0 ; libellés de `locales/fr/common.json` (`streak_*`, `week_*`, `milestone_deux_semaines_inline`) | `#suivi .volet--profil` et son texte alternatif |
| Un favori gratuit, illimités avec Alvéo+ | `lib/favorites.ts:4`, `:31` | `.offre` Gratuit ; `.offre--plus` ; FAQ 1 et 2 |
| Données RevenueCat dès l'ouverture (identifiant aléatoire, IDFV, modèle, versions, dates, IP pour le pays) | fiche de vérité § 6.1 | FAQ 5 |

## Prix (à changer le jour où le prix change dans App Store Connect)

| Chiffre | Source | Emplacements |
|---|---|---|
| « En France : 4,99 € par mois ou 29,99 € par an (soit 2,50 € par mois), TTC. Ailleurs, le prix s'affiche dans ta devise sur l'App Store. » | App Store Connect ; décision du propriétaire (D 4) ; « 2,50 € » est l'équivalent mensuel qu'affiche l'app sous l'annuelle (« Soit 2,50 € / mois », `pricePerMonthString` de l'App Store, `app/paywall.tsx:526`) : 29,99 ÷ 12 = 2,499 (« 2,49 € » jusqu'au 13 novembre 2026) | `.offre--plus .offre__tarif` (les deux montants en `<strong>`, mis en valeur, dans la phrase même) et FAQ 2 : **mot pour mot, deux fois, nulle part ailleurs** sur l'accueil. Aucun montant hors de cette phrase ; les conditions d'utilisation (`conditions.html` § 7) écrivent aussi « 4,99&nbsp;€ par mois » et « 29,99&nbsp;€ par an » en France, dans leur propre phrase |
| 0 € (gratuit, sans limite de durée) | l'app est gratuite au téléchargement | `.offre .offre__tarif` (carte Gratuit) |
| Essai : formule annuelle seulement, premier abonnement, éligibilité Apple, **aucune durée écrite** | `app/paywall.tsx:210-224` | premier `.offre__conditions` ; FAQ 3 |
| Résiliation au moins 24 h avant la fin de la période | `locales/fr/paywall.json:49-52` | second `.offre__conditions` ; FAQ 4 |
| Prix de l'offre dans le JSON-LD (`"price": "0"`, `EUR`) | téléchargement gratuit | JSON-LD (`offers`) |

## Note et avis

Aucun avis ni note sur le site depuis le 14 novembre 2026 : Apple n'autorise la citation d'un avis qu'avec
l'accord de son auteur (« Customer reviews may be used in marketing materials only if permission from the reviewer is
granted », developer.apple.com/app-store/ratings-and-reviews/), accord que le propriétaire n'a pas confirmé. La
section `#avis` (deux avis, Rose88rjkg et Wario513, et la note 5,0 sur 5 · 8 notes) est retirée avec sa couche de ciel.
La note seule peut revenir si elle reflète la note actuelle (même page d'Apple) : la relever le jour même.

## App Store et compatibilité

| Chiffre | Source | Emplacements |
|---|---|---|
| Identifiant App Store 6763119413 ; liens de campagne `https://apps.apple.com/app/apple-store/id6763119413?pt=JETON_FOURNISSEUR&amp;ct=site&amp;mt=8` (depuis le 14 novembre 2026 ; `JETON_FOURNISSEUR` est à remplacer par le jeton `pt` d'App Store Connect avant la mise en ligne : `grep -rl JETON_FOURNISSEUR *.html`) | App Store Connect (Analytics › Acquisition › Campaigns) | `<meta name="apple-itunes-app">`, JSON-LD (`installUrl`, `sameAs`) et QR : adresse universelle, sans campagne ; liens de campagne : les six liens de l'accueil (pilule de l'en-tête, badge du héros, badge de fin de démo `.badge--fin`, appel `#prix .prix__appel`, badge de `#installer`, lien du pied) ; QR (`assets/img/qr-app-store.svg`, à régénérer si l'adresse change) ; `mentions-legales.html`, `confidentialite.html` et `conditions.html` (pilule, pied) ; `404.html` (pilule, lien, pied) |
| iOS (et iPadOS) 15.1 ou plus récent | fiche App Store (`minimumOsVersion` 15.1, relevé le 14 novembre 2026) | JSON-LD (`operatingSystem`) ; `#installer .intro` ; FAQ 6 ; ligne Cisco du crédit des marques (pied) |
| Pour iPhone et iPad (l'app accepte l'iPad depuis la 1.3.1 : `supportsTablet: true`, `app.json:17` ; fiche App Store : appareils iPad listés) ; pas d'Android ; français et anglais | fiche App Store ; `app.json` | `<title>`, meta description, `og:description`, JSON-LD ; `.heros__mention` ; `#installer` ; FAQ 6 ; pied des quatre pages (« pour iPhone et iPad »). Le h1 et `og:title` (« pour iPhone ») ne changent pas : l'image de partage les reproduit |

## Dates

| Chiffre | Emplacements |
|---|---|
| © 2026 | pied de `index.html`, `mentions-legales.html`, `confidentialite.html` et `conditions.html` (la 404 a un pied réduit, sans ©) |
| `lastmod` 2026-11-14 (accueil, mentions légales, confidentialité, conditions : dernier changement de leur contenu, la mise à jour de la 1.4.0 ; le pied des quatre pages dit « pour iPhone et iPad ») | `sitemap.xml` (à mettre à la date de mise en ligne) |
| Dernière mise à jour : 14 novembre 2026 (politique : § 6.2 et § 8, effacement de l'identifiant des statistiques depuis la 1.4.0) ; 12 novembre 2026 (conditions) | `confidentialite.html` et `conditions.html` (`.annexe__maj`) : date du texte vérifié, à changer avec lui |

## Après une modification

1. Chercher l'ancien chiffre dans `index.html`, `mentions-legales.html`, `confidentialite.html`, `conditions.html`,
   `404.html` et `main.js`.
2. Vérifier que la phrase reste vraie dans les deux versions de l'app (en ligne et à venir).
3. Si un fichier de `/assets/` change, le renommer : il est servi avec un cache d'un an.
4. Aucun script en ligne : `vercel.json` n'a pas à changer tant qu'il n'en est pas ajouté.
