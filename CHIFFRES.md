# Où vit chaque chiffre de stillapp.fr

Le site n'a pas d'étape de build : chaque chiffre est écrit en clair dans le HTML (et, pour la démo et « Pour maintenant », dans `main.js`).
Ce fichier n'est pas publié (`.vercelignore`). **À relire à chaque changement de l'app, du prix ou de la fiche App Store.**
Règle de vérité : un chiffre publié est vrai dans la version en ligne de l'app **et** dans la suivante ; en cas de doute, on retire la phrase.

Les emplacements sont donnés par sélecteur CSS (ou par section) dans `index.html`, sauf mention. Pour chercher un chiffre, tolérer
les trois espaces utilisées par le site (ordinaire, insécable U+00A0, fine insécable U+202F) : `grep -nP '4,99[ \x{a0}\x{202f}]€' index.html`.

## Séances

| Chiffre | Source (dépôt de l'app) | Emplacements |
|---|---|---|
| 17 séances | `lib/sessions.ts:74-297` | `<meta name="description">` ; JSON-LD (`MobileApplication.description`) ; `#moments .intro` ; les 17 lignes `#moments .lignes .ligne` |
| 1 séance offerte (Double Inspire), 16 Alvéo+ | `lib/entitlements.ts:71-77` | meta description et JSON-LD (« dont une offerte ») ; `.acces--offerte` (une seule, sur Double Inspire) et les 16 `.acces` « Alvéo+ » du sommaire ; `.moments__fin .note` ; `.offre` Gratuit (« La séance Double Inspire ») ; `.offre--plus` (« Les 16 autres séances ») ; FAQ 1 |
| Durées des 17 séances (3, 5, 3, 5, 10, 1, 1, 5, 3, 5, 5, 5, 5, 10, 2, 15, 8 min, dans l'ordre du sommaire) | `lib/sessions.ts` (champ `duration`, en secondes) | `#moments .duree`, deux fois par ligne : texte visible « 3 min » (`aria-hidden`) et texte lu « 3 minutes » (`.vh`) |
| Programme « 7 jours pour mieux dormir » réservé à Alvéo+ | `lib/programs.ts:21-43`, `components/ProgramCard.tsx:52-56` | ligne du programme (moment « 22 h 45 · Au lit ») ; `.offre--plus` ; FAQ 1 |

## L'orbe et la démo

| Chiffre | Source | Emplacements |
|---|---|---|
| Durées 1, 2, 5, 10, 15 min ; 1 min par défaut | `lib/sessionSettings.ts:31`, `lib/preferences.ts:48` | meta description et JSON-LD (« de 1 à 15 ») ; `.heros__chapo` (une, cinq, quinze minutes) ; `.ligne-orbe` (« de 1 à 15 min ») ; `#app`, étape 1 (« ou 2, 5, 10, 15 ») ; biffure 1 ; `.offre` Gratuit ; FAQ 1 et 5 ; `.demo__fin-texte` (« jusqu'à 15 minutes ») |
| Rythme 5-5 : 6 cycles de 10 s = 60 s | `lib/breathingProtocols.ts:52-68` | `.ligne-orbe` (« rythme 5-5 ») ; FAQ 5 (« six respirations lentes ») et 8 ; `main.js` (`PHASE = 5000`, `PHASES = 12`) ; `.demo__fin-titre` « Six respirations. » ; `.demo__progression` « Respiration 1 sur 6 » ; annonce de fin (`main.js`) |
| Amplitude de l'orbe 0,65 → 1,15 de l'app, ramenée à 0,565 → 1,00 ; fin à 0,75 | `lib/breathingProtocols.ts:68` | `main.js` (`K_MIN`, `K_MAX`, `K_FIN`) |
| Orbe gratuite | `lib/sessionLaunch.ts:73-74` | `.ligne-orbe .acces--gratuite` ; `#prix .titre` ; `#installer .intro` |

## Rythmes et contenu gratuit

| Chiffre | Source | Emplacements |
|---|---|---|
| Six rythmes dans les séances, dont quatre inspirés de méthodes connues | six `protocolId` dans `lib/sessions.ts` ; « Inspiré de… » dans `locales/fr/protocols.json` | `.app__ligne` ; FAQ 8 |
| 4-4-4-4, 4-7-8, 4 et 8, 4 et 4 | `lib/breathingProtocols.ts:50-188` | FAQ 8 (et « le 4-7-8 » dans `.app__ligne`). La prise en main suit un 7ᵉ rythme (4-6), **non cité** : d'où « dans les séances » |
| Aperçu de 30 secondes de chaque séance | `app/session.tsx:383-417` | `.moments__fin .note` ; `.offre` Gratuit ; `.prix__pied .voix` ; FAQ 1 et 3 |
| Trois rappels par jour (matin, midi, soir ; 09:00, 13:00, 20:00 par défaut) | `lib/notifications.ts:99-121`, `lib/preferences.ts:57` | biffure 5 ; `.rappels figcaption` ; texte alternatif de l'écran des rappels |
| Un favori gratuit, illimités avec Alvéo+ | `lib/favorites.ts:4`, `:31` | `.offre` Gratuit ; `.offre--plus` ; FAQ 1 |

## Prix (à changer le jour où le prix change dans App Store Connect)

| Chiffre | Source | Emplacements |
|---|---|---|
| 4,99 € par mois, 29,99 € par an (soit 2,49 € par mois), TTC, France | App Store Connect ; décision D 4 | `.offre__conditions` (première phrase) et FAQ 2 : **mot pour mot, deux fois, nulle part ailleurs** |
| Essai : formule annuelle seulement, premier abonnement, **aucune durée écrite** | `app/paywall.tsx:210-224` | `.offre__conditions` ; FAQ 3 |
| Résiliation au moins 24 h avant le renouvellement | `locales/fr/paywall.json:49-52` | `.offre__conditions` ; FAQ 4 (deux fois) |
| Prix de l'offre dans le JSON-LD (`"price": "0"`, `EUR`) | l'app est gratuite au téléchargement | JSON-LD (`MobileApplication.offers`) |

## Note et avis (à mettre à jour à chaque relevé, ou à retirer si la note baisse sans mise à jour)

| Chiffre | Source | Emplacements |
|---|---|---|
| 5,0 sur 5 · 8 notes · App Store France · relevé le 4 novembre 2026 | fiche App Store France (`ratingFormatted`, `ratingCount`) | `.avis__note` (un seul paragraphe). Jamais dans le héros, jamais dans le JSON-LD |
| Avis de Wario513, 21 mai 2026 | flux d'avis France (`2026-05-20T17:28:47-07:00`, soit le 21 mai à Paris) | `.epigraphe figcaption` |
| Avis de Rose88rjkg, 19 mai 2026 | flux d'avis France (`2026-05-19T10:49:00-07:00`) | `.citation figcaption` |

## App Store et compatibilité

| Chiffre | Source | Emplacements |
|---|---|---|
| Identifiant App Store 6763119413 | App Store Connect | `index.html` : `<meta name="apple-itunes-app">`, JSON-LD (`installUrl`, `sameAs`), les 7 liens (pilule de l'en-tête, badge du héros, `.avis__lien`, `.pilule--prix`, badge de `#installer`, lien du pied, pilule du dock) ; QR (`assets/img/qr-app-store.svg`, encodé dans les modules : à régénérer si l'adresse change) ; `mentions-legales.html` (1 lien, pied) ; `404.html` (2 liens) |
| iOS 15.1 ou plus récent | fiche App Store (« Nécessite iOS 15.1 ») | FAQ 10 **seulement** (et la ligne Cisco du crédit des marques, au pied) |

## « Pour maintenant » et heures

| Chiffre | Source | Emplacements |
|---|---|---|
| Plages horaires (tableau ci-dessous) | fonction du **site**, jamais attribuée à l'app (spécification § 3.3) | `main.js`, fonction `momentPour` |
| Heures des moments : 7 h 10, 9 h 50, 11 h 20, 14 h 30, 18 h 40, 22 h 45, 3 h 12, Dimanche | décor (spécification § 4.5) | `#moments .moment__heure` |
| « Il est {H} h {MM} » | heure locale de l'appareil, jamais envoyée | `#heure` (rempli par `main.js`, `majHeure`) |

| Heure locale | Moment marqué |
|---|---|
| 5 h 00 à 8 h 59 | 7 h 10 · Au réveil |
| 9 h 00 à 10 h 59 | 9 h 50 · Avant la réunion |
| 11 h 00 à 12 h 59 | 11 h 20 · Quand tout s'accélère |
| 13 h 00 à 16 h 59 | 14 h 30 · Après le déjeuner |
| 17 h 00 à 20 h 59 | 18 h 40 · En quittant le travail |
| 21 h 00 à 1 h 59 | 22 h 45 · Au lit |
| 2 h 00 à 4 h 59 | 3 h 12 · En pleine nuit |
| le dimanche, de 9 h 00 à 20 h 59 (prioritaire) | Dimanche · Quand tu as le temps |

## Dates

| Chiffre | Emplacements |
|---|---|
| © 2026 | pied de page complet de `index.html` et de `mentions-legales.html` (la 404 a un pied réduit, sans ©) |
| `lastmod` 2026-11-04 | `sitemap.xml` (à mettre à la date de mise en ligne) |

## Après une modification

1. Chercher l'ancien chiffre dans `index.html`, `mentions-legales.html`, `404.html` et `main.js` (en tolérant U+00A0 et U+202F).
2. Vérifier que la phrase reste vraie dans les deux versions de l'app (en ligne et à venir).
3. Si un fichier de `/assets/` change, le renommer (suffixe `-v2`) : il est servi avec un cache d'un an.
4. Si le script en ligne de `index.html` change d'un seul caractère, recalculer son empreinte dans la CSP de `vercel.json` (voir `README.md`).
