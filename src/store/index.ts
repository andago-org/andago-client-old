import { defineStore } from 'pinia'
import axios from 'axios';
import router from '@/router';
import { User } from '@/interfaces/models';
import { Geolocation } from '@capacitor/geolocation';
import { TripDetails, Coordinate, Place, Vehicle } from '@/interfaces/types';
import { Preferences } from '@capacitor/preferences';
import { loadStripe } from '@stripe/stripe-js';
import { CometChat } from "@cometchat-pro/chat";
import { version } from 'vue';
import { Browser } from '@capacitor/browser';

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const useMainStore = defineStore({
  id: 'mainStore',
  state: () => ({
    phoneNumber: "" as string,
    token: "" as string,
    user: null as User | null,
    selectedVehicle: null as Vehicle | null,
    creditWallet: 0 as number,
    driverMode: false as boolean,
    coordinate: { lat: 0, lng: 0 } as Coordinate,
    fakeGeolocation: false as boolean,
    pickUpPlace: { place_id: '', name: '', address: '', coordinate: { lat: 0, lng: 0 } as Coordinate } as Place,
    dropOffPlace: { place_id: '', name: '', address: '', coordinate: { lat: 0, lng: 0 } as Coordinate } as Place,
    walletBalance: 0 as number,
    distance: 0 as number,
    duration: '0 min' as string,
    fare: 0 as number,
    // tripDetails: null as TripDetails | null,
  }),
  getters: {
    getPhoneNumber(): string {
      return this.phoneNumber
    },
  },
  actions: {
    async tryLogin(phoneNumber: string): Promise<void> {
    
      try {
        const phoneNumberTemp = "+6" + phoneNumber;
        this.setHeaders();

        const data = {
          phoneNumber: phoneNumberTemp,
          driverMode: this.driverMode,
        }

        const response = await axiosInstance.post("/auth/tryLogin", data);
        
        // Check for success
        if (response.status === 200) {
          this.phoneNumber = phoneNumberTemp;

          router.push({
            path: '/code-verify',
          });
        }

        return response.data;

      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async login(code: string): Promise<void> {
      try {
        this.setHeaders();
        const response = await axiosInstance.post("/auth/login",
          { phoneNumber: this.phoneNumber, code: code }
        );
    
        // Check for success
        if (response.status === 200) {
          console.log(response.data);

          this.token = response.data.token;
          this.user = response.data.user;

          this.setUserToken(this.token);

          this.setHeaders();

          if (this.driverMode) {
            router.push({
              path: '/driver',
            });
          }
          else
          {
            router.push({
              path: '/',
            });
          }
        }

        return response.data;

      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async logout(): Promise<void> {
      try {
        this.removeUser()
        Preferences.remove({ key: 'data' })
        this.driverMode = false;

        this.setHeaders();
        const response = await axiosInstance.post("/auth/logout");
        
        router.push({
          path: '/sign-in',
        });

        return response.data;

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
          lng: position.lng
        }
    
        const response = await axiosInstance.post("/maps/getPlaces", data);
    
        // Check for success
        if (response.status === 200) {
          return response.data.results;
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async getTripDetails(pickUp: Place, dropOff: Place): Promise<any> {
      try {
        this.setHeaders();
        
        const data = {
          pickUp: pickUp,
          dropOff: dropOff,
        }

        const response = await axiosInstance.post("/maps/getTripDetails", data);
    
        // Check for success
        if (response.status === 200) {
          return response.data as TripDetails;
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }  

    },

    setHeaders()
    {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
    },

    async getUser(): Promise<any> {
      try {
        this.setHeaders();
        axiosInstance.post("/auth/getUser").then((response) => { 
          // Check for success
          if (response.status === 200) {
            this.user = response.data;
            
            this.initializeCometChat();
            this.loginCometChatUser();

            router.push({ path: '/' });
          }

          return response.data;
        });
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    removeUser() {
      this.user = null;
      this.clearUserToken();
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
          this.user = await this.getUser();
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

    async createPayment(): Promise<any> {
      try {
        this.setHeaders();
        // const response = await axiosInstance.post("/payment/createCheckoutSession");


        await Browser.open({ url: 'http://capacitorjs.com/' });
        
        // Check for success
        // if (response.status === 200) {
        //   const sessionId = response.data.sessionId;
          
        //   const stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY); // Your Stripe publishable key
          
        //   if (stripe != null)
        //   {
        //     const { error } = await stripe.redirectToCheckout({
        //         sessionId,
        //     });

        //     if (error) {
        //         console.error(error);
        //         // Handle any errors
        //     }
        //   }
        // }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    initializeCometChat()
    {
      const appID = process.env.VUE_APP_COMETCHAT_APP_ID;
      const region = process.env.VUE_APP_COMETCHAT_REGION;
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

    loginCometChatUser()
    {
      const user = this.user || {} as User;

      const authKey = process.env.VUE_APP_COMETCHAT_AUTH_KEY;
      const uid = user.id.toString();
      const name = user.name || "User";

      let cometUser: CometChat.User;

      CometChat.login(uid, authKey).then(
        user => {
          console.log("Login Successful:", { user });

          cometUser = user;
        },
        error => {
          console.log("Login failed with exception:", { error });    

          cometUser = new CometChat.User(uid);

          cometUser.setName(name);

          CometChat.createUser(cometUser, authKey).then(
            (user: CometChat.User) => {
              console.log("user created", user);

              CometChat.login(uid, authKey).then(
                user => {
                  console.log("Login Successful:", { user });
        
                  cometUser = user;
                }
              )
            }, (error: CometChat.CometChatException) => {
              console.log("error", error);
            }
          );
        }
      );
    },

    async createTrip(tripDetails: TripDetails): Promise<any> {
      try {
        this.setHeaders();

        const data = {
          tripDetails: tripDetails,
        }

        const response = await axiosInstance.post("/trips/createTrip", data);
    
        // Check for success
        if (response.status === 200) {
          console.log("Trip created", response.data);
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

          return response.data as Vehicle[];
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

        const data = {
            id: vehicle.id,
        }

        const response = await axiosInstance.post("/vehicles/selectVehicle", data);

        this.selectedVehicle = response.data as any;
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },
  },
  persist: {
    enabled: true,
  },
})