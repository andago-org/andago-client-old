<template>
  <ion-page>
    <div id="driverProgressMap" style="height: 400px"></div>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { IonPage } from '@ionic/vue';
import { useMainStore } from '@/store';
import googleMaps from '@/plugins/google-map';
import Pusher from 'pusher-js';

const store = useMainStore();

const googleMap = ref(null as any);

const center = store.pickUpPlace.coordinate;
const zoom = 5;
const driverCoordinate = store.pickUpPlace.coordinate;
const passengerCoordinate = store.pickUpPlace.coordinate;

onMounted(() => {
  googleMaps.load().then((maps: any) => {
    googleMap.value = new maps.Map(document.getElementById("driverProgressMap"), {
      center: center,
      zoom: zoom,
      disableDefaultUI: true,
    });
    googleMaps.drawDriverProgress(driverCoordinate, passengerCoordinate, googleMap.value);
  });

  const pusher = new Pusher('a294542618ad0c79d7b7', {
    cluster: 'ap1'
  });

  const channel = pusher.subscribe('user-channel-' + store.user?.id);
  channel.bind('trip-accepted-event', async function (event: any) {
    const data = event.data;


  });
});
</script>