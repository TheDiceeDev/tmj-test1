// simple example — in Vercel, exports a default function(req, res)
export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body || {};
  // single user
  const USER_EMAIL = import.meta.env.CHALLANGE_EMAIL;
  // this is a stored hash placeholder; we just check equality for demo
  const CORRECT_PASSWORD = import.meta.env.CHALLANGE_PASSWORD; // For simplicity i've not hashed the password, but still 

  if (email === USER_EMAIL && password === CORRECT_PASSWORD) {
    // In a real app we would set an HTTP-only session cookie. Here we simulate success.
    res.setHeader("Set-Cookie", "pixelytics_session=valid; HttpOnly; Path=/; Max-Age=3600");
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ error: "Invalid credentials" });
}
