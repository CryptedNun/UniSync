function MyReminders({ setActivePage, reminders = [] }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Reminders</h1>
        <button className="add-btn" onClick={() => setActivePage("add-reminder")}>+ Add</button>
      </div>
      <div className="cards">
        {reminders.length === 0 ? (
          <div className="card empty">No reminders yet. Click Add to create one.</div>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.id} className="card">
              <h3>{reminder.title}</h3>
              {reminder.description && <p className="desc">{reminder.description}</p>}
              <p>Time: {reminder.time}</p>
              <p>Repeat: {reminder.repeat}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyReminders;
