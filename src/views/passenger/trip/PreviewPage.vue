<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Trip Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <div id="map"></div>

    <ion-content scroll-y scroll="true" style="height: calc(100% - 56px);">
      <ion-list>
        <ion-item>
          <ion-label>Pick-Up</ion-label>
          <ion-text>
            <h4>{{ currentTrip.pickup_place.name }}</h4>
            <p>{{ currentTrip.pickup_place.address }}</p>
          </ion-text>
        </ion-item>

        <ion-item>
          <ion-label>Drop-Off</ion-label>
          <ion-text>
            <h4>{{ currentTrip.dropoff_place.name }}</h4>
            <p>{{ currentTrip.dropoff_place.address }}</p>
          </ion-text>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-list>
        <ion-item lines="none">
          <ion-icon :icon="bookOutline" slot="start"></ion-icon>
          <ion-text>
            {{ currentTrip.preview.min_fare.text }}
          </ion-text>
          <ion-text slot="end">{{ currentTrip.preview.min_fare.value }}</ion-text>
        </ion-item>
        <ion-item lines="none">
          <ion-icon :icon="carOutline" slot="start"></ion-icon>
          <ion-text>
            {{ currentTrip.preview.distance_addon.text }}
          </ion-text>
          <ion-text slot="end">{{ currentTrip.preview.distance_addon.value }}</ion-text>
        </ion-item>
        <ion-item lines="none">
          <ion-icon :icon="timeOutline" slot="start"></ion-icon>
          <ion-text>
            {{ currentTrip.preview.duration_addon.text }}
          </ion-text>
          <ion-text slot="end">{{ currentTrip.preview.duration_addon.value }}</ion-text>
        </ion-item>
        <ion-item lines="none">
          <ion-icon :icon="cashOutline" slot="start"></ion-icon>
          <ion-text>
            {{ currentTrip.preview.total_fare.text }}
          </ion-text>
          <ion-text slot="end">{{ currentTrip.preview.total_fare.value }}</ion-text>
        </ion-item>
      </ion-list>

      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button :strong="true" expand="block" color="primary" @click="confirmTrip">Confirm</ion-button>
          </ion-col>

          <ion-col>
            <ion-nav-link router-direction="back">
              <ion-button :strong="true" expand="block" color="secondary" @click="cancelTrip">Cancel</ion-button>
            </ion-nav-link>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-footer>
  </ion-page>

  <TopUpModal v-model:isOpen="topUpModalOpen" />
</template>

<script setup lang="ts">
import { ref, onMounted, } from 'vue';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonGrid, IonRow, IonCol,
  IonText, IonPage, IonFooter, IonNavLink, IonIcon,
} from '@ionic/vue';
import googleMaps from '@/plugins/google-map';
import { useMainStore } from '@/store';
import { bookOutline, cashOutline, timeOutline, carOutline } from 'ionicons/icons';
import TopUpModal from '@/components/TopUpModal.vue';

const store = useMainStore();

const currentTrip = store.currentTrip;

const topUpModalOpen = ref(false);

const center = store.pickUpPlace?.coordinate;
const zoom = 5;
const start = store.currentTrip?.pickup_place.coordinate;
const end = store.currentTrip?.dropoff_place.coordinate;

const googleMap = ref(null as any);

onMounted(() => {
  googleMaps.load().then((maps: any) => {
    googleMap.value = new maps.Map(document.getElementById("map"), {
      center: center,
      zoom: zoom,
      disableDefaultUI: true,
    });
    googleMaps.calculateRoute(start, end, googleMap.value);
  });
});

function confirmTrip() {
  store.axios.post('/passengers/trips/confirmTrip')
    .then(async (response: any) => {
      const data = response.data;

      store.currentTrip = data.trip;

    }).catch((error: any) => {
      console.log(error.response.data);
    });
}

function cancelTrip() {
  store.pickUpPlace = store.currentTrip?.pickup_place;
  store.dropOffPlace = store.currentTrip?.dropoff_place;

  store.axios.post('/passengers/trips/cancelTrip')
    .then(async (response: any) => {
      const data = response.data;

      store.currentTrip = data.trip;

    }).catch((error: any) => {
      store.currentTrip = null;
      console.log(error.response.data);
    });
}
</script>

<style>
#map {
  height: 200px;
  background-color: #f5f5f5;
}
</style>
