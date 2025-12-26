const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

const TEAMS_FILE = path.join(__dirname, '..', 'data', 'teams.json')
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json')

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8') || '[]') } catch (e) { return [] }
}
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8') }

function getUserFromToken(req) {
  const auth = req.headers.authorization || ''
  const token = auth.replace(/^Bearer\s+/, '')
  if (!token) return null
  const users = readJSON(USERS_FILE)
  return users.find(u => u.token === token) || null
}

router.get('/', (req, res) => {
  const user = getUserFromToken(req)
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' })
  const teams = readJSON(TEAMS_FILE)
  const my = teams.filter(t => (t.members || []).includes(user.username))
  res.json(my)
})

module.exports = router
