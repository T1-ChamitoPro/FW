import { createContext } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import type { Usuario } from '../types/database'

export interface AuthContextType {
  user: User | null
  profile: Usuario | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)