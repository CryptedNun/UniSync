const express = require("express");
const cors = require("cors");
const cron = require('node-cron');
const fs = require('fs');
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- PATH DEFINITIONS ---
const REMINDERS_FILE = path.join(__dirname, "data", "reminders.json");
const NOTIFICATIONS_FILE = path.join(__dirname, "data", "notifications.json");

// Helper function to safely read JSON
const readJSON = (file) => {
    try {
        if (!fs.existsSync(file)) return [];
        return JSON.parse(fs.readFileSync(file, 'utf8') || "[]");
    } catch (err) {
        return [];
    }
};

// --- SCHEDULER (BACKGROUND TASK) ---
// This runs every minute to check if any reminders need to trigger a notification
cron.schedule('* * * * *', () => {
    const now = new Date();
    const currentDay = now.toLocaleString('en-US', { weekday: 'short' }); // e.g., "Mon"
    const currentTime = now.toTimeString().slice(0, 5); // e.g., "14:30"
    const todayDate = now.toDateString(); // e.g., "Fri Dec 26 2025"

	console.log(currentTime)
    let reminders = readJSON(REMINDERS_FILE);
    let notifications = readJSON(NOTIFICATIONS_FILE);
    let hasChanged = false;

    reminders.forEach(reminder => {
		const now = new Date();
		const currentDay = now.toLocaleString('en-US', { weekday: 'short' }); 
		const currentTime = now.toTimeString().slice(0, 5); 
		const todayDate = now.toDateString(); 

		// 1. Check if the day matches OR if it's a "Once" reminder (empty days array)
		// If days is empty, we assume it's meant for the day it was created.
		const isToday = reminder.days.length === 0 || reminder.days.includes(currentDay);
		
		const isTime = reminder.time === currentTime;
		const notFiredYet = reminder.lastRun !== todayDate;

		console.log(`Checking [${reminder.title}]: DayMatch: ${isToday}, TimeMatch: ${isTime}, NotFired: ${notFiredYet}`);

		if (isToday && isTime && notFiredYet) {
			console.log(`✅ TRIGGERING: ${reminder.title}`);
			
			const newNotification = {
				id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
				user: reminder.user,
				title: reminder.title,
				message: reminder.description || `It is time for ${reminder.title}`,
				time: currentTime,
				read: false,
				createdAt: new Date().toISOString()
			};

			notifications.push(newNotification);
			reminder.lastRun = todayDate;
			hasChanged = true;
		}
	});

    if (hasChanged) {
        fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
        fs.writeFileSync(REMINDERS_FILE, JSON.stringify(reminders, null, 2));
    }
});

// --- ROUTES ---
const remindersRoute = require(path.join(__dirname, "routes", "reminders"));
const notificationsRoute = require(path.join(__dirname, "routes", "notifications"));
const authRoute = require(path.join(__dirname, "routes", "auth"));
const requestsRoute = require(path.join(__dirname, "routes", "requests"));
const teamsRoute = require(path.join(__dirname, "routes", "teams"));

app.use("/api/reminders", remindersRoute);
app.use("/api/notifications", notificationsRoute);
app.use("/api/auth", authRoute);
app.use("/api/requests", requestsRoute);
app.use("/api/teams", teamsRoute);

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});