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

      <!-- <ion-button @click="logout" expand="block">
        Logout
      </ion-button> -->

      <div id="navigationMap" style="height: 400px"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonNote,
  IonIcon, IonToggle, IonText, IonGrid, IonRow, IonCol
} from '@ionic/vue';
import ReceivedTripModal from '@/components/ReceivedTripModal.vue';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useMainStore } from '@/store';
import { TripDetails, Place } from '@/interfaces/types';
import { Geolocation } from '@capacitor/geolocation';
import Pusher from 'pusher-js';
import googleMaps from '@/plugins/google-map';

const store = useMainStore();

const receivedTrip = ref({} as any);

const driverAvailable = ref(false);
const driverJobModelOpen = ref(false);

const mapRef = ref<any>(null);

onMounted(() => {
  // Load the Google Maps API
  googleMaps.load().then(async (maps: any) => {
    // Initialize the map
    const map = new maps.Map(document.getElementById('navigationMap'), {
      center: await store.currentPosition,
      zoom: 18,
    });

    // setInterval(
    //   async () => {
    const startCoords = await store.currentPosition;
    const endCoords = { lat: 3.0830124, lng: 101.662267 };
    await googleMaps.startNavigator(startCoords, endCoords, map);
    //   },
    //   1000
    // );
  });
});


const pusher = new Pusher('a294542618ad0c79d7b7', {
  cluster: 'ap1'
});

const sendLocationInterval = ref(null as any);

// watch(
//   () => store.receivedTrips,
//   (newValue: any) => {

//     //
//   }
// );
</script>

<style scoped>
ion-toggle {
  zoom: 1.6;
}
</style>