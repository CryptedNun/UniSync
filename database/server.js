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

app.listen(PORT, () => {
	console.log(`Database server running on http://localhost:${PORT}`)
})