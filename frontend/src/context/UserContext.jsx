/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { userDataContext } from './userDataContext';

const UserContext = ({ children }) => {
  const [user, setuser] = useState({
    email: '',
    fullName: {
      firstName: '',
      lastName: '',
    },
  });

  return (
    <userDataContext.Provider value={[user, setuser]}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
