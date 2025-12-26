const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express.Router()

const DATA_FILE = path.join(__dirname, "..", "data", "reminders.json")
const USERS_FILE = path.join(__dirname, "..", "data", "users.json")
const NOTIFICATIONS_FILE = path.join(__dirname, "..", "data", "notifications.json")

// Helper function to convert 24-hour format to 12-hour format with AM/PM
function convertTo12HourFormat(time24) {
	if (!time24) return time24
	const [hours, minutes] = time24.split(':')
	let hour = parseInt(hours)
	const ampm = hour >= 12 ? 'PM' : 'AM'
	hour = hour % 12
	hour = hour ? hour : 12 // 0 becomes 12
	return `${String(hour).padStart(2, '0')}:${minutes} ${ampm}`
}

function readNotifications() {
	try {
		const raw = fs.readFileSync(NOTIFICATIONS_FILE, "utf8")
		return JSON.parse(raw || "[]")
	} catch {
    	return []
	}
}

function writeNotifications(data) {
	fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(data, null, 2), "utf8")
}

function buildNotification(reminder, user) {
  return {
    id: Date.now().toString(), // replace with uuid later
    reminderId: reminder.id,
    user: user.username,
    title: reminder.title,
    fireAt: convertTo12HourFormat(reminder.time), // later convert to full datetime
    read: false,
    createdAt: new Date().toISOString()
  }
}



function readData() {
	try {
		const raw = fs.readFileSync(DATA_FILE, "utf8")
		return JSON.parse(raw || "[]")
	} catch (e) {
		return []
	}
}

function writeData(data) {
	fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8")
}

function readUsers() {
	try {
		const raw = fs.readFileSync(USERS_FILE, "utf8")
		return JSON.parse(raw || "[]")
	} catch (e) {
		return []
	}
}

function getUserFromToken(req) {
	const auth = req.headers.authorization || ""
	const token = auth.replace(/^Bearer\s+/, "")
	if (!token) return null
	const users = readUsers()
	return users.find((u) => u.token === token) || null
}

// GET / -> return reminders for the authenticated user
router.get("/", (req, res) => {
	const user = getUserFromToken(req)
	if (!user) return res.status(401).json([])
	const reminders = readData().filter((r) => r.user === user.username)
	res.json(reminders)
})

// POST / -> add reminder for authenticated user
router.post("/", (req, res) => {
	const user = getUserFromToken(req)
	if (!user) return res.status(401).json({ error: "Unauthorized" })
	const reminder = req.body
	if (!reminder || !reminder.id || !reminder.title || !reminder.time) {
		return res.status(400).json({ error: "Invalid reminder data" })
	}
	const reminders = readData()
	const toSave = Object.assign({}, reminder, { user: user.username })
	reminders.push(toSave)
	writeData(reminders)

	
	const notifications = readNotifications()
	const notification = buildNotification(toSave, user)
	notifications.push(notification)
	writeNotifications(notifications)

	res.status(201).json({
		reminder: toSave,
		notification
	})
})

// DELETE /:id -> delete reminder if owned by authenticated user
router.delete("/:id", (req, res) => {
	const user = getUserFromToken(req)
	if (!user) return res.status(401).json({ error: "Unauthorized" })
	const id = req.params.id
	let reminders = readData()
	const initialLen = reminders.length
	reminders = reminders.filter((r) => !(String(r.id) === String(id) && r.user === user.username))
	if (reminders.length === initialLen) return res.status(404).json({ error: "Not found" })
	writeData(reminders)
	res.json({ success: true })
})

module.exports = router
