export interface Room {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  roomId: number;
}

export class InMemoryDB {
  #roomList: Map<number, Room>;
  #userList: Map<number, User>;
  idRoomCounter: number;
  idUserCounter: number;

  constructor() {
    this.#roomList = new Map();
    this.#userList = new Map();
    this.idRoomCounter = 0;
    this.idUserCounter = 0;
  }

  public allRooms(): Map<number, Room> {
    return this.#roomList;
  }

  public allUsers(): Map<number, User> {
    return this.#userList;
  }

  public addRoom(room: Room): Room {
    this.idRoomCounter += 1;
    this.#roomList.set(this.idRoomCounter, { ...room, id: this.idRoomCounter });
    return room;
  }

  public addUser(user: User): Room {
    this.idUserCounter += 1;
    this.#userList.set(this.idUserCounter, { ...user, id: this.idUserCounter });
    return user;
  }

  public joinRoom(userId: number, roomId: number): boolean {
    const room = this.#roomList.get(roomId);
    const user = this.#userList.get(userId);
    if (room && user) {
      this.#userList.set(userId, { ...user, roomId: roomId });
      return true;
    }
    return false;
  }

  public leaveRoom(userId: number): boolean {
    const user = this.#userList.get(userId);
    if (user) {
      this.#userList.set(userId, { ...user, roomId: NaN });
      return true;
    }
    return false;
  }
}
