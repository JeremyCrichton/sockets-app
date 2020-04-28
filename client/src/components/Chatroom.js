import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import styled from 'styled-components';

import ChatForm from './ChatForm';
import Entrance from './Entrance';
import Header from './Header';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: #212121;
  color: white;
`;

const Section = styled.section`
  padding: 4rem;
`;

const Chatroom = () => {
  const [serverMessages, setServerMessages] = useState([]);
  const [numUsers, setNumUsers] = useState(0);
  const [typing, setTyping] = useState(null);
  const [currentUser, setCurrentUser] = useState();

  const socketRef = useRef();

  const TYPING_TIMER_LENGTH = 2000;
  let typingTimeout;

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

  const handleJoinRoom = (username, room) => {
    const id = uuid();
    username && setCurrentUser({ id, username });
    username && socketRef.current.emit('user joined', { id, username, room });
  };

  const handleUserTyped = () => {
    socketRef.current.emit('someone typed');
    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socketRef.current.emit('stop typing');
    }, TYPING_TIMER_LENGTH);
  };

  return (
    <Container>
      <Header
        numUsers={numUsers}
        username={currentUser && currentUser.username}
      />
      <Section>
        {currentUser && <h4>Signed in as {currentUser.username}</h4>}
        {!currentUser && (
          <div>
            <Entrance submitUserDetails={handleJoinRoom} />
          </div>
        )}
        {currentUser && (
          <div>
            <h2>Chatroom</h2>
            <ul>
              {serverMessages &&
                serverMessages.map(({ id, message }) => (
                  <li key={id}>{message}</li>
                ))}
            </ul>
            <div>{typing && `${typing.username} is typing`}</div>
            <ChatForm sendMessage={sendToServer} userTyped={handleUserTyped} />
          </div>
        )}
      </Section>
    </Container>
  );
};

export default Chatroom;
