<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <Splide :options="{ rewind: true }" aria-label="My Favorite Images">
        <SplideSlide v-for="i in 4" :key="i">
          <img src="@/img/splash.png" alt="Sample 1">
        </SplideSlide>
      </Splide>

    </ion-content>

    <ion-footer>
      <ion-grid>
        <ion-row>
          <!-- <ion-card style="width: 100%; padding: 0 20px  20px 20px">
            <div class="ion-text-center">Selected Car</div>

            <ion-card-content>
              <ion-card v-if="store.selectedVehicle">
                <ion-grid>
                  <ion-row>
                    <ion-col size="auto">
                      <ion-icon :icon="car" size="large"></ion-icon>
                    </ion-col>
                    <ion-col>
                      <ion-card-title>{{ store.selectedVehicle.name }}</ion-card-title>
                    </ion-col>
                    <ion-col size="auto" class="ion-align-items-center">
                      <ion-checkbox :checked="true"></ion-checkbox>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-card>
              <ion-card v-else style="padding: 0 10px 10px 10px">
                <ion-text>
                  <h3>You don't have car added yet, go Manage your cars</h3>
                </ion-text>
              </ion-card>
            </ion-card-content>

            <ion-nav-link router-direction="forward" :component="VehiclePage">
              <ion-button expand="block">Manage</ion-button>
            </ion-nav-link>
          </ion-card> -->

          <ion-nav-link style="width: 100%;" router-direction="forward" :component="VehiclePage">
            <ion-card>
              <ion-card-header>
                <ion-card-title class="ion-text-center">Selected Car</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-grid>
                  <ion-row>
                    <ion-col size="auto">
                      <ion-icon :icon="car" size="large"></ion-icon>
                    </ion-col>
                    <ion-col>
                      <ion-card-title class="ion-text-center">{{ store.selectedVehicle?.name }}</ion-card-title>
                    </ion-col>
                    <ion-col size="auto" class="ion-align-items-center">
                      <ion-checkbox :checked="true"></ion-checkbox>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-card-content>
            </ion-card>
          </ion-nav-link>
        </ion-row>

        <ion-row>
          <ion-col>
            <ion-searchbar :search-icon="location" placeholder="Pick-Up" @ion-focus="openPickUpModal"
              :value="store.pickUpPlace.name">
            </ion-searchbar>
            <AddressSearchModal v-model:value="store.pickUpPlace" v-model:isOpen="isPickUpModalOpen"
              title="Pick-Up Location" placeholder="Search for address">
            </AddressSearchModal>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-searchbar :search-icon="navigate" placeholder="Drop-Off" @ion-focus="openDropOffModal"
              :value="store.dropOffPlace.name"></ion-searchbar>
            <AddressSearchModal v-model:value="store.dropOffPlace" v-model:isOpen="isDropOffModalOpen"
              title="Drop-Off Location" placeholder="Search for address">
            </AddressSearchModal>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>

            <ion-nav-link router-direction="forward" :component="PreviewPage">
              <ion-button expand="block" @click="createTripPayment">Confirm</ion-button>
            </ion-nav-link>

            <ion-loading :is-open="searchDriversLoadingOpen" class="searchDriversLoading" message="Searching for Drivers"
              :duration="30000">
            </ion-loading>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonButton,
  IonGrid, IonRow, IonCol, IonLoading, IonNavLink, IonFooter, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonText, IonCheckbox
} from '@ionic/vue';
// import { NCarousel } from 'naive-ui';
import TripDetailsModal from '@/components/TripDetailsModal.vue';
import { Place, TripDetails } from '@/interfaces/types';
import { location, navigate } from 'ionicons/icons';
import { useMainStore } from '@/store';
import AddressSearchModal from '@/components/AddressSearchModal.vue';
import PreviewPage from './PreviewPage.vue';
import VehiclePage from '../vehicle/VehiclePage.vue';
import { car } from 'ionicons/icons';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import { NEmpty } from 'naive-ui';

const store = useMainStore();

const isPickUpModalOpen = ref(false);
const isDropOffModalOpen = ref(false);

const isTripDetailsModalOpen = ref(false);

const searchDriversLoadingOpen = ref(false);

watch(() => store.vehicles, (newValue) => {
  newValue.forEach((vehicle) => {
    if (vehicle.selected) {
      store.selectedVehicle = vehicle;
    }
  });
});

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

// const getTripDetails = async () => {
//   tripDetails.value = await store.getTripDetails(pickUpPlace.value, dropOffPlace.value)
//   console.log(tripDetails.value)
//   openTripDetailsModal();
// };

const createTripPayment = async () => {
  await store.createTripPayment();
};

// const createTrip = () => {
//   store.createTrip(tripDetails.value);

//   searchDriversLoadingOpen.value = true;
// };


</script>

<style>
ion-checkbox {
  --size: 24px
}
</style>