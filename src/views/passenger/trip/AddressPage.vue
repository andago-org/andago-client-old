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
          <ion-card style="width: 100%;">
            <ion-list>
              <ion-item button @click="store.topUpModalOpen = true">
                <ion-icon :icon="wallet" slot="start"></ion-icon>
                <ion-label>Wallet Balance</ion-label>
                <ion-text>{{ "RM " + store.profile?.balance }}</ion-text>
              </ion-item>

              <ion-item lines="none" button @click="store.openModal(VehiclePage)">
                <ion-icon :icon="car" slot="start"></ion-icon>
                <ion-label>Selected Car</ion-label>
                <ion-text>{{ store.profile?.selectedVehicle?.plate_number }}</ion-text>
              </ion-item>
            </ion-list>
          </ion-card>
        </ion-row>

        <ion-row>
          <ion-col>
            <AddressSearchModal :icon="location" v-model:value="store.pickUpPlace" title="Pick-Up Location"
              placeholder="Pick-Up">
            </AddressSearchModal>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <AddressSearchModal :icon="navigate" v-model:value="store.dropOffPlace" title="Drop-Off Location"
              placeholder="Drop-Off">
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
  IonPage, IonContent, IonButton, IonGrid, IonRow, IonCol, IonLoading, IonFooter, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonIcon, IonCheckbox, IonMenu, IonToolbar, IonItem, IonLabel, IonText
} from '@ionic/vue';
import { location, navigate } from 'ionicons/icons';
import { useMainStore } from '@/store';
import AddressSearchModal from '@/components/AddressSearchModal.vue';
import { car, wallet } from 'ionicons/icons';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import VehiclePage from "@/views/passenger/profile/VehiclePage.vue";

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

        store.currentTrip = data.trip;

        // router.go(0)
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