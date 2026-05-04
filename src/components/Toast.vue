<script setup lang="ts">
import { ref } from 'vue'

// Estado interno del Toast
const visible = ref(false)
const mensaje = ref('')
const tipo = ref<'success' | 'error'>('success')

// Función que expondremos al componente padre
const mostrar = (nuevoMensaje: string, nuevoTipo: 'success' | 'error' = 'success') => {
  mensaje.value = nuevoMensaje
  tipo.value = nuevoTipo
  visible.value = true

  // Ocultar automáticamente después de 3 segundos
  setTimeout(() => {
    visible.value = false
  }, 3000)
}

// Permitimos que el padre llame a esta función usando una "ref"
defineExpose({
  mostrar,
})
</script>

<template>
  <!-- Teleport mueve este div directamente al <body> para evitar problemas de z-index o contenedores cortados -->
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        class="fixed top-5 left-1/2 -translate-x-1/2 md:left-auto md:right-5 md:translate-x-0 z-[100] px-6 py-3 rounded-xl shadow-2xl text-white flex items-center gap-3 transition-colors duration-300 min-w-[280px]"
        :class="tipo === 'success' ? 'bg-green-600' : 'bg-red-600'"
      >
        <font-awesome-icon
          :icon="tipo === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'"
          class="text-2xl"
        />
        <span class="font-bold text-lg">{{ mensaje }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Animaciones de entrada y salida */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-30px) translateX(-50%);
}

/* Ajuste de animación para pantallas de escritorio (md) */
@media (min-width: 768px) {
  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(-30px) translateX(0);
  }
}
</style>
