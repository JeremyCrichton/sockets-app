/**
 * Express Application
 */

const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const uuid = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 4000;

// Serve static files from client React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Hi from the server!' });
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

/**
 * CHATROOM
 */

let numUsers = 0;

// A socket with namespace "connection" for new sockets
io.on('connection', socket => {
  numUsers += 1;
  io.emit('users update', { numUsers });

  // When a new user connects, set the username, room, and send a welcome message
  socket.on('user joined', ({ id, username, room }) => {
    if (!socket.username) {
      socket.userid = id;
      socket.username = username;
      socket.room = room;
      socket.emit('server message', {
        id,
        message: `Hi ${username}!`,
      });
      socket.join(room);
    }
  });

  // Listen on a new namespace "client message" for incoming messages
  socket.on('client message', ({ id, message }) => {
    // Broadcast to all sockets (other than sender) in sending socket's room
    socket.broadcast.to(socket.room).emit('server message', { id, message });
  });

  // Listen for someone typing
  socket.on('someone typed', () => {
    socket.broadcast
      .to(socket.room)
      .emit('notify typing', { username: socket.username });
  });

  // Listen for stop typing
  socket.on('stop typing', () => {
    socket.broadcast.to(socket.room).emit('notify stop typing');
  });

  socket.on('disconnect', () => {
    numUsers -= 1;
    io.emit('users update', { numUsers });
  });
});
