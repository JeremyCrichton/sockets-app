import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';

import ChatForm from './ChatForm';
import Entrance from './Entrance';

const Chatroom = () => {
  const [serverMessages, setServerMessages] = useState([]);
  const socketRef = useRef();

  // Set up sockets on mount
  useEffect(() => {
    socketRef.current = socketIOClient('/');

    socketRef.current.on('server message', data => {
      setServerMessages(messages => [...messages, data]);
    });
  }, []);

  const sendToServer = message => {
    socketRef.current.emit('client message', message);
    console.log(message);
  };

  const handleSetUsername = username => {
    socketRef.current.emit('user joined', { username });
  };

  return (
    <div>
      <h2>Enter Your Name</h2>
      <Entrance setUsername={handleSetUsername} />
      <h2>Chatroom</h2>
      <ul>
        {serverMessages && serverMessages.map(message => <li>{message}</li>)}
      </ul>
      <ChatForm sendMessage={sendToServer} />
    </div>
  );
};

export default Chatroom;
