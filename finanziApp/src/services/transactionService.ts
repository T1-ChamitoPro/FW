import { supabase } from '../lib/supabaseClient'
import type { Transaccion, NuevaTransaccionDTO } from '../types/database'

export const transactionService = {
  async getTransactions(userId: number): Promise<Transaccion[]> {
    if (!userId || typeof userId !== 'number') return []

    // Traemos la relacion asignando explititamente la clave foranea idCategoria
    const { data, error } = await supabase
      .from('TRANSACCION')
      .select('*, categoria:CATEGORIA!fk_transaccion_categoria(*)')
      .eq('idUsuario', userId)
      .order('fecha', { ascending: false })

    if (error) {
      console.error('Error al obtener transacciones:', error.message)
      throw error
    }

    return (data || []) as unknown as Transaccion[]
  },

  async createTransaction(userId: number, payload: NuevaTransaccionDTO): Promise<Transaccion> {
    if (!userId) throw new Error('Usuario no identificado')

    const { data, error } = await supabase
      .from('TRANSACCION')
      .insert([
        {
          monto: payload.monto,
          descripcion: payload.descripcion,
          fecha: payload.fecha,
          idCategoria: payload.idCategoria,
          idUsuario: userId,
        },
      ])
      .select('*, categoria:CATEGORIA!fk_transaccion_categoria(*)')
      .single()

    if (error) {
      console.error('Error al crear transacción:', error.message)
      throw error
    }
    return data as unknown as Transaccion
  },

  async deleteTransaction(transactionId: number): Promise<void> {
    const { error } = await supabase
      .from('TRANSACCION')
      .delete()
      .eq('idTransaccion', transactionId)

    if (error) throw error
  },
}