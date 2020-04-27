import React from 'react';
import useChat from '../hooks/useChat';

import ChatForm from './ChatForm';
import Entrance from './Entrance';

const Chatroom = () => {
  const {
    numUsers,
    currentUser,
    serverMessages,
    typing,
    sendToServer,
    handleSetUsername,
    handleUserTyped,
  } = useChat();

  return (
    <div>
      <h2>Number of users: {numUsers}</h2>
      {currentUser && <h4>Signed in as {currentUser.username}</h4>}
      {!currentUser && (
        <div>
          <h2>Enter Your Name</h2>
          <Entrance setUsername={handleSetUsername} />
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
    </div>
  );
};

export default Chatroom;
