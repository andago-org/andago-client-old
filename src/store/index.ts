import { defineStore } from 'pinia'
import axios from 'axios';
import router from '@/router';
import { UserType, Gender, Vehicle, ControlMode, } from '@/interfaces/types';
import { Preferences } from '@capacitor/preferences';
import Pusher, { Channel } from 'pusher-js';
import Echo from 'laravel-echo';
import { toastController, ToastOptions, loadingController, LoadingOptions, modalController, ModalOptions } from '@ionic/vue';
import { format, } from 'date-fns';
import {CometChat} from "@cometchat-pro/cordova-ionic-chat";

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const echoInstance = new Echo({
  broadcaster: 'pusher',
  key: process.env.VUE_APP_PUSHER_APP_KEY,
  cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
  encrypted: true,
  authEndpoint: `${process.env.VUE_APP_API_BASE_URL}/broadcasting/auth`,
});

export const useMainStore = defineStore({
  id: 'mainStore',
  state: () => ({
    userType: UserType.Passenger as UserType,
    phoneNumber: "" as string,
    name: "" as string,
    gender: Gender.Male as Gender,
    birthDate: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss') as string,
    carPlateNumber: "" as string,
    token: "" as string,
    tokenLoaded: false as boolean,
    profile: {} as any,
    currentTrip: null as any || null,
    currentPayment: null as any || null,
    selectedVehicle: null as any | null,
    vehicles: [] as any[],
    fakeGeolocation: false as boolean,
    pickUpPlace: {} as any | null,
    dropOffPlace: {} as any | null,
    channel: null as Channel | null,
    ionToast: {} as HTMLIonToastElement,
    ionLoading: {} as HTMLIonLoadingElement,
    syncedData: {} as any,
    topUpModalOpen: false,
    suggestedTopUpAmount: 0 as number,
    addWaitTimeModalOpen: false,
    addWaitTimeRequestModalOpen: false,
    driverStatusOn: false,
    joinedUsers: [] as any[],
    processedMessages: [] as any[],
    unreadMessages: [] as any[],
  }),
  getters: {
    isIos() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) as boolean
    },
    currentPosition() {
      return new Promise((resolve, reject) => {
        if (this.isIos) {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              console.log(`Latitude: ${lat}, Longitude: ${lng}`)
              resolve({
                lat: lat,
                lng: lng,
              });
            }, function (error) {
              console.error("Error obtaining geolocation:", error);
              reject(error);
            });
          } else {
            console.error("Geolocation is not available in this browser.");
            reject(new Error("Geolocation is not available in this browser."));
          }
        } else {
          const currentPosition = AndroidBridge.getLocation();
          const position = currentPosition.split(',');

          const coordinate = {
            lat: position[0],
            lng: position[1],
          };

          resolve(coordinate);
        }
      });
    },
    axios() {
      axiosInstance.defaults.headers['Accept'] = 'application/json';
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${this.token}`;

      return axiosInstance;
    },
    echo() : Echo {
      echoInstance.options.auth = {
        headers: {
          'Authorization': 'Bearer ' + this.token,
        },
      }

      echoInstance.connect()

      return echoInstance;
    },
    ionNav() : HTMLIonNavElement {
      return document.querySelector('ion-nav') as HTMLIonNavElement;
    },
    localStorage() {
      return Preferences;
    },
    acceptImageFileFormats() {
      return "image/jpeg, image/png, image/jpg";
    },
    loggedIn() : boolean {
      return Boolean(this.token);
    },
    searchingForDriver() : boolean {
      return this.currentTrip.status === 'confirmed';
    },
    chatRoomName() : string {
      if (this.profile.userType == "passenger") {
        return this.currentTrip?.driver?.user.name
      }
      else {
        return this.currentTrip?.passenger?.user.name
      }
    },
  },
  actions: {
    async getData(): Promise<any> {
      const oneSignalPlayerId = await this.getOneSignalPlayerId()

      const data = {
        oneSignalPlayerId: oneSignalPlayerId
      }

      return this.axios.post('/auth/getData', data)
        .then(
          async (response) => {
            const data = response.data;
            
            this.profile = data.profile;
            this.currentTrip = data.currentTrip;
            this.currentPayment = data.currentPayment;

            if (this.currentTrip?.driver_id !== null) {
              const tripId = this.currentTrip?.id
            
              // if (this.currentTrip?.calling) {
              //   this.startCalling(tripId)
              // } else {
              //   this.stopCalling()
              // }
            }

            return data
          }
        )
        .catch(
          async (error) => {
            if (error.response?.status == 401) {
                this.logout()
            }

            console.log(error)
          }
        )
      ;
    },

    async openModal(Modal: any)
    {
      const modal = await modalController.create({
        component: Modal,
      });
      await modal.present();
    },

    async getOneSignalPlayerId(): Promise<string> {
      let oneSignalPlayerId = '' as string

      if (this.isIos) {
        oneSignalPlayerId = window.oneSignalPlayerId as string
      }
      else {
        oneSignalPlayerId = AndroidBridge.getOneSignalPlayerId()
      }

      return oneSignalPlayerId
    },

    getVehicles() {
      this.axios.post('/passengers/vehicles/getVehicles')
        .then((response: any) => {
          const vehicles = response.data

          this.vehicles = []

          vehicles.forEach((vehicle: any) => {
            this.vehicles.push({ ...vehicle, controlMode: ControlMode.View, saved: true })
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },

    getConversation() {
      const GUID = this.currentTrip?.id?.toString();
      const limit = 30;
      const messagesRequest = new CometChat.MessagesRequestBuilder()
          .setType('text')
          .setGUID(GUID)
          .setLimit(limit)
          .build();

      messagesRequest.fetchPrevious().then(
          messages => {
            console.log("Message list fetched:", messages);
            this.processMessages(messages)
          }, error => {
            console.log("Message fetching failed with error:", error);
          }
      );
    },

    getUnreadMessages() {
      const GUID = this.currentTrip?.id?.toString();
      const limit = 30;
      const messagesRequest = new CometChat.MessagesRequestBuilder()
          .setType('text')
          .setGUID(GUID)
          .setUnread(true)
          .setLimit(limit)
          .build();

      messagesRequest.fetchPrevious().then(
          messages => {
            console.log("Message list fetched:", messages);
            this.unreadMessages = []



            messages.forEach((message) => {
              if (router.currentRoute.value.name?.toString().split('_')[1] == "Chat")
              {
                CometChat.markAsRead(message).then(
                    () => {
                      console.log("mark as read success.");
                    },
                    (error: any) => {
                      console.log("An error occurred when marking the message as read.", error);
                    }
                );
              }
              else {
                this.unreadMessages.push(message)
              }
            })
          }, error => {
            console.log("Message fetching failed with error:", error);
          }
      );
    },

    clearUnreadMessages()
    {
      // Convert each asynchronous operation into a promise if it's not already a promise.
      const markAsReadPromises = this.unreadMessages.map(message => {
        return CometChat.markAsRead(message).then(
            () => {
              console.log("mark as read success.");
            },
            (error: any) => {
              console.log("An error occurred when marking the message as read.", error);
            }
        );
      });

      // Wait for all the promises to resolve before clearing the unreadMessages array.
      Promise.all(markAsReadPromises).then(() => {
        this.unreadMessages = [];
      }).catch(error => {
        console.log("An error occurred with one or more mark as read operations.", error);
      });
    },

    processMessages(messages: any[]) {
      this.processedMessages = []

      messages.forEach((message: any) => {
        // Process message
        const processedMessage = {
          _id: message.id,
          indexId: message.id,
          content: message.text,
          senderId: message.sender.uid,
          username: message.sender.name,
          avatar: '',
          date: this.formatFromTimestamp(message.sentAt, 'dd MMM yyyy'),
          timestamp: this.formatFromTimestamp(message.sentAt, 'HH:mm a'),
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
        }

        this.processedMessages.push(processedMessage)
      })
    },

    async setCalling(calling: boolean) {
      const data = {
        calling: calling,
      }

      this.axios.post(`/${this.profile.userType}s/trips/setCalling`, data)
          .then(async (res) => {
            const data = res.data

            if (data.status == 'success') {

              this.currentTrip = data.currentTrip
            }
          }).catch((err) => {
        console.log(err);
      })
    },

    startCalling(tripId: string) {
      if (this.isIos) {
        window.webkit.messageHandlers.jsBridge.postMessage({
          "function": "startCall",
          "tripId": tripId
        })
      } else {
        AndroidBridge.startCall(tripId)
      }
    },

    stopCalling() {
      if (this.isIos) {
        window.webkit.messageHandlers.jsBridge.postMessage({
          "function": "stopCall",
        })
      } else {
        AndroidBridge.stopCall()
      }
    },

    async sendMessage(targetUserId: string, message: string) {
      const data = {
        'targetUserId': targetUserId,
        'message': message,
      }

      this.axios.post(`/users/chat/sendMessage`, data)
          .then((res) => {
            //
          }).catch((err) => {
        console.log(err);
      })
    },

    async updatePosition() {
      const data = {
        position: await this.currentPosition,
      }

      this.axios.post('/drivers/updatePosition', data)
        .then((response) => {
          console.log(response.data)
        }
      )
      .catch((error) => {
        console.log(error)
      })
    },

    async showToast( toastOptions: ToastOptions )
    {
      this.ionToast = await toastController.create(toastOptions);
    
      await this.ionToast.present()

      return this.ionToast
    },

    async showLoading( loadingOptions: LoadingOptions )
    {
      this.ionLoading = await loadingController.create(loadingOptions)
    
      await this.ionLoading.present()
    
      return this.ionLoading
    },

    async showModal( modalOptions: ModalOptions )
    {
      const modal = await modalController.create(modalOptions)
    
      await modal.present()
    
      return modal
    },

    async logout() {
      const message = "Logged out successfully.";

      await this.axios.post("/auth/logout")

      const toast = await this.showToast({
        message: message,
        duration: 1000,
        position: "middle",
      })

      toast.onDidDismiss().then(() => {
        this.profile = null
        this.clearUserToken()

        this.showLoading({})

        router.go(0)
      })
    },

    setHeaders()
    {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },

    async openBrowser(url: string): Promise<void> {
      if (this.isIos) {
        window.webkit.messageHandlers.jsBridge.postMessage({
          "function": "openBrowser",
          "url": url
        })
      }
      else
      {
        AndroidBrowser.open(url)
      }
    },

    async closeBrowser(): Promise<void> {
        if (this.isIos) {
          window.webkit.messageHandlers.jsBridge.postMessage({
            "function": "closeBrowser",
          })
        }
        else
        {
            AndroidBrowser.close()
        }
    },
    
    async openMap(position: any = { lat: 3.0668693359101, lng: 101.67422110225 }): Promise<void> {
      const coordString = `${position.lat},${position.lng}`

      if (this.isIos) {
        await this.openBrowser(`http://maps.apple.com/?q=${coordString}`)
      }
      else
      {
        await AndroidBridge.openMap(coordString)
      }
    },

    async loadTokenFromStorage() {
      await Preferences.get({ key: 'token' }).then(async (result: any) => {
        if (result.value) {

          this.token = result.value
          await this.getData()
        }
      })
    },

    async saveTokenToStorage() {
      await Preferences.set({ key: 'token', value: this.token as string })
    },

    async clearUserToken() {
      this.token = ""
      await Preferences.remove({ key: 'token' })
    },

    connectChannel(channelName: string) {
      // Initialize Pusher and create a new channel instance
      const pusher = new Pusher(process.env.VUE_APP_PUSHER_APP_KEY, {
        cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
      })
      this.channel = pusher.subscribe(channelName)
    },

    capitalizeFirstLetter(text: string): string {
      if (text.length === 0) {
        return text;
      }
    
      return text.charAt(0).toUpperCase() + text.slice(1);
    },

    convertToCapitalNumeric(event: InputEvent): void {
      const allowedCharacters = /[A-Z0-9]/;
      const inputElement = event.target as HTMLInputElement;
      const originalValue = inputElement.value;
    
      if (event instanceof CompositionEvent) {
        return;
      }
    
      setTimeout(() => {
        const newValue = inputElement.value
          .toUpperCase()
          .split('')
          .filter((char) => allowedCharacters.test(char))
          .join('');
    
        if (inputElement.value !== originalValue) {
          inputElement.value = newValue;
          event.preventDefault();
          inputElement.dispatchEvent(new InputEvent('input'));
        }
      });
    },

    digitOnlyInput(event: KeyboardEvent) {
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    },

    validateNotEmpty(text: string): boolean {
      return text?.length > 0;
    },

    isObjectEmpty(object: any): boolean {
      return Object.keys(object).length === 0;
    },

    formatFromTimestamp(timestamp: number, formatStr: string): string {
      const date = format(new Date(timestamp * 1000), formatStr) as string

      return date;
    },
  },
  persist: {
    enabled: true,
  },
})