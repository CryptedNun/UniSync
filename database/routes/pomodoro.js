const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

const FILE = path.join(__dirname, '..', 'data', 'pomodoro.json')
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json')

function readFile() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8') || '[]') } catch (e) { return [] }
}

function writeFile(data) { fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8') }

function getUserFromToken(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/, '')
  if (!token) return null
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]')
  return users.find(u => u.token === token) || null
}

function todayDate() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

// GET today's pomodoro total for current user
router.get('/', (req, res) => {
  const user = getUserFromToken(req)
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' })
  const all = readFile()
  const today = todayDate()
  const rec = all.find(r => r.username === user.username && r.roll === user.roll && r.date === today)
  res.json({ date: today, totalSeconds: rec ? rec.totalSeconds : 0 })
})

// POST add seconds to today's total: { seconds: 1 }
router.post('/add', (req, res) => {
  const user = getUserFromToken(req)
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' })
  const { seconds } = req.body || {}
  const add = Number(seconds) || 0
  if (add <= 0) return res.status(400).json({ error: 'INVALID' })

  const all = readFile()
  const today = todayDate()
  let rec = all.find(r => r.username === user.username && r.roll === user.roll && r.date === today)
  if (!rec) {
    rec = { username: user.username, roll: user.roll, date: today, totalSeconds: 0 }
    all.unshift(rec)
  }
  rec.totalSeconds = (rec.totalSeconds || 0) + add
  writeFile(all)
  res.json({ date: today, totalSeconds: rec.totalSeconds })
})

module.exports = router
