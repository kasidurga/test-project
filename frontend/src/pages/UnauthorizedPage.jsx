import React from 'react';
import '../styles/UnauthorizedPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * UnauthorizedPage - Displayed when user lacks permissions
 */
const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-box">
        <h1>🚫 Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p className="user-role">Your role: <strong>{user?.role}</strong></p>
        <button 
          onClick={() => navigate('/')}
          className="back-button"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
