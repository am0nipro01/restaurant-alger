/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const MANAGER_RULE = '@request.auth.collectionName = "managers"'

  // ── Réservations ──────────────────────────────────────
  const reservations = app.findCollectionByNameOrId("pbc_1473635903")

  reservations.listRule   = MANAGER_RULE
  reservations.viewRule   = MANAGER_RULE
  reservations.updateRule = MANAGER_RULE
  // createRule reste "" (public), deleteRule reste null (superadmin uniquement)

  app.save(reservations)

  // ── Tables ────────────────────────────────────────────
  const tables = app.findCollectionByNameOrId("pbc_3008659311")

  tables.listRule   = MANAGER_RULE
  tables.viewRule   = MANAGER_RULE
  tables.updateRule = MANAGER_RULE
  // createRule et deleteRule restent null (superadmin uniquement)

  app.save(tables)

}, (app) => {
  // Rollback : remettre à null (accès superadmin uniquement)
  const reservations = app.findCollectionByNameOrId("pbc_1473635903")
  reservations.listRule   = null
  reservations.viewRule   = null
  reservations.updateRule = null
  app.save(reservations)

  const tables = app.findCollectionByNameOrId("pbc_3008659311")
  tables.listRule   = null
  tables.viewRule   = null
  tables.updateRule = null
  app.save(tables)
})
