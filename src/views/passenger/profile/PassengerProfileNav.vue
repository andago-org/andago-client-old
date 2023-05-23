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

        <ion-button expand="block" @click="store.logout()">Logout</ion-button>
      </ion-list>

    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonDatetime,
  IonList, IonItem, IonLabel, IonText, IonSelect, IonSelectOption, IonModal
} from '@ionic/vue';
import { NDatePicker } from 'naive-ui';
import { User } from '@/interfaces/models';
import { format, parseISO } from 'date-fns';
import { useMainStore } from '@/store';
import router from '@/router';

const store = useMainStore();

const user = computed<User | null>(() => store.user);

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