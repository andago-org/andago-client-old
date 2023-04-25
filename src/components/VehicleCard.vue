<template>
  <ion-card>
    <ion-card-header>
      <ion-grid>
        <ion-row>
          <ion-col size="auto">
            <ion-icon :icon="carIcon" size="large"></ion-icon>
          </ion-col>
          <ion-col>
            <ion-item :fill="vehicleData.editMode ? 'outline' : undefined">
              <ion-input v-model="vehicleData.name" placeholder="Enter Car Number"
                :readonly="!vehicleData.editMode"></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="auto">
            <ion-checkbox :checked="selected" @click.stop></ion-checkbox>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-header>
    <ion-grid>
      <ion-row v-if="!vehicleData.editMode">
        <ion-col>
          <ion-button color="primary" expand="block" @click="editCar()">
            Edit
          </ion-button>
        </ion-col>
        <ion-col>
          <ion-button color="secondary" expand="block" @click="deleteCar()">
            Delete
          </ion-button>
        </ion-col>
      </ion-row>
      <ion-row v-else>
        <ion-col>
          <ion-button color="primary" expand="block" @click="saveCar()">
            Save
          </ion-button>
        </ion-col>
        <ion-col>
          <ion-button color="secondary" expand="block" @click="cancelEdit()">
            Cancle
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonButton, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCheckbox, IonInput,
  IonItem, IonLabel
} from '@ionic/vue';
import { ref, defineProps, defineEmits } from 'vue';
import { car as carIcon } from 'ionicons/icons';
import { Vehicle } from '@/interfaces/types';
import { useMainStore } from '@/store';

const store = useMainStore();

const props = defineProps({
  vehicleData: {
    type: Object as () => Vehicle,
    required: true,
  },
});

defineEmits(['update:vehicleData', 'click']);

const selected = ref(false)

const vehicleData = ref<Vehicle>(props.vehicleData)

function saveCar() {
  vehicleData.value.editMode = false;

  store.createVehicle(vehicleData.value);
}

function editCar() {
  // Implement edit functionality here
  vehicleData.value.editMode = true;
}

function deleteCar() {
  // Implement delete functionality here
}

function cancelEdit() {
  vehicleData.value.editMode = false;
}
</script>