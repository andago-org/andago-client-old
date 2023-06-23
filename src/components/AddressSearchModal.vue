<template>
  <ion-searchbar :search-icon="icon" :placeholder="placeholder" @ionFocus="searchModalOpen = true"
    :value="$props.value?.name" show-clear-button="never">
  </ion-searchbar>

  <ion-modal :is-open="searchModalOpen" @dismiss="closeModal">
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ title }}</ion-title>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="closeModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-searchbar @ionChange="getPlaces" placeholder="Search for places" v-model="searchText"></ion-searchbar>

      <ion-content scroll-y>
        <ion-grid v-if="searching">
          <ion-row>
            <ion-col class="ion-text-center">
              <ion-spinner></ion-spinner>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-list v-else>
          <ion-item :key="place.name" v-for="place in places" @click="setValue(place)" button>
            <ion-label>
              <h2>{{ place.name }}</h2>
              <p>{{ place.formatted_address }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-page>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonItem, IonList, IonSearchbar, IonModal, IonHeader, IonToolbar, IonButton, IonButtons, IonContent, IonGrid,
  IonRow, IonCol, IonTitle, IonLabel, IonSpinner, IonPage,
} from '@ionic/vue';
import { ref, defineProps, defineEmits } from 'vue';
import { useMainStore } from '@/store';

const store = useMainStore();

defineProps({
  icon: String,
  title: {
    type: String,
    default: 'Title',
  },
  placeholder: {
    type: String,
    default: 'Search',
  },
  value: {
    type: Object,
    default: {} as any | null,
  },
});

const searchModalOpen = ref(false);

const searching = ref(false);

const emit = defineEmits(['update:value', 'selected']);

const setValue = (place: any) => {
  const _place = {
    place_id: place.place_id,
    name: place.name,
    address: place.formatted_address,
    coordinate: {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    },
  };

  emit('update:value', _place);
  closeModal();
};

function closeModal() {
  searchModalOpen.value = false;
}

const searchText = ref('');

const places = ref<any[]>([]);

async function getPlaces() {
  searching.value = true;

  const position = await store.currentPosition;

  const data = {
    query: searchText.value,
    lat: position.lat,
    lng: position.lng,
  }

  store.axios.post("/users/maps/getPlaces", data)
    .then((response) => {
      searching.value = false;

      const data = response.data;

      places.value = data.results;
    })
    .catch((error) => {
      console.log(error);
    });
}

</script>
