<template>
  <ion-card>
    <ion-card-header>
      <n-upload ref="upload" :default-upload="false" :headers="headers" :on-finish="handleUploadFinish"
        :show-file-list="false" :on-change="submitFiles">
        <n-upload-dragger style="height: 200px">
          <div>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <image-icon />
              </n-icon>
            </div>
            <n-text style="font-size: 16px">
              Tap to Upload Image
            </n-text>
          </div>
          <!-- <n-image object-fit="contain" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            :preview-disabled="true" /> -->
        </n-upload-dragger>
      </n-upload>

      <ion-grid>
        <ion-row>
          <ion-col size="auto">
            <ion-icon :icon="carIcon" size="large"></ion-icon>
          </ion-col>
          <ion-col>
            <ion-item :fill="!isViewMode ? 'outline' : undefined">
              <ion-input v-model="vehicleData.name" placeholder="Enter Car Number" :readonly="isViewMode"></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="auto">
            <ion-checkbox :checked="vehicleData.selected" @ion-change="onCheckboxChange"></ion-checkbox>
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
  IonItem,
} from '@ionic/vue';
import { ref, defineProps, defineEmits, computed, watch, reactive } from 'vue';
import { car as carIcon, image } from 'ionicons/icons';
import { Vehicle, ControlMode } from '@/interfaces/types';
import { useMainStore } from '@/store';
import { NUpload, NUploadDragger, NIcon, NText, NImage } from 'naive-ui';
import { Image as ImageIcon } from '@vicons/ionicons5'
import axios from 'axios';

const store = useMainStore();

const uploadUrl = process.env.VUE_APP_API_BASE_URL + "/files/uploadImage";

const upload = ref<any>(null);

const isViewMode = computed(() => vehicleData.value.controlMode == ControlMode.View);

const handleUploadFinish = (response: any, file: any) => {
  console.log('File upload finished:', response);
};

const headers = {
  Authorization: 'Bearer ' + store.token,
  "Accept": 'application/json',
  "Content-Type": 'multipart/form-data',
};

const submitFiles = async (response: any) => {
  if (upload.value) {
    const formData = new FormData();
    console.log(upload.value);
    formData.append('file', response.file.file);

    try {
      const response = await axios.post(uploadUrl, formData, { headers });
      console.log('Upload response:', response);

      // Clear the file list after a successful upload
      upload.value.clear();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  } else {
    console.log('No files to upload.');
  }
};

const props = defineProps({
  vehicleData: {
    type: Object as () => Vehicle,
    required: true,
  },
});

defineEmits(['update:vehicleData', 'click']);

const onCheckboxChange = ({ detail }: any) => {
  store.selectVehicle(vehicleData.value);
};

const vehicleData = ref<Vehicle>(props.vehicleData)
const vehicleDataCopy = ref<Vehicle>({ ...props.vehicleData });

watch(
  () => vehicleData.value.controlMode,
  (newValue: ControlMode, oldValue: ControlMode) => {
    console.log('vehicle.controlMode changed:', newValue, oldValue);
  }
);

function selectVehicle() {
  store.selectVehicle(vehicleData.value);
}

function saveCar() {
  switch (vehicleData.value.controlMode) {
    case ControlMode.Create:
      store.createVehicle(vehicleData.value);
      break;
    case ControlMode.Edit:
      store.updateVehicle(vehicleData.value);
      break;
  }

  vehicleData.value.controlMode = ControlMode.View;
}

function editCar() {
  vehicleData.value.controlMode = ControlMode.Edit;
}

function deleteCar() {
  store.deleteVehicle(vehicleData.value);
}

function cancelEdit() {
  vehicleData.value = vehicleDataCopy.value;

  vehicleData.value.controlMode = ControlMode.View;
}
</script>