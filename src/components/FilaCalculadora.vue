<template>
  <div class="flex gap-2 mb-2">
    <input v-model="modelo.nombre" placeholder="Descripción" class="bg-white rounded p-1 w-full" />
    <input v-model.number="modelo.monto" type="number" class="bg-white rounded p-1 w-24" />
    <button class="p-1 bg-red-600 text-white rounded-lg" @click="eliminar()">
      <font-awesome-icon icon="fa-solid fa-trash" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '@/models/supabase'
import type { FilaCalculadoraModel } from '../models/NuevoFilaCalculadora.dto'
const emit = defineEmits<{
  (e: 'eliminar'): void
}>()
// defineModel nos da una referencia reactiva al objeto que viene del padre
const modelo = defineModel<Tables<'cal.gasto'>>({ required: true })
const eliminar = () => {
  emit('eliminar')
}
</script>
