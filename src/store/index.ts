import { defineStore } from 'pinia'
import axios from 'axios';
import router from '@/router';
import { User } from '@/interfaces/models';
import { Geolocation } from '@capacitor/geolocation';
import { TripDetails } from '@/interfaces/types';
import { Preferences } from '@capacitor/preferences';

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
    creditWallet: 0 as number,
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
        const response = await axiosInstance.post("/auth/tryLogin", { phoneNumber: phoneNumberTemp });
        console.log(response.status);
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

          router.push({
            path: '/',
          });
        }

        return response.data;

      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async logout(): Promise<void> {
      try {
        this.setHeaders();
        const response = await axiosInstance.post("/auth/logout");
    
        // Check for success
        if (response.status === 200) {
          this.removeUser()

          router.push({
            path: '/sign-in',
          });
        }

        return response.data;

      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async getPlaces(query: string): Promise<any> {
      try {
        this.setHeaders();
        const position = await Geolocation.getCurrentPosition();
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
    
        const data = {
          query: query,
          lat: lat,
          lng: lng
        }
    
        const response = await axiosInstance.post("/maps/getPlaces", data);
    
        // Check for success
        if (response.status === 200) {
          // console.log(response.data.results)
          return response.data.results;
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    async getTripDetails(): Promise<any> {
      try {
        this.setHeaders();
        const response = await axiosInstance.get("/maps/getTripDetails");
    
        // Check for success
        if (response.status === 200) {
          console.log(response.data)
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

    async getUser(): Promise<void> {
      try {
        this.setHeaders();
        const response = await axiosInstance.post("/auth/getUser");
    
        // Check for success
        if (response.status === 200) {
          console.log(response.data);

          this.user = response.data.user;
        }

        return response.data;

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
      console.log('loadFromStorage')

      const { value } = await Preferences.get({ key: 'token' })
      if (value) {
        this.token = value
      }
    },

    async saveToStorage() {
      await Preferences.set({ key: 'token', value: this.token })
    },

    setUserToken(token: string) {
      this.token = token
      console.log('setUserToken:' + token)
      this.saveToStorage()
    },

    clearUserToken() {
      this.token = ""
      this.saveToStorage()
    },

    async testSet()
    {
      await Preferences.set({ key: 'a', value: "aa" })
    },

    async testGet()
    {
      const { value } = await Preferences.get({ key: 'a' })
      console.log(value)
    }
  },
  persist: {
    enabled: true,
  },
})