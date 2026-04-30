import React, { useState, useRef, useEffect } from 'react';
import { FaHome, FaUserCircle } from 'react-icons/fa';
import logo from '../api/assets/logo.png';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  // Get user info from localStorage (set at login)
  let username = 'User';
  let email = '';
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) username = user.username;
    if (user && user.email) email = user.email;
  } catch {}

  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header
      style={{
        width: '100%',
        background: 'linear-gradient(90deg, rgba(143,189,239,0.85) 0%, rgba(25,118,210,0.85) 100%)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: 68,
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        boxShadow: '0 6px 24px rgba(25, 118, 210, 0.13)',
        borderBottom: '2px solid #1976d2',
        position: 'relative',
        zIndex: 10,
        fontFamily: 'Montserrat, Arial, sans-serif',
        transition: 'background 0.3s, box-shadow 0.3s',
      }}
    >
      {/* Logo and App Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <img src={logo} alt="Finsmart Logo" style={{ width: 44, height: 44, borderRadius: 12, marginRight: 12, boxShadow: '0 4px 16px rgba(25, 118, 210, 0.18)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.08) rotate(-4deg)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(25, 118, 210, 0.22)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(25, 118, 210, 0.18)'; }}
        />
        <span style={{ color: '#fff', fontWeight: 900, fontSize: 28, letterSpacing: 1.5, textShadow: '0 4px 16px rgba(25, 118, 210, 0.10)', cursor: 'pointer', transition: 'color 0.2s, text-shadow 0.2s, transform 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.color = '#00b8d9'; e.currentTarget.style.textShadow = '0 6px 24px rgba(0, 184, 217, 0.18)'; e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseOut={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.textShadow = '0 4px 16px rgba(25, 118, 210, 0.10)'; e.currentTarget.style.transform = 'none'; }}
        >Finsmart Finances</span>
      </div>
      {/* Right Side: Home, Username, Profile Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, position: 'relative' }}>
        <FaHome
          size={36}
          color="#fff"
          style={{ background: 'rgba(25,118,210,0.85)', borderRadius: '50%', padding: 6, cursor: 'pointer', boxShadow: '0 2px 8px #1976d220', transition: 'background 0.2s, transform 0.18s' }}
          onClick={() => navigate('/')}
          title="Go to Home"
          onMouseOver={e => { e.currentTarget.style.background = '#00b8d9'; e.currentTarget.style.transform = 'scale(1.12)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(25,118,210,0.85)'; e.currentTarget.style.transform = 'none'; }}
        />
        <span
          style={{ color: '#fff', fontWeight: 700, fontSize: 24, letterSpacing: 1, cursor: 'pointer', position: 'relative', transition: 'color 0.2s, textShadow 0.2s, transform 0.18s' }}
          onClick={() => setShowDropdown((v) => !v)}
          title="Show user info"
          onMouseOver={e => { e.currentTarget.style.color = '#00b8d9'; e.currentTarget.style.transform = 'scale(1.06)'; }}
          onMouseOut={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'none'; }}
        >
          {username}
        </span>
        {showDropdown && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: 54,
              right: 60,
              background: '#fff',
              color: '#222',
              borderRadius: 16,
              boxShadow: '0 4px 16px #1976d220',
              padding: '20px 32px',
              minWidth: 220,
              zIndex: 100,
              fontSize: 19,
              fontFamily: 'Montserrat, Arial, sans-serif',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 8, color: '#1976d2' }}>Username: {username}</div>
            {email && <div style={{ fontSize: 16 }}>Email: {email}</div>}
          </div>
        )}
        <FaUserCircle
          size={42}
          color="#fff"
          style={{ background: 'rgba(25,118,210,0.85)', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px #1976d220', transition: 'background 0.2s, transform 0.18s' }}
          onClick={() => navigate('/settings')}
          title="Profile / Settings"
          onMouseOver={e => { e.currentTarget.style.background = '#00b8d9'; e.currentTarget.style.transform = 'scale(1.12)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(25,118,210,0.85)'; e.currentTarget.style.transform = 'none'; }}
        />
      </div>
    </header>
  );
} 