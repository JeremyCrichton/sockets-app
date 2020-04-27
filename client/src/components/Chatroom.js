import React, { useState, useEffect } from 'react';

const Chatroom = () => {
  const [serverResponse, setServerResponse] = useState();

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setServerResponse(data));
  }, []);

  return (
    <div>
      <h2>Chatroom</h2>
      <p>Server says: {serverResponse && serverResponse.message}</p>
    </div>
  );
};

export default Chatroom;
