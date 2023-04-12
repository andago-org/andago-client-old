<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useMainStore } from '@/store';

const store = useMainStore();

store.loadFromStorage();
console.log("Check if token exists")
if (store.token !== '') {
  console.log(store.token)
  store.getUser();
}

store.testGet();
store.testSet();

</script>
