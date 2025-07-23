// frontend/src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaMusic, FaPlus, FaUser, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { userProfile, logout } = useAuth();

  const navItems = [
    { to: '/home', icon: FaHome, label: 'Home' },
    { to: '/upload', icon: FaPlus, label: 'Upload Music' },
    { to: '/my-music', icon: FaMusic, label: 'My Music' }
  ];

  const handleLogout = () => {
    // Menambahkan konfirmasi sebelum logout
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <h1 className="sidebar-title">VibeStream</h1>
      </header>
      
      <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink 
            key={to}
            to={to} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            aria-label={label}
          >
            <Icon className="nav-icon" aria-hidden="true" />
            <span className="nav-text">{label}</span>
          </NavLink>
        ))}
        {userProfile?.role === 'owner' && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FaShieldAlt className="nav-icon" />
            <span className="nav-text">Admin Panel</span>
          </NavLink>
        )}
      </nav>

      <footer className="sidebar-footer">
        {userProfile && (
          <div className="user-profile-info" title={userProfile.email}>
            <FaUser className="profile-icon" aria-hidden="true" />
            <span className="profile-email">{userProfile.email}</span>
          </div>
        )}
        
        <button 
          className="pixel-button accent logout-btn" 
          onClick={handleLogout}
          type="button"
          aria-label="Logout from account"
        >
          <FaSignOutAlt className="logout-icon" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;