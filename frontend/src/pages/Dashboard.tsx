import { useEffect, useRef, useState } from "react";
import EmailForm from "../components/EmailForm";
import EmailList from "../components/EmailList";
import { getScheduledEmails, getSentEmails } from "../api/email";

type Email = {
  id: string;
  toEmail: string;
  subject: string;
  scheduledAt: string;
  sentAt?: string | null;
  status: string;
};

export default function Dashboard({
  user,
  onLogout,
}: {
  user: { name: string; email: string; picture: string };
  onLogout: () => void;
}) {
  const [scheduled, setScheduled] = useState<Email[]>([]);
  const [sent, setSent] = useState<Email[]>([]);
  const [activeTab, setActiveTab] = useState<"scheduled" | "sent">("scheduled");
  const composeRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    const s = await getScheduledEmails();
    const d = await getSentEmails();
    setScheduled(s.emails || []);
    setSent(d.emails || []);
  };

  useEffect(() => {
    load();
    const timer = setInterval(() => {
      load();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-shell">
      <div className="app-window">
        <header className="app-header" />

        <div className="app-layout">
          <aside className="sidebar">
            <button
              className="compose-button"
              type="button"
              onClick={() => {
                composeRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Compose New Email
            </button>

            <nav className="sidebar-nav">
              <button
                className={activeTab === "scheduled" ? "nav-item active" : "nav-item"}
                onClick={() => setActiveTab("scheduled")}
              >
                Scheduled <span className="count-badge">{scheduled.length}</span>
              </button>
              <button
                className={activeTab === "sent" ? "nav-item active" : "nav-item"}
                onClick={() => setActiveTab("sent")}
              >
                Sent <span className="count-badge">{sent.length}</span>
              </button>
            </nav>
          </aside>

          <main className="mail-content">
            <div className="page-header">
              <div className="title-wrap">
                <h1>{activeTab === "scheduled" ? "Scheduled Emails" : "Sent Emails"}</h1>
              </div>

              <div className="header-user">
                <div className="user-meta">
                  <img src={user.picture} alt={user.name} />
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
                <button className="ghost-button" onClick={onLogout}>Logout</button>
              </div>
            </div>

            <div ref={composeRef}>
              <EmailForm onSuccess={load} />
            </div>

            <div className="list-panel">
              <EmailList
                emails={activeTab === "scheduled" ? scheduled : sent}
                type={activeTab}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
