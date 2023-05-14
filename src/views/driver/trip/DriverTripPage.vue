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
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useMainStore } from '@/store';
import { TripDetails, Place } from '@/interfaces/types';
import { Geolocation } from '@capacitor/geolocation';
import Pusher from 'pusher-js';
import googleMaps from '@/plugins/google-map';

const store = useMainStore();

const tripDetails = ref({} as TripDetails);

const driverAvailable = ref(false);
const driverJobModelOpen = ref(false);

const mapRef = ref<any>(null);

// onMounted(
//   async () => {
//     // Load the Google Maps API
//     googleMaps.load().then(async (maps: any) => {
//       // Initialize the map
//       const map = new maps.Map(mapRef.value, {
//         center: await store.currentPosition,
//         zoom: 16,
//       });

//       // Start the navigator and track changes in the current position
//       // const startCoords = await store.currentPosition;
//       // const endCoords = { lat: 3.0697556, lng: 101.726957 };
//       // const watchId = googleMaps.startNavigator(startCoords, endCoords, map);
//       // watch(store.currentPosition, (newValue, oldValue) => {
//       //   const endCoords = { lat: 3.0697556, lng: 101.726957 };
//       //   googleMaps.startNavigator(newValue, endCoords, map);
//       // });

//       setInterval(async () => {
//         const startCoords = await store.currentPosition;
//         const endCoords = { lat: 3.0697556, lng: 101.726957 };
//         googleMaps.startNavigator(startCoords, endCoords, map);
//       }, 1000);
//     });
//   }
// );

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

function accept() {
  // Accept the trip details here
  driverJobModelOpen.value = false;

  store.acceptTrip(store.receivedTripJob.id);

  store.connectChannel("user-channel-" + store.acceptedTrip.user.id);
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

const sendLocationInterval = ref(null as any);

watch(
  () => store.receivedTripJob,
  (newValue: any) => {
    if (store.receivedTripJob) {
      if (store.receivedTripJob.status === 3) {
        sendLocationInterval.value = setInterval(
          async () => {
            store.channel?.trigger('driver-location-event', await store.currentPosition)
          },
          5000
        )
      }
    }
  }
);
</script>

<style scoped>
ion-toggle {
  zoom: 1.6;
}
</style>