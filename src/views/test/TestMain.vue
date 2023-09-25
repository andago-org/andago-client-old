<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>TestMain</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-button @click="startCall">Start</ion-button>
      <ion-button @click="stopCall">Stop</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {
  IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
} from '@ionic/vue';
import {useMainStore} from "@/store";

const store = useMainStore()

function startCall()
{
  AndroidBridge.startCall('test')
}

function stopCall()
{
  AndroidBridge.stopCall()
}
</script>