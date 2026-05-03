<script setup lang="ts">
import { computed, ref } from 'vue'
import FilaCalculadora from '../components/FilaCalculadora.vue'
import type { PresupuestoViewModel } from '@/models/presupuesto.viewmodel'
import type { NuevoPresupuestoDto } from '@/models/NuevoPresupuesto.dto'
import { PresupuestoService } from '../services/PresupuestoService'
import Spinner from '../components/Spinner.vue'
//@section: signals
// Inicializamos el objeto para evitar errores de "Cannot assign to this expression"
const presupuesto = ref<PresupuestoViewModel>({
  presupuesto: { created_at: '', descripcion: '', id: 0, nombre: '', salario: 0 },
  filas: [],
})
const estaExpandido = ref<boolean>(false)
const cargando = ref(false)
//@endsection

//@section: Computed
const dtoValido = computed(() => {
  let valido = true
  if (presupuesto.value.presupuesto.nombre.trim().length == 0) {
    valido = false
  }

  if (presupuesto.value.presupuesto.salario == 0) {
    valido = false
  }

  if (presupuesto.value.filas.length > 0) {
    presupuesto.value.filas.forEach((x) => {
      if (x.monto == 0) {
        valido = false
        return
      }
      if (x.nombre.trim().length == 0) {
        valido = false
        return
      }
    })
  } else {
    valido = false
  }

  return valido
})
const total = computed<number>(() => {
  return (
    presupuesto.value?.filas.reduce((acumulador, fila) => {
      return acumulador + (fila.monto || 0)
    }, 0) ?? 0
  )
})

const montoRestante = computed<number>(() => {
  // Ahora usamos el salario que está dentro del objeto
  return presupuesto?.value?.presupuesto.salario ?? 0 - total.value
})
//@endsection

//@section: Funciones
const guardarPResupuesto = async () => {
  const dtoGuardar: NuevoPresupuestoDto = {
    filas: presupuesto.value.filas.map((x) => ({ descripcion: x.nombre, monto: x.monto })),
    presupuesto: presupuesto.value.presupuesto.nombre,
    salario: presupuesto.value.presupuesto.salario,
    descripcionPresupuesto: presupuesto.value.presupuesto.descripcion ?? undefined,
  }

  const respuesta = await PresupuestoService.guardarPresupuestoCompleto(dtoGuardar)
  presupuesto.value = respuesta
}
const agregarFila = () => {
  presupuesto?.value.filas.push({
    id: 0,
    created_at: '',
    monto: 0,
    nombre: '',
    presupuesto_id: 0,
  })
}
const eliminarFila = (index: number) => {
  presupuesto.value.filas.splice(index, 1)
}
const formatCurrency = (valor: number) => {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
  }).format(valor)
}
//@endsection
</script>

<template>
  <div class="p-4 min-h-screen">
    <!-- Header de la calculadora -->
    <div class="p-4 bg-green-400 grid grid-cols-2 gap-3 rounded-2xl sticky top-0 z-30 shadow-md">
      <!-- Nombre del presupuesto -->
      <div class="col-span-2 bg-green-300 p-3 rounded-lg">
        <span class="font-bold text-xl block md:inline campo-obligatorio"
          >Nombre presupuesto:
        </span>
        <input
          v-model="presupuesto.presupuesto.nombre"
          placeholder="Ej: Gastos de Mayo"
          class="bg-white rounded p-1 w-full mt-1 border-none focus:ring-2 focus:ring-green-600 outline-none"
        />
      </div>

      <!-- Cuadro 1: Salario -->
      <div class="bg-green-300 p-3 rounded-lg">
        <span class="font-bold text-xl block md:inline campo-obligatorio">Salario:</span>
        <input
          v-model.number="presupuesto.presupuesto.salario"
          type="number"
          class="bg-white rounded p-1 w-full mt-1 border-none focus:ring-2 focus:ring-green-600 outline-none"
        />
      </div>

      <!-- Cuadro 2: Gastos totales -->
      <div class="bg-green-300 p-3 rounded-lg text-center">
        <span class="font-bold text-xl block">Gastos:</span>
        <span class="text-2xl font-mono">{{ formatCurrency(total) }}</span>
      </div>

      <!-- Cuadro 3: Monto restante -->
      <div
        class="col-span-2 p-4 rounded-lg transition-colors duration-300"
        :class="montoRestante < 0 ? 'bg-red-400' : 'bg-green-500'"
      >
        <span class="font-bold text-2xl">Monto restante: </span>
        <span class="text-2xl font-mono">{{ formatCurrency(montoRestante) }}</span>
      </div>
      <!-- Contenedor Principal -->
      <div class="col-span-2 overflow-hidden">
        <!-- Disparador (Click aquí para abrir/cerrar) -->
        <div
          @click="estaExpandido = !estaExpandido"
          class="flex justify-between items-center cursor-pointer p-3 bg-green-300 rounded-t-lg"
        >
          <span class="font-bold text-green-900">Descripción del gasto</span>
          <font-awesome-icon
            icon="fa-solid fa-chevron-down"
            class="transition-transform duration-300"
            :class="estaExpandido ? 'rotate-180' : ''"
          />
        </div>

        <!-- Contenedor Animado -->
        <!-- El secreto está en el grid-rows y el duration-500 -->
        <div
          class="grid transition-all duration-500 ease-in-out bg-green-100 rounded-b-lg"
          :class="estaExpandido ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
        >
          <div class="overflow-hidden">
            <!-- El contenido que se expande -->
            <div class="p-4">
              <textarea
                class="p-2 w-full bg-white rounded-lg border-none focus:ring-2 focus:ring-green-600 outline-none resize-none"
                rows="3"
                placeholder="Escribe los detalles aquí..."
                v-model="presupuesto.presupuesto.descripcion"
              ></textarea>

              <div class="grid justify-items-center mt-3">
                <button
                  class="bg-green-800 hover:bg-green-900 p-3 rounded-2xl disabled:cursor-not-allowed text-white flex items-center gap-2 transition-all active:scale-95"
                  @click="guardarPResupuesto()"
                  v-if="!cargando"
                  :disabled="cargando || !dtoValido"
                >
                  <font-awesome-icon icon="fa-solid fa-save" class="text-xl" />
                  <span>Guardar</span>
                </button>
                <Spinner v-if="cargando" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- LISTA DE FILAS -->
    <div class="bg-green-400 rounded-2xl p-3 mt-4 mb-24">
      <FilaCalculadora
        v-for="(fila, index) in presupuesto.filas"
        :key="index"
        v-model="presupuesto.filas[index]!"
        @eliminar="eliminarFila(index)"
      />
    </div>

    <!-- Botón flotante para agregar -->
    <div class="fixed bottom-18 right-10 z-50">
      <button
        @click="agregarFila"
        class="rounded-full bg-green-900 w-16 h-16 shadow-2xl transition-transform active:scale-95 hover:scale-110 flex items-center justify-center"
      >
        <font-awesome-icon icon="fa-solid fa-plus" class="text-white text-2xl" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Evitar flechas en inputs de número para mayor limpieza */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
