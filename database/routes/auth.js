const express = require("express")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const router = express.Router()

const USERS_FILE = path.join(__dirname, "..", "data", "users.json")

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8")
    return JSON.parse(raw || "[]")
  } catch (e) {
    return []
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8")
}

function genToken() {
  return crypto.randomBytes(24).toString("hex")
}

// Signup: expects { username, password, roll }
router.post("/signup", (req, res) => {
  const { username, password, roll } = req.body || {}
  if (!username || !password || !roll) return res.status(400).json({ error: "MISSING" })
  const users = readUsers()
  if (users.find((u) => u.username === username)) return res.status(400).json({ error: "USERNAME_TAKEN" })
  const token = genToken()
  users.push({ username, password, roll, token })
  writeUsers(users)
  res.json({ username, roll, token })
})

// Signin: expects { username, password, roll }
router.post("/signin", (req, res) => {
  const { username, password, roll } = req.body || {}
  if (!username || !password || !roll) return res.status(400).json({ error: "WRONG INFO" })
  const users = readUsers()
  const user = users.find((u) => u.username === username)
  if (!user || user.password !== password || user.roll !== roll) return res.status(400).json({ error: "WRONG INFO" })
  // generate a new token for this session
  user.token = genToken()
  writeUsers(users)
  res.json({ username: user.username, roll: user.roll, token: user.token })
})

// simple helper to get user from token
router.get("/whoami", (req, res) => {
  const auth = req.headers.authorization || ""
  const token = auth.replace(/^Bearer\s+/, "")
  if (!token) return res.json({ username: null })
  const users = readUsers()
  const user = users.find((u) => u.token === token)
  if (!user) return res.json({ username: null })
  res.json({ username: user.username, roll: user.roll })
})

module.exports = router
