import express from "express";
import cors from "cors";
import crypto from "crypto";

import { emailQueue } from "./queue/email.queue";
import { prisma } from "./config/prisma";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/", (_req, res) => {
  res.send("ReachInbox Backend is running 🚀");
});

/**
 * ------------------------------------------------
 * SINGLE EMAIL SCHEDULING (already existed)
 * ------------------------------------------------
 */
app.post("/schedule-email", async (req, res) => {
  try {
    const { toEmail, subject, body, scheduledAt } = req.body;

    if (!toEmail || !subject || !body || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const email = await prisma.email.create({
      data: {
        toEmail,
        subject,
        body,
        scheduledAt: new Date(scheduledAt),
        status: "scheduled",
        jobId: crypto.randomUUID(),
      },
    });

    const delay = new Date(scheduledAt).getTime() - Date.now();

    await emailQueue.add(
      "send-email",
      { emailId: email.id },
      {
        delay,
        jobId: email.jobId,
      }
    );

    return res.json({
      success: true,
      message: "Email scheduled successfully",
      email,
    });
  } catch (error) {
    console.error("Error scheduling email:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/**
 * ------------------------------------------------
 * 🔥 BULK EMAIL SCHEDULING (NEW – REQUIRED)
 * ------------------------------------------------
 */
app.post("/schedule-bulk", async (req, res) => {
  try {
    const { emails, subject, body, startTime, delayBetween } = req.body;

    if (
      !emails ||
      !Array.isArray(emails) ||
      emails.length === 0 ||
      !subject ||
      !body ||
      !startTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid bulk scheduling payload",
      });
    }

    const scheduled = [];

    for (let i = 0; i < emails.length; i++) {
      const scheduledAt = new Date(
        new Date(startTime).getTime() + i * (delayBetween || 2000)
      );

      const email = await prisma.email.create({
        data: {
          toEmail: emails[i],
          subject,
          body,
          scheduledAt,
          status: "scheduled",
          jobId: crypto.randomUUID(),
        },
      });

      const delay = scheduledAt.getTime() - Date.now();

      await emailQueue.add(
        "send-email",
        { emailId: email.id },
        { delay, jobId: email.jobId }
      );

      scheduled.push(email);
    }

    return res.json({
      success: true,
      count: scheduled.length,
      message: "Bulk emails scheduled successfully",
    });
  } catch (error) {
    console.error("Bulk scheduling failed:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/**
 * ------------------------------------------------
 * GET EMAILS (scheduled / sent)
 * ------------------------------------------------
 */
app.get("/emails", async (req, res) => {
  try {
    const { status } = req.query;

    if (status && status !== "scheduled" && status !== "sent") {
      return res.status(400).json({
        success: false,
        message: "Status must be 'scheduled' or 'sent'",
      });
    }

    const emails = await prisma.email.findMany({
      where: status
        ? { status: status as "scheduled" | "sent" }
        : {},
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      emails,
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default app;
