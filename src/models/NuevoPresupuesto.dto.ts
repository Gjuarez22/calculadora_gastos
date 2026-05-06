import type { FilaCalculadoraModel } from './NuevoFilaCalculadora.dto'
import type { TablesInsert } from './supabase'

export interface NuevoPresupuestoDto {
  presupuesto: string
  descripcionPresupuesto?: string
  salario: number
  filas: FilaCalculadoraModel[]
}

export interface EditarPesupuestoDto extends NuevoPresupuestoDto {
  id: number
}
