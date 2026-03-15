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
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Leads</h2>

        {loading ? (
          <p className="text-gray-500">Loading leads...</p>
        ) : leads.length === 0 ? (
          <p className="text-gray-500">No leads found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
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
                        <select
                          className="border rounded p-1 text-xs"
                          value={l.status}
                          onChange={(e) => updateStatus(l.id, e.target.value)}
                        >
                          {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Leads