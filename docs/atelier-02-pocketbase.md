# Atelier 02 — PocketBase

## Statut : Terminé

## Objectif
Configurer PocketBase comme back-end et base de données : définir les collections nécessaires (réservations, tables, menus, pages, etc.) et déployer l'instance sur Fly.io.

## Décisions prises
- Auth admin via `pb.admins.authWithPassword` (superuser PocketBase)
- Hook `useAuth` centralisé pour gérer l'état de connexion dans React
- `PrivateRoute` branché sur PocketBase (plus de `isAuthenticated = false`)
- Déploiement Fly.io reporté à plus tard — développement 100% local jusqu'à la fin des ateliers
- API Rules configurées : menu_categories, menu_items, pages_contenu en lecture publique / écriture admin ; reservations en création publique / reste admin ; tables 100% admin

## Travail réalisé
- `src/lib/pocketbase.js` — client PocketBase configuré avec `VITE_POCKETBASE_URL`
- `src/hooks/useAuth.js` — hook d'authentification (login, logout, isAuthenticated)
- `src/App.jsx` — PrivateRoute branché sur le vrai état PocketBase
- `src/pages/admin/Login.jsx` — formulaire de connexion fonctionnel
- `src/pages/admin/Dashboard.jsx` — dashboard avec liens et déconnexion
- API Rules configurées sur toutes les collections dans PocketBase
- flyctl installé dans WSL (déploiement Fly.io prêt quand on voudra)

## Reste à faire
- [ ] Déployer PocketBase sur Fly.io (reporté — à faire avant la mise en production)
- [ ] Configurer `VITE_POCKETBASE_URL` sur le dashboard Netlify (à faire au moment du déploiement)

## Questions ouvertes
(vide)
