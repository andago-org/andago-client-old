<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar color="primary" slot="bottom">
        <ion-tab-button tab="tab1" href="/driver/profile">
          <ion-icon aria-hidden="true" :icon="person" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/driver/trip">
          <ion-icon aria-hidden="true" :icon="car" />
          <ion-label>Job</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/driver/chat">
          <ion-icon aria-hidden="true" :icon="chatbox" />
          <ion-label>Chat</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/driver/settings">
          <ion-icon aria-hidden="true" :icon="settings" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>

  <ReceivedTripModal v-model:isOpen="receivedTripModalOpen" v-model:received-trip="receivedTrip">
  </ReceivedTripModal>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { person, car, chatbox, settings } from 'ionicons/icons';
import { useMainStore } from '@/store';
import { Geolocation } from '@capacitor/geolocation';
import { Coordinate } from '@/interfaces/types';
import ReceivedTripModal from '@/components/ReceivedTripModal.vue';

const store = useMainStore();

const receivedTripModalOpen = ref(false);
const receivedTrip = ref({} as any);

const receivedTrips = ref([] as any[]);

store.echo.private(`DriverChannel-${store.profile.id}`)
  .listen('.TripConfirmedEvent', async (data: any) => {

    if (receivedTripModalOpen.value) {
      receivedTrips.value.push(data.trip);
    }
    else {
      receivedTrip.value = data.trip;
      receivedTripModalOpen.value = true;
    }
  });

watch(
  () => receivedTripModalOpen.value,
  (value) => {
    if (!value) {
      if (receivedTrips.value.length > 0) {
        setTimeout(() => {
          receivedTrip.value = receivedTrips.value.shift();
          receivedTripModalOpen.value = true;
        }, 500);
      }
    }
  }
);

store.echo.join('DriverChannel');

Geolocation.watchPosition({}, (position, err) => {
  const data = {
    position: {
      lat: position?.coords.latitude,
      lng: position?.coords.longitude
    } as Coordinate
  }

  store.axios.post('/drivers/updatePosition', data)
    .then((response) => {
      // console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
});
</script>