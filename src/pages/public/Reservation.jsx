import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { genererCreneaux, verifierCapacite, creerReservation } from '../../lib/reservations'
import PublicLayout from '../../components/layout/PublicLayout'
import PageSEO from '../../components/seo/PageSEO'

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

// TODO: remplacer par les vraies photos du restaurant
const IMG1 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhDvt1lpdubcaHnPitlBtLmZ4gwlQsVFBq2YNVklOiPqCDfMwiHBBkQYdWZzvLGHTn-wWq09qOAB-AxedF1U4Qu9uoQGDb4fCgzr51x9erqWaqBrOvNrvC7DSwC19Xz_4_ZykQmsUgw-K_shFU_z7pHUO6tW5ucaZqMqwuzvsAXKa8HWn6SYqkP0CbIOW_f_4VLh4GcoMYgEsDXtZlKFsHxttL2iROovYjJS7uhaxzMTSgBwiXXyqmQ8zaq97aIlEWRn0QTdhNQOKi'
const IMG2 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1VW4y1cyEuDnCaDPHwtXqNy5oCiI_OYT6j7dYf8jvttIIvurgp4tisb2WnQNjBtBAVu3xSM8VB8DQC-Ccy4esD0eEgrPqZsWhP8Vo68ADL4PXjKzlu_0-pu73XJhbQerqXeNkQN1ROt-A4qJMUL4NgSq1-mYHu-5wi7xj4Y7WXkJaAG8X0D585PAVBUb4qa7DtH4PLLmwRz3EH1Z_BFn1apX2blU6RuN2nShdumHEnnm6_RicUKp9qgl76kJvFCQCqiAb8dKmyz3_'
const IMG3 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl8kki7xl415TWipkA508osop7ASvcenhH5Kx3UJJM9xe2IWdgKyLD6hjdY1NI3LoMUs9IS2zDIZFAnSP7P91vfgBqvTl0ZFtJcZv-Q9_CRAhmcAVnXk7SnRCBcDjKx3PE88aXzoSdAKVOPpGyQvNG4fh2PGyN73dgTsU2OYOntOhaNhKHKSbjFFRBSy1ACFqjKTYIP3TPvwPi4PA0unu_BaZcTjBEoj-OFabjQWv3_YmHyyNCf5TtFDec0LYduZZkcxGO_4c3lmfX'

// Classes communes pour les champs du formulaire
const inputClass =
  'border-0 border-b border-stone-300 bg-transparent py-2 px-0 font-body text-sm text-charcoal placeholder:text-stone-300 focus:outline-none focus:border-b-primary w-full transition-colors duration-200'
const labelClass =
  'font-label text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400'

export default function Reservation() {
  const { t } = useTranslation()
  const [form, setForm] = useState(initialForm)
  const [etape, setEtape] = useState('formulaire') // 'formulaire' | 'chargement'
  const [erreur, setErreur] = useState('')
  const navigate = useNavigate()

  const aujourdhui = new Date().toISOString().split('T')[0]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEtape('chargement')
    setErreur('')

    const capaciteOk = await verifierCapacite(form.date, form.heure, Number(form.nb_personnes))
    if (!capaciteOk) {
      setErreur(t('reservation.creneau_complet'))
      setEtape('formulaire')
      return
    }

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
        },
      })
    } else {
      setErreur(result.message)
      setEtape('formulaire')
    }
  }

  return (
    <PublicLayout>
      <PageSEO titleKey="seo.resa_title" descKey="seo.resa_desc" path="/reservation" />

      {/* ── Fond dégradé subtil ── */}
      <div
        className="min-h-screen pt-32 pb-24 px-6 md:px-0"
        style={{ background: 'linear-gradient(to bottom, rgba(132,83,37,0.05) 0%, rgba(250,249,245,0) 100%)' }}
      >

        {/* ── Hero ── */}
        <section className="max-w-screen-xl mx-auto text-center mb-20">
          <h1 className="font-headline text-5xl md:text-7xl mb-6 tracking-tight text-charcoal">
            {t('reservation.hero_titre')}
          </h1>
          <p className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-stone-500 max-w-2xl mx-auto leading-loose">
            {t('reservation.hero_accroche')}
          </p>
        </section>

        {/* ── Formulaire ── */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-white p-8 md:p-20 shadow-[0_20px_40px_rgba(27,28,26,0.04)] relative">

            {/* En-tête formulaire */}
            <div className="mb-16 text-center">
              <span className="font-headline italic text-xl text-primary">
                {t('reservation.titre')}
              </span>
              <div className="w-12 h-px bg-stone-300 mx-auto mt-6" />
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

              {/* Nom */}
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t('reservation.nom')}</label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  placeholder="Karim Benali"
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t('reservation.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="karim@email.com"
                  className={inputClass}
                />
              </div>

              {/* Téléphone */}
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t('reservation.telephone')}</label>
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="+213 (0) ..."
                  className={inputClass}
                />
              </div>

              {/* Date */}
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t('reservation.date')}</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  min={aujourdhui}
                  className={inputClass}
                />
              </div>

              {/* Heure */}
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t('reservation.heure')}</label>
                <select
                  name="heure"
                  value={form.heure}
                  onChange={handleChange}
                  required
                  className={inputClass + ' cursor-pointer'}
                >
                  <option value="">{t('reservation.heure_placeholder')}</option>
                  {creneaux.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Nombre de personnes */}
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t('reservation.nb_personnes')}</label>
                <select
                  name="nb_personnes"
                  value={form.nb_personnes}
                  onChange={handleChange}
                  required
                  className={inputClass + ' cursor-pointer'}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} {n > 1 ? t('reservation.personnes') : t('reservation.personne')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="md:col-span-2 flex flex-col space-y-2 pt-4">
                <label className={labelClass}>
                  {t('reservation.message')}{' '}
                  <span className="text-stone-300 normal-case tracking-normal">
                    {t('reservation.message_label')}
                  </span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t('reservation.message_placeholder')}
                  className={inputClass + ' resize-none'}
                />
              </div>

              {/* Erreur */}
              {erreur && (
                <div className="md:col-span-2">
                  <p className="text-red-600 text-sm text-center font-body">{erreur}</p>
                </div>
              )}

              {/* Submit + note */}
              <div className="md:col-span-2 flex flex-col items-center pt-10 space-y-8">
                <p className="font-label text-[10px] tracking-widest text-stone-400 text-center uppercase">
                  {t('reservation.no_paiement')}
                </p>
                <button
                  type="submit"
                  disabled={etape === 'chargement'}
                  className="bg-primary text-white px-14 py-5 font-label text-[11px] tracking-[0.3em] uppercase hover:bg-primary-container transition-all duration-300 disabled:opacity-50"
                >
                  {etape === 'chargement' ? t('reservation.chargement') : t('reservation.soumettre')}
                </button>
              </div>

            </form>
          </div>
        </section>

        {/* ── Triptyque décoratif ── */}
        <section className="max-w-screen-xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
          <div className="aspect-[4/5] overflow-hidden">
            <img src={IMG1} alt="Art de la table algérien" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-[4/5] overflow-hidden md:mt-12">
            <img src={IMG2} alt="Salle du restaurant" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img src={IMG3} alt="Tajine algérien" className="w-full h-full object-cover" />
          </div>
        </section>

      </div>
    </PublicLayout>
  )
}
