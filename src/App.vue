<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>

  <audio id="localAudio" autoplay muted></audio>
  <audio id="remoteAudio" autoplay></audio>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { useMainStore } from './store'
import { call, close } from 'ionicons/icons'
import {onMounted, watch} from "vue";
import router from "@/router";

const store = useMainStore()

setInterval(() => {
  if (store.loggedIn) {
    store.getData()
  }

  if (store.profile?.userType == 'driver') {
    store.updatePosition()
  }
}, 5000);

onMounted(async () => {
  const userId = await store.profile?.user?.id

  if (userId) {
    store.echo.private(`UserChannel-${userId}`)
      .listen('.MessageSentEvent', async (data: any) => {
        console.log("Message received")
        if (router.currentRoute.value.name != "Chat") {
          store.unreadMessages++;
          console.log("Message received")
        }
      });
  }

  if (store.isIos)
  {
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // console.log(`Latitude: ${lat}, Longitude: ${lng}`)
        window.currentLocation = `${lat},${lng}`

        // Use lat and lng as needed
      }, function(error) {
        console.error("Error obtaining geolocation:", error)
      })
    }, 5000);
  }
})
</script>
