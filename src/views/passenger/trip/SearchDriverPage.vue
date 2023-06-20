<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Wait for Driver</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ion-text-center">
        <ion-spinner name="dots" />
        <p>Waiting for driver...</p>
      </div>

      <ion-button expand="block" @click="cancelSearch">
        Cancel
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonButton
} from '@ionic/vue';
import { useMainStore } from '@/store';

const store = useMainStore();

function cancelSearch() {
  store.axios.post('/passengers/trips/cancelSearch')
    .then((response) => {
      const data = response.data;

      store.currentTrip = data.trip;
    })
}
</script>
