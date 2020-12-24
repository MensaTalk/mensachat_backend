import { verifyUserNameWithToken, createToken } from '../src/adapter';

const { REACT_APP_JWT_USERNAME, REACT_APP_JWT_PASSWORD } = process.env;

const jwtUsername = 'abteilung6' || '';
const jwtPassword = 'abteilung6' || '';

describe('verify user name', () => {
  it('initial object has no rooms and users', async () => {
    const serverToken = (await createToken(jwtUsername, jwtPassword)).token;

    const userId = await verifyUserNameWithToken(
      serverToken,
      serverToken,
      'abteilung6',
    );
    expect(userId).toEqual(expect.any(Number)); // Later: userId
  });
});
