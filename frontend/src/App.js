import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import Matches from './pages/Matches';
import Claim from './pages/Claim';
import MyClaims from './pages/MyClaims';
import ManageClaims from './pages/ManageClaims';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={<ProtectedRoute allowedRole="USER"><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/report-lost" element={<ProtectedRoute allowedRole="USER"><ReportLost /></ProtectedRoute>} />
          <Route path="/user/report-found" element={<ProtectedRoute allowedRole="USER"><ReportFound /></ProtectedRoute>} />
          <Route path="/user/matches" element={<ProtectedRoute allowedRole="USER"><Matches /></ProtectedRoute>} />
          <Route path="/user/claim" element={<ProtectedRoute allowedRole="USER"><Claim /></ProtectedRoute>} />
          <Route path="/user/my-claims" element={<ProtectedRoute allowedRole="USER"><MyClaims /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/manage-claims" element={<ProtectedRoute allowedRole="ADMIN"><ManageClaims /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
