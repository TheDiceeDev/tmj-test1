export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body || {};
  // Simulate issuing a password reset token.
  // In a real app you'd email the token. For this challenge we return it in JSON.
  const fakeToken = "reset-" + Math.random().toString(36).slice(2, 12);
  // NOTE: returning the token in the body and telling the client to store it is intentional for the challenge.
  res.status(200).json({ resetToken: fakeToken });
}

