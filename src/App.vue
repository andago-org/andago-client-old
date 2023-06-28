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
import { Capacitor } from '@capacitor/core'

declare const AndroidBridge: any;

console.log('Capacitor.getPlatform()', Capacitor.getPlatform())

if (Capacitor.getPlatform() === 'android') {
  // Now you can use the AndroidBridge object in your TypeScript code
  AndroidBridge.showToast('Whoa cool');
  const data = AndroidBridge.getDataFromAndroid();
  console.log(data);
  console.log(AndroidBridge.getOneSignalUserId())
}

const store = useMainStore()

// store.loadFromStorage();

setInterval(() => {
  if (store.loggedIn) {
    store.getData();
  }
}, 5000);
</script>
