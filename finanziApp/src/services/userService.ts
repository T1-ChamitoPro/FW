import { supabase } from '../lib/supabaseClient'
import type { Usuario } from '../types/database'

export const userService = {
  async getUserProfile(email: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('USUARIO')
      .select('*')
      .eq('correo', email)
      .maybeSingle()

    if (error) {
      console.error('Error al obtener perfil:', error.message)
      throw error
    }
    return data
  },

  async updateBudgetLimit(userId: number, newLimit: number): Promise<void> {
    const { error } = await supabase
      .from('USUARIO')
      .update({ limite_presupuesto: newLimit })
      .eq('idUsuario', userId)

    if (error) {
      console.error('Error al actualizar límite en Supabase:', error.message)
      throw error
    }
  },
}