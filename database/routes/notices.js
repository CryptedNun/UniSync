const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express.Router()

const FILE = path.join(__dirname, "..", "data", "notices.json")
const USERS_FILE = path.join(__dirname, "..", "data", "users.json")
const NOTIFS_FILE = path.join(__dirname, "..", "data", "notifications.json")

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8") || "[]")
  } catch {
    return []
  }
}

function writeFile(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

function getUserFromToken(req) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/, "")
  if (!token) return null
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8") || "[]")
  return users.find((u) => u.token === token) || null
}

// GET all notices (public)
router.get("/", (req, res) => {
  const notices = readFile()
  res.json(notices)
})

// POST a new notice (requires auth)
router.post("/", (req, res) => {
  const user = getUserFromToken(req)
  if (!user) return res.status(401).json({ error: "Unauthorized" })
  if (!user.canAddNotices) return res.status(403).json({ error: "FORBIDDEN" })
  const { caption, description } = req.body || {}
  if (!caption) return res.status(400).json({ error: "MISSING" })
  const notices = readFile()
  const notice = {
    id: Date.now().toString(),
    caption,
    description: description || "",
    author: user.username,
    createdAt: new Date().toISOString()
  }
  notices.unshift(notice)
  writeFile(notices)
  // create notification for every user
  try {
    const notifs = JSON.parse(fs.readFileSync(NOTIFS_FILE, "utf8") || "[]")
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8") || "[]")
    const now = new Date().toISOString()
    users.forEach((u) => {
      notifs.unshift({
        id: Date.now().toString() + Math.floor(Math.random() * 10000),
        user: u.username,
        title: `New notice: ${notice.caption}`,
        message: notice.description || "",
        read: false,
        createdAt: now,
      })
    })
    fs.writeFileSync(NOTIFS_FILE, JSON.stringify(notifs, null, 2), "utf8")
  } catch (e) {
    // ignore notification write errors
  }
  res.json(notice)
})

module.exports = router
