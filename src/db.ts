export interface Room {
  id: number;
  name: string;
}

export interface User {
  id: string;
  name: string;
  roomId: number;
}

export class InMemoryDB {
  #roomList: Map<number, Room>;
  #userList: Map<string, User>;
  idRoomCounter: number;
  idUserCounter: number;

  constructor() {
    this.#roomList = new Map();
    this.#userList = new Map();
    this.idRoomCounter = 0;
    this.idUserCounter = 0;
  }

  get rooms(): Map<number, Room> {
    return this.#roomList;
  }

  get users(): Map<string, User> {
    return this.#userList;
  }

  public addRoom(room: Room): Room {
    this.idRoomCounter += 1;
    const newRoom = { ...room, id: this.idRoomCounter };
    this.#roomList.set(this.idRoomCounter, newRoom);
    return newRoom;
  }

  public addUser(user: Omit<User, 'roomId'>, userId?: string): User {
    this.idUserCounter += 1;
    let id = '';
    if (userId && this.#userList.has(userId) === false) {
      id = userId;
    } else {
      id = this.idUserCounter.toString();
    }
    const common: Pick<User, 'id' | 'roomId'> = { id: id, roomId: NaN };
    const newUser = { ...user, ...common };
    this.#userList.set(id, newUser);
    return newUser;
  }

  public joinRoom(userId: string, roomId: number): boolean {
    const room = this.#roomList.get(roomId);
    const user = this.#userList.get(userId);
    if (room && user) {
      this.#userList.set(userId, { ...user, roomId: roomId });
      return true;
    }
    return false;
  }

  public leaveRoom(userId: string): boolean {
    const user = this.#userList.get(userId);
    if (user) {
      this.#userList.set(userId, { ...user, roomId: NaN });
      return true;
    }
    return false;
  }
}
