<template>
  <div>

  </div>
</template>

<script setup lang="ts">
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import TopUpModal from '@/components/TopUpModal.vue';
import { useMainStore } from '@/store';

const store = useMainStore();

const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.VUE_APP_PUSHER_APP_KEY,
  cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
  encrypted: true,
  authEndpoint: 'http://localhost/api/auth/broadcasting/auth', // Optional: If using private channels
  auth: {
    headers: {
      Authorization: 'Bearer ' + store.token, // Optional: If using private channels
    },
  },
});

echo.private('test-channel')
  .listen('.test-event', (e: any) => {
    console.log(e);
  });
</script>

<style></style>