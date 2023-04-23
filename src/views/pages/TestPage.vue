<template>
  <ion-page>
    <ion-nav :root="component"></ion-nav>
  </ion-page>
</template>

<script setup lang="ts">
import { IonNav, IonPage } from '@ionic/vue';
import PageOne from '@/views/pages/test/TestPage1.vue';

const component = PageOne
</script>