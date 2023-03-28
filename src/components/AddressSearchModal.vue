<template>
  <ion-modal :is-open="isOpen" @dismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="closeModal">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-searchbar :debounce="1000" @ionChange="handleChange($event)" :placeholder="placeholder"
      v-model="searchText"></ion-searchbar>

    <ion-list>
      <ion-item :key="result" v-for="result in results" button>
        <ion-label>{{ result }}</ion-label>
      </ion-item>
    </ion-list>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonItem, IonList, IonSearchbar, IonModal, IonHeader, IonToolbar, IonButton, IonButtons,
  IonTitle, IonLabel
} from '@ionic/vue';
import { defineProps, ref, defineEmits, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
  isOpen: Boolean,
  items: {
    type: Array as () => string[],
    default: () => ([] as unknown) as string[],
  },
  placeholder: {
    type: String,
    default: 'Search',
  },
  title: {
    type: String,
    default: 'Title',
  },
});

const emit = defineEmits(['selected', 'update:isOpen']);

const closeModal = () => {
  emit('update:isOpen', false);
};

const searchText = ref('');

const data = computed(() => props.items);
const results = ref(props.items);

const handleChange = async (event: Event) => {
  const query = searchText.value.toLowerCase();
  if (query === '') {
    results.value = [];
    return;
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
        query,
      },
    });
    const predictions = response.data.results.map((result: any) => result.formatted_address);
    results.value = predictions;
  } catch (error) {
    console.error(error);
    results.value = [];
  }

  // results.value = data.value.filter(d => d.toLowerCase().indexOf(query) > -1);
};
</script>
