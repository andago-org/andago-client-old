import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useMainStore } from '@/store'
import TabsPage from '../views/MainPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/sign-in',
    component: () => import('@/views/sign-in/SignInPage.vue')
  },
  {
    path: '/code-verify',
    component: () => import('@/views/sign-in/CodeVerifyPage.vue')
  },
  {
    path: '/',
    redirect: '/tabs/profile'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/profile'
      },
      {
        path: 'profile',
        component: () => import('@/views/pages/ProfilePage.vue')
      },
      {
        path: 'trip',
        component: () => import('@/views/pages/TripPage.vue')
      },
      {
        path: 'chat',
        component: () => import('@/views/pages/ChatPage.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/pages/SettingsPage.vue')
      }
    ]
  },
  {
    path: '/driver',
    component: () => import('@/views/driver/DriverPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const mainStore = useMainStore();
  const userToken = mainStore.token;
  const driverMode = mainStore.driverMode;

  if (userToken) {
    if (driverMode && to.path !== '/driver') {
      next('/driver');
    } else if (!driverMode && (to.path === '/sign-in' || to.path === '/driver')) {
      next('/');
    } else {
      next();
    }
  } else {
    if (to.path === '/code-verify') {
      next();
    } else if (to.path !== '/sign-in') {
      next('/sign-in');
    } else {
      next();
    }
  }
});

export default router