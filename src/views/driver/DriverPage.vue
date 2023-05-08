<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Driver Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card class="ion-text-center">
        <ion-card-header>
          <ion-card-title>
            <ion-text>
              <h1>Status</h1>
            </ion-text>
          </ion-card-title>
        </ion-card-header>
        <ion-card-content class="toggle-container">
          <ion-toggle mode="ios"></ion-toggle>
        </ion-card-content>
      </ion-card>

      <ion-button @click="logout" expand="block">
        Logout
      </ion-button>

      <DriverJobModal v-model:isOpen="driverJobModelOpen" :tripDetails="tripDetails" @accept="accept" @decline="decline">
      </DriverJobModal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonNote,
  IonIcon, IonToggle, IonText, IonGrid, IonRow, IonCol
} from '@ionic/vue';
import DriverJobModal from '@/components/DriverJobModal.vue';
import { ref, onMounted } from 'vue';
import { useMainStore } from '@/store';
import { TripDetails, Place } from '@/interfaces/types';
import * as turf from '@turf/turf';
import Pusher from 'pusher-js';

const store = useMainStore();

const tripDetails = ref({} as TripDetails);

const driverAvailable = ref(false);
const driverJobModelOpen = ref(false);

function logout() {
  store.logout();
}

// function toggleDriverAvailability() {
//   driverAvailable.value = !driverAvailable.value;
// }

// function toggleTripDetailsVisibility() {
//   tripDetailsVisible.value = !tripDetailsVisible.value;
// }

function accept() {
  // Accept the trip details here
  driverJobModelOpen.value = false;

  store.acceptTrip(store.receivedTripJob.id);
}

function decline() {
  // Decline
  driverJobModelOpen.value = false;
}

const pusher = new Pusher('a294542618ad0c79d7b7', {
  cluster: 'ap1'
});

const channel = pusher.subscribe('public-channel');
channel.bind('trip-confirmed-event', async function (event: any) {
  const data = event.data;

  store.receivedTripJob = event.data;

  const start = await store.getGeolocation();
  const end = await store.getPickUpPosition();

  const distanceMatrix = await store.getDistanceMatrix(start, end);

  console.log(distanceMatrix);

  store.jobDetails = {
    distanceToPickUp: distanceMatrix.rows[0].elements[0].distance.text,
    durationToPickUp: distanceMatrix.rows[0].elements[0].duration.text,
  }

  driverJobModelOpen.value = true;
});
</script>

<style scoped>
ion-toggle {
  zoom: 1.6;
}
</style>