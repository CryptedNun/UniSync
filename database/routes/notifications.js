const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express.Router()

const FILE = path.join(__dirname, "..", "data", "notifications.json")
const USERS_FILE = path.join(__dirname, "..", "data", "users.json")

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

// GET notifications for user
router.get("/", (req, res) => {
  const user = getUserFromToken(req)
  if (!user) return res.status(401).json([])
  const notifs = readFile().filter(n => n.user === user.username && !n.read)
  res.json(notifs)
})

// MARK AS READ
router.patch("/:id/read", (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const notifications = readFile();
  // Ensure both are treated as strings
  const notif = notifications.find(
    (n) => n.id.toString() === req.params.id.toString() && n.user === user.username
  );

  if (!notif) return res.status(404).json({ error: "Not found" });

  notif.read = true;
  writeFile(notifications);
  res.json({ success: true });
});

// DELETE
router.delete("/:id", (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  let notifications = readFile();
  // Filter out the one to delete
  const updated = notifications.filter(
    (n) => !(n.id.toString() === req.params.id.toString() && n.user === user.username)
  );

  writeFile(updated);
  res.json({ success: true });
});

module.exports = router
