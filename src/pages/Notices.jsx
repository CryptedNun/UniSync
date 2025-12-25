const dummyNotices = [
  { id: 1, content: "📢 Semester Ends on Dec 30" },
  { id: 2, content: "📢 Hackathon Registration closes tonight" },
];

function Notices({ setActivePage }) {
  return (
    <div className="dashboard">
      <button className="dashboard-back" onClick={() => setActivePage("dashboard")}>
        ← Back to Dashboard
      </button>

      <h1>Notices</h1>
      <div className="cards">
        {dummyNotices.map((notice) => (
          <div key={notice.id} className="card">
            {notice.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notices;
