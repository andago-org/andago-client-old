import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

import OneSignal from 'onesignal-cordova-plugin';

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

document.addEventListener("deviceready", OneSignalInit, false);

// Call this function when your app starts
function OneSignalInit(): void {
  // Uncomment to set OneSignal device logging to VERBOSE  
  // OneSignal.setLogLevel(6, 0);

  // NOTE: Update the setAppId value below with your OneSignal AppId.
  OneSignal.setAppId("62355bcd-0500-4361-890b-4aafe57b7b42");
  OneSignal.setNotificationOpenedHandler(function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  });

  // Prompts the user for notification permissions.
  //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
  OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
      console.log("User accepted notifications: " + accepted);
  });
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