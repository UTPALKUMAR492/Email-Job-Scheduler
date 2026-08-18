import { useState } from "react";

export default function EmailForm({ onSuccess }: { onSuccess: () => void }) {
  const [emails, setEmails] = useState<string[]>([]);
  const [manualEmail, setManualEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [startTime, setStartTime] = useState("");
  const [delayBetween, setDelayBetween] = useState(2000);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const parsedEmails = text
        .split(/\r?\n|,/) 
        .map((e) => e.trim())
        .filter((e) => e.includes("@"));

      setEmails(parsedEmails);
    };
    reader.readAsText(file);
  };

  const submit = async () => {
    const emailList =
      emails.length > 0
        ? emails
        : manualEmail
        ? [manualEmail]
        : [];

    if (!emailList.length || !subject || !body || !startTime) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      subject,
      body,
      startTime,
      delayBetween,
    };

    if (emailList.length === 1) {
      await fetch("http://localhost:4000/schedule-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          toEmail: emailList[0],
          scheduledAt: startTime,
        }),
      });
    } else {
      await fetch("http://localhost:4000/schedule-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: emailList,
          ...payload,
        }),
      });
    }

    setEmails([]);
    setManualEmail("");
    setSubject("");
    setBody("");
    setStartTime("");

    onSuccess();
  };

  return (
    <div className="email-form-card">
      <div className="form-header">
        <h2>Compose New Email</h2>
        <div className="header-actions">
          <span className="status-dot green" />
          <span>Live</span>
        </div>
      </div>

      <div className="two-col-fields">
        <label>
          <span>From</span>
          <input
            className="form-input"
            value="no-reply@reachinbox.dev"
            readOnly
          />
        </label>

        <label>
          <span>To</span>
          <input
            className="form-input"
            placeholder="Recipient email (optional if CSV uploaded)"
            value={manualEmail}
            onChange={(e) => {
              const value = e.target.value;
              setManualEmail(value);
              if (value.trim()) {
                setEmails([]);
              }
            }}
          />
        </label>
      </div>

      <div className="upload-row">
        <label className="file-upload">
          <input
            type="file"
            accept=".csv,.txt"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
          />
          <span>Upload CSV</span>
        </label>

        {emails.length > 0 && (
          <p className="helper-text">{emails.length} email(s) detected from file</p>
        )}
      </div>

      <div className="two-col-fields">
        <label>
          <span>Subject</span>
          <input
            className="form-input"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>

        <label>
          <span>Schedule At</span>
          <input
            type="datetime-local"
            className="form-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
      </div>

      <label>
        <span>Message</span>
        <textarea
          className="form-textarea"
          placeholder="Write your email..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>

      <div className="footer-row">
        <label className="inline-field">
          <span>Delay</span>
          <input
            type="number"
            className="form-input small"
            value={delayBetween}
            onChange={(e) => setDelayBetween(Number(e.target.value))}
            title="Delay between emails (ms)"
          />
        </label>

        <button className="schedule-button" onClick={submit}>
          Schedule
        </button>
      </div>
    </div>
  );
}
