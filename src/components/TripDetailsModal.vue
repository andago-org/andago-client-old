<template>
  <ion-modal :is-open="isOpen" @dismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Trip Details</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="closeModal">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content scroll-y scroll="true" style="height: calc(100% - 56px);">
      <GoogleMap id="map" api-key="AIzaSyA-T6S3baY4-AZuTSc9Fryb9fCH8Ihi0Uc"
        :center="pickUpLocation"
        :zoom="15"
        :fullscreenControl="false"
        :disableDefaultUI="true"
      >
        <Marker v-if="pickUpLocation != null" :options="{ position: pickUpLocation }" />
        <Marker v-if="dropOffLocation != null" :options="{ position: dropOffLocation }" />
      </GoogleMap>

      <ion-list>
        <ion-item>
          <ion-label>Pick-Up</ion-label>
          <ion-text>
            <h4>{{ tripDetails.pickUp.name }}</h4>
            <p>{{ tripDetails.pickUp.formatted_address }}</p>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Drop-Off</ion-label>
          <ion-text>
            <h4>{{ tripDetails.dropOff.name }}</h4>
            <p>{{ tripDetails.dropOff.formatted_address }}</p>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Distance</ion-label>
          <ion-text>
            <h2>{{ tripDetails.distance }}</h2>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Estimated Duration</ion-label>
          <ion-text>
            <h2>{{ tripDetails.duration }}</h2>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Wallet Balance</ion-label>
          <ion-button :strong="true" color="primary" @click="openTopUpModal">Top Up</ion-button>
          
          <ion-text>
            <h2>{{ tripDetails.balance }}</h2>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Fare</ion-label>
          <ion-text>
            <h2>{{ tripDetails.fare }}</h2>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-label>After Payment</ion-label>
          <ion-text :color="tripDetails.result >= 0 ? 'dark' : 'danger'">
            <h2>{{ tripDetails.result }}</h2>
          </ion-text>
        </ion-item>
      </ion-list>

      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button :strong="true" expand="block" color="primary" @click="confirmModal">Confirm</ion-button>
          </ion-col>
          <ion-col>
            <ion-button :strong="true" expand="block" color="secondary" @click="closeModal">Cancel</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <TopUpModal v-model:isOpen="topUpModalOpen"></TopUpModal>
  </ion-modal>

  
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonButton, IonButtons, IonGrid, IonRow, IonCol, IonText
} from '@ionic/vue';
import { TripDetails } from '@/interfaces/types';
import { GoogleMap, Marker } from "vue3-google-map";
import { TopUpModal } from '@/components/TopUpModal.vue';

const pickUpLocation = ref(null);
const dropOffLocation = ref(null);

watch(
  () => props.tripDetails,
  (newValue, oldValue) => {
    pickUpLocation.value = {
      lat: newValue.pickUp.coordinate.latitude,
      lng: newValue.pickUp.coordinate.longitude
    };
    dropOffLocation.value = {
      lat: newValue.dropOff.coordinate.latitude,
      lng: newValue.dropOff.coordinate.longitude
    };
  },
);

const topUpModalOpen = ref(false);

const props = defineProps({
  isOpen: Boolean,
  tripDetails: {
    type: Object as () => TripDetails,
    required: true
  },
  test: {
    type: String,
    default: 'test'
  }
});

const emit = defineEmits(['update:isOpen', 'confirm', 'cancel']);

function openTopUpModal() {
  topUpModalOpen.value = true;
}

function closeModal() {
  emit('update:isOpen', false);
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

.gmnoprint, .gm-fullscreen-control, .gm-control-active {
  display: none !important;
}

</style>
