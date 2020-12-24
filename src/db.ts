import { Message, Room, Typing, User } from './types';
export class InMemoryDB {
  #roomList: Map<number, Room>;
  #userList: Map<string, User>;
  #messageList: Message[];
  idRoomCounter: number;
  idUserCounter: number;

  constructor() {
    this.#roomList = new Map();
    this.#userList = new Map();
    this.#messageList = [];
    this.idRoomCounter = 0;
    this.idUserCounter = 0;
  }

  get rooms(): Map<number, Room> {
    return this.#roomList;
  }

  get users(): Map<string, User> {
    return this.#userList;
  }

  get messages(): Message[] {
    return this.#messageList;
  }

  public getUserByUserId(socketId: string): User {
    console.log(socketId);
    return this.#userList.get(socketId);
  }

  public addRoom(room: Room): Room {
    this.idRoomCounter += 1;
    const newRoom = { ...room, id: this.idRoomCounter };
    this.#roomList.set(this.idRoomCounter, newRoom);
    return newRoom;
  }

  public addUser(
    user: Omit<User, 'roomId'>,
    socketId: string,
  ): User | undefined {
    const hasUser = this.#userList.has(socketId);
    if (hasUser) {
      return undefined;
    }
    const common: Pick<User, 'roomId'> = { roomId: NaN };
    const newUser = { ...user, ...common };
    this.#userList.set(socketId, newUser);
    return newUser;
  }

  public removeUser(socketId: string): boolean {
    return this.#userList.delete(socketId);
  }

  public joinRoom(socketId: string, roomId: number): boolean {
    const room = this.#roomList.get(roomId);
    const user = this.#userList.get(socketId);
    if (room && user) {
      this.#userList.set(socketId, { ...user, roomId: roomId });
      return true;
    }
    return false;
  }

  public leaveRoom(socketId: string): boolean {
    const user = this.#userList.get(socketId);
    if (user) {
      this.#userList.set(socketId, { ...user, roomId: NaN });
      return true;
    }
    return false;
  }

  public getRoomIdByUserId(socketId: string): number {
    const user = this.#userList.get(socketId);
    if (user) {
      return user.roomId;
    }
    return NaN;
  }

  public getUserIdsByRoomId(roomId: number): number[] {
    return Array.from(this.#userList.values())
      .filter((user) => user.roomId === roomId)
      .map((user) => user.id);
  }

  public addMessage(message: Message): void {
    this.#messageList.push(message);
  }

  // TODO: Async behavior, atomic operations needed
  public removeOutdatedMessages(timestamp: number, threshhold = 5): void {
    const updatedMessages: Message[] = this.#messageList.filter(
      (message) => message.timestamp >= timestamp - threshhold,
    );
    this.#messageList = [...updatedMessages];
    return;
  }

  public getLatestTypings(
    roomId: number,
    timestamp: number,
    threshhold = 5,
  ): Typing[] {
    return this.#messageList
      .filter(
        (message) =>
          message.roomId === roomId &&
          message.timestamp >= timestamp - threshhold,
      )
      .map((message) => {
        return {
          id: message.id,
          roomId: message.roomId,
          timestamp: message.timestamp,
          userId: message.userId,
        };
      });
  }
}
