import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523,
};

const LiveTracking = ({ currentPosition, ride, captainLocation, pickupCoordinates, destinationCoordinates }) => {
  const [directions, setDirections] = useState(null);
  const [distanceETA, setDistanceETA] = useState({ distance: '', duration: '' });
  const [derivedPickupCoordinates, setDerivedPickupCoordinates] = useState(null);

  useEffect(() => {
    if (!ride || !ride.status) {
      console.log('LiveTracking: Missing ride or status', { ride });
      return;
    }

    const geocodePickup = async (address) => {
      if (!window.google || !window.google.maps) {
        console.log('LiveTracking: Google Maps API not loaded yet');
        return;
      }
      const geocoder = new window.google.maps.Geocoder();
      try {
        const response = await new Promise((resolve, reject) => {
          geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK') {
              resolve(results);
            } else {
              reject(status);
            }
          });
        });
        const location = response[0].geometry.location;
        const coords = { lat: location.lat(), lng: location.lng() };
        console.log('LiveTracking: Geocoded pickup address', { address, coords });
        setDerivedPickupCoordinates(coords);
        return coords;
      } catch (error) {
        console.error('LiveTracking: Geocoding failed', error);
        return null;
      }
    };

    const fetchDistanceAndETA = async (origin, destination) => {
      if (!origin || !destination) {
        console.log('LiveTracking: Invalid origin/destination', { origin, destination });
        return;
      }
      try {
        const token = localStorage.getItem('captainToken'); // Fix: Use 'captainToken'
        console.log('Token for get-distance-eta:', token); // Debug
        if (!token) throw new Error('No captain token found');

        console.log('LiveTracking: Fetching distance/ETA', { origin, destination });
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-distance-eta`,
          {
            params: {
              originLat: origin.lat,
              originLng: origin.lng,
              destLat: destination.lat,
              destLng: destination.lng,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('LiveTracking: Distance/ETA received', response.data);
        setDistanceETA({
          distance: response.data.distance,
          duration: response.data.duration,
        });

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirections(result);
            } else {
              console.error('LiveTracking: Directions failed:', status);
            }
          }
        );
      } catch (error) {
        console.error('LiveTracking: Error fetching distance/ETA:', error.response?.data || error.message);
      }
    };

    const effectivePickupCoordinates = pickupCoordinates || derivedPickupCoordinates;

    console.log('LiveTracking: Props', {
      currentPosition,
      captainLocation,
      pickupCoordinates: effectivePickupCoordinates,
      rideStatus: ride.status,
    });

    if (ride.status === 'accepted' || ride.status === 'ongoing') {
      if (currentPosition && captainLocation) {
        console.log('LiveTracking: Calculating user to captain');
        fetchDistanceAndETA(currentPosition, captainLocation);
      } else if (currentPosition && !captainLocation) {
        if (effectivePickupCoordinates) {
          console.log('LiveTracking: Calculating captain to rider (using effective coordinates)');
          fetchDistanceAndETA(currentPosition, effectivePickupCoordinates);
        } else if (ride.pickup && !pickupCoordinates) {
          console.log('LiveTracking: Pickup coordinates missing, attempting to geocode', ride.pickup);
          geocodePickup(ride.pickup).then((coords) => {
            if (coords) {
              fetchDistanceAndETA(currentPosition, coords);
            }
          });
        } else {
          console.log('LiveTracking: No pickup coordinates available');
        }
      } else {
        console.log('LiveTracking: Conditions not met for distance calculation');
      }
    }
  }, [currentPosition, captainLocation, pickupCoordinates, ride, derivedPickupCoordinates]);

  const effectivePickupCoordinates = pickupCoordinates || derivedPickupCoordinates;
  const mapCenter = currentPosition || effectivePickupCoordinates || defaultCenter;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={15}
      >
        {currentPosition && <Marker position={currentPosition} />}
        {captainLocation && (
          <Marker
            position={captainLocation}
            icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
          />
        )}
        {effectivePickupCoordinates && !captainLocation && (
          <Marker
            position={effectivePickupCoordinates}
            icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      {(ride?.status === 'accepted' || ride?.status === 'ongoing') && distanceETA.distance && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        >
          <p>Distance: {distanceETA.distance}</p>
          <p>ETA: {distanceETA.duration}</p>
        </div>
      )}
    </div>
  );
};

LiveTracking.propTypes = {
  currentPosition: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  ride: PropTypes.shape({
    _id: PropTypes.string,
    status: PropTypes.string,
    pickup: PropTypes.string,
  }),
  captainLocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  pickupCoordinates: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  destinationCoordinates: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
};

export default LiveTracking;