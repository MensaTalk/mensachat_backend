import axios from 'axios';
import { MessageInterface, Room } from './types';

const API_ROOMS_URL = 'http://mensatalk.herokuapp.com/chatrooms';
const API_MESSAGE_URL = `http://mensatalk.herokuapp.com/chatmessages`;
const _get_room_messages_url = (roomId): string => {
  return `http://mensatalk.herokuapp.com/chatrooms/${roomId}/chatmessages`;
};

export const loadRooms = async (): Promise<Room[]> => {
  const response = axios.get(API_ROOMS_URL);
  return (await response).data;
};

export const getRoomMessages = async (
  roomId: number,
  token: string,
): Promise<MessageInterface[]> => {
  const response = axios.get(_get_room_messages_url(roomId), {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  });
  return (await response).data;
};

export const saveRoomMessages = async (
  token: string,
  messages: MessageInterface[],
): Promise<MessageInterface[]> => {
  const response = axios.post(API_MESSAGE_URL, JSON.stringify(messages), {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
  });
  return (await response).data;
};
