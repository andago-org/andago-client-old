<template>
  <ion-modal :is-open="isOpen" @dismiss="closeModal" :backdropDismiss="false">
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Driver Arrived</ion-title>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="closeModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-text>
          <h1>Add Wait Time Request</h1>
          <p>The driver suggests you to add wait time.</p>
        </ion-text>
      </ion-content>

      <ion-footer class="ion-padding ion-text-center">
        <ion-button @click="store.addWaitTimeModalOpen = true">
          Add Wait Time
        </ion-button>
      </ion-footer>
    </ion-page>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal, IonButton, IonText, IonContent, IonList, IonItem, IonLabel, IonInput, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonPage,
} from '@ionic/vue';
import { ref, defineEmits, onMounted, watch } from 'vue';
import { useMainStore } from '@/store';

const store = useMainStore();

defineProps({
  isOpen: Boolean,
});

const topUpAmount = ref(0);

const emit = defineEmits(['update:isOpen']);

function closeModal() {
  emit('update:isOpen', false);
}
</script>

<style scoped>
ion-modal {
  --width: 90%;
  --height: 36%;
  --border-radius: 16px;
  --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
</style>