// Client
export interface ClientMessage {
  payload: string;
}

// Server
export interface ServerMessage extends ClientMessage {
  username: string;
}

// Memory Database
export interface Room {
  id: number;
  name: string;
}

export interface User {
  id: string;
  name: string;
  roomId: number;
}

// JWT
export interface SignUserInterface {
  username: string;
  password: string;
}

// Backend
export interface MessageInterface {
  id: number;
  textMessage: string;
  created_at: string;
  username: string;
}
