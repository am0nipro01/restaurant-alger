import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import pb from '../../lib/pocketbase'

const inputClass = 'w-full border-0 border-b border-stone-200 bg-transparent py-3 font-body text-sm text-charcoal placeholder:text-stone-300 focus:outline-none focus:border-primary transition-colors'
const labelClass = 'block font-label text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2'

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
const JOURS_LABELS = {
  lundi: 'Lundi', mardi: 'Mardi', mercredi: 'Mercredi',
  jeudi: 'Jeudi', vendredi: 'Vendredi', samedi: 'Samedi', dimanche: 'Dimanche'
}

const DEFAUT = {
  nom_restaurant:   '',
  adresse:          '',
  ville:            '',
  telephone:        '',
  whatsapp:         '',
  email_contact:    '',
  email_reservations: '',
  instagram:        '',
  facebook:         '',
  google_maps_url:  '',
  horaires: {
    lundi:    { ouvert: true,  midi: '', soir: '19:00 — 23:00' },
    mardi:    { ouvert: true,  midi: '', soir: '19:00 — 23:00' },
    mercredi: { ouvert: true,  midi: '', soir: '19:00 — 23:00' },
    jeudi:    { ouvert: true,  midi: '', soir: '19:00 — 23:00' },
    vendredi: { ouvert: true,  midi: '', soir: '19:00 — 23:00' },
    samedi:   { ouvert: true,  midi: '', soir: '19:00 — 23:00' },
    dimanche: { ouvert: false, midi: '', soir: '' },
  },
  dress_code:          '',
  parking:             '',
  accessibilite:       '',
  moyens_paiement:     '',
  note_fermeture:      '',
}

