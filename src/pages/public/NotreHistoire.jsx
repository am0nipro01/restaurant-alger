import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PublicLayout from '../../components/layout/PublicLayout'
import pb from '../../lib/pocketbase'

export default function NotreHistoire() {
  const { t, i18n } = useTranslation()
  const [contenu, setContenu] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const charger = async () => {
      setLoading(true)
      try {
        const langue = ['fr', 'en', 'ar'].includes(i18n.language) ? i18n.language : 'fr'
        const data = await pb.collection('pages_contenu').getFullList({
          filter: `(page = "histoire" || page = "equipe") && langue = "${langue}"`,
        })
        const map = {}
        data.forEach((r) => { map[r.page] = r })
        setContenu(map)
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    charger()
  }, [i18n.language])

  const histoire = contenu['histoire']
  const equipe = contenu['equipe']

  return (
    <PublicLayout>
      <section className="py-24 text-center border-b border-gray-100 px-4">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">{t('histoire.label')}</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          {histoire?.titre || t('histoire.label')}
        </h1>
      </section>

      <section className="max-w-2xl mx-auto px-4 py-20">
        {loading ? (
          <p className="text-gray-400 text-sm text-center">...</p>
        ) : histoire?.contenu ? (
          <div>
            {histoire.contenu.split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-6 text-base">{para}</p>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center">{t('histoire.bientot')}</p>
        )}
      </section>

      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 text-center">{t('histoire.equipe_label')}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">
            {equipe?.titre || t('histoire.equipe_label')}
          </h2>
          {equipe?.contenu ? (
            <div>
              {equipe.contenu.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-6 text-base">{para}</p>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center">{t('histoire.equipe_bientot')}</p>
          )}
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">{t('histoire.cta_titre')}</h2>
        <p className="text-gray-400 text-sm mb-8">{t('histoire.cta_texte')}</p>
        <Link to="/reservation" className="bg-black text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gray-800 transition">
          {t('histoire.cta_btn')}
        </Link>
      </section>
    </PublicLayout>
  )
}
