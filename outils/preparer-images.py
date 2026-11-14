#!/usr/bin/env python3
"""Prépare les images publiées de stillapp.fr, version « Lumière » (une fois, hors ligne).

Rien n'est codé en dur : chaque source se donne en argument, et seules les
étapes dont la source est fournie sont exécutées.

  python3 outils/preparer-images.py --site .
      --captures <dossier des écrans bruts de l'app 1.4.0 (voir ECRANS)>
      --rayons                      (rayons de l'orbe, calculés : aucune source)
      --grain                       (grain de la page, calculé : aucune source)
      --icone    <icône de l'app, 1024 × 1024 (assets/icon.png du dépôt de l'app)>
      --qr       <qr-app-store.svg brut (fill="currentColor", viewBox 0 0 29 29)>
      --badge    <badge officiel Apple « Télécharger dans l'App Store », FR, noir>
      --marque   <dossier contenant favicon.ico, favicon.svg et apple-touch-icon.png>

Dépendance : Pillow (pip install pillow).
Rappel : les fichiers de /assets/ sont servis avec un cache d'un an
(« immutable ») ; tout fichier modifié doit changer de nom (suffixe -v2).
"""
import argparse
import filecmp
import math
import os
import random
import re
import shutil
import sys

from PIL import Image, ImageFilter

# Écrans de l'app 1.4.0 (build 14, commit bcca6a0 du dépôt de l'app) : (capture, taille attendue, boîte
# (x0, y0, x1, y1), largeurs publiées). Deux sources, toutes deux rendues depuis le code exact de la 1.4.0 :
# - les écrans bruts des captures App Store (1320 × 2868, iPhone 6,9 pouces, données de démonstration « Camille ») :
#   accueil, ambiances-accueil (feuille « Réglages de séance »), fin (séance libre terminée), intro-avant-reunion-apercu
#   (intro d'une séance Alvéo+ pour un non-abonné), profil ;
# - le banc de rendu web de l'app (1179 × 2556, iPhone 393 × 852 pt) : lecteur-calme (séance libre, 6 s après le
#   départ) et rappels-defaut (« Horaires des rappels » aux trois horaires par défaut, 09:00, 13:00, 20:00 : l'écran
#   « rappels » du banc, état « gratuit », avec des préférences sans `reminderTimes` posées par `stockage` ; l'état
#   « gratuit » du banc en enregistre deux, 08:30 et 21:45).
# Barre d'état retirée. Un seul écran « orbe + Inspire » sur la page (la séance). Les écrans de devant et la séance
# gardent la proportion 1206 × 2180 des versions précédentes ; la fin garde celle de l'ancien écran de durée (le
# sélecteur de durée de l'Accueil est une feuille native d'iOS, que le banc ne rend pas).
# - accueil : jusqu'au haut de la carte du programme (« 7 soirs pour ralentir » est sous le bord) ;
# - fin : « Séance terminée », « Séance libre · Cohérence cardiaque », « 1 min accomplie », « Encore 1 min » ;
# - reglages : la feuille « Réglages de séance » ouverte sur l'Accueil, jusqu'aux fonds ;
# - essai : le bas de l'intro d'Avant réunion pour un non-abonné, « Aperçu gratuit de 30 secondes · séance complète
#   avec Alvéo+ » et « Essayer 30 secondes » ;
# - rappels : la carte des trois rappels, recadrée à ses bords (rayon 72 px : 6,8 % / 14 % en CSS) ;
# - profil : la carte de la série du Profil (5 jours de série, la semaine, « Tu construis ton rituel. »).
# Les fichiers de /assets/ sont servis « immutable » : un écran refait change de nom (-v2, -v3…).
APP = (1320, 2868)
BANC = (1179, 2556)
ECRANS = {
    "e-accueil-v2": ("accueil.png", APP, (0, 150, 1320, 2536), (440, 660, 880)),
    "e-seance-v2": ("lecteur-calme.png", BANC, (0, 185, 1179, 2316), (440, 660, 880)),
    "e-fin": ("fin.png", APP, (0, 150, 1320, 2230), (440, 660, 880)),
    "e-reglages-v2": ("ambiances-accueil.png", APP, (0, 380, 1320, 2766), (440, 660, 880)),
    "essai-v2": ("intro-avant-reunion-apercu.png", APP, (0, 2330, 1320, 2750), (480, 960)),
    "rappels-v2": ("rappels-defaut.png", BANC, (60, 574, 1119, 1089), (480, 960)),
    "profil": ("profil.png", APP, (0, 500, 1320, 1640), (480, 720, 960)),
}
VOLETS = ("essai-v2", "rappels-v2", "profil")

