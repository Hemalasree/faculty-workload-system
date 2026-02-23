import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ManageFaculty from "./pages/ManageFaculty";
import ManageSubjects from "./pages/ManageSubjects";
import AllocateWorkload from "./pages/AllocateWorkload";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/faculty" element={<ManageFaculty />} />
        <Route path="/admin/subjects" element={<ManageSubjects />} />
        <Route path="/admin/allocate" element={<AllocateWorkload />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}