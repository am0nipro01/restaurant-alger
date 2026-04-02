import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout'

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 bg-white">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">
          Alger, Algérie
        </p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-tight">
          Une cuisine algérienne<br />
          <span className="text-gray-400">d'exception</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed">
          Tradition, savoir-faire et générosité — une expérience gastronomique au cœur d'Alger.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/reservation"
            className="bg-black text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gray-800 transition"
          >
            Réserver une table
          </Link>
          <Link
            to="/menu"
            className="border border-gray-200 text-black px-8 py-3.5 rounded-full text-sm font-medium hover:border-black transition"
          >
            Découvrir la carte
          </Link>
        </div>
      </section>

      {/* Section infos rapides */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <p className="text-3xl font-semibold mb-2">30</p>
            <p className="text-sm text-gray-400">Tables disponibles</p>
          </div>
          <div>
            <p className="text-3xl font-semibold mb-2">100%</p>
            <p className="text-sm text-gray-400">Cuisine maison</p>
          </div>
          <div>
            <p className="text-3xl font-semibold mb-2">Mai 2026</p>
            <p className="text-sm text-gray-400">Ouverture</p>
          </div>
        </div>
      </section>

      {/* Section menu aperçu */}
      <section className="py-24 px-4 bg-white text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Notre carte</p>
        <h2 className="text-3xl font-semibold mb-4 tracking-tight">
          Des saveurs authentiques
        </h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-10 leading-relaxed">
          De l'entrée au dessert, chaque plat est préparé avec des produits locaux et des recettes transmises de génération en génération.
        </p>
        <Link
          to="/menu"
          className="border border-black text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
        >
          Voir la carte complète
        </Link>
      </section>

      {/* Section réservation CTA */}
      <section className="bg-black text-white py-24 px-4 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Réservation</p>
        <h2 className="text-3xl font-semibold mb-4 tracking-tight">
          Réservez votre table
        </h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
          Sans acompte, sans paiement en ligne. Règlement sur place uniquement.
        </p>
        <Link
          to="/reservation"
          className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gray-100 transition"
        >
          Faire une réservation
        </Link>
      </section>
    </PublicLayout>
  )
}
