import express from 'express';
import { Server as ioServer } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());
app.options('*', cors());
app.set('port', process.env.PORT || 9001);

const server = http.createServer(app);

const io = new ioServer(server);

io.on('connection', function (socket: any) {
  console.log('Client connected!');
  socket.on('msg', function (msg: any) {
    console.log(msg);
  });
});

server.listen(9001, function () {
  console.log('listening on *:9001');
});
