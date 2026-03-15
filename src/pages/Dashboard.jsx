import { useEffect, useState } from "react"
import API from "../api/axios"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const role = localStorage.getItem("role")
  const name = localStorage.getItem("name")
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (role === "CEO" || role === "ADMIN") {
          const res = await API.get("/dashboard/ceo")
          setStats(res.data)
        } else if (role === "ZONAL_LEADER") {
          const res = await API.get("/dashboard/zonal")
          setStats(res.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [role])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8">

        {/* Welcome Header */}
        <div className="bg-blue-800 text-white rounded-xl p-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {name}! 👋</h1>
            <p className="text-blue-200 text-sm">Role: {role} — Real Estate CRM Platform</p>
          </div>
          <div className="text-right text-blue-200 text-sm">
            <p>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-10 text-gray-400">Loading dashboard...</div>
        )}

        {/* CEO / ADMIN Dashboard */}
        {(role === "CEO" || role === "ADMIN") && stats && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Properties" value={stats.summary.totalProperties} color="blue" icon="🏠" />
              <StatCard label="Total Leads" value={stats.summary.totalLeads} color="green" icon="📋" />
              <StatCard label="Total Users" value={stats.summary.totalUsers} color="purple" icon="👥" />
              <StatCard label="Active Agents" value={stats.summary.activeAgents} color="yellow" icon="🧑‍💼" />
              <StatCard label="Verified Properties" value={stats.summary.verifiedProperties} color="green" icon="✅" />
              <StatCard label="Pending Verification" value={stats.summary.pendingProperties} color="orange" icon="⏳" />
              <StatCard label="Closed Deals" value={stats.summary.closedLeads} color="blue" icon="🤝" />
              <StatCard label="Farm Plots" value={stats.summary.totalFarmPlots} color="green" icon="🌱" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Properties by Type */}
              <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  🏠 Properties by Type
                </h3>
                {stats.propertiesByType.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {stats.propertiesByType.map((p) => {
                      const total = stats.summary.totalProperties || 1
                      const pct = Math.round((p._count.type / total) * 100)
                      const colors = { RESIDENTIAL: "bg-blue-500", VILLA: "bg-purple-500", COMMERCIAL: "bg-yellow-500", FARMLAND: "bg-green-500" }
                      return (
                        <div key={p.type}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{p.type}</span>
                            <span className="font-semibold">{p._count.type}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className={`${colors[p.type] || "bg-blue-500"} h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Leads by Status */}
              <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  📋 Leads by Status
                </h3>
                {stats.leadsByStatus.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {stats.leadsByStatus.map((l) => {
                      const total = stats.summary.totalLeads || 1
                      const pct = Math.round((l._count.status / total) * 100)
                      const colors = { NEW: "bg-blue-400", VISIT_SCHEDULED: "bg-yellow-400", NEGOTIATION: "bg-orange-400", CLOSED: "bg-green-500" }
                      return (
                        <div key={l.status}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{l.status}</span>
                            <span className="font-semibold">{l._count.status}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className={`${colors[l.status] || "bg-blue-400"} h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Properties by District */}
              <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  📍 Properties by District
                </h3>
                {stats.propertiesByZone.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet</p>
                ) : (
                  <div className="space-y-2">
                    {stats.propertiesByZone.map((z) => (
                      <div key={z.district} className="flex justify-between items-center py-2 border-b text-sm last:border-0">
                        <span className="text-gray-600">📍 {z.district}</span>
                        <span className="font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{z._count.district}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-4">⚡ Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => navigate("/properties")} className="bg-blue-50 border border-blue-200 text-blue-700 py-3 rounded-lg text-sm font-semibold hover:bg-blue-100">🏠 Properties</button>
                <button onClick={() => navigate("/leads")} className="bg-green-50 border border-green-200 text-green-700 py-3 rounded-lg text-sm font-semibold hover:bg-green-100">📋 Leads</button>
                <button onClick={() => navigate("/users")} className="bg-purple-50 border border-purple-200 text-purple-700 py-3 rounded-lg text-sm font-semibold hover:bg-purple-100">👥 Users</button>
                <button onClick={() => navigate("/farming")} className="bg-green-50 border border-green-200 text-green-700 py-3 rounded-lg text-sm font-semibold hover:bg-green-100">🌱 Farming</button>
              </div>
            </div>
          </>
        )}

        {/* ZONAL LEADER Dashboard */}
        {role === "ZONAL_LEADER" && stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Zone" value={stats.zone} color="blue" icon="📍" />
              <StatCard label="Agents in Zone" value={stats.agents} color="green" icon="🧑‍💼" />
              <StatCard label="Total Leads" value={stats.leads} color="purple" icon="📋" />
              <StatCard label="Properties" value={stats.properties} color="yellow" icon="🏠" />
            </div>

            <div className="bg-white p-5 rounded-xl shadow mb-6">
              <h3 className="font-bold text-gray-700 mb-4">📋 Leads by Status</h3>
              {stats.leadsByStatus.length === 0 ? (
                <p className="text-gray-400 text-sm">No leads in this zone yet</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {stats.leadsByStatus.map((l) => (
                    <div key={l.status} className="bg-gray-50 border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-700">{l._count.status}</p>
                      <p className="text-xs text-gray-500 mt-1">{l.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-4">⚡ Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button onClick={() => navigate("/properties")} className="bg-blue-50 border border-blue-200 text-blue-700 py-3 rounded-lg text-sm font-semibold hover:bg-blue-100">🏠 Properties</button>
                <button onClick={() => navigate("/leads")} className="bg-green-50 border border-green-200 text-green-700 py-3 rounded-lg text-sm font-semibold hover:bg-green-100">📋 Leads</button>
                <button onClick={() => navigate("/farming")} className="bg-green-50 border border-green-200 text-green-700 py-3 rounded-lg text-sm font-semibold hover:bg-green-100">🌱 Farming</button>
              </div>
            </div>
          </>
        )}

        {/* AGENT Dashboard */}
        {role === "AGENT" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div onClick={() => navigate("/leads")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-blue-300">
                <p className="text-3xl mb-2">📋</p>
                <p className="font-bold text-gray-800">My Leads</p>
                <p className="text-sm text-gray-400 mt-1">View and manage your assigned leads</p>
              </div>
              <div onClick={() => navigate("/site-visits")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-green-300">
                <p className="text-3xl mb-2">📅</p>
                <p className="font-bold text-gray-800">Site Visits</p>
                <p className="text-sm text-gray-400 mt-1">Manage your scheduled visits</p>
              </div>
              <div onClick={() => navigate("/properties")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-purple-300">
                <p className="text-3xl mb-2">🏠</p>
                <p className="font-bold text-gray-800">Properties</p>
                <p className="text-sm text-gray-400 mt-1">Browse and manage listings</p>
              </div>
            </div>
          </>
        )}

        {/* BUYER Dashboard */}
        {role === "BUYER" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div onClick={() => navigate("/properties")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-blue-300">
              <p className="text-3xl mb-2">🏠</p>
              <p className="font-bold text-gray-800">Browse Properties</p>
              <p className="text-sm text-gray-400 mt-1">Find your dream property in Karnataka</p>
            </div>
            <div onClick={() => navigate("/site-visits")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-green-300">
              <p className="text-3xl mb-2">📅</p>
              <p className="font-bold text-gray-800">My Site Visits</p>
              <p className="text-sm text-gray-400 mt-1">Track your scheduled visits</p>
            </div>
            <div onClick={() => navigate("/farming")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-yellow-300">
              <p className="text-3xl mb-2">🌱</p>
              <p className="font-bold text-gray-800">Grow What You Eat</p>
              <p className="text-sm text-gray-400 mt-1">Explore managed farm plots</p>
            </div>
          </div>
        )}

        {/* SELLER Dashboard */}
        {role === "SELLER" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div onClick={() => navigate("/properties")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-blue-300">
              <p className="text-3xl mb-2">🏠</p>
              <p className="font-bold text-gray-800">My Properties</p>
              <p className="text-sm text-gray-400 mt-1">Manage your listed properties</p>
            </div>
            <div onClick={() => navigate("/properties")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-green-300">
              <p className="text-3xl mb-2">➕</p>
              <p className="font-bold text-gray-800">Add Property</p>
              <p className="text-sm text-gray-400 mt-1">List a new property for sale</p>
            </div>
            <div onClick={() => navigate("/farming")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-yellow-300">
              <p className="text-3xl mb-2">🌱</p>
              <p className="font-bold text-gray-800">Farming Projects</p>
              <p className="text-sm text-gray-400 mt-1">View managed farm plots</p>
            </div>
          </div>
        )}

        {/* LEGAL OFFICER Dashboard */}
        {role === "LEGAL_OFFICER" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div onClick={() => navigate("/legal")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-yellow-300">
              <p className="text-3xl mb-2">⚖️</p>
              <p className="font-bold text-gray-800">Legal Verification</p>
              <p className="text-sm text-gray-400 mt-1">Review and verify property documents</p>
            </div>
            <div onClick={() => navigate("/properties")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-blue-300">
              <p className="text-3xl mb-2">🏠</p>
              <p className="font-bold text-gray-800">All Properties</p>
              <p className="text-sm text-gray-400 mt-1">Browse all listed properties</p>
            </div>
            <div onClick={() => navigate("/legal")} className="bg-white p-6 rounded-xl shadow border border-gray-100 cursor-pointer hover:border-green-300">
              <p className="text-3xl mb-2">📜</p>
              <p className="font-bold text-gray-800">Verification History</p>
              <p className="text-sm text-gray-400 mt-1">View past verifications</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
  }
  return (
    <div className={`p-4 rounded-xl border ${colors[color] || colors.blue}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold mt-1">{value ?? "—"}</p>
    </div>
  )
}

export default Dashboard