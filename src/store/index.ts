import { defineStore } from 'pinia'
import axios from 'axios';
import router from '@/router';
import { UserType, Gender, Coordinate, Vehicle, ControlMode, } from '@/interfaces/types';
import { Preferences } from '@capacitor/preferences';
import Pusher, { Channel } from 'pusher-js';
import Echo from 'laravel-echo';
import { toastController, ToastOptions, loadingController, LoadingOptions, modalController, ModalOptions } from '@ionic/vue';
import { format, } from 'date-fns';

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
    vehicles: [] as Vehicle[],
    fakeGeolocation: false as boolean,
    pickUpPlace: {} as any | null,
    dropOffPlace: {} as any | null,
    channel: null as Channel | null,
    ionToast: {} as HTMLIonToastElement,
    ionLoading: {} as HTMLIonLoadingElement,
    syncedData: {} as any,
    suggestedTopUpAmount: 0 as number,
    unreadMessages: 0,
    addWaitTimeModalOpen: false,
    addWaitTimeRequestModalOpen: false,
  }),
  getters: {
    isIos() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) as boolean
    },
    currentPosition() {
      let currentPosition = ''

      if (this.isIos) {
        // currentPosition = window.currentLocation

        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            console.log(`Latitude: ${lat}, Longitude: ${lng}`)

            return {
              lat: lat,
              lng: lng,
            }
            // Use lat and lng as needed
          }, function(error) {
            console.error("Error obtaining geolocation:", error)
          })
        } else {
          console.error("Geolocation is not available in this browser.")
        }
      } else {
        currentPosition = AndroidBridge.getLocation()
      }

      const position = currentPosition.split(',')

      const coordinate: any = {
        lat: position[0],
        lng: position[1],
      }

      return coordinate
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

            return data
          }
        )
        .catch(
          async (error) => {
            if (error.response.status == 401) {
                this.logout()
            }

            console.log(error)
          }
        )
      ;
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

    async call() {
      this.axios.post(`/${this.profile.userType}s/trips/call`)
          .then(async (res) => {
            const data = res.data

            if (data.status == 'success') {
              await this.showToast({
                message: data.message,
                duration: 2000,
                position: "middle",
              })
            }
          }).catch((err) => {
        console.log(err);
      })
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

    clearUnreadMessages()
    {
      this.unreadMessages = 0
    },

    async updatePosition() {
      const data = {
        position: this.currentPosition,
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

    async getVehicles(): Promise<any> {
      try {
        this.setHeaders();

        const response = await axiosInstance.get("/vehicles");
    
        // Check for success
        if (response.status === 200) {
          
          console.log(response.data);

          this.vehicles = [];

          response.data.forEach((vehicle: Vehicle) => {
            this.vehicles.push({ ...vehicle, controlMode: ControlMode.View } as Vehicle);
          });

          // return response.data as Vehicle[];
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async createVehicle(vehicle: Vehicle): Promise<any> {
      try {
        this.setHeaders();

        const data = {
            name: vehicle.name,
        }

        const response = await axiosInstance.post("/vehicles", data);
    
        // Check for success
        if (response.status === 200) {
          this.vehicles = response.data as Vehicle[];
          
          return response.data as Vehicle[];
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async updateVehicle(vehicle: Vehicle): Promise<any> {
      try {
        this.setHeaders();

        const data = {
            id: vehicle.id,
            name: vehicle.name,
        }

        const response = await axiosInstance.post("/vehicles/updateVehicle", data);
    
        // Check for success
        if (response.status === 200) {
          this.vehicles = response.data as Vehicle[];
          
          return response.data as Vehicle[];
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async selectVehicle(vehicle: Vehicle): Promise<any> {
      try {
        this.setHeaders();

        this.selectedVehicle = vehicle;

        const data = {
          id: vehicle.id,
        }

        const response = await axiosInstance.post("/vehicles/selectVehicle", data);

        this.vehicles = [];

        this.vehicles = response.data as Vehicle[];

        return response.data as Vehicle[];
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async deleteVehicle(vehicle: Vehicle): Promise<any> {
      try {
        this.setHeaders();

        const data = {
            id: vehicle.id,
        }

        const response = await axiosInstance.post("/vehicles/deleteVehicle", data);
    
        // Check for success
        if (response.status === 200) {
          this.vehicles = response.data as Vehicle[];

          return response.data as Vehicle[];
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
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