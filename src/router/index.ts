import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useMainStore } from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login/LoginPage.vue')
  },
  {
    path: '/driver/',
    component: () => import('@/views/DriverMain.vue'),
    meta: { requiresAuth: true, authType: 'driver' },
    children: [
      {
        path: '',
        redirect: '/driver/trip'
      },
      {
        path: 'trip',
        component: () => import('@/views/driver/trip/DriverTripPage.vue'),
        meta: { requiresAuth: true, authType: 'driver' }
      }
    ]
  },
  {
    path: '/passenger/',
    component: import('@/views/PassengerMain.vue'),
    meta: { requiresAuth: true, authType: 'passenger' },
    children: [
      {
        path: '',
        redirect: '/passenger/trip'
      },
      {
        path: 'profile',
        component: () => import('@/views/passenger/profile/PassengerProfilePage.vue'),
        meta: { requiresAuth: true, authType: 'passenger' }
      },
      {
        path: 'trip',
        component: () => import('@/views/passenger/trip/PassengerTripPage.vue'),
        meta: { requiresAuth: true, authType: 'passenger' }
      },
      {
        path: 'chat',
        component: () => import('@/views/passenger/ChatPage.vue'),
        meta: { requiresAuth: true, authType: 'passenger' }
      },
      {
        path: 'settings',
        component: () => import('@/views/passenger/SettingsPage.vue'),
        meta: { requiresAuth: true, authType: 'passenger' }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const mainStore = useMainStore();
  const userToken = mainStore.token;
  const authType = mainStore.authType;
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (userToken) {
      if (authType === 'passenger') {
        next()
      } else if (authType === 'driver') {
        next('/driver/')
      } else {
        next('/login')
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router