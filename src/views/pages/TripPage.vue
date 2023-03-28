<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-searchbar :search-icon="location" placeholder="Pick-Up" @ion-focus="openModal"></ion-searchbar>
            <AddressSearchModal v-model:isOpen="isPickUpModalOpen" :items="sampleData" title="Pick-Up Location"
              placeholder="Search for address" @selected="onItemSelected"></AddressSearchModal>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-searchbar :search-icon="navigate" placeholder="Drop-Off"></ion-searchbar>
            <AddressSearchModal v-model:isOpen="isDropOffModalOpen" :items="sampleData" title="Drop-Off Location"
              placeholder="Search for address" @selected="onItemSelected"></AddressSearchModal>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-button expand="block">Confirm</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonItem, IonButton,
  IonGrid, IonRow, IonCol,
} from '@ionic/vue';

import { location, navigate } from 'ionicons/icons';

import AddressSearchModal from '@/components/AddressSearchModal.vue';

const sampleData = [
  '123 Main St',
  '456 Elm St',
  '789 Oak St',
  '135 Maple St',
  '246 Willow St',
  '357 Pine St',
  '864 Spruce St',
];

const isPickUpModalOpen = ref(false);
const isDropOffModalOpen = ref(false);

const openModal = () => {
  isPickUpModalOpen.value = true;
};

const onItemSelected = (item: string) => {
  console.log('Selected address:', item);
};
</script>
