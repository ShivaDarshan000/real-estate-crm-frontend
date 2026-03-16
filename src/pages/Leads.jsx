import { useEffect, useState } from "react"
import API from "../api/axios"
import Navbar from "../components/Navbar"

const LEAD_STATUSES = ["NEW", "VISIT_SCHEDULED", "NEGOTIATION", "CLOSED"]

function Leads() {
  const role = localStorage.getItem("role")
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const res = await API.get("/leads")
      setLeads(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeads() }, [])

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/leads/${id}`, { status })
      fetchLeads()
    } catch (err) {
      alert("Failed to update lead status")
    }
  }

  const statusColor = (status) => {
    const colors = { NEW: "bg-blue-100 text-blue-700", VISIT_SCHEDULED: "bg-yellow-100 text-yellow-700", NEGOTIATION: "bg-orange-100 text-orange-700", CLOSED: "bg-green-100 text-green-700" }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-6">Leads</h2>

        {loading ? (
          <p className="text-gray-500">Loading leads...</p>
        ) : leads.length === 0 ? (
          <p className="text-gray-500">No leads found.</p>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
              {leads.map((l) => (
                <div key={l.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-gray-800 text-sm">{l.property?.title || "—"}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(l.status)}`}>{l.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">👤 Buyer: {l.buyer?.name || "—"}</p>
                  <p className="text-xs text-gray-500 mb-1">🧑‍💼 Agent: {l.agent?.name || "—"}</p>
                  <p className="text-xs text-gray-500 mb-1">📍 Zone: {l.zone || "—"}</p>
                  <p className="text-xs text-gray-500 mb-2">📢 Source: {l.source}</p>
                  {["AGENT", "CEO", "ADMIN", "ZONAL_LEADER"].includes(role) && (
                    <select
                      className="w-full border rounded p-2 text-xs"
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                    >
                      {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full text-sm">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="p-3 text-left">Property</th>
                    <th className="p-3 text-left">Buyer</th>
                    <th className="p-3 text-left">Agent</th>
                    <th className="p-3 text-left">Source</th>
                    <th className="p-3 text-left">Zone</th>
                    <th className="p-3 text-left">Status</th>
                    {["AGENT", "CEO", "ADMIN", "ZONAL_LEADER"].includes(role) && <th className="p-3 text-left">Update</th>}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{l.property?.title || "—"}</td>
                      <td className="p-3">{l.buyer?.name || "—"}</td>
                      <td className="p-3">{l.agent?.name || "—"}</td>
                      <td className="p-3">{l.source}</td>
                      <td className="p-3">{l.zone || "—"}</td>
                      <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(l.status)}`}>{l.status}</span></td>
                      {["AGENT", "CEO", "ADMIN", "ZONAL_LEADER"].includes(role) && (
                        <td className="p-3">
                          <select className="border rounded p-1 text-xs" value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)}>
                            {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                      )}
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

export default Leads