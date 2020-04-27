import React, { useState } from 'react';

const ChatForm = ({ sendMessage, userTyped }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    sendMessage(message);
    setMessage('');
  };

  const handleChange = e => {
    setMessage(e.target.value);
    userTyped();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={message} onChange={handleChange} />
    </form>
  );
};

export default ChatForm;
