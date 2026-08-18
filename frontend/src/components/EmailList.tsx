type Email = {
  id: string;
  toEmail: string;
  subject: string;
  scheduledAt: string;
  sentAt?: string | null;
  status?: string;
};

export default function EmailList({
  emails,
  type,
}: {
  emails: Email[];
  type: "scheduled" | "sent";
}) {
  if (emails.length === 0) {
    return <div className="empty-state">No {type} emails yet.</div>;
  }

  return (
    <div className="mail-list">
      {emails.map((email) => {
        const itemStatus = (email.status || type).toLowerCase();
        const isSent = itemStatus === "sent";

        return (
          <div key={email.id} className="mail-item">
            <div className="mail-main">
              <div className="mail-meta">
                <span className={isSent ? "tag sent-tag" : "tag scheduled-tag"}>
                  {isSent ? "Sent" : "Scheduled"}
                </span>
                <p className="mail-subject">{email.subject}</p>
              </div>
              <p className="mail-recipient">To: {email.toEmail}</p>
            </div>

            <div className="mail-side">
              <span className={isSent ? "status-chip sent" : "status-chip scheduled"}>
                {isSent ? "Delivered" : "Queued"}
              </span>
              <time>
                {isSent
                  ? email.sentAt
                    ? new Date(email.sentAt).toLocaleString()
                    : "-"
                  : new Date(email.scheduledAt).toLocaleString()}
              </time>
            </div>
          </div>
        );
      })}
    </div>
  );
}
