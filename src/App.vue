<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { ref, watch, } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useMainStore } from './store';

const store = useMainStore()

// store.loadFromStorage();

store.initCometChat();

setInterval(() => {
  console.log("Get Profile")
  if (store.loggedIn) {
    store.getData();
  }
}, 5000);
</script>
