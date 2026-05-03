<template lang="">
  <div class="bg-green-100 p-3">
    <label class="font-bold text-2xl">Presupuestos ingresados</label>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '@/models/supabase'
import { onMounted, ref } from 'vue'
import { PresupuestoService } from '../services/PresupuestoService'

const presupuestos = ref<Tables<'cal.presupuesto'>[]>()
onMounted(async () => {
  const res = await PresupuestoService.getAll()
  presupuestos.value = res
})
</script>
<style lang=""></style>
