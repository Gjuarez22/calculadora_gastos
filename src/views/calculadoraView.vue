<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import FilaCalculadora from '../components/FilaCalculadora.vue'
import type { PresupuestoViewModel } from '@/models/Presupuesto.ViewModel' // Asegurado el casing correcto
import Toast from '@/components/Toast.vue'
import type { EditarPesupuestoDto, NuevoPresupuestoDto } from '@/models/NuevoPresupuesto.dto'
import { PresupuestoService } from '@/services/PresupuestoService'
import { CostoService } from '@/services/CostoService'
import { useRoute, useRouter } from 'vue-router'

const routerInst = useRoute()
const rounterInst = useRouter()
onMounted(async () => {
  const id = routerInst.params.id as string
  if (id !== '') {
    const idVer = parseInt(id)
    const presupuestoRes = await PresupuestoService.ver(idVer)

    console.log(presupuestoRes)
    presupuesto.value = presupuestoRes
  }
})
const toastRef = ref<InstanceType<typeof Toast> | null>(null) // 2. Crea la ref para acceder al Toast

//@section: signals
const presupuesto = ref<PresupuestoViewModel>({
  presupuesto: { created_at: '', descripcion: '', id: 0, nombre: '', salario: 0 },
  filas: [],
})
const estaExpandido = ref<boolean>(false)
const cargando = ref(false)

// Nueva señal para controlar cuándo mostrar los errores
const fueEnviado = ref(false)
//@endsection

