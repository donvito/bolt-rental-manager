import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Users, DollarSign, Wrench, PlusCircle, LayoutDashboard, Settings, FileText, LogOut, Menu, X } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Properties } from './pages/Properties';
import { Dashboard } from './pages/Dashboard';
import { Tenants } from './pages/Tenants';
import { Documents } from './pages/Documents';
import { supabase } from './lib/supabase';

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <div 
          className={`
            ${isMobileMenuOpen ? 'fixed inset-0 z-40 md:hidden' : 'hidden'} 
            md:relative md:flex md:flex-shrink-0 transition-all duration-300
            ${isCollapsed && !isMobileMenuOpen ? 'md:w-16' : 'md:w-64'}
          `}>
          <div className="flex flex-col flex-grow bg-gray-800">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
              <div className="flex items-center">
                <Building2 className="w-6 h-6 text-indigo-400" />
                <h1 className={`ml-3 text-xl font-bold text-white transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                  Rental Manager
                </h1>
              </div>
              <div className="ml-auto">
                <button
                  className="text-gray-300 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-gray-800"
                  onClick={() => {
                    setIsCollapsed(!isCollapsed);
                  }}
                  title={isCollapsed ? "Expand menu" : "Collapse menu"}>
                  {isCollapsed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <Link
                  to="/"
                  className={`nav-link group ${
                    location.pathname === '/' ? 'nav-link-active' : 'nav-link-inactive'
                  }`}
                >
                  <LayoutDashboard className="nav-icon mr-3" />
                  <span className={`transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                    Dashboard
                  </span>
                  {isCollapsed && (
                    <span className="fixed left-20 ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Dashboard
                    </span>
                  )}
                </Link>
                <Link
                  to="/properties"
                  className={`nav-link group ${
                    location.pathname === '/properties' ? 'nav-link-active' : 'nav-link-inactive'
                  }`}
                >
                  <Building2 className="nav-icon mr-3" />
                  <span className={`transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                    Properties
                  </span>
                  {isCollapsed && (
                    <span className="fixed left-20 ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Properties
                    </span>
                  )}
                </Link>
                <Link
                  to="/tenants"
                  className={`nav-link group ${
                    location.pathname === '/tenants' ? 'nav-link-active' : 'nav-link-inactive'
                  }`}
                >
                  <Users className="nav-icon mr-3" />
                  <span className={`transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                    Tenants
                  </span>
                  {isCollapsed && (
                    <span className="fixed left-20 ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Tenants
                    </span>
                  )}
                </Link>
                <Link
                  to="/documents"
                  className={`nav-link group ${
                    location.pathname === '/documents' ? 'nav-link-active' : 'nav-link-inactive'
                  }`}
                >
                  <FileText className="nav-icon mr-3" />
                  <span className={`transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                    Documents
                  </span>
                  {isCollapsed && (
                    <span className="fixed left-20 ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Documents
                    </span>
                  )}
                </Link>
                <Link
                  to="/settings"
                  className={`nav-link group ${
                    location.pathname === '/settings' ? 'nav-link-active' : 'nav-link-inactive'
                  }`}
                >
                  <Settings className="nav-icon mr-3" />
                  <span className={`transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                    Settings
                  </span>
                  {isCollapsed && (
                    <span className="fixed left-20 ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Settings
                    </span>
                  )}
                </Link>
              </nav>
              <div className="mt-auto px-4 pb-4">
                <button
                  onClick={handleSignOut}
                  className="w-full nav-link nav-link-inactive group"
                >
                  <LogOut className="nav-icon mr-3" />
                  <span className={`transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                    Sign Out
                  </span>
                  {isCollapsed && (
                    <span className="fixed left-20 ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Sign Out
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
          )}
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="bg-white shadow">
            <div className="px-8 py-6">
              <div className="flex justify-between items-center gap-4">
                <button
                  className="md:hidden -ml-2 p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="flex items-center flex-1 ml-2">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {location.pathname === '/' && 'Dashboard'}
                  {location.pathname === '/properties' && 'Properties'}
                  {location.pathname === '/tenants' && 'Tenants'}
                  {location.pathname === '/documents' && 'Documents'}
                  {location.pathname === '/settings' && 'Settings'}
                  </h2>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 relative overflow-y-auto focus:outline-none px-6 py-8 space-y-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/documents" element={<Documents />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;