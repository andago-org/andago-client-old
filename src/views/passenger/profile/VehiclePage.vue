<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Car Selection</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="closeModal" color="danger">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-list>
        <ion-item v-if="store.vehicles.length === 0">
          <ion-label>You have no car added yet.</ion-label>
        </ion-item>

        <VehicleCard v-for="(vehicle, index) in store.vehicles" :key="index" :vehicleData="vehicle">
        </VehicleCard>
      </ion-list>

      <ion-grid v-if="store.vehicles.length < 3 && addable">
        <ion-row class="ion-justify-content-center">
          <ion-fab>
            <ion-fab-button class="ion-text-center ion-margin-bottom" @click="addCar()">
              <ion-icon :icon="add"></ion-icon>
            </ion-fab-button>
          </ion-fab>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem,
  IonLabel, IonText, IonFooter, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonCheckbox, IonFab, IonFabButton, IonBackButton, modalController
} from '@ionic/vue';
import { ref, computed, onMounted } from 'vue';
import { car as carIcon, add } from 'ionicons/icons';
import { Vehicle, ControlMode } from '@/interfaces/types';
import VehicleCard from '@/components/VehicleCard.vue';
import { useMainStore } from '@/store';

const store = useMainStore();

const selectedVehicle = ref(null);

const addable = computed(() => {
  return store.vehicles[store.vehicles.length - 1]?.saved == true
})

onMounted(() => {
  store.getVehicles()
})

function addCar() {
  store.vehicles.push({
    name: '',
    controlMode: ControlMode.Create,
  } as Vehicle);
}

function closeModal() {
  return modalController.dismiss(null, 'cancel')
}
</script>

