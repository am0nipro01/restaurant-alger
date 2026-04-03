import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PublicLayout from '../../components/layout/PublicLayout'

export default function ReservationConfirmation() {
  const { t } = useTranslation()
  const { state } = useLocation()

  if (!state) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{t('confirmation.introuvable')}</p>
            <Link to="/reservation" className="text-sm underline text-gray-500 hover:text-black transition">
              {t('confirmation.lien')}
            </Link>
          </div>
        </div>
      </PublicLayout>
    )
  }

  const { nom, date, heure, nb_personnes } = state

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6">✓</div>
          <h1 className="text-2xl font-semibold mb-3">{t('confirmation.titre')}</h1>
          <p className="text-gray-500 mb-6">
            {t('confirmation.merci')} <strong>{nom}</strong>. {t('confirmation.message', { date, heure, nb: nb_personnes })}
            <br /><br />
            {t('confirmation.email_info')}
          </p>
          <Link
            to="/reservation"
            className="text-sm underline text-gray-400 hover:text-black transition"
          >
            {t('confirmation.nouvelle')}
          </Link>
        </div>
      </div>
    </PublicLayout>
  )
}
