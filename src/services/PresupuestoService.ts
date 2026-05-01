import { supabase } from '../lib/supabaseClient'

export const gastosService = {
  // Traer todos los gastos
  async getAll() {
    const { data, error } = await supabase
      .from('cal.presupuesto')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Guardar o actualizar (Upsert)
  /*async saveMany(filas: FilaCalculadoraModel[]) {
    const { data, error } = await supabase
      .from('cal.presupuesto')
      .upsert(filas) 
    
    if (error) throw error
    return data
  }*/
}