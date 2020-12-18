import axios from 'axios';
import { AuthenticationInterface, MessageInterface, Room } from './types';

const API_VERIFY_USER_URL =
  'http://mensatalk.herokuapp.com/verifyUserNameWithToken';
const API_ROOMS_URL = 'http://mensatalk.herokuapp.com/chatrooms';
const API_MESSAGE_URL = `http://mensatalk.herokuapp.com/chatmessages`;
const _get_room_messages_url = (roomId): string => {
  return `http://mensatalk.herokuapp.com/chatrooms/${roomId}/chatmessages`;
};

export const createToken = async (): Promise<AuthenticationInterface> => {
  const apiSignUpUrl = 'https://mensatalk.herokuapp.com/authenticate';
  const response = axios.post(
    apiSignUpUrl,
    JSON.stringify({ username: 'abteilung6', password: 'abteilung6' }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return (await response).data;
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
  console.log(`Sent ${messages.length} room message to heroku`);
  return (await response).data;
};

export const verifyUserNameWithToken = async (
  serverToken: string,
  userToken: string,
  userName: string,
): Promise<number> => {
  const response = axios.post(
    API_VERIFY_USER_URL,
    JSON.stringify({ jwtToken: userToken, userName: userName }),
    {
      headers: {
        Authorization: 'Bearer ' + serverToken,
        'Content-Type': 'application/json',
      },
    },
  );
  return (await response).data;
};
