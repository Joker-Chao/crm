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
    component: () => import("@/components/user/index.vue")
  },
  {
    path: '/mgr',
    name: 'Mgr',
    component: () => import('@/components/mgr/index.vue')
  },
  {
    path: '/role',
    name: 'Role',
    component: () => import('@/components/role/index.vue')
  }
]

export {
  routes
}
