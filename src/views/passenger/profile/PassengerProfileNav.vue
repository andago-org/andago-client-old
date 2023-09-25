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
          <ion-label>Phone Number:</ion-label>
          <ion-text>{{ store.profile.user.phone_number || "" }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Name:</ion-label>
          <ion-text>{{ store.profile.user.name }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Gender</ion-label>
          <ion-select :value="store.profile.user.gender">
            <ion-select-option value="male">Male</ion-select-option>
            <ion-select-option value="female">Female</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Birth Date</ion-label>
          <n-date-picker v-model:formatted-value="store.profile.user.birth_date" type="date" format="dd-MM-yyyy"
            value-format="yyyy-MM-dd" />
        </ion-item>

        <ion-item>
          <ion-label>Wallet Balance</ion-label>
          <ion-button @click="store.topUpModalOpen = true">Top Up</ion-button>
          <ion-text>{{ "RM " + store.profile?.balance }}</ion-text>
        </ion-item>

        <ion-button expand="block" @click="store.logout()">Logout</ion-button>
      </ion-list>

    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel, IonText, IonSelect,
  IonSelectOption,
} from '@ionic/vue';
import { NDatePicker } from 'naive-ui';
import { useMainStore } from '@/store';

const store = useMainStore();
</script>

<style>
ion-modal#dateModal {
  --width: fit-content;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}
</style>