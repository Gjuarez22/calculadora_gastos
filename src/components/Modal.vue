<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  titulo: {
    type: String,
    default: 'Título del Modal',
  },
  size: {
    type: String,
    default: 'md', // Opciones: 'sm', 'md', 'lg', 'xl', 'full'
  },
})

const emit = defineEmits(['close'])

// Calculamos el ancho de Tailwind según lo que le pases en el prop "size"
const modalSizeClass = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-full mx-4 md:mx-10',
  }
  return sizes[props.size] || sizes.md
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <!-- Fondo oscuro desenfocado -->
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click.self="emit('close')"
      >
        <!-- Caja del Modal -->
        <div
          class="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
          :class="modalSizeClass"
        >
          <!-- Header del Modal -->
          <div class="bg-green-700 text-white p-4 flex justify-between items-center">
            <h2 class="text-xl font-bold">{{ titulo }}</h2>
            <button
              @click="emit('close')"
              class="text-white hover:text-green-200 text-3xl leading-none px-2 transition-transform active:scale-90"
            >
              &times;
            </button>
          </div>

          <!-- Cuerpo del Modal (hace scroll si el contenido es muy largo) -->
          <div class="p-5 max-h-[75vh] overflow-y-auto bg-green-50">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Animaciones de entrada y salida */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}
</style>
