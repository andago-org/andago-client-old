import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useMainStore } from '@/store'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   redirect: '/test'
  // },
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
      {
        path: 'ModalStackTestPage',
        component: () => import('@/views/test/ModalStackTestPage.vue'),
      },
      {
        path: 'CometChatTestPage',
        component: () => import('@/views/test/CometChatTestPage.vue'),
      },
      {
        path: 'SearchDriverPage',
        component: () => import('@/views/passenger/trip/SearchDriverPage.vue'),
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

      if (store.loggedIn)
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
      const store = useMainStore()

      if (!store.loggedIn)
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
        children: [
          {
            path: '',
            redirect: '/passenger/trip/AddressPage'
          },
          {
            path: 'AddressPage',
            component: () => import('@/views/passenger/trip/AddressPage.vue'),
            beforeEnter: async (to, from, next) => {
              const store = useMainStore();
              
              if (![undefined].includes(store.currentTrip?.status))
              {
                next('/passenger/trip/PreviewPage')
              }
              else
              {
                next()
              }
            },
          },
          {
            path: 'PreviewPage',
            component: () => import('@/views/passenger/trip/PreviewPage.vue'),
            beforeEnter: async (to, from, next) => {
              const store = useMainStore();

              if (!['pending'].includes(store.currentTrip?.status))
              {
                next('/passenger/trip/SearchDriverPage')
              }
              else
              {
                next()
              }
            },
          },
          {
            path: 'SearchDriverPage',
            component: () => import('@/views/passenger/trip/SearchDriverPage.vue'),
            beforeEnter: async (to, from, next) => {
              const store = useMainStore();

              if (!['confirmed'].includes(store.currentTrip?.status))
              {
                next('/passenger/trip/PassengerProgressPage')
              }
              else
              {
                next()
              }
            },
          },
          {
            path: 'PassengerProgressPage',
            component: () => import('@/views/passenger/trip/PassengerProgressPage.vue'),
            beforeEnter: async (to, from, next) => {
              const store = useMainStore();

              if (!['accepted', 'arrived', 'started', 'completed'].includes(store.currentTrip?.status))
              {
                next('/passenger/trip')
              }
              else
              {
                next()
              }
            },
          },
        ],
      },
      {
        path: 'chat',
        component: () => import('@/views/ChatPage.vue'),
        name: 'Passenger_Chat',
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
        path: 'profile',
        component: () => import('@/views/driver/profile/DriverProfileNav.vue'),
      },
      {
        path: 'trip',
        component: () => import('@/views/driver/trip/DriverTripNav.vue'),
        children: [
          {
            path: '',
            redirect: '/driver/trip/IdlePage'
          },
          {
            path: 'IdlePage',
            component: () => import('@/views/driver/trip/IdlePage.vue'),
            beforeEnter: async (to, from, next) => {
              const store = useMainStore();

              if (![undefined].includes(store.currentTrip?.status))
              {
                next('/driver/trip/DriverProgressPage')
              }
              else
              {
                next()
              }
            },
          },
          {
            path: 'DriverProgressPage',
            component: () => import('@/views/driver/trip/DriverProgressPage.vue'),
            beforeEnter: async (to, from, next) => {
              const store = useMainStore();

              if (!['accepted', 'arrived', 'started', 'completed'].includes(store.currentTrip?.status))
              {
                next('/driver/trip')
              }
              else
              {
                next()
              }
            },
          },
        ]
      },
      {
        path: 'chat',
        component: () => import('@/views/ChatPage.vue'),
        name: 'Driver_Chat',
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const store = useMainStore();

  if (!store.tokenLoaded)
  {
    store.tokenLoaded = true
    await store.loadTokenFromStorage()
  }

  const splittedPath = to.path.split('/');

  if (['driver', 'passenger'].includes(splittedPath[1]))
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