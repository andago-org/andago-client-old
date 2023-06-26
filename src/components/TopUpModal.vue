<template>
  <ion-modal :is-open="isOpen" @dismiss="closeModal">
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Top Up</ion-title>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="closeModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-list>

          <ion-item lines="none">
            <ion-text class="ion-text-center">
              <h3>Enter Top-Up Amount</h3>
            </ion-text>
          </ion-item>

          <ion-item fill="outline">
            <ion-label position="floating">Top-Up Amount</ion-label>
            <ion-input v-model="topUpAmount" type="number" />
          </ion-item>

          <ion-button expand="block" @click="topUp">Top Up</ion-button>

        </ion-list>
      </ion-content>
    </ion-page>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal, IonButton, IonText, IonContent, IonList, IonItem, IonLabel, IonInput, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonPage,
} from '@ionic/vue';
import { ref, defineEmits, onMounted, watch } from 'vue';
import { useMainStore } from '@/store';

const store = useMainStore();

defineProps({
  isOpen: Boolean,
});

const topUpAmount = ref(0);

const emit = defineEmits(['update:isOpen', 'confirm', 'cancel']);

function closeModal() {
  emit('update:isOpen', false);
}

async function getSuggestedTopUpAmount() {
  store.axios.post('/passengers/payments/getSuggestedTopUpAmount')
    .then((response) => {
      const data = response.data;

      console.log(data);

      topUpAmount.value = data.suggestedTopUpAmount;
    })
    .catch((error) => {
      console.log(error)
    })
}

onMounted(() => {
  getSuggestedTopUpAmount();
})

watch(() => store.currentPayment, async (newValue, oldValue) => {
  if (oldValue != null && newValue == null) {
    store.browser.close();
    const toast = await store.showToast({
      message: 'Top Up Successful',
      duration: 2000,
      position: 'middle',
    });

    toast.onDidDismiss().then(() => {
      closeModal();
      store.currentPayment = null;
    })
  }
})

const topUp = () => {
  store.axios.post('/passengers/payments/topUp', {
    topUpAmount: topUpAmount.value,
  })
    .then(async (response) => {
      const data = response.data;
      console.log(data);

      const toast = await store.showToast({
        message: data.message,
        duration: 2000,
        position: 'middle',
      })

      toast.onDidDismiss().then(() => {
        if (data.status === 'success') {
          store.browser.open({
            url: data.checkoutUrl,
          });

          store.browser.addListener('browserFinished', () => {
            store.getData();
          });
        }
      })
    })
    .catch((error) => {
      console.log(error)
    })
};
</script>