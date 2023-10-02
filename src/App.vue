<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>

  <PhoneCallModal v-model:is-open="phoneCallModalOpen"></PhoneCallModal>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { useMainStore } from './store'
import { onMounted, watch, ref } from "vue";
import router from "@/router";
import PhoneCallModal from "@/components/PhoneCallModal.vue";
import {CometChat} from "@cometchat-pro/cordova-ionic-chat";

const store = useMainStore()

setInterval(() => {
  if (store.loggedIn) {
    store.getData()
  }

  if (store.profile?.userType == 'driver') {
    store.updatePosition()
  }
}, 5000);

onMounted(async () => {

  const currentTrip = await store.currentTrip

  if (currentTrip != null) {
    initComet()
    login()
  }
})

const phoneCallModalOpen = ref(false)

watch(() => store.currentTrip?.calling, (newValue, oldValue) => {
  phoneCallModalOpen.value = newValue

  if (newValue == true)
  {
    store.startCalling(store.currentTrip?.id.toString())
  }
  else
  {
    store.stopCalling()
  }
}, {deep: true})

const guid = ref(store.currentTrip?.id.toString());

const currentUserId = ref(store.profile?.user?.id.toString());

function initComet() {
  const appID = process.env.VUE_APP_COMETCHAT_APP_ID as string;
  const region = process.env.VUE_APP_COMETCHAT_REGION as string;
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

function listenMessages() {
  CometChat.addMessageListener(
      guid.value,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage: any) => {
          console.log("Text message received successfully", textMessage);
          store.getConversation()
          store.getUnreadMessages()
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

          store.joinedUsers.push(user)
        })

      }, error => {
        console.log("Group Member list fetching failed with exception:", error);
      }
  );
}

function initializeChat() {
  store.getConversation()
  listenMessages()
  getGroupMembers()
}
</script>
