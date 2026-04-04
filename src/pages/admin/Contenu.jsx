import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import pb from '../../lib/pocketbase'

// ── Config ──────────────────────────────────────────────────────────────────

const LANGUES = [
  { code: 'fr', label: 'FR', dir: 'ltr' },
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'ar', label: 'AR', dir: 'rtl' },
]

const SECTIONS = [
  { key: 'hero',       label: 'Hero' },
  { key: 'editorial',  label: 'Éditoriale' },
  { key: 'equipe',     label: 'Équipe' },
  { key: 'cta',        label: 'CTA' },
]

const EMPTY_DATA = {
  hero_label: '', hero_titre: '',
  intro_citation: '', intro_p1: '', intro_p2: '',
  modernite_titre: '', modernite_p1: '', modernite_p2: '',
  collectif_label: '', collectif_titre: '', collectif_desc: '',
  membres: [],
  cta_titre: '', cta_desc: '', cta_btn: '',
}

// ── Styles ───────────────────────────────────────────────────────────────────

const inputSm  = 'w-full bg-transparent border-0 border-b border-stone-200 py-3 font-body text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-stone-300 text-charcoal'
const inputLg  = 'w-full bg-transparent border-0 border-b border-stone-200 py-3 font-headline text-3xl focus:outline-none focus:border-primary transition-colors placeholder:text-stone-200 text-charcoal'
const inputMd  = 'w-full bg-transparent border-0 border-b border-stone-200 py-3 font-headline text-2xl focus:outline-none focus:border-primary transition-colors placeholder:text-stone-200 text-charcoal'
const textarea = 'w-full bg-transparent border border-stone-200 p-4 font-body text-sm leading-relaxed focus:outline-none focus:border-primary transition-colors text-stone-700 resize-none'
const labelCls = 'block font-label text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2'

// ── Composants helpers ────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <div className="border-b border-stone-100 pb-4 mb-2">
      <h3 className="font-headline text-xl text-charcoal">{children}</h3>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-[11px] text-stone-300 italic mt-1">{hint}</p>}
    </div>
  )
}

// ── Page principale ──────────────────────────────────────────────────────────

