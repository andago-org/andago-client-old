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
          <ion-button expand="block" @click="store.openMap()">Open Map</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonToggle,
  IonButton, IonIcon, IonButtons, IonBackButton, IonGrid, IonRow, IonCol, IonNav, IonNavLink
} from '@ionic/vue';
import { Coordinate } from '@/interfaces/types';
import { useMainStore } from '@/store';

const store = useMainStore();

const fakeGeolocation = ref(false);

watch(fakeGeolocation, (newFakeGeolocation) => {
  store.fakeGeolocation = newFakeGeolocation;
});

const coordinate = ref<Coordinate>({ lat: 3.052943, lng: 101.672337 });

watch(coordinate, (newCoordinate) => {
  store.coordinate = newCoordinate;
});


</script>
