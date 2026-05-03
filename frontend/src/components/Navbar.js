import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2>Lost & Found</h2>
      <div>
        {role === 'USER' && (
          <>
            <Link to="/user/dashboard">Dashboard</Link>
            <Link to="/user/report-lost">Report Lost</Link>
            <Link to="/user/report-found">Report Found</Link>
            <Link to="/user/matches">Matches</Link>
          </>
        )}
        {role === 'ADMIN' && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/manage-claims">Manage Claims</Link>
          </>
        )}
        {role && (
          <>
            <span style={{ marginLeft: '1rem' }}>{email}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {!role && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
