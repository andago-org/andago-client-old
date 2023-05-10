<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>Car Selection</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content fullscreen>
    <ion-list>
      <ion-item v-if="store.vehicles.length === 0">
        <ion-label>You have no car added yet.</ion-label>
      </ion-item>

      <VehicleCard v-for="(vehicle, index) in store.vehicles" :key="index" :vehicleData="vehicle"
        @click="selectVehicle(index)">
      </VehicleCard>
    </ion-list>

    <ion-grid v-if="store.vehicles.length < 3">
      <ion-row class="ion-justify-content-center">
        <ion-fab>
          <ion-fab-button class="ion-text-center" @click="addCar()">
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem,
  IonLabel, IonText, IonFooter, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonCheckbox, IonFab, IonFabButton, IonBackButton
} from '@ionic/vue';
import { ref } from 'vue';
import { car as carIcon, add } from 'ionicons/icons';
import { Vehicle, ControlMode } from '@/interfaces/types';
import VehicleCard from '@/components/VehicleCard.vue';
import { useMainStore } from '@/store';

const store = useMainStore();

// const vehicles = ref<Vehicle[]>([]);

const selectedVehicle = ref(null);

// async function getVehicles() {
//   store.vehicles = await store.getVehicles() as Vehicle[];
// }

// getVehicles();

store.getVehicles();

function selectVehicle(index: any) {
  selectedVehicle.value = index;
}

function addCar() {
  store.vehicles.push({
    name: '',
    controlMode: ControlMode.Create,
  } as Vehicle);
}
</script>

