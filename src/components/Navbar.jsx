import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem("role")
  const name = localStorage.getItem("name")
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors block ${
        isActive(to)
          ? "bg-white text-blue-800 font-semibold"
          : "text-blue-100 hover:bg-blue-700 hover:text-white"
      }`}
    >
      {label}
    </Link>
  )

  const roleColor = (role) => {
    const colors = {
      CEO: "bg-purple-500",
      ADMIN: "bg-gray-500",
      ZONAL_LEADER: "bg-blue-400",
      AGENT: "bg-green-500",
      LEGAL_OFFICER: "bg-yellow-500",
      BUYER: "bg-cyan-500",
      SELLER: "bg-orange-500"
    }
    return colors[role] || "bg-gray-500"
  }

  return (
    <nav className="bg-blue-900 shadow-lg">
      <div className="w-full px-4 py-3">

        {/* Top Row */}
        <div className="flex items-center justify-between">

          {/* LEFT — Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => { navigate("/dashboard"); setMenuOpen(false) }}
          >
            <div className="bg-white text-blue-900 font-black text-lg w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
              R
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">RealEstate CRM</p>
              <p className="text-blue-300 text-xs leading-tight">Karnataka</p>
            </div>
          </div>

          {/* Desktop Nav Links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            {navLink("/dashboard", "Dashboard")}
            {navLink("/properties", "Properties")}
            {["CEO", "ADMIN", "AGENT", "ZONAL_LEADER"].includes(role) && navLink("/leads", "Leads")}
            {["CEO", "ADMIN", "AGENT", "BUYER"].includes(role) && navLink("/site-visits", "Site Visits")}
            {["LEGAL_OFFICER", "CEO", "ADMIN"].includes(role) && navLink("/legal", "Legal")}
            {["CEO", "ADMIN"].includes(role) && navLink("/users", "Users")}
            {navLink("/farming", "🌱 Farming")}
          </div>

          {/* Desktop User + Logout — hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${roleColor(role)}`}>
                {name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">{name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${roleColor(role)}`}>
                  {role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg font-medium"
            >
              Logout
            </button>
          </div>

          {/* Hamburger — visible on mobile only */}
          <button
            className="md:hidden text-white text-2xl focus:outline-none flex-shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 border-t border-blue-700 pt-3">

            {/* User Info */}
            <div className="flex items-center gap-2 px-2 py-2 mb-3 bg-blue-800 rounded-lg">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${roleColor(role)}`}>
                {name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${roleColor(role)}`}>
                  {role}
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="space-y-1">
              {navLink("/dashboard", "🏠 Dashboard")}
              {navLink("/properties", "🏘️ Properties")}
              {["CEO", "ADMIN", "AGENT", "ZONAL_LEADER"].includes(role) && navLink("/leads", "📋 Leads")}
              {["CEO", "ADMIN", "AGENT", "BUYER"].includes(role) && navLink("/site-visits", "📅 Site Visits")}
              {["LEGAL_OFFICER", "CEO", "ADMIN"].includes(role) && navLink("/legal", "⚖️ Legal")}
              {["CEO", "ADMIN"].includes(role) && navLink("/users", "👥 Users")}
              {navLink("/farming", "🌱 Farming")}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full mt-3 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar