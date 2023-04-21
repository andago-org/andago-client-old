<template>
  <ion-modal :is-open="isOpen" @dismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Job Found</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label>Pick-Up:</ion-label>
          <ion-note slot="end">{{ tripDetails.pickUp.name }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Drop-Off:</ion-label>
          <ion-note slot="end">{{ tripDetails.dropOff.name }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Distance:</ion-label>
          <ion-note slot="end">{{ tripDetails.distance }} km</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Fare:</ion-label>
          <ion-note slot="end">RM {{ tripDetails.fare }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Estimated Duration:</ion-label>
          <ion-note slot="end">{{ tripDetails.duration }} mins</ion-note>
        </ion-item>
      </ion-list>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button :color="'primary'" expand="block" @click="acceptTripDetails()">Accept</ion-button>
          </ion-col>
          <ion-col>
            <ion-button :color="'secondary'" expand="block" @click="declineTripDetails()">Decline</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote, IonButton, IonButtons, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { TripDetails } from '@/interfaces/types';

defineProps({
  isOpen: Boolean,
  tripDetails: {
    type: Object as () => TripDetails,
    required: true,
  },
});

const emit = defineEmits(['update:isOpen', 'accept', 'decline', 'update:tripDetails']);

function closeModal() {
  emit('update:isOpen', false);
}

function acceptTripDetails() {
  emit('accept');
}

function declineTripDetails() {
  emit('decline');
}
</script>
