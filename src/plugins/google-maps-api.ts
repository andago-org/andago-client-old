// src/plugins/google-maps-places.ts
import { App } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMapsPlacesPlugin = {
  install: (app: App, options: { apiKey: string }) => {
    const loader = new Loader({
      apiKey: options.apiKey,
      libraries: ['places'],
    });

    loader.load().then(() => {
      const map = new google.maps.Map(document.createElement('div'));
      const service = new google.maps.places.PlacesService(map);
      app.config.globalProperties.$googleMapsPlacesService = service;
    });
  },
};

export default GoogleMapsPlacesPlugin;
