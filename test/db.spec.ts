import { InMemoryDB } from '../src/db';

describe('in memory db', () => {
  let db = new InMemoryDB();

  beforeEach(() => {
    db = new InMemoryDB();
  });

  it('initial object has no rooms and users', () => {
    expect(db.rooms.size).toBe(0);
    expect(db.rooms.size).toBe(0);
  });

  it('add room', () => {
    const room = db.addRoom({ id: NaN, name: 'name' });
    expect(db.rooms.size).toBe(1);
    expect(room.id).toBe(1);
  });
  it('add user with own id', () => {
    const user = db.addUser({ id: 0, name: 'name' }, 'myId');
    expect(db.users.size).toBe(1);
    expect(user.id).toBe(0);
  });
  it('add user with own id but duplicated', () => {
    const user = db.addUser({ id: 0, name: 'name' }, 'myId');
    expect(user).toBeDefined();
    expect(db.users.size).toBe(1);
    const anotherUser = db.addUser({ id: 0, name: 'name' }, 'myId');
    expect(anotherUser).toBeUndefined();
  });
  it('user can join room', () => {
    const socketId = 'myId';
    const user = db.addUser({ id: 0, name: 'name' }, socketId);
    const room = db.addRoom({ id: NaN, name: 'name' });

    expect(db.joinRoom(socketId, room.id)).toBeTruthy();
    expect(db.users.get(socketId).roomId).toBe(room.id);
  });
  it('user can leave room', () => {
    const socketId = 'myId';
    const user = db.addUser({ id: 0, name: 'name' }, socketId);
    const room = db.addRoom({ id: NaN, name: 'name' });

    expect(db.joinRoom(socketId, room.id));
    expect(db.leaveRoom(socketId)).toBeTruthy();
    expect(db.users.get(socketId).roomId).toBeNaN();
  });
});
