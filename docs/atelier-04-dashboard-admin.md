# Atelier 04 — Dashboard Admin

## Statut : Terminé + extensions 2026-04-04

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
- `src/components/layout/AdminLayout.jsx` — layout partagé avec nav, badge notifications, icône Contact
- `src/pages/admin/Dashboard.jsx` — **SUPPRIMÉ** — login redirige directement vers /admin/reservations
- `src/pages/admin/Reservations.jsx` — liste + filtres statut + vue calendrier mensuel + actions confirmer/annuler/rétablir
- `src/pages/admin/MenuAdmin.jsx` — gestion catégories + plats (ajout, suppression, dispo, upload photo)
- `src/pages/admin/Contenu.jsx` — éditeur de contenu par page et par langue
- `src/pages/admin/PlanDeSalle.jsx` — plan de salle drag & drop, lié aux réservations
- `src/pages/admin/AdminContact.jsx` — informations restaurant (adresse, horaires, contacts, pratique) → site_config PocketBase
- `src/context/ReservationContext.jsx` — badge notifications "en attente" persistant dans la sidebar
- `docs/questionnaire-gerant.md` — questionnaire complet 11 sections à transmettre au gérant

## Extensions réalisées (2026-04-04)
- [x] Page admin/contact créée — collection site_config (clé "contact", valeur JSON)
- [x] Vue calendrier dans admin/reservations — toggle Liste/Calendrier, grille mensuelle, panneau jour
- [x] Badge notification réservations en attente — persistant via ReservationContext
- [x] Liaison réservations ↔ tables — dropdown assignation dans la liste
- [x] Fix Promise.all → fetches indépendants (Reservations + PlanDeSalle)
- [x] Branchement Contact public depuis site_config

## Reste à faire
- [ ] Éditeur rich text pour le contenu (si besoin, actuellement textarea simple)
- [ ] **Refactoriser `Contenu.jsx`** — sections par page indépendantes (histoire / equipe / contact). Reporté après maquettes validées.
- [ ] Séparation droits admin / manager (optionnel, noté pour plus tard)

## Questions ouvertes
- Sections définitives de Notre Histoire et Contact ? (bloqué par contenu réel gérant)
- Questionnaire gérant transmis ? Réponses reçues ?
