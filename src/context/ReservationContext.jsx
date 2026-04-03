import { createContext, useContext, useState, useEffect } from 'react'
import pb from '../lib/pocketbase'

const ReservationContext = createContext({ enAttenteCount: 0, rafraichirCount: () => {} })

export function ReservationProvider({ children }) {
  const [enAttenteCount, setEnAttenteCount] = useState(0)

  const fetchCount = async () => {
    if (!pb.authStore.isValid) return
    try {
      const res = await pb.collection('reservations').getList(1, 1, {
        filter: "statut = 'en_attente'",
      })
      setEnAttenteCount(res.totalItems)
    } catch (_) {}
  }

  useEffect(() => {
    // Fetch immédiat au montage
    fetchCount()

    // Polling toutes les 60s
    const interval = setInterval(fetchCount, 60000)

    // Re-fetch automatique après login / logout
    const unsubscribe = pb.authStore.onChange(() => {
      fetchCount()
    })

    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ReservationContext.Provider value={{ enAttenteCount, rafraichirCount: fetchCount }}>
      {children}
    </ReservationContext.Provider>
  )
}

export function useReservationContext() {
  return useContext(ReservationContext)
}
