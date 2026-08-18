export default function Sidebar({
  user,
  active,
  onSelect,
}: {
  user: any;
  active: "scheduled" | "sent";
  onSelect: (v: "scheduled" | "sent") => void;
}) {
  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <img
          src={user.picture}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <button className="bg-green-500 text-white py-2 rounded-lg mb-6">
        Compose
      </button>

      <div className="space-y-2 text-sm">
        <button
          onClick={() => onSelect("scheduled")}
          className={`w-full text-left px-3 py-2 rounded ${
            active === "scheduled"
              ? "bg-green-100 text-green-700"
              : "hover:bg-gray-100"
          }`}
        >
          Scheduled
        </button>

        <button
          onClick={() => onSelect("sent")}
          className={`w-full text-left px-3 py-2 rounded ${
            active === "sent"
              ? "bg-green-100 text-green-700"
              : "hover:bg-gray-100"
          }`}
        >
          Sent
        </button>
      </div>
    </div>
  );
}
