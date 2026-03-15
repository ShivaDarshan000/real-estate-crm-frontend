import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Properties from "./pages/Properties"
import Leads from "./pages/Leads"
import SiteVisits from "./pages/SiteVisits"
import LegalVerification from "./pages/LegalVerification"
import Farming from "./pages/Farming"
import Users from "./pages/Users"
import PropertyDetail from "./pages/PropertyDetail"
import DocumentChecklist from "./pages/DocumentChecklist"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
        <Route path="/properties/:propertyId/documents" element={<ProtectedRoute><DocumentChecklist /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute allowedRoles={["CEO", "ADMIN", "AGENT", "ZONAL_LEADER"]}><Leads /></ProtectedRoute>} />
        <Route path="/site-visits" element={<ProtectedRoute allowedRoles={["CEO", "ADMIN", "AGENT", "BUYER"]}><SiteVisits /></ProtectedRoute>} />
        <Route path="/legal" element={<ProtectedRoute allowedRoles={["LEGAL_OFFICER", "CEO", "ADMIN"]}><LegalVerification /></ProtectedRoute>} />
        <Route path="/farming" element={<ProtectedRoute><Farming /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={["CEO", "ADMIN"]}><Users /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App