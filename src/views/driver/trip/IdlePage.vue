<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Driver Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card class="ion-text-center">
        <ion-card-header>
          <ion-card-title>
            <ion-text>
              <h1>Status</h1>
            </ion-text>
          </ion-card-title>
        </ion-card-header>
        <ion-card-content class="toggle-container">
          <ion-toggle mode="ios" :checked="store.profile?.on_duty" @click="updateOnDuty"></ion-toggle>
        </ion-card-content>
      </ion-card>

      <div id="navigationMap" style="height: 400px"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonToggle, IonText,
} from '@ionic/vue';
import { onMounted, } from 'vue';
import { useMainStore } from '@/store';
import googleMaps from '@/plugins/google-map';

const store = useMainStore();

onMounted(() => {
  // Load the Google Maps API
  googleMaps.load().then(async (maps: any) => {
    // Initialize the map
    const map = new maps.Map(document.getElementById('navigationMap'), {
      center: await store.currentPosition,
      zoom: 18,
    });

    // setInterval(
    //   async () => {
    const startCoords = await store.currentPosition;
    const endCoords = { lat: 3.0830124, lng: 101.662267 };
    await googleMaps.startNavigator(startCoords, endCoords, map);
    //   },
    //   1000
    // );
  })
})

function updateOnDuty()
{
  const data = {
    on_duty: !store.profile.on_duty,
  }

  store.axios.post('/drivers/updateOnDuty', data)
      .then((response) => {
        //
      })
      .catch((error) => {
        console.log(error)
      })
}

</script>

<style scoped>
ion-toggle {
  zoom: 1.6;
}
</style>