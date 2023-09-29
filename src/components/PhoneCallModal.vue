<template>
  <ion-modal :is-open="isOpen">
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Phone Call</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <ion-grid class="ion-text-center" style="height: 100%">
          <ion-row class="ion-justify-content-center ion-align-items-center" style="height: 100%;">
            <ion-col class="ion-align-self-center" size="auto">
              <h1>You are on a phone call with {{ callerName }}</h1>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>


      <ion-footer>
        <ion-grid class="ion-text-center ion-padding">
          <ion-row class="ion-justify-content-center">
            <ion-fab-button @click="store.setCalling(false)">
              <ion-icon :icon="call"></ion-icon>
            </ion-fab-button>
          </ion-row>
        </ion-grid>
      </ion-footer>
    </ion-page>
  </ion-modal>
</template>

<script setup lang="ts">
import {computed, defineProps} from 'vue'
import {
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  IonPage,
  IonFab,
  IonFabButton,
  IonIcon,
  IonFooter,
  IonRow, IonGrid
} from '@ionic/vue'
import {add, call} from 'ionicons/icons'
import {useMainStore} from "@/store"

const store = useMainStore()

console.log(store.profile)

const callerName = computed(
    () => {

      return store.profile.userType == 'passenger' ?
          store.currentTrip?.driver?.user?.name :
          store.currentTrip?.passenger?.user?.name
    }
)

const props = defineProps({
  isOpen: Boolean,
})

</script>