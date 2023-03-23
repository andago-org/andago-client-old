<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-item>
        <ion-searchbar :search-icon="location" placeholder="Pick-Up"></ion-searchbar>
      </ion-item>
      <ion-item>
        <ion-searchbar :search-icon="navigate" placeholder="Drop-Off"></ion-searchbar>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonItem
} from '@ionic/vue';

import { location, navigate } from 'ionicons/icons';
</script>
