import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api/axios"
import Navbar from "../components/Navbar"

const PROPERTY_TYPES = ["", "RESIDENTIAL", "VILLA", "COMMERCIAL", "FARMLAND"]
const TRANSACTION_TYPES = ["", "BUY", "SELL", "RENT", "LEASE", "JD"]
const LEGAL_STATUSES = ["", "PENDING", "VERIFIED", "REJECTED"]
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop"

function Properties() {
  const role = localStorage.getItem("role")
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [budgetRanges, setBudgetRanges] = useState([])
  const [filters, setFilters] = useState({ location: "", type: "", transactionType: "", legalStatus: "", minPrice: "", maxPrice: "" })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", location: "", district: "", size: "", price: "", type: "RESIDENTIAL", transactionType: "BUY" })
  const [submitting, setSubmitting] = useState(false)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filters.location) params.location = filters.location
      if (filters.type) params.type = filters.type
      if (filters.transactionType) params.transactionType = filters.transactionType
      if (filters.legalStatus) params.legalStatus = filters.legalStatus
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      const res = await API.get("/properties", { params })
      setProperties(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
    API.get("/properties/budget-ranges")
      .then(res => setBudgetRanges(res.data))
      .catch(() => {})
  }, [])

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleBudgetChange = (e) => {
    const val = e.target.value
    if (!val) {
      setFilters({ ...filters, minPrice: "", maxPrice: "" })
    } else {
      const [min, max] = val.split("-")
      setFilters({ ...filters, minPrice: min, maxPrice: max || "" })
    }
  }

  const handleCreateProperty = async () => {
    try {
      setSubmitting(true)
      await API.post("/properties", { ...form, price: parseFloat(form.price) })
      alert("Property created successfully!")
      setShowForm(false)
      setForm({ title: "", location: "", district: "", size: "", price: "", type: "RESIDENTIAL", transactionType: "BUY" })
      fetchProperties()
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to create property")
    } finally {
      setSubmitting(false)
    }
  }

  const legalBadge = (status) => {
    if (status === "VERIFIED") return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">✓ Legally Verified</span>
    if (status === "REJECTED") return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">✗ Rejected</span>
    return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">⏳ Pending</span>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Properties</h2>
          {["SELLER", "AGENT", "ADMIN", "CEO"].includes(role) && (
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 text-sm">
              {showForm ? "Cancel" : "+ Add Property"}
            </button>
          )}
        </div>

        {/* Add Property Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="font-bold text-gray-700 mb-4">New Property</h3>
            <div className="grid grid-cols-2 gap-3">
              <input name="title" placeholder="Title" className="border p-2 rounded" value={form.title} onChange={handleFormChange} />
              <input name="location" placeholder="Location" className="border p-2 rounded" value={form.location} onChange={handleFormChange} />
              <input name="district" placeholder="District" className="border p-2 rounded" value={form.district} onChange={handleFormChange} />
              <input name="size" placeholder="Size (e.g. 1200 sqft)" className="border p-2 rounded" value={form.size} onChange={handleFormChange} />
              <input name="price" type="number" placeholder="Price (₹)" className="border p-2 rounded" value={form.price} onChange={handleFormChange} />
              <select name="type" className="border p-2 rounded" value={form.type} onChange={handleFormChange}>
                {PROPERTY_TYPES.filter(Boolean).map(t => <option key={t}>{t}</option>)}
              </select>
              <select name="transactionType" className="border p-2 rounded" value={form.transactionType} onChange={handleFormChange}>
                {TRANSACTION_TYPES.filter(Boolean).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button onClick={handleCreateProperty} disabled={submitting} className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-sm">
              {submitting ? "Saving..." : "Save Property"}
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="font-semibold text-gray-600 mb-3 text-sm">Filter Properties</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <input
              name="location"
              placeholder="Location"
              className="border p-2 rounded text-sm"
              value={filters.location}
              onChange={handleFilterChange}
            />
            <select name="type" className="border p-2 rounded text-sm" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              {PROPERTY_TYPES.filter(Boolean).map(t => <option key={t}>{t}</option>)}
            </select>
            <select name="transactionType" className="border p-2 rounded text-sm" value={filters.transactionType} onChange={handleFilterChange}>
              <option value="">All Transactions</option>
              {TRANSACTION_TYPES.filter(Boolean).map(t => <option key={t}>{t}</option>)}
            </select>
            <select name="legalStatus" className="border p-2 rounded text-sm" value={filters.legalStatus} onChange={handleFilterChange}>
              <option value="">All Legal Status</option>
              {LEGAL_STATUSES.filter(Boolean).map(t => <option key={t}>{t}</option>)}
            </select>

            {/* Budget Range Dropdown ₹10L to ₹10Cr in ₹2.5L increments */}
            <select className="border p-2 rounded text-sm" onChange={handleBudgetChange}>
              <option value="">All Budgets</option>
              {budgetRanges.map((r) => (
                <option
                  key={r.label}
                  value={r.max ? `${r.min}-${r.max}` : `${r.min}-`}
                >
                  {r.label}
                </option>
              ))}
            </select>

            <input
              name="maxPrice"
              type="number"
              placeholder="Max Price ₹"
              className="border p-2 rounded text-sm"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={fetchProperties} className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">
              Apply Filters
            </button>
            <button
              onClick={() => {
                setFilters({ location: "", type: "", transactionType: "", legalStatus: "", minPrice: "", maxPrice: "" })
                fetchProperties()
              }}
              className="bg-gray-200 text-gray-700 px-4 py-1 rounded text-sm hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <p className="text-gray-500">Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="text-gray-500">No properties found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p.id} className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">

                {/* Property Image */}
                <div className="relative">
                  <img
                    src={p.images?.[0] || FALLBACK_IMAGE}
                    alt={p.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                  />
                  {/* Legal badge on top of image */}
                  <div className="absolute top-2 right-2">
                    {legalBadge(p.legalStatus)}
                  </div>
                  {/* Transaction type tag */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-700 text-white text-xs px-2 py-1 rounded font-semibold">
                      {p.transactionType}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{p.title}</h3>
                  <p className="text-gray-500 text-sm mb-1">📍 {p.location}, {p.district}</p>
                  <p className="text-gray-500 text-sm mb-3">📐 {p.size}</p>
                  <p className="text-blue-700 font-bold text-xl mb-3">
                    ₹ {p.price.toLocaleString("en-IN")}
                  </p>
                  <div className="flex gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">{p.type}</span>
                  </div>
                  {p.owner && (
                    <p className="text-gray-400 text-xs border-t pt-2">
                      Owner: {p.owner.name}
                    </p>
                  )}
                  {/* View Details Button */}
                  <button
                    onClick={() => navigate(`/properties/${p.id}`)}
                    className="mt-3 w-full bg-blue-700 text-white py-2 rounded text-sm hover:bg-blue-800"
                  >
                    View Details →
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Properties