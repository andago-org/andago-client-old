<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar color="primary" slot="bottom">
        <ion-tab-button tab="tab1" href="/passenger/profile">
          <ion-icon aria-hidden="true" :icon="person" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/passenger/trip">
          <ion-icon aria-hidden="true" :icon="car" />
          <ion-label>Trip</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/passenger/chat" @click="store.clearUnreadMessages">
          <ion-icon aria-hidden="true" :icon="chatbox" />
          <ion-label>Chat</ion-label>
          <UnreadMessageBadge></UnreadMessageBadge>
        </ion-tab-button>

<!--        <ion-tab-button tab="tab4" href="/passenger/settings">-->
<!--          <ion-icon aria-hidden="true" :icon="settings" />-->
<!--          <ion-label>Settings</ion-label>-->
<!--        </ion-tab-button>-->
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>

  <DriverArriveAlertModal v-model:is-open="driverArriveModalOpen"></DriverArriveAlertModal>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonBadge } from '@ionic/vue'
import { person, car, chatbox, settings } from 'ionicons/icons'
import UnreadMessageBadge from "@/components/UnreadMessageBadge.vue";
import DriverArriveAlertModal from "@/components/DriverArriveAlertModal.vue"
import { useMainStore } from "@/store";

const store = useMainStore();

const driverArriveModalOpen = ref(false)

onMounted(() => {
  if (store.currentTrip?.status == "arrived")
  {
    driverArriveModalOpen.value = true
  }

  store.echo.private(`PassengerChannel-${store.profile.id}`)
      .listen('.AddWaitTimeRequestEvent', (data: any) => {
        store.addWaitTimeRequestModalOpen = true
        console.log(11212)
      })
})
</script>

<style scoped>
ion-badge {
  --background: rgba(0,0,0,0.7);
  --color: white;
}
</style>