//@section: Computed
const dtoValido = computed(() => {
  let valido = true

  // Validar nombre
  if (presupuesto.value.presupuesto.nombre.trim().length === 0) {
    valido = false
  }

  // Validar salario
  if (presupuesto.value.presupuesto.salario <= 0) {
    valido = false
  }

  // Validar filas
  if (presupuesto.value.filas.length > 0) {
    presupuesto.value.filas.forEach((x) => {
      if (x.monto <= 0) {
        valido = false
      }
      if (x.nombre.trim().length === 0) {
        valido = false
      }
    })
  } else {
    // Si no hay filas, el DTO tampoco es válido (asumiendo que necesitas al menos 1 gasto)
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
  return (presupuesto?.value?.presupuesto.salario ?? 0) - total.value
})

const filasSonValidas = computed(() => {
  if (presupuesto.value.filas.length === 0) return false
  return presupuesto.value.filas.every((x) => x.monto > 0 && x.nombre.trim().length > 0)
})
//@endsection

//@section: Funciones
const guardarPResupuesto = async () => {
  // Marcamos que se intentó guardar para activar el feedback visual
  fueEnviado.value = true

  // Detener la ejecución si no es válido
  if (!dtoValido.value) {
    return
  }

  cargando.value = true

  try {
    if (presupuesto.value.presupuesto.id == 0) {
      const dtoGuardar: NuevoPresupuestoDto = {
        filas: presupuesto.value.filas.map((x) => ({ descripcion: x.nombre, monto: x.monto })),
        presupuesto: presupuesto.value.presupuesto.nombre,
        salario: presupuesto.value.presupuesto.salario,
        descripcionPresupuesto: presupuesto.value.presupuesto.descripcion ?? undefined,
      }

      const respuesta = await PresupuestoService.guardarPresupuestoCompleto(dtoGuardar)
      presupuesto.value = respuesta
    } else {
      //Se trata de una edicion
      const dtoEditar: EditarPesupuestoDto = {
        filas: presupuesto.value.filas.map((x) => ({
          descripcion: x.nombre,
          monto: x.monto,
          id: x.id,
        })),
        presupuesto: presupuesto.value.presupuesto.nombre,
        salario: presupuesto.value.presupuesto.salario,
        descripcionPresupuesto: presupuesto.value.presupuesto.descripcion ?? undefined,
        id: presupuesto.value.presupuesto.id,
      }

      const respuesta = await PresupuestoService.editarPresupuestoCompleto(dtoEditar)
      presupuesto.value = respuesta
    }
    toastRef.value?.mostrar('Presupuesto guardado correctamente.', 'success')
    fueEnviado.value = false
  } catch (error) {
    console.error('Error al guardar:', error)
    toastRef.value?.mostrar('Error al guardar.', 'error')
  } finally {
    cargando.value = false
  }
}

const agregarFila = () => {
  presupuesto.value.filas.push({
    id: 0,
    created_at: '',
    monto: 0,
    nombre: '',
    presupuesto_id: 0,
  })
}

const eliminarFila = async (index: number) => {
  const costo = presupuesto.value.filas[index]
  try {
    if (costo?.id != 0) {
      await CostoService.eliminarCosto(costo?.id!)
    }
    presupuesto.value.filas.splice(index, 1)
    toastRef.value?.mostrar('Costo eliminado correctamente', 'success')
  } catch (error) {
    toastRef.value?.mostrar('Error al eliminar la fila ', 'error')
  }
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
  <Toast ref="toastRef" />

  <div class="p-4 min-h-screen mb-24 max-w-5xl mx-auto">
    <!-- HEADER: Sticky en móvil (top-0), normal en PC (md:static) -->
    <div
      class="p-4 bg-green-400 grid grid-cols-2 gap-3 rounded-2xl shadow-md sticky top-0 z-40 md:static md:mb-6"
    >
      <div class="flex col-span-2 justify-between mt-3 md:mt-0">
        <button
          class="p-3 rounded-2xl mb-3 text-white flex items-center gap-2 transition-all active:scale-95 bg-gray-600"
          @click="() => rounterInst.push('/presupuesto')"
          :disabled="cargando"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-alt-circle-left" class="text-xl" />
          <span>Atras</span>
        </button>

        <button
          class="p-3 rounded-2xl mb-3 text-white flex items-center gap-2 transition-all active:scale-95"
          :class="[
            cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-800 hover:bg-green-900',
            fueEnviado && !dtoValido
              ? 'opacity-75 bg-red-700 hover:bg-red-800 ring-2 ring-red-400'
              : '',
          ]"
          @click="guardarPResupuesto()"
          :disabled="cargando"
        >
          <font-awesome-icon icon="fa-solid fa-save" class="text-xl" />
          <span>{{ cargando ? 'Guardando...' : 'Guardar' }}</span>
        </button>
      </div>

      <!-- Mensaje general de error -->
      <p
        v-if="fueEnviado && !dtoValido"
        class="col-span-2 text-red-900 font-bold text-sm text-right -mt-4"
      >
        Revisa los campos en rojo antes de guardar.
      </p>

      <!-- Nombre del presupuesto -->
      <div class="col-span-2 bg-green-300 p-3 rounded-lg">
        <label class="font-bold text-xl block md:inline campo-obligatorio">
          Nombre presupuesto:
        </label>
        <input
          v-model="presupuesto.presupuesto.nombre"
          placeholder="Ej: Gastos de Mayo"
          enterkeyhint="next"
          :class="{ 'input-error': fueEnviado && !presupuesto.presupuesto.nombre.trim() }"
          class="bg-white rounded p-2 w-full mt-1 border-none focus:ring-2 focus:ring-green-600 outline-none transition-colors duration-300"
        />
        <p
          v-if="fueEnviado && !presupuesto.presupuesto.nombre.trim()"
          class="text-red-700 text-sm font-bold mt-1"
        >
          El nombre del presupuesto es requerido.
        </p>
      </div>

      <!-- Cuadro 1: Salario -->
      <div class="bg-green-300 p-3 rounded-lg">
        <label class="font-bold text-xl block md:inline campo-obligatorio"> Salario: </label>
        <input
          v-model.number="presupuesto.presupuesto.salario"
          type="number"
          inputmode="decimal"
          enterkeyhint="done"
          :class="{ 'input-error': fueEnviado && presupuesto.presupuesto.salario <= 0 }"
          class="bg-white rounded p-2 w-full mt-1 border-none focus:ring-2 focus:ring-green-600 outline-none transition-colors duration-300"
        />
        <p
          v-if="fueEnviado && presupuesto.presupuesto.salario <= 0"
          class="text-red-700 text-sm font-bold mt-1"
        >
          Ingresa un salario válido.
        </p>
      </div>

      <!-- Cuadro 2: Gastos totales -->
      <div class="bg-green-300 p-3 rounded-lg text-center flex flex-col justify-center">
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

      <!-- Contenedor Principal (Acordeón) -->
      <div class="col-span-2 overflow-hidden">
        <div
          @click="estaExpandido = !estaExpandido"
          class="flex justify-between items-center cursor-pointer p-3 bg-green-300 rounded-t-lg"
        >
          <span class="font-bold text-green-900">Descripción del gasto (Opcional)</span>
          <font-awesome-icon
            icon="fa-solid fa-chevron-down"
            class="transition-transform duration-300"
            :class="estaExpandido ? 'rotate-180' : ''"
          />
        </div>

        <div
          class="grid transition-all duration-500 ease-in-out bg-green-100 rounded-b-lg"
          :class="estaExpandido ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
        >
          <div class="overflow-hidden">
            <div class="p-4">
              <textarea
                class="p-2 w-full bg-white rounded-lg border-none focus:ring-2 focus:ring-green-600 outline-none resize-none"
                rows="3"
                placeholder="Escribe los detalles aquí..."
                v-model="presupuesto.presupuesto.descripcion"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- LISTA DE FILAS -->
    <div
      class="bg-green-400 rounded-2xl p-4 mt-4 md:mt-0"
      :class="{ 'border-2 border-red-500 bg-red-200': fueEnviado && !filasSonValidas }"
    >
      <p v-if="fueEnviado && !filasSonValidas" class="text-red-800 font-bold mb-4 text-center">
        Debes agregar al menos un gasto y rellenar sus campos.
      </p>

      <div class="flex flex-col gap-3">
        <FilaCalculadora
          v-for="(fila, index) in presupuesto.filas"
          :key="index"
          v-model="presupuesto.filas[index]!"
          @eliminar="eliminarFila(index)"
        />
      </div>
    </div>

    <!-- Botón flotante para agregar -->
    <div class="fixed bottom-15 right-8 z-50">
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
@reference "tailwindcss"; /* 👈 Agrega esta línea al principio */

/* Evitar flechas en inputs de número para mayor limpieza */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Clases de validación generadas mediante Tailwind @apply */
.campo-obligatorio::after {
  content: ' *';
  @apply text-red-600 font-bold;
}

.input-error {
  @apply border-2 border-red-500 bg-red-50 focus:ring-red-400;
}
</style>
