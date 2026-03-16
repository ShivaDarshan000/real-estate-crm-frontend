import { useEffect, useState } from "react"
import API from "../api/axios"
import Navbar from "../components/Navbar"

const FARM_IMAGES = {
  AVAILABLE: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop",
  ALLOCATED: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop",
  HARVESTING: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&auto=format&fit=crop"
}

function Farming() {
  const role = localStorage.getItem("role")
  const [plots, setPlots] = useState([])
  const [myPlots, setMyPlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(role === "BUYER" ? "my" : "all")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ plotNumber: "", size: "", location: "", cropType: "" })
  const [submitting, setSubmitting] = useState(false)
  const [expandedPlot, setExpandedPlot] = useState(null)

  const fetchPlots = async () => {
    try {
      setLoading(true)
      const [allRes, myRes] = await Promise.all([
        API.get("/farming"),
        API.get("/farming/my-plots")
      ])
      setPlots(allRes.data)
      setMyPlots(myRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPlots() }, [])

  const handleCreate = async () => {
    try {
      setSubmitting(true)
      await API.post("/farming", form)
      alert("Farm plot created!")
      setShowForm(false)
      setForm({ plotNumber: "", size: "", location: "", cropType: "" })
      fetchPlots()
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to create plot")
    } finally {
      setSubmitting(false)
    }
  }

  const statusColor = (status) => {
    const colors = {
      AVAILABLE: "bg-green-100 text-green-700 border-green-300",
      ALLOCATED: "bg-blue-100 text-blue-700 border-blue-300",
      HARVESTING: "bg-yellow-100 text-yellow-700 border-yellow-300"
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  const displayPlots = tab === "my" ? myPlots : plots

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Banner — Fixed for mobile */}
      <div className="bg-green-800 text-white px-4 sm:px-8 py-6 sm:py-8 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">🌱 Grow What You Eat</h1>
        <p className="text-green-200 text-xs sm:text-sm max-w-xl mb-4">
          Karnataka's premier managed farming project. Own a farm plot, grow organic vegetables,
          monitor your farm digitally and visit on weekends.
        </p>
        {/* Stats — 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-green-700 px-3 py-2 rounded-lg text-center">
            <p className="text-green-300 text-xs">Total Plots</p>
            <p className="font-bold text-lg">{plots.length}</p>
          </div>
          <div className="bg-green-700 px-3 py-2 rounded-lg text-center">
            <p className="text-green-300 text-xs">Available</p>
            <p className="font-bold text-lg">{plots.filter(p => p.status === "AVAILABLE").length}</p>
          </div>
          <div className="bg-green-700 px-3 py-2 rounded-lg text-center">
            <p className="text-green-300 text-xs">Allocated</p>
            <p className="font-bold text-lg">{plots.filter(p => p.status === "ALLOCATED").length}</p>
          </div>
          <div className="bg-green-700 px-3 py-2 rounded-lg text-center">
            <p className="text-green-300 text-xs">Harvesting</p>
            <p className="font-bold text-lg">{plots.filter(p => p.status === "HARVESTING").length}</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">

        {/* Add Plot Button */}
        {["CEO", "ADMIN"].includes(role) && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
            >
              {showForm ? "Cancel" : "+ Add Farm Plot"}
            </button>
          </div>
        )}

        {/* Add Plot Form */}
        {showForm && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
            <h3 className="font-bold text-gray-700 mb-4">New Farm Plot</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="border p-2 rounded text-sm" placeholder="Plot Number (e.g. FP-006)" value={form.plotNumber} onChange={(e) => setForm({ ...form, plotNumber: e.target.value })} />
              <input className="border p-2 rounded text-sm" placeholder="Size (e.g. 5000 sqft)" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
              <input className="border p-2 rounded text-sm" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <input className="border p-2 rounded text-sm" placeholder="Crop Type (e.g. Tomatoes)" value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })} />
            </div>
            <button onClick={handleCreate} disabled={submitting} className="mt-4 bg-green-600 text-white px-6 py-2 rounded text-sm hover:bg-green-700">
              {submitting ? "Saving..." : "Save Plot"}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {!["BUYER"].includes(role) && (
            <button
              onClick={() => setTab("all")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold border ${tab === "all" ? "bg-green-700 text-white border-green-700" : "bg-white border-gray-200 text-gray-600"}`}
            >
              🌍 All ({plots.length})
            </button>
          )}
          <button
            onClick={() => setTab("my")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold border ${tab === "my" ? "bg-green-700 text-white border-green-700" : "bg-white border-gray-200 text-gray-600"}`}
          >
            👤 My Plots ({myPlots.length})
          </button>
        </div>

        {/* Plots Grid */}
        {loading ? (
          <p className="text-gray-500">Loading farm plots...</p>
        ) : displayPlots.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-gray-400 text-lg font-semibold">No farm plots found</p>
            <p className="text-gray-400 text-sm mt-1">
              {tab === "my" ? "You don't have any allocated plots yet." : "No plots available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayPlots.map((plot) => (
              <div key={plot.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">

                {/* Plot Image */}
                <div className="relative">
                  <img
                    src={FARM_IMAGES[plot.status] || FARM_IMAGES.AVAILABLE}
                    alt={`Plot ${plot.plotNumber}`}
                    className="w-full h-36 sm:h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${statusColor(plot.status)}`}>
                      {plot.status}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    #{plot.plotNumber}
                  </div>
                </div>

                {/* Plot Details */}
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="font-semibold text-gray-700 text-xs">📍 {plot.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Size</p>
                      <p className="font-semibold text-gray-700 text-xs">📐 {plot.size}</p>
                    </div>
                    {plot.cropType && (
                      <div>
                        <p className="text-xs text-gray-400">Crop</p>
                        <p className="font-semibold text-gray-700 text-xs">🌿 {plot.cropType}</p>
                      </div>
                    )}
                    {plot.investor && (
                      <div>
                        <p className="text-xs text-gray-400">Investor</p>
                        <p className="font-semibold text-gray-700 text-xs">👤 {plot.investor.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="flex gap-2 mb-3">
                    {plot.nextVisitDate && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 flex-1 text-center">
                        <p className="text-xs text-blue-400">Next Visit</p>
                        <p className="text-xs font-semibold text-blue-700">{new Date(plot.nextVisitDate).toLocaleDateString("en-IN")}</p>
                      </div>
                    )}
                    {plot.harvestDate && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1 flex-1 text-center">
                        <p className="text-xs text-yellow-500">Harvest</p>
                        <p className="text-xs font-semibold text-yellow-700">{new Date(plot.harvestDate).toLocaleDateString("en-IN")}</p>
                      </div>
                    )}
                  </div>

                  {/* Crop Updates */}
                  {plot.cropUpdates?.length > 0 && (
                    <div className="border-t pt-2">
                      <button
                        onClick={() => setExpandedPlot(expandedPlot === plot.id ? null : plot.id)}
                        className="text-xs text-green-700 font-semibold w-full text-left"
                      >
                        🌿 {plot.cropUpdates.length} Update{plot.cropUpdates.length > 1 ? "s" : ""} {expandedPlot === plot.id ? "▲" : "▼"}
                      </button>
                      {expandedPlot === plot.id && (
                        <div className="mt-2 space-y-2">
                          {plot.cropUpdates.map((u) => (
                            <div key={u.id} className="bg-green-50 rounded-lg p-2">
                              <p className="text-xs text-gray-600">{u.description}</p>
                              {u.photoUrl && (
                                <img
                                  src={u.photoUrl}
                                  alt="crop update"
                                  className="w-full h-20 object-cover rounded mt-1"
                                  onError={(e) => { e.target.style.display = "none" }}
                                />
                              )}
                              <p className="text-xs text-gray-400 mt-1">{new Date(u.createdAt).toLocaleDateString("en-IN")}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Farming