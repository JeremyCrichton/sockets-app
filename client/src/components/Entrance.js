import React, { useState } from 'react';

const Entrance = ({ setUsername }) => {
  const [name, setName] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    setUsername(name);
    setUsername('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='username-input'></label>
      <input
        id='username-input'
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input type='submit' value='Join!' />
    </form>
  );
};

export default Entrance;
