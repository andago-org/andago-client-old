<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Trip Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <div id="map"></div>

    <ion-content scroll-y scroll="true" style="height: calc(100% - 56px);">
      <ion-list>
        <ion-item>
          <ion-label>Pick-Up</ion-label>
          <ion-text>
            <h4>{{ store.pickUpPlace.name }}</h4>
            <p>{{ store.pickUpPlace.address }}</p>
          </ion-text>
        </ion-item>

        <ion-item>
          <ion-label>Drop-Off</ion-label>
          <ion-text>
            <h4>{{ store.dropOffPlace.name }}</h4>
            <p>{{ store.dropOffPlace.address }}</p>
          </ion-text>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-list>
        <!-- <ion-item v-for="item in paymentDetails" :key="item.label" lines="none">
          <ion-icon :icon="item.icon" slot="start"></ion-icon>
          <ion-text>
            {{ item.label }}
          </ion-text>
          <ion-text slot="end">{{ item.value }}</ion-text>
        </ion-item> -->
        <ion-item lines="none">
          <ion-icon :icon="bookOutline" slot="start"></ion-icon>
          <ion-text>
            {{ store.paymentDetails.min_fare.text }}
          </ion-text>
          <ion-text slot="end">{{ store.paymentDetails.min_fare.value }}</ion-text>
        </ion-item>
        <ion-item lines="none">
          <ion-icon :icon="carOutline" slot="start"></ion-icon>
          <ion-text>
            {{ store.paymentDetails.distance_addon.text }}
          </ion-text>
          <ion-text slot="end">{{ store.paymentDetails.distance_addon.value }}</ion-text>
        </ion-item>
        <ion-item lines="none">
          <ion-icon :icon="timeOutline" slot="start"></ion-icon>
          <ion-text>
            {{ store.paymentDetails.duration_addon.text }}
          </ion-text>
          <ion-text slot="end">{{ store.paymentDetails.duration_addon.value }}</ion-text>
        </ion-item>
        <ion-item lines="none">
          <ion-icon :icon="cashOutline" slot="start"></ion-icon>
          <ion-text>
            {{ store.paymentDetails.total_fare.text }}
          </ion-text>
          <ion-text slot="end">{{ store.paymentDetails.total_fare.value }}</ion-text>
        </ion-item>
      </ion-list>

      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button :strong="true" expand="block" color="primary" @click="confirmTrip">Confirm</ion-button>
          </ion-col>

          <ion-col>
            <ion-nav-link router-direction="back">
              <ion-button :strong="true" expand="block" color="secondary">Cancel</ion-button>
            </ion-nav-link>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { defineEmits, ref, computed, watch, onMounted, onUpdated, nextTick } from 'vue';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonBackButton,
  IonButton, IonButtons, IonGrid, IonRow, IonCol, IonText, IonPage, IonFooter, IonNavLink, IonIcon,
  toastController, loadingController,
} from '@ionic/vue';
import { Place } from '@/interfaces/types';
import googleMaps from '@/plugins/google-map';
// import TopUpModal from '@/components/TopUpModal.vue';
import { useMainStore } from '@/store';
import { bookOutline, cashOutline, timeOutline, carOutline } from 'ionicons/icons';
import { Browser } from '@capacitor/browser';
import Pusher from 'pusher-js';

const store = useMainStore();

const center = store.pickUpPlace.coordinate;
const zoom = 5;
const start = store.pickUpPlace.coordinate;
const end = store.dropOffPlace.coordinate;
const directionsResult = ref(null);

const googleMap = ref(null as any);

onMounted(() => {
  googleMaps.load().then((maps: any) => {
    googleMap.value = new maps.Map(document.getElementById("map"), {
      center: center,
      zoom: zoom,
      disableDefaultUI: true,
    });
    googleMaps.calculateRoute(store.pickUpPlace.coordinate, store.dropOffPlace.coordinate, googleMap.value);
  });
});

const walletBalanceAfterPayment = ref(store.walletBalance - store.fare);

function confirmTrip() {
  showLoading();

  store.confirmTrip();

  const pusher = new Pusher('a294542618ad0c79d7b7', {
    cluster: 'ap1'
  });

  const channel = pusher.subscribe('user-channel-' + store.user?.id);
  channel.bind('trip-accepted-event', async function (event: any) {
    const data = event.data;

    store.myTrip = data;

    store.acceptedDriver = data.driver;
    console.log(data);
    searchDriverLoading.value?.dismiss();
  });
  channel.bind('payment-success-event', async function (event: any) {
    const data = event.data;
    console.log("Payment success")
    await Browser.close();
  });
}

const searchDriverLoading = ref(null as HTMLIonLoadingElement | null);

const showLoading = async () => {
  searchDriverLoading.value = await loadingController.create({
    message: 'Searching for drivers...',
    duration: 15000,
    spinner: 'circles',
  });

  searchDriverLoading.value.present();

  searchDriverLoading.value?.onDidDismiss().then(async () => {
    console.log('Dismissed loading')
    if (store.acceptedDriver) {
      showDriverFoundToast();
      console.log('Driver found')
    }
    else {
      const nav = document.querySelector('ion-nav');
      nav?.pop();
      console.log('No driver found')
    }
  })
};

const driverFoundToast = ref(null as HTMLIonToastElement | null);

const showDriverFoundToast = async () => {
  driverFoundToast.value = await toastController.create({
    message: 'We found a driver for you! Please pay first.',
    duration: 1500,
    position: 'middle',
  });

  await driverFoundToast.value.present();

  driverFoundToast.value.onDidDismiss().then(async () => {
    console.log('Dismissed toast')
    await Browser.open({ url: store.myTrip.payment_url });
  })
}

const emit = defineEmits(['confirm', 'cancel']);

function confirmModal() {
  emit('confirm');
}
</script>

<style>
#map {
  height: 200px;
  background-color: #f5f5f5;
}
</style>
