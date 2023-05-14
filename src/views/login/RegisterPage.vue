<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Register as {{ store.capitalizeFirstLetter(store.userType) }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen class="ion-padding">
      <ion-list>
        <ion-item-divider mode="ios">
          <ion-label class="ion-text-center"> User Details </ion-label>
        </ion-item-divider>

        <ion-item>
          <ion-label>Name</ion-label>
          <ion-input v-model="store.name" placeholder="Enter name" slot="end"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Gender</ion-label>
          <ion-segment v-model="store.gender">
            <ion-segment-button value="male" layout="icon-start">
              <ion-icon :icon="maleOutline"></ion-icon>
              <ion-label>Male</ion-label>
            </ion-segment-button>
            <ion-segment-button value="female" layout="icon-start">
              <ion-icon :icon="femaleOutline"></ion-icon>
              <ion-label>Female</ion-label>
            </ion-segment-button>
          </ion-segment>
        </ion-item>

        <ion-item>
          <ion-label>Birth Date</ion-label>
          <ion-datetime-button datetime="datetime">
            <div slot="date-target">{{ store.formatDate(store.birthDate, "dd-MM-yyyy") }}</div>
          </ion-datetime-button>

          <ion-modal :keep-contents-mounted="true">
            <ion-datetime id="datetime" presentation="date" :value="store.birthDate"></ion-datetime>
          </ion-modal>
        </ion-item>

        <div v-if="store.userType === 'passenger'">
          <ion-item-divider mode="ios">
            <ion-label class="ion-text-center"> Vehicle Details </ion-label>
          </ion-item-divider>

          <ion-item>
            <ion-label>Car Plate Number</ion-label>
            <ion-input v-model="store.carPlateNumber" placeholder="Car Plate Number" slot="end" maxlength="8"
              @keypress="store.convertToCapitalNumeric"></ion-input>
          </ion-item>

          <ion-item>
            <ion-grid>
              <ion-row>
                <ion-label>Upload Car Photo</ion-label>
              </ion-row>
              <n-upload max="1" :default-file-list="fileList" list-type="image-card" @preview="handlePreview" />
              <n-modal v-model:show="showModal" preset="card" style="width: 600px" title="A Cool Picture">
                <img :src="previewImageUrl" style="width: 100%">
              </n-modal>
            </ion-grid>
          </ion-item>
        </div>
        <div v-else>
          <ion-item-divider mode="ios">
            <ion-label class="ion-text-center"> Driver Details </ion-label>
          </ion-item-divider>

          <ion-item>
            <ion-label>License Number</ion-label>
            <ion-input v-model="licenseNumber" placeholder="Enter here" slot="end" maxlength="8"
              @keypress="store.convertToCapitalNumeric"></ion-input>
          </ion-item>

          <ion-item>
            <ion-grid>
              <ion-row>
                <ion-label>Upload License Photo</ion-label>
              </ion-row>
              <n-upload max="1" :default-file-list="licensePhotoFileList" list-type="image-card"
                @preview="handlePreview" />
              <n-modal v-model:show="showModal" preset="card" style="width: 600px" title="A Cool Picture">
                <img :src="previewImageUrl" style="width: 100%">
              </n-modal>
            </ion-grid>
          </ion-item>

          <ion-item>
            <ion-grid>
              <ion-row>
                <ion-label>Upload Driver Profile Photo</ion-label>
              </ion-row>
              <n-upload max="1" :default-file-list="licensePhotoFileList" list-type="image-card"
                @preview="handlePreview" />
              <n-modal v-model:show="showModal" preset="card" style="width: 600px" title="A Cool Picture">
                <img :src="previewImageUrl" style="width: 100%">
              </n-modal>
            </ion-grid>
          </ion-item>
        </div>
      </ion-list>

      <ion-button expand="block">Submit</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonSegment, IonSegmentButton,
  IonText, IonModal, IonDatetime, IonDatetimeButton, IonItemDivider, IonIcon, IonButton, IonGrid, IonRow, IonCol,
} from '@ionic/vue';
import { maleOutline, femaleOutline } from 'ionicons/icons';
import { useMainStore } from '@/store';
import type { UploadFileInfo } from 'naive-ui'
import { NUpload, NUploadDragger, NIcon, NImage, NModal } from 'naive-ui';

const store = useMainStore();

const licenseNumber = ref('')

const showModal = ref(false)
const previewImageUrl = ref('')

function handlePreview(file: UploadFileInfo) {
  const { url } = file
  previewImageUrl.value = url as string
  showModal.value = true
}

const fileList = ref<UploadFileInfo[]>([])
const licensePhotoFileList = ref<UploadFileInfo[]>([])
</script>

<style scoped>
ion-content {
  --ion-padding: 16px;
}
</style>