import { defineStore } from 'pinia'
import axios from 'axios';
import router from '@/router';

export const useMainStore = defineStore({
  id: 'mainStore',
  state: () => ({
    phoneNumber: "",
  }),
  getters: {
    getPhoneNumber(): string {
      return this.phoneNumber
    },
  },
  actions: {
    async sendCode(phoneNumber: string): Promise<void> {
      this.phoneNumber = phoneNumber;

      try {
        const response = await axios.post(process.env.VUE_APP_API_URL + "/sms/sendCode", { phoneNumber: "+6" + phoneNumber });
    
        // Check for success
        if (response.status === 200) {
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
    async verifyCode(code: string): Promise<void> {
      try {
        const response = await axios.post(process.env.VUE_APP_API_URL + "/sms/verifyCode",
          { phoneNumber: "+6" + this.phoneNumber, code: code }
        );
    
        // Check for success
        if (response.status === 200) {
          console.log(response.data);

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
  },
})