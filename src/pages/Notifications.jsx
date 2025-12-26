import { useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: "Reminder Created",
      message: "Your reminder 'Drink Water' was added successfully.",
      time: "Just now",
    },
    {
      id: 2,
      title: "Upcoming Reminder",
      message: "You have a reminder scheduled in 30 minutes.",
      time: "30 min left",
    },
    {
      id: 3,
      title: "System Update",
      message: "A new dashboard update is now live.",
      time: "Yesterday",
    },
    {
      id: 4,
      title: "Weekly Summary",
      message: "You completed 5 reminders this week. Great job!",
      time: "2 days ago",
    },
  ];

  return (
    <div className="dashboard">
      {/* Back Button */}
      <button className="dashboard-back" onClick={() => navigate("/")}>
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div className="dashboard-header">
        <h1>Notifications</h1>
      </div>

      {/* Notifications List */}
      <section>
        {notifications.map((note) => (
          <div key={note.id} className="card" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <h3>{note.title}</h3>
              <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                {note.time}
              </span>
            </div>

            <p>{note.message}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Notifications;
