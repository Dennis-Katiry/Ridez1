import React from 'react';
import PropTypes from 'prop-types';

const LocationSearchPanel = ({ setvehiclePanel, setPanelOpen }) => {
  // Sample array for locations
  const locations = [
    "31St, Aroura Cafe, Near Razhii Point, Kohima",
    "30St, Continental Cafe, Near Razhii Point, Kohima",
    "32St, ABC Restaurant, Near Razhii Point, Kohima",
    "33St, D Cafe, Near Mid Point, Kohima",
  ];

  return (
    <div>
      {locations.map((location, index) => (
        <div
          onClick={() => {
            setvehiclePanel(true);
            setPanelOpen(false);
          }}
          key={index}
          className="flex gap-4 border-2 p-3 border-gray-100 rounded-xl active:border-black items-center my-2 justify-start"
        >
          <h2 className="bg-[#eee] h-7 w-8 flex items-center justify-center rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h2 className="font-medium">{location}</h2>
        </div>
      ))}
    </div>
  );
};

LocationSearchPanel.propTypes = {
  setvehiclePanel: PropTypes.func.isRequired,
  setPanelOpen: PropTypes.func.isRequired,
};

export default LocationSearchPanel;
