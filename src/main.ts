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

// Default theme
import '@splidejs/vue-splide/css';

// Global styles
import './styles/global.css';

import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import { useMainStore } from './store'

const pinia = createPinia()
pinia.use(piniaPersist)

const ionicConfig = {
  // mode: 'ios',
}

const app = createApp(App)
  .use(IonicVue, ionicConfig)
  .use(router)
  .use(pinia)
;

app.provide('mainStore', useMainStore())

router.isReady().then(() => {
  app.mount('#app');
});