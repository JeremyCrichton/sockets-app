import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 2rem;
`;

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
    <Form onSubmit={handleSubmit}>
      <Input value={message} onChange={handleChange} />
    </Form>
  );
};

export default ChatForm;
