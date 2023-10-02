<template>
  <ion-page>
    <ion-content :fullscreen="true" v-if="chatEnabled">
      <vue-advanced-chat height="100%" :single-room="true" :rooms-loaded="true" :messages-loaded="messagesLoaded"
        :current-user-id="store.profile?.user?.id.toString()" :rooms="JSON.stringify(rooms)" :messages="JSON.stringify(store.processedMessages)"
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

const guid = ref(store.currentTrip?.id.toString());

function send(event: any) {
  const data = event.detail[0]

  const receiverID = guid.value;
  const messageText = data.content;
  const receiverType = CometChat.RECEIVER_TYPE.GROUP;
  const textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);

  CometChat.sendMessage(textMessage).then(
    message => {
      const targetUserId = store.profile?.userType == "passenger" ?
          store.currentTrip?.driver.user.id : store.currentTrip?.passenger.user.id

      store.sendMessage(targetUserId, messageText)
      store.getConversation()
      console.log("Message sent successfully:", message);
    }, error => {
      console.log("Message sending failed with error:", error);
    }
  );
}

onMounted(async () => {
  messagesLoaded.value = true;
})

const messagesLoaded = ref(false)

const joinedUsers = ref(store.joinedUsers)

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
    users: store.joinedUsers,
    typingUsers: [4321]
  }
] as any[];

const roomActions = [
  // { name: 'inviteUser', title: 'Invite User' },
  // { name: 'removeUser', title: 'Remove User' },
  // { name: 'deleteRoom', title: 'Delete Room' },
] as any[];

const chatEnabled = computed(() => {
  return store.currentTrip?.driver_id != null;
})
</script>