# Atelier 03 — Réservation

## Statut : Terminé

## Objectif
Implémenter le système de réservation en ligne : formulaire, gestion des créneaux horaires, gestion de la capacité, et confirmation par email (sans paiement ni acompte).

## Décisions prises
- Créneaux provisoires : 12h00 à 23h00 par tranches de 30 min (sans coupure)
- Capacité provisoire : 120 couverts max par créneau (30 tables × 4 personnes)
- Email reporté à plus tard — à brancher sur Resend quand le domaine .dz sera disponible
- Confirmation email simulée par un `console.log` pour l'instant
- Statut initial d'une réservation : `en_attente`
- Pas de paiement ni d'acompte — mention explicite dans le formulaire

## Travail réalisé
- `src/lib/reservations.js` — logique métier : génération créneaux, vérification capacité, création réservation
- `src/pages/public/Reservation.jsx` — formulaire complet avec validation, gestion des états (chargement, succès, erreur), écran de confirmation

## Reste à faire
- [ ] Brancher Resend pour l'envoi d'email de confirmation (quand domaine .dz disponible)
- [ ] Mettre à jour les horaires d'ouverture réels quand connus
- [ ] Mettre à jour la capacité réelle quand connue

## Questions ouvertes
- Horaires d'ouverture définitifs (midi uniquement ? soir uniquement ? les deux ?)
- Capacité réelle du restaurant (nombre de tables et couverts)
