import express from 'express';
import { Server as ioServer, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { InMemoryDB } from './db';
import { CONNECT, DISCONNECT, MESSAGE } from './constants';
import { ClientMessage, MessageInterface, ServerMessage, User } from './types';
import { loadRooms, saveRoomMessages } from './adapter';

const PORT = process.env.PORT || 80;

const app = express();
app.use(cors());
app.options('*', cors());
//app.set('port', PORT);

const server = http.createServer(app);
const io = new ioServer(server);
const db = new InMemoryDB();
const token = '';

const rooms_seed = loadRooms();
rooms_seed.then((rooms) => rooms.forEach((room) => db.addRoom(room)));

io.on(CONNECT, function (socket: Socket) {
  const connectedUser = handleOnConnect(socket);
  if (connectedUser === undefined) {
    socket.disconnect();
  }

  socket.on(MESSAGE, function (clientMessage: ClientMessage) {
    console.log(`Client ${socket.id} send ${clientMessage.payload}.`);

    const roomId = db.getRoomIdByUserId(socket.id);
    const user = db.getUserByUserId(socket.id);
    console.log(`Room addresses ${roomId}.`);
    console.log(user);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = saveRoomMessages(token, messages);
  });

  socket.on(DISCONNECT, function () {
    console.log(`Client ${socket.id} disconnected.`);
    db.removeUser(socket.id);
  });
});

server.listen(PORT, function () {
  console.log(`listening on *:${PORT}`);
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
      db.removeUser(userId);
      return undefined;
    }
  }
  return undefined;
};
