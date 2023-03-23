<template>
  <div>
    <ion-searchbar v-model="searchText" @ionChange="filterResults" placeholder="Search"></ion-searchbar>
    <ion-list v-if="filteredResults.length > 0">
      <ion-item v-for="(item, index) in filteredResults" :key="index" @click="selectItem(item)">
        {{ item }}
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { IonSearchbar, IonList, IonItem } from '@ionic/vue';

interface Props {
  items: string[];
}

// Define props
const props = defineProps<Props>();

// Define emits
const emit = defineEmits(['selected']);

const searchText = ref('');
const filteredResults = ref<string[]>([]);

const filterResults = () => {
  filteredResults.value = props.items.filter((item) =>
    item.toLowerCase().includes(searchText.value.toLowerCase())
  );
};

const selectItem = (item: string) => {
  searchText.value = item;
  filteredResults.value = [];
  emit('selected', item);
};
</script>
