<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>TestMain</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-button @click="Test">
        Test
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
} from '@ionic/vue';
import {useMainStore} from "@/store";

const store = useMainStore();

function Test() {
  console.log(window.oneSignalPlayerId)
  // console.log(AndroidBridge.getOneSignalPlayerId())
  // store.openMap()
}

</script>