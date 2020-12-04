import express from 'express';
import { Server as ioServer, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { InMemoryDB } from './db';
import { CONNECT, DISCONNECT, JOIN_ROOM, MESSAGE } from './constants';

const app = express();
app.use(cors());
app.options('*', cors());
app.set('port', process.env.PORT || 9001);

const server = http.createServer(app);

const io = new ioServer(server);

const db = new InMemoryDB();

console.log(db.rooms);
console.log(db.users);

io.on(CONNECT, function (socket: Socket) {
  console.log(`Client ${socket.id} connected.`);
  const user = db.addUser({ id: '', name: '' }, socket.id);
  if (user === undefined) {
    socket.disconnect();
  }
  socket.on(JOIN_ROOM, function (msg: unknown) {
    console.log(`Client ${socket.id} try to join with ${msg}.`);
  });

  socket.on(MESSAGE, function (msg: unknown) {
    console.log(`Client ${socket.id} send ${msg}.`);
  });
  socket.on(DISCONNECT, function (socket: Socket) {
    console.log(`Client ${socket.id} disconnected.`);
  });
});

server.listen(9001, function () {
  console.log('listening on *:9001');
});
