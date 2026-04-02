import { useState } from 'react'
import { genererCreneaux, verifierCapacite, creerReservation } from '../../lib/reservations'

const creneaux = genererCreneaux()

const initialForm = {
  nom: '',
  email: '',
  telephone: '',
  date: '',
  heure: '',
  nb_personnes: 2,
  message: '',
}

export default function Reservation() {
  const [form, setForm] = useState(initialForm)
  const [etape, setEtape] = useState('formulaire') // 'formulaire' | 'chargement' | 'succes' | 'erreur'
  const [erreur, setErreur] = useState('')

  // Date minimum = aujourd'hui
  const aujourdhui = new Date().toISOString().split('T')[0]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEtape('chargement')
    setErreur('')

    // Vérification capacité
    const capaciteOk = await verifierCapacite(form.date, form.heure, Number(form.nb_personnes))
    if (!capaciteOk) {
      setErreur('Ce créneau est complet. Veuillez choisir un autre horaire ou une autre date.')
      setEtape('formulaire')
      return
    }

    // Création de la réservation
    const result = await creerReservation({
      ...form,
      nb_personnes: Number(form.nb_personnes),
    })

    if (result.success) {
      setEtape('succes')
    } else {
      setErreur(result.message)
      setEtape('formulaire')
    }
  }

  if (etape === 'succes') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">✓</div>
          <h1 className="text-2xl font-semibold mb-2">Réservation confirmée</h1>
          <p className="text-gray-500 mb-6">
            Merci <strong>{form.nom}</strong>. Votre réservation pour le <strong>{form.date}</strong> à <strong>{form.heure}</strong> est bien enregistrée.
            Nous vous contacterons par email pour confirmer.
          </p>
          <button
            onClick={() => { setForm(initialForm); setEtape('formulaire') }}
            className="text-sm underline text-gray-500 hover:text-black transition"
          >
            Faire une nouvelle réservation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-2">Réservation</h1>
        <p className="text-center text-gray-500 text-sm mb-10">
          Aucun acompte requis — règlement sur place uniquement.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 flex flex-col gap-5">

          {/* Nom */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nom complet *</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              placeholder="Ex : Karim Benali"
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Ex : karim@email.com"
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Téléphone */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              placeholder="Ex : +213 555 123 456"
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Date + Heure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                min={aujourdhui}
                className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Heure *</label>
              <select
                name="heure"
                value={form.heure}
                onChange={handleChange}
                required
                className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black bg-white"
              >
                <option value="">-- Choisir --</option>
                {creneaux.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Nombre de personnes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre de personnes *</label>
            <select
              name="nb_personnes"
              value={form.nb_personnes}
              onChange={handleChange}
              required
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black bg-white"
            >
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Message <span className="text-gray-400">(optionnel)</span></label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={3}
              placeholder="Allergie, occasion spéciale, demande particulière..."
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Erreur */}
          {erreur && (
            <p className="text-red-500 text-sm text-center">{erreur}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={etape === 'chargement'}
            className="bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {etape === 'chargement' ? 'Vérification en cours...' : 'Confirmer la réservation'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Aucun paiement requis. Règlement sur place uniquement.
          </p>
        </form>
      </div>
    </div>
  )
}
