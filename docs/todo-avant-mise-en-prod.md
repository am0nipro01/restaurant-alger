# TODO — Avant mise en production

> Ce fichier liste tout ce qui doit être fait avant de mettre le site en ligne.
> Cocher au fur et à mesure.

---

## 🔴 Bloquant — Ne pas mettre en prod sans ça

- [ ] **Nom définitif du restaurant** — remplacer "Algiers Gastronomy" partout
- [ ] **Adresse précise** — renseigner dans `admin/contact` (PocketBase site_config)
- [ ] **Domaine .dz** — démarches ANIC à lancer

---

## 📝 Contenu — Dépend du gérant (questionnaire à remplir)

> Fichier questionnaire : `docs/questionnaire-gerant.md`

- [ ] Remplir `admin/contact` dans PocketBase : nom, adresse, ville, téléphone, WhatsApp, emails, horaires, réseaux sociaux, Google Maps
- [ ] Remplir la carte du menu dans PocketBase (menu_categories + menu_items)
- [ ] Fournir les vraies photos du restaurant (hero, intérieur, plats, équipe)
- [ ] Fournir le lien Google Maps définitif

---

## 🌐 SEO / GEO — À faire quand le domaine est connu (5 min)

- [ ] Remplacer `algiersgastronomy.dz` par le **vrai domaine** dans ces 3 fichiers :
  - `public/robots.txt` → ligne `Sitemap:`
  - `public/sitemap.xml` → toutes les balises `<loc>`
  - `.env` → `VITE_SITE_URL`
  - `netlify.toml` → `[context.production.environment]`
- [ ] Ajouter une vraie image OG (`public/og-image.jpg`, 1200×630px) pour les partages réseaux sociaux
- [ ] Soumettre le sitemap dans Google Search Console après déploiement
- [ ] Soumettre le sitemap dans Bing Webmaster Tools après déploiement

> **Note** : le JSON-LD Restaurant (nom, adresse, téléphone, horaires) se met à jour **automatiquement** quand le gérant renseigne `admin/contact` — aucun code à toucher.

---

## 📧 Email — Confirmation de réservation

- [ ] Créer un compte Resend (gratuit : 3 000 emails/mois) sur resend.com
- [ ] Obtenir une API Key Resend
- [ ] Vérifier le domaine sur Resend
- [ ] Mettre à jour `FROM_EMAIL` dans `backend/pb_hooks/reservations.pb.js`
- [ ] Définir `RESEND_API_KEY` dans les variables d'environnement PocketBase (Settings → Application → Hook env vars)

---

## 🚀 Déploiement

- [ ] Déployer PocketBase sur Fly.io
- [ ] Définir `VITE_POCKETBASE_URL` sur Netlify (URL Fly.io en prod)
- [ ] Définir `VITE_SITE_URL` sur Netlify (vrai domaine)
- [ ] Déployer le front sur Netlify (connecter le repo GitHub)
- [ ] Configurer le domaine .dz sur Netlify

---

## ✅ Déjà fait

- [x] SEO : meta tags, Open Graph, Twitter Cards, hreflang (fr/en/ar) par page
- [x] GEO : JSON-LD Restaurant (Schema.org) branché sur site_config PocketBase
- [x] robots.txt avec autorisation GPTBot, ClaudeBot, PerplexityBot
- [x] sitemap.xml avec priorités et hreflang
- [x] Séparation rôles admin / manager
- [x] Vue calendrier réservations
- [x] Confirmations email (hook prêt, en attente clé Resend)
- [x] Multilingue FR / EN / AR avec RTL automatique
- [x] Design system "The Desert Gallery"
