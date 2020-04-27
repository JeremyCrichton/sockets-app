/**
 * Express Application
 */

const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 4000;

// Serve static files from client React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Endpoint
app.get('/api', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

// The "catchall" handler for any request that doesn't match above
// send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// Start server
server.listen(port, () => {
  console.log(`Server listening on port ${[port]}`);
});

// A socket with namespace "connection" for new sockets
io.on('connection', socket => {
  console.log('a user connected');

  // Send a message from the socket that just connected to all others
  socket.broadcast.emit('new connection', 'Someone connncted.');

  // Listen on a new namespace "new message" for incoming messages
  socket.on('new message', msg => {
    console.log(`Message received: ID: ${msg.id}, Message: ${msg.content}`);
    // Broadcast to all sockets including the one that sent the message
    io.emit('new message', msg);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});
