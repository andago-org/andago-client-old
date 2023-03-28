<template>
  <div>
    <auto-complete :items="sampleData" @selected="onItemSelected"></auto-complete>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonInput
} from '@ionic/vue';
import AutoComplete from '@/components/AddressSearchModal.vue.js';

const sampleData: string[] = [
  'Apple',
  'Banana',
  'Orange',
  'Grape',
  'Strawberry',
  'Blueberry',
  'Pineapple',
];

const onItemSelected = (item: string): void => {
  console.log('Selected item:', item);
};
</script>
