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
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/pages/ProfilePage.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/pages/TripPage.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/pages/ChatPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const mainStore = useMainStore()

  if (mainStore.user) {
    // User is logged in, allow the navigation to proceed to the requested route
    if (to.path === '/sign-in') {
      // User is already logged in, redirect to the default route
      next('/')
    } else {
      next()
    }
  } else {
    // User is not logged in, redirect to the sign-in page
    if (to.path === '/sign-in') {
      // Already on the sign-in page, allow the navigation to proceed
      next()
    } else {
      next('/sign-in')
    }
  }
})

export default router