# Rayons de l'orbe : seize rayons irréguliers (début, crête, fin en degrés depuis midi, alpha de crête),
# crème #F0D5BC, masque radial, flou cuit dans le fichier ; immobiles, ils respirent avec l'orbe.
# v2 : gain ×3 (3,9 au lieu de 1,3) pour qu'on les voie à l'œil nu, d'où le nouveau nom de fichier.
RAYONS = [(14.9, 18.3, 21.7, .087), (36.7, 40.0, 43.3, .071), (54.7, 58.0, 61.2, .073), (80.5, 82.8, 85.0, .059),
          (95.2, 99.2, 103.2, .076), (112.8, 117.2, 121.7, .088), (139.2, 142.7, 146.3, .052), (155.5, 158.8, 162.1, .048),
          (173.6, 176.2, 178.8, .046), (193.8, 196.9, 200.0, .083), (215.8, 219.4, 223.0, .067), (240.6, 243.7, 246.9, .058),
          (268.8, 273.3, 277.8, .083), (296.0, 298.8, 301.6, .055), (314.4, 316.5, 318.7, .079), (332.9, 337.0, 341.1, .062)]
MASQUE = ((0, 1), (.46, 1), (.62, .55), (.8, .18), (1, 0))  # rayon relatif → opacité (le bord de l'orbe est à 0,5)


def trouver(dossier, nom):
    chemin = os.path.join(dossier, nom)
    if not os.path.isfile(chemin):
        sys.exit(f"Introuvable : {chemin}")
    return chemin


def ecrans(captures, sortie):
    for nom, (fichier, taille, boite, largeurs) in ECRANS.items():
        im = Image.open(trouver(captures, fichier)).convert("RGB")
        if im.size != taille:
            sys.exit(f"{nom} : capture de {im.size}, {taille[0]} × {taille[1]} attendu")
        im = im.crop(boite)
        for largeur in largeurs:
            hauteur = round(im.height * largeur / im.width)
            chemin = os.path.join(sortie, f"{nom}-{largeur}.webp")
            qualite = 84 if nom in VOLETS else 82
            im.resize((largeur, hauteur), Image.LANCZOS).save(chemin, "WEBP", quality=qualite, method=6)
            print(f"{chemin}  {largeur} × {hauteur}  {os.path.getsize(chemin) / 1024:.1f} Ko")


def interp(x, points):
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        if x <= x1:
            return y0 + (y1 - y0) * (x - x0) / (x1 - x0) if x1 > x0 else y1
    return points[-1][1]


def rayons(sortie, n=640, gain=3.9):
    alpha = Image.new("L", (n, n))
    px = alpha.load()
    c = (n - 1) / 2
    for y in range(n):
        for x in range(n):
            dx, dy = x - c, y - c
            r = math.hypot(dx, dy) / (n / 2)
            if r >= 1:
                continue
            angle = (math.degrees(math.atan2(dx, -dy)) + 360) % 360  # 0° à midi, sens horaire
            a = 0.0
            for debut, crete, fin, al in RAYONS:
                if debut <= angle <= crete:
                    a = max(a, al * (angle - debut) / (crete - debut))
                elif crete < angle <= fin:
                    a = max(a, al * (fin - angle) / (fin - crete))
            px[x, y] = min(255, round(a * interp(r, MASQUE) * gain * 255))
    alpha = alpha.filter(ImageFilter.GaussianBlur(n * 0.012))
    im = Image.new("RGBA", (n, n), (240, 213, 188, 0))
    im.putalpha(alpha)
    chemin = os.path.join(sortie, "rayons-orbe-v2.webp")
    im.save(chemin, "WEBP", quality=90, alpha_quality=100, method=6)
    print(f"{chemin}  {n} × {n}  {os.path.getsize(chemin) / 1024:.1f} Ko")


