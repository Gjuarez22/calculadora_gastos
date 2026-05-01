<template>
  <div class="flex gap-2 mb-2">
    <input
      v-model="modelo.descripcion"
      placeholder="Descripción"
      class="bg-white rounded p-1 w-full"
    />
    <input v-model.number="modelo.monto" type="number" class="bg-white rounded p-1 w-24" />
  </div>
</template>

<script setup lang="ts">
import type { FilaCalculadoraModel } from '../models/FilaCalculadora.model'

// defineModel nos da una referencia reactiva al objeto que viene del padre
const modelo = defineModel<FilaCalculadoraModel>({ required: true })
</script>
