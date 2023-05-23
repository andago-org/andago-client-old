import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useMainStore } from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/test',
    component: () => import('@/views/test/TestMain.vue'),
    children: [
      {
        path: 'PusherPrivateTest',
        component: () => import('@/views/test/PusherPrivateTestPage.vue'),
      },
      {
        path: 'TopUpModalTest',
        component: () => import('@/views/test/TopUpModalTestPage.vue'),
      },
    ]
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

      if (store.token)
      {
        next('/register');
      }
      else
      {
        next()
      }
    }
  },
  {
    path: '/register',
    component: () => import('@/views/login/RegisterPage.vue'),
    beforeEnter: async (to, from, next) => {
      const store = useMainStore();

      if (!store.token)
      {
        next('/login')
      }
      else if (store.profile?.profile_completed)
      {
        next(`/${store.profile?.userType}`)
      }
      else
      {
        next()
      }
    }
  },
  {
    path: '/passenger',
    component: () => import('@/views/PassengerMain.vue'),
    children: [
      {
        path: '',
        redirect: '/passenger/trip'
      },
      {
        path: 'profile',
        component: () => import('@/views/passenger/profile/PassengerProfileNav.vue'),
      },
      {
        path: 'trip',
        component: () => import('@/views/passenger/trip/PassengerTripNav.vue'),
      },
      {
        path: 'chat',
        component: () => import('@/views/passenger/ChatPage.vue'),
      },
      {
        path: 'settings',
        component: () => import('@/views/passenger/SettingsPage.vue'),
      }
    ]
  },
  {
    path: '/driver',
    component: () => import('@/views/DriverMain.vue'),
    children: [
      {
        path: '',
        redirect: '/driver/trip'
      },
      {
        path: 'trip',
        component: () => import('@/views/driver/trip/DriverTripPage.vue'),
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const store = useMainStore();
  
  if (['driver', 'passenger'].includes(to.path.split('/')[1]))
  {
    if (!store.token || !store.profile?.profile_completed)
    {
      return { path: '/login'}
    }
    else if (to.path.split('/')[1] != store.profile?.userType)
    {
      return { path: `/${store.profile?.userType}`}
    }
    else
    {
      return true
    }
  }
});


export default router