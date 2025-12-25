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

const dummyNotices = [
  { id: 1, content: "📢 Semester Ends on Dec 30" },
  { id: 2, content: "📢 Hackathon Registration closes tonight" },
];

function Dashboard({ setActivePage }) {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-buttons">
        <button
          className="dashboard-btn"
          onClick={() => setActivePage("requests")}
        >
          Requests / Activities
        </button>

        <button
          className="dashboard-btn"
          onClick={() => setActivePage("notices")}
        >
          Notices
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
