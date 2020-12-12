import axios from 'axios';
import { Room, MessageInterface } from './types';

const API_ROOMS_URL = 'http://mensatalk.herokuapp.com/chatrooms';
const _get_room_messages_url = (roomId): string => {
  return `http://mensatalk.herokuapp.com/chatrooms/${roomId}/chatmessages`;
};

export const loadRooms = async (): Promise<Room[]> => {
  const response = axios.get(API_ROOMS_URL);
  const rooms: Room[] = (await response).data;
  return rooms;
};

export const saveRoomMessage = (
  roomId: number,
  token: string,
  message: MessageInterface,
): void => {
  // TODO:  test
  const room_messages_url = _get_room_messages_url(roomId);
  axios.post(room_messages_url, JSON.stringify(message), {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  });
  return;
};
