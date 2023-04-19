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

    <ion-searchbar :debounce="1000" @ionChange="handleChange()" :placeholder="placeholder"
      v-model="searchText"></ion-searchbar>

    <ion-list>
      <ion-item :key="place.name" v-for="place in places" @click="setValue(place)" button>
        <ion-label>
          <h2>{{ place.name }}</h2>
          <p>{{ place.formatted_address }}</p>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonItem, IonList, IonSearchbar, IonModal, IonHeader, IonToolbar, IonButton, IonButtons,
  IonTitle, IonLabel
} from '@ionic/vue';
import { defineProps, ref, defineEmits } from 'vue';
import { useMainStore } from '@/store';
import { Place } from '@/interfaces/types';

const store = useMainStore();

defineProps({
  isOpen: Boolean,
  placeholder: {
    type: String,
    default: 'Search',
  },
  title: {
    type: String,
    default: 'Title',
  },
  value: {
    type: Object,
    default: {} as Place,
  },
});

const emit = defineEmits(['update:value', 'selected', 'update:isOpen']);

const setValue = (place: any) => {
  const _place = {
    place_id: place.place_id,
    name: place.name,
    formatted_address: place.formatted_address,
    coordinate: {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    },
  };

  emit('update:value', _place);
  closeModal();
};

const closeModal = () => {
  emit('update:isOpen', false);
};

const searchText = ref('');

const places = ref<any[]>([]);

const handleChange = async () => {
  const query = searchText.value.toLowerCase();
  // if (query === '') {
  //   results.value = [];
  //   return;
  // }

  places.value = await store.getPlaces(query);

  // console.log(places.value);
};
</script>
