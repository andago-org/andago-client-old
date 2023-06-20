<template>
  <div>

  </div>
</template>

<script setup lang="ts">
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import TopUpModal from '@/components/TopUpModal.vue';
import { useMainStore } from '@/store';

const store = useMainStore();

store.echo.private(`PassengerChannel-${store.profile.id}`)
  .listen('.DriverUpdateEvent', (data: any) => {
    console.log(data)
    // googleMaps.drawDriverProgress(data.driverCoordinate, passengerCoordinate, googleMap.value);
  })
</script>

<style></style>