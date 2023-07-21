<template>
  <ion-badge v-if="store.unreadMessages > 0" background="secondary">{{ store.unreadMessages }}</ion-badge>
</template>
<script setup lang="ts">
import {IonBadge} from "@ionic/vue";
import {useMainStore} from "@/store";

const store = useMainStore();


</script>