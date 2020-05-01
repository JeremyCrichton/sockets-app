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
  display: flex;
  flex-direction: column;
`;

const ChatSection = styled.section`
  height: 70vh;
  position: relative;
  padding: 2rem 1rem 1rem 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  color: black;
`;

const ChatHistory = styled.div`
  height: 60vh;
  padding: 0 1rem;
  flex-grow: 1;
  background-color: white;
  overflow-y: scroll;
`;

const ChatList = styled.ul`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  /* overflow-y: scroll; */
`;

const ChatFormContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
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
      <ChatSection>
        {false && !currentUser && (
          <div>
            <Entrance submitUserDetails={handleJoinRoom} />
          </div>
        )}
        {true && (
          <>
            <ChatHistory>
              <ChatList>
                {serverMessages &&
                  serverMessages.map(({ id, message }) => (
                    <li key={id}>{message}</li>
                  ))}
              </ChatList>
              {typing && <div>{typing && `${typing.username} is typing`}</div>}
            </ChatHistory>
            <ChatFormContainer>
              <ChatForm
                sendMessage={sendToServer}
                userTyped={handleUserTyped}
              />
            </ChatFormContainer>
          </>
        )}
      </ChatSection>
    </Container>
  );
};

export default Chatroom;
