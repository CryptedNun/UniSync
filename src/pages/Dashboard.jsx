import RequestCard from "../components/RequestCard";
import { useNavigate } from "react-router-dom";
import Pomodoro from "../components/Pomodoro";
import "./Dashboard.css";

const dummyRequests = [
  {
    id: 1,
    caption: "Tuition Offer",
    description: "Need 1 student to tutor Math 10",
    max_participants: 2,
    participants: [{ user_id: 1 }],
  },
  {
    id: 2,
    caption: "Weekend Trip",
    description: "Looking for 3 friends for hiking",
    max_participants: 4,
    participants: [{ user_id: 2 }],
  },
];

const dummyNotices = [
  { id: 1, content: "📢 Semester Ends on Dec 30" },
  { id: 2, content: "📢 Hackathon Registration closes tonight" },
];

function Dashboard({ currentUser }) {
  const navigate = useNavigate()
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-buttons" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px'}}>
        <button
          className="dashboard-btn"
          onClick={() => navigate("/requests")}
        >
          Requests / Activities
        </button>

        <button
          className="dashboard-btn"
          onClick={() => navigate("/notices")}
        >
          Notices
        </button>
        <Pomodoro currentUser={currentUser} />
      </div>
    </div>
  )
}

export default Dashboard;
