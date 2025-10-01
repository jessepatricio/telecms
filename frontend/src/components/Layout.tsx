import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'fa-tachometer-alt' },
    { name: 'Users', href: '/users', icon: 'fa-users' },
    { name: 'Tasks', href: '/tasks', icon: 'fa-tasks' },
    { name: 'Roles', href: '/roles', icon: 'fa-user-tag' },
    { name: 'Cabinets', href: '/cabinets', icon: 'fa-server' },
    { name: 'Jobs', href: '/jobs', icon: 'fa-briefcase' },
    { name: 'Reports', href: '/reports', icon: 'fa-chart-bar' },
    { name: 'Reinstatements', href: '/reinstatements', icon: 'fa-undo' },
  ];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="p-4">
          <div className="flex items-center">
            <button
              className="text-white hover:text-gray-300 p-2 rounded-md transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className={`fa fa-${sidebarOpen ? 'times' : 'bars'} text-lg`}></i>
            </button>
            {sidebarOpen && (
              <h5 className="ml-3 text-xl font-semibold">TCTS</h5>
            )}
          </div>
        </div>
        
        <nav className="mt-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={!sidebarOpen ? item.name : ''}
            >
              <i className={`fa ${item.icon} w-5 text-center`}></i>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                Telecom Cabinet Tracking System
              </h1>
              <div className="flex items-center space-x-4">
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={toggleUserMenu}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <i className="fa fa-user mr-2"></i>
                    {user?.firstname}
                    <i className={`fa fa-chevron-down ml-1 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <i className="fa fa-sign-out-alt mr-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
