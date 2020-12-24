import { InMemoryDB } from '../src/db';
import { Message } from '../src/types';

describe('in memory db', () => {
  describe('rooms', () => {
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
  describe('messages', () => {
    let db = new InMemoryDB();

    beforeEach(() => {
      db = new InMemoryDB();
    });
    it('user can add a message', () => {
      const message: Message = {
        id: NaN,
        text: 'text',
        timestamp: 1,
        roomId: 1,
        userId: 1,
      };
      db.addMessage(message);
      expect(db.messages.length).toBe(1);
    });
    it('user can place multiple messages', () => {
      const oldMessage: Message = {
        id: NaN,
        text: 'text',
        timestamp: 1,
        roomId: 1,
        userId: 1,
      };
      const latestMessage: Message = {
        id: NaN,
        text: 'text later',
        timestamp: 2,
        roomId: 1,
        userId: 1,
      };
      db.addMessage(oldMessage);
      expect(db.messages.length).toBe(1);
      db.addMessage(latestMessage);
      expect(db.messages.length).toBe(2);
    });
    it('removeOutdatedMessages removes outdated messages', () => {
      const timestamp = Math.floor(new Date().valueOf() / 1000);
      const message: Message = {
        id: NaN,
        text: 'text',
        timestamp: timestamp,
        roomId: 1,
        userId: 1,
      };
      db.addMessage(message);
      expect(db.messages.length).toBe(1);
      db.removeOutdatedMessages(timestamp + 6, 5);
      expect(db.messages.length).toBe(0);
    });
    it('get latest typings', () => {
      const timestamp = Math.floor(new Date().valueOf() / 1000);
      const outdatedMessage: Message = {
        id: 1,
        text: 'text',
        timestamp: timestamp - 100,
        roomId: 1,
        userId: 1,
      };
      const latestMessage: Message = {
        id: 2,
        text: 'text',
        timestamp: timestamp,
        roomId: 1,
        userId: 1,
      };
      db.addMessage(outdatedMessage);
      db.addMessage(latestMessage);
      expect(db.messages.length).toBe(2);
      const typings = db.getLatestTypings(latestMessage.roomId, timestamp, 5);
      expect(typings[0].id).toBe(2);
    });
  });
});
