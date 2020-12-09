# README

## Usage

- `install` - install npm packages,
- `start` - interactive watch mode to automatically transpile source
- `build` - transpile TypeScript to ES6
- `start:prod` - run in production mode
- `start:dev` - run in development mode
- `start:debug` - run in debug mode
- `lint` - lint ts files
- `lint:fix` - lint and format files
- `test` - run jest test runner
- `test:watch` - run jest tests in watch mode
- `test:cov` - run jest tests and show coverage

## Protocol

First the client has to connect with a `handshake query`. Otherwise the client will be disconnected by the server. Currently there is no response after a successful handshake. A client must be in a room. The room must exist and created by the server.

```typescript
const socket = io('http://localhost:9001', {
  query: {
    roomId: 1,
    name: 'alice',
  },
});
```

A client can send a message, which must be typeof a `ClientMessage`. It contains just a payload, which represents plain text. The event type of the message must be `message`.

```typescript
export interface ClientMessage {
  payload: string;
}
const clientMessage: ClientMessage = { payload: 'text' };
clientSocket.emit('message', clientMessage);
```

The Server combines the `ClientMessage` with the username from the sender. This type of Message is called `ServerMessage`. This message will be send to all clients in that room including the sender.

```typescript
export interface ServerMessage {
  payload: string;
  username: string;
}
clientSocket.on('message', (serverMessage: ServerMessage) => {});
```

## Music for development

[Coccolino Deep - Leon](https://www.youtube.com/watch?v=KWUVTxkl5rI)
