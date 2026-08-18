type Email = {
  id: string;
  toEmail: string;
  subject: string;
  scheduledAt: string;
  sentAt?: string | null;
  status: string;
};

export default function EmailTable({
  title,
  emails,
  loading,
}: {
  title: string;
  emails: Email[];
  loading?: boolean;
}) {
  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {emails.map((email) => (
        <div
          key={email.id}
          className="bg-white rounded-lg shadow p-4 flex justify-between"
        >
          <div>
            <p className="font-medium">{email.subject}</p>
            <p className="text-sm text-gray-500">
              To: {email.toEmail}
            </p>
          </div>

          <div className="text-right">
            <span
              className={`text-xs px-2 py-1 rounded ${
                email.status === "sent"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {email.status}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              {email.sentAt
                ? new Date(email.sentAt).toLocaleString()
                : new Date(email.scheduledAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
