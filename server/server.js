const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../../agario/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../agario/build', 'index.html'));
});

let players = [];

io.on('connection', (socket) => {
  console.log('A user connected');
  
  players.push({ id: socket.id, x: Math.random() * 1000, y: Math.random() * 1000, size: 30 });

  socket.emit('updateGame', players);

  socket.on('playerMove', (data) => {
    const player = players.find(p => p.id === socket.id);
    if (player) {
      player.x = data.x;
      player.y = data.y;
    }
    io.emit('updateGame', players);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    players = players.filter(p => p.id !== socket.id);
    io.emit('updateGame', players);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
