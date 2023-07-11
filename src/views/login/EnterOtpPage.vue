<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Enter OTP</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="store.ionNav.pop()">
            <ion-icon slot="icon-only" :icon="close" color="danger"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-list>

        <ion-item lines="none">
          <ion-text class="ion-text-center">
            <h3>Enter OTP to Login</h3>
          </ion-text>
        </ion-item>

        <ion-item fill="outline">
          <ion-label position="floating">OTP Code</ion-label>
          <ion-input v-model="otpCode" :maxlength="6" @keypress="store.digitOnlyInput" />
        </ion-item>

        <ion-button expand="block" :disabled="!isValidOtpCode" @click="login">Login</ion-button>

      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch, } from 'vue';
import router from '@/router';
import { useMainStore } from '@/store';
import {
  IonInput, IonButton, IonIcon, IonPage, IonHeader, IonToolbar, IonList, IonText,
  IonTitle, IonContent, IonItem, IonLabel, IonButtons,
} from '@ionic/vue';
import { close } from 'ionicons/icons';

const store = useMainStore();

const otpCode = ref('');
const isValidOtpCode = ref(false);

watch(otpCode, () => {
  isValidOtpCode.value = otpCode.value.length === 6;
});

async function login() {
  const oneSignalPlayerId = AndroidBridge.getOneSignalPlayerId()

  const data = {
    phoneNumber: store.phoneNumber,
    code: otpCode.value,
    userType: store.userType,
    oneSignalId: oneSignalPlayerId,
  };

  store.axios.post("/auth/login", data)
    .then(async (response) => {
      if (response.data.status == 'success') {
        const data = response.data

        const toast = await store.showToast({
          message: response.data.message,
          duration: 2000,
          position: "middle",
        });

        toast.onDidDismiss().then(async () => {
          store.showLoading({})

          store.token = data.token
          await store.getData()
              .then(() => {
                store.saveTokenToStorage()
                    .then(() => {
                      router.go(0)
                    })
              })
        });
      }
    })
    .catch(function (error) {
      store.showToast({
        message: error,
        duration: 2000,
        position: 'middle',
      })
      console.log(error)
    });
}
</script>