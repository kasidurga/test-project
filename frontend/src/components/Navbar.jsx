import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  // Retrieve the logged-in user's name and role from localStorage
  const userName = localStorage.getItem("userName") || "Guest";
  const userRole = localStorage.getItem("role") || "user";

  const handleLogout = () => {
    // Clear all session data to start fresh
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#764ba2',
      color: 'white',
      marginBottom: '20px'
    }}>
      <div>
        <strong>Logged in as:</strong> {userName} ({userRole})
      </div>
      <button 
        onClick={handleLogout}
        style={{
          padding: '5px 15px',
          backgroundColor: '#ff4b2b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;