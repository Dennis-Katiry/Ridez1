import React from 'react';
import PropTypes from 'prop-types';

const ConfirmRide = ({ setvehiclePanel, setVehicleFound, setConfirmRidePanel }) => {
  return (
    <div className="flex flex-col items-center p-4 space-y-2 max-w-md mx-auto">
      <h5
        className="absolute top-0 left-1/2 transform -translate-x-1/2 p-1 text-center cursor-pointer text-gray-400"
        onClick={() => setvehiclePanel(false)}
      >
        <i className="ri-arrow-down-wide-line text-xl"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-2">Confirm your Ride</h3>

      <div className="flex justify-center items-center w-full mb-3">
        <img
          className="w-24 h-auto"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png"
          alt="Uber Ride"
        />
      </div>

      <div className="w-full space-y-5">
        {/* Pickup location */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <i className="ri-map-pin-user-fill text-xl"></i>
          <div>
            <h3 className="font-semibold text-sm">562/11-A</h3>
            <p className="text-medium text-gray-600">Razhii Point, Kohima</p>
          </div>
        </div>

        {/* Destination location */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <i className="ri-map-pin-2-fill text-xl"></i>
          <div>
            <h3 className="font-semibold text-sm">562/11-A</h3>
            <p className="text-medium text-gray-600">Razhii Point, Kohima</p>
          </div>
        </div>

        {/* Payment info */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <i className="ri-money-rupee-circle-line text-xl"></i>
          <div>
            <h3 className="font-semibold text-sm">₹193.16</h3>
            <p className="text-medium text-gray-600">Cash</p>
          </div>
        </div>
      </div>

      <div className="w-full bg-black text-white font-semibold p-2 rounded-lg mt-5">
        <button 
          onClick={() => { 
            setVehicleFound(true); 
            setConfirmRidePanel(false); 
          }} 
          className="w-full py-2"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

ConfirmRide.propTypes = {
  setvehiclePanel: PropTypes.func.isRequired,
  setVehicleFound: PropTypes.func.isRequired,
  setConfirmRidePanel: PropTypes.func.isRequired,
};

export default ConfirmRide;
