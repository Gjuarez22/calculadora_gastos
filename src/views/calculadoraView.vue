<template>
  <div class="bg-green-100 min-h-screen p-3">
    <div class="p-4 bg-green-400 grid grid-cols-2 gap-3 rounded-2xl sticky top-0 z-30 shadow-md">
      <!-- Cuadro 1: Salario -->
      <div class="bg-green-300 p-3 rounded-lg">
        <span class="font-bold text-xl block md:inline">Salario:</span>
        <input v-model.number="salario" type="number" class="bg-white rounded p-1 w-full mt-1" />
      </div>

      <!-- Cuadro 2: Gastos totales -->
      <div class="bg-green-300 p-3 rounded-lg">
        <span class="font-bold text-xl block">Gastos totales:</span>
        <span class="text-2xl">{{ formatCurrency(total) }}</span>
      </div>

      <!-- Cuadro 3: Monto restante -->
      <div class="col-span-2 bg-green-500 p-4 rounded-lg">
        <span class="font-bold text-2xl">Monto restante: </span>
        <span class="text-2xl">{{ formatCurrency(montoRestante) }}</span>
      </div>
    </div>

    <!-- LISTA DE FILAS (Esta es la que se deslizará) -->
    <div class="bg-green-400 rounded-2xl p-3 mt-4">
      <FilaCalculadora v-for="(fila, index) in filas" :key="index" v-model="filas[index]!" />
    </div>

    <!-- Botón flotante para agregar -->
    <div class="fixed bottom-20 right-10 z-50">
      <button
        @click="agregarFila"
        class="rounded-full bg-green-900 p-4 shadow-lg transition-transform hover:scale-110"
      >
        <font-awesome-icon icon="fa-solid fa-plus" class="text-white text-xl" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FilaCalculadoraModel } from '../models/FilaCalculadora.model'
import { computed, ref } from 'vue'
import FilaCalculadora from '../components/FilaCalculadora.vue'

//@section: signals
const filas = ref<FilaCalculadoraModel[]>([{ descripcion: 'Ejemplo', monto: 0 }])
const salario = ref<number>(0)
//@endsection

//@section:Computed

const total = computed<number>(() => {
  return filas.value.reduce((acumulador, fila) => {
    acumulador += fila.monto
    return acumulador
  }, 0)
})
const montoRestante = computed<number>(() => {
  return salario.value - total.value
})
//@endsection
//@section:Funciones
const agregarFila = () => {
  filas.value.push({ descripcion: '', monto: 0 })
}
//@endsection

const formatCurrency = (valor: number) => {
  return new Intl.NumberFormat('es-SV', {
    // Cambia 'es-SV' por tu región
    style: 'currency',
    currency: 'USD',
  }).format(valor)
}
</script>
<style lang=""></style>
