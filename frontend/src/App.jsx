import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ThemeProvider from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/auth/Login";

// Admin pages
import AdminDashboard    from "./pages/admin/AdminDashboard";
import ManageFaculty     from "./pages/admin/ManageFaculty";
import ManageSubjects    from "./pages/admin/ManageSubjects";
import ManageDepartments from "./pages/admin/ManageDepartments";
import AllocateWorkload  from "./pages/admin/AllocateWorkload";
import WorkloadManagement from "./pages/admin/WorkloadManagement";
import AdminRequests     from "./pages/admin/AdminRequests";
import AdminNotifications from "./pages/admin/AdminNotifications";
import Reports           from "./pages/admin/Reports";
import AdminSettings     from "./pages/admin/AdminSettings";

// Faculty pages
import FacultyDashboard      from "./pages/faculty/FacultyDashboard";
import FacultyProfile        from "./pages/faculty/FacultyProfile";
import { FacultySubjects }   from "./pages/faculty/FacultySubjects";
import { FacultyWorkload }   from "./pages/faculty/FacultyWorkload";
import FacultyLeave          from "./pages/faculty/FacultyLeave";
import FacultyRequests       from "./pages/faculty/FacultyRequests";
import FacultyNotifications  from "./pages/faculty/FacultyNotifications";
import { FacultyReports }    from "./pages/faculty/FacultyReports";
import FacultySettings       from "./pages/faculty/FacultySettings";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/"       element={<Navigate to="/login" replace />} />
            <Route path="/login"  element={<Login />} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/faculty"       element={<ProtectedRoute role="ADMIN"><ManageFaculty /></ProtectedRoute>} />
            <Route path="/admin/subjects"      element={<ProtectedRoute role="ADMIN"><ManageSubjects /></ProtectedRoute>} />
            <Route path="/admin/departments"   element={<ProtectedRoute role="ADMIN"><ManageDepartments /></ProtectedRoute>} />
            <Route path="/admin/allocate"      element={<ProtectedRoute role="ADMIN"><AllocateWorkload /></ProtectedRoute>} />
            <Route path="/admin/workload"      element={<ProtectedRoute role="ADMIN"><WorkloadManagement /></ProtectedRoute>} />
            <Route path="/admin/requests"      element={<ProtectedRoute role="ADMIN"><AdminRequests /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute role="ADMIN"><AdminNotifications /></ProtectedRoute>} />
            <Route path="/admin/reports"       element={<ProtectedRoute role="ADMIN"><Reports /></ProtectedRoute>} />
            <Route path="/admin/settings"      element={<ProtectedRoute role="ADMIN"><AdminSettings /></ProtectedRoute>} />

            {/* Faculty routes */}
            <Route path="/faculty"                element={<ProtectedRoute role="FACULTY"><FacultyDashboard /></ProtectedRoute>} />
            <Route path="/faculty/profile"        element={<ProtectedRoute role="FACULTY"><FacultyProfile /></ProtectedRoute>} />
            <Route path="/faculty/subjects"       element={<ProtectedRoute role="FACULTY"><FacultySubjects /></ProtectedRoute>} />
            <Route path="/faculty/workload"       element={<ProtectedRoute role="FACULTY"><FacultyWorkload /></ProtectedRoute>} />
            <Route path="/faculty/leave"          element={<ProtectedRoute role="FACULTY"><FacultyLeave /></ProtectedRoute>} />
            <Route path="/faculty/requests"       element={<ProtectedRoute role="FACULTY"><FacultyRequests /></ProtectedRoute>} />
            <Route path="/faculty/notifications"  element={<ProtectedRoute role="FACULTY"><FacultyNotifications /></ProtectedRoute>} />
            <Route path="/faculty/reports"        element={<ProtectedRoute role="FACULTY"><FacultyReports /></ProtectedRoute>} />
            <Route path="/faculty/settings"       element={<ProtectedRoute role="FACULTY"><FacultySettings /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: "12px", background: "#fff", color: "#374151", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
            success: { iconTheme: { primary: "#6B8EFF", secondary: "#fff" } }
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}