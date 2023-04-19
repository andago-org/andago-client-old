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
import { ref } from 'vue';
import { useMainStore } from '@/store';
import { TripDetails, Place } from '@/interfaces/types';
import * as turf from '@turf/turf';
import Pusher from 'pusher-js';

const mainStore = useMainStore();

const tripDetails = ref({} as TripDetails);

const driverAvailable = ref(false);
const driverJobModelOpen = ref(false);

function logout() {
  mainStore.logout();
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
}

function decline() {
  // Decline
  driverJobModelOpen.value = false;
}

const pusher = new Pusher('a294542618ad0c79d7b7', {
  cluster: 'ap1'
});

const channel = pusher.subscribe('main-channel');
channel.bind('main-event', function (event: any) {
  console.log(event);

  const data = event.data;

  tripDetails.value = {
    pickUp: {
      name: data.pickup_place.name,
      formatted_address: data.pickup_place.address,
      coordinate: {
        latitude: data.pickup_place.latitude,
        longitude: data.pickup_place.longitude,
      },
    } as Place,
    dropOff: {
      name: data.dropoff_place.name,
      formatted_address: data.dropoff_place.address,
      coordinate: {
        latitude: data.dropoff_place.latitude,
        longitude: data.dropoff_place.longitude,
      },
    } as Place,
    distance: data.distance,
    duration: data.duration,
    fare: data.fare,
  } as TripDetails;

  driverJobModelOpen.value = true;
});
</script>

<style scoped>
ion-toggle {
  zoom: 1.6;
}
</style>