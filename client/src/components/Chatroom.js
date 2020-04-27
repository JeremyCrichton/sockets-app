import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';

import ChatForm from './ChatForm';
import Entrance from './Entrance';

const Chatroom = () => {
  const [serverMessages, setServerMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const socketRef = useRef();
  let theTimeout;
  const TYPING_TIMER_LENGTH = 2000;

  // Set up sockets on mount
  useEffect(() => {
    const endpoint =
      process.env.NODE_ENV === 'development' ? 'http://localhost:4000/' : '/';

    socketRef.current = socketIOClient(endpoint);

    socketRef.current.on('server message', data => {
      console.log('Msg from server: ', data);
      setServerMessages(messages => [...messages, data]);
    });

    socketRef.current.on('notify typing', () => {
      setTyping(true);
    });

    socketRef.current.on('notify stop typing', () => {
      console.log('Received stop typing');
      setTyping(false);
    });
  }, []);

  const sendToServer = message => {
    setServerMessages(messages => [...messages, message]);
    socketRef.current.emit('client message', message);
  };

  const handleSetUsername = username => {
    username && socketRef.current.emit('user joined', { username });
  };

  const handleUserTyped = () => {
    socketRef.current.emit('someone typed');
    clearTimeout(theTimeout);

    theTimeout = setTimeout(() => {
      socketRef.current.emit('stop typing');
    }, TYPING_TIMER_LENGTH);
  };

  return (
    <div>
      <h2>Enter Your Name</h2>
      <Entrance setUsername={handleSetUsername} />
      <h2>Chatroom</h2>
      <ul>
        {serverMessages && serverMessages.map(message => <li>{message}</li>)}
      </ul>
      <div>{typing && 'Someone is typing...'}</div>
      <ChatForm sendMessage={sendToServer} userTyped={handleUserTyped} />
    </div>
  );
};

export default Chatroom;