def grain(sortie, n=128):
    # Bruit gris, alpha cuit dans le fichier (0 à 3,9 %) : posé à opacité 1, il casse les bandes des dégradés.
    # Le grain.png publié vient de la construction v2 ; cette étape en refait un équivalent (même tuile, même
    # plage d'alpha), pas une copie à l'octet près.
    random.seed(7)
    im = Image.new("RGBA", (n, n))
    px = im.load()
    for y in range(n):
        for x in range(n):
            v = random.randint(0, 255)
            px[x, y] = (v, v, v, random.randint(0, 10))
    chemin = os.path.join(sortie, "grain.png")
    im.quantize(colors=256, method=Image.Quantize.FASTOCTREE).save(chemin, optimize=True)
    print(f"{chemin}  {n} × {n}  {os.path.getsize(chemin) / 1024:.1f} Ko")


def icone(source, sortie):
    cible = os.path.join(sortie, "icone-alveo-96.png")
    im = Image.open(source).convert("RGB").resize((96, 96), Image.LANCZOS)
    # Palette de 256 couleurs : indiscernable à 28-40 px d'affichage, et sous les 8 Ko du budget.
    im.quantize(colors=256, method=Image.Quantize.MEDIANCUT).save(cible, optimize=True)
    print(f"{cible}  96 × 96  {os.path.getsize(cible) / 1024:.1f} Ko")


def qr(source, sortie):
    svg = open(source, encoding="utf-8").read()
    if 'viewBox="0 0 29 29"' not in svg or 'fill="currentColor"' not in svg:
        sys.exit("QR : viewBox 0 0 29 29 et fill=\"currentColor\" attendus")
    svg = svg.replace('viewBox="0 0 29 29"', 'viewBox="-4 -4 37 37"', 1)
    svg = svg.replace('fill="currentColor"', 'fill="#0C0B0E"')
    # Tuile claire en premier enfant : zone calme de 4 modules.
    svg = re.sub(r"(<svg[^>]*>)", r'\1<rect x="-4" y="-4" width="37" height="37" fill="#F7F3EE"/>', svg, count=1)
    cible = os.path.join(sortie, "qr-app-store.svg")
    open(cible, "w", encoding="utf-8").write(svg)
    print(f"{cible}  zone calme 4 modules, modules #0C0B0E sur #F7F3EE")


def badge(source, sortie):
    cible = os.path.join(sortie, "badge-app-store-fr.svg")
    shutil.copyfile(source, cible)
    if not filecmp.cmp(source, cible, shallow=False):
        sys.exit("Badge : la copie diffère de l'original")
    print(f"{cible}  copie à l'octet près")


def marque(dossier, racine):
    for source, cible in (("favicon.ico", "favicon.ico"), ("favicon.svg", "icon.svg"),
                          ("apple-touch-icon.png", "apple-touch-icon.png")):
        shutil.copyfile(os.path.join(dossier, source), os.path.join(racine, cible))
        print(f"{os.path.join(racine, cible)}  copie de {source}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--site", required=True, help="racine du site (contient assets/img/)")
    p.add_argument("--captures")
    p.add_argument("--rayons", action="store_true")
    p.add_argument("--grain", action="store_true")
    p.add_argument("--icone")
    p.add_argument("--qr")
    p.add_argument("--badge")
    p.add_argument("--marque")
    a = p.parse_args()
    sortie = os.path.join(a.site, "assets", "img")
    os.makedirs(sortie, exist_ok=True)
    if a.captures:
        ecrans(a.captures, sortie)
    if a.rayons:
        rayons(sortie)
    if a.grain:
        grain(sortie)
    if a.icone:
        icone(a.icone, sortie)
    if a.qr:
        qr(a.qr, sortie)
    if a.badge:
        badge(a.badge, sortie)
    if a.marque:
        marque(a.marque, a.site)


if __name__ == "__main__":
    main()
