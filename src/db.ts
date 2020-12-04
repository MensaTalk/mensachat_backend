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
  idCounter: number;

  constructor() {
    this.#roomList = new Map();
    this.#userList = new Map();
    this.idCounter = 0;
  }

  public allRooms(): Map<number, Room> {
    return this.#roomList;
  }

  public addRoom(room: Room): Room {
    this.idCounter += 1;
    this.#roomList.set(this.idCounter, { ...room, id: this.idCounter });
    return room;
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
}
