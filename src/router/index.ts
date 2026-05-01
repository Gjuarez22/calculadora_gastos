import { createRouter, createWebHistory } from 'vue-router'
import calculadoraView from '@/views/calculadoraView.vue'
import PresupuestoView from '@/views/PresupuestoView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Calculadora',
      component: calculadoraView,
    },
    {
      path: '/presupuesto',
      name: 'Presupuesto',
      component: PresupuestoView,
    },
  ],
})

export default router
