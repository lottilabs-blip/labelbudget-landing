# LabelBudget — Landing & Waitlist

Site vitrine gratuit (0 €) pour **LabelBudget**, l'outil de pilotage financier
des projets musicaux (budget + simulation de rentabilité pour artistes & managers).

## Contenu
- `index.html` — landing page
- `styles.css` — design
- `waitlist.js` — formulaire waitlist (0 €, stocke en local + prêt pour Formspree)
- `CONTENUS_LANCEMENT.md` — 3 scripts de contenu gratuit pour acquérir des leads

## Déploiement GitHub Pages (0 €)
1. Crée le repo sur github.com
2. `git init && git add -A && git commit -m "LabelBudget landing"`
3. `git branch -M gh-pages`
4. `git remote add origin git@github.com:TONUSER/labelbudget-landing.git`
5. `git push -u origin gh-pages`
6. Dans Settings > Pages : source = branche `gh-pages` → ton site est en ligne.

## Activer la waitlist en prod (0 €)
Ouvre `waitlist.js`, remplace `FORMSPREE_ID = ""` par ton ID Formspree
(compte gratuit, 50 leads/mois, sans carte bancaire). Les emails arrivent
directement dans ta boîte.

## Stats
- Pricing : Freemium, Pro à 12 €/mois
- Seuil de rentabilité : ~1 abonné payant couvre les frais
- Déclencheur d'investissement : domaine ~12 € à >20 leads, Stripe ~20-40 € à >50 leads
