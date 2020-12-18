import { verifyUserNameWithToken, createToken } from '../src/adapter';

describe('verify user name', () => {
  it('initial object has no rooms and users', async () => {
    const serverToken = (await createToken()).token;

    const userId = await verifyUserNameWithToken(
      serverToken,
      serverToken,
      'abteilung6',
    );
    expect(userId).toEqual(expect.any(Number)); // Later: userId
  });
});
