<template>
  <div class="bg-green-100 h-screen p-3">
    <!-- Cambiamos flex-row por grid y definimos 2 columnas -->
    <div class="p-4 bg-green-400 grid grid-cols-2 gap-3 rounded-2xl sticky">
      <!-- Cuadro 1: Salario -->
      <div class="bg-green-300 p-3 rounded-lg">
        <span class="font-bold text-xl block md:inline">Salario:</span>
        <input v-model.number="salario" type="number" class="bg-white rounded p-1 w-full mt-1" />
      </div>

      <!-- Cuadro 2: Gastos Totales -->
      <div class="bg-green-300 p-3 rounded-lg">
        <span class="font-bold text-xl block">Gastos totales:</span>
        <span class="text-2xl">{{ formatCurrency(total) }}</span>
      </div>

      <!-- Cuadro 3: Monto Restante (OCUPA TODO EL ANCHO ABAJO) -->
      <div class="col-span-2 bg-green-200 p-4 rounded-lg shadow-inner">
        <span class="font-bold text-2xl">Monto restante: </span>
        <span class="text-2xl font-mono">{{ formatCurrency(montoRestante) }}</span>
      </div>
    </div>

    <div class="fixed bottom-10 right-10 z-50">
      <button
        class="rounded-full bg-green-900 p-4 shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        @click="agregarFila()"
      >
        <font-awesome-icon icon="fa-solid fa-plus" class="text-white text-xl" />
      </button>
    </div>

    <div class="bg-green-400 rounded-2xl p-3 mt-4">
      <FilaCalculadora v-for="(fila, index) in filas" :key="index" v-model="filas[index]!" />
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
