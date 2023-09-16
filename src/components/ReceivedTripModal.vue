<template>
  <ion-modal :is-open="isOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Job Found</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="map2"></div>

      <ion-list>
        <ion-item>
          <ion-label>Pick-Up</ion-label>
          <ion-text>
            <h3><ion-icon :icon="location" color="primary"></ion-icon>{{ receivedTrip.pickup_place.name }}</h3>
            <p>{{ receivedTrip.pickup_place.address }}</p>
          </ion-text>
        </ion-item>

        <ion-item>
          <ion-label>Drop-Off</ion-label>
          <ion-text>
            <h3><ion-icon :icon="navigate" color="tertiary"></ion-icon>{{ receivedTrip.dropoff_place.name }}</h3>
            <p>{{ receivedTrip.dropoff_place.address }}</p>
          </ion-text>
        </ion-item>

        <ion-item>
          <ion-label>Trip Distance:</ion-label>
          <ion-note slot="end">{{ receivedTrip.distance }} km</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Trip Duration:</ion-label>
          <ion-note slot="end">{{ receivedTrip.duration }} mins</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Fare:</ion-label>
          <ion-note slot="end">RM {{ receivedTrip.fare }}</ion-note>
        </ion-item>
      </ion-list>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button :color="'primary'" expand="block" @click="acceptTrip">Accept</ion-button>
          </ion-col>
          <ion-col>
            <ion-button :color="'secondary'" expand="block" @click="closeModal">Decline</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, } from 'vue';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote, IonButton,
  IonGrid, IonRow, IonCol, IonText, IonIcon
} from '@ionic/vue';
import { useMainStore } from '@/store';
import { location, navigate } from 'ionicons/icons';
import googleMaps from '@/plugins/google-map';

const store = useMainStore();

const props = defineProps({
  isOpen: Boolean,
  receivedTrip: {
    type: Object as () => any,
    required: true,
  },
});

const googleMap = ref(null as any);

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    const center = await store.currentPosition as any
    // const pickUpPostion = await store.getPickUpPosition();

    googleMaps.load().then((maps: any) => {
      googleMap.value = new maps.Map(document.getElementById("map2"), {
        center: center,
        zoom: 5,
        disableDefaultUI: true,
      });
      googleMaps.calculateRoute(center, props.receivedTrip.pickup_place, googleMap.value);
    });
  }
});

const emit = defineEmits(['update:isOpen', 'accept', 'update:receivedTrip']);

function closeModal() {
  emit('update:isOpen', false);
}

function acceptTrip() {
  emit('update:isOpen', false);
  store.axios.post('/drivers/trips/acceptTrip', {
    trip_id: props.receivedTrip.id,
  }).then((response) => {
    const data = response.data;

    store.showToast({
      message: data.message,
      duration: 2000,
      position: 'middle',
    })

    if (data.status === 'success') {
      store.currentTrip = data.trip;
    }
  }).catch((err) => {
    console.log(err);
  });
}

</script>

<style>
#map2 {
  height: 200px;
  background-color: #f5f5f5;
}
</style>