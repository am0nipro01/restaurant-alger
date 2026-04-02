# Atelier 01 — Architecture

## Statut : Terminé

## Objectif
Définir et mettre en place la structure complète du projet : arborescence des dossiers, configuration initiale du front-end React + Tailwind, connexion avec PocketBase, et déploiement de base sur Netlify + Fly.io.

## Décisions prises
- Pages publiques : `/`, `/menu`, `/reservation`, `/notre-histoire`, `/contact`
- Pages admin (privées) : `/admin`, `/admin/dashboard`, `/admin/reservations`, `/admin/menu`, `/admin/contenu`, `/admin/plan-de-salle`
- Plan de salle : côté admin uniquement (pas public)
- Équipe intégrée dans `/notre-histoire` (pas de page séparée)
- Framework : React + Vite (pas Create React App)
- Routeur : React Router DOM
- Structure dossiers : `src/pages/public`, `src/pages/admin`, `src/components/layout`, `src/components/ui`, `src/lib`, `src/hooks`, `src/i18n`
- Collections PocketBase : `reservations`, `tables`, `menu_categories`, `menu_items`, `pages_contenu`
- Variable d'env : `VITE_POCKETBASE_URL` — local via `.env`, production via dashboard Netlify
- Config Netlify : `netlify.toml` avec redirect `/*` → `/index.html` pour les routes React

## Travail réalisé
- Projet React + Vite initialisé
- Tailwind CSS configuré via plugin Vite
- React Router installé et configuré avec toutes les routes
- Arborescence complète `src/` créée
- Tous les fichiers pages créés (stubs)
- Navbar.jsx et Footer.jsx créés
- `lib/pocketbase.js` configuré avec `VITE_POCKETBASE_URL`
- SDK PocketBase installé (`npm install pocketbase`)
- 5 collections créées dans PocketBase local
- `.env` créé (non versionné)
- `.env.example` créé (versionné)
- `netlify.toml` créé et configuré
- Git initialisé, repo GitHub connecté, commits pushés

## Reste à faire
(rien — atelier terminé)

## Questions ouvertes
- Déploiement Fly.io (PocketBase en production) : à faire à l'Atelier 02
- Variable `VITE_POCKETBASE_URL` à configurer sur le dashboard Netlify une fois le site déployé
