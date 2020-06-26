import Home from '@/components/home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/components/user/index.vue')
  }
]

export {
  routes
}
