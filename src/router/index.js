import Vue from 'vue'
import VueRouter from 'vue-router'
import Server from '../views/Server.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Server',
    component: Server
  },
  {
    path: '/client',
    name: 'Client',
    component: () => import(/* webpackChunkName: "about" */ '../views/Client.vue')
  },
  {
    path: '/manual',
    name: 'Manual',
    component: () => import(/* webpackChunkName: "about" */ '../views/Manual.vue')
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
