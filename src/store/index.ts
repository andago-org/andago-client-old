import { defineStore } from 'pinia'
import axios from 'axios';
import router from '@/router';
import { User } from '@/interfaces/models';
import { Geolocation } from '@capacitor/geolocation';
import { TripDetails, Coordinate, Place, Vehicle, ControlMode } from '@/interfaces/types';
import { Preferences } from '@capacitor/preferences';
import { loadStripe } from '@stripe/stripe-js';
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
    vehicles: [] as Vehicle[],
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
    myTrip: {} as any,
    paymentDetails: {
      min_fare: {
        text: "",
        value: 0,
      },
      distance_addon: {
        text: "",
        value: 0,
      },
      duration_addon: {
        text: "",
        value: 0,
      },
      total_fare: {
        text: "",
        value: 0,
      },
    } as any,

    receivedTripJob: {} as any,
    jobDetails: {
      distanceToPickUp: "",
      durationToPickUp: "",
    } as any,
    acceptedDriver: {} as any,
    acceptedTrip: {} as any,
  }),
  getters: {
    getPhoneNumber(): string {
      return this.phoneNumber
    },
  },
  actions: {

    async getGeolocation(): Promise<any> {
      const position = await Geolocation.getCurrentPosition();

      const finalPosition = { lat: position.coords.latitude, lng: position.coords.longitude }

      return finalPosition as any;
    },
    async getPickUpPosition(): Promise<any> {
      const position = {
        lat: this.receivedTripJob.pickup_place.latitude,
        lng: this.receivedTripJob.pickup_place.longitude,
      };

      return position;
    },

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

    // async getTripDetails(pickUp: Place, dropOff: Place): Promise<any> {
    //   try {
    //     this.setHeaders();
        
    //     const data = {
    //       pickUp: pickUp,
    //       dropOff: dropOff,
    //     }

    //     const response = await axiosInstance.post("/maps/getTripDetails", data);
    
    //     // Check for success
    //     if (response.status === 200) {
    //       return response.data as TripDetails;
    //     }
    //   } catch (error) {
    //     console.error('Error performing the request:', error);
    //     // Handle the error (e.g., show an error message or retry the request)
    //   }  

    // },

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

    async createTripPayment(): Promise<any> {
      try {
        this.setHeaders();

        console.log(this.pickUpPlace);

        const data = {
          pickUp: this.pickUpPlace,
          dropOff: this.dropOffPlace,
        }

        const response = await axiosInstance.post("/trips/createTripPayment", data);

        console.log(response.data);

        // Check for success
        if (response.status === 200) {

          this.paymentDetails = response.data.paymentDetails;
        }
      } catch (error) {
        console.error('Error performing the request:', error);
        // Handle the error (e.g., show an error message or retry the request)
      }
    },

    // async createTrip(tripDetails: TripDetails): Promise<any> {
    //   try {
    //     this.setHeaders();

    //     const data = {
    //       tripDetails: tripDetails,
    //     }

    //     const response = await axiosInstance.post("/trips/createTrip", data);
    
    //     // Check for success
    //     if (response.status === 200) {
    //       console.log("Trip created", response.data);
    //       return response.data;
    //     }
    //   } catch (error) {
    //     console.error('Error performing the request:', error);
    //     // Handle the error (e.g., show an error message or retry the request)
    //   }
    // },

    async confirmTrip(): Promise<any> {
      try {
        this.setHeaders();

        // const data = {
        //   tripDetails: tripDetails,
        // }

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
  },
  persist: {
    enabled: true,
  },
})