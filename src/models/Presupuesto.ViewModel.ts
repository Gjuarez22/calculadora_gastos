import type { Tables } from './supabase'

export interface PresupuestoViewModel {
  presupuesto: Tables<'cal.presupuesto'>
  filas: Tables<'cal.gasto'>[]
}
