<template>
  <div>

  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/store';

const store = useMainStore();

store.echo.private(`PassengerChannel-${store.profile.id}`)
  .listen('.DriverUpdateEvent', (data: any) => {
    console.log(data)
    // googleMaps.drawDriverProgress(data.driverCoordinate, passengerCoordinate, googleMap.value);
  })
  .listen('.AddWaitTimeRequestEvent', (data: any) => {
    store.addWaitTimeRequestModalOpen = true
  })
</script>

<style></style>