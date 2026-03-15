import { useEffect, useState } from "react"
import API from "../api/axios"
import Navbar from "../components/Navbar"

function SiteVisits() {
  const role = localStorage.getItem("role")
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [properties, setProperties] = useState([])
  const [form, setForm] = useState({ propertyId: "", visitDate: "", notes: "" })
  const [submitting, setSubmitting] = useState(false)

  const fetchVisits = async () => {
    try {
      setLoading(true)
      const res = await API.get("/site-visits")
      setVisits(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisits()
    API.get("/properties").then(res => setProperties(res.data)).catch(() => {})
  }, [])

  const handleSchedule = async () => {
    if (!form.propertyId || !form.visitDate) {
      alert("Please select a property and visit date")
      return
    }
    try {
      setSubmitting(true)
      await API.post("/site-visits", form)
      alert("Site visit scheduled successfully!")
      setShowForm(false)
      setForm({ propertyId: "", visitDate: "", notes: "" })
      fetchVisits()
    } catch (err) {
      alert(err?.response?.data?.error || err?.response?.data?.message || "Failed to schedule visit")
    } finally {
      setSubmitting(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/site-visits/${id}/status`, { status })
      fetchVisits()
    } catch (err) {
      alert("Failed to update visit status")
    }
  }

  const statusColor = (status) => {
    const colors = {
      SCHEDULED: "bg-blue-100 text-blue-700",
      COMPLETED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700"
    }
    return colors[status] || "bg-gray-100"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Site Visits</h2>
          {role === "BUYER" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800"
            >
              {showForm ? "Cancel" : "+ Schedule Visit"}
            </button>
          )}
        </div>

        {/* Schedule Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="font-bold text-gray-700 mb-4">Schedule a Site Visit</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                className="border p-2 rounded text-sm"
                value={form.propertyId}
                onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
              >
                <option value="">Select Property</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.title} — {p.location}</option>
                ))}
              </select>
              <input
                type="datetime-local"
                className="border p-2 rounded text-sm"
                value={form.visitDate}
                onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
              />
              <input
                className="border p-2 rounded text-sm"
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              ℹ️ An agent will be automatically assigned to your visit.
            </p>
            <button
              onClick={handleSchedule}
              disabled={submitting}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded text-sm hover:bg-green-700"
            >
              {submitting ? "Scheduling..." : "Confirm Visit"}
            </button>
          </div>
        )}

        {/* Visits Table */}
        {loading ? (
          <p className="text-gray-500">Loading visits...</p>
        ) : visits.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <p className="text-gray-400 text-lg">📅 No site visits found.</p>
            {role === "BUYER" && (
              <p className="text-gray-400 text-sm mt-2">Click "+ Schedule Visit" to book one.</p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="p-3 text-left">Property</th>
                  <th className="p-3 text-left">Buyer</th>
                  <th className="p-3 text-left">Agent</th>
                  <th className="p-3 text-left">Visit Date</th>
                  <th className="p-3 text-left">Notes</th>
                  <th className="p-3 text-left">Status</th>
                  {["AGENT", "CEO", "ADMIN"].includes(role) && (
                    <th className="p-3 text-left">Update</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {visits.map((v) => (
                  <tr key={v.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{v.property?.title || "—"}</td>
                    <td className="p-3">{v.buyer?.name || "—"}</td>
                    <td className="p-3">{v.agent?.name || "—"}</td>
                    <td className="p-3">{new Date(v.visitDate).toLocaleString("en-IN")}</td>
                    <td className="p-3">{v.notes || "—"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(v.status)}`}>
                        {v.status}
                      </span>
                    </td>
                    {["AGENT", "CEO", "ADMIN"].includes(role) && (
                      <td className="p-3">
                        <select
                          className="border rounded p-1 text-xs"
                          value={v.status}
                          onChange={(e) => updateStatus(v.id, e.target.value)}
                        >
                          <option>SCHEDULED</option>
                          <option>COMPLETED</option>
                          <option>CANCELLED</option>
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

export default SiteVisits