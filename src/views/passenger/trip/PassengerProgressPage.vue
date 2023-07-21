<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>

      <div id="driverProgressMap" style="height: 300px"></div>
    </ion-header>

    <ion-content>
      <ion-fab slot="fixed" vertical="top" horizontal="end" :edge="true">
        <ion-fab-button @click="store.setCalling(true)" color="primary">
          <ion-icon :icon="call"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-list>
        <ion-item lines="full">
          <ion-icon :icon="personCircleOutline" slot="start" size="large"></ion-icon>
          <ion-label>
            <h1>{{ currentTrip?.driver?.user?.name }}</h1>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>Pick-Up</ion-label>
          <ion-text>
            <h4>{{ currentTrip?.pickup_place.name }}</h4>
            <p>{{ currentTrip?.pickup_place.address }}</p>
          </ion-text>
        </ion-item>

        <ion-item>
          <ion-label>Drop-Off</ion-label>
          <ion-text>
            <h4>{{ currentTrip?.dropoff_place?.name }}</h4>
            <p>{{ currentTrip?.dropoff_place?.address }}</p>
          </ion-text>
        </ion-item>

        <ion-item lines="none">
          <ion-icon :icon="carOutline" slot="start"></ion-icon>
          <ion-text>
            Trip distance
          </ion-text>
          <ion-text slot="end">{{ currentTrip?.preview?.distance }}</ion-text>
        </ion-item>
        <ion-item lines="none">
          <ion-icon :icon="cashOutline" slot="start"></ion-icon>
          <ion-text>
            Trip fare
          </ion-text>
          <ion-text slot="end">{{ currentTrip?.preview?.total_fare?.value }}</ion-text>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer class="ion-padding" v-if="currentTrip.status == 'arrived'">
      <ion-list>
        <ion-item>
          <ion-text>
            <h5>The driver has arrived!</h5>
            <p>Please start the trip before <ion-text color="primary">{{ waitUntil.toLocaleTimeString() }}</ion-text> or extend your wait time. Otherwise the driver
              will be able to cancel
              the trip.</p>
          </ion-text>
        </ion-item>
        <ion-item v-if="calculateRemainingWaitTime() > 0">
          <ion-icon :icon="timerOutline"></ion-icon>
          <ion-text>
            <h4>Remaining Wait Time: {{ remainingWaitTimeText }}</h4>
          </ion-text>
        </ion-item>
        <ion-item v-else>
          <ion-icon :icon="timerOutline"></ion-icon>
          <ion-text color="primary">
            <h4>Time Up! Please Add Wait Time!</h4>
          </ion-text>
        </ion-item>

        <ion-button expand="block" @click="getWaitPackages">Add Wait Time</ion-button>
      </ion-list>
    </ion-footer>
  </ion-page>

  <AddWaitTimeModal v-model:isOpen="addWaitTimeModalOpen" v-model:waitPackages="waitPackages"></AddWaitTimeModal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonText, IonPage, IonIcon, IonLabel, IonFooter,
  IonButton, IonFab, IonFabButton,
} from '@ionic/vue';
import { useMainStore } from '@/store';
import googleMaps from '@/plugins/google-map';
import {cashOutline, personCircleOutline, carOutline, call, timerOutline} from 'ionicons/icons';
import AddWaitTimeModal from '@/components/AddWaitTimeModal.vue';

const store = useMainStore();

const addWaitTimeModalOpen = ref(false);
const waitPackages = ref([]);

const googleMap = ref(null as any);

const center = store.currentTrip.pickup_place.coordinate;
const zoom = 5;
const pickUpCoordinate = ref(store.currentTrip?.pickup_place?.coordinate);
const driverCoordinate = ref(store.currentTrip?.driver?.coordinate);

const currentTrip = ref(store.currentTrip);

const title = computed(() => {
  switch (currentTrip.value.status) {
    case 'accepted':
      return 'Waiting for driver';
    case 'arrived':
      return 'Driver has arrived';
    case 'started':
      return 'Heading to destination';
    default:
      return '';
  }
});

const waitUntil = computed(() => {
  return new Date(store.currentTrip?.waitUntil);
});

const remainingWaitTime = ref(calculateRemainingWaitTime());
const remainingWaitTimeText = ref("");

function calculateRemainingWaitTime()
{
  if (!waitUntil.value) return 0;

  const remainingTime = Math.max(0, waitUntil.value.getTime() - new Date().getTime());

  const seconds = Math.floor(remainingTime / 1000);
  return seconds;
}

function updateRemainingWaitTimeText()
{
  const minutes = Math.floor(remainingWaitTime.value / 60);
  const seconds = Math.floor((remainingWaitTime.value % 60));
  remainingWaitTimeText.value = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

setInterval(() => {
  remainingWaitTime.value = calculateRemainingWaitTime()
  updateRemainingWaitTimeText()
}, 1000);

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

function getWaitPackages() {
  store.axios.post('/passengers/wait_packages/getWaitPackages')
    .then((response) => {
      const data = response.data;

      waitPackages.value = data.waitPackages;

      addWaitTimeModalOpen.value = true;
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>