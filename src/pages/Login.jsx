import { useState } from "react"
import API from "../api/axios"
import { useNavigate, Link } from "react-router-dom"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required")
      return
    }
    try {
      setLoading(true)
      setError("")
      const res = await API.post("/auth/login", { email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.user.role)
      localStorage.setItem("name", res.data.user.name)
      localStorage.setItem("userId", res.data.user.id)
      localStorage.setItem("zone", res.data.user.zone || "")
      navigate("/dashboard")
    } catch (error) {
      setError(error?.response?.data?.message || "Login failed. Check email or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-2 text-center text-blue-800">RealEstate CRM</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Sign in to your account</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>
        )}

        <input
          className="w-full border p-3 mb-4 rounded text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 mb-4 rounded text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-700 text-white p-3 rounded hover:bg-blue-800 text-sm font-semibold"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login