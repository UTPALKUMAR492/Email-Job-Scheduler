import { redis } from "../config/redis";

const MAX_EMAILS_PER_HOUR = Number(process.env.MAX_EMAILS_PER_HOUR || 100);

export async function canSendEmail(sender = "default") {
  const now = new Date();
  const hourKey = `${now.getUTCFullYear()}${now.getUTCMonth()}${now.getUTCDate()}${now.getUTCHours()}`;

  const key = `email_rate:${sender}:${hourKey}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60 * 60);
  }

  return count <= MAX_EMAILS_PER_HOUR;
}
