import type { NuevoPresupuestoDto } from '@/models/NuevoPresupuesto.dto'
import { supabase } from '../lib/supabaseClient'
import type { TablesInsert } from '@/models/supabase'
import type { PresupuestoViewModel } from '@/models/Presupuesto.ViewModel'

export const PresupuestoService = {
  async ver(id: number): Promise<PresupuestoViewModel> {
    const consultaPresupuesto = await supabase
      .from('cal.presupuesto')
      .select('*')
      .eq('id', id)
      .single()

    const consultaGastos = await supabase.from('cal.gasto').select('*').eq('presupuesto_id', id)

    return {
      filas: consultaGastos.data!,
      presupuesto: consultaPresupuesto.data!,
    }
  },
  async eliminar(id: number) {
    await supabase.from('cal.gasto').delete().eq('presupuesto_id', id)
    const { data } = await supabase.from('cal.presupuesto').delete().eq('id', id)
    return data
  },
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
  async guardarPresupuestoCompleto(dto: NuevoPresupuestoDto): Promise<PresupuestoViewModel> {
    const presupuestoGuardar: TablesInsert<'cal.presupuesto'> = {
      nombre: dto.presupuesto,
      descripcion: dto.descripcionPresupuesto,
      salario: dto.salario,
    }
    const nuevoPresupuestoRespuesta = await supabase
      .from('cal.presupuesto')
      .insert(presupuestoGuardar)
      .select('*')
      .single()

    const nuevoPresupuesto = nuevoPresupuestoRespuesta.data

    const filas: TablesInsert<'cal.gasto'>[] = dto.filas.map((x) => ({
      monto: x.monto,
      nombre: x.descripcion,
      presupuesto_id: nuevoPresupuesto?.id!,
    }))

    const nuevasFilas = await supabase.from('cal.gasto').insert(filas).select('*')

    return {
      filas: nuevasFilas.data!,
      presupuesto: nuevoPresupuesto!,
    }
  },
}
