<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen bg-green-100">
    <Header />
    <!-- flex-1 hace que el contenido ocupe el resto del espacio disponible -->
    <main class="flex-1 w-full md:mx-auto md:max-w-4xl md:p-3">
      <RouterView />
    </main>
  </div>
</template>
