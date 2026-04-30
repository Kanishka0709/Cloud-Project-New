import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout({ sidebarOpen, setSidebarOpen }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', flexDirection: 'column' }}>
      {/* TopBar as navbar */}
      <TopBar />
      {/* Main area: sidebar + content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        <Sidebar open={sidebarOpen} />
        <main style={{ flex: 1, padding: '32px 24px', background: '#f5f7fa' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
} 