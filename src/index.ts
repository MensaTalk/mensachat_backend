import express from 'express';
import { Server as ioServer, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());
app.options('*', cors());
app.set('port', process.env.PORT || 9001);

const server = http.createServer(app);

const io = new ioServer(server);

io.on('connection', function (socket: Socket) {
  console.log('Client connected!' + socket.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket.on('message', function (msg: any) {
    console.log('Client ' + socket.id + ' send: ' + msg);
  });
  socket.on('disconnect', function (socket: Socket) {
    console.log('Client disconnected!' + socket.id);
  });
});

server.listen(9001, function () {
  console.log('listening on *:9001');
});
