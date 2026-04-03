/// <reference path="../pb_data/types.d.ts" />

// ─────────────────────────────────────────────────────────
// Hook : email de confirmation de réservation via Resend
//
// Se déclenche quand le statut d'une réservation passe
// à "confirmee" dans la page admin/reservations.
//
// Configuration requise :
//   1. Créer un compte Resend (free tier : 3 000 emails/mois)
//   2. Obtenir une API Key sur https://resend.com/api-keys
//   3. Ajouter la variable dans PocketBase :
//      Settings → Application → "Hook env vars"
//      ou définir RESEND_API_KEY dans l'environnement système
// ─────────────────────────────────────────────────────────

const RESEND_API_KEY = $os.getenv("RESEND_API_KEY") || ""
const FROM_EMAIL     = "reservations@algiersgastronomy.dz" // à adapter au domaine vérifié Resend
const RESTAURANT_NOM = "Algiers Gastronomy"

// Formater la date en français
function formatDate(dateStr) {
  if (!dateStr) return dateStr
  const d = new Date(dateStr.split(" ")[0] + "T12:00:00Z")
  const mois = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"]
  return `${d.getUTCDate()} ${mois[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

// Envoyer l'email via Resend API
function envoyerEmailConfirmation(reservation) {
  if (!RESEND_API_KEY) {
    console.log("[Hook] RESEND_API_KEY non définie — email ignoré")
    return
  }

  const { nom, email, date, heure, nb_personnes, message } = reservation

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:48px 24px;">

    <!-- En-tête -->
    <div style="border-bottom:1px solid #e9e8e4;padding-bottom:32px;margin-bottom:40px;text-align:center;">
      <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#845325;margin:0 0 12px 0;">
        ${RESTAURANT_NOM}
      </p>
      <h1 style="font-size:32px;font-weight:300;color:#1b1c1a;margin:0;letter-spacing:-0.02em;">
        Réservation confirmée
      </h1>
    </div>

    <!-- Message principal -->
    <p style="font-family:Arial,sans-serif;font-size:15px;color:#51443b;line-height:1.7;margin:0 0 40px 0;">
      Cher(e) <strong>${nom}</strong>,<br><br>
      Nous avons le plaisir de vous confirmer votre réservation au <strong>${RESTAURANT_NOM}</strong>.
      Nous nous réjouissons de vous accueillir pour une expérience gastronomique au cœur de l'héritage algérien.
    </p>

    <!-- Récapitulatif -->
    <div style="background:#f4f4f0;padding:32px;margin-bottom:40px;">
      <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#845325;margin:0 0 24px 0;border-bottom:1px solid #e9e8e4;padding-bottom:16px;">
        Détails de votre réservation
      </p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#a09080;padding:8px 0 4px 0;">Date</td>
          <td style="font-family:Georgia,serif;font-size:18px;color:#1b1c1a;padding:8px 0 4px 0;text-align:right;">${formatDate(date)}</td>
        </tr>
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#a09080;padding:4px 0;">Heure</td>
          <td style="font-family:Georgia,serif;font-size:18px;color:#1b1c1a;padding:4px 0;text-align:right;">${heure ? heure.slice(0,5) : "—"}</td>
        </tr>
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#a09080;padding:4px 0;">Couverts</td>
          <td style="font-family:Georgia,serif;font-size:18px;color:#1b1c1a;padding:4px 0;text-align:right;">${nb_personnes} personne${nb_personnes > 1 ? "s" : ""}</td>
        </tr>
        ${message ? `
        <tr>
          <td colspan="2" style="padding-top:16px;border-top:1px solid #e9e8e4;">
            <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#a09080;margin:0 0 6px 0;">Note</p>
            <p style="font-family:Arial,sans-serif;font-size:13px;color:#51443b;margin:0;font-style:italic;">${message}</p>
          </td>
        </tr>` : ""}
      </table>
    </div>

    <!-- Informations pratiques -->
    <div style="margin-bottom:40px;">
      <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#845325;margin:0 0 16px 0;">Informations pratiques</p>
      <ul style="font-family:Arial,sans-serif;font-size:13px;color:#51443b;line-height:1.8;margin:0;padding-left:20px;">
        <li>Tenue de ville exigée</li>
        <li>En cas de retard supérieur à 15 minutes, merci de nous contacter</li>
        <li>Aucun acompte requis — règlement sur place uniquement</li>
      </ul>
    </div>

    <!-- Pied de page -->
    <div style="border-top:1px solid #e9e8e4;padding-top:32px;text-align:center;">
      <p style="font-family:Arial,sans-serif;font-size:11px;color:#a09080;line-height:1.6;margin:0;">
        ${RESTAURANT_NOM}<br>
        Pour toute question, répondez à cet email ou contactez-nous directement.
      </p>
    </div>

  </div>
</body>
</html>
  `.trim()

  try {
    const res = $http.send({
      url: "https://api.resend.com/emails",
      method: "POST",
      headers: {
        "Authorization": "Bearer " + RESEND_API_KEY,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        from:    FROM_EMAIL,
        to:      [email],
        subject: `Confirmation de votre réservation — ${RESTAURANT_NOM}`,
        html:    html,
      }),
    })

    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log("[Hook] Email de confirmation envoyé à", email)
    } else {
      console.error("[Hook] Erreur Resend:", res.statusCode, res.raw)
    }
  } catch (e) {
    console.error("[Hook] Exception lors de l'envoi email:", e)
  }
}

// ─── Déclencheur ───────────────────────────────────────────
// Après chaque mise à jour d'une réservation :
// si le statut passe à "confirmee", envoyer l'email

onRecordAfterUpdateRequest((e) => {
  const record    = e.record
  const ancienStatut = e.record.original().get("statut")
  const nouveauStatut = record.get("statut")

  // Déclencher uniquement si on passe à "confirmee" (et pas déjà confirmée)
  if (nouveauStatut === "confirmee" && ancienStatut !== "confirmee") {
    const reservation = {
      nom:         record.get("nom"),
      email:       record.get("email"),
      date:        record.get("date"),
      heure:       record.get("heure"),
      nb_personnes: record.get("nb_personnes"),
      message:     record.get("message"),
    }
    envoyerEmailConfirmation(reservation)
  }
}, "reservations")
