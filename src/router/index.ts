import { createRouter, createWebHistory } from 'vue-router'
import calculadoraView from '@/views/calculadoraView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Calculadora',
      component: calculadoraView,
    },
  ],
})

export default router
