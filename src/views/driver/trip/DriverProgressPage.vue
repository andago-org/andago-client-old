<template>
  <div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { } from '@ionic/vue';
import googleMaps from '@/plugins/google-map';
import { useMainStore } from '@/store';

const store = useMainStore();

const googleMap = ref(null as any);

const center = store.currentTrip.pickup_place.coordinate;
const zoom = 5;
const pickUpCoordinate = ref(store.currentTrip.pickup_place.coordinate);
const driverCoordinate = ref(store.currentTrip.driver.coordinate);

onMounted(() => {
  googleMaps.load().then((maps: any) => {
    googleMap.value = new maps.Map(document.getElementById("driverProgressMap"), {
      center: center,
      zoom: zoom,
      disableDefaultUI: true,
    });

    const passengerIcon = {
      url: require('@/img/map_markers/passenger.png'),
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(25, 25)
    };

    const driverIcon = {
      url: require('@/img/map_markers/car.png'),
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(25, 25)
    };

    const pickUpMarker = new google.maps.Marker({
      position: pickUpCoordinate.value,
      map: googleMap.value,
      icon: passengerIcon
    });

    const driverMarker = new google.maps.Marker({
      position: driverCoordinate.value,
      map: googleMap.value,
      icon: driverIcon
    });

    refreshMap()

    watch(
      () => store.currentTrip.driver.coordinate,
      (newVal) => {
        driverCoordinate.value = newVal;

        refreshMap()
      }
    )

    function refreshMap() {
      driverMarker.setPosition(driverCoordinate.value);

      const bounds = new google.maps.LatLngBounds();

      // add your points to bounds
      bounds.extend(driverMarker.getPosition() as google.maps.LatLng);
      bounds.extend(pickUpMarker.getPosition() as google.maps.LatLng);

      // fit the map to the new bounds
      googleMap.value.fitBounds(bounds);
    }
  });
});
</script>