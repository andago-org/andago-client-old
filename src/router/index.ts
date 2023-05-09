import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useMainStore } from '@/store'
import TabsPage from '../views/MainPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/sign-in'
  },
  {
    path: '/sign-in',
    component: () => import('@/views/sign-in/SignInPage.vue')
  },
  {
    path: '/code-verify',
    component: () => import('@/views/sign-in/CodeVerifyPage.vue')
  },
  {
    path: '/driver/',
    component: () => import('@/views/DriverMain.vue'),
    children: [
      {
        path: '',
        redirect: '/driver/job'
      },
      // {
      //   path: 'profile',
      //   component: () => import('@/views/pages/ProfilePage.vue')
      // },
      {
        path: 'job',
        component: () => import('@/views/driver/DriverPage.vue')
      },
      // {
      //   path: 'chat',
      //   component: () => import('@/views/pages/TestPage.vue')
      // },
      // {
      //   path: 'settings',
      //   component: () => import('@/views/pages/SettingsPage.vue')
      // }
    ],
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/trip'
      },
      {
        path: 'profile',
        component: () => import('@/views/pages/ProfilePage.vue')
      },
      {
        path: 'trip',
        component: () => import('@/views/trip/TripPage.vue')
      },
      {
        path: 'chat',
        component: () => import('@/views/pages/TestPage.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/pages/SettingsPage.vue')
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
  const driverMode = mainStore.driverMode;

  if (to.path === '/sign-in' || to.path === '/code-verify') {
    if (userToken) {
      if (driverMode) {
        next('/driver/job')
      } else {
        next('/tabs/trip')
      }
    } else {
      next()
    }
  } else {
    if (userToken) {
      next()
    } else {
      next('/sign-in')
    }
  }
});
  

export default router