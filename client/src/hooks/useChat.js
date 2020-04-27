import { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import { v4 as uuid } from 'uuid';

const useChat = () => {
  const [serverMessages, setServerMessages] = useState([]);
  const [numUsers, setNumUsers] = useState(0);
  const [typing, setTyping] = useState(null);
  const [currentUser, setCurrentUser] = useState();

  const socketRef = useRef();

  let typingTimeout;
  const TYPING_TIMER_LENGTH = 2000;

  useEffect(() => {
    const endpoint =
      process.env.NODE_ENV === 'development' ? 'http://localhost:4000/' : '/';

    socketRef.current = socketIOClient(endpoint);

    socketRef.current.on('server message', data => {
      console.log('Msg from server: ', data);
      setServerMessages(messages => [...messages, data]);
    });

    socketRef.current.on('users update', data => {
      setNumUsers(data.numUsers);
    });

    socketRef.current.on('notify typing', ({ username }) => {
      console.log(username);
      setTyping({ username });
    });

    socketRef.current.on('notify stop typing', () => {
      console.log('Received stop typing');
      setTyping(null);
    });
  }, []);

  const sendToServer = message => {
    const id = uuid();
    setServerMessages(messages => [...messages, { id, message }]);
    socketRef.current.emit('client message', { id, message });
    socketRef.current.emit('stop typing');
  };

  const handleSetUsername = username => {
    const id = uuid();
    username && setCurrentUser({ id, username });
    username && socketRef.current.emit('user joined', { id, username });
  };

  const handleUserTyped = () => {
    socketRef.current.emit('someone typed');
    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socketRef.current.emit('stop typing');
    }, TYPING_TIMER_LENGTH);
  };

  return {
    numUsers,
    currentUser,
    serverMessages,
    typing,
    sendToServer,
    handleSetUsername,
    handleUserTyped,
  };
};

export default useChat;
