import { signAccessToken, verifyAccessToken } from '../../lib/auth';

test('access token round trip', () => {
  const token = signAccessToken('user1');
  const payload = verifyAccessToken(token);
  expect(payload.sub).toBe('user1');
});
