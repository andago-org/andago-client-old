<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Waiting for driver</ion-title>
      </ion-toolbar>

      <div id="driverProgressMap" style="height: 300px"></div>
    </ion-header>

    <ion-content>


      <ion-list>
        <ion-item>
          <ion-label>Pick-Up</ion-label>
          <ion-text>
            <h4>{{ currentTrip.pickup_place.name }}</h4>
            <p>{{ currentTrip.pickup_place.address }}</p>
          </ion-text>
        </ion-item>

        <ion-item>
          <ion-label>Drop-Off</ion-label>
          <ion-text>
            <h4>{{ currentTrip.dropoff_place.name }}</h4>
            <p>{{ currentTrip.dropoff_place.address }}</p>
          </ion-text>
        </ion-item>

        <ion-item lines="none">
          <ion-icon :icon="carOutline" slot="start"></ion-icon>
          <ion-text>
            Trip distance
          </ion-text>
          <ion-text slot="end">{{ currentTrip.preview.distance }}</ion-text>
        </ion-item>
        <ion-item lines="none">
          <ion-icon :icon="cashOutline" slot="start"></ion-icon>
          <ion-text>
            Trip fare
          </ion-text>
          <ion-text slot="end">{{ currentTrip.preview.total_fare.value }}</ion-text>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer class="ion-padding" v-if="currentTrip.status == 'arrived'">
      <ion-list>
        <ion-item>
          <ion-text>
            <h4>The driver has arrived!</h4>
            <p>Please start the trip before {{ currentTrip.waitTimeUp }} or extend your wait time. Otherwise the driver
              will be able to cancel
              the trip.</p>
          </ion-text>
        </ion-item>

        <ion-button expand="block" @click="getWaitPackages">Add Wait Time</ion-button>
      </ion-list>
    </ion-footer>
  </ion-page>

  <AddWaitTimeModal v-model:isOpen="addWaitTimeModalOpen" v-model:waitPackages="waitPackages"></AddWaitTimeModal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonText, IonPage, IonIcon, IonLabel, IonFooter,
  IonButton,
} from '@ionic/vue';
import { useMainStore } from '@/store';
import googleMaps from '@/plugins/google-map';
import { cashOutline, timeOutline, carOutline } from 'ionicons/icons';
import AddWaitTimeModal from '@/components/AddWaitTimeModal.vue';

const store = useMainStore();

const addWaitTimeModalOpen = ref(false);
const waitPackages = ref([]);

const googleMap = ref(null as any);

const center = store.currentTrip.pickup_place.coordinate;
const zoom = 5;
const pickUpCoordinate = ref(store.currentTrip.pickup_place.coordinate);
const driverCoordinate = ref(store.currentTrip.driver.coordinate);

const currentTrip = ref(store.currentTrip);

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