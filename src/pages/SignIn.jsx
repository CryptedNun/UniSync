import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SignIn({ signIn, signUp }) {
  const [mode, setMode] = useState("signin")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [roll, setRoll] = useState("")
  const navigate = useNavigate()

  const submit = async () => {
    if (!username || !password || !roll) return alert("Enter username, password and roll")
    const fn = mode === "signin" ? signIn : signUp
    const res = await fn(username, password, roll)
    if (res.ok) {
      navigate("/myreminders")
    } else {
      alert(res.error && res.error.error ? res.error.error : "WRONG INFO")
    }
  }

  return (
    <div className="add-page">
      <h1>{mode === "signin" ? "Sign In" : "Sign Up"}</h1>

      <label>Username</label>
      <input type = "text" value={username} onChange={(e) => setUsername(e.target.value)} />

      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <label>Roll</label>
      <input type="text" value={roll} onChange={(e) => setRoll(e.target.value)} />

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="save-btn" onClick={submit}>{mode === "signin" ? "Sign In" : "Sign Up"}</button>
        <button className="add-btn" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "Switch to Sign Up" : "Switch to Sign In"}</button>
      </div>
    </div>
  )
}

export default SignIn
