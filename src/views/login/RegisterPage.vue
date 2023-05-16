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
          <ion-input v-model="name" placeholder="Enter name" slot="end"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Gender</ion-label>
          <ion-segment v-model="gender">
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
          <n-date-picker v-model:formatted-value="birthDate" type="date" format="dd-MM-yyyy" value-format="yyyy-MM-dd" />
        </ion-item>

        <div v-if="store.userType === 'passenger'">
          <ion-item-divider mode="ios">
            <ion-label class="ion-text-center"> Vehicle Details </ion-label>
          </ion-item-divider>

          <ion-item>
            <ion-label>Car Plate Number</ion-label>
            <ion-input v-model="vehicleName" placeholder="Car Plate Number" slot="end" maxlength="8"
              @keypress="store.convertToCapitalNumeric"></ion-input>
          </ion-item>

          <ion-item>
            <ion-grid>
              <ion-row>
                <ion-label>Upload Car Photo</ion-label>
              </ion-row>
              <n-upload :max="1" v-model:file-list="vehiclePhotoFileList" list-type="image-card"
                :accept="store.acceptImageFileFormats" />
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
              <n-upload max="1" v-model:file-list="licensePhotoFileList" list-type="image-card"
                :accept="store.acceptImageFileFormats" />
            </ion-grid>
          </ion-item>

          <ion-item>
            <ion-grid>
              <ion-row>
                <ion-label>Upload Driver Profile Photo</ion-label>
              </ion-row>
              <n-upload max="1" v-model:file-list="driverPhotoFileList" list-type="image-card"
                :accept="store.acceptImageFileFormats" />
            </ion-grid>
          </ion-item>
        </div>
      </ion-list>

      <ion-button expand="block" @click="submit" :disabled="!readyToSubmit">Submit</ion-button>
      <ion-button expand="block" color="secondary" @click="store.logout">Cancel</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, watchEffect } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonSegment, IonSegmentButton,
  IonItemDivider, IonIcon, IonButton, IonGrid, IonRow, IonCol, IonButtons, IonBackButton
} from '@ionic/vue';
import { maleOutline, femaleOutline } from 'ionicons/icons';
import { useMainStore } from '@/store';
import type { UploadFileInfo } from 'naive-ui'
import { NUpload, NUploadDragger, NIcon, NImage, NModal, NDatePicker } from 'naive-ui';
import { arrowBack } from 'ionicons/icons';
import { Gender } from '@/interfaces/types';
import { format } from 'date-fns';
import { validateBBox } from '@turf/turf';

const store = useMainStore()
const acceptFormat = ref('image/png, image/jpeg')

// User Details
const name = ref(store.profile.user.name)
const gender = ref(store.profile.user.gender)
const birthDate = ref(store.profile.user.birth_date)

// Passenger Profile
const vehicleName = ref('')
const vehiclePhotoFileList = ref<UploadFileInfo[]>([])

// Driver Profile
const licenseNumber = ref('')
const licensePhotoFileList = ref<UploadFileInfo[]>([])
const driverPhotoFileList = ref<UploadFileInfo[]>([])

const readyToSubmit = ref(false)

watchEffect(
  () => {
    readyToSubmit.value = validate()

    console.log(vehiclePhotoFileList.value)
  }
)

function validate(): boolean {
  switch (store.userType) {
    case 'passenger':

      return (
        store.validateNotEmpty(name.value) &&
        store.validateNotEmpty(vehicleName.value) &&
        vehiclePhotoFileList.value.length > 0
      )
    case 'driver':
      (
        store.validateNotEmpty(name.value) &&
        store.validateNotEmpty(licenseNumber.value) &&
        licensePhotoFileList.value.length > 0 &&
        driverPhotoFileList.value.length > 0
      )
      return true
  }

  return false
}

function register() {
  switch (store.profile.userType) {
    case 'passenger':
    case 'driver':
  }
}
</script>

<style scoped>
ion-content {
  --ion-padding: 16px;
}
</style>