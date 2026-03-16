import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../api/axios"
import Navbar from "../components/Navbar"

const DOCUMENT_TYPES = [
  { value: "SALE_DEED", label: "Sale Deed" },
  { value: "KHATA_CERTIFICATE", label: "Khata Certificate" },
  { value: "ENCUMBRANCE_CERTIFICATE", label: "Encumbrance Certificate" },
  { value: "LAYOUT_APPROVAL", label: "Layout Approval" },
  { value: "LAND_CONVERSION_CERTIFICATE", label: "Land Conversion Certificate" }
]

function DocumentChecklist() {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const role = localStorage.getItem("role")
  const [checklist, setChecklist] = useState(null)
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploadForm, setUploadForm] = useState({ documentType: "SALE_DEED", fileUrl: "" })
  const [uploading, setUploading] = useState(false)
  const [remarks, setRemarks] = useState({})
  const [processing, setProcessing] = useState({})

  const fetchData = async () => {
    try {
      setLoading(true)
      const [checkRes, propRes] = await Promise.all([
        API.get(`/documents/checklist/${propertyId}`),
        API.get(`/properties/${propertyId}`)
      ])
      setChecklist(checkRes.data)
      setProperty(propRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [propertyId])

  const handleUpload = async () => {
    if (!uploadForm.fileUrl) {
      alert("Please enter a document URL")
      return
    }
    try {
      setUploading(true)
      await API.post("/documents/upload", {
        propertyId,
        documentType: uploadForm.documentType,
        fileUrl: uploadForm.fileUrl
      })
      alert("Document uploaded successfully!")
      setUploadForm({ documentType: "SALE_DEED", fileUrl: "" })
      fetchData()
    } catch (err) {
      alert(err?.response?.data?.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleApprove = async (docId) => {
    try {
      setProcessing({ ...processing, [docId]: true })
      const res = await API.put(`/documents/approve/${docId}`, { remarks: remarks[docId] || "" })
      alert(res.data.message)
      fetchData()
    } catch (err) {
      alert("Failed to approve document")
    } finally {
      setProcessing({ ...processing, [docId]: false })
    }
  }

  const handleReject = async (docId) => {
    if (!remarks[docId]) {
      alert("Please provide remarks before rejecting")
      return
    }
    try {
      setProcessing({ ...processing, [docId]: true })
      await API.put(`/documents/reject/${docId}`, { remarks: remarks[docId] })
      alert("Document rejected.")
      fetchData()
    } catch (err) {
      alert("Failed to reject document")
    } finally {
      setProcessing({ ...processing, [docId]: false })
    }
  }

  const statusColor = (status) => {
    if (status === "APPROVED") return "border-green-300 bg-green-50"
    if (status === "REJECTED") return "border-red-300 bg-red-50"
    if (status === "PENDING") return "border-yellow-300 bg-yellow-50"
    return "border-gray-200 bg-gray-50"
  }

  const statusBadge = (status) => {
    if (status === "APPROVED") return <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">✓ Approved</span>
    if (status === "REJECTED") return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">✗ Rejected</span>
    if (status === "PENDING") return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">⏳ Pending</span>
    return <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-semibold">— Not Uploaded</span>
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 text-gray-500">Loading document checklist...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">

        <button
          onClick={() => navigate(`/properties/${propertyId}`)}
          className="text-blue-700 text-sm mb-4 hover:underline"
        >
          ← Back to Property
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-5 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-1">Document Checklist</h2>
          {property && (
            <p className="text-gray-500 text-xs sm:text-sm">
              Property: <span className="font-semibold text-gray-700">{property.title}</span> — {property.location}
            </p>
          )}
          {checklist && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">✓ {checklist.summary.totalApproved} Approved</span>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold">⏳ {checklist.summary.totalPending} Pending</span>
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">✗ {checklist.summary.totalRejected} Rejected</span>
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-semibold">— {checklist.summary.totalMissing} Not Uploaded</span>
              {checklist.summary.isComplete && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">🎉 All Complete</span>
              )}
            </div>
          )}
        </div>

        {/* Upload Form */}
        {["SELLER", "AGENT", "ADMIN", "CEO"].includes(role) && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-5 mb-6">
            <h3 className="font-bold text-gray-700 mb-4 text-sm sm:text-base">Upload Document</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                className="border p-2 rounded text-sm"
                value={uploadForm.documentType}
                onChange={(e) => setUploadForm({ ...uploadForm, documentType: e.target.value })}
              >
                {DOCUMENT_TYPES.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <input
                className="border p-2 rounded text-sm sm:col-span-2"
                placeholder="Document URL (Google Drive link, etc.)"
                value={uploadForm.fileUrl}
                onChange={(e) => setUploadForm({ ...uploadForm, fileUrl: e.target.value })}
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-3 w-full sm:w-auto bg-blue-700 text-white px-6 py-2 rounded text-sm hover:bg-blue-800"
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        )}

        {/* Checklist Items */}
        <div className="space-y-3 sm:space-y-4">
          {checklist?.checklist.map((doc) => (
            <div key={doc.documentType} className={`bg-white rounded-lg border-2 p-4 sm:p-5 ${statusColor(doc.status)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 mr-2">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">{doc.label}</h3>
                  {doc.uploadedAt && (
                    <p className="text-xs text-gray-400 mt-1">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}</p>
                  )}
                  {doc.remarks && (
                    <p className="text-xs text-red-600 mt-1">Remarks: {doc.remarks}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {statusBadge(doc.status)}
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                      View Doc
                    </a>
                  )}
                </div>
              </div>

              {/* Legal Officer Actions */}
              {role === "LEGAL_OFFICER" && doc.status !== "NOT_UPLOADED" && (
                <div className="mt-3 border-t pt-3">
                  <input
                    className="w-full border p-2 rounded text-sm mb-2"
                    placeholder="Remarks (required for rejection)"
                    value={remarks[doc.documentType] || ""}
                    onChange={(e) => setRemarks({ ...remarks, [doc.documentType]: e.target.value })}
                  />
                  <div className="flex gap-2">
                    {doc.status !== "APPROVED" && (
                      <button
                        onClick={() => handleApprove(doc.documentType)}
                        disabled={processing[doc.documentType]}
                        className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                      >
                        {processing[doc.documentType] ? "..." : "✓ Approve"}
                      </button>
                    )}
                    {doc.status !== "REJECTED" && (
                      <button
                        onClick={() => handleReject(doc.documentType)}
                        disabled={processing[doc.documentType]}
                        className="flex-1 sm:flex-none bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                      >
                        {processing[doc.documentType] ? "..." : "✗ Reject"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {doc.status === "NOT_UPLOADED" && (
                <p className="text-xs text-gray-400 mt-2 italic">Document not yet uploaded</p>
              )}
            </div>
          ))}
        </div>

        {checklist?.summary.isComplete && (
          <div className="mt-6 bg-green-50 border border-green-300 p-4 rounded-lg text-center">
            <p className="text-green-700 font-bold text-sm sm:text-base">🎉 All 5 documents are approved!</p>
            <p className="text-green-600 text-xs sm:text-sm mt-1">This property is ready for Legal Verification.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default DocumentChecklist