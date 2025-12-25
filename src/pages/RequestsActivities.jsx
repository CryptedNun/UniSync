import RequestCard from "../components/RequestCard";

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

function RequestsActivities({ currentUser, setActivePage }) {
  const handleJoin = (requestId) => {
    console.log("Joining request", requestId);
  };

  return (
    <div className="dashboard">
      <button className="dashboard-back" onClick={() => setActivePage("dashboard")}>
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
  );
}

export default RequestsActivities;
