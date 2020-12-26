import express from 'express';
import { Server as ioServer, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { InMemoryDB } from './db';
import {
  CONNECT,
  DISCONNECT,
  MESSAGE,
  ROOM_EVENT,
  TYPING_EVENT,
} from './constants';
import {
  ClientMessage,
  ClientTypingMessage,
  Message,
  MessageInterface,
  RoomEventMessage,
  ServerMessage,
  TypingEventMessage,
  User,
} from './types';
import {
  createToken,
  loadRooms,
  saveRoomMessages,
  verifyUserNameWithToken,
} from './adapter';
import { getCurrentTime } from './utils';

import dotenv from 'dotenv';
dotenv.config();

const { REACT_APP_JWT_USERNAME, REACT_APP_JWT_PASSWORD } = process.env;

const jwtUsername = REACT_APP_JWT_USERNAME || '';
const jwtPassword = REACT_APP_JWT_PASSWORD || '';
const PORT = process.env.PORT || 80;

console.log(jwtUsername, jwtPassword);

const app = express();
app.use(cors());
app.options('*', cors());
//app.set('port', PORT);

const server = http.createServer(app);
const io = new ioServer(server);
const db = new InMemoryDB();

const rooms_seed = loadRooms();
rooms_seed.then((rooms) => rooms.forEach((room) => db.addRoom(room)));

const server_token_seed = createToken(jwtUsername, jwtPassword);

io.on(CONNECT, function (socket: Socket) {
  server_token_seed
    .then((token) => handleOnConnect(socket, token.token))
    .then((connectedUser) => {
      if (connectedUser === undefined) {
        console.log('am I disconnected');
        socket.disconnect();
      }
    });
  socket.on(MESSAGE, function (clientMessage: ClientMessage) {
    if (clientMessage.payload.length === 0) {
      return;
    }
    const user = db.getUserByUserId(socket.id);
    console.log(user);
    if (user === undefined) {
      console.log(`${user} is not verified`);
      return;
    }
    console.log(`Client ${socket.id} send ${clientMessage.payload}.`);
    const roomId = db.getRoomIdByUserId(socket.id);

    console.log(`Room addresses ${roomId}.`);
    const serverMessage: ServerMessage = {
      ...clientMessage,
      username: user.name,
    };
    io.sockets.in(roomId.toString()).emit('message', serverMessage);

    // TODO: STORE MESSAGES AND SEND AS BATCH
    const messages: MessageInterface[] = [
      {
        chatRoomId: roomId,
        textMessage: clientMessage.payload,
        authorName: user.name,
        created_at: Date.now().toString(),
      },
    ];
    server_token_seed.then((token) => saveRoomMessages(token.token, messages));
  });

  socket.on(TYPING_EVENT, function (clientTypingMessage: ClientTypingMessage) {
    const user = db.getUserByUserId(socket.id);
    const roomId = db.getRoomIdByUserId(socket.id);
    const timestamp = getCurrentTime();
    const message: Message = {
      id: NaN,
      text: clientTypingMessage.payload,
      timestamp: timestamp,
      roomId: roomId,
      userId: user.id,
    };
    db.addMessage(message);
    db.removeOutdatedMessages(timestamp, 5);
    const typings = db.getLatestTypings(roomId, timestamp, 5);
    if (typings.length > 0) {
      const typingEventMessage: TypingEventMessage = { typings: typings };
      console.log(`Typing Event in room ${roomId}.`);
      io.sockets.in(roomId.toString()).emit(TYPING_EVENT, typingEventMessage);
    }
  });

  socket.on(DISCONNECT, function () {
    console.log(`Client ${socket.id} disconnected.`);
    db.removeUser(socket.id);
    const roomId = db.getRoomIdByUserId(socket.id);
    const roomEventMessage: RoomEventMessage = {
      userIds: db.getUserIdsByRoomId(Number(roomId)),
    };
    io.sockets.in(roomId.toString()).emit(ROOM_EVENT, roomEventMessage);
  });
});

server.listen(PORT, function () {
  console.log(`listening on *:${PORT}`);
});

export const handleOnConnect = async (
  socket: Socket,
  serverToken: string,
): Promise<User | undefined> => {
  const roomId: string = socket.handshake.query['roomId'] as string;
  console.log(typeof roomId);
  const socketId: string = socket.id;

  const userName = socket.handshake.query['name'];
  const userId = await verifyUserNameWithToken(
    serverToken,
    socket.handshake.query['token'],
    userName,
  );

  if (roomId && userId && userName) {
    const addedUser = db.addUser({ id: userId, name: userName }, socketId);
    if (addedUser) {
      const joinAction = db.joinRoom(socketId, parseInt(roomId));
      if (joinAction) {
        socket.join(roomId);
        const roomEventMessage: RoomEventMessage = {
          userIds: db.getUserIdsByRoomId(Number(roomId)),
        };
        io.sockets.in(roomId.toString()).emit(ROOM_EVENT, roomEventMessage);
        console.log(`Client ${socket.id} joined roomId ${roomId}.`);
        return addedUser;
      }
      db.removeUser(socketId);
      return undefined;
    }
  }
  return undefined;
};
