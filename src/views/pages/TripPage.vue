<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Trip Test</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <n-carousel draggable>
        <img v-for="i in 4" :key="i" class="carousel-img" src="@/img/splash.png">
      </n-carousel>

      <ion-grid class="navigationPanel">
        <ion-row>
          <ion-col>
            <ion-searchbar :search-icon="location" placeholder="Pick-Up" @ion-focus="openPickUpModal"
              :value="pickUp.name">
            </ion-searchbar>
            <AddressSearchModal v-model:value="pickUp" v-model:isOpen="isPickUpModalOpen" title="Pick-Up Location"
              placeholder="Search for address">
            </AddressSearchModal>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-searchbar :search-icon="navigate" placeholder="Drop-Off" @ion-focus="openDropOffModal"
              :value="dropOff.name"></ion-searchbar>
            <AddressSearchModal v-model:value="dropOff" v-model:isOpen="isDropOffModalOpen" title="Drop-Off Location"
              placeholder="Search for address">
            </AddressSearchModal>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-button expand="block" @click="getTripDetails">Confirm</ion-button>
            <TripDetailsModal v-model:isOpen="isTripDetailsModalOpen" v-model:tripDetails="tripDetails"
              @confirm="createTrip">
            </TripDetailsModal>

            <ion-loading :is-open="searchDriversLoadingOpen" class="searchDriversLoading" message="Searching for Drivers"
              duration="30000">
            </ion-loading>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonButton,
  IonGrid, IonRow, IonCol, IonLoading
} from '@ionic/vue';
import { NCarousel } from 'naive-ui';
import TripDetailsModal from '@/components/TripDetailsModal.vue';
import { Place, TripDetails } from '@/interfaces/types';
import { location, navigate } from 'ionicons/icons';
import { useMainStore } from '@/store';
import AddressSearchModal from '@/components/AddressSearchModal.vue';

const store = useMainStore();

const isPickUpModalOpen = ref(false);
const isDropOffModalOpen = ref(false);

const isTripDetailsModalOpen = ref(false);

const searchDriversLoadingOpen = ref(false);

const pickUp = ref<Place>({} as Place);
const dropOff = ref<Place>({} as Place);

const tripDetails = ref({} as TripDetails);

const openPickUpModal = () => {
  isPickUpModalOpen.value = true;
};

const openDropOffModal = () => {
  isDropOffModalOpen.value = true;
};

const openTripDetailsModal = () => {
  isTripDetailsModalOpen.value = true;
};

const getTripDetails = async () => {
  tripDetails.value = await store.getTripDetails(pickUp.value, dropOff.value)

  openTripDetailsModal();
};

const createTrip = () => {
  store.createTrip(tripDetails.value);

  searchDriversLoadingOpen.value = true;
};


</script>

<style scoped>
.navigationPanel {
  position: fixed;
  bottom: 24px;
  width: 100%;
}

.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}
</style>