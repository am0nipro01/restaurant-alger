# Atelier 04 — Dashboard Admin

## Statut : Terminé

## Objectif
Mettre en place le dashboard admin pour les gérants : gestion des réservations, modification des menus, des pages "Qui sommes-nous" et contact, sans intervention technique nécessaire.

## Décisions prises
- Dashboard utilisé par gérants non-techniques + développeur
- Layout admin partagé (AdminLayout) avec navigation persistante
- Gestion des réservations : liste + filtres par statut + changement de statut en 1 clic
- Gestion du menu : catégories + plats (ajout, suppression, activation/désactivation)
- Gestion du contenu : éditeur par page (histoire, équipe, contact) × langue (fr, ar, en)
- Textarea RTL automatique pour la langue arabe dans l'éditeur de contenu

## Travail réalisé
- `src/components/layout/AdminLayout.jsx` — layout partagé avec nav et déconnexion
- `src/pages/admin/Dashboard.jsx` — tableau de bord avec liens vers les 4 sections
- `src/pages/admin/Reservations.jsx` — liste des réservations, filtres statut, actions confirmer/annuler
- `src/pages/admin/MenuAdmin.jsx` — gestion catégories + plats (ajout, suppression, dispo)
- `src/pages/admin/Contenu.jsx` — éditeur de contenu par page et par langue

## Reste à faire
- [ ] Plan de salle admin (Atelier 05)
- [ ] Éditeur rich text pour le contenu (si besoin, actuellement textarea simple)

## Questions ouvertes
(vide)
