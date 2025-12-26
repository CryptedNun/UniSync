const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express.Router()

const DATA_FILE = path.join(__dirname, "..", "data", "reminders.json")

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

router.get("/", (req, res) => {
	const reminders = readData()
	res.json(reminders)
})

router.post("/", (req, res) => {
	const reminder = req.body
	if (!reminder || !reminder.id || !reminder.title || !reminder.time) {
		return res.status(400).json({ error: "Invalid reminder data" })
	}
	const reminders = readData()
	reminders.push(reminder)
	writeData(reminders)
	res.status(201).json(reminder)
})

router.delete("/:id", (req, res) => {
	const id = req.params.id
	let reminders = readData()
	const initialLen = reminders.length
	reminders = reminders.filter((r) => String(r.id) !== String(id))
	if (reminders.length === initialLen) return res.status(404).json({ error: "Not found" })
	writeData(reminders)
	res.json({ success: true })
})

module.exports = router
