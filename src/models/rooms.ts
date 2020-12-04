export interface Room {
  id: number;
  name: string;
}

export class Rooms {
  #roomList: Map<number, Room>;
  idCounter: number;

  constructor() {
    this.#roomList = new Map();
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
}
