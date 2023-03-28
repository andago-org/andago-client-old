<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Sign In</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item fill="outline">
        <ion-label position="floating">Phone Number</ion-label>
        <ion-input type="tel" v-model.trim="phoneNumber" inputmode="numeric" pattern="[0-9]{12}" @keypress="onKeyPress" />
        <ion-icon v-if="isValidPhoneNumber" name="checkmark-circle" color="success"></ion-icon>
      </ion-item>

      <ion-button expand="block" :disabled="!canSignIn" @click="sendCode">Sign In</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonInput, IonButton, IonIcon, IonPage, IonHeader, IonToolbar,
  IonTitle, IonContent, IonItem, IonLabel,
} from '@ionic/vue';

import { useMainStore } from '@/store';

const phoneNumber = ref('');

const isValidPhoneNumber = ref(false);

function onKeyPress(event: KeyboardEvent) {
  if (!/[0-9]/.test(event.key) || phoneNumber.value.length > 11) {
    event.preventDefault();
  }
}

const store = useMainStore();

function sendCode() {
  store.sendCode(phoneNumber.value);
}

watch(phoneNumber, (newVal, oldVal) => {
  updateCanSignIn();
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
