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

// A socket with namespace "connection" for new sockets
io.on('connection', socket => {
  console.log('a user connected');

  // Send a message from the socket that just connected to all others
  socket.broadcast.emit('server message', 'Someone connected.');

  // Send a message to a newly connected user
  socket.on('user joined', ({ username }) => {
    socket.emit('server message', `Hi ${username}!`);
  });

  // Listen on a new namespace "new message" for incoming messages
  socket.on('client message', msg => {
    // Broadcast to all sockets except the one that sent the message
    socket.broadcast.emit('server message', msg);
  });

  // Listen for someone typing
  socket.on('someone typed', () => {
    console.log('message from server: someone typed');
    socket.broadcast.emit('notify typing');
  });

  // Listen for stop typing
  socket.on('stop typing', () => {
    console.log('message from server: stop typing');
    socket.broadcast.emit('notify stop typing');
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    socket.broadcast.emit('server message', 'someone disconnected');
  });
});
