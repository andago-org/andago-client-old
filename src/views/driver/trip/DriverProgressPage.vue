<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>


    </ion-header>

    <div id="driverMap" style="height: 300px"></div>

    <ion-content>
      <ion-fab slot="fixed" vertical="top" horizontal="end" :edge="true">
        <ion-fab-button @click="store.call" color="primary">
          <ion-icon :icon="call"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-list>
        <ion-item lines="none">
          <ion-icon :icon="personCircleOutline" slot="start" size="large"></ion-icon>
          <ion-label>
            <h1>{{ currentTrip?.passenger?.user?.name }}</h1>
          </ion-label>
        </ion-item>

        <ion-item lines="full">
          <ion-icon :icon="carOutline" slot="start" size="large"></ion-icon>
          <ion-label>{{ currentTrip?.passenger?.selectedVehicle?.plate_number }}</ion-label>
        </ion-item>

        <ion-popover trigger="pickup-address" color="primary" mode="ios" side="top" :showBackdrop="false" :detail="false"
          :dismissOnSelect="true">
          <ion-content>
            <ion-list>
              <ion-item button mode="md" color="primary" @click="store.openMap(currentTrip?.pickup_place?.coordinate)">
                <ion-label class="ion-text-center">
                  <h1>Open Map</h1>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </ion-popover>

        <ion-item button id="pickup-address">
          <ion-label>Pick-Up</ion-label>
          <ion-text>
            <h4>{{ currentTrip?.pickup_place?.name }}</h4>
            <p>{{ currentTrip?.pickup_place?.address }}</p>
          </ion-text>
        </ion-item>

        <ion-popover trigger="dropoff-address" color="primary" mode="ios" side="top" :showBackdrop="false" :detail="false"
          :dismissOnSelect="true">
          <ion-content>
            <ion-list>
              <ion-item button mode="md" color="primary" @click="store.openMap(currentTrip?.dropoff_place?.coordinate)">
                <ion-label class="ion-text-center">
                  <h1>Open Map</h1>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </ion-popover>

        <ion-item button id="dropoff-address">
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
          <ion-text slot="end">{{ currentTrip?.preview?.total_fare.value }}</ion-text>
        </ion-item>

        <div v-if="currentTrip?.status == 'arrived'">
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

          <ion-button expand="block" @click="requestAddWaitTime">Request Add Wait Time</ion-button>
        </div>
      </ion-list>


    </ion-content>

    <ion-footer class="ion-padding">
      <ion-button expand="block" @click="arrive" v-if="currentTrip.status == 'accepted'">
        Arrive
      </ion-button>
      <ion-button expand="block" @click="startTrip" v-if="currentTrip.status == 'arrived'">
        Start
      </ion-button>
      <ion-button expand="block" @click="completeTrip" v-if="currentTrip.status == 'started'">
        Complete
      </ion-button>


    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonText, IonPage, IonIcon, IonLabel, IonPopover,
  IonFooter, IonButton, IonFab, IonFabButton,
} from '@ionic/vue';
import {call, carOutline, cashOutline, personCircleOutline, timerOutline} from 'ionicons/icons';
import googleMaps from '@/plugins/google-map';
import { useMainStore } from '@/store';

const store = useMainStore();

const currentTrip = ref(store.currentTrip)

const googleMap = ref(null as any);

const center = store.currentTrip.pickup_place.coordinate;
const zoom = 5;
const driverCoordinate = ref(store.currentTrip.driver.coordinate);
const pickUpCoordinate = ref(store.currentTrip.pickup_place.coordinate);

const title = computed(() => {
  switch (currentTrip.value.status) {
    case 'accepted':
      return 'Heading to pick-up point';
    case 'arrived':
      return 'Waiting for passenger to board';
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

function requestAddWaitTime()
{
  store.axios.post('/drivers/trips/requestAddWaitTime')
    .then(() => {
      store.showToast({
        message: "Successfully sent Add Wait Time Request",
        duration: 2000,
        position: "middle",
      })
    })
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
    googleMap.value = new maps.Map(document.getElementById("driverMap"), {
      center: center,
      zoom: zoom,
      disableDefaultUI: true,
    });

    const driverIcon = {
      url: require('@/img/map_markers/car_color.png'),
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(25, 25)
    };

    const passengerIcon = {
      url: require('@/img/map_markers/placeholder.png'),
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

function arrive() {
  store.axios.post('/drivers/trips/arrive')
    .then((res) => {
      store.currentTrip = res.data.currentTrip;
    }).catch((err) => {
      console.log(err);
    })
}

function startTrip() {
  store.axios.post('/drivers/trips/startTrip')
    .then((res) => {
      store.currentTrip = res.data.currentTrip;
    }).catch((err) => {
      console.log(err);
    })
}

function completeTrip() {
  store.axios.post('/drivers/trips/completeTrip')
    .then((res) => {
      store.currentTrip = res.data.currentTrip;
    }).catch((err) => {
      console.log(err);
    })
}

</script>

<style scoped>
ion-popover {
  --background: #eb445a;
  --backdrop-opacity: 0.6;
  --box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.6);
  --color: #eb445a;
  --width: 300px;
}
</style>