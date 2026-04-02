import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'
import pb from '../../lib/pocketbase'

export default function NotreHistoire() {
  const [contenu, setContenu] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await pb.collection('pages_contenu').getFullList({
          filter: '(page = "histoire" || page = "equipe") && langue = "fr"',
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
  }, [])

  const histoire = contenu['histoire']
  const equipe = contenu['equipe']

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-24 text-center border-b border-gray-100 px-4">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Notre histoire</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          {histoire?.titre || 'Notre histoire'}
        </h1>
      </section>

      {/* Contenu Histoire */}
      <section className="max-w-2xl mx-auto px-4 py-20">
        {loading ? (
          <p className="text-gray-400 text-sm text-center">Chargement...</p>
        ) : histoire?.contenu ? (
          <div className="prose prose-gray max-w-none">
            {histoire.contenu.split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-6 text-base">
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center">
            Notre histoire sera bientôt disponible.
          </p>
        )}
      </section>

      {/* Section Équipe */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 text-center">L'équipe</p>
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">
            {equipe?.titre || 'Notre équipe'}
          </h2>
          {equipe?.contenu ? (
            <div>
              {equipe.contenu.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-6 text-base">
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center">
              La présentation de l'équipe sera bientôt disponible.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Venez nous rendre visite</h2>
        <p className="text-gray-400 text-sm mb-8">Réservez votre table dès maintenant.</p>
        <Link
          to="/reservation"
          className="bg-black text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gray-800 transition"
        >
          Réserver une table
        </Link>
      </section>
    </PublicLayout>
  )
}
