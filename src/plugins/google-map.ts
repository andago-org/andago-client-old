import { Loader } from '@googlemaps/js-api-loader';

let googleMaps: typeof google.maps;

const loadGoogleMaps = () => {
  const loader = new Loader({
    apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
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
  const directionsService = new google.maps.DirectionsService();
  const directionsRequest = {
    origin: { lat: startCoords.lat, lng: startCoords.lng },
    destination: { lat: endCoords.lat, lng: endCoords.lng },
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(directionsRequest, (response: any, status: any) => {
    if (status === 'OK') {
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(googleMap);
      directionsRenderer.setDirections(response);
      const bounds = response.routes[0].bounds;
      googleMap.fitBounds(bounds);
    } else {
      console.log('Directions request failed due to ' + status);
    }
  });
};

const drawDriverProgress = (driverCoords: any, passengerCoords: any, googleMap: any) => {
  const driverIcon = {
    url: require('@/img/map_markers/car.png'),
    scaledSize: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(25, 25)
  };

  const passengerIcon = {
    url: require('@/img/map_markers/passenger.png'),
    scaledSize: new google.maps.Size(50, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(25, 25)
  };

  const driverMarker = new google.maps.Marker({
    position: driverCoords,
    map: googleMap,
    icon: driverIcon
  });

  const passengerMarker = new google.maps.Marker({
    position: passengerCoords,
    map: googleMap,
    icon: passengerIcon
  });

  const driverPosition = driverMarker.getPosition();
const passengerPosition = passengerMarker.getPosition();

if (driverPosition && passengerPosition) {
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(driverPosition);
  bounds.extend(passengerPosition);
  googleMap.fitBounds(bounds);
}
};

import { Geolocation } from '@capacitor/geolocation';
import { WifiProtectedSetupSharp } from '@vicons/material';

const startNavigator = async (startCoords: any, endCoords: any, googleMap: google.maps.Map) => {
  const directionsService = new google.maps.DirectionsService();
  const directionsRequest = {
    origin: { lat: startCoords.lat, lng: startCoords.lng },
    destination: { lat: endCoords.lat, lng: endCoords.lng },
    travelMode: google.maps.TravelMode.DRIVING
  };

  let currentLocationMarker: google.maps.Marker | null = null;
  let currentBearing = 0;

  const position = await Geolocation.getCurrentPosition();
  const currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  // Update the current location marker and pan the map to the new location
  if (!currentLocationMarker) {
    currentLocationMarker = new google.maps.Marker({
      map: googleMap,
      icon: {
        url: '',
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 25)
      }
    });
  }
  currentLocationMarker.setPosition(currentLocation);
  googleMap.panTo(currentLocation);

  // Calculate the new route and redraw it on the map
  directionsService.route(directionsRequest, (response: any, status: any) => {
    if (status === 'OK') {
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(googleMap);
      directionsRenderer.setDirections(response);
      const route = response.routes[0];

      // Calculate the bearing between the user's current location and the next step of the route
      const nextStep = route.legs[0].steps[0];
      const nextStepStart = new google.maps.LatLng(nextStep.start_location.lat(), nextStep.start_location.lng());
      const bearing = google.maps.geometry.spherical.computeHeading(currentLocation, nextStepStart);

      // Smoothly rotate the map towards the new bearing
      if (Math.abs(bearing - currentBearing) > 1) {
        const easingFactor = 0.1;
        currentBearing = currentBearing + easingFactor * (bearing - currentBearing);
        googleMap.setHeading(currentBearing);
      } else {
        googleMap.setHeading(bearing);
      }
    } else {
      console.log('Directions request failed due to ' + status);
    }
  });
};

export default {
  load: loadGoogleMaps,
  calculateRoute: calculateRoute,
  drawDriverProgress: drawDriverProgress,
  startNavigator: startNavigator
};

declare global {
  interface Window {
    google: typeof google;
  }
}
