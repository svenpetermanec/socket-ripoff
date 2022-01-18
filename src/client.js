import Player from './player.js';
import User from './user.js';

const socket = io();

const canvas = document.querySelector('canvas#main');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const player = new Player(
  ctx,
  {
    x: ctx.canvas.width * Math.random(),
    y: ctx.canvas.height * Math.random(),
  },
  socket
);

const users = [];

const getIndex = (id) => {
  return users.findIndex((user) => user.id === id);
};

var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', function (msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.emit('user-connected', player.coordinates, (onlineUsers) => {
  console.log(onlineUsers);
  onlineUsers.forEach((user) => {
    users.push(new User(ctx, user.coordinates, user.id));
  });
});

socket.on('user-connected', ({ coordinates, id }) => {
  if (id === socket.id) return;
  users.push(new User(ctx, coordinates, id));
});

socket.on('user-moved', ({ coordinates, id }) => {
  if (id !== socket.id) {
    users[users.findIndex((user) => user.id === id)].coordinates = coordinates;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  users.forEach((user) => user.draw('#D95B43'));
});

socket.on('user-disconnected', (id) => {
  users.forEach((user) => {
    if (user.id === id) {
      user.delete();
    }
  });
  ctx.globalCompositeOperation = 'source-over';
  users.splice(getIndex(id), 1);
});
