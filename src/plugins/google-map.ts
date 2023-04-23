import { Loader } from '@googlemaps/js-api-loader';

let googleMaps: any = null;

const loadGoogleMaps = () => {
  const loader = new Loader({
    apiKey: "AIzaSyA-T6S3baY4-AZuTSc9Fryb9fCH8Ihi0Uc",
    version: 'weekly',
    libraries: ['places']
  });

  return loader.load().then((google) => {
    googleMaps = google.maps;
    return googleMaps;
  }).catch((err) => {
    console.error('Failed to load Google Maps API:', err);
  });
};

const calculateRoute = (startCoords: any, endCoords: any, googleMap: any) => {
  const directionsService = new googleMaps.DirectionsService();
  const directionsRequest = {
    origin: new googleMaps.LatLng(startCoords.lat, startCoords.lng),
    destination: new googleMaps.LatLng(endCoords.lat, endCoords.lng),
    travelMode: 'DRIVING'
  };
  directionsService.route(directionsRequest, (response: any, status: any) => {
    if (status === 'OK') {
      const directionsRenderer = new googleMaps.DirectionsRenderer();
      directionsRenderer.setMap(googleMap);
      directionsRenderer.setDirections(response);
      const bounds = response.routes[0].bounds;
      googleMap.fitBounds(bounds);
    } else {
      console.log('Directions request failed due to ' + status);
    }
  });
};

export default {
  load: loadGoogleMaps,
  calculateRoute: calculateRoute
};
