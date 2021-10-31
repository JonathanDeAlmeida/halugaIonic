import { createRouter, createWebHistory } from '@ionic/vue-router';
import Tabs from '../views/Tabs.vue'

const routes = [
  {
    path: '/',
    redirect: '/tabs/pesquisar-imovel'
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/pesquisar-imovel'
      },
      {
        path: 'pesquisar-imovel',
        component: () => import('@/views/PesquisarImovel.vue')
      },
      {
        path: 'meus-imoveis',
        component: () => import('@/views/MeusImoveis.vue')
      },
      {
        path: 'editar-perfil',
        component: () => import('@/views/EditarPerfil.vue')
      },
      {
        path: 'login',
        component: () => import('@/views/Login.vue')
      },
      {
        path: 'cadastrar-perfil',
        component: () => import('@/views/CadastrarPerfil.vue')
      }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
