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
  },
  {
    path: '/dept',
    name: 'Dept',
    component: () => import('@/components/dept/index.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('@/components/menu/index.vue')
  },
  {
    path: '/dict',
    name: 'Dict',
    component: () => import('@/components/dict/index.vue')
  },
  {
    path: '/channel',
    name: 'Channel',
    component: () => import('@/components/channel/index.vue')
  },
  {
    path: '/article',
    name: 'Article',
    component: () => import('@/components/article/index.vue')
  },
  {
    path: '/cms/articleEdit',
    name: 'Addarticle',
    component: () => import('@/components/addarticle/index.vue')
  },
  {
    path: '/fileMgr',
    name: 'FileMgr',
    component: () => import('@/components/filemgr/index.vue')
  }
]

export {
  routes
}
