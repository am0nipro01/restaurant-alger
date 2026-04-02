# Atelier 01 — Architecture

## Statut : En cours

## Objectif
Définir et mettre en place la structure complète du projet : arborescence des dossiers, configuration initiale du front-end React + Tailwind, connexion avec PocketBase, et déploiement de base sur Netlify + Fly.io.

## Décisions prises
(vide)

## Travail réalisé

Bonne lecture de PROJECT_CONTEXT.md. Voilà ce qu'on sait au départ de cet atelier :
- React + Tailwind / Netlify / PocketBase + Fly.io ✅
- Mobile first, premium, multilingue (FR / AR RTL / EN)
- Réservation sans paiement, plan de salle, menu, pages statiques, dashboard admin

**Ce qu'on doit décider dans cet atelier**

L'Architecture couvre 4 sujets — on peut les traiter dans l'ordre ou sauter directement à l'un d'eux :

1. **Structure des pages & routes** — Quelles pages existent, comment elles sont organisées, ce qui est public vs. privé (admin).
2. **Structure du projet front-end** — Arborescence des dossiers React, conventions de nommage, organisation des composants.
3. **Collections PocketBase (schéma de données)** — Quelles tables, quels champs — c'est la fondation de tout le reste (réservations, menus, tables, etc.).
4. **Architecture de déploiement** — Comment Netlify parle à Fly.io, gestion des environnements (dev / prod), variables d'env.

**Suggestion pour démarrer**

Commencer par les pages & routes — ça pose le périmètre exact du site, et tout le reste (données, composants, déploiement) en découle naturellement.

## Reste à faire
(vide)

## Questions ouvertes
(vide)
