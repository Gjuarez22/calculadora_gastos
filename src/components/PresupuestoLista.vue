<template>
  <div class="bg-green-100 p-5 h-[calc(100vh-80px)] flex flex-col">
    <label class="font-bold text-2xl mb-4 shrink-0">Presupuestos ingresados</label>

    <div class="bg-green-600 rounded-2xl flex-1 overflow-y-auto p-4">
      <div
        v-for="pre in presupuestos"
        :key="pre.id"
        class="flex justify-between bg-white p-3 mb-2 rounded shadow transition-transform active:scale-95 hover:scale-105 cursor-pointer"
      >
        <span> {{ pre.nombre }}</span>
        <button
          class="p-3 bg-red-600 text-white rounded-lg transition-transform active:scale-95 hover:scale-105"
          @click="eliminar(pre)"
        >
          <font-awesome-icon icon="fa-solid fa-trash" />
        </button>
      </div>
    </div>
  </div>
  <Modal ref="modalRef" :show="mostrarModal" :size="'sm'" :titulo="'Eliminar Registro?'">
    <div class="flex justify-between">
      <button
        @click="cerrarModal"
        class="px-4 py-2 bg-gray-300 rounded-lg font-bold disabled:cursor-not-allowed"
        :disabled="cargando"
      >
        <label for="" v-if="!cargando">Cancelar</label>
        <Spinner v-if="cargando" />
      </button>
      <button
        class="px-4 py-2 bg-green-600 text-white rounded-lg font-bold disabled:cursor-not-allowed"
        :disabled="cargando"
        @click="RealizarEliminacion"
      >
        <label for="" v-if="!cargando">Aceptar</label>
        <Spinner v-if="cargando" />
      </button>
    </div>
  </Modal>
  <Toast ref="toastRef" />
</template>
<script setup lang="ts">
import type { Tables } from '@/models/supabase'
import { onMounted, ref } from 'vue'
import { PresupuestoService } from '../services/PresupuestoService'
import Modal from '@/components/Modal.vue'
import Toast from './Toast.vue'
import Spinner from '@/components/Spinner.vue'
const toastRef = ref<InstanceType<typeof Toast> | null>(null) // 2. Crea la ref para acceder al Toast

const mostrarModal = ref(false)
const presupuestos = ref<Tables<'cal.presupuesto'>[]>([])
const presupuestoSeleccionado = ref<Tables<'cal.presupuesto'> | undefined>(undefined)

const cargando = ref(false)
onMounted(async () => {
  const res = await PresupuestoService.getAll()
  presupuestos.value = res
})

const eliminar = (presupuesto: Tables<'cal.presupuesto'>) => {
  presupuestoSeleccionado.value = presupuesto
  mostrarModal.value = true
}
const cerrarModal = () => {
  presupuestoSeleccionado.value = undefined
  mostrarModal.value = false
}
const RealizarEliminacion = async () => {
  if (presupuestoSeleccionado.value != undefined) {
    cargando.value = true
    await PresupuestoService.eliminar(presupuestoSeleccionado.value.id)
    mostrarModal.value = false
    toastRef.value?.mostrar('Eliminado correctamente', 'success')
    cargando.value = false
    const index = presupuestos.value.findIndex((x) => x.id == presupuestoSeleccionado.value?.id)
    presupuestos.value.splice(index, 1)
  } else {
    toastRef.value?.mostrar(
      'No se puede eliminar porque no se ha seleccionado ningun presupuesto.',
      'error',
    )
  }
}
</script>
<style lang=""></style>
