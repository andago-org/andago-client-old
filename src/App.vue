<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
// import { ref, watch, } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useMainStore } from './store';

const store = useMainStore()

// store.loadFromStorage();

setInterval(() => {
  if (store.loggedIn) {
    console.log("Get Profile")
    store.getData();
  }
}, 5000);
</script>
