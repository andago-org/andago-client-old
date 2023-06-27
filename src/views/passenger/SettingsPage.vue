<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-button expand="block" @click="store.openMap(store.currentPosition)">Open Map</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton,
} from '@ionic/vue';
import { useMainStore } from '@/store';

const store = useMainStore();

const fakeGeolocation = ref(false);

watch(fakeGeolocation, (newFakeGeolocation) => {
  store.fakeGeolocation = newFakeGeolocation;
});

</script>
