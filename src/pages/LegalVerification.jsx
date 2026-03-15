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
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Legal Verification</h2>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("pending")} className={`px-4 py-2 rounded text-sm font-semibold ${tab === "pending" ? "bg-blue-700 text-white" : "bg-white border text-gray-600"}`}>
            Pending ({pending.length})
          </button>
          <button onClick={() => setTab("history")} className={`px-4 py-2 rounded text-sm font-semibold ${tab === "history" ? "bg-blue-700 text-white" : "bg-white border text-gray-600"}`}>
            History ({history.length})
          </button>
        </div>

        {loading ? <p className="text-gray-500">Loading...</p> : (
          <>
            {tab === "pending" && (
              pending.length === 0 ? <p className="text-gray-500">No pending properties.</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pending.map((p) => (
                    <div key={p.id} className="bg-white p-5 rounded-lg shadow border">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">{p.title}</h3>
                      <p className="text-sm text-gray-500 mb-1">📍 {p.location}, {p.district}</p>
                      <p className="text-sm text-gray-500 mb-1">Type: {p.type} | {p.transactionType}</p>
                      <p className="text-sm text-gray-500 mb-3">Owner: {p.owner?.name} ({p.owner?.email})</p>
                      <textarea
                        className="w-full border p-2 rounded text-sm mb-3"
                        placeholder="Remarks (required for rejection)"
                        rows={2}
                        value={remarks[p.id] || ""}
                        onChange={(e) => setRemarks({ ...remarks, [p.id]: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleVerify(p.id)} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">✓ Verify</button>
                        <button onClick={() => handleReject(p.id)} className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">✗ Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === "history" && (
              history.length === 0 ? <p className="text-gray-500">No verification history.</p> : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
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
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default LegalVerification