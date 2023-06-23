<template>
  <ion-page>
    <ion-content :fullscreen="true" v-if="chatEnabled">
      <vue-advanced-chat height="100%" :single-room="true" :rooms-loaded="true" :messages-loaded="messagesLoaded"
        :current-user-id="currentUserId" :rooms="JSON.stringify(rooms)" :messages="JSON.stringify(processedMessages)"
        :room-actions="JSON.stringify(roomActions)" @send-message="send" :show-audio="false" :show-files="false" />
    </ion-content>

    <ion-grid v-else>
      <ion-row class="ion-align-items-center" style="height: 100%">
        <ion-col>
          <n-empty description="You currently have no trip" size="huge">
            <template #icon>
              <n-icon>
                <car-crash-twotone />
              </n-icon>
            </template>
          </n-empty>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { NEmpty, NIcon } from 'naive-ui';
import { CarCrashTwotone } from '@vicons/material';
import { useMainStore } from '@/store';
import { register } from 'vue-advanced-chat'
import { CometChat } from '@cometchat-pro/cordova-ionic-chat';

// vue-advanced-chat register
register()

const store = useMainStore();

const guid = ref(store.currentTrip?.cometGuid);

const currentUserId = ref();

function initComet() {
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
}

function login() {
  CometChat.getLoggedinUser().then(
    (user: any) => {

      if (!user) {
        CometChat.login(store.profile.user.comet_token).then(
          (user: CometChat.User) => {
            console.log("Login Successful:", { user });
            currentUserId.value = user.getUid()
            initializeChat()
          }, (error: CometChat.CometChatException) => {
            console.log("Login failed with exception:", { error });
          }
        );
      }
      else {
        currentUserId.value = user.uid
        initializeChat()
      }
    }, (error: CometChat.CometChatException) => {
      console.log("Some Error Occured", { error });
    }
  );
}

function initializeChat() {
  getConversation()
  listenMessages()
}

function listenMessages() {
  CometChat.addMessageListener(
    guid.value,
    new CometChat.MessageListener({
      onTextMessageReceived: (textMessage: any) => {
        console.log("Text message received successfully", textMessage);
        getConversation()
      },
      onMediaMessageReceived: (mediaMessage: any) => {
        console.log("Media message received successfully", mediaMessage);
      },
      onCustomMessageReceived: (customMessage: any) => {
        console.log("Custom message received successfully", customMessage);
      }
    })
  );
}

const joinedUsers = ref([] as any[]);

function getGroupMembers() {
  const groupMemberRequest = new CometChat.GroupMembersRequestBuilder(guid.value)
    .setLimit(100)
    .build();

  groupMemberRequest.fetchNext().then(
    groupMembers => {
      console.log("Group Member list fetched successfully:", groupMembers);

      groupMembers.forEach((member: any) => {
        const user = {
          _id: member.uid,
          username: member.name,
          avatar: ""
        }

        joinedUsers.value.push(user)
      })

    }, error => {
      console.log("Group Member list fetching failed with exception:", error);
    }
  );
}

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
      processMessages(messages)
    }, error => {
      console.log("Message fetching failed with error:", error);
    }
  );
}

onMounted(() => {
  initComet()
  login()
  getGroupMembers()

  messagesLoaded.value = true;
})

const messagesLoaded = ref(false)

const rooms = [
  {
    roomId: '1',
    roomName: store.chatRoomName,
    avatar: '',
    unreadCount: 4,
    index: 3,
    // lastMessage: {
    //   _id: 'xyz',
    //   content: 'Last message received',
    //   senderId: '1234',
    //   username: 'John Doe',
    //   timestamp: '10:20',
    //   saved: true,
    //   distributed: false,
    //   seen: false,
    //   new: true
    // },
    users: joinedUsers.value,
    typingUsers: [4321]
  }
] as any[];

const processedMessages = ref([] as any[])

function processMessages(messages: any[]) {
  processedMessages.value = []

  messages.forEach((message: any) => {
    // Process message
    const processedMessage = {
      _id: message.id,
      indexId: message.id,
      content: message.text,
      senderId: message.sender.uid,
      username: message.sender.name,
      avatar: '',
      date: store.formatFromTimestamp(message.sentAt, 'dd MMM yyyy'),
      timestamp: store.formatFromTimestamp(message.sentAt, 'HH:mm a'),
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
      // replyMessage: {
      //   content: 'Reply Message',
      //   senderId: '4321',
      //   files: [
      //   ]
      // },
    }

    processedMessages.value.push(processedMessage)
  })
}

const roomActions = [
  // { name: 'inviteUser', title: 'Invite User' },
  // { name: 'removeUser', title: 'Remove User' },
  // { name: 'deleteRoom', title: 'Delete Room' },
] as any[];

const chatEnabled = computed(() => {
  return store.currentTrip?.driver_id != null;
})
</script>