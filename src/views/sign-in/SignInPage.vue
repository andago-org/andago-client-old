<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sign In</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">
      <ion-item fill="outline">
        <ion-label position="floating">Phone Number</ion-label>
        <ion-input type="tel" v-model.trim="phoneNumber" inputmode="numeric" pattern="[0-9]{12}" @keypress="onKeyPress" />
        <ion-icon v-if="isValidPhoneNumber" name="checkmark-circle" color="success"></ion-icon>
      </ion-item>

      <ion-button expand="block" :disabled="!canSignIn" @click="tryLogin">Sign In</ion-button>

      <ion-item>
        <ion-label>Login as Driver</ion-label>
        <ion-checkbox v-model="driverMode"></ion-checkbox>
      </ion-item>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonInput, IonButton, IonIcon, IonPage, IonHeader, IonToolbar,
  IonTitle, IonContent, IonItem, IonLabel, IonCheckbox,
} from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';

import { useMainStore } from '@/store';

const phoneNumber = ref('');

const store = useMainStore();

const isValidPhoneNumber = ref(false);
const driverMode = ref(false);

function onKeyPress(event: KeyboardEvent) {
  if (!/[0-9]/.test(event.key) || phoneNumber.value.length > 11) {
    event.preventDefault();
  }
}

function tryLogin() {
  store.tryLogin(phoneNumber.value);
}

watch(phoneNumber, () => {
  updateCanSignIn();
});

driverMode.value = store.driverMode;

watch(driverMode, async () => {
  store.driverMode = driverMode.value;

  console.log('driverMode', driverMode.value)
});

const canSignIn = ref(false);

function updateCanSignIn() {
  const lengthPass = phoneNumber.value.length >= 10;
  const initialPass = phoneNumber.value.substring(0, 2) === '01';

  canSignIn.value =
    lengthPass &&
    initialPass
    ;
}

updateCanSignIn();

</script>

<style scoped>
ion-item {
  margin-bottom: 1rem;
}
</style>
