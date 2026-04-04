/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // @request.auth.collectionName n'est pas un champ DB — invalide dans les API Rules.
  // La règle correcte : tout utilisateur authentifié (admin bypass les règles de toute façon).
  const AUTHENTICATED = '@request.auth.id != ""'

  // ── Réservations ──────────────────────────────────────
  const reservations = app.findCollectionByNameOrId("pbc_1473635903")
  reservations.listRule   = AUTHENTICATED
  reservations.viewRule   = AUTHENTICATED
  reservations.updateRule = AUTHENTICATED
  app.save(reservations)

  // ── Tables ────────────────────────────────────────────
  const tables = app.findCollectionByNameOrId("pbc_3008659311")
  tables.listRule   = AUTHENTICATED
  tables.viewRule   = AUTHENTICATED
  tables.updateRule = AUTHENTICATED
  app.save(tables)

}, (app) => {
  const MANAGER_RULE = '@request.auth.collectionName = "managers"'

  const reservations = app.findCollectionByNameOrId("pbc_1473635903")
  reservations.listRule   = MANAGER_RULE
  reservations.viewRule   = MANAGER_RULE
  reservations.updateRule = MANAGER_RULE
  app.save(reservations)

  const tables = app.findCollectionByNameOrId("pbc_3008659311")
  tables.listRule   = MANAGER_RULE
  tables.viewRule   = MANAGER_RULE
  tables.updateRule = MANAGER_RULE
  app.save(tables)
})
