<template>
  <ion-modal :isOpen="isOpen" @dismiss="closeModal">
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Add Wait Time</ion-title>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="closeModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-list>
          <ion-radio-group v-model:value="selectedWaitPackageId" @ionChange="selectedWaitPackageChanged">
            <ion-item v-for="(waitPackage, index) in waitPackages" :key="index">
              <ion-label>{{ waitPackage.waitTimeText }}</ion-label>
              <ion-text>{{ waitPackage.feeText }}</ion-text>
              <ion-radio slot="end" :value="waitPackage.id"></ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-list>
      </ion-content>

      <ion-footer>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-button :strong="true" expand="block" color="primary" @click="purchaseWaitPackage"
                :disabled="selectedWaitPackageId == null">Purchase</ion-button>
            </ion-col>

            <ion-col>
              <ion-button :strong="true" expand="block" color="secondary" @click="closeModal">Cancel</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-footer>
    </ion-page>
  </ion-modal>

  <TopUpModal v-model:isOpen="topUpModalOpen"></TopUpModal>
</template>

<script setup lang="ts">
import {
  IonModal, IonButton, IonContent, IonList, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonRadioGroup, IonRadio, IonText, IonFooter, IonPage, IonGrid, IonRow, IonCol,
} from '@ionic/vue';
import { ref, defineEmits, } from 'vue';
import { useMainStore } from '@/store';
import TopUpModal from '@/components/TopUpModal.vue';

const store = useMainStore();

const topUpModalOpen = ref(false);

defineProps({
  isOpen: Boolean,
  waitPackages: {
    type: Array as () => any[],
    required: true,
  }
});

const selectedWaitPackageId = ref(null);

const emit = defineEmits(['update:isOpen', 'confirm', 'cancel']);

function purchaseWaitPackage() {
  store.axios.post('/passengers/wait_packages/purchaseWaitPackage', {
    waitPackageId: selectedWaitPackageId.value,
  })
    .then(async (response) => {
      const data = response.data;

      const toast = await store.showToast({
        message: data.message,
        duration: 2000,
        position: 'middle',
      });

      if (data.status == 'success') {
        toast.onDidDismiss().then(() => {
          closeModal();
        });
      } else {
        toast.onDidDismiss().then(() => {
          topUpModalOpen.value = true;
        });
      }

      console.log(data)
    })
    .catch((error) => {
      console.log(error);
    });
}

function selectedWaitPackageChanged(event: any) {
  selectedWaitPackageId.value = event.detail.value;
}

function closeModal() {
  emit('update:isOpen', false);
}
</script>