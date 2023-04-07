<template>
  <ion-modal :is-open="isOpen" @dismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Trip Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label>Origin</ion-label>
          <ion-note slot="end">{{ tripDetails.origin }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Destination</ion-label>
          <ion-note slot="end">{{ tripDetails.destination }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Distance</ion-label>
          <ion-note slot="end">{{ tripDetails.distance }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Duration</ion-label>
          <ion-note slot="end">{{ tripDetails.duration }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Fare</ion-label>
          <ion-note slot="end">{{ tripDetails.fare }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button :strong="true" color="danger" @click="cancelModal">Cancel</ion-button>
          <ion-button :strong="true" color="success" @click="confirmModal">Confirm</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote, IonFooter, IonButton } from '@ionic/vue';
import { TripDetails } from '@/interfaces/types';

const props = defineProps({
  isOpen: Boolean,
  tripDetails: {
    type: Object as () => TripDetails,
    required: true
  }
});

const emit = defineEmits(['update:isOpen', 'confirm', 'cancel']);

function closeModal() {
  emit('update:isOpen', false);
}

function confirmModal() {
  emit('confirm');
}

function cancelModal() {
  emit('cancel');
}
</script>
