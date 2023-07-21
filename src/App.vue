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
})

watch(() => store.currentTrip?.calling, async (newValue, oldValue) => {
  if (newValue == oldValue) {
    return
  }

  // const toast = await store.showToast({
  //   message: 'You are on call',
  //   // duration: 2000,
  //   position: 'top',
  //   icon: call,
  //   buttons: [
  //     {
  //       text: 'Close',
  //       role: 'cancel',
  //       icon: close,
  //       handler: () => {
  //         console.log('Cancel clicked');
  //         toast.dismiss()
  //         store.setCalling(false)
  //       },
  //     },
  //   ]
  // })

  if (newValue == true) {
    // AndroidBridge.startCall(store.currentTrip?.id.toString())
    // console.log(12121212)

  }
  else
  {
    // await toast.dismiss()
    // AndroidBridge.stopCall()
  }
})
</script>
