<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>TestMain</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-button @click="modal = true">
        Open
      </ion-button>
    </ion-content>

    <DriverArriveAlertModal v-model:is-open="modal"></DriverArriveAlertModal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
} from '@ionic/vue';
import DriverArriveAlertModal from "@/components/DriverArriveAlertModal.vue";

const modal = ref(false);
</script>