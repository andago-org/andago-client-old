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
            <ion-searchbar :search-icon="location" placeholder="Pick-Up" @ion-focus="openPickUpModal"
              :value="pickUpLocation.name"></ion-searchbar>
            <AddressSearchModal v-model:value="pickUpLocation" v-model:isOpen="isPickUpModalOpen" title="Pick-Up Location"
              placeholder="Search for address"></AddressSearchModal>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-searchbar :search-icon="navigate" placeholder="Drop-Off" @ion-focus="openDropOffModal"
              :value="dropOffLocation.name"></ion-searchbar>
            <AddressSearchModal v-model:value="dropOffLocation" v-model:isOpen="isDropOffModalOpen"
              title="Drop-Off Location" placeholder="Search for address">
            </AddressSearchModal>
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
import TripDetailsModal from '@/components/TripDetailsModal.vue';
import { Place } from '@/interfaces/types';
import { useMainStore } from '@/store';
import { location, navigate } from 'ionicons/icons';

import AddressSearchModal from '@/components/AddressSearchModal.vue';

const store = useMainStore();

const isPickUpModalOpen = ref(false);
const isDropOffModalOpen = ref(false);

const pickUpLocation = ref<Place>({} as Place);
const dropOffLocation = ref<Place>({} as Place);

// const tripQuery = 

const openPickUpModal = () => {
  isPickUpModalOpen.value = true;
};

const openDropOffModal = () => {
  isDropOffModalOpen.value = true;
};
</script>
