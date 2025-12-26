import RequestCard from "../components/RequestCard";
import { useNavigate } from "react-router-dom";

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

function RequestsActivities({ currentUser }) {
  const handleJoin = (requestId) => {
    console.log("Joining request", requestId);
  };
  const navigate = useNavigate()

  return (
    <div className="dashboard">
      <button className="dashboard-back" onClick={() => navigate("/")}>
        ← Back to Dashboard
      </button>

      <h1>Requests / Activities</h1>
      <div className="cards">
        {dummyRequests.map((req) => (
          <RequestCard
            key={req.id}
            request={req}
            currentUser={currentUser}
            onJoin={handleJoin}
          />
        ))}
      </div>
    </div>
  )
}

export default RequestsActivities;
