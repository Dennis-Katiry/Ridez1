import React, { useRef, useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import FinishRide from '../components/FinishRide';
import LiveTracking from '../components/LiveTracking';
import { SocketContext } from '../context/SocketContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Fetching location...');
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const rideData = location.state?.ride;

  useGSAP(() => {
    if (finishRidePanel) {
      gsap.fromTo(
        finishRidePanelRef.current,
        { y: '100%' },
        { y: 0, duration: 0.3, ease: 'power3.out' }
      );
    } else {
      gsap.to(finishRidePanelRef.current, { y: '100%', duration: 0.3, ease: 'power3.in' });
    }
  }, [finishRidePanel]);

  useEffect(() => {
    if (!socket) {
      console.error('Socket not initialized');
      toast.error('Connection issue. Please try again.');
      navigate('/captain-home');
      return;
    }

    if (!rideData || !rideData._id) {
      console.error('No rideData available, navigating to /captain-home');
      navigate('/captain-home');
      return;
    }

    console.log('CaptainRiding rideData._id:', rideData._id);
    socket.emit('join', { userId: rideData.captain?._id, role: 'captain' });
    console.log('Captain joined with socketId:', socket.id);

    // Verify socket connection
    console.log('Socket connected:', socket.connected);
    if (!socket.connected) {
      console.error('Socket not connected, attempting reconnect');
      socket.connect();
    }

    // Event listeners
    socket.onAny((event, ...args) => {
      console.log('Socket event received:', event, args);
    });

    const handlePaymentCompleted = (data) => {
      console.log('Received payment-completed:', data, 'Expected rideId:', rideData._id);
      if (data.rideId === rideData._id) {
        console.log('Payment completed matched ride ID:', data);
        toast.success(data.message, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        console.error('Ride ID mismatch in payment-completed:', data.rideId, 'vs', rideData._id);
      }
    };

    const handleRideCancelled = (data) => {
      console.log('Received ride-cancelled event:', data, 'Current socketId:', socket.id);
      if (data.rideId === rideData._id) {
        toast.error('Ride cancelled by rider', {
          position: 'top-right',
          autoClose: 3000,
        });
        setTimeout(() => navigate('/captain-home', { replace: true }), 1500);
      }
    };

    const handleRideEnded = (data) => {
      if (data.rideId === rideData._id) {
        console.log('Ride ended:', data);
        navigate(`/captain-home`);
      }
    };

    socket.on('payment-completed', handlePaymentCompleted);
    socket.on('ride-cancelled', handleRideCancelled);
    socket.on('ride-ended', handleRideEnded);

    socket.on('connect', () => {
      console.log('Socket reconnected:', socket.id);
      socket.emit('join', { userId: rideData.captain?._id, role: 'captain' });
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    // Geolocation setup
    let watchId;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCaptainLocation(location);
          setLocationStatus('Tracking active');
          socket.emit('captain-location-update', { rideId: rideData._id, captainLocation: location });
          console.log('Initial captain location:', location);
        },
        (error) => {
          console.error('Initial geolocation error:', error);
          setLocationStatus('Location unavailable');
          toast.warn(`Initial location fetch failed: ${error.message}. Retrying...`, {
            position: 'top-right',
            autoClose: 3000,
          });
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
      );

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCaptainLocation(location);
          setLocationStatus('Tracking active');
          socket.emit('captain-location-update', { rideId: rideData._id, captainLocation: location });
          console.log('Captain location updated:', location);
        },
        (error) => {
          console.error('Geolocation watch error:', error);
          setLocationStatus('Location unavailable');
          toast.error(`Tracking failed: ${error.message}`, {
            position: 'top-right',
            autoClose: 3000,
          });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      );
    } else {
      console.error('Geolocation not supported');
      setLocationStatus('Geolocation not supported');
      toast.error('Geolocation is not supported on this device.');
    }

    // Unified cleanup
    return () => {
      console.log('Cleaning up listeners for CaptainRiding.jsx');
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
      socket.off('payment-completed', handlePaymentCompleted);
      socket.off('ride-cancelled', handleRideCancelled);
      socket.off('ride-ended', handleRideEnded);
      socket.offAny();
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket, rideData, navigate]);

  const handleCompleteRide = () => {
    setFinishRidePanel(true);
  };

  if (!rideData || !rideData._id) {
    return null;
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gray-100">
      <div className="absolute inset-0 z-0">
        <LiveTracking
          currentPosition={captainLocation}
          ride={rideData}
          pickupCoordinates={rideData.pickupCoordinates}
          destinationCoordinates={rideData.destinationCoordinates}
        />
      </div>

      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3">
        <img
          className="w-16 sm:w-20 filter invert"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Ridez Logo"
        />
        <Link
          to="/captain-home"
          className="flex items-center justify-center w-10 h-10 transition duration-200 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <i className="text-xl text-gray-600 ri-logout-box-r-line"></i>
        </Link>
      </header>

      {!finishRidePanel && (
        <div className="fixed bottom-0 left-0 right-0 z-10 mx-auto w-11/12 max-w-md p-4 bg-white border-t border-gray-200 min-h-[100px] max-h-[150px] overflow-hidden rounded-t-3xl shadow-2xl">
          <div className="flex justify-center">
            <button
              onClick={() => setFinishRidePanel(false)}
              className="w-10 h-1 transition duration-200 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400"
            ></button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <h4 className="text-sm font-semibold text-gray-800">
              {locationStatus}
            </h4>
            <button
              onClick={handleCompleteRide}
              className="px-3 py-2 text-sm font-semibold text-white transition duration-200 bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!captainLocation}
            >
              Complete Ride
            </button>
          </div>
        </div>
      )}

      <div
        ref={finishRidePanelRef}
        className="fixed bottom-0 left-0 right-0 z-30 mx-auto w-11/12 max-w-md rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto translate-y-full"
      >
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;