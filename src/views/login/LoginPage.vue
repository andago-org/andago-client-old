<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login or Register</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">
      <ion-list>

        <ion-item lines="none">
          <ion-text class="ion-text-center">
            <h3>Login with Phone Number</h3>
          </ion-text>
        </ion-item>

        <ion-item fill="outline">
          <ion-label position="floating">Phone Number</ion-label>
          <ion-input v-model="store.phoneNumber" :maxlength="12" @keypress="store.digitOnlyInput" />
        </ion-item>

        <ion-item>
          <ion-segment color="danger" v-model="store.userType">
            <ion-segment-button value="passenger">
              <ion-label>Passenger</ion-label>
            </ion-segment-button>
            <ion-segment-button value="driver">
              <ion-label>Driver</ion-label>
            </ion-segment-button>
          </ion-segment>
        </ion-item>

        <ion-button expand="block" :disabled="!isValidPhoneNumber" @click="requestOtp">Request OTP</ion-button>

      </ion-list>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { ref, watch, } from 'vue';
import { useMainStore } from '@/store';
import {
  IonInput, IonButton, IonPage, IonHeader, IonToolbar, IonList, IonText,
  IonTitle, IonContent, IonItem, IonLabel, IonSegment, IonSegmentButton,
} from '@ionic/vue';
import EnterOtpPage from './EnterOtpPage.vue';

const store = useMainStore();

const isValidPhoneNumber = ref(false);

watch(() => store.phoneNumber,
  () => {
    const lengthPass = store.phoneNumber.length >= 10;
    const initialPass = store.phoneNumber.substring(0, 2) === '01';

    isValidPhoneNumber.value =
      lengthPass &&
      initialPass
      ;
  }
);

async function requestOtp() {
  const data = {
    phoneNumber: store.phoneNumber,
  }

  store.axios.post("/auth/requestOtp", data)
    .then(function (response) {
      console.log(response);

      const data = response.data;

      if (response.data.status == 'success') {
        store.ionNav.push(EnterOtpPage);
      }
      else {
        store.showToast({
          message: data.message,
          duration: 1000,
          position: 'bottom',
        });

      }
    })
    .catch(function (error) {
      console.log(error);
    });
}


</script>

<style scoped>
ion-content {
  --ion-padding: 32px;
}

ion-item {
  margin-bottom: 1rem;
}
</style>
