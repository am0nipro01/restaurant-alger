import { useState, useEffect } from 'react'
import pb from '../lib/pocketbase'

// Cache module-level — chargé une seule fois pour toute la session
let _cache = null
let _promise = null

function fetchContact() {
  if (_cache !== null) return Promise.resolve(_cache)
  if (_promise) return _promise
  _promise = pb.collection('site_config')
    .getFullList({ filter: 'cle = "contact"' })
    .then((records) => {
      if (records.length > 0) {
        const raw = records[0].valeur
        _cache = typeof raw === 'string' ? JSON.parse(raw) : raw
      } else {
        _cache = {}
      }
      return _cache
    })
    .catch(() => {
      _cache = {}
      return _cache
    })
  return _promise
}

// Retourne les infos contact depuis site_config (null pendant le chargement)
export function useSiteConfig() {
  const [config, setConfig] = useState(_cache)

  useEffect(() => {
    if (_cache !== null) return
    fetchContact().then((data) => setConfig(data))
  }, [])

  return config
}
