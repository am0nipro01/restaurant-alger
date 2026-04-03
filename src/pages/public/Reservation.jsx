import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { genererCreneaux, verifierCapacite, creerReservation } from '../../lib/reservations'
import PublicLayout from '../../components/layout/PublicLayout'

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
  const { t } = useTranslation()
  const [form, setForm] = useState(initialForm)
  const [etape, setEtape] = useState('formulaire') // 'formulaire' | 'chargement'
  const [erreur, setErreur] = useState('')
  const navigate = useNavigate()

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
      setErreur(t('reservation.creneau_complet'))
      setEtape('formulaire')
      return
    }

    // Création de la réservation
    const result = await creerReservation({
      ...form,
      nb_personnes: Number(form.nb_personnes),
    })

    if (result.success) {
      navigate('/reservation/confirmation', {
        state: {
          nom: form.nom,
          date: form.date,
          heure: form.heure,
          nb_personnes: form.nb_personnes,
        }
      })
    } else {
      setErreur(result.message)
      setEtape('formulaire')
    }
  }

  return (
    <PublicLayout>
    <div className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-2">{t('reservation.titre')}</h1>
        <p className="text-center text-gray-500 text-sm mb-10">
          {t('reservation.sous_titre')}
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 flex flex-col gap-5">

          {/* Nom */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{t('reservation.nom')} *</label>
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
            <label className="text-sm font-medium">{t('reservation.email')} *</label>
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
            <label className="text-sm font-medium">{t('reservation.telephone')}</label>
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
              <label className="text-sm font-medium">{t('reservation.date')} *</label>
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
              <label className="text-sm font-medium">{t('reservation.heure')} *</label>
              <select
                name="heure"
                value={form.heure}
                onChange={handleChange}
                required
                className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black bg-white"
              >
                <option value="">{t('reservation.heure_placeholder')}</option>
                {creneaux.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Nombre de personnes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{t('reservation.nb_personnes')} *</label>
            <select
              name="nb_personnes"
              value={form.nb_personnes}
              onChange={handleChange}
              required
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black bg-white"
            >
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <option key={n} value={n}>{n} {n > 1 ? t('reservation.personnes') : t('reservation.personne')}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{t('reservation.message')} <span className="text-gray-400">{t('reservation.message_label')}</span></label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={3}
              placeholder={t('reservation.message_placeholder')}
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
            {etape === 'chargement' ? t('reservation.chargement') : t('reservation.soumettre')}
          </button>

          <p className="text-xs text-gray-400 text-center">
            {t('reservation.no_paiement')}
          </p>
        </form>
      </div>
    </div>
    </PublicLayout>
  )
}
