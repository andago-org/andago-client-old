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

      <ion-card v-if="tripDetailsVisible">
        <ion-card-header>
          <ion-card-title>Trip Details</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-label>Pick-Up:</ion-label>
              <ion-note slot="end">{{ tripDetails.pickUp }}</ion-note>
            </ion-item>
            <ion-item>
              <ion-label>Drop-Off:</ion-label>
              <ion-note slot="end">{{ tripDetails.dropOff }}</ion-note>
            </ion-item>
            <ion-item>
              <ion-label>Distance:</ion-label>
              <ion-note slot="end">{{ tripDetails.distance }} km</ion-note>
            </ion-item>
            <ion-item>
              <ion-label>Fare:</ion-label>
              <ion-note slot="end">{{ tripDetails.fare }}</ion-note>
            </ion-item>
            <ion-item>
              <ion-label>Estimated Duration:</ion-label>
              <ion-note slot="end">{{ tripDetails.estimatedDuration }}</ion-note>
            </ion-item>
          </ion-list>
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-button :color="'primary'" expand="block" @click="acceptTripDetails()">Accept</ion-button>
              </ion-col>
              <ion-col>
                <ion-button :color="'secondary'" expand="block" @click="declineTripDetails()">Decline</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonNote,
  IonIcon, IonToggle, IonText, IonGrid, IonRow, IonCol
} from '@ionic/vue';
import { ref } from 'vue';
import { useMainStore } from '@/store';
import * as turf from '@turf/turf';

const mainStore = useMainStore();

const tripDetails = ref({
  pickUp: 'Location name & Address',
  dropOff: 'Location name & Address',
  distance: '2',
  fare: 'RM 2.00',
  estimatedDuration: '1 hour 30 minutes',
});

const driverAvailable = ref(false);
const tripDetailsVisible = ref(true);

function logout() {
  mainStore.logout();
}

function toggleDriverAvailability() {
  driverAvailable.value = !driverAvailable.value;
}

function toggleTripDetailsVisibility() {
  tripDetailsVisible.value = !tripDetailsVisible.value;
}

function acceptTripDetails() {
  // Accept the trip details here
  tripDetailsVisible.value = false;
}

function declineTripDetails() {
  // Decline
  tripDetailsVisible.value = false;
}
</script>

<style scoped>
ion-toggle {
  zoom: 1.6;
}
</style>