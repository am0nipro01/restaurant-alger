# Atelier 10 — Fonctionnalités Manager

## Statut : Non commencé

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
(vide — atelier non commencé)

---

## Travail réalisé
(vide)

---

## Reste à faire

### 1. Vue calendrier des réservations
- Affichage des réservations par jour/semaine dans l'admin
- Sélecteur de date → liste des réservations du jour
- Indicateurs visuels : créneaux pleins vs disponibles

### 2. Plan de salle lié aux réservations
- Sur le plan de salle existant, afficher les tables réservées pour un créneau donné
- Sélecteur date+heure → coloration des tables (libre / réservé / en cours)
- Possibilité d'assigner une réservation à une table spécifique

### 3. Séparation droits admin / manager
- **Admin** : accès total (toutes collections, création d'utilisateurs)
- **Manager** : accès restreint (uniquement réservations + plan de salle + consultation menu)
- À implémenter via les rôles PocketBase (champ `role` sur `users`) + guards côté frontend

---

## Questions ouvertes
- Le gérant veut-il un accès mobile optimisé pour le calendrier (tablette en salle) ?
- Faut-il une vue "service du soir" pré-filtrée automatiquement ?
- La séparation admin/manager se fait-il via PocketBase API Rules ou guard frontend ?
