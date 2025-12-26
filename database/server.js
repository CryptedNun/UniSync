const express = require("express")
const cors = require("cors")
const path = require("path")
const app = express()

const PORT = 3000

app.use(cors())
app.use(express.json())

// Mount reminders route
const remindersRoute = require(path.join(__dirname, "routes", "reminders"))
app.use("/api/reminders", remindersRoute)

// Mount auth route
const authRoute = require(path.join(__dirname, "routes", "auth"))
app.use("/api/auth", authRoute)

// Mount requests and teams routes
const requestsRoute = require(path.join(__dirname, "routes", "requests"))
app.use("/api/requests", requestsRoute)
const teamsRoute = require(path.join(__dirname, "routes", "teams"))
app.use("/api/teams", teamsRoute)

app.listen(PORT, () => {
	console.log(`Database server running on http://localhost:${PORT}`)
})