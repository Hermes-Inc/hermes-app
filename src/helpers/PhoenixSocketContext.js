import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Socket } from './Phoenix';

const PhoenixSocketContext = createContext({ socket: null });

const PhoenixSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const url = 'http://localhost:4000/socket';
    const mySocket = new Socket(url, {});
    mySocket.connect();
    setSocket(mySocket);
  }, []);

  if (!socket) { return null; }

  return (
    <PhoenixSocketContext.Provider value={{ socket }}>{children}</PhoenixSocketContext.Provider>
  );
};

PhoenixSocketProvider.propTypes = {
  children: PropTypes.node,
};

export { PhoenixSocketContext, PhoenixSocketProvider };
