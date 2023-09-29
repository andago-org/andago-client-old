<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>TestMain</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-button @click="startCall">Start</ion-button>
      <ion-button @click="stopCall">Stop</ion-button>
    </ion-content>
  </ion-page>

  <PhoneCallModal :is-open="true"></PhoneCallModal>
</template>

<script setup lang="ts">
import {
  IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
} from '@ionic/vue';
import PhoneCallModal from "@/components/PhoneCallModal.vue";
import {useMainStore} from "@/store";

const store = useMainStore()

function startCall()
{
  store.startCalling('test')
}

function stopCall()
{
  store.stopCalling()
}
</script>