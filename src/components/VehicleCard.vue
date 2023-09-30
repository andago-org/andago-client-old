<template>
  <ion-card>
    <ion-card-header>
      <ion-button v-if="vehicleData.saved && vehicleData.status == 'approved'" :disabled="vehicleData.selected" class="ion-margin" expand="block" color="primary">
        {{ vehicleData.selected ? 'Selected' : 'Select This Car' }}
      </ion-button>

      <ion-text v-if="vehicleData.status != 'approved'">
        <h1>{{ warningText }}</h1>
      </ion-text>

      <n-upload
        class="ion-text-center"
        ref="upload"
        list-type="image"
        :default-upload="false"
        :show-file-list="false"
        :on-before-upload="handleBeforeUpload"
      >
        <n-upload-dragger style="height: 200px">
          <n-image
            v-if="vehiclePhoto || vehicleData.saved"
            object-fit="contain"
            :src="imageSrc"
            :preview-disabled="true"
          />
          <div v-else>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <image-icon />
              </n-icon>
            </div>
            <n-text style="font-size: 16px">
              Tap to Upload Image
            </n-text>
          </div>
        </n-upload-dragger>
      </n-upload>

      <ion-grid>
        <ion-row>
          <ion-col size="auto">
            <ion-icon :icon="carIcon" size="large"></ion-icon>
          </ion-col>
          <ion-col>
            <ion-item :fill="!isViewMode ? 'outline' : 'solid'">
              <ion-input v-model="vehicleData.plate_number" placeholder="Enter Car Number" :readonly="isViewMode"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-header>
    <ion-grid>
      <ion-row v-if="isViewMode">
        <ion-col>
          <ion-button color="primary" expand="block" @click="editCar()">
            Edit
          </ion-button>
        </ion-col>
        <ion-col>
          <ion-button color="secondary" expand="block" @click="deleteVehicle()">
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
  IonItem,
} from '@ionic/vue';
import { ref, defineProps, defineEmits, computed, watch, onMounted } from 'vue';
import { car as carIcon, image } from 'ionicons/icons';
import {ControlMode, Vehicle} from '@/interfaces/types';
import { useMainStore } from '@/store';
import { NUpload, NUploadDragger, NIcon, NText, NImage, UploadFileInfo } from 'naive-ui';
import { Image as ImageIcon } from '@vicons/ionicons5'
import axios from 'axios';

const store = useMainStore();

const props = defineProps({
  vehicleData: {
    type: Object as () => any,
    required: true,
  },
});

const storageUrl = process.env.VUE_APP_STORAGE_URL
const imageUrl = storageUrl + '/vehicles/' + props.vehicleData?.vehicle_photo

const vehiclePhoto = ref()
const imageSrc = ref()

const warningText = computed(() => {
  switch (vehicleData.value.status)
  {
    case 'pending':
      return "Under Review. Please wait"
    case 'rejected':
      return "Rejected. Please correct and resubmit"
    default:
      return ""
  }
})

onMounted(() => {
  imageSrc.value = imageUrl
})

function handleBeforeUpload(file: any) {
  const reader = new FileReader()
  reader.onload = (event: any) => {
    imageSrc.value = event.target.result
  };
  console.log("on before upload:", file.file.file)
  reader.readAsDataURL(file.file.file)

  vehiclePhoto.value = file

  upload.value.clear()

  return false
}

const upload = ref<any>(null);

const isViewMode = computed(() => vehicleData.value.controlMode == ControlMode.View);

defineEmits(['update:vehicleData', 'click']);

const vehicleData = ref<any>(props.vehicleData)
const vehicleDataCopy = ref<any>({ ...props.vehicleData });

watch(
  () => vehicleData.value.controlMode,
  (newValue: ControlMode, oldValue: ControlMode) => {
    console.log('vehicle.controlMode changed:', newValue, oldValue);
  }
);

function saveCar() {
  switch (vehicleData.value.controlMode) {
    case ControlMode.Create:
      createVehicle();
      break;
    case ControlMode.Edit:
      updateVehicle();
      break;
  }

  vehicleData.value.controlMode = ControlMode.View;
}

function editCar() {
  vehicleData.value.controlMode = ControlMode.Edit;
}

function cancelEdit() {
  if (!vehicleData.value.saved)
  {
    store.vehicles.pop()
  }

  vehicleData.value = vehicleDataCopy.value;

  vehicleData.value.controlMode = ControlMode.View;
}

function createVehicle() {
  store.axios.defaults.headers['Content-Type'] = 'multipart/form-data'

  const formData = new FormData()

  formData.append('plateNumber', props.vehicleData.plate_number)
  formData.append('vehiclePhoto', vehiclePhoto.value.file.file as any)

  store.axios.post('/passengers/vehicles/createVehicle', formData)
    .then((response: any) => {
      const vehicles = response.data

      store.vehicles = []

      vehicles.forEach((vehicle: any) => {
        store.vehicles.push({ ...vehicle, controlMode: ControlMode.View })
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

function updateVehicle() {
  const data = {
    id: vehicleData.value.id,
    name: vehicleData.value.name,
  }

  store.axios.post('/passengers/vehicles/updateVehicle', data)
    .then((response: any) => {
      const vehicles = response.data

      store.vehicles = []

      vehicles.forEach((vehicle: any) => {
        store.vehicles.push({ ...vehicle, controlMode: ControlMode.View })
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

function selectVehicle() {
  const data = {
    id: vehicleData.value.id,
  }

  store.axios.post('/passengers/vehicles/selectVehicle', data)
    .then((response: any) => {
      const vehicles = response.data

      store.vehicles = []

      vehicles.forEach((vehicle: any) => {
        store.vehicles.push({ ...vehicle, controlMode: ControlMode.View })
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

function deleteVehicle() {
  const data = {
    id: vehicleData.value.id,
  }

  store.axios.post('/passengers/vehicles/deleteVehicle', data)
    .then((response: any) => {
      const vehicles = response.data

      store.vehicles = []

      vehicles.forEach((vehicle: any) => {
        store.vehicles.push({ ...vehicle, controlMode: ControlMode.View })
      })
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>