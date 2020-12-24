import axios from 'axios';
import { AuthenticationInterface, MessageInterface, Room } from './types';

import dotenv from 'dotenv';
dotenv.config();

const {
  REACT_APP_VERIFY_USER_URL,
  REACT_APP_ROOMS_URL,
  REACT_APP_MESSAGE_URL,
} = process.env;

const urlVerifyUser = REACT_APP_VERIFY_USER_URL || '';
const urlRooms = REACT_APP_ROOMS_URL || '';
const urlMessages = REACT_APP_MESSAGE_URL || '';

const _get_room_messages_url = (roomId): string => {
  return `http://mensatalk.herokuapp.com/chatrooms/${roomId}/chatmessages`;
};

export const createToken = async (
  username: string,
  password: string,
): Promise<AuthenticationInterface> => {
  const apiSignUpUrl = 'https://mensatalk.herokuapp.com/authenticate';
  const response = axios.post(
    apiSignUpUrl,
    JSON.stringify({ username: username, password: password }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return (await response).data;
};

export const loadRooms = async (): Promise<Room[]> => {
  const response = axios.get(urlRooms);
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
  const response = axios.post(urlMessages, JSON.stringify(messages), {
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
    urlVerifyUser,
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
