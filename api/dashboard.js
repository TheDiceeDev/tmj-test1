export default function handler(req, res) {
  // This endpoint *requires* a valid session cookie. If not present, returns 401.
  const cookies = (req.headers.cookie || "").split(";").map(s => s.trim());
  const hasSession = cookies.some(c => c.startsWith("pixelytics_session="));
  if (!hasSession) return res.status(401).json({ error: "unauthorized" });

  // return real dashboard data for authenticated sessions
  return res.status(200).json({
    user: "student@pixelytics.test",
    metrics: { visitors: 1024, bounce: "21%", sessions: 2048 },
    flag: "FLAG{pixelytics_dashboard_access}"
  });
}
