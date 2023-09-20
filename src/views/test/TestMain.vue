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

async function Test() {
  // console.log("position:", window.currentLocation)
  console.log(await store.getOneSignalPlayerId())
  // store.openMap()

  // navigator.geolocation.getCurrentPosition(function(position) {
  //   const lat = position.coords.latitude;
  //   const lng = position.coords.longitude;
  //   console.log(`Latitude: ${lat}, Longitude: ${lng}`)
  //   // Use lat and lng as needed
  // }, function(error) {
  //   console.error("Error obtaining geolocation:", error)
  // })


}

</script>