import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../api/axios"
import Navbar from "../components/Navbar"

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop"

function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const role = localStorage.getItem("role")
  const [property, setProperty] = useState(null)
  const [checklist, setChecklist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showVisitForm, setShowVisitForm] = useState(false)
  const [visitForm, setVisitForm] = useState({ visitDate: "", notes: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [propRes, checklistRes] = await Promise.all([
          API.get(`/properties/${id}`),
          API.get(`/documents/checklist/${id}`)
        ])
        setProperty(propRes.data)
        setChecklist(checklistRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleScheduleVisit = async () => {
    if (!visitForm.visitDate) {
      alert("Please select a visit date")
      return
    }
    try {
      setSubmitting(true)
      await API.post("/site-visits", {
        propertyId: id,
        visitDate: visitForm.visitDate,
        notes: visitForm.notes
      })
      alert("Site visit scheduled successfully!")
      setShowVisitForm(false)
      setVisitForm({ visitDate: "", notes: "" })
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to schedule visit")
    } finally {
      setSubmitting(false)
    }
  }

  const legalBadge = (status) => {
    if (status === "VERIFIED") return <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm">✓ Legally Verified</span>
    if (status === "REJECTED") return <span className="bg-red-100 text-red-700 px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm">✗ Rejected</span>
    return <span className="bg-yellow-100 text-yellow-700 px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm">⏳ Pending</span>
  }

  const docStatusBadge = (status) => {
    if (status === "APPROVED") return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">✓ Approved</span>
    if (status === "REJECTED") return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">✗ Rejected</span>
    if (status === "PENDING") return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">⏳ Pending</span>
    return <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-semibold">— Not Uploaded</span>
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 text-gray-500">Loading property details...</div>
    </div>
  )

  if (!property) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 text-red-500">Property not found.</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">

        <button onClick={() => navigate("/properties")} className="text-blue-700 text-sm mb-4 hover:underline">
          ← Back to Properties
        </button>

        {/* Main Grid — stacked on mobile, 2 cols on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">

          {/* Images */}
          <div>
            <img
              src={property.images?.[selectedImage] || FALLBACK_IMAGE}
              alt={property.title}
              className="w-full h-52 sm:h-72 object-cover rounded-lg shadow"
              onError={(e) => { e.target.src = FALLBACK_IMAGE }}
            />
            {property.images?.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`img-${idx}`}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-12 sm:w-20 sm:h-16 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${selectedImage === idx ? "border-blue-600" : "border-transparent"}`}
                    onError={(e) => { e.target.src = FALLBACK_IMAGE }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-3 gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{property.title}</h1>
              {legalBadge(property.legalStatus)}
            </div>

            <p className="text-blue-700 font-bold text-2xl sm:text-3xl mb-4">
              ₹ {property.price.toLocaleString("en-IN")}
            </p>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border">
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <p className="font-semibold text-gray-700 text-xs sm:text-sm">📍 {property.location}</p>
              </div>
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border">
                <p className="text-xs text-gray-400 mb-1">District</p>
                <p className="font-semibold text-gray-700 text-xs sm:text-sm">🏙️ {property.district}</p>
              </div>
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border">
                <p className="text-xs text-gray-400 mb-1">Size</p>
                <p className="font-semibold text-gray-700 text-xs sm:text-sm">📐 {property.size}</p>
              </div>
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border">
                <p className="text-xs text-gray-400 mb-1">Type</p>
                <p className="font-semibold text-gray-700 text-xs sm:text-sm">🏠 {property.type}</p>
              </div>
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border">
                <p className="text-xs text-gray-400 mb-1">Transaction</p>
                <p className="font-semibold text-gray-700 text-xs sm:text-sm">💼 {property.transactionType}</p>
              </div>
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border">
                <p className="text-xs text-gray-400 mb-1">Owner</p>
                <p className="font-semibold text-gray-700 text-xs sm:text-sm">👤 {property.owner?.name || "—"}</p>
              </div>
            </div>

            {property.owner?.phone && (
              <p className="text-sm text-gray-500 mb-4">📞 {property.owner.phone}</p>
            )}

            {property.legalVerification && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-4">
                <p className="text-sm font-semibold text-green-700 mb-1">Legal Verification Details</p>
                <p className="text-xs text-gray-600">Verified by: {property.legalVerification.verifiedBy?.name}</p>
                <p className="text-xs text-gray-600">Date: {new Date(property.legalVerification.verificationDate).toLocaleDateString("en-IN")}</p>
                {property.legalVerification.remarks && (
                  <p className="text-xs text-gray-600">Remarks: {property.legalVerification.remarks}</p>
                )}
              </div>
            )}

            {["SELLER", "AGENT", "ADMIN", "CEO", "LEGAL_OFFICER"].includes(role) && (
              <button
                onClick={() => navigate(`/properties/${id}/documents`)}
                className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 font-semibold text-sm mb-2"
              >
                📄 View Document Checklist
              </button>
            )}

            {role === "BUYER" && (
              <button
                onClick={() => setShowVisitForm(!showVisitForm)}
                className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 font-semibold text-sm"
              >
                {showVisitForm ? "Cancel" : "📅 Schedule Site Visit"}
              </button>
            )}

            {showVisitForm && (
              <div className="mt-4 bg-white border p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-3 text-sm">Schedule a Visit</h3>
                <input
                  type="datetime-local"
                  className="w-full border p-2 rounded text-sm mb-2"
                  value={visitForm.visitDate}
                  onChange={(e) => setVisitForm({ ...visitForm, visitDate: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded text-sm mb-2"
                  placeholder="Notes (optional)"
                  value={visitForm.notes}
                  onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                />
                <p className="text-xs text-gray-400 mb-3">ℹ️ An agent will be automatically assigned.</p>
                <button
                  onClick={handleScheduleVisit}
                  disabled={submitting}
                  className="w-full bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700"
                >
                  {submitting ? "Scheduling..." : "Confirm Visit"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Document Checklist Summary */}
        {checklist && (
          <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">Document Checklist</h2>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">✓ {checklist.summary.totalApproved} Approved</span>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">⏳ {checklist.summary.totalPending} Pending</span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">✗ {checklist.summary.totalRejected} Rejected</span>
                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-semibold">— {checklist.summary.totalMissing} Missing</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {checklist.checklist.map((doc) => (
                <div key={doc.documentType} className="border rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">{doc.label}</p>
                    {doc.uploadedAt && (
                      <p className="text-xs text-gray-400 mt-1">{new Date(doc.uploadedAt).toLocaleDateString("en-IN")}</p>
                    )}
                    {doc.remarks && <p className="text-xs text-red-500 mt-1">{doc.remarks}</p>}
                  </div>
                  <div className="ml-2 flex flex-col items-end gap-1">
                    {docStatusBadge(doc.status)}
                    {doc.fileUrl && (
                      <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">View</a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {checklist.summary.isComplete && (
              <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-lg text-center">
                <p className="text-green-700 font-semibold text-sm">✅ All documents verified — Property is fully legally compliant</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyDetail