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
          <ion-label>Fake Geolocation:</ion-label>
          <ion-toggle v-model="fakeGeolocation"></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>Latitude:</ion-label>
          <ion-input v-model="coordinate.latitude"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Longitude:</ion-label>
          <ion-input v-model="coordinate.longitude"></ion-input>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonToggle,
} from '@ionic/vue';
import { Coordinate } from '@/interfaces/types';
import { useMainStore } from '@/store';

const store = useMainStore();

const fakeGeolocation = ref(false);

watch(fakeGeolocation, (newFakeGeolocation) => {
  store.fakeGeolocation = newFakeGeolocation;
});

const coordinate = ref<Coordinate>({ latitude: 3.052943, longitude: 101.672337 });

watch(coordinate, (newCoordinate) => {
  store.coordinate = newCoordinate;
});


</script>
