<template>
  <ion-badge v-if="store.unreadMessages.length" background="secondary">{{ store.unreadMessages.length }}</ion-badge>
</template>
<script setup lang="ts">
import {IonBadge} from "@ionic/vue";
import {useMainStore} from "@/store";

const store = useMainStore();


</script>