export default function AdminContact() {
  const [form, setForm]           = useState(DEFAUT)
  const [recordId, setRecordId]   = useState(null)
  const [loading, setLoading]     = useState(true)
  const [sauvegarde, setSauvegarde] = useState(null) // null | 'ok' | 'erreur'
  const [saving, setSaving]       = useState(false)

  // Charger depuis PocketBase (collection site_config, record unique "contact")
  useEffect(() => {
    const charger = async () => {
      setLoading(true)
      try {
        const records = await pb.collection('site_config').getFullList({
          filter: 'cle = "contact"',
        })
        if (records.length > 0) {
          const rec = records[0]
          setRecordId(rec.id)
          const data = typeof rec.valeur === 'string' ? JSON.parse(rec.valeur) : rec.valeur
          setForm({ ...DEFAUT, ...data })
        }
      } catch (_) {
        // Collection pas encore créée — on part des valeurs par défaut
      }
      setLoading(false)
    }
    charger()
  }, [])

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const setHoraire = (jour, champ, val) =>
    setForm((f) => ({
      ...f,
      horaires: { ...f.horaires, [jour]: { ...f.horaires[jour], [champ]: val } },
    }))

  const sauvegarder = async () => {
    setSaving(true)
    setSauvegarde(null)
    try {
      const payload = { cle: 'contact', valeur: JSON.stringify(form) }
      if (recordId) {
        await pb.collection('site_config').update(recordId, payload)
      } else {
        const rec = await pb.collection('site_config').create(payload)
        setRecordId(rec.id)
      }
      setSauvegarde('ok')
      setTimeout(() => setSauvegarde(null), 3000)
    } catch (e) {
      console.error('[AdminContact] Erreur sauvegarde:', e)
      setSauvegarde('erreur')
    }
    setSaving(false)
  }

  return (
    <AdminLayout>

      {/* ── Header ── */}
      <header className="flex justify-between items-end mb-12 max-w-4xl mx-auto">
        <div>
          <h2 className="font-headline text-4xl text-charcoal tracking-tight">Informations du Restaurant</h2>
          <p className="font-body text-stone-500 mt-2 text-sm">
            Ces informations apparaissent sur la page Contact du site public.
          </p>
        </div>
        <div className="flex items-center gap-6">
          {sauvegarde === 'ok' && (
            <span className="text-xs tracking-wider uppercase text-green-600">✓ Enregistré</span>
          )}
          {sauvegarde === 'erreur' && (
            <span className="text-xs tracking-wider uppercase text-red-500">Erreur — voir console</span>
          )}
          <button
            onClick={sauvegarder}
            disabled={saving}
            className="bg-primary text-white px-10 py-4 font-label text-[11px] tracking-[0.2em] uppercase hover:bg-primary-container transition-colors duration-300 disabled:opacity-50"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="text-stone-400 text-sm tracking-widest uppercase text-center py-24">Chargement…</div>
      ) : (
        <div className="space-y-12 max-w-4xl mx-auto">

          {/* ── Section 1 : Identité ── */}
          <section className="bg-white p-10">
            <h3 className="font-headline text-xl mb-8 pb-4 border-b border-stone-100">Identité</h3>
            <div className="space-y-8">
              <div>
                <label className={labelClass}>Nom du restaurant *</label>
                <input type="text" className={inputClass} placeholder="Ex : Algiers Gastronomy"
                  value={form.nom_restaurant} onChange={(e) => setField('nom_restaurant', e.target.value)} />
              </div>
            </div>
          </section>

          {/* ── Section 2 : Adresse ── */}
          <section className="bg-white p-10">
            <h3 className="font-headline text-xl mb-8 pb-4 border-b border-stone-100">Adresse</h3>
            <div className="space-y-8">
              <div>
                <label className={labelClass}>Rue & Numéro</label>
                <input type="text" className={inputClass} placeholder="Ex : 12 Rue des Oliviers"
                  value={form.adresse} onChange={(e) => setField('adresse', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Ville & Wilaya</label>
                <input type="text" className={inputClass} placeholder="Ex : Alger, Algérie"
                  value={form.ville} onChange={(e) => setField('ville', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Lien Google Maps</label>
                <input type="url" className={inputClass} placeholder="https://maps.google.com/..."
                  value={form.google_maps_url} onChange={(e) => setField('google_maps_url', e.target.value)} />
              </div>
            </div>
          </section>

          {/* ── Section 3 : Contacts ── */}
          <section className="bg-white p-10">
            <h3 className="font-headline text-xl mb-8 pb-4 border-b border-stone-100">Contacts</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Téléphone</label>
                <input type="tel" className={inputClass} placeholder="Ex : +213 23 45 67 89"
                  value={form.telephone} onChange={(e) => setField('telephone', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>WhatsApp</label>
                <input type="tel" className={inputClass} placeholder="Ex : +213 67 89 01 23"
                  value={form.whatsapp} onChange={(e) => setField('whatsapp', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Email public (affiché sur le site)</label>
                <input type="email" className={inputClass} placeholder="contact@..."
                  value={form.email_contact} onChange={(e) => setField('email_contact', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Email notifications réservations</label>
                <input type="email" className={inputClass} placeholder="reservations@..."
                  value={form.email_reservations} onChange={(e) => setField('email_reservations', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Instagram</label>
                <input type="text" className={inputClass} placeholder="https://instagram.com/..."
                  value={form.instagram} onChange={(e) => setField('instagram', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Facebook</label>
                <input type="text" className={inputClass} placeholder="https://facebook.com/..."
                  value={form.facebook} onChange={(e) => setField('facebook', e.target.value)} />
              </div>
            </div>
          </section>

          {/* ── Section 4 : Horaires ── */}
          <section className="bg-white p-10">
            <h3 className="font-headline text-xl mb-8 pb-4 border-b border-stone-100">Horaires d'Ouverture</h3>
            <div className="space-y-4">
              {JOURS.map((jour) => {
                const h = form.horaires[jour]
                return (
                  <div key={jour} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-stone-50">
                    {/* Jour + toggle */}
                    <div className="col-span-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setHoraire(jour, 'ouvert', !h.ouvert)}
                        className="relative flex-shrink-0"
                      >
                        <div className={`w-8 h-4 rounded-full transition-colors ${h.ouvert ? 'bg-primary' : 'bg-stone-200'}`}>
                          <div className={`absolute top-[2px] left-[2px] w-3 h-3 bg-white rounded-full transition-transform ${h.ouvert ? 'translate-x-4' : ''}`} />
                        </div>
                      </button>
                      <span className={`font-label text-xs tracking-wider uppercase ${h.ouvert ? 'text-charcoal font-bold' : 'text-stone-300'}`}>
                        {JOURS_LABELS[jour]}
                      </span>
                    </div>

                    {h.ouvert ? (
                      <>
                        <div className="col-span-4">
                          <label className="font-label text-[9px] tracking-widest uppercase text-stone-300 block mb-1">Midi (optionnel)</label>
                          <input type="text" className={inputClass + ' text-xs'} placeholder="12:00 — 14:30"
                            value={h.midi} onChange={(e) => setHoraire(jour, 'midi', e.target.value)} />
                        </div>
                        <div className="col-span-5">
                          <label className="font-label text-[9px] tracking-widest uppercase text-stone-300 block mb-1">Soir</label>
                          <input type="text" className={inputClass + ' text-xs'} placeholder="19:00 — 23:00"
                            value={h.soir} onChange={(e) => setHoraire(jour, 'soir', e.target.value)} />
                        </div>
                      </>
                    ) : (
                      <div className="col-span-9 font-label text-xs text-stone-300 uppercase tracking-widest">
                        Fermé
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-6">
              <label className={labelClass}>Note sur les fermetures exceptionnelles</label>
              <input type="text" className={inputClass} placeholder="Ex : Fermé pendant le Ramadan, ouvert les jours fériés"
                value={form.note_fermeture} onChange={(e) => setField('note_fermeture', e.target.value)} />
            </div>
          </section>

          {/* ── Section 5 : Infos pratiques ── */}
          <section className="bg-white p-10">
            <h3 className="font-headline text-xl mb-8 pb-4 border-b border-stone-100">Informations Pratiques</h3>
            <div className="space-y-8">
              <div>
                <label className={labelClass}>Dress code</label>
                <input type="text" className={inputClass} placeholder="Ex : Tenue de ville exigée"
                  value={form.dress_code} onChange={(e) => setField('dress_code', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Parking</label>
                <input type="text" className={inputClass} placeholder="Ex : Parking public à 200m, parking privé sur réservation"
                  value={form.parking} onChange={(e) => setField('parking', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Accessibilité PMR</label>
                <input type="text" className={inputClass} placeholder="Ex : Établissement entièrement accessible"
                  value={form.accessibilite} onChange={(e) => setField('accessibilite', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Moyens de paiement acceptés</label>
                <input type="text" className={inputClass} placeholder="Ex : Espèces, CIB, Dahabia"
                  value={form.moyens_paiement} onChange={(e) => setField('moyens_paiement', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Bouton bas de page */}
          <div className="flex justify-end pb-12 max-w-4xl mx-auto">
            <button
              onClick={sauvegarder}
              disabled={saving}
              className="bg-charcoal text-white px-14 py-4 font-label text-[11px] tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {saving ? 'Enregistrement…' : 'Publier les informations'}
            </button>
          </div>

        </div>
      )}

    </AdminLayout>
  )
}
