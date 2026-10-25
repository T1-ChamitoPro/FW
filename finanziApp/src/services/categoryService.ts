import { supabase } from '../lib/supabaseClient'
import type { Categoria, TipoTransaccion } from '../types/database'

export const categoryService = {
  async getCategories(tipo?: TipoTransaccion): Promise<Categoria[]> {
    let query = supabase.from('CATEGORIA').select('*')
    if (tipo) {
      query = query.eq('tipo', tipo)
    }
    const { data, error } = await query
    if (error) throw error
    return data || []
  },
}