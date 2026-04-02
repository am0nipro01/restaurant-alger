import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">

        {/* Identité */}
        <div>
          <p className="font-semibold text-base mb-2">Restaurant Alger</p>
          <p className="text-sm text-gray-400">Cuisine algérienne traditionnelle et gastronomique</p>
          <p className="text-sm text-gray-400 mt-1">Alger, Algérie</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Navigation</p>
          <Link to="/" className="text-sm text-gray-400 hover:text-black transition">Accueil</Link>
          <Link to="/menu" className="text-sm text-gray-400 hover:text-black transition">Notre carte</Link>
          <Link to="/notre-histoire" className="text-sm text-gray-400 hover:text-black transition">Notre histoire</Link>
          <Link to="/contact" className="text-sm text-gray-400 hover:text-black transition">Contact</Link>
        </div>

        {/* Réservation */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Réservation</p>
          <p className="text-sm text-gray-400">Sans acompte, règlement sur place</p>
          <Link
            to="/reservation"
            className="mt-2 bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition inline-block text-center"
          >
            Réserver une table
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-300 text-center">
          © {new Date().getFullYear()} Restaurant Alger. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
