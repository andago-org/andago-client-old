<template>
  <ion-modal :is-open="isOpen" @dismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Job Found</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="map2"></div>

      <ion-list>
        <ion-item>
          <ion-label>Pick-Up</ion-label>
          <ion-text>
            <h3><ion-icon :icon="location" color="primary"></ion-icon>{{ store.receivedTripJob.pickup_place.name }}</h3>
            <p>{{ store.receivedTripJob.pickup_place.address }}</p>
          </ion-text>
        </ion-item>

        <ion-item>
          <ion-label>Drop-Off</ion-label>
          <ion-text>
            <h3><ion-icon :icon="navigate" color="tertiary"></ion-icon>{{ store.receivedTripJob.dropoff_place.name }}</h3>
            <p>{{ store.receivedTripJob.dropoff_place.address }}</p>
          </ion-text>
        </ion-item>

        <ion-item>
          <ion-label>Distance to Pick-Up Point:</ion-label>
          <ion-note slot="end">{{ store.jobDetails.distanceToPickUp }}</ion-note>
        </ion-item>

        <ion-item>
          <ion-label>Duration to Pick-Up Point:</ion-label>
          <ion-note slot="end">{{ store.jobDetails.durationToPickUp }}</ion-note>
        </ion-item>

        <ion-item>
          <ion-label>Trip Distance:</ion-label>
          <ion-note slot="end">{{ store.receivedTripJob.distance }} km</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Trip Duration:</ion-label>
          <ion-note slot="end">{{ store.receivedTripJob.duration }} mins</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Fare:</ion-label>
          <ion-note slot="end">RM {{ store.receivedTripJob.fare }}</ion-note>
        </ion-item>
      </ion-list>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button :color="'primary'" expand="block" @click="acceptTrip()">Accept</ion-button>
          </ion-col>
          <ion-col>
            <ion-button :color="'secondary'" expand="block" @click="declineTrip()">Decline</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, watch, nextTick } from 'vue';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote, IonButton,
  IonButtons, IonGrid, IonRow, IonCol, IonText, IonIcon
} from '@ionic/vue';
import { TripDetails } from '@/interfaces/types';
import { useMainStore } from '@/store';
import { location, navigate } from 'ionicons/icons';
import googleMaps from '@/plugins/google-map';

const store = useMainStore();

const props = defineProps({
  isOpen: Boolean,
  tripDetails: {
    type: Object as () => TripDetails,
    required: true,
  },
});

const googleMap = ref(null as any);

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    const center = await store.getGeolocation();
    const pickUpPostion = await store.getPickUpPosition();

    googleMaps.load().then((maps: any) => {
      googleMap.value = new maps.Map(document.getElementById("map2"), {
        center: center,
        zoom: 5,
        disableDefaultUI: true,
      });
      googleMaps.calculateRoute(center, pickUpPostion, googleMap.value);
    });
  }
});

const emit = defineEmits(['update:isOpen', 'accept', 'decline', 'update:tripDetails']);

function closeModal() {
  emit('update:isOpen', false);
}

function acceptTrip() {
  emit('accept');
}

function declineTrip() {
  emit('decline');
}
</script>

<style>
#map2 {
  height: 200px;
  background-color: #f5f5f5;
}
</style>