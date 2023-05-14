<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar color="primary" slot="bottom">
        <ion-tab-button tab="tab1" href="/passenger/profile">
          <ion-icon aria-hidden="true" :icon="person" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/passenger/trip">
          <ion-icon aria-hidden="true" :icon="car" />
          <ion-label>Trip</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/passenger/chat">
          <ion-icon aria-hidden="true" :icon="chatbox" />
          <ion-label>Chat</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/passenger/settings">
          <ion-icon aria-hidden="true" :icon="settings" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { person, car, chatbox, settings } from 'ionicons/icons';
</script>