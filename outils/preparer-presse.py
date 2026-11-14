#!/usr/bin/env python3
"""Prépare la page /presse de stillapp.fr : aperçus WebP et kit presse en un seul zip (une fois, hors ligne).

  python3 outils/preparer-presse.py --site .
      --kit       <dossier Alveo-kit-presse du kit marketing (visuels/ : icône, captures iPhone FR et EN,
                   seances-autour-de-l-orbe-3840x2160.png)>
      --banniere  <l'horizon de l'en-tête sans texte, 3840 × 1646 (creatifs/final/tmp/entete-fr-fond.png)>
      --linkedin  <dossier des visuels LinkedIn (li-banniere-perso-1584x396.png, li-pr6-site-1080x1350.png)>

Les textes du zip (LISEZMOI, textes court et long, faits) sont dans outils/presse/ : ce sont ceux de la page.
Le zip est déterministe (dates fixes, ordre fixe) : le refaire avec les mêmes sources redonne le même fichier.
Rappel : /assets/ est servi « immutable » ; un zip ou un aperçu refait change de nom (version dans le nom).

Dépendance : Pillow (pip install pillow).
"""
import argparse
import io
import os
import sys
import zipfile

from PIL import Image

VERSION = "1.4.0"
ZIP = f"assets/presse/alveo-kit-presse-{VERSION.replace('.', '-')}.zip"
RACINE = f"Alveo-kit-presse-{VERSION}"
DATE = (2026, 11, 14, 12, 0, 0)
CAPTURES = ["01-accueil", "02-lecteur", "03-seances", "04-intro", "05-fin", "06-programme", "07-profil",
            "08-ambiances"]
# Aperçus de la page : quatre captures FR (240 et 480 px de large), la bannière (960 et 1920), l'icône (192).
APERCUS_CAPTURES = ["01-accueil", "02-lecteur", "03-seances", "07-profil"]


def jpeg(chemin, attendu=None):
    """PNG → JPEG qualité 88, 4:4:4 (texte net), progressif ; profil ICC gardé s'il existe."""
    im = Image.open(chemin)
    if attendu and im.size != attendu:
        sys.exit(f"{chemin} : {im.size}, attendu {attendu}")
    icc = im.info.get("icc_profile")
    im = im.convert("RGB")
    b = io.BytesIO()
    opts = dict(quality=88, subsampling=0, optimize=True, progressive=True)
    if icc:
        opts["icc_profile"] = icc
    im.save(b, "JPEG", **opts)
    return b.getvalue()


def webp(chemin, largeur, sortie, qualite=82):
    im = Image.open(chemin).convert("RGB")
    h = round(im.height * largeur / im.width)
    im.resize((largeur, h), Image.LANCZOS).save(sortie, "WEBP", quality=qualite, method=6)
    return os.path.getsize(sortie)


def ajoute(z, nom, donnees, compresser):
    info = zipfile.ZipInfo(f"{RACINE}/{nom}", date_time=DATE)
    info.compress_type = zipfile.ZIP_DEFLATED if compresser else zipfile.ZIP_STORED
    info.external_attr = 0o644 << 16
    z.writestr(info, donnees, compresslevel=9 if compresser else None)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--site", required=True)
    p.add_argument("--kit", required=True)
    p.add_argument("--banniere", required=True)
    p.add_argument("--linkedin", required=True)
    a = p.parse_args()
    site, vis = a.site, os.path.join(a.kit, "visuels")
    textes = os.path.join(site, "outils", "presse")

    # 1. Aperçus de la page
    img = os.path.join(site, "assets", "img")
    for c in APERCUS_CAPTURES:
        for w in (240, 480):
            n = webp(os.path.join(vis, "captures-iphone-fr", c + ".png"), w, os.path.join(img, f"presse-{c}-{w}.webp"))
            print(f"presse-{c}-{w}.webp {n // 1024} Kio")
    for w in (960, 1920):
        n = webp(a.banniere, w, os.path.join(img, f"presse-banniere-{w}.webp"), 94)
        print(f"presse-banniere-{w}.webp {n // 1024} Kio")
    icone = os.path.join(vis, "icone-1024x1024.png")
    n = webp(icone, 192, os.path.join(img, "presse-icone-192.webp"), 86)
    print(f"presse-icone-192.webp {n // 1024} Kio")

    # 2. Le zip : textes compressés, images stockées telles quelles (déjà compressées)
    os.makedirs(os.path.join(site, "assets", "presse"), exist_ok=True)
    sortie = os.path.join(site, ZIP)
    with zipfile.ZipFile(sortie, "w") as z:
        ajoute(z, "LISEZMOI.txt", open(os.path.join(textes, "LISEZMOI.txt"), "rb").read(), True)
        for t in ("texte-court.txt", "texte-long.txt", "faits.txt"):
            ajoute(z, "textes/" + t, open(os.path.join(textes, t), "rb").read(), True)
        ajoute(z, "visuels/icone-1024x1024.png", open(icone, "rb").read(), False)
        for langue in ("fr", "en"):
            for c in CAPTURES:
                src = os.path.join(vis, f"captures-iphone-{langue}", c + ".png")
                ajoute(z, f"visuels/captures-app-store-{langue}/{c}.jpg", jpeg(src, (1320, 2868)), False)
        ajoute(z, "visuels/banniere-3840x1646.jpg", jpeg(a.banniere, (3840, 1646)), False)
        ajoute(z, "visuels/seances-autour-de-l-orbe-3840x2160.jpg",
               jpeg(os.path.join(vis, "seances-autour-de-l-orbe-3840x2160.png"), (3840, 2160)), False)
        ajoute(z, "visuels/linkedin/banniere-1584x396.jpg",
               jpeg(os.path.join(a.linkedin, "li-banniere-perso-1584x396.png"), (1584, 396)), False)
        ajoute(z, "visuels/linkedin/site-stillapp-1080x1350.jpg",
               jpeg(os.path.join(a.linkedin, "li-pr6-site-1080x1350.png"), (1080, 1350)), False)
    print(f"{ZIP} {os.path.getsize(sortie)} octets")


if __name__ == "__main__":
    main()
