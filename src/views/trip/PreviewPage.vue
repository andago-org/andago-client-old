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
            <h4>{{ store.pickUpPlace.name }}</h4>
            <p>{{ store.pickUpPlace.address }}</p>
          </ion-text>
        </ion-item>

        <ion-item>
          <ion-label>Drop-Off</ion-label>
          <ion-text>
            <h4>{{ store.dropOffPlace.name }}</h4>
            <p>{{ store.dropOffPlace.address }}</p>
          </ion-text>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-list>
        <ion-item v-for="item in checkoutDetails" :key="item.label" lines="none" style="max-height: 36px">
          <ion-icon :icon="item.icon" slot="start"></ion-icon>
          <ion-text>
            {{ item.label }}
          </ion-text>
          <ion-text slot="end">{{ item.value }}</ion-text>
        </ion-item>
      </ion-list>

      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button :strong="true" expand="block" color="primary" @click="store.createPayment">Confirm</ion-button>
          </ion-col>

          <ion-col>
            <ion-nav-link router-direction="back">
              <ion-button :strong="true" expand="block" color="secondary">Cancel</ion-button>
            </ion-nav-link>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { defineEmits, ref, computed, watch, onMounted, onUpdated, nextTick } from 'vue';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBackButton,
  IonButton, IonButtons, IonGrid, IonRow, IonCol, IonText, IonPage, IonFooter, IonNavLink, IonIcon
} from '@ionic/vue';
import { Place } from '@/interfaces/types';
import googleMaps from '@/plugins/google-map';
// import TopUpModal from '@/components/TopUpModal.vue';
import { useMainStore } from '@/store';
import { bookOutline, cashOutline, timeOutline, carOutline } from 'ionicons/icons';


const store = useMainStore();

const checkoutDetails = [
  {
    icon: bookOutline,
    label: 'Booking Fee',
    value: computed(() => store.walletBalance),
  },
  {
    icon: timeOutline,
    label: 'Time Add-On',
    value: computed(() => store.walletBalance),
  },
  {
    icon: carOutline,
    label: 'Distance Add-On',
    value: computed(() => store.walletBalance),
  },
  {
    icon: cashOutline,
    label: 'Total Fare',
    value: computed(() => store.fare),
  },
]

const center = store.pickUpPlace.coordinate;
const zoom = 5;
const start = store.pickUpPlace.coordinate;
const end = store.dropOffPlace.coordinate;
const directionsResult = ref(null);

const googleMap = ref(null as any);

onMounted(() => {
  googleMaps.load().then((maps: any) => {
    googleMap.value = new maps.Map(document.getElementById("map"), {
      center: center,
      zoom: zoom,
      disableDefaultUI: true,
    });
    googleMaps.calculateRoute(store.pickUpPlace.coordinate, store.dropOffPlace.coordinate, googleMap.value);
  });
});

const walletBalanceAfterPayment = ref(store.walletBalance - store.fare);

const topUpModalOpen = ref(false);

const emit = defineEmits(['confirm', 'cancel']);

function openTopUpModal() {
  topUpModalOpen.value = true;
}

function confirmModal() {
  emit('confirm');
}
</script>

<style>
#map {
  height: 200px;
  background-color: #f5f5f5;
}
</style>
