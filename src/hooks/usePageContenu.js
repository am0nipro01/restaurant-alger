import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import pb from '../lib/pocketbase'

// Charge le contenu d'une page depuis PocketBase (pages_contenu)
// Retourne null pendant le chargement, {} si rien en base, { ...data } si trouvé
// — la page publique affiche les i18n tant que null, puis bascule sur PocketBase
export function usePageContenu(page) {
  const { i18n } = useTranslation()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!page) return
    const lang = (i18n.language || 'fr').substring(0, 2)
    setData(null) // reset pendant le chargement

    pb.collection('pages_contenu')
      .getFullList({ filter: `page = "${page}" && langue = "${lang}"` })
      .then((records) => {
        if (records.length > 0 && (records[0].contenu_json || records[0].contenu)) {
          try {
            // contenu_json (champ json natif) en priorité, sinon contenu (legacy editor)
            const raw = records[0].contenu_json || records[0].contenu
            setData(typeof raw === 'string' ? JSON.parse(raw) : raw)
          } catch {
            setData({})
          }
        } else {
          setData({})
        }
      })
      .catch(() => setData({}))
  }, [page, i18n.language])

  return data
}
