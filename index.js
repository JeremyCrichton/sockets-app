/**
 * Express Application
 */

// import express from 'express';
// import path from 'path';
// import http from 'http';
// import socketIO from 'socket.io';

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
  console.log('a user connected');

  // Send a message from the socket that just connected to all others
  // socket.broadcast.emit('server message', {id: uuid.v4(), message: 'Someone connected.'});

  // When a new user connects, set the user name and send a welcome message
  socket.on('user joined', ({ username }) => {
    if (!socket.username) {
      socket.username = username;
      numUsers += 1;
      socket.emit('server message', {
        id: uuid.v4(),
        message: `Hi ${username}!`,
      });
      io.emit('users update', { numUsers });
    }
  });

  // Listen on a new namespace "new message" for incoming messages
  socket.on('client message', ({ id, message }) => {
    // Broadcast to all sockets except the one that sent the message
    socket.broadcast.emit('server message', { id, message });
  });

  // Listen for someone typing
  socket.on('someone typed', () => {
    socket.broadcast.emit('notify typing', { username: socket.username });
  });

  // Listen for stop typing
  socket.on('stop typing', () => {
    socket.broadcast.emit('notify stop typing');
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    // socket.broadcast.emit('server message', 'someone disconnected');
  });
});
