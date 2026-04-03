# Atelier 09 — Design System

## Statut : Terminé

## Objectif
Définir et appliquer le design system du site via Google Stitch — typographie, couleurs, composants — puis convertir toutes les maquettes Stitch en composants React.

---

## Décisions prises

- **Design system retenu** : "The Desert Gallery" — tokens Stitch importés directement dans `@theme` Tailwind v4
- **Couleurs** : surface `#faf9f5`, primary `#845325`, primary-container `#c58b58`, charcoal `#1b1c1a`, outline-variant `#d6c3b6`
- **Typographie** : Noto Serif (titres/headlines), Manrope (corps/labels), Noto Serif Arabic + Noto Sans Arabic (RTL) — Google Fonts
- **Border-radius** : 0px sur tout le site (style éditorial premium)
- **Approche menu** : scroll + anchors par catégorie (abandon des onglets/tabs) — toutes catégories visibles simultanément
- **Contenu menu non traduit** : noms de plats intentionnellement en français uniquement (standard restaurant premium)
- **Descriptions catégories** : champ `description` ajouté à `menu_categories` dans PocketBase — 3 descriptions saisies via browser automation
- **Fix overlap confirmation** : positionnement `absolute` pour le bloc texte "Préparez votre visite" (suppression du `-ml-20` Stitch qui causait le chevauchement)

---

## Travail réalisé

### index.css — Design system complet
- `@theme` avec tous les tokens Stitch (couleurs, fonts, radius 0px)
- Import Google Fonts (Noto Serif, Manrope, variantes Arabic)
- Utilities custom : `.animate-fade-in`, `.shadow-desert`, `.nav-glass`, `.gradient-golden-hour`, `.label-caps`

### Navbar.jsx — Refonte complète
- Fixed glass (`bg-surface/90 backdrop-blur-sm`), logo uppercase tracking
- Liens all-caps 11px, active = border-bottom primary
- Switcher FR/EN/ع, bouton réservation terracotta
- Burger animé 3 lignes

### Footer.jsx — Refonte complète
- Grille 12 colonnes (4+2+3+3), typographie design system

### Home.jsx — Refonte complète
- Hero 95vh + overlay, barre stats, section éditoriale 2 colonnes, dark statement section

### Menu.jsx — Refonte complète
- Scroll-based (toutes catégories simultanées), anchors `#cat-{id}`
- Layout 4+8 colonnes, titres sticky à `top-[140px]`, hover terracotta sur noms de plats
- Interlude image après première catégorie
- `description` catégorie affichée sous chaque titre (données PocketBase)

### NotreHistoire.jsx — Refonte complète
- Hero avec tagine, section éditoriale asymétrique (citation + corps), grille 2 photos grayscale
- Section équipe : 3 membres décalés verticalement (stagger)
- CTA avec watermark "GASTRONOMY"

### Contact.jsx — Refonte complète
- Hero "Nous / *Contacter*" (italic), accroche
- Layout 2 colonnes : infos pratiques (adresse, horaires, bouton) + photo architecture + texte éditorial
- Section carte pleine largeur avec overlay "Nous trouver"

### Reservation.jsx — Refonte complète
- Hero "Une Table au Cœur d'Alger" + accroche uppercase
- Formulaire fond blanc, champs underline uniquement (`border-0 border-b`), focus terracotta
- Toute la logique PocketBase préservée
- Triptyque décoratif 3 photos en bas de page

### ReservationConfirmation.jsx — Refonte complète
- Icône check dans cadre bordé
- Bloc récap "Détails de la table" (invité, date formatée selon locale, heure, couverts)
- Fix du chevauchement image/texte : `md:absolute md:right-0` au lieu de `-ml-20`
- Section "Préparez votre visite"

### i18n — Nouvelles clés ajoutées (FR/EN/AR)
- `histoire.*` : heritage_label, titre, intro_citation, intro_p1/p2, modernite_*, collectif_*, cta_desc
- `contact.*` : titre_normal, titre_italique, accroche, adresse_ville, horaires_jours, horaires_ferme, lieu_*, map_label
- `reservation.*` : hero_titre, hero_accroche
- `confirmation.*` : sous_titre, details_label, invite_label, date_label, heure_label, couverts_label, preparer_*
- `menu.*` : hero_sous_titre, citation
- `footer.*` : social_titre

---

## Reste à faire

- [ ] Remplacer les images Stitch CDN par les vraies photos du restaurant (TODO marqués dans chaque composant)
- [ ] Données équipe (Notre Histoire) : membres réels à saisir en PocketBase quand confirmés
- [ ] Membres équipe hardcodés en attendant une collection PocketBase `staff`
- [ ] Adresse définitive du restaurant (actuellement "12 Rue des Oliviers" — provisoire)
- [ ] Carte Google Maps à intégrer quand l'adresse est confirmée

---

## Questions ouvertes

- Adresse réelle du restaurant à Alger ?
- Photos réelles disponibles quand ?
- Membres de l'équipe réels (noms, rôles, photos) ?
