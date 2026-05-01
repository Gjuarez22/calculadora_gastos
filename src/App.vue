<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue' // Asegúrate de que la ruta sea correcta
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <main class="container mx-auto p-4">
      <RouterView />
    </main>
  </div>
</template>