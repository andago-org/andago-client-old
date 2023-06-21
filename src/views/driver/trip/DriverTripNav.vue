<template>
  <ion-page>
    <ion-router-outlet></ion-router-outlet>
  </ion-page>
</template>

<script setup lang="ts">
import { watch, } from 'vue';
import {
  IonPage, IonRouterOutlet,
} from '@ionic/vue';
import { useMainStore } from '@/store';
import router from '@/router';

const store = useMainStore();

watch(() => store.currentTrip, (newValue, oldValue) => {
  const splittedRoute = router.currentRoute.value.path.split('/');

  if (splittedRoute[2] != 'trip') {
    return;
  }

  // If changed then switch page
  if (newValue?.status != oldValue?.status) {
    console.log(newValue?.status, oldValue?.status)
    setTimeout(() => {
      router.go(0)
    }, 100);
  }
});

</script>