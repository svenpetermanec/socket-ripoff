const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 4200;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = [];

const getIndex = (id) => {
  return users.findIndex((user) => user.id === id);
};

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('user-connected', (coordinates, callBack) => {
    callBack(users);
    users.push({ coordinates, id: socket.id });
    io.emit('user-connected', { coordinates, id: socket.id });
  });

  socket.on('user-moved', (coordinates) => {
    let movedUser = users[users.findIndex((user) => user.id === socket.id)];
    movedUser.coordinates = coordinates;
    io.emit('user-moved', movedUser);
  });

  socket.on('disconnect', () => {
    users.splice(getIndex(socket.id), 1);
    io.emit('user-disconnected', socket.id);
  });
});

server.listen(process.env.PORT || PORT, () => {
  return console.log('Server running on port: ' + (process.env.PORT || PORT));
});
