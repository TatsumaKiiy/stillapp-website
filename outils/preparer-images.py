#!/usr/bin/env python3
"""Prépare les images publiées de stillapp.fr (une fois, hors ligne).

Rien n'est codé en dur : chaque source se donne en argument, et seules les
étapes dont la source est fournie sont exécutées.

  python3 outils/preparer-images.py --site .
      --captures <dossier des captures 1206 × 2622, barres d'état nettoyées>
      --rappels  <dossier contenant crop-rappels-600.webp et crop-rappels-1200.webp>
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
import os
import re
import shutil
import sys

from PIL import Image

# Écrans 2:3 (spécification § 3.13) : boîtes (x0, y0, x1, y1) sur les captures de 1206 × 2622.
# Chaque écran accepte le nom de la capture nettoyée ou celui de la capture d'origine.
ECRANS = {
    "ecran-duree": (("accueil-duree.png", "10-accueil-duree.png"), (63, 380, 1143, 2000)),
    "ecran-inspire": (("seance-inspire.png", "22-seance-debut.png"), (0, 405, 1206, 2214)),
    "ecran-reglages": (("seance-reglages.png", "26-seance-feuille-reglages.png"), (0, 520, 1206, 2329)),
}
LARGEURS = (600, 900)


def trouver(dossier, noms):
    for nom in noms:
        chemin = os.path.join(dossier, nom)
        if os.path.isfile(chemin):
            return chemin
    sys.exit(f"Introuvable dans {dossier} : {' ou '.join(noms)}")


def ecrans(captures, sortie):
    for nom, (fichiers, boite) in ECRANS.items():
        im = Image.open(trouver(captures, fichiers)).convert("RGB")
        if im.size != (1206, 2622):
            sys.exit(f"{nom} : capture de {im.size}, 1206 × 2622 attendu")
        im = im.crop(boite)
        if abs(im.width * 3 - im.height * 2) > 2:
            sys.exit(f"{nom} : recadrage {im.size} hors du format 2:3")
        for largeur in LARGEURS:
            hauteur = round(im.height * largeur / im.width)  # 900, puis 1350
            chemin = os.path.join(sortie, f"{nom}-{largeur}.webp")
            im.resize((largeur, hauteur), Image.LANCZOS).save(chemin, "WEBP", quality=80, method=6)
            print(f"{chemin}  {largeur} × {hauteur}  {os.path.getsize(chemin) / 1024:.1f} Ko")


def rappels(dossier, sortie):
    # Recadrage déjà fait SOUS la phrase « Choisis jusqu'à 3 moments » : copie sans réencodage.
    for taille in ("600", "1200"):
        source = os.path.join(dossier, f"crop-rappels-{taille}.webp")
        cible = os.path.join(sortie, f"rappels-{taille}.webp")
        shutil.copyfile(source, cible)
        print(f"{cible}  copie de {os.path.basename(source)}")


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
    p.add_argument("--rappels")
    p.add_argument("--icone")
    p.add_argument("--qr")
    p.add_argument("--badge")
    p.add_argument("--marque")
    a = p.parse_args()
    sortie = os.path.join(a.site, "assets", "img")
    os.makedirs(sortie, exist_ok=True)
    if a.captures:
        ecrans(a.captures, sortie)
    if a.rappels:
        rappels(a.rappels, sortie)
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
