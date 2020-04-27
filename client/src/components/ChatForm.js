import React, { useState } from 'react';

const ChatForm = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    sendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </form>
  );
};

export default ChatForm;
