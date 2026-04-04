# DECISIONS_LOG.md — Projet Alger

> Ce fichier trace toutes les décisions importantes du projet.
> Une décision annulée ne se barre jamais — on ajoute une nouvelle entrée datée qui explique l'annulation et la nouvelle décision.
> Dernière mise à jour : 2026-04-02

---

| Date | Heure (Paris) | Décision |
|---|---|---|
| 2026-04-02 | 11:13 | Hébergement front : **Netlify** retenu (Vercel et Cloudflare Pages écartés) |
| 2026-04-02 | 11:13 | Back-end / CMS Admin : **PocketBase + Fly.io** retenus — stack 100% gratuite en phase 1, migration vers VPS OVH ou DigitalOcean prévue en phase 2 |
| 2026-04-02 | 11:18 | Organisation du projet en 9 ateliers validée, dans l'ordre : Architecture → PocketBase → Réservation → Dashboard Admin → Plan de salle → Menu/Carte → Pages statiques → Multilingue/RTL → Design System |
| 2026-04-02 | 14:36 | Atelier 01 terminé et validé — React+Vite, React Router, 5 collections PocketBase, config Netlify+env en place |
| 2026-04-02 | 14:58 | Atelier 02 terminé et validé — auth PocketBase branchée, API Rules configurées, déploiement Fly.io reporté à la mise en production |
| 2026-04-02 | 16:32 | Atelier 03 terminé et validé — formulaire réservation, créneaux, vérification capacité, page de confirmation stable |
| 2026-04-02 | 16:58 | Atelier 04 terminé et validé — dashboard admin complet (réservations, menu, contenu, layout partagé) — refacto contenu par section à faire après Atelier 07 |
| 2026-04-02 | 17:15 | Atelier 05 terminé et validé — plan de salle drag & drop, 30 tables, 4 tailles, 3 statuts, positions sauvegardées en base |
| 2026-04-02 | — | Atelier 06 terminé et validé — page menu publique, onglets catégories sticky, filtre disponibilité, contenu piloté PocketBase |
| 2026-04-02 | 17:32 | Atelier 07 terminé et validé — pages statiques complètes, Navbar/Footer/PublicLayout, Home, Notre Histoire, Contact |
| 2026-04-02 | 17:32 | Refacto Contenu.jsx (sections par page) reportée après finalisation des maquettes — les sections définitives ne sont pas encore connues |
| 2026-04-02 | 21:12 | Atelier 08 terminé et validé — i18next configuré, 3 langues (fr/en/ar), RTL automatique via useRTL, toutes les pages publiques traduites (Home, Menu, Réservation, Confirmation, Notre Histoire, Contact, Navbar, Footer) |
| 2026-04-02 | 21:12 | Contenu du menu (noms de plats, descriptions) volontairement non traduit — pratique standard des restaurants premium, l'identité du plat prime |
| 2026-04-02 | 21:12 | Atelier 09 — Design System en attente de la maquette Google Stitch — prompt complet rédigé et transmis, intégration démarrera à réception de la maquette |
| 2026-04-02 | 21:12 | Atelier 10 à créer — demandes du gérant : vue calendrier réservations, plan de salle lié aux réservations, séparation droits admin/manager |
| 2026-04-03 | — | Atelier 09 terminé et validé — design system "The Desert Gallery" appliqué, toutes les pages converties depuis Stitch (Home, Menu, Notre Histoire, Contact, Réservation, Confirmation), i18n FR/EN/AR complété |
| 2026-04-03 | — | Menu : scroll+anchors retenu (abandon tabs), champ description ajouté à menu_categories PocketBase, 3 descriptions saisies |
| 2026-04-03 | — | Fix confirmation : positionnement absolute pour éviter le chevauchement image/texte (bug `-ml-20` Stitch) |
| 2026-04-03 | — | Hook email Resend (confirmation réservation) : **reporté** — hook PocketBase créé dans `backend/pb_hooks/reservations.pb.js`, à activer en définissant `RESEND_API_KEY` + domaine vérifié sur resend.com. À faire avant mise en production. |
| 2026-04-03 | — | Liaison réservations ↔ tables : champ `table` (Relation → tables) ajouté dans PocketBase. Assignation depuis admin/reservations, affichage client dans plan de salle. |
| 2026-04-04 | — | Page admin/contact créée — collection PocketBase `site_config` (clé "contact", valeur JSON). Stocke : nom, adresse, ville, téléphone, whatsapp, emails, réseaux, horaires par jour, infos pratiques, Google Maps. |
| 2026-04-04 | — | Branchement Contact public → site_config validé. Contact.jsx charge les données live, fallback silencieux i18n si champ vide. DEBUG_MODE utilisé pendant validation, supprimé après. |
| 2026-04-04 | — | Vue calendrier ajoutée dans admin/reservations — toggle Liste/Calendrier, grille mensuelle lun-dim, pastilles colorées par statut, panneau latéral par jour avec actions. Aucune lib externe. |
| 2026-04-04 | — | Fix Promise.all réservations — même correction que PlanDeSalle : fetches réservations et tables séparés en deux try/catch indépendants pour éviter le tout-ou-rien. |
| 2026-04-04 | — | Questionnaire gérant créé : `docs/questionnaire-gerant.md` — 11 sections (identité, adresse, horaires, capacité, réservation, menu, équipe, visuels, pratique, textes, technique). À transmettre au gérant. |
| 2026-04-04 | — | Subscription PocketBase temps réel activée sur admin/reservations — données live sans rechargement, bouton Actualiser ajouté, erreur silencieuse au chargement auto (visible uniquement sur refresh manuel). |
| 2026-04-04 | — | Atelier 10 terminé et validé — séparation rôles admin/manager : collection `managers` (auth PocketBase), login cascade, sidebar filtrée, routes protégées. Fix hook reservations.pb.js (onRecordAfterUpdateRequest → onRecordAfterUpdateSuccess). |
| 2026-04-04 | — | API Rules reservations + tables : accès lecture/écriture ouvert aux managers (`@request.auth.collectionName = "managers"`). Suppression et création restent superadmin uniquement. |
| 2026-04-04 | — | Fix API Rules manager : `@request.auth.collectionName` n'est pas valide dans les règles PocketBase — remplacé par `@request.auth.id != ""`. Les migrations JS mettent à jour la DB mais PAS la config en mémoire — fix appliqué via PATCH API direct (dashboard JS). Règle validée et active pour reservations + tables. |
| 2026-04-04 | — | SEO/GEO complet implémenté : meta tags, Open Graph, Twitter Cards, JSON-LD Restaurant (Schema.org) branché sur site_config PocketBase, robots.txt (GPTBot/ClaudeBot/PerplexityBot autorisés), sitemap.xml multilingue avec hreflang FR/EN/AR. Se met à jour automatiquement quand le gérant modifie admin/contact. |
| 2026-04-04 | — | `docs/todo-avant-mise-en-prod.md` créé — checklist complète avant déploiement (domaine .dz, Resend, Netlify, Fly.io, OG image, Search Console). |
| 2026-04-04 | — | Refacto `Contenu.jsx` validée — éditeur 4 sections (Hero/Éditoriale/Équipe/CTA) × 3 langues (FR/EN/AR), sauvegarde JSON dans champ `contenu_json` (type json) de la collection `pages_contenu`. L'équipe est désormais entièrement gérée depuis l'admin (membres dynamiques). |
| 2026-04-04 | — | `NotreHistoire.jsx` branché sur PocketBase via hook `usePageContenu('histoire')` — fallback i18n champ par champ. Si aucun membre dans l'admin, l'équipe par défaut (hardcodée) s'affiche. |
| 2026-04-04 | — | Schema PocketBase `pages_contenu` corrigé : champ `contenu_json` (type json) ajouté, `titre` rendu non-requis, `autogeneratePattern` restauré sur champ `id` (avait été écrasé à `""` par un PATCH précédent). |
| 2026-04-04 | — | `.claude/launch.json` créé — configurations des 2 serveurs de dev (Vite React port 5173, PocketBase port 8090). Utilisable via `preview_start`. |