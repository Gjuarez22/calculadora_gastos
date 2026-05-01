<script setup lang="ts">
import { ref } from 'vue'

const navigation = [
  { name: 'Inicio', href: '#', icon: '🏠' },
  { name: 'Gastos', href: '#', icon: '📊' },
  { name: 'Ahorros', href: '#', icon: '💰' },
  { name: 'Perfil', href: '#', icon: '👤' },
]
</script>

<template>
  <!-- HEADER PARA COMPUTADORAS (Desktop) -->
  <header class="hidden md:flex sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-6 py-4 justify-between items-center">
    <div class="text-xl font-bold text-indigo-600">Calculadora Gastos</div>
    <nav class="flex gap-8">
      <a v-for="item in navigation" :key="item.name" :href="item.href" 
         class="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
        {{ item.name }}
      </a>
    </nav>
    <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
      Cerrar Sesión
    </button>
  </header>

  <!-- MENÚ INFERIOR PARA CELULARES (Mobile) -->
  <!-- Solo se muestra en pantallas pequeñas (md:hidden) -->
  <nav class="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center px-2 pb-safe">
    <a v-for="item in navigation" :key="item.name" :href="item.href"
       class="flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600">
      <span class="text-xl">{{ item.icon }}</span>
      <span class="text-[10px] font-medium">{{ item.name }}</span>
    </a>
  </nav>

  <!-- Espaciado para que el contenido no quede debajo del menú móvil -->
  <div class="md:hidden h-16"></div>
</template>

<style scoped>
/* Evita que el contenido se corte en iPhones con notch inferior */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>