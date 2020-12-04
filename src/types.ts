// Client
export interface JoinRoomMessage {
  roomId: number;
}

export interface LeaveRoomMessage {
  roomId: number;
}

export interface ActualMessage {
  payload: string;
}

// Server
export interface UserJoinedRoomMessage {
  userId: string;
}

export interface UserLeftRoomMessage {
  userId: string;
}
