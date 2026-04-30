import React, { useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Define dashboard-related routes
  const dashboardPaths = [
    '/dashboard',
    '/expenses',
    '/investments',
    '/stocks',
    '/tax',
    '/reports',
    '/settings',
    '/help',
    // add more if needed
  ];
  const isDashboardRoute = dashboardPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hide Navbar on dashboard pages */}
      {!isDashboardRoute && (
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          showHamburger={isDashboardRoute}
        />
      )}
      <div className="flex-grow">
        <AppRoutes sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
