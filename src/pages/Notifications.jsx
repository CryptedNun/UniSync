import { useEffect } from "react"


function Notifications({ notifications, setNotifications, markRead, deleteNotification,  }) {
  // POLL FOR NEW DATA
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store token here
        const res = await fetch("http://localhost:3000/api/notifications", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
           // In a real app, compare if data is different before setting to avoid re-renders
            setNotifications(data); 
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    };

    // Check every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);

    // Cleanup when leaving page
    return () => clearInterval(interval);
  }, []); // Empty dependency array


  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Notifications</h1>
      </div>

      <section>
        {notifications.length === 0 && (
          <p style={{ color: "#94a3b8" }}>No notifications</p>
        )}

        {notifications.map((note) => (
          <div
            key={note.id}
            className="card"
            style={{
              width: "100%",
              opacity: note.read ? 0.6 : 1,
              borderLeft: note.read
                ? "4px solid #94a3b8"
                : "4px solid #3b82f6",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{note.title}</h3>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>
                {note.time}
              </span>
            </div>

            <p>{note.message}</p>

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              {!note.read && (
                <button className="add-btn" onClick={() => markRead(note.id)}>
                  Mark as read
                </button>
              )}
              <button className="add-btn" onClick={() => deleteNotification(note.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Notifications
