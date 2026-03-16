import { useEffect, useState } from "react"
import API from "../api/axios"
import Navbar from "../components/Navbar"

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await API.get("/users")
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/users/${id}/status`, { status })
      fetchUsers()
    } catch (err) {
      alert("Failed to update user status")
    }
  }

  const roleColor = (role) => {
    const colors = { CEO: "bg-purple-100 text-purple-700", ADMIN: "bg-gray-100 text-gray-700", ZONAL_LEADER: "bg-blue-100 text-blue-700", AGENT: "bg-green-100 text-green-700", LEGAL_OFFICER: "bg-yellow-100 text-yellow-700", BUYER: "bg-cyan-100 text-cyan-700", SELLER: "bg-orange-100 text-orange-700" }
    return colors[role] || "bg-gray-100"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-6">User Management</h2>

        {loading ? <p className="text-gray-500">Loading users...</p> : (
          <>
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
              {users.map((u) => (
                <div key={u.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-gray-800">{u.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${roleColor(u.role)}`}>{u.role}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">📧 {u.email}</p>
                  <p className="text-xs text-gray-500 mb-1">📞 {u.phone || "—"}</p>
                  <p className="text-xs text-gray-500 mb-2">📍 {u.zone || "—"}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${u.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {u.status}
                    </span>
                    <button
                      onClick={() => updateStatus(u.id, u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                      className={`text-xs px-3 py-1 rounded ${u.status === "ACTIVE" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                    >
                      {u.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Zone</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.phone || "—"}</td>
                      <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${roleColor(u.role)}`}>{u.role}</span></td>
                      <td className="p-3">{u.zone || "—"}</td>
                      <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${u.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{u.status}</span></td>
                      <td className="p-3">
                        <button onClick={() => updateStatus(u.id, u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")} className={`text-xs px-3 py-1 rounded ${u.status === "ACTIVE" ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"}`}>
                          {u.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Users