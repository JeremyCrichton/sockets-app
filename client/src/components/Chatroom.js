import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';

import ChatForm from './ChatForm';

const Chatroom = () => {
  const [serverMessages, setServerMessages] = useState([]);
  const socketRef = useRef();

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

  return (
    <div>
      <h2>Chatroom</h2>
      <ul>
        {serverMessages && serverMessages.map(message => <li>{message}</li>)}
      </ul>
      <ChatForm sendMessage={sendToServer} />
    </div>
  );
};

export default Chatroom;
