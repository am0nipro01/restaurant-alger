import { useState, useEffect } from 'react'
import pb from '../lib/pocketbase'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)

  useEffect(() => {
    // Écoute les changements d'état d'authentification PocketBase
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setIsAuthenticated(pb.authStore.isValid)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      await pb.admins.authWithPassword(email, password)
      return { success: true }
    } catch (error) {
      return { success: false, message: 'Email ou mot de passe incorrect.' }
    }
  }

  const logout = () => {
    pb.authStore.clear()
  }

  return { isAuthenticated, login, logout }
}
