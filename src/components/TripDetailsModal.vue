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

    <ion-content>
      <div class="map-container">

      </div>
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
          <ion-label>Fare</ion-label>
          <ion-text>
            <h2>{{ tripDetails.fare }}</h2>
          </ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Estimated Duration</ion-label>
          <ion-text>
            <h2>{{ tripDetails.duration }}</h2>
          </ion-text>
        </ion-item>
      </ion-list>

      <ion-grid>
        <ion-row class="ion-align-items-end">
          <ion-col>
            <ion-button expand="block" :strong="true" color="primary" @click="confirmModal">Confirm</ion-button>
          </ion-col>
          <ion-col>
            <ion-button expand="block" :strong="true" color="secondary" @click="closeModal">Cancel</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonButton, IonButtons, IonGrid, IonRow, IonCol, IonText
} from '@ionic/vue';
import { TripDetails } from '@/interfaces/types';

defineProps({
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

function closeModal() {
  emit('update:isOpen', false);
}

function confirmModal() {
  emit('confirm');
}
</script>

<style scoped>
.map-container {
  height: 250px;
  background-color: #f5f5f5;
}
</style>
