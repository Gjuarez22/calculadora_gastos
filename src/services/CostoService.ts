import { supabase } from '../lib/supabaseClient'

export const CostoService = {
  eliminarCosto: async (idCosto: number) => {
    const { data } = await supabase.from('cal.gasto').delete().eq('id', idCosto)
    return data
  },
}
