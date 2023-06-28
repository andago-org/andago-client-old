interface AndroidBridge {
  showToast: (message: string) => void;
  getDataFromAndroid: () => string;
}

declare global {
  interface Window {
      AndroidBridge: AndroidBridge;
  }
}

const AndroidBridge: AndroidBridge = {
  showToast: (message: string) => {
      // Call the showToast method on the Android side
      window.AndroidBridge.showToast(message);
  },
  getDataFromAndroid: () => {
      // Call the getDataFromAndroid method on the Android side
      return window.AndroidBridge.getDataFromAndroid();
  }
};

export default AndroidBridge;
