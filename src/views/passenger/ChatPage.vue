<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <vue-advanced-chat height="100%" :single-room="true" :rooms-loaded="true" :messages-loaded="messagesLoaded"
        :current-user-id="currentUserId" :rooms="JSON.stringify(rooms)" :messages="JSON.stringify(messages)"
        :room-actions="JSON.stringify(roomActions)" @send-message="send" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IonPage, IonContent } from '@ionic/vue';
import { useMainStore } from '@/store';
import { register } from 'vue-advanced-chat'
import { CometChat } from '@cometchat-pro/cordova-ionic-chat';

// vue-advanced-chat register
register()

const store = useMainStore();

const guid = ref(store.currentTrip?.id.toString());

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

function send(event: any) {
  const data = event.detail[0]

  const receiverID = guid.value;
  const messageText = data.content;
  const receiverType = CometChat.RECEIVER_TYPE.GROUP;
  const textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);

  CometChat.sendMessage(textMessage).then(
    message => {
      getConversation()
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

onMounted(() => {
  messagesLoaded.value = true;
})

const messagesLoaded = ref(false)
const currentUserId = store.profile.user.id.toString();
const rooms = [
  {
    roomId: '1',
    roomName: store.chatRoomName,
    avatar: '',
    unreadCount: 4,
    index: 3,
    lastMessage: {
      _id: 'xyz',
      content: 'Last message received',
      senderId: '1234',
      username: 'John Doe',
      timestamp: '10:20',
      saved: true,
      distributed: false,
      seen: false,
      new: true
    },
    users: [
      {
        _id: '1234',
        username: 'John Doe',
        avatar: '',
        status: {
          state: 'online',
          lastChanged: 'today, 14:30'
        }
      },
      {
        _id: '4321',
        username: 'John Snow',
        avatar: '',
        status: {
          state: 'offline',
          lastChanged: '14 July, 20:00'
        }
      }
    ],
    typingUsers: [4321]
  }
] as any[];

const messages = [
  {
    _id: '7890',
    indexId: 12092,
    content: 'Message 1',
    senderId: '1234',
    username: 'John Doe',
    avatar: '',
    date: '13 November',
    timestamp: '10:20',
    system: false,
    saved: true,
    distributed: true,
    seen: true,
    deleted: false,
    failure: false,
    disableActions: false,
    disableReactions: false,
    files: [
    ],
    reactions: {
    },
    replyMessage: {
      content: 'Reply Message',
      senderId: '4321',
      files: [
      ]
    },
  }
] as any[];

const roomActions = [
  // { name: 'inviteUser', title: 'Invite User' },
  // { name: 'removeUser', title: 'Remove User' },
  // { name: 'deleteRoom', title: 'Delete Room' },
] as any[];
</script>