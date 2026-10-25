import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'
import type { Usuario } from '../types/database'
import { userService } from '../services/userService'
import { AuthContext } from './AuthContext'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Cargar el perfil de la base de datos (tabla USUARIO)
  const fetchProfile = useCallback(async (userEmail?: string) => {
    if (!userEmail) {
      setProfile(null)
      return
    }

    try {
      const userProfile = await userService.getUserProfile(userEmail)
      setProfile(userProfile)
    } catch (err) {
      console.error('Error al cargar perfil de usuario:', err)
      setProfile(null)
    }
  }, [])

  // Sincronización de sesión y escucha de cambios en Supabase Auth
  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()

        if (!isMounted) return

        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user?.email) {
          await fetchProfile(currentSession.user.email)
        }
      } catch (err) {
        console.error('Error al inicializar sesión:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initAuth()

    // Escuchar cambios de estado (LOGIN, LOGOUT, TOKEN_REFRESHED)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return

      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (currentSession?.user?.email) {
        await fetchProfile(currentSession.user.email)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  // Método manual para refrescar el perfil (p. ej., tras actualizar el límite de presupuesto)
  const refreshProfile = async () => {
    if (user?.email) {
      await fetchProfile(user.email)
    }
  }

  // Cerrar sesión
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}