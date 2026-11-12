# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Site statique : HTML, CSS et JavaScript vanilla, aucune dépendance, aucune étape de build, une seule origine (stillapp.fr). Hébergé sur Vercel avec la CSP de `vercel.json` (`default-src 'none'`, `style-src 'self'` : aucun attribut `style=""`, aucune balise `<style>`, aucun script en ligne).

## Users

Adultes francophones pressés, qui n'ont « pas le temps de méditer » : une minute entre deux réunions, cinq avant de dormir. Ils arrivent sur stillapp.fr depuis la fiche App Store, un partage ou une recherche, le plus souvent sur iPhone, parfois sur grand écran. Leur tâche : comprendre en quelques secondes ce qu'est Alvéo, se dire « c'est beau », puis installer l'app.

## Product Purpose

Alvéo est une app iPhone de respiration guidée, faite en France par un développeur indépendant. Une orbe lumineuse rythme le souffle, un mot l'accompagne, un carillon et une vibration marquent chaque phase ; aucune voix. L'orbe libre est gratuite (1, 2, 5, 10 ou 15 minutes, rythme 5-5). 17 séances guidées de 1 à 15 minutes, en cinq piliers, dont Double Inspire offerte et 16 dans Alvéo+. Le site réussit quand un visiteur ouvre la fiche App Store (https://apps.apple.com/app/id6763119413) après avoir compris, et idéalement essayé, l'orbe.

## Positioning

L'orbe est le bouton : un seul toucher lance une minute, sans menu ni écran intermédiaire. Le guidage est sans voix (orbe, un mot, carillon, vibration propre à chaque rythme). Chaque séance payante s'essaie 30 secondes, autant de fois qu'on veut. Pas de compte. Ces faits sont vérifiés dans le code de l'app (fiche de vérité, § 9).

## Operating Context

Le site est un unique accueil, plus /mentions-legales, la politique de confidentialité (/confidentialite) et les conditions d'utilisation (/conditions) de l'app, et une 404. La démo « J'ai 1 minute » reproduit la séance libre (6 respirations 5-5, 60 s) sans son ni vibration, avec minuteur, pause, arrêt, Wake Lock, pause onglet masqué ou orbe hors écran, annonces aria-live, et mouvement réduit. La page est lue d'abord sur grand écran (paysage), aussi sur iPhone en portrait, avec et sans JavaScript.

## Capabilities and Constraints

- Vérité absolue : seuls les faits de FICHE_VERITE_PRODUIT.md et CHIFFRES.md ; aucune allégation de santé, d'efficacité ou de science ; aucune fonction de la 1.4.0 non sortie (pas de widget), rien d'« anonyme » ni de « 100 % local ».
- Destination unique de tous les appels : https://apps.apple.com/app/id6763119413, sans paramètre ni `target`.
- Badge Apple officiel noir français inchangé, ≥ 40 px, zone de protection d'un quart de sa hauteur, jamais deux badges dans une même fenêtre au repos ; crédits Apple/iPhone/iCloud/Safari/App Store/IOS (Cisco) au pied ; `<meta name="apple-itunes-app" content="app-id=6763119413">`.
- Jamais d'iPhone dessiné : écrans réels de l'app dans des cadres « écran » arrondis ou en pleine image.
- Budgets : HTML ≤ 60 Ko, CSS ≤ 60 Ko, JS ≤ 45 Ko ; WebP avec srcset et chargement différé hors héros ; Lighthouse mobile ≥ 95 / 100 / 100 / 100, LCP < 2,5 s ; animations sur transform et opacity ; aucune ressource tierce, aucun cookie, aucun stockage.
- Prix : « En France : 4,99 € par mois ou 29,99 € par an (soit 2,49 € par mois), TTC. Ailleurs, le prix s'affiche dans ta devise sur l'App Store. » Essai sur l'annuelle seulement, pour un premier abonnement, selon l'éligibilité décidée par Apple, durée affichée par Apple (jamais écrite).
- Non décidé côté produit (hors site) : iPad, widget, calendrier de la 1.4.0. Le site s'en tient à « pour iPhone ».

## Brand Commitments

Nom « Alvéo » (orbe féminine, « Alvéo+ »), tutoiement, phrases courtes, typographie française (espaces insécables, apostrophes typographiques, guillemets « »). Charte « Verre et sable » de `theme.ts` : nuit #0C0B0E, blancs chauds #F7F3EE, sable #D4906B / #D4A88E, orbe à trois disques (#B87652, #D4A88E, #F0D5BC), piliers Apaiser (mauve), Dormir (indigo), Concentrer (vert), Équilibrer (sable), Énergiser (terracotta). Polices de l'app, auto-hébergées : Instrument Serif (titres, voix, italique réservé à un mot ou un rôle) et Inter (interface). Exception documentée à la règle overused-font du détecteur : la charte impose Inter.

## Evidence on Hand

- Captures brutes de l'app (iPhone, 1206 × 2622) : `/tmp/claude-0/-home-user-still-app/e6563af3-5f09-5092-b161-f8389c8deb58/scratchpad/shots-v2-dl/shots/`. Écrans publiés, entiers et tous à la même proportion (1206 × 2180, barre d'état retirée) : 06 premier souffle, 08 accueil (coupé au-dessus de la description du programme, qui promet « s'endormir plus vite »), 23 séance commandes masquées, 24 séance, 26 réglages en séance, 18 profil (calendrier et jalons) ; plus le groupe des trois rappels de 34, recadré à ses bords (l'écran entier porte « Choisis jusqu'à 3 moments », écart de texte relevé par la fiche). Écartés : 27 fin de séance (« 1 min accomplie » sur Relâcher, « 1 jours de suite »), 10 durée (même fond et même titre que l'accueil), 20 et 39 intro de séance, 29 à 31 paywall et aperçu (allégations, prix en dollars, « 7 jours offerts »), 05 rappels de la prise en main (« 3x plus régulièrement »), 13 et 37 liste des séances (non chargée), 32 et 33 réglages (« 7 jours offerts », « anonymes »), les captures « dyn » (texte agrandi).
- Note App Store : 5,0 sur 5 · 8 notes · App Store France · relevé le 4 novembre 2026. Deux avis cités mot pour mot : Rose88rjkg (19 mai 2026) et Wario513 (21 mai 2026).
- Absences à ne jamais combler : aucun article de presse, aucun chiffre d'utilisateurs, aucun autre témoignage, aucune durée d'essai vérifiée.

## Product Principles

1. Prouver, pas affirmer : l'orbe respire sur la page, les écrans sont réels, les chiffres sont sourcés.
2. Une lumière, une pièce : la page est une scène sombre où une seule lumière vit ; tout le reste est air et typographie.
3. Une minute suffit : la page se comprend en trois écrans, l'installation est toujours à portée.
4. Doux sans mentir : des moments, une respiration à suivre, une pause ; jamais un résultat promis.
5. Rapide et accessible d'abord : la lumière et le parallaxe s'effacent devant la lecture, le mouvement réduit et le budget.

## Accessibility & Inclusion

AA pour tout texte, focus visible, cibles 44 px, tailles en rem, contenu lisible sans JavaScript, `prefers-reduced-motion: reduce` (parallaxe et apparitions coupées, lumière statique, démo guidée par la lumière), démo pilotable au clavier et annoncée (aria-live), un seul h1, titres hiérarchisés, `lang="fr"`, pause accessible pour l'orbe au repos (WCAG 2.2.2) et pour les anneaux des rythmes.
