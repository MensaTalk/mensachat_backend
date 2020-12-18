// Client
export interface ClientMessage {
  payload: string;
}

// Server
export interface ServerMessage extends ClientMessage {
  username: string;
}

export interface RoomEventMessage {
  userIds: number[];
}

// Memory Database
export interface Room {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  roomId: number;
}

// JWT
export interface AuthenticationInterface {
  token: string;
}

// Backend
export interface MessageInterface {
  chatRoomId: number;
  textMessage: string;
  created_at: string; // 2020-12-13T10:43:13.860+00:00
  authorName: string;
}
