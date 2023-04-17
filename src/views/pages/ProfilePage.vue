<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-label>Name:</ion-label>
          <ion-text>{{ user?.name }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Phone Number:</ion-label>
          <ion-text>{{ user?.phone_number || "" }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Credit Wallet:</ion-label>
          <ion-text>{{ creditWallet }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-button expand="block" @click="logout()">Logout</ion-button>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonList, IonItem, IonLabel, IonText,
} from '@ionic/vue';
import { useMainStore } from '@/store';
import { User } from '@/interfaces/models';

const store = useMainStore();

const user = computed<User | null>(() => store.user);

const creditWallet = computed(() => store.creditWallet);

function logout() {
  store.logout()
}

</script>
<style scoped></style>