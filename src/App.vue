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

if (store.token !== '') {
  store.getUser();
}
</script>
