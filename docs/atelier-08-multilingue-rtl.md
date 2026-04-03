# Atelier 08 — Multilingue / RTL

## Statut : Terminé ✅

## Objectif
Implémenter le support multilingue complet (Français, Arabe avec RTL, Anglais) sur l'ensemble du site, avec gestion correcte de la direction du texte et des mises en page.

## Décisions prises
- Lib : i18next + react-i18next + i18next-browser-languagedetector
- Langues : fr (défaut), en, ar
- Détection automatique de la langue du navigateur, persistée en localStorage
- RTL : géré via hook `useRTL` qui applique `dir="rtl"` et `lang` sur `<html>` automatiquement
- Sélecteur de langue dans la Navbar (FR / EN / ع)
- Contenu PocketBase rechargé quand la langue change (Notre Histoire, Contact)
- Traductions complètes : nav, home, menu, réservation, confirmation, histoire, contact, footer

## Travail réalisé
- `src/i18n/fr.json` — traductions complètes français
- `src/i18n/en.json` — traductions complètes anglais
- `src/i18n/ar.json` — traductions complètes arabe
- `src/i18n/index.js` — configuration i18next
- `src/hooks/useRTL.js` — hook RTL automatique
- `src/main.jsx` — import i18n au démarrage
- `src/App.jsx` — useRTL branché au niveau app
- Navbar — sélecteur FR/EN/ع, labels traduits
- Footer — labels traduits
- Home, NotreHistoire, Contact, Réservation — useTranslation branché
- Menu — useTranslation branché (titre, sous-titre, chargement, vide, indisponible, footer)
- Réservation — useTranslation branché (tous les labels formulaire, erreurs, placeholders)
- Confirmation — useTranslation branché (titre, message avec interpolation {{date}} {{heure}} {{nb}}, liens)

## Reste à faire
- [ ] Polices : ajouter une police arabe adaptée (Atelier 09 Design System)
- [ ] Tester le RTL visuellement sur toutes les pages

## Questions ouvertes
- Police arabe : Cairo, Noto Sans Arabic, ou autre ?
