import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../api/axios"

const ROLES = ["BUYER", "SELLER", "AGENT", "LEGAL_OFFICER", "ZONAL_LEADER", "CEO", "ADMIN"]

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "BUYER", phone: "", zone: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      setError("Name, email, password and role are required")
      return
    }
    try {
      setLoading(true)
      setError("")
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone || undefined,
        zone: form.zone || undefined
      })
      alert("Registration successful! Please login.")
      navigate("/")
    } catch (error) {
      setError(error?.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-2 text-center text-blue-800">Create Account</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Join RealEstate CRM</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>
        )}

        <input name="name" className="w-full border p-3 mb-3 rounded text-sm" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <input name="email" className="w-full border p-3 mb-3 rounded text-sm" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" className="w-full border p-3 mb-3 rounded text-sm" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} />
        <input type="password" name="password" className="w-full border p-3 mb-3 rounded text-sm" placeholder="Password" value={form.password} onChange={handleChange} />

        <select name="role" className="w-full border p-3 mb-3 rounded text-sm" value={form.role} onChange={handleChange}>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        {["AGENT", "ZONAL_LEADER", "CEO"].includes(form.role) && (
          <input name="zone" className="w-full border p-3 mb-3 rounded text-sm" placeholder="Zone (e.g. Bangalore North)" value={form.zone} onChange={handleChange} />
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-700 text-white p-3 rounded hover:bg-blue-800 text-sm font-semibold"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register