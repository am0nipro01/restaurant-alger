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