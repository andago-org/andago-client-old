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
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonButton, IonText, IonContent, IonList, IonItem, IonLabel, IonInput, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/vue';
import { ref, defineEmits, onMounted } from 'vue';
import { useMainStore } from '@/store';

const store = useMainStore();

const props = defineProps({
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

const topUp = () => {
  store.axios.post('/passengers/payments/topUp', {
    topUpAmount: topUpAmount.value,
  })
    .then((response) => {
      const data = response.data;
      console.log(data);
      store.browser.open({
        url: data.item.url,
      });

      store.echo.private(`PassengerChannel-${store.profile.id}`).listen('.PaymentSuccessEvent', async (e: any) => {
        console.log(e);
        store.browser.close();
        const toast = await store.showToast({
          message: 'Top Up Successful',
          color: 'success',
          duration: 1000,
          position: 'middle',
        });

        toast.onDidDismiss().then(() => {
          closeModal();
        });
        store.echo.private(`PassengerChannel-${store.profile.id}`).stopListening('.PaymentSuccessEvent');
      });
    })
    .catch((error) => {
      console.log(error)
    })
};
</script>