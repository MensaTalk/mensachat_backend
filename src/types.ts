// Client
export interface JoinRoomMessage {
  roomId: number;
}

export interface LeaveRoomMessage {
  roomId: number;
}

export interface ClientMessage {
  payload: string;
}

export interface ServerMessage extends ClientMessage {
  username: string;
}

// Server
export interface UserJoinedRoomMessage {
  userId: string;
}

export interface UserLeftRoomMessage {
  userId: string;
}
