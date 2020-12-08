import express from 'express';
import { Server as ioServer, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { InMemoryDB, Room, User } from './db';
import { CONNECT, DISCONNECT, LEAVE_ROOM, MESSAGE } from './constants';
import { ActualMessage, LeaveRoomMessage, UserLeftRoomMessage } from './types';

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
  const connectedUser = handleOnConnect(socket);
  if (connectedUser === undefined) {
    socket.disconnect();
  }
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
  socket.on(DISCONNECT, function () {
    console.log(`Client ${socket.id} disconnected.`);
    db.removeUser(socket.id);
  });
});

server.listen(9001, function () {
  console.log('listening on *:9001');
});

export const handleOnConnect = (socket: Socket): User | undefined => {
  const roomId: string = socket.handshake.query['roomId'] as string;
  const userId = socket.id;
  const userName = socket.handshake.query['name'];
  console.log(typeof roomId);
  if (roomId && userId && userName) {
    const addedUser = db.addUser({ id: '', name: userName }, userId);
    if (addedUser) {
      const joinAction = db.joinRoom(userId, parseInt(roomId));
      if (joinAction) {
        socket.join(roomId);
        console.log(`Client ${socket.id} joined roomId ${roomId}.`);
        return addedUser;
      }
      // TODO: remove user from userList after join room failed
      return undefined;
    }
  }
  return undefined;
};