export default function Contenu() {
  const [data, setData]       = useState({
    fr: { ...EMPTY_DATA },
    en: { ...EMPTY_DATA },
    ar: { ...EMPTY_DATA },
  })
  const [ids, setIds]         = useState({ fr: null, en: null, ar: null })
  const [langue, setLangue]   = useState('fr')
  const [section, setSection] = useState('hero')
  const [loading, setLoading] = useState(true)
  const [statut, setStatut]   = useState(null) // null | 'ok' | 'erreur'

  // ── Chargement initial (les 3 langues)
  useEffect(() => {
    const charger = async () => {
      setLoading(true)
      try {
        const records = await pb.collection('pages_contenu').getFullList({
          filter: 'page = "histoire"',
        })
        const newData = {
          fr: { ...EMPTY_DATA },
          en: { ...EMPTY_DATA },
          ar: { ...EMPTY_DATA },
        }
        const newIds = { fr: null, en: null, ar: null }

        records.forEach((r) => {
          if (!['fr', 'en', 'ar'].includes(r.langue)) return
          newIds[r.langue] = r.id
          try {
            // contenu_json (natif json) en priorité, sinon legacy contenu (editor)
            const raw = r.contenu_json || r.contenu
            const parsed = typeof raw === 'string' ? JSON.parse(raw) : (raw || {})
            newData[r.langue] = { ...EMPTY_DATA, ...parsed }
          } catch {
            // garde les valeurs vides
          }
        })

        setData(newData)
        setIds(newIds)
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    charger()
  }, [])

  // ── Helpers mutation
  const setField = (field, value) => {
    setData((prev) => ({
      ...prev,
      [langue]: { ...prev[langue], [field]: value },
    }))
  }

  const setMembre = (index, field, value) => {
    const membres = [...(data[langue].membres || [])]
    membres[index] = { ...membres[index], [field]: value }
    setField('membres', membres)
  }

  const addMembre = () => {
    setField('membres', [...(data[langue].membres || []), { nom: '', role: '', bio: '' }])
  }

  const removeMembre = (index) => {
    setField('membres', (data[langue].membres || []).filter((_, i) => i !== index))
  }

  // ── Sauvegarde (langue courante seulement)
  const sauvegarder = async () => {
    setStatut(null)
    try {
      const contenu_json = data[langue]
      if (ids[langue]) {
        await pb.collection('pages_contenu').update(ids[langue], { contenu_json })
      } else {
        const record = await pb.collection('pages_contenu').create({
          page: 'histoire',
          langue,
          contenu_json,
        })
        setIds((prev) => ({ ...prev, [langue]: record.id }))
      }
      setStatut('ok')
      setTimeout(() => setStatut(null), 3000)
    } catch (e) {
      console.error(e)
      setStatut('erreur')
    }
  }

  const d   = data[langue]
  const dir = langue === 'ar' ? 'rtl' : 'ltr'

  return (
    <AdminLayout>

      {/* ── Header ── */}
      <header className="mb-12 max-w-5xl">
        <div className="flex justify-between items-end border-b border-stone-100 pb-8">
          <div>
            <h2 className="font-headline text-4xl text-charcoal tracking-tight">Notre Histoire</h2>
            <p className="text-stone-400 mt-2 font-body text-sm italic">
              Contenu éditorial de la page publique · langue active : <strong className="uppercase">{langue}</strong>
            </p>
          </div>
          <div className="flex items-center gap-5">
            {statut === 'ok' && (
              <span className="text-xs text-green-600 tracking-wider uppercase">✓ Enregistré</span>
            )}
            {statut === 'erreur' && (
              <span className="text-xs text-red-500 tracking-wider uppercase">Erreur</span>
            )}
            <button
              onClick={sauvegarder}
              className="bg-primary px-10 py-4 text-white font-body text-xs tracking-[0.2em] uppercase hover:bg-primary-container transition-colors duration-300"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="text-stone-400 text-sm tracking-widest uppercase text-center py-24">
          Chargement…
        </div>
      ) : (
        <div className="max-w-5xl grid grid-cols-12 gap-12">

          {/* ── Sidebar gauche ── */}
          <div className="col-span-3 space-y-10">

            {/* Langue */}
            <section>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-primary font-bold mb-5">
                Langue
              </p>
              <div className="flex gap-2">
                {LANGUES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLangue(l.code)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide border transition-all ${
                      langue === l.code
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-stone-200 text-stone-400 hover:border-stone-400 hover:text-charcoal'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Sections */}
            <section>
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-primary font-bold mb-5">
                Section
              </p>
              <div className="space-y-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSection(s.key)}
                    className={`w-full text-left font-body text-sm py-2 px-3 transition-colors ${
                      section === s.key
                        ? 'bg-primary/5 text-primary font-medium'
                        : 'text-stone-400 hover:text-charcoal hover:bg-stone-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Conseil contextuel */}
            <section className="pt-2">
              <div className="bg-[#f4f4f0] p-5 space-y-3">
                <h4 className="font-headline text-sm italic text-stone-500">Conseil</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {langue === 'ar'
                    ? 'Vérifiez la mise en page RTL sur la page publique après enregistrement.'
                    : 'Les champs vides affichent le texte par défaut en ' + (langue === 'fr' ? 'français' : 'anglais') + '.'}
                </p>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Chaque langue se sauvegarde indépendamment.
                </p>
              </div>
            </section>

          </div>

          {/* ── Éditeur principal ── */}
          <div className="col-span-9">
            <div className="bg-white p-10 space-y-10" dir={dir}>

              {/* ─────────── HERO ─────────── */}
              {section === 'hero' && (
                <>
                  <SectionTitle>Hero</SectionTitle>

                  <Field
                    label="Label / Chapeau"
                    hint="Texte affiché au-dessus du titre en petites majuscules espacées."
                  >
                    <input
                      type="text"
                      className={inputSm}
                      value={d.hero_label}
                      onChange={(e) => setField('hero_label', e.target.value)}
                      placeholder="ex : Héritage Culinaire"
                      dir={dir}
                    />
                  </Field>

                  <Field label="Titre principal">
                    <input
                      type="text"
                      className={inputLg}
                      value={d.hero_titre}
                      onChange={(e) => setField('hero_titre', e.target.value)}
                      placeholder="ex : Notre Histoire"
                      dir={dir}
                    />
                  </Field>
                </>
              )}

              {/* ─────────── ÉDITORIALE ─────────── */}
              {section === 'editorial' && (
                <>
                  <SectionTitle>Section Éditoriale</SectionTitle>

                  <Field
                    label="Citation d'introduction"
                    hint="Affichée en grande typographie à gauche de la section."
                  >
                    <textarea
                      rows={3}
                      className={textarea}
                      value={d.intro_citation}
                      onChange={(e) => setField('intro_citation', e.target.value)}
                      placeholder='ex : « Une cuisine qui se souvient… »'
                      dir={dir}
                    />
                  </Field>

                  <Field label="Paragraphe 1">
                    <textarea
                      rows={4}
                      className={textarea}
                      value={d.intro_p1}
                      onChange={(e) => setField('intro_p1', e.target.value)}
                      dir={dir}
                    />
                  </Field>

                  <Field label="Paragraphe 2">
                    <textarea
                      rows={4}
                      className={textarea}
                      value={d.intro_p2}
                      onChange={(e) => setField('intro_p2', e.target.value)}
                      dir={dir}
                    />
                  </Field>

                  <div className="border-t border-stone-100 pt-6">
                    <p className="font-label text-[10px] tracking-widest uppercase text-stone-300 mb-6">
                      Sous-section Modernité
                    </p>
                  </div>

                  <Field label="Titre de la sous-section">
                    <input
                      type="text"
                      className={inputSm}
                      value={d.modernite_titre}
                      onChange={(e) => setField('modernite_titre', e.target.value)}
                      placeholder="ex : L'Essence de la Modernité"
                      dir={dir}
                    />
                  </Field>

                  <Field label="Paragraphe 1">
                    <textarea
                      rows={4}
                      className={textarea}
                      value={d.modernite_p1}
                      onChange={(e) => setField('modernite_p1', e.target.value)}
                      dir={dir}
                    />
                  </Field>

                  <Field label="Paragraphe 2">
                    <textarea
                      rows={4}
                      className={textarea}
                      value={d.modernite_p2}
                      onChange={(e) => setField('modernite_p2', e.target.value)}
                      dir={dir}
                    />
                  </Field>
                </>
              )}

              {/* ─────────── ÉQUIPE ─────────── */}
              {section === 'equipe' && (
                <>
                  <SectionTitle>L'Équipe</SectionTitle>

                  <div className="grid grid-cols-2 gap-6">
                    <Field label="Label / Chapeau">
                      <input
                        type="text"
                        className={inputSm}
                        value={d.collectif_label}
                        onChange={(e) => setField('collectif_label', e.target.value)}
                        placeholder="ex : Le Collectif"
                        dir={dir}
                      />
                    </Field>
                    <Field label="Titre de la section">
                      <input
                        type="text"
                        className={inputSm}
                        value={d.collectif_titre}
                        onChange={(e) => setField('collectif_titre', e.target.value)}
                        placeholder="ex : Nos Artisans"
                        dir={dir}
                      />
                    </Field>
                  </div>

                  <Field label="Description de l'équipe">
                    <textarea
                      rows={3}
                      className={textarea}
                      value={d.collectif_desc}
                      onChange={(e) => setField('collectif_desc', e.target.value)}
                      dir={dir}
                    />
                  </Field>

                  {/* ── Liste des membres ── */}
                  <div className="border-t border-stone-100 pt-8 space-y-8">
                    <div className="flex items-center justify-between">
                      <p className="font-label text-[10px] tracking-widest uppercase text-stone-400">
                        Membres ({(d.membres || []).length})
                      </p>
                      <button
                        type="button"
                        onClick={addMembre}
                        className="text-xs font-bold tracking-widest uppercase text-primary hover:text-primary-container border border-primary hover:border-primary-container px-4 py-2 transition-colors"
                      >
                        + Ajouter un membre
                      </button>
                    </div>

                    {(d.membres || []).length === 0 && (
                      <p className="text-sm text-stone-300 italic text-center py-8 border border-dashed border-stone-200">
                        Aucun membre renseigné — le site affichera l'équipe par défaut.
                      </p>
                    )}

                    {(d.membres || []).map((m, i) => (
                      <div key={i} className="bg-stone-50 p-6 space-y-5">
                        <div className="flex items-center justify-between">
                          <span className="font-label text-[10px] tracking-widest uppercase text-stone-400">
                            Membre {i + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMembre(i)}
                            className="text-[10px] tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            <label className={labelCls}>Nom</label>
                            <input
                              type="text"
                              className={inputSm}
                              value={m.nom}
                              onChange={(e) => setMembre(i, 'nom', e.target.value)}
                              placeholder="Prénom Nom"
                              dir={dir}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Rôle / Titre</label>
                            <input
                              type="text"
                              className={inputSm}
                              value={m.role}
                              onChange={(e) => setMembre(i, 'role', e.target.value)}
                              placeholder="Chef de Cuisine"
                              dir={dir}
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Courte biographie</label>
                          <textarea
                            rows={3}
                            className={textarea}
                            value={m.bio}
                            onChange={(e) => setMembre(i, 'bio', e.target.value)}
                            dir={dir}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ─────────── CTA ─────────── */}
              {section === 'cta' && (
                <>
                  <SectionTitle>Appel à l'Action (CTA)</SectionTitle>

                  <Field label="Titre">
                    <input
                      type="text"
                      className={inputMd}
                      value={d.cta_titre}
                      onChange={(e) => setField('cta_titre', e.target.value)}
                      placeholder="ex : Rejoignez-nous à table"
                      dir={dir}
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      rows={3}
                      className={textarea}
                      value={d.cta_desc}
                      onChange={(e) => setField('cta_desc', e.target.value)}
                      dir={dir}
                    />
                  </Field>

                  <Field
                    label="Texte du bouton de réservation"
                    hint="Affiché sur le bouton qui mène vers /reservation."
                  >
                    <input
                      type="text"
                      className={inputSm}
                      value={d.cta_btn}
                      onChange={(e) => setField('cta_btn', e.target.value)}
                      placeholder="ex : Réserver une Table"
                      dir={dir}
                    />
                  </Field>
                </>
              )}

            </div>
          </div>

        </div>
      )}

      {/* Accent décoratif */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-screen bg-[#efeeea]/50 pointer-events-none" />

    </AdminLayout>
  )
}
