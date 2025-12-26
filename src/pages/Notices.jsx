import { useNavigate } from "react-router-dom";

const dummyNotices = [
  { id: 1, content: "📢 Semester Ends on Dec 30" },
  { id: 2, content: "📢 Hackathon Registration closes tonight" },
];

function Notices() {
  const navigate = useNavigate()
  return (
    <div className="dashboard">
      <button className="dashboard-back" onClick={() => navigate("/")}>
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
  )
}

export default Notices;
