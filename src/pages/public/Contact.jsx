import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'
import pb from '../../lib/pocketbase'

export default function Contact() {
  const [contenu, setContenu] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const charger = async () => {
      try {
        const data = await pb.collection('pages_contenu').getFullList({
          filter: 'page = "contact" && langue = "fr"',
        })
        if (data.length > 0) setContenu(data[0])
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    charger()
  }, [])

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-24 text-center border-b border-gray-100 px-4">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Contact</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          {contenu?.titre || 'Nous contacter'}
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Pour toute question, n'hésitez pas à nous écrire ou à passer nous voir.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Informations */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Adresse</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Alger, Algérie<br />
                <span className="text-gray-400">(adresse à confirmer)</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Horaires</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Midi et soir<br />
                <span className="text-gray-400">12h00 — 23h00</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Réservation</p>
              <Link
                to="/reservation"
                className="inline-block bg-black text-white text-sm px-6 py-2.5 rounded-full hover:bg-gray-800 transition"
              >
                Réserver en ligne
              </Link>
            </div>
          </div>

          {/* Contenu éditable */}
          <div>
            {loading ? (
              <p className="text-gray-400 text-sm">Chargement...</p>
            ) : contenu?.contenu ? (
              <div>
                {contenu.contenu.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4 text-sm">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Les informations de contact seront bientôt disponibles.
              </p>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
