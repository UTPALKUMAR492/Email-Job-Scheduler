const API_URL = "http://localhost:4000";

export async function scheduleEmail(data: {
  toEmail: string;
  subject: string;
  body: string;
  scheduledAt: string;
}) {
  const res = await fetch(`${API_URL}/schedule-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getScheduledEmails() {
  const res = await fetch(`${API_URL}/emails?status=scheduled`);
  return res.json();
}

export async function getSentEmails() {
  const res = await fetch(`${API_URL}/emails?status=sent`);
  return res.json();
}
