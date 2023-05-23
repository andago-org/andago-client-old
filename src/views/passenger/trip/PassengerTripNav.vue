<template>
  <ion-page>
    <ion-nav :root="AddressPage"></ion-nav>
  </ion-page>
</template>

<script setup lang="ts">
import { IonNav, IonPage } from '@ionic/vue';
import AddressPage from './AddressPage.vue';
</script>