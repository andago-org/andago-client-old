<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>

  <audio id="localAudio" autoplay muted></audio>
  <audio id="remoteAudio" autoplay></audio>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { useMainStore } from './store'

declare const AndroidBridge: any;

// Now you can use the AndroidBridge object in your TypeScript code
AndroidBridge.showToast('Hello from TypeScript');
const data = AndroidBridge.getDataFromAndroid();
console.log(data);

const store = useMainStore()

// store.loadFromStorage();

setInterval(() => {
  if (store.loggedIn) {
    store.getData();
  }
}, 5000);
</script>
