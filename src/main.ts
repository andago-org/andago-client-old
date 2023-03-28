import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import GoogleMapsPlacesPlugin from './plugins/google-maps-api';

import { createPinia } from 'pinia'
import { useMainStore } from './store'

const pinia = createPinia()

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia)
;

app.provide('mainStore', useMainStore())

app.use(GoogleMapsPlacesPlugin, { apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY });

router.isReady().then(() => {
  app.mount('#app');
});