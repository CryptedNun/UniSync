import RequestCard from "../components/RequestCard";
import { useNavigate } from "react-router-dom";
import Pomodoro from "../components/Pomodoro";
import "./Dashboard.css";


function Dashboard() {
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
        <Pomodoro />
      </div>
    </div>
  )
}

export default Dashboard;
