# Atelier 07 — Pages statiques

## Statut : Terminé

## Objectif
Créer les pages statiques du site : accueil, histoire du restaurant, présentation de l'équipe, et page contact — toutes éditables via le dashboard admin.

## Décisions prises
- PublicLayout partagé (Navbar + Footer) sur toutes les pages publiques
- Navbar fixe en haut avec lien CTA "Réserver" bien visible
- Menu burger mobile avec animation
- Pages Notre Histoire et Équipe fusionnées sur une même page (décidé Atelier 01)
- Contenu des pages (histoire, equipe, contact) chargé depuis PocketBase collection `pages_contenu`
- Texte affiché paragraphe par paragraphe (split sur `\n`)
- Valeurs par défaut affichées si contenu non renseigné en base

## Sections définies par page (important pour Atelier 04 refacto)
- **Notre Histoire** : hero + contenu narratif + section équipe + CTA réservation
- **Contact** : hero + colonne infos (adresse, horaires, lien réservation) + colonne contenu éditable
- **Accueil** : hero, stats, aperçu menu, CTA réservation

## Travail réalisé
- `src/components/layout/Navbar.jsx` — navbar fixe, liens actifs, burger mobile
- `src/components/layout/Footer.jsx` — footer avec nav, infos, CTA réservation
- `src/components/layout/PublicLayout.jsx` — layout partagé Navbar + Footer
- `src/pages/public/Home.jsx` — page d'accueil complète (hero, stats, menu, CTA)
- `src/pages/public/NotreHistoire.jsx` — histoire + équipe, contenu depuis PocketBase
- `src/pages/public/Contact.jsx` — infos + contenu éditable depuis PocketBase
- PublicLayout ajouté sur Menu, Reservation, ReservationConfirmation

## Reste à faire
- [x] **Atelier 04 — refacto Contenu.jsx** ✅ (2026-04-04 session 2)
- [x] Intégration design system final (Atelier 09) ✅
- [x] Branchement Contact public → site_config PocketBase ✅ (2026-04-04)
- [x] Branchement Notre Histoire public → pages_contenu PocketBase ✅ (2026-04-04 session 2)
  - NotreHistoire.jsx utilise `usePageContenu('histoire')` avec fallback i18n par champ
  - Structure JSON : hero_label, hero_titre, intro_citation, intro_p1/p2, modernite_titre, modernite_p1/p2, collectif_label/titre/desc, membres[], cta_titre/desc/btn
  - [x] SEO complet ✅ (2026-04-04 session 2) — meta tags, Open Graph, Twitter Cards, JSON-LD Restaurant, robots.txt, sitemap.xml, hreflang FR/EN/AR
  - [x] `docs/todo-avant-mise-en-prod.md` créé — checklist complète avant déploiement

## Questions ouvertes
- Adresse précise du restaurant (affiché "à confirmer" pour l'instant)
- Nom définitif du restaurant (affiché "Algiers Gastronomy" provisoirement)
- OG image réelle à fournir (`public/og-image.jpg`, 1200×630px)
