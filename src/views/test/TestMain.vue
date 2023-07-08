<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>TestMain</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <h2 class="left-align">Get started with Voice Calling</h2>
      <div class="row">
        <div>
          <ion-button type="button" id="join" @click="join">Join</ion-button>
          <ion-button type="button" id="leave" @click="leave">Leave</ion-button>

          <ion-button type="button" id="mute" @click="user1">Mute</ion-button>
          <ion-button type="button" id="mute" @click="user2">Mute</ion-button>
        </div>
      </div>
      <br>
      <div id="message"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
} from '@ionic/vue';
import AgoraRTC from "agora-rtc-sdk-ng"

const token = ref<string>('007eJxTYNhzm5vfO2fX9+aww8vbv+i1J9r1Xb2qcd/1NseMO5K37NwUGFIMjc1SzE0SLU3MU0zMUlItEy0tEw3MjRKTLVNMzRPNhB0WpTQEMjLcuzafhZEBAkF8FoaS1OISBgYAm7cgrQ==')

function user1() {
  token.value = '007eJxTYDD9Es534+00oW12QR8U9/LfbjGqm8u6bEN2nHDP4oZHcVoKDCmGxmYp5iaJlibmKSZmKamWiZaWiQbmRonJlimm5olm99cvTGkIZGSo5G9lZGSAQBCfhaEktbiEgQEAMyofOw=='
}

function user2() {
  token.value = '007eJxTYEi9vWG/8uNTjCd7Hya8EnF2vSY7dZ+OyJWDCSl29yaIvnyhwJBiaGyWYm6SaGlinmJilpJqmWhpmWhgbpSYbJliap5oJntmYUpDICNDnNdsFkYGCATxWRhKUotLGBgAwsMgww=='
}

const options =
{
  // Pass your App ID here.
  appId: 'd2b9ac99d5334323a9f9ff4338a1c29f',
  // Set the channel name.
  channel: '10',
  // Pass your temp token here.
  token: '',
  // Set the user ID.
  uid: 0,
};

const channelParameters =
  {
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a remote audio track.
    remoteAudioTrack: null,
    // A variable to hold the remote user id.
    remoteUid: null,
  } as any;

const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });

async function startBasicCall() {
  // Create an instance of the Agora Engine


  // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
  agoraEngine.on("user-published", async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType);
    console.log("subscribe success");

    // Subscribe and play the remote audio track.
    if (mediaType == "audio") {
      channelParameters.remoteUid = user.uid;
      // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Play the remote audio track. 
      channelParameters.remoteAudioTrack.play();
      // showMessage("Remote user connected: " + user.uid);
    }

    // Listen for the "user-unpublished" event.
    agoraEngine.on("user-unpublished", user => {
      console.log(user.uid + "has left the channel");
      // showMessage("Remote user has left the channel");
    });
  });
}

async function join() {
  // Join a channel.
  await agoraEngine.join(options.appId, options.channel, null, options.uid);
  // showMessage("Joined channel: " + options.channel);
  // Create a local audio track from the microphone audio.
  channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // Publish the local audio track in the channel.
  await agoraEngine.publish(channelParameters.localAudioTrack);
  console.log("Publish success!");
}

async function leave() {
  // Destroy the local audio track.
  channelParameters.localAudioTrack.close();
  // Leave the channel
  await agoraEngine.leave();
  console.log("You left the channel");
}

startBasicCall();

</script>