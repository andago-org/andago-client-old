<template>
  <ion-page>
    <ion-nav :root="component"></ion-nav>
  </ion-page>
</template>

<script setup lang="ts">
import { IonNav, IonPage } from '@ionic/vue';
import AddressPage from './AddressPage.vue';

const component = AddressPage
</script>