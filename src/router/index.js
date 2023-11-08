import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Monitoring',
    component: () => import('../views/Monitoring.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingWidget.vue')
  },
  {
    path: '/administrations',
    name: 'Administrations',
    component: () => import('../views/Administrations.vue')
  },
  {
    path: '/auth',
    name: 'Authorization',
    component: () => import('../views/Authorization.vue')
  },
  {
    path: '/wifi',
    name: 'Wifi',
    component: () => import('../views/Wifi.vue')
  },
  {
    path: '/ospf',
    name: 'Ospf',
    component: () => import('../views/Ospf.vue')
  },
  {
    path: '/conveyor',
    name: 'Conveyor',
    component: () => import('../views/Conveyor.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeResolve((to, from, next) => {
  if (to.path) {
    console.log('Загрузка');
    const preloader = document.getElementById('preloader');
    let loader = document.getElementById('loader');
    preloader.style.display = 'block';
    loader.style.display = 'block';
  }
  next();
})

router.afterEach(() => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    let loader = document.getElementById('loader');
    preloader.style.display = 'none';
    loader.style.display = 'none';
  }, 1000)
  console.log('Готово');
})

export default router