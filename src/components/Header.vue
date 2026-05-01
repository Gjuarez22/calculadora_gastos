<script setup lang="ts">
// 1. Importar RouterLink
import router from '@/router';
import { RouterLink, useRouter } from 'vue-router'

const navigation = [
  { name: 'Gastos', href: '/', icon: '📊' }, // Cambié '#' por '/' para la ruta raíz
  { name: 'Presupuestos', href: '/presupuesto', icon: '💰' }
]
const routerInst = useRouter();
const goToHome = ()=>{
routerInst.push("/")
}
</script>

<template>
  <!-- HEADER PARA COMPUTADORAS (Desktop) -->
  <header class="hidden md:flex sticky top-0 z-50 w-full border-b bg-green-900 text-white backdrop-blur-md px-6 py-4 gap-6 items-center">
    <div class="text-xl font-bold cursor-pointer" @click="goToHome()">Calculadora Gastos</div>
    <nav class="flex gap-8">
      <!-- 2. Usar RouterLink en lugar de <a> y 'to' en lugar de 'href' -->
      <RouterLink v-for="item in navigation" :key="item.name" :to="item.href" 
         class="hover:text-green-300 font-medium transition-colors">
        {{ item.name }}
      </RouterLink>
    </nav>
  </header>

  <!-- MENÚ INFERIOR PARA CELULARES (Mobile) -->
  <nav class="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center px-2 pb-safe">
    <!-- 3. Aplicar lo mismo para el menú móvil -->
    <RouterLink v-for="item in navigation" :key="item.name" :to="item.href"
       class="flex flex-col items-center justify-center text-gray-500 hover:text-green-600"
       active-class="text-green-600" 
    >
      <span class="text-xl">{{ item.icon }}</span>
      <span class="text-[10px] font-medium">{{ item.name }}</span>
    </RouterLink>
  </nav>

  <div class="md:hidden h-16"></div>
</template>