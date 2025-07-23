import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaMusic, FaPlus, FaUser, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';
import { playSoundEffect } from '../utils/audioUtils';

const Sidebar = () => {
  const { userProfile, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems = [
    { to: '/home', icon: FaHome, label: 'Home' },
    { to: '/upload', icon: FaPlus, label: 'Upload Music' },
    { to: '/my-music', icon: FaMusic, label: 'My Music' }
  ];

  const handleLogoutClick = () => {
    playSoundEffect('confirm'); // Mainkan suara konfirmasi saat tombol diklik
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    playSoundEffect('success'); // Mainkan suara sukses
    logout();
    setIsLogoutModalOpen(false);
  };

  const handleCancelLogout = () => {
    playSoundEffect('cancel'); // Mainkan suara batal
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        title="Logout Confirmation"
        message="Are you sure you want to log out of VibeStream?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
      
      <aside className="sidebar">
        <header className="sidebar-header">
          <h1 className="sidebar-title">VibeStream</h1>
        </header>
        
        <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} aria-label={label}>
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
          
          <button className="pixel-button accent logout-btn" onClick={handleLogoutClick} type="button" aria-label="Logout from account">
            <FaSignOutAlt className="logout-icon" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </footer>
      </aside>
    </>
  );
};

export default Sidebar;