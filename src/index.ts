import express from 'express';
import { Server as ioServer, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { InMemoryDB, Room } from './db';
import {
  CONNECT,
  DISCONNECT,
  JOIN_ROOM,
  LEAVE_ROOM,
  MESSAGE,
} from './constants';
import {
  ActualMessage,
  JoinRoomMessage,
  LeaveRoomMessage,
  UserJoinedRoomMessage,
  UserLeftRoomMessage,
} from './types';

const app = express();
app.use(cors());
app.options('*', cors());
app.set('port', process.env.PORT || 9001);

const server = http.createServer(app);
const io = new ioServer(server);
const db = new InMemoryDB();

const dummyRoom: Room = { id: 1, name: '1' };
db.addRoom(dummyRoom);

io.on(CONNECT, function (socket: Socket) {
  console.log(`Client ${socket.id} connected.`);
  console.log(`Client params ${socket.handshake.query['roomId']}.`);
  const user = db.addUser({ id: '', name: '' }, socket.id);
  if (user === undefined) {
    console.log(`Client ${socket.id} not able to connect.`);
    socket.disconnect();
  }
  socket.on(JOIN_ROOM, function (msg: JoinRoomMessage) {
    console.log(`Client ${socket.id} try to join with ${msg.roomId}.`);
    if (msg.roomId) {
      const joinAction = db.joinRoom(socket.id, msg.roomId);
      if (joinAction) {
        socket.join(msg.roomId.toString());
        const userJoinedRoomMessage: UserJoinedRoomMessage = {
          userId: socket.id,
        };
        io.to(msg.roomId.toString()).emit(
          JSON.stringify(userJoinedRoomMessage),
        );
        console.log(`Client ${socket.id} joined ${msg.roomId}.`);
      } else {
        console.log(`Client ${socket.id} failed to join ${msg.roomId}.`);
      }
    }
  });
  socket.on(LEAVE_ROOM, function (msg: LeaveRoomMessage) {
    console.log(`Client ${socket.id} try to leave with ${msg}.`);
    if (msg.roomId) {
      const leaveAction = db.leaveRoom(socket.id);
      if (leaveAction) {
        // TODO: remove socket from room
        const userLeftRoomMessage: UserLeftRoomMessage = {
          userId: socket.id,
        };
        io.to(msg.roomId.toString()).emit(JSON.stringify(userLeftRoomMessage));
        console.log(`Client ${socket.id} left ${msg.roomId}.`);
      } else {
        console.log(`Client ${socket.id} failed to leave ${msg.roomId}.`);
      }
    }
  });
  socket.on(MESSAGE, function (msg: ActualMessage) {
    console.log(`Client ${socket.id} send ${msg.payload}.`);
    const roomId = db.getRoomIdByUserId(socket.id);
    console.log(`Room addresses ${roomId}.`);
    io.sockets.in(roomId.toString()).emit('message', msg);
  });
  socket.on(DISCONNECT, function (socket: Socket) {
    // TODO: socket.id defined?
    console.log(`Client ${socket.id} disconnected.`);
  });
});

server.listen(9001, function () {
  console.log('listening on *:9001');
});
