const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

const REQUESTS_FILE = path.join(__dirname, '..', 'data', 'requests.json')
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json')
const TEAMS_FILE = path.join(__dirname, '..', 'data', 'teams.json')

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

function sanitizeRequest(r, username) {
  return {
    id: r.id,
    owner: r.owner,
    caption: r.caption,
    description: r.description,
    max_participants: r.max_participants,
    participants_count: (r.participants || []).length,
    completed: !!r.completed,
    joined: username ? !!(r.participants || []).some(p => p.user_id === username) : false,
    isOwner: username ? r.owner === username : false,
  }
}

// list requests
router.get('/', (req, res) => {
  const requests = readJSON(REQUESTS_FILE)
  const user = getUserFromToken(req)
  const username = user ? user.username : null
  const out = requests.map(r => sanitizeRequest(r, username))
  res.json(out)
})

// create request
router.post('/', (req, res) => {
  const user = getUserFromToken(req)
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' })
  const { caption, description, max_participants } = req.body || {}
  if (!caption) return res.status(400).json({ error: 'MISSING_CAPTION' })
  const requests = readJSON(REQUESTS_FILE)
  const id = Date.now()
  const reqObj = { id, owner: user.username, caption, description: description || '', max_participants: Number(max_participants) || 1, participants: [], completed: false }
  requests.unshift(reqObj)
  writeJSON(REQUESTS_FILE, requests)
  res.json(sanitizeRequest(reqObj, user.username))
})

// join
router.post('/:id/join', (req, res) => {
  const user = getUserFromToken(req)
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' })
  const id = Number(req.params.id)
  const requests = readJSON(REQUESTS_FILE)
  const idx = requests.findIndex(r => r.id === id)
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND' })
  const r = requests[idx]
  if (r.completed) return res.status(400).json({ error: 'COMPLETED' })
  const already = (r.participants || []).some(p => p.user_id === user.username)
  if (already) return res.json(sanitizeRequest(r, user.username))
  if ((r.participants || []).length >= r.max_participants) return res.status(400).json({ error: 'FULL' })
  r.participants = [...(r.participants || []), { user_id: user.username }]
  requests[idx] = r
  writeJSON(REQUESTS_FILE, requests)
  res.json(sanitizeRequest(r, user.username))
})

// leave
router.post('/:id/leave', (req, res) => {
  const user = getUserFromToken(req)
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' })
  const id = Number(req.params.id)
  const requests = readJSON(REQUESTS_FILE)
  const idx = requests.findIndex(r => r.id === id)
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND' })
  const r = requests[idx]
  r.participants = (r.participants || []).filter(p => p.user_id !== user.username)
  requests[idx] = r
  writeJSON(REQUESTS_FILE, requests)
  res.json(sanitizeRequest(r, user.username))
})

// delete (owner only)
router.delete('/:id', (req, res) => {
  const user = getUserFromToken(req)
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' })
  const id = Number(req.params.id)
  let requests = readJSON(REQUESTS_FILE)
  const idx = requests.findIndex(r => r.id === id)
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND' })
  if (requests[idx].owner !== user.username) return res.status(403).json({ error: 'FORBIDDEN' })
  requests.splice(idx, 1)
  writeJSON(REQUESTS_FILE, requests)
  res.json({ ok: true })
})

// complete (owner) -> create team
router.post('/:id/complete', (req, res) => {
  const user = getUserFromToken(req)
  if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' })
  const id = Number(req.params.id)
  const requests = readJSON(REQUESTS_FILE)
  const idx = requests.findIndex(r => r.id === id)
  if (idx === -1) return res.status(404).json({ error: 'NOT_FOUND' })
  const r = requests[idx]
  if (r.owner !== user.username) return res.status(403).json({ error: 'FORBIDDEN' })
  // mark completed
  r.completed = true
  requests[idx] = r
  writeJSON(REQUESTS_FILE, requests)

  // create a team with members from participants + owner
  const teams = readJSON(TEAMS_FILE)
  const members = Array.from(new Set([...(r.participants || []).map(p => p.user_id), r.owner]))
  const team = { id: Date.now(), name: r.caption, members, requestId: r.id }
  teams.push(team)
  writeJSON(TEAMS_FILE, teams)

  res.json({ ok: true, team })
})

module.exports = router
