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
          <!-- <ion-nav-link style="width: 100%;" router-direction="forward" :component="VehiclePage"> -->
          <ion-card style="width: 100%;">
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
                    <ion-card-title class="ion-text-center">{{ store.profile.selectedVehicle.plate_number
                    }}</ion-card-title>
                  </ion-col>
                  <ion-col size="auto" class="ion-align-items-center">
                    <ion-checkbox :checked="true" :disabled="true"></ion-checkbox>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
          <!-- </ion-nav-link> -->
        </ion-row>

        <ion-row>
          <ion-col>
            <AddressSearchModal :icon="location" v-model:value="store.pickUpPlace" title="Pick-Up Location"
              placeholder="Search for address">
            </AddressSearchModal>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <AddressSearchModal :icon="navigate" v-model:value="store.dropOffPlace" title="Drop-Off Location"
              placeholder="Search for address">
            </AddressSearchModal>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>

            <ion-button expand="block" @click="createTrip" :disabled="!proceedable">Confirm</ion-button>

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
import { ref, watch, computed } from 'vue';
import {
  IonPage, IonContent, IonSearchbar, IonButton,
  IonGrid, IonRow, IonCol, IonLoading, IonNavLink, IonFooter, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonIcon, IonCheckbox
} from '@ionic/vue';
import { location, navigate } from 'ionicons/icons';
import { useMainStore } from '@/store';
import AddressSearchModal from '@/components/AddressSearchModal.vue';
import PreviewPage from './PreviewPage.vue';
import VehiclePage from '../profile/VehiclePage.vue';
import { Place } from '@/interfaces/types';
import { car } from 'ionicons/icons';
import { Splide, SplideSlide } from '@splidejs/vue-splide';

const store = useMainStore();

const searchDriversLoadingOpen = ref(false);

const proceedable = computed(
  () => !store.isObjectEmpty(store.pickUpPlace) && !store.isObjectEmpty(store.dropOffPlace)
);

watch(() => store.vehicles, (newValue) => {
  newValue.forEach((vehicle) => {
    if (vehicle.selected) {
      store.selectedVehicle = vehicle;
    }
  });
});

async function createTrip() {
  const loading = await store.showLoading({});

  const data = {
    pickUp: store.pickUpPlace,
    dropOff: store.dropOffPlace,
  }

  store.axios.post("passengers/trips/createTrip", data)
    .then((response) => {
      if (response.status === 200) {
        const data = response.data;

        store.paymentDetails = data.paymentDetails;

        store.ionNav.push(PreviewPage);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  loading.dismiss();
}
</script>

<style>
ion-checkbox {
  --size: 24px
}
</style>