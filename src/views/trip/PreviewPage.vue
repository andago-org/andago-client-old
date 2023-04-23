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
        <ion-item>
          <ion-label>Distance</ion-label>
          <ion-text>
            <h2>{{ store.distance }} km</h2>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Estimated Duration</ion-label>
          <ion-text>
            <h2>{{ store.duration }}</h2>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Wallet Balance</ion-label>
          <ion-button :strong="true" color="primary" @click="openTopUpModal">Top Up</ion-button>

          <ion-text>
            <h2>{{ store.walletBalance }}</h2>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Fare</ion-label>
          <ion-text>
            <h2>RM {{ store.fare }}</h2>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-label>After Payment</ion-label>
          <ion-text :color="walletBalanceAfterPayment >= 0 ? 'dark' : 'danger'">
            <h2>{{ walletBalanceAfterPayment }}</h2>
          </ion-text>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button :strong="true" expand="block" color="primary"
              @click="googleMaps.calculateRoute">Confirm</ion-button>
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
import { defineProps, defineEmits, ref, computed, watch, onMounted, onUpdated, nextTick } from 'vue';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBackButton,
  IonButton, IonButtons, IonGrid, IonRow, IonCol, IonText, IonPage, IonFooter, IonNavLink
} from '@ionic/vue';
import { Place } from '@/interfaces/types';
import googleMaps from '@/plugins/google-map';
// import TopUpModal from '@/components/TopUpModal.vue';
import { useMainStore } from '@/store';

const store = useMainStore();

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
