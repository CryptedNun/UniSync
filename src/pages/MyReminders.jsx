function MyReminders() {
  const dummyReminders = [
    { id: 1, title: "Study Math", time: "6:00 PM", repeat: "Mon, Wed, Fri" },
    { id: 2, title: "Read CS Notes", time: "8:00 PM", repeat: "Daily" },
  ];

  return (
    <div className="dashboard">
      <h1>My Reminders</h1>
      <button className="add-btn" onClick={() => setActivePage("add-reminder")}>+</button>
      <div className="cards">
        {dummyReminders.map((reminder) => (
          <div key={reminder.id} className="card">
            <h3>{reminder.title}</h3>
            <p>Time: {reminder.time}</p>
            <p>Repeat: {reminder.repeat}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyReminders;
