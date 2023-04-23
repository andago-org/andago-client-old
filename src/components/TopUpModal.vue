<template>
  <ion-modal :is-open="isOpen" @dismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Top Up</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="closeModal">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label position="floating">Top Up Amount</ion-label>
          <ion-input type="number" v-model="topUpAmount"></ion-input>
        </ion-item>
      </ion-list>

      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-button :strong="true" expand="block" @click="topUp">Top Up</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const props = defineProps({
  isOpen: Boolean,
});

const topUpAmount = ref(0);

const emit = defineEmits(['update:isOpen', 'confirm', 'cancel']);

function closeModal() {
  emit('update:isOpen', false);
}

function confirmModal() {
  emit('confirm');
}

const topUp = () => {
  // implement your top up logic here
  closeModal();
};
</script>