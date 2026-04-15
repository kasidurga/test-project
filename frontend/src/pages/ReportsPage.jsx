import React from 'react';
import '../styles/ReportsPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ReportsPage - Reports page (accessible to all authenticated users)
 * 
 * Features:
 * - Report generation
 * - Data visualization
 * - Export options
 */
const ReportsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-left">
            <h2>Reports</h2>
          </div>
          <div className="nav-menu">
            <button 
              onClick={() => navigate('/editor')}
              className="nav-link"
            >
              📝 Editor
            </button>
            <button 
              onClick={() => navigate('/query')}
              className="nav-link"
            >
              🔍 Query
            </button>
            <button 
              onClick={() => navigate('/reports')}
              className="nav-link active"
            >
              📊 Reports
            </button>
            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/config')}
                className="nav-link"
              >
                ⚙️ Config
              </button>
            )}
          </div>
          <div className="nav-right">
            <span className="user-info">👤 {user?.username} ({user?.role})</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      <div className="page-content">
        <div className="reports-card">
          <h3>Available Reports</h3>
          <div className="reports-list">
            <div className="report-item">
              <h4>📊 User Activity Report</h4>
              <p>View user login and activity statistics</p>
              <button className="view-btn">View Report</button>
            </div>
            <div className="report-item">
              <h4>📈 Database Performance</h4>
              <p>Monitor database query performance and metrics</p>
              <button className="view-btn">View Report</button>
            </div>
            <div className="report-item">
              <h4>🔍 System Logs</h4>
              <p>Review system and application logs</p>
              <button className="view-btn">View Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
