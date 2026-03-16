import { useEffect, useState } from "react"
import API from "../api/axios"
import Navbar from "../components/Navbar"

function LegalVerification() {
  const [pending, setPending] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("pending")
  const [remarks, setRemarks] = useState({})

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pendingRes, historyRes] = await Promise.all([
        API.get("/legal/pending"),
        API.get("/legal/history")
      ])
      setPending(pendingRes.data)
      setHistory(historyRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleVerify = async (id) => {
    try {
      await API.put(`/legal/verify/${id}`, { remarks: remarks[id] || "" })
      alert("Property verified successfully!")
      fetchData()
    } catch (err) {
      alert("Failed to verify property")
    }
  }

  const handleReject = async (id) => {
    if (!remarks[id]) {
      alert("Please provide remarks before rejecting")
      return
    }
    try {
      await API.put(`/legal/reject/${id}`, { remarks: remarks[id] })
      alert("Property rejected.")
      fetchData()
    } catch (err) {
      alert("Failed to reject property")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-6">Legal Verification</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("pending")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded text-sm font-semibold ${tab === "pending" ? "bg-blue-700 text-white" : "bg-white border text-gray-600"}`}
          >
            Pending ({pending.length})
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded text-sm font-semibold ${tab === "history" ? "bg-blue-700 text-white" : "bg-white border text-gray-600"}`}
          >
            History ({history.length})
          </button>
        </div>

        {loading ? <p className="text-gray-500">Loading...</p> : (
          <>
            {/* Pending Tab */}
            {tab === "pending" && (
              pending.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">⚖️</p>
                  <p className="text-gray-400">No pending properties.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {pending.map((p) => (
                    <div key={p.id} className="bg-white p-4 sm:p-5 rounded-lg shadow border">
                      <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1">{p.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">📍 {p.location}, {p.district}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Type: {p.type} | {p.transactionType}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mb-3">Owner: {p.owner?.name} ({p.owner?.email})</p>
                      <textarea
                        className="w-full border p-2 rounded text-sm mb-3"
                        placeholder="Remarks (required for rejection)"
                        rows={2}
                        value={remarks[p.id] || ""}
                        onChange={(e) => setRemarks({ ...remarks, [p.id]: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleVerify(p.id)} className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">✓ Verify</button>
                        <button onClick={() => handleReject(p.id)} className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600">✗ Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* History Tab */}
            {tab === "history" && (
              history.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">📜</p>
                  <p className="text-gray-400">No verification history.</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="block sm:hidden space-y-4">
                    {history.map((h) => (
                      <div key={h.id} className="bg-white rounded-lg shadow p-4 border">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-gray-800 text-sm">{h.property?.title || "—"}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${h.status === "VERIFIED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {h.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">👤 {h.verifiedBy?.name || "—"}</p>
                        <p className="text-xs text-gray-500 mb-1">📅 {new Date(h.verificationDate).toLocaleDateString("en-IN")}</p>
                        {h.remarks && <p className="text-xs text-gray-500">📝 {h.remarks}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-sm">
                      <thead className="bg-blue-800 text-white">
                        <tr>
                          <th className="p-3 text-left">Property</th>
                          <th className="p-3 text-left">Status</th>
                          <th className="p-3 text-left">Verified By</th>
                          <th className="p-3 text-left">Date</th>
                          <th className="p-3 text-left">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((h) => (
                          <tr key={h.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{h.property?.title || "—"}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${h.status === "VERIFIED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {h.status}
                              </span>
                            </td>
                            <td className="p-3">{h.verifiedBy?.name || "—"}</td>
                            <td className="p-3">{new Date(h.verificationDate).toLocaleDateString("en-IN")}</td>
                            <td className="p-3">{h.remarks || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default LegalVerification