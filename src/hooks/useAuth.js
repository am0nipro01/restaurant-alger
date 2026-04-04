import { useState, useEffect } from 'react'
import pb from '../lib/pocketbase'

function getRoleFromStore() {
  if (!pb.authStore.isValid) return null
  // Les managers (collection 'managers') ont un collectionName
  // Les superadmins PocketBase n'en ont pas
  return pb.authStore.model?.collectionName === 'managers' ? 'manager' : 'admin'
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [user, setUser]                       = useState(pb.authStore.model)
  const [role, setRole]                       = useState(getRoleFromStore)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setIsAuthenticated(pb.authStore.isValid)
      setUser(pb.authStore.model)
      setRole(getRoleFromStore())
    })
    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    // 1. Essai en tant que superadmin PocketBase
    try {
      await pb.admins.authWithPassword(email, password)
      return { success: true }
    } catch {
      // 2. Essai en tant que manager
      try {
        await pb.collection('managers').authWithPassword(email, password)
        return { success: true }
      } catch {
        return { success: false, message: 'Email ou mot de passe incorrect.' }
      }
    }
  }

  const logout = () => {
    pb.authStore.clear()
  }

  return { isAuthenticated, login, logout, user, role }
}
