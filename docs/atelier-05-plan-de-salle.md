# Atelier 05 — Plan de salle

## Statut : Terminé

## Objectif
Créer le plan de salle interactif avec gestion visuelle des tables (30 tables par défaut, chiffre provisoire), intégré au système de réservation.

## Décisions prises
- Plan de salle côté admin uniquement (pas public) — décidé à l'Atelier 01
- 30 tables provisoires, 4 tailles : 2 personnes (×10), 4 personnes (×12), 6 personnes (×5), 8 personnes (×3)
- Approche : canvas visuel avec drag & drop (react-draggable)
- Clic sur table → panneau latéral pour changer le statut
- Drag → repositionne la table, position sauvegardée en base (position_x, position_y)
- 3 statuts : libre (vert), réservée (jaune), occupée (rouge)
- Bouton "Initialiser les 30 tables" pour le premier démarrage

## Travail réalisé
- `src/lib/tables.js` — config tables, dimensions, styles, fonctions PocketBase
- `src/pages/admin/PlanDeSalle.jsx` — canvas drag & drop, panneau statut, compteurs, légende
- react-draggable installé

## Reste à faire
- [ ] Lier les tables aux réservations (afficher le nom du client sur la table réservée)
- [ ] Mettre à jour les positions/capacités réelles quand le restaurant sera connu

## Questions ouvertes
- Nombre réel de tables et leur capacité (provisoire : 30 tables)
- Agencement réel de la salle (le gérant pourra le définir par drag & drop)
