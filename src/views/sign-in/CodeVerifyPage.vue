<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Enter Verification Code</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">Verification Code</ion-label>
        <ion-input type="tel" v-model.trim="verificationCode" inputmode="numeric" pattern="[0-9]{6}"
          @keypress="onKeyPress" />
      </ion-item>

      <ion-button expand="block" :disabled="!isValidVerificationCode" @click="login">Submit</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IonInput, IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel } from '@ionic/vue';

import { useMainStore } from '@/store';

const store = useMainStore();

const verificationCode = ref('');

const isValidVerificationCode = ref(false);

watch(verificationCode, (newValue, oldValue) => {
  isValidVerificationCode.value = verificationCode.value.length === 6;
  // do something else
});

function onKeyPress(event: KeyboardEvent) {
  if (!/[0-9]/.test(event.key) || verificationCode.value.length > 5) {
    event.preventDefault();
  }
}

function login() {
  // Submit verification code logic here
  store.login(verificationCode.value);
}

</script>

<style scoped>
ion-item {
  margin-bottom: 1rem;
}
</style>
