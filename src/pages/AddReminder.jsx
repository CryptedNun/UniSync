import { useState } from "react";
import { useNavigate } from "react-router-dom";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function AddReminder({ addReminder }) {
    const navigate = useNavigate()

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [selectedDays, setSelectedDays] = useState([]);

    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSave = () => {
        if (!title.trim()) return alert("Please enter a title.");
        if (!time) return alert("Please select a time.");

        const repeat =
            selectedDays.length === 0
                ? "Once"
                : selectedDays.length === 7
                ? "Daily"
                : selectedDays.join(", ");

        const reminder = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            time,
            repeat,
            days: selectedDays,
        };

        if (typeof addReminder === "function") addReminder(reminder);
        setTitle("");
        setDescription("");
        setTime("");
        setSelectedDays([]);
        navigate("/myreminders")
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
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

            <label>Description</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
                style={{ width: "100%", padding: "10px 12px", marginBottom: 20, borderRadius: 8, border: "1px solid #1e293b", backgroundColor: "#0f172a", color: "#e5e7eb", resize: "none", overflowY: "auto" }}
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

            <div className="actions">
                <button
                    className="save-btn"
                    onClick={() => {
                        handleSave();
                    }}
                >
                    Save
                </button>
                <button className="cancel-btn" onClick={() => navigate("/myreminders")}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default AddReminder;
