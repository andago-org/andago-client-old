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
          <ion-text>{{ user?.phone_number || "" }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>Name:</ion-label>
          <ion-input class="ionic-text-right"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Gender</ion-label>
          <ion-select>
            <ion-select-option value="male">Male</ion-select-option>
            <ion-select-option value="female">Female</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item @click="dateModal = true">
          <ion-label>Date of birth</ion-label>
          <ion-text>{{ dateFormatted }}</ion-text>

          <ion-modal id="dateModal" @ionModalDidDismiss="dateModal = false" :isOpen="dateModal">
            <ion-datetime presentation="date" id="datetime" @ionChange="dateModal = false" v-model="date"></ion-datetime>
          </ion-modal>
        </ion-item>
        <ion-item>
          <ion-button expand="block" @click="logout()">Logout</ion-button>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonDatetime,
  IonList, IonItem, IonLabel, IonText, IonSelect, IonSelectOption, IonDatetimeButton, IonModal
} from '@ionic/vue';
import { useMainStore } from '@/store';
import { User } from '@/interfaces/models';
import { format, parseISO } from 'date-fns';

const dateModal = ref(false);
const date = ref(new Date().toISOString());
const dateFormatted = computed(() => {
  console.log(date.value);
  const d = new Date(date.value);
  return format(parseISO(date.value), 'MMM d, yyyy');
});

const store = useMainStore();

const user = computed<User | null>(() => store.user);

const creditWallet = computed(() => store.creditWallet);

function logout() {
  store.logout()
}

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