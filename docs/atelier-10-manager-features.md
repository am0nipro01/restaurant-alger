# Atelier 10 — Fonctionnalités Manager

## Statut : Terminé (2026-04-04)

## Objectif
Répondre aux demandes du gérant transmises lors de la session du 2026-04-02 :
1. Vue calendrier des réservations (dashboard admin)
2. Plan de salle lié aux réservations (tables occupées en temps réel)
3. Séparation des droits admin / manager

---

## Contexte
Ces fonctionnalités étendent le dashboard admin existant (Atelier 04) et le plan de salle (Atelier 05).
Elles ne touchent pas au site public.

---

## Décisions prises
- Collection `managers` (type auth PocketBase) pour les comptes gérants — séparée des superadmins
- Login cascade : admin PocketBase d'abord, puis collection managers si échec
- Rôle détecté via `pb.authStore.model?.collectionName === 'managers'`
- Managers : accès Reservations + Floor Plan uniquement
- Admins : accès total (toutes les pages)
- Routes admin-only protégées par `AdminOnlyRoute` (Menu, Content, Contact)
- Fix hook `reservations.pb.js` : `onRecordAfterUpdateRequest` → `onRecordAfterUpdateSuccess` (PocketBase 0.36.x)

---

## Travail réalisé
- `backend/pb_migrations/1775380000_created_managers.js` — collection `managers` (auth) avec champ `nom`
- `src/hooks/useAuth.js` — login cascade + détection rôle + exposition `role` dans le hook
- `src/App.jsx` — composant `AdminOnlyRoute` : redirige les managers vers /admin/reservations
- `src/components/layout/AdminLayout.jsx` — sidebar filtrée par rôle, label "Manager"/"Admin" dans le profil
- `backend/pb_hooks/reservations.pb.js` — fix hook PocketBase 0.36.x

---

## Reste à faire
Rien — atelier terminé.

Les points 1 (vue calendrier) et 2 (plan de salle lié) avaient été réalisés lors des sessions précédentes.

## Questions ouvertes
(vide)
