const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Routes
const remindersRoute = require(path.join(__dirname, "routes", "reminders"))
const notificationsRoute = require(path.join(__dirname, "routes", "notifications"))
const authRoute = require(path.join(__dirname, "routes", "auth"))

app.use("/api/reminders", remindersRoute)
app.use("/api/notifications", notificationsRoute)
app.use("/api/auth", authRoute)

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
