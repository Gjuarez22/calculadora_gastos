import { createRouter, createWebHistory } from 'vue-router'
import calculadoraView from '@/views/calculadoraView.vue'
import PresupuestoView from '@/views/PresupuestoView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'PresupuestoHome',
      component: PresupuestoView,
    },
    {
      path: '/presupuesto',
      name: 'Presupuesto',
      component: PresupuestoView,
    },
    {
      path: '/calculadora/:id?',
      name: 'calculadora',
      component: calculadoraView,
    },
  ],
})

export default router
