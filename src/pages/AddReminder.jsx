import { useState } from "react";
import { useNavigate } from "react-router-dom";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function AddReminder() {
const navigate = useNavigate();
const [title, setTitle] = useState("");
const [time, setTime] = useState("");
const [selectedDays, setSelectedDays] = useState([]);

const toggleDay = (day) => {
    setSelectedDays((prev) =>
    prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
};

return (
    <div className="add-page">
    <h1>Add Reminder</h1>

    <label>Title</label>
    <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Reminder title"
    />

    <label>Time</label>
    <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
    />

    <label>Repeat</label>
    <div className="days">
        {days.map((day) => (
        <button
            key={day}
            className={selectedDays.includes(day) ? "day active" : "day"}
            onClick={() => toggleDay(day)}
        >
            {day}
        </button>
        ))}
    </div>

    <button className="save-btn" onClick={() => navigate("/")}>
        Save
    </button>
    </div>
);
}

export default AddReminder;
