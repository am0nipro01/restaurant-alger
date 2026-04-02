# Atelier 06 — Menu / Carte

## Statut : Terminé

## Objectif
Développer la page menu/carte du restaurant : affichage des plats, catégories, descriptions et prix, avec contenu modifiable via le dashboard admin.

## Décisions prises
- Affichage par catégories avec onglets sticky en haut de page
- Seuls les plats avec `disponible = true` sont affichés
- Prix en DA (Dinar Algérien), format localisé
- Catégorie active = première catégorie par défaut
- Design épuré : liste avec séparateurs, nom + description + prix
- Contenu 100% piloté par PocketBase (admin menu)

## Travail réalisé
- `src/pages/public/Menu.jsx` — page menu complète avec onglets, liste des plats, gestion état vide

## Reste à faire
- [ ] Ajouter de vrais plats via le dashboard admin pour tester l'affichage
- [ ] Intégration design system (Atelier 09)

## Questions ouvertes
- Menus et carte définitifs (à remplir par les gérants)
- Photos des plats ? (pas prévu pour l'instant)
