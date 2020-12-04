export interface JoinMessage {
  roomId: number;
}

export interface ActualMessage {
  payload: string;
}

export interface UserJoinedRoomMessage {
  userId: string;
}
