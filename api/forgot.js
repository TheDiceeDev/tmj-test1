import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_KEY;
if (!JWT_SECRET) throw new Error('JWT_KEY not set');

export function createJwt({ userId, name, last_login=undefined, email, role='user', aud }) {
  const now = Math.floor(Date.now() / 1000); // seconds
  const expiresInSeconds = 15 * 60; // 15 min

  if (!userId) throw new Error('userId required');

  const jti = crypto.randomBytes(16).toString('hex');
  const payload = {
    sub: String(userId), // subject
    name,
    email,
    role,
    aud,
    ...(last_login ? {last_login} : {}),
  };

  const options = {
    algorithm: 'HS256',
    issuer: 'SecureVision Technologies Inc',
    audience: aud,
    jwtid: jti,
    expiresIn: expiresInSeconds, // jsonwebtokens can accept second or strings like '15m'
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt(token, expectedIssuer='SecureVision Technologies Inc') {
  if (!token) throw new Error('token required');
  const verifyOptions = {};
  if (expectedIssuer) verifyOptions.audience = expectedIssuer;

  return jwt.verify(token, JWT_SECRET, verifyOptions);
}

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body || {};
  if (!email) return res.status(400).json({error: 'email required'});

  // fake user lookup
  // replace with DB lookup later
  const fakeUser = {
    id: 'USR-7X9Q4P2L-A13',
    name: 'Evan Carter'
    email,
    role: 'admin',
    last_login: new Date().toISOString(),
  };

  // create JWT token for password reset
  const fakeToken = createJwt({
    userId: fakeUser.id,
    name: fakeUser.name,
    email: fakeUser.email,
    role: fakeUser.role,
    last_login: fakeUser.last_login,
    aud: 'authenticated',
    expiresInSeconds: 15 * 60,
  });
  // Simulate issuing a password reset token.
  // In a real app you'd email the token. For this challenge we return it in JSON.
  // const fakeToken = "reset-" + Math.random().toString(36).slice(2, 12);
  // NOTE: returning the token in the body and telling the client to store it is intentional for the challenge.
  res.status(200).json({ resetToken: fakeToken, expiresInSeconds: 15 * 60 });
}

