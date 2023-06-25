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

watch(() => store.currentTrip, async (newValue, oldValue) => {
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

  if (store.currentTrip?.status == 'completed') {
    const toast = await store.showToast({
      message: 'Trip completed',
      duration: 5000,
      position: 'middle',
    })

    toast.onDidDismiss().then(() => {
      store.currentTrip = null
    })
  }
});

</script>