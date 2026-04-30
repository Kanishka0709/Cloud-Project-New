import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../api/assets/logo.png';

function Navbar({ onMenuClick, showHamburger }) {
  return (
    <nav className="navbar navbar-finance">
      <div className="navbar-left flex items-center gap-2">
        {/* Hamburger menu for mobile, only on dashboard pages */}
        {showHamburger && (
          <button
            className="md:hidden p-2 rounded hover:bg-blue-100 focus:outline-none"
            onClick={onMenuClick}
            aria-label="Open sidebar menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}
        <img src={logo} alt="Finsmart Logo" className="logo-square" />
        <span className="brand-name">Finsmart Finances</span>
      </div>
      <div className="navbar-right">
        <Link to="/dashboard" className="nav-btn">Dashboard</Link>
        <Link to="/login" className="nav-btn">Login</Link>
        <Link to="/signup" className="nav-btn nav-btn-primary">Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;
