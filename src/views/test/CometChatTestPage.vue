<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>CometChatTestPage</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-label>GUID</ion-label>
          <ion-input v-model="guid"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Message</ion-label>
          <ion-input v-model="message" placeholder="Enter company name"></ion-input>
        </ion-item>

        <ion-button @click="send" expand="block">Send</ion-button>
        <ion-button @click="getConversation" expand="block">Get Conversation</ion-button>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonList, IonItem, IonLabel, IonButton } from '@ionic/vue';
import { CometChat } from '@cometchat-pro/cordova-ionic-chat';
import { useMainStore } from '@/store';

const store = useMainStore();

const guid = ref('');
const message = ref('');

const appID = "23694678a67dabe9" as string;
const region = "eu" as string;
const appSetting: CometChat.AppSettings = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(region)
  .autoEstablishSocketConnection(true)
  .build();

CometChat.init(appID, appSetting).then(
  (initialized: boolean) => {
    console.log("Initialization completed successfully", initialized);
  }, (error: CometChat.CometChatException) => {
    console.log("Initialization failed with error:", error);
  }
);

CometChat.getLoggedinUser().then(
  (user: any) => {
    if (!user) {
      CometChat.login(store.profile.user.comet_token).then(
        (user: CometChat.User) => {
          console.log("Login Successful:", { user });
        }, (error: CometChat.CometChatException) => {
          console.log("Login failed with exception:", { error });
        }
      );
    }
  }, (error: CometChat.CometChatException) => {
    console.log("Some Error Occured", { error });
  }
);

function send() {
  const receiverID = guid.value;
  const messageText = message.value;
  const receiverType = CometChat.RECEIVER_TYPE.USER;
  const textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);

  CometChat.sendMessage(textMessage).then(
    message => {
      console.log("Message sent successfully:", message);
    }, error => {
      console.log("Message sending failed with error:", error);
    }
  );
}

function getConversation() {
  const GUID = guid.value;
  const limit = 30;
  const messagesRequest = new CometChat.MessagesRequestBuilder()
    .setType('text')
    .setGUID(GUID)
    .setLimit(limit)
    .build();

  messagesRequest.fetchPrevious().then(
    messages => {
      console.log("Message list fetched:", messages);
    }, error => {
      console.log("Message fetching failed with error:", error);
    }
  );
}
</script>