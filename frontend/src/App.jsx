// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './components/Home';
// import RoomsPage from './components/RoomsPage';
// import Gallery from './components/Gallery';
// import Amenities from './components/Amenities';
// import Packages from './components/Packages';
// import Contact from './components/Contact';
// import Reviews from './components/Reviews';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import LoginForm from './components/LoginForm';
// import AdminDashboard from './components/AdminDashboard';
// import UserDashboard from './components/UserDashboard';
// import './App.css';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="App">
//           <Navbar />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<LoginForm />} />
            
//             {/* Admin routes - only for admin and manager roles
//             <Route path="/admin" element={
//               <ProtectedRoute allowedRoles={['admin', 'manager']}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             } /> */}
            
//             {/* Dashboard routes - for all authenticated staff */}
//             <Route path="/dashboard" element={
//               <ProtectedRoute>
//                 <UserDashboard />
//               </ProtectedRoute>
//             } />
//             <Route path="/admin" element={<AdminDashboard />} />
            
//             {/* Public routes */}
//             <Route path="/rooms" element={<RoomsPage />} />
//             <Route path="/gallery" element={<Gallery />} />
//             <Route path="/amenities" element={<Amenities />} />
//             <Route path="/packages" element={<Packages />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/reviews" element={<Reviews />} />
            
//             {/* Unauthorized page */}
//             <Route path="/unauthorized" element={
//               <div style={{ padding: '2rem', textAlign: 'center' }}>
//                 <h2>Access Denied</h2>
//                 <p>You don't have permission to access this page.</p>
//               </div>
//             } />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Navbar from "./components/Navbar"
import Home from './components/Home';
import RoomsPage from "./components/RoomsPage";
import Gallery from './components/Gallery';
import Amenities from './components/Amenities';
import Packages from './components/Packages';
import Contact from './components/Contact';
import Reviews from './components/Reviews';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import './App.css';

// Simple Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Nandhini Beach Resort</h3>
          <p>Your perfect getaway destination</p>
        </div>
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>📞 +1 (555) 123-4567</p>
          <p>✉️ info@nandhiniresort.com</p>
          <p>📍 Beach Road, Coastal City</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <a href="/rooms">Rooms & Suites</a>
          <a href="/amenities">Amenities</a>
          <a href="/contact">Contact Us</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Nandhini Beach Resort. All rights reserved.</p>
      </div>
    </footer>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Conditionally render navbar - hide on admin routes */}
          <Routes>
            <Route path="*" element={
              <ConditionalNavbar />
            } />
          </Routes>

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reviews" element={<Reviews />} />
            
            {/* User dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            
            {/* Admin routes - no navbar, no special layout */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/rooms" element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <div style={{ padding: '2rem', minHeight: '100vh', background: '#f8f9fa' }}>
                  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem' }}>
                      <a href="/" style={{ color: '#3498db', textDecoration: 'none' }}>
                        ← Back to Main Site
                      </a>
                    </div>
                    <h1>Rooms Management</h1>
                    <p>Room management content will go here...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Unauthorized page */}
            <Route path="/unauthorized" element={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
              </div>
            } />
            
            {/* 404 Page */}
            <Route path="*" element={
              <div style={{ 
                padding: '4rem 2rem', 
                textAlign: 'center',
                minHeight: '50vh'
              }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" style={{
                  padding: '10px 20px',
                  background: '#27ae60',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  marginTop: '1rem',
                  display: 'inline-block'
                }}>
                  Return to Homepage
                </a>
              </div>
            } />
          </Routes>

          {/* Conditionally render footer - hide on admin routes */}
          <Routes>
            <Route path="*" element={
              <ConditionalFooter />
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Component to conditionally show navbar
const ConditionalNavbar = () => {
  const location = window.location.pathname;
  const isAdminRoute = location.startsWith('/admin');
  
  if (isAdminRoute) {
    return null;
  }
  
  return <Navbar />;
};

// Component to conditionally show footer
const ConditionalFooter = () => {
  const location = window.location.pathname;
  const isAdminRoute = location.startsWith('/admin');
  
  if (isAdminRoute) {
    return null;
  }
  
  return <Footer />;
};

export default App;