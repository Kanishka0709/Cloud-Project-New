import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaMoneyBillWave, FaChartLine, FaChartPie, FaFileAlt, FaCog, FaQuestionCircle } from 'react-icons/fa';
import { MdOutlineAssessment } from 'react-icons/md';
import { BsBarChart } from 'react-icons/bs';
import './Sidebar.css';

const menuItems = [
  { icon: <FaHome size={28} color="#ff8800" />, label: 'Dashboard', route: '/dashboard' },
  { icon: <FaMoneyBillWave size={28} color="#00b894" />, label: 'Expenses', route: '/expenses' },
  { icon: <FaChartLine size={28} color="#6c5ce7" />, label: 'Investments', route: '/investments' },
  { icon: <BsBarChart size={28} color="#0984e3" />, label: 'Stocks', route: '/stocks' },
  { icon: <MdOutlineAssessment size={28} color="#fdcb6e" />, label: 'Tax Profile', route: '/tax' },
  { icon: <FaFileAlt size={28} color="#636e72" />, label: 'Reports', route: '/reports' },
  { icon: <FaCog size={28} color="#00b894" />, label: 'My Account', route: '/settings' },
  { icon: <FaQuestionCircle size={28} color="#d63031" />, label: 'Help', route: '/help' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <aside className="sidebar-custom">
      {/* Menu Items */}
      <nav style={{ width: '100%' }}>
        {menuItems.map((item) => (
          <Link
            to={item.route}
            key={item.label}
            className={`sidebar-item${location.pathname.startsWith(item.route) ? ' active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '12px 32px',
              fontSize: 22,
              fontFamily: 'Comic Sans MS, Comic Sans, cursive',
              textDecoration: 'none',
              transition: 'background 0.2s',
              borderRadius: 12,
              marginBottom: 4,
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      {/* Spacer */}
      <div style={{ flex: 1 }} />
      {/* Sign Out Button */}
      <button
        style={{
          background: 'linear-gradient(90deg, #2d0bff 0%, #38b6ff 100%)',
          color: '#fff',
          fontWeight: 600,
          fontSize: 18,
          border: 'none',
          borderRadius: 16,
          padding: '12px 36px',
          marginBottom: 12,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #0002',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.background = '#fff')}
        onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #2d0bff 0%, #38b6ff 100%)')}
        onClick={() => {
          navigate('/login');
        }}
      >
        Sign Out
      </button>
    </aside>
  );
} 