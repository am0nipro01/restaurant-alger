import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useSiteConfig } from '../../hooks/useSiteConfig'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://algiersgastronomy.dz'

// Langue i18next → locale Open Graph
const OG_LOCALE = { fr: 'fr_FR', en: 'en_US', ar: 'ar_DZ' }
// Langue → code hreflang
const HREFLANG  = { fr: 'fr', en: 'en', ar: 'ar' }

const PAGES = ['', 'menu', 'notre-histoire', 'contact', 'reservation']

export default function PageSEO({ titleKey, descKey, path = '/', ogImage }) {
  const { t, i18n } = useTranslation()
  const config = useSiteConfig()

  const lang      = i18n.language || 'fr'
  const siteName  = config?.nom || t('seo.site_name')
  const pageTitle = t(titleKey)
  const fullTitle = `${pageTitle} | ${siteName}`
  const desc      = t(descKey)
  const canonical = `${SITE_URL}${path}`
  const image     = ogImage || `${SITE_URL}/og-image.jpg`

  return (
    <Helmet>
      <html lang={HREFLANG[lang] || lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={siteName} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:image"       content={image} />
      <meta property="og:locale"      content={OG_LOCALE[lang] || 'fr_FR'} />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image"       content={image} />

      {/* hreflang — toutes les langues du site */}
      {PAGES.map((p) => (
        ['fr', 'en', 'ar'].map((l) => (
          <link
            key={`${l}-${p}`}
            rel="alternate"
            hrefLang={l}
            href={`${SITE_URL}${p ? '/' + p : '/'}`}
          />
        ))
      ))}
      <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
    </Helmet>
  )
}
