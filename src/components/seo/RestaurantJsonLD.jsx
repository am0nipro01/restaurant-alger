import { Helmet } from 'react-helmet-async'
import { useSiteConfig } from '../../hooks/useSiteConfig'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://algiersgastronomy.dz'

// Convertit les horaires PocketBase en OpeningHoursSpecification Schema.org
// Format PocketBase : { lundi: { ouvert: true, debut: "12:00", fin: "23:00" }, ... }
function buildOpeningHours(horaires) {
  if (!horaires) return []
  const DAYS = {
    lundi: 'Monday', mardi: 'Tuesday', mercredi: 'Wednesday',
    jeudi: 'Thursday', vendredi: 'Friday', samedi: 'Saturday', dimanche: 'Sunday',
  }
  return Object.entries(horaires)
    .filter(([, v]) => v?.ouvert)
    .map(([day, v]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${DAYS[day]}`,
      opens:  v.debut || '12:00',
      closes: v.fin   || '23:00',
    }))
}

export default function RestaurantJsonLD() {
  const config = useSiteConfig()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name:         config?.nom         || 'Algiers Gastronomy',
    description:  'Restaurant gastronomique algérien — cuisine traditionnelle réinventée.',
    url:          SITE_URL,
    telephone:    config?.telephone   || undefined,
    servesCuisine: 'Algerian',
    priceRange:   '€€€',
    currenciesAccepted: 'DZD',
    paymentAccepted: 'Cash',
    hasMap: config?.google_maps       || undefined,
    address: {
      '@type':           'PostalAddress',
      streetAddress:     config?.adresse || undefined,
      addressLocality:   config?.ville   || 'Alger',
      addressCountry:    'DZ',
    },
    openingHoursSpecification: buildOpeningHours(config?.horaires),
    reservations: 'Required',
    menu: `${SITE_URL}/menu`,
    acceptsReservations: true,
  }

  // Supprimer les champs undefined pour un JSON propre
  const clean = JSON.parse(JSON.stringify(schema))

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(clean, null, 2)}</script>
    </Helmet>
  )
}
