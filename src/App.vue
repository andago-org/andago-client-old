<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>

  <PhoneCallModal v-model:is-open="phoneCallModalOpen"></PhoneCallModal>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { useMainStore } from './store'
import { onMounted, watch, ref } from "vue";
import router from "@/router";
import PhoneCallModal from "@/components/PhoneCallModal.vue";

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
      .listen('.MessageSentEvent', async () => {
        console.log("Message received")
        if (router.currentRoute.value.name != "Chat") {
          store.unreadMessages++;
          console.log("Message received")
        }
      });
  }
})

const phoneCallModalOpen = ref(false)

watch(() => store.currentTrip?.calling, (newValue, oldValue) => {
  phoneCallModalOpen.value = newValue

  if (newValue == true)
  {
    store.startCalling(store.currentTrip?.id.toString())
  }
  else
  {
    store.stopCalling()
  }
}, {deep: true})
</script>
