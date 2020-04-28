import React, { useState } from 'react';
import useChat from '../hooks/useChat';

const Entrance = ({ submitUserDetails }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('javascript');

  const handleSubmit = e => {
    e.preventDefault();

    submitUserDetails(username, room);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='username-input'>
        <h2>Enter Your Name</h2>
      </label>
      <input
        id='username-input'
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <h2>Select a Room</h2>
      <label htmlFor='select-room'>
        <h2>Enter Your Name</h2>
      </label>
      <select
        name='select-room'
        id='select-room'
        value={room}
        onChange={e => setRoom(e.target.value)}
      >
        <option value='javascript'>Javascript</option>
        <option value='ruby'>Ruby</option>
      </select>
      <input type='submit' value='Join!' />
    </form>
  );
};

export default Entrance;
