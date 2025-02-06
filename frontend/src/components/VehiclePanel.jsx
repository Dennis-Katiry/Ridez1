import React from 'react'
import PropTypes from 'prop-types';

const VehiclePanel = ({ setvehiclePanel, setConfirmRidePanel }) => {
    return (
        <div>
            <h5
                className="absolute top-0 left-1/2 transform -translate-x-1/2 p-3 text-center cursor-pointer text-gray-400"
                onClick={() => setvehiclePanel(false)}
            >
                <i className="ri-arrow-down-wide-line text-xl"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-3 mt-5'>Choose a Vehicle</h3>

            <div onClick={() => setConfirmRidePanel(true)}
                className="flex items-center border-2 rounded-xl active:border-black p-3 mb-2">
                <div className="flex-shrink-0">
                    <img
                        className="w-16"
                        src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_552,w_552/v1555367538/assets/31/ad21b7-595c-42e8-ac53-53966b4a5fee/original/Final_Black.png"
                        alt=""
                    />
                </div>

                <div className="ml-4 flex-1">
                    <h4 className="text-lg font-semibold flex items-center">
                        UberGo
                        <span className="ml-2 flex items-center text-sm text-gray-600">
                            <i className="ri-user-3-fill"></i>
                            <span className="ml-1">4</span>
                        </span>
                    </h4>
                    <h5 className="text-sm text-black-500">2 mins away</h5>
                    <p className="text-sm text-gray-600">Affordable compact rides</p>
                </div>
                <h2 className="text-lg font-semibold">₹193.20</h2>
            </div>

            <div onClick={() => setConfirmRidePanel(true)}
                className="flex items-center border-2 rounded-xl active:border-black p-3 mb-2">
                <div className="flex-shrink-0">
                    <img
                        className="w-16"
                        src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
                        alt=""
                    />
                </div>
                <div className="ml-4 flex-1">
                    <h4 className="text-lg font-semibold flex items-center">
                        Moto
                        <span className="ml-2 flex items-center text-sm text-gray-600">
                            <i className="ri-user-3-fill"></i>
                            <span className="ml-1">1</span>
                        </span>
                    </h4>
                    <h5 className="text-sm text-gray-500">3 mins away</h5>
                    <p className="text-sm text-gray-600">Affordable motorcycle rides</p>
                </div>
                <h2 className="text-lg font-semibold">₹65.17</h2>
            </div>

            <div onClick={() => setConfirmRidePanel(true)}
                className="flex items-center border-2 rounded-xl active:border-black p-3">
                <div className="flex-shrink-0">
                    <img
                        className="w-16"
                        src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
                        alt=""
                    />
                </div>
                <div className="ml-4 flex-1">
                    <h4 className="text-lg font-semibold flex items-center">
                        UberAuto
                        <span className="ml-2 flex items-center text-sm text-gray-600">
                            <i className="ri-user-3-fill"></i>
                            <span className="ml-1">2</span>
                        </span>
                    </h4>
                    <h5 className="text-sm text-gray-500">3 mins away</h5>
                    <p className="text-sm text-gray-600">Affordable Auto rides</p>
                </div>
                <h2 className="text-lg font-semibold">₹118.62</h2>
            </div>
        </div>
    )
}

VehiclePanel.propTypes = {
    setvehiclePanel: PropTypes.func.isRequired,
    setConfirmRidePanel: PropTypes.func.isRequired
};

export default VehiclePanel;
