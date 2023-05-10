<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login or Register</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">

      <ion-grid>
        <ion-row>
          <ion-col>

            <ion-list>

              <ion-item lines="none">
                <ion-text class="ion-text-center">
                  <h3>Login with Phone Number</h3>
                </ion-text>
              </ion-item>

              <ion-item fill="outline">
                <ion-label position="floating">Phone Number</ion-label>
                <ion-input v-model="phoneNumber" maxlength="12" @keypress="onKeyPress" />
              </ion-item>

              <ion-item>
                <ion-segment color="danger" value="passenger">
                  <ion-segment-button value="passenger">
                    <ion-label>Passenger</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="Driver">
                    <ion-label>Driver</ion-label>
                  </ion-segment-button>
                </ion-segment>
              </ion-item>

              <ion-button expand="block" :disabled="!isValidPhoneNumber" @click="requestOtp">Request OTP</ion-button>

            </ion-list>

          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- OTP Modal -->
      <ion-modal ref="modal" :isOpen="otpModalOpen">
        <ion-header>
          <ion-toolbar>
            <ion-title>Enter OTP</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="otpModalOpen = false">
                <ion-icon slot="icon-only" :icon="close" color="danger"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">

          <ion-grid>
            <ion-row>
              <ion-col>

                <ion-list>

                  <ion-item lines="none">
                    <ion-text class="ion-text-center">
                      <h3>Enter OTP to Login</h3>
                    </ion-text>
                  </ion-item>

                  <ion-item fill="outline">
                    <ion-label position="floating">OTP Code</ion-label>
                    <ion-input v-model="otpCode" maxlength="6" @keypress="onKeyPress" />
                  </ion-item>

                  <ion-button expand="block" :disabled="!isValidOtpCode" @click="login">Login</ion-button>

                </ion-list>

              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { ref, watch, } from 'vue';
import {
  IonInput, IonButton, IonIcon, IonPage, IonHeader, IonToolbar, IonList, IonGrid, IonRow, IonCol, IonText,
  IonTitle, IonContent, IonItem, IonLabel, IonSegment, IonSegmentButton, IonModal, IonButtons
} from '@ionic/vue';
import { close } from 'ionicons/icons';
import router from '@/router';
import { useMainStore } from '@/store';

const store = useMainStore();

const userType = ref("");

const otpModalOpen = ref(false);

const phoneNumber = ref('');
const isValidPhoneNumber = ref(false);

watch(phoneNumber, () => {
  const lengthPass = phoneNumber.value.length >= 10;
  const initialPass = phoneNumber.value.substring(0, 2) === '01';

  isValidPhoneNumber.value =
    lengthPass &&
    initialPass
    ;
});

async function requestOtp() {

  const data = {
    phoneNumber: phoneNumber.value,
  }

  store.axios.post("/auth/requestOtp", data)
    .then(function (response) {
      console.log(response);

      const data = response.data;

      if (response.data.status == 'success') {
        otpModalOpen.value = true;
      }
      else {
        store.showToast({
          message: data.message,
          duration: 2000,
          position: 'bottom',
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

const otpCode = ref('');
const isValidOtpCode = ref(false);

watch(otpCode, () => {
  isValidOtpCode.value = otpCode.value.length === 6;
  // do something else
});

async function login() {
  const data = {
    phoneNumber: phoneNumber.value,
    code: otpCode.value,
    userType: userType.value,
  };

  store.axios.post("/auth/login", data)
    .then((response) => {
      console.log(response);

      store.showToast({
        message: response.data.message,
        duration: 2000,
        position: 'middle',
      })

      if (response.data.status == 'success') {
        store.token = response.data.token;
        store.user = response.data.user;

        if (store.user?.userType == 'passenger') {
          router.push('/tabs');
        }
        else {
          router.push('/driver/');
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function onKeyPress(event: KeyboardEvent) {
  if (!/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
}

</script>

<style scoped>
ion-item {
  margin-bottom: 1rem;
}
</style>
