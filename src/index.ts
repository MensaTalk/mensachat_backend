import express from 'express';
import { Server as ioServer, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { InMemoryDB } from './db';
import { CONNECT, DISCONNECT, JOIN_ROOM, MESSAGE } from './constants';
import { ActualMessage, JoinMessage } from './types';

const app = express();
app.use(cors());
app.options('*', cors());
app.set('port', process.env.PORT || 9001);

const server = http.createServer(app);
const io = new ioServer(server);
const db = new InMemoryDB();

io.on(CONNECT, function (socket: Socket) {
  console.log(`Client ${socket.id} connected.`);
  const user = db.addUser({ id: '', name: '' }, socket.id);
  if (user === undefined) {
    console.log(`Client ${socket.id} not able to connect.`);
    socket.disconnect();
  }
  socket.on(JOIN_ROOM, function (msg: JoinMessage) {
    console.log(`Client ${socket.id} try to join with ${msg}.`);
    if (msg.roomId) {
      const joinAction = db.joinRoom(socket.id, msg.roomId);
      if (joinAction) {
        socket.join(msg.roomId.toString());
        console.log(`Client ${socket.id} joined ${msg.roomId}.`);
      } else {
        console.log(`Client ${socket.id} failed to join ${msg.roomId}.`);
      }
    }
  });
  socket.on(MESSAGE, function (msg: ActualMessage) {
    console.log(`Client ${socket.id} send ${msg.payload}.`);
  });
  socket.on(DISCONNECT, function (socket: Socket) {
    // TODO: socket.id defined?
    console.log(`Client ${socket.id} disconnected.`);
  });
});

server.listen(9001, function () {
  console.log('listening on *:9001');
});
