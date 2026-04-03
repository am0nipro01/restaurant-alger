import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PublicLayout from '../../components/layout/PublicLayout'
import pb from '../../lib/pocketbase'

export default function Contact() {
  const { t, i18n } = useTranslation()
  const [contenu, setContenu] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const charger = async () => {
      setLoading(true)
      try {
        const langue = ['fr', 'en', 'ar'].includes(i18n.language) ? i18n.language : 'fr'
        const data = await pb.collection('pages_contenu').getFullList({
          filter: `page = "contact" && langue = "${langue}"`,
        })
        if (data.length > 0) setContenu(data[0])
        else setContenu(null)
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    charger()
  }, [i18n.language])

  return (
    <PublicLayout>
      <section className="py-24 text-center border-b border-gray-100 px-4">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">{t('contact.label')}</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          {contenu?.titre || t('contact.titre')}
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">{t('contact.sous_titre')}</p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{t('contact.adresse_label')}</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('contact.adresse')}<br />
                <span className="text-gray-400">{t('contact.adresse_info')}</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{t('contact.horaires_label')}</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('contact.horaires')}<br />
                <span className="text-gray-400">{t('contact.horaires_detail')}</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{t('contact.resa_label')}</p>
              <Link to="/reservation" className="inline-block bg-black text-white text-sm px-6 py-2.5 rounded-full hover:bg-gray-800 transition">
                {t('contact.resa_btn')}
              </Link>
            </div>
          </div>

          <div>
            {loading ? (
              <p className="text-gray-400 text-sm">...</p>
            ) : contenu?.contenu ? (
              <div>
                {contenu.contenu.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4 text-sm">{para}</p>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">{t('contact.bientot')}</p>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
