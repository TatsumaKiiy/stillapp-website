#!/usr/bin/env python3
"""Calendrier du Profil (app 1.4.0) avec des jours de séance, pour #suivi.

Reconstitution fidèle de components/profile/MonthlyCalendar.tsx, components/ui/CardHeader.tsx et de la
carte de verre (components/ui/Card.tsx, GlassSurface « cardLg ») du dépôt de l'app : jour pratiqué = disque
sable plein #D4906B, chiffre #0C0B0E en Inter 500 ; aujourd'hui = anneau sable de 1,5 pt ; jours passés sans
séance en texte secondaire, futurs en tertiaire ; libellés « lun … dim » en Inter 500 12 pt ; rangées de 44 pt,
disques de 34 pt ; titre « novembre 2026 » en Inter 600 17 pt, méta « N jours · M min » en tertiaire, chevrons
lucide 18 pt (mois suivant estompé). Écran de 402 pt (iPhone), gouttière de 20 pt, fond #0C0B0E.
Données d'illustration (aucune vraie donnée d'utilisateur) : aujourd'hui = vendredi 20 novembre 2026.

Usage : python3 generer.py <dossier des TTF Inter de l'app> <dossier de sortie>
  (TTF : node_modules/@expo-google-fonts/inter/{400Regular,500Medium,600SemiBold}/ dans le dépôt de l'app)
puis : node rendre.js <dossier de sortie>  → calendrier@3x.png (1206 px de large), puis WebP 480/720/960
(qualité 84) dans assets/img/calendrier-*.webp.
"""
import calendar
import datetime
import os
import shutil
import sys

PRATIQUES = {2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19}
AUJOURDHUI = 20
ANNEE, MOIS = 2026, 11
MINUTES = 96  # total d'illustration des 15 jours (séances de 1 à 15 min)

polices, sortie = sys.argv[1], sys.argv[2]
os.makedirs(sortie, exist_ok=True)
for sous, nom in (("400Regular", "Inter_400Regular.ttf"), ("500Medium", "Inter_500Medium.ttf"), ("600SemiBold", "Inter_600SemiBold.ttf")):
    src = os.path.join(polices, sous, nom)
    shutil.copy(src if os.path.exists(src) else os.path.join(polices, nom), sortie)

debut = datetime.date(ANNEE, MOIS, 1).weekday()  # lundi = 0
jours = calendar.monthrange(ANNEE, MOIS)[1]
cases = [None] * debut + list(range(1, jours + 1))
while len(cases) % 7:
    cases.append(None)
rangees = [cases[i:i + 7] for i in range(0, len(cases), 7)]


def case(j):
    if j is None:
        return '<div class="cell"></div>'
    if j > AUJOURDHUI:
        return f'<div class="cell"><div class="disc"><span class="fn ter">{j}</span></div></div>'
    if j in PRATIQUES:
        return f'<div class="cell"><div class="disc done"><span class="fnm inv">{j}</span></div></div>'
    if j == AUJOURDHUI:
        return f'<div class="cell"><div class="disc ring"><span class="fn pri">{j}</span></div></div>'
    return f'<div class="cell"><div class="disc"><span class="fn sec">{j}</span></div></div>'


grille = "\n".join('<div class="row">' + "".join(case(j) for j in r) + "</div>" for r in rangees)
entete = "".join(f'<div class="cell"><span class="c1 sec">{l}</span></div>' for l in "lun,mar,mer,jeu,ven,sam,dim".split(","))
gauche = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7F3EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>'
droite = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(247,243,238,0.36)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
html = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
@font-face{{font-family:I;font-weight:400;src:url(Inter_400Regular.ttf)}}
@font-face{{font-family:I;font-weight:500;src:url(Inter_500Medium.ttf)}}
@font-face{{font-family:I;font-weight:600;src:url(Inter_600SemiBold.ttf)}}
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{background:#0C0B0E;-webkit-font-smoothing:antialiased}}
#ecran{{width:402px;padding:20px 20px 22px;background:#0C0B0E}}
.card{{border-radius:24px;background:rgba(255,255,255,.08);border:.334px solid rgba(255,255,255,.14);padding:16px;font-family:I}}
.hrow{{display:flex;align-items:center;gap:12px}}
.htxt{{flex:1}}
.headline{{font:600 17px/22px I;letter-spacing:-.2px;color:#F7F3EE}}
.meta{{font:400 13px/18px I;color:rgba(247,243,238,.56);margin-top:2px}}
.trail{{display:flex;gap:6px}}
.ib{{width:36px;height:36px;display:flex;align-items:center;justify-content:center}}
.sep{{height:.334px;background:rgba(255,246,232,.10);margin:12px 0}}
.headerRow{{display:flex;margin-bottom:4px}}
.row{{display:flex;height:44px}}
.cell{{flex:1;display:flex;align-items:center;justify-content:center}}
.disc{{width:34px;height:34px;border-radius:17px;display:flex;align-items:center;justify-content:center}}
.done{{background:#D4906B}}
.ring{{border:1.5px solid #D4906B}}
.fn{{font:400 13px/18px I}} .fnm{{font:500 13px/18px I}} .c1{{font:500 12px/16px I}}
.pri{{color:#F7F3EE}} .sec{{color:rgba(247,243,238,.72)}} .ter{{color:rgba(247,243,238,.56)}} .inv{{color:#0C0B0E}}
</style></head><body><div id="ecran"><div class="card">
<div class="hrow"><div class="htxt"><div class="headline">novembre {ANNEE}</div><div class="meta">{len(PRATIQUES)} jours · {MINUTES} min</div></div>
<div class="trail"><div class="ib">{gauche}</div><div class="ib">{droite}</div></div></div>
<div class="sep"></div>
<div class="headerRow">{entete}</div>
{grille}
</div></div></body></html>"""
with open(os.path.join(sortie, "calendrier.html"), "w", encoding="utf-8") as f:
    f.write(html)
print(os.path.join(sortie, "calendrier.html"), len(PRATIQUES), "jours")
