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
            <ion-input v-model="vehiclePlateNumber" placeholder="Car Plate Number" slot="end" maxlength="8"
              @keypress="store.convertToCapitalNumeric"></ion-input>
          </ion-item>

          <ion-item>
            <ion-grid>
              <ion-row>
                <ion-label>Upload Car Photo</ion-label>
              </ion-row>
              <n-upload :max="1" :default-upload="false" v-model:file-list="vehiclePhotoFileList" list-type="image-card"
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

      <ion-button expand="block" @click="register" :disabled="!readyToSubmit">Submit</ion-button>
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
import router from '@/router';

const store = useMainStore()

// User Details
const name = ref<string>(store.profile.user.name)
const gender = ref<Gender>(store.profile.user.gender)
const birthDate = ref(store.profile.user.birth_date)

// Passenger Profile
const vehiclePlateNumber = ref<string>('')
const vehiclePhotoFileList = ref<UploadFileInfo[]>([])

// Driver Profile
const licenseNumber = ref('')
const licensePhotoFileList = ref<UploadFileInfo[]>([])
const driverPhotoFileList = ref<UploadFileInfo[]>([])

const readyToSubmit = ref(false)

watchEffect(
  () => {
    readyToSubmit.value = validate()
  }
)

function validate(): boolean {
  switch (store.userType) {
    case 'passenger':
      return (
        store.validateNotEmpty(name.value) &&
        store.validateNotEmpty(vehiclePlateNumber.value) &&
        vehiclePhotoFileList.value.length > 0
      )
    case 'driver':
      return (
        store.validateNotEmpty(name.value) &&
        store.validateNotEmpty(licenseNumber.value) &&
        licensePhotoFileList.value.length > 0 &&
        driverPhotoFileList.value.length > 0
      )
  }

  return false
}

async function register() {
  store.axios.defaults.headers['Content-Type'] = 'multipart/form-data'

  const formData = new FormData()

  formData.append('userType', store.profile.userType)
  formData.append('name', name.value)
  formData.append('gender', gender.value)
  formData.append('birthDate', birthDate.value)

  switch (store.profile.userType) {
    case 'passenger':
      {
        formData.append('plateNumber', vehiclePlateNumber.value)
        formData.append('vehiclePhoto', vehiclePhotoFileList.value[0].file as any)

        break
      }
    case 'driver':
      {
        formData.append('licenseNumber', licenseNumber.value)
        formData.append('licensePhoto', licensePhotoFileList.value[0].file as any)
        formData.append('driverPhoto', driverPhotoFileList.value[0].file as any)

        break
      }
  }

  const apiUrl = '/auth/registerAs' + store.capitalizeFirstLetter(store.profile.userType)

  store.axios.post(apiUrl, formData)
    .then(async response => {
      const data = response.data

      store.profile = data.profile

      const toast = await store.showToast({
        message: data.message,
        duration: 2000,
        position: 'middle',
      })

      toast.onDidDismiss().then(() => {
        router.go(0)
      })
    })
    .catch(async error => {
      const data = error.response.data

      store.showToast({
        message: data.message,
        duration: 2000,
        position: 'middle',
      })
    })
}
</script>

<style scoped>
ion-content {
  --ion-padding: 16px;
}
</style>