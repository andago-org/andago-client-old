import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useMainStore } from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/test',
    component: () => import('@/views/login/RegisterPage.vue'),
    beforeEnter: async (to, from, next) => {
      next()
    }
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('@/views/login/LoginNav.vue'),
    beforeEnter: async (to, from, next) => {
      const store = useMainStore();

      if (store.token) {
        next(`/${store.userType}/`);
      } else {
        if (to.path === '/login') {
          next()
        }
      }
    }
  },
  {
    path: '/driver/',
    component: () => import('@/views/DriverMain.vue'),
    meta: { requiresAuth: true, userType: 'driver' },
    children: [
      {
        path: '',
        redirect: '/driver/trip'
      },
      {
        path: 'trip',
        component: () => import('@/views/driver/trip/DriverTripPage.vue'),
        meta: { requiresAuth: true, userType: 'driver' }
      }
    ]
  },
  {
    path: '/passenger/',
    component: import('@/views/PassengerMain.vue'),
    meta: { requiresAuth: true, userType: 'passenger' },
    children: [
      {
        path: '',
        redirect: '/passenger/trip'
      },
      {
        path: 'profile',
        component: () => import('@/views/passenger/profile/PassengerProfilePage.vue'),
        meta: { requiresAuth: true, userType: 'passenger' }
      },
      {
        path: 'trip',
        component: () => import('@/views/passenger/trip/PassengerTripPage.vue'),
        meta: { requiresAuth: true, userType: 'passenger' }
      },
      {
        path: 'chat',
        component: () => import('@/views/passenger/ChatPage.vue'),
        meta: { requiresAuth: true, userType: 'passenger' }
      },
      {
        path: 'settings',
        component: () => import('@/views/passenger/SettingsPage.vue'),
        meta: { requiresAuth: true, userType: 'passenger' }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from) => {
  const store = useMainStore();
  const userType = store.userType;

  if (to.meta.requiresAuth && !store.token) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: '/login',
    }
  }

  if (to.meta.userType && to.meta.userType !== userType) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    return {
      path: `/${userType}/`,
    }
  }
});


export default router