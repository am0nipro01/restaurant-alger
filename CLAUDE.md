# CLAUDE.md — Projet Alger

> Ce fichier est lu automatiquement par Claude Code à chaque session.
> Il est la source de vérité du projet. En cas de contradiction avec un chat ou une conversation précédente, ce fichier a raison.
> Dernière mise à jour : 2026-04-02

---

## Instructions de travail

- PROJECT_CONTEXT.md (fusionné dans ce fichier) est la source de vérité prioritaire.
- La continuité entre les sessions passe uniquement par ce fichier et DECISIONS_LOG.md.
- Quand une décision importante est prise, proposer une ligne à ajouter dans DECISIONS_LOG.md.
- Ne jamais barrer une décision annulée — ajouter une nouvelle entrée datée qui explique l'annulation et la nouvelle décision.
- Ne jamais considérer un essai raté ou une idée exploratoire comme une décision validée.
- Si quelque chose est flou ou n'a pas été décidé, le dire clairement au lieu d'inventer.

---

## 1. Identité du projet

| Champ | Valeur |
|---|---|
| Nom de code | Alger |
| Nom du restaurant | Non défini (à compléter) |
| Type | Nouveau restaurant (création) |
| Localisation | Alger, Algérie — adresse précise non définie |
| Ouverture prévue | Mai 2026 |

---

## 2. Positionnement

- **Cuisine** : Algérienne traditionnelle et gastronomique
- **Note** : Le positionnement exact et les menus seront affinés quand le projet sera plus clair côté organisateurs/créateurs du restaurant

---

## 3. Site web — Vision générale

- **Approche** : Mobile first, premium
- **Pas de paiement en ligne** — le règlement se fait uniquement sur place
- **Multilingue** : Français, Arabe (RTL), Anglais

### Fonctionnalités principales
- Réservation en ligne (sans acompte ni paiement)
  - Gestion des créneaux horaires
  - Gestion de la capacité
  - Confirmation par email
- Plan de salle interactif (30 tables par défaut — chiffre provisoire)
- Menu / Carte du restaurant
- Présentation de l'équipe (staff)
- Histoire du restaurant
- Page contact
- Toutes les fonctionnalités d'un site restaurant moderne premium

### Dashboard Admin (pour les gérants)
- Modification des menus et de la carte
- Modification des informations "Qui sommes-nous"
- Modification de la page contact et des informations générales
- Gestion autonome du contenu sans intervention technique

---

## 4. Stack technique

### Validé et décidé

| Couche | Technologie | Notes |
|---|---|---|
| Front-end | React.js + Tailwind CSS | |
| Hébergement front | Netlify | Gratuit, CDN, déploiement auto |
| Back-end + BDD + Admin | PocketBase | Tout-en-un, dashboard admin natif, open source |
| Hébergement back | Fly.io | Free tier généreux, compatible PocketBase |
| Domaine | .dz (ANIC) | Organisme officiel algérien |
| Support RTL | Requis | Pour la version arabe |

### Stratégie budget
- **Phase 1 (maintenant)** : Stack 100% gratuite — Netlify + PocketBase + Fly.io
- **Phase 2 (avec budget)** : Migration PocketBase vers VPS OVH ou DigitalOcean — rapide et sans refonte

---

## 5. Identité visuelle

- **Statut** : Non définie pour l'instant
- **Approche** : Identité visuelle créée via Google Stitch (en parallèle du développement)
- **Priorité** : Les features passent avant l'identité visuelle
- **Maquettes** : À partager ultérieurement

### Sites de référence
1. https://restaurant-artnblum.com/
2. https://www.manoirdelaregate.com/
3. https://www.lulurouget.fr/
4. https://restaurante.covermanager.com/lamaccotte-2/
5. https://quiplumelalune.fr/
6. https://perruche-restaurant.com/paris-fr/

> Esprit général : restaurants premium parisiens, navigation épurée, réservation bien mise en avant

---

## 6. Équipe projet

| Rôle | Personne |
|---|---|
| Tech + Design + Product | Solo |
| Gérants du restaurant | Accès dashboard admin PocketBase uniquement |

---

## 7. Délais et contraintes

- **Délai de développement** : 10 jours ouvrés (hors week-ends)
- **Date de début** : 2026-04-02
- **Contrainte principale** : Livraison avant ouverture du restaurant en mai 2026
- **Budget** : Zéro pour la phase 1

---

## 8. Organisation du projet — 9 ateliers

Dans l'ordre validé :

1. Architecture
2. PocketBase
3. Réservation
4. Dashboard Admin
5. Plan de salle
6. Menu / Carte
7. Pages statiques
8. Multilingue / RTL
9. Design System

---

## 8b. Ateliers — fichiers de suivi

Les fichiers détaillés de chaque atelier se trouvent dans `docs/` :

| Atelier | Fichier |
|---|---|
| 01 — Architecture | `docs/atelier-01-architecture.md` |
| 02 — PocketBase | `docs/atelier-02-pocketbase.md` |
| 03 — Réservation | `docs/atelier-03-reservation.md` |
| 04 — Dashboard Admin | `docs/atelier-04-dashboard-admin.md` |
| 05 — Plan de salle | `docs/atelier-05-plan-de-salle.md` |
| 06 — Menu / Carte | `docs/atelier-06-menu-carte.md` |
| 07 — Pages statiques | `docs/atelier-07-pages-statiques.md` |
| 08 — Multilingue / RTL | `docs/atelier-08-multilingue-rtl.md` |
| 09 — Design System | `docs/atelier-09-design-system.md` |

**Règle** : Lire le fichier atelier concerné avant de commencer à travailler dessus. C'est la source de vérité de l'état d'avancement de chaque atelier.

---

## 8c. Rituel de fin de session

Avant de terminer chaque session, mettre à jour le fichier atelier concerné (statut, travail réalisé, reste à faire) et proposer une ligne à ajouter dans DECISIONS_LOG.md si une décision a été prise. Ce qui n'est pas capturé dans ces fichiers n'existe pas pour la prochaine session.

---

## Comportement par atelier

### Au démarrage de chaque session
1. Lire CLAUDE.md en entier
2. Demander sur quel atelier on travaille
3. Lire le fichier atelier correspondant dans docs/
4. Résumer en 3 lignes : ce qui est décidé, ce qui reste à faire, où on en est

### Pendant le travail
- Dès qu'une décision est prise, la noter immédiatement dans la section "Décisions prises" du fichier atelier
- Mettre à jour "Travail réalisé" au fil de la session

### En fin de session (obligatoire avant de clore)
- Mettre à jour le fichier atelier : statut, travail réalisé, reste à faire, questions ouvertes
- Proposer une ligne pour DECISIONS_LOG.md si une décision a été prise
- Rappeler : "Ce qui n'est pas capturé ici n'existe pas pour la prochaine session."

### Passage à un nouvel atelier
- Clore proprement le fichier atelier en cours avant de commencer le suivant
- Passer le statut à "Terminé" uniquement si tout est résolu — sinon "En cours" avec les points ouverts notés

---

## 9. Questions ouvertes (à résoudre)

- [ ] Nom définitif du restaurant
- [ ] Adresse précise du restaurant à Alger
- [ ] Processus d'obtention du domaine .dz (ANIC)
- [ ] Identité visuelle (en attente Google Stitch + maquettes)
- [ ] Menus et carte définitifs
- [ ] Nombre de tables / capacité réelle (provisoire : 30 tables)
- [ ] Système email pour confirmations de réservation (Resend — free tier recommandé)
