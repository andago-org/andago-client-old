import { defineStore } from 'pinia'
import axios from 'axios';
import router from '@/router';
import { User } from '@/interfaces/models';
import { AppLauncher } from '@capacitor/app-launcher';
import { Geolocation } from '@capacitor/geolocation';
import { Browser } from '@capacitor/browser';
import { UserType, Gender, Coordinate, Place, Vehicle, ControlMode, } from '@/interfaces/types';
import { Preferences } from '@capacitor/preferences';
import Pusher, { Channel } from 'pusher-js';
import Echo from 'laravel-echo';
import { toastController, ToastOptions, loadingController, LoadingOptions, modalController, ModalOptions } from '@ionic/vue';
import { NavComponent } from '@ionic/core';
import { format, parseISO } from 'date-fns';
import AddressPage from '@/views/passenger/trip/AddressPage.vue';
import PreviewPage from '@/views/passenger/trip/PreviewPage.vue';
import { CometChat } from '@cometchat-pro/cordova-ionic-chat';

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
  authEndpoint: 'http://localhost/api/broadcasting/auth',
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
    profile: {} as any,
    currentTrip: null as any || null,
    selectedVehicle: null as any | null,
    vehicles: [] as Vehicle[],
    creditWallet: 0 as number,
    driverMode: false as boolean,
    coordinate: { lat: 0, lng: 0 } as Coordinate,
    fakeGeolocation: false as boolean,
    pickUpPlace: {} as Place | null,
    dropOffPlace: {} as Place | null,
    distance: 0 as number,
    duration: '0 min' as string,
    fare: 0 as number,
    myTrip: {} as any,
    acceptedDriver: {} as any,
    acceptedTrip: {} as any,
    channel: null as Channel | null,
    ionToast: {} as HTMLIonToastElement,
    ionLoading: {} as HTMLIonLoadingElement,
    syncedData: {} as any,
    suggestedTopUpAmount: 0 as number,
  }),
  getters: {
    async currentPosition() {
      const currentPosition = await Geolocation.getCurrentPosition();

      const position = { lat: currentPosition.coords.latitude, lng: currentPosition.coords.longitude }

      return position;
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
    browser() {
      return Browser;
    },
    loggedIn() : boolean {
      return this.token !== "";
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
    initCometChat() {
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
    },

    async getData() {
      this.axios.post('/auth/getData')
        .then(
          async (response) => {
            const data = response.data;
            
            this.profile = data.profile;
            this.currentTrip = data.currentTrip;
          }
        )
        .catch(
          async (error) => {
            console.log(error)
          }
        )
      ;
    },

    async updatePosition(position: Coordinate) {
      const data = {
        position: position,
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
      let message = "";

      this.axios.post("/auth/logout")
        .then(
          async (response) => {
            message = response.data.message;
          }
        )
        .catch(
          async (error) => {
            console.log(error)

            message = error.data.message;
          }
        );

        const toast = await this.showToast({
          message: message,
          duration: 1000,
          position: "middle",
        })

        toast.onDidDismiss().then(() => {
          this.profile = null
          this.token = ""
          this.localStorage.remove({ key: 'data' })

          this.showLoading({})

          router.go(0)
        })
    },

    setHeaders()
    {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },

    async openMap(coordinates: Coordinate): Promise<void> {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
      await AppLauncher.openUrl({ url });
    },

    async getGeolocation(): Promise<any> {
      const currentPosition = await Geolocation.getCurrentPosition();

      const position = { lat: currentPosition.coords.latitude, lng: currentPosition.coords.longitude }

      return position as any;
    },

    async getDistanceMatrix(start: any, end: any): Promise<any> {
      try {
        this.setHeaders();

        const data = {
          start: start,
          end: end,
        }
    
        const response = await axiosInstance.post("/maps/getDistanceMatrix", data);
    
        // Check for success
        if (response.status === 200) {

          return response.data;
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async getPlaces(query: string): Promise<any> {
      try {
        this.setHeaders();

        let position = { lat: this.coordinate?.lat, lng: this.coordinate?.lng } as Coordinate;
        
        if (!this.fakeGeolocation) {
          const currentPosition = await Geolocation.getCurrentPosition();

          position = { lat: currentPosition.coords.latitude, lng: currentPosition.coords.longitude } as Coordinate;
        }

        const data = {
          query: query,
          lat: position.lat,
          lng: position.lng,
        }
    
        const response = await axiosInstance.post("/users/maps/getPlaces", data);
    
        // Check for success
        if (response.status === 200) {
          return response.data.results;
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async loadFromStorage() {
      const { value } = await Preferences.get({ key: 'data' })
      const { value: driverMode } = await Preferences.get({ key: 'driverMode' })

      const data = JSON.parse(value || '{}');

      this.driverMode = driverMode === 'true' || false;

      if (data) {
        this.token = data.token;
        

        if (this.token != "")
        {
          // this.user = await this.getUser();
        }
      }
    },

    async saveToStorage() {
      const data = {
        token: this.token,
      }

      await Preferences.set({ key: 'driverMode', value: this.driverMode.toString() })

      await Preferences.set({ key: 'data', value: JSON.stringify(data) })
    },

    setUserToken(token: string) {
      this.token = token
      this.saveToStorage()
    },

    clearUserToken() {
      this.token = ""
      this.saveToStorage()
    },

    async confirmTrip(): Promise<any> {
      try {
        this.setHeaders();

        this.acceptedDriver = null;

        const response = await axiosInstance.post("/trips/confirmTrip");
    
        // Check for success
        if (response.status === 200) {
          console.log("Trip confirm", response.data);
          return response.data;
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async acceptTrip(trip_id: any): Promise<any> {
      try {
        this.setHeaders();

        const data = {
          trip_id: trip_id,
        }

        const response = await axiosInstance.post("/trips/acceptTrip", data);
    
        // Check for success
        if (response.status === 200) {
          console.log(response.data);
          return response.data;
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
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
      return text.length > 0;
    },

    isObjectEmpty(object: any): boolean {
      return Object.keys(object).length === 0;
    }
  },
  persist: {
    enabled: true,
  },
})