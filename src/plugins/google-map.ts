import { Loader } from '@googlemaps/js-api-loader';

let googleMaps: typeof google.maps;

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


export default {
  load: loadGoogleMaps,
  calculateRoute: calculateRoute,
  drawDriverProgress: drawDriverProgress
};
