import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  useEffect(() => {
    const socket = io('http://localhost:4000');

    socket.on('message', (data) => {
      console.log('Message from server:', data);
    });

    socket.emit('message', { content: 'Hello, server!' });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>WebSocket React App</div>;
};

export default App;
