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
import { watch } from "vue";
import router from './router'

const store = useMainStore()

// store.loadTokenFromStorage()
//
// watch(() => store.token,
//   async () => {
//       console.log(store.token)
//     await store.saveTokenToStorage()
//
//     if (store.loggedIn) {
//       await store.getData()
//           .then(() => {
//             router.go(0)
//           })
//     }
//   }
// )

setInterval(() => {
  console.log(store.token)
  if (store.loggedIn) {
    store.getData();
  }
}, 5000);

</script>
