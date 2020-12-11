// Client
export interface ClientMessage {
  payload: string;
}

// Server
export interface ServerMessage extends ClientMessage {
  username: string;
}
