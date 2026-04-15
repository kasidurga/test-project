import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ConfigPage() {
  const navigate = useNavigate();
  // State for the form inputs matching your DBeaver settings
  const [form, setForm] = useState({ 
    host: "", 
    dbname: "", 
    user: "", 
    pass: "", 
    port: "5432" 
  });
  const [isTested, setIsTested] = useState(false);

  const handleTest = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/execute-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connection: form, sql: "SELECT 1" }),
      });

      if (response.ok) {
        alert("Connection Successful! ✅");
        setIsTested(true);
      } else {
        const err = await response.json();
        alert("Connection Failed: " + err.message);
        setIsTested(false);
      }
    } catch (error) {
      alert("Backend server not running. Ensure server.js is active.");
    }
  };

  const handleSave = () => {
    // 1. Get existing connections from storage
    const existing = JSON.parse(localStorage.getItem("all_connections") || "[]");
    
    // 2. Add the new connection with a unique ID and a display name
    const newConn = { 
      ...form, 
      id: Date.now(), 
      displayName: `${form.dbname} (${form.host})` 
    };
    
    // 3. Save the updated list back to localStorage
    const updatedList = [...existing, newConn];
    localStorage.setItem("all_connections", JSON.stringify(updatedList));
    
    alert("Connection saved to dropdown list!");
    navigate("/query");
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: "500px" }}>
        <h2 style={{ color: "white", marginBottom: "5px" }}>DB Configuration ✅</h2>
        <p style={{ color: "#ccc", marginBottom: "20px" }}>Set up your PostgreSQL connection details.</p>

        <div className="form-group">
          <input type="text" placeholder="Host (e.g. localhost)" className="config-input"
            onChange={(e) => { setForm({...form, host: e.target.value}); setIsTested(false); }} />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Database Name" className="config-input"
            onChange={(e) => { setForm({...form, dbname: e.target.value}); setIsTested(false); }} />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Username" className="config-input"
            onChange={(e) => { setForm({...form, user: e.target.value}); setIsTested(false); }} />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" className="config-input"
            onChange={(e) => { setForm({...form, pass: e.target.value}); setIsTested(false); }} />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "center" }}>
          <button className="test-btn" onClick={handleTest}>Test Connection</button>
          <button 
            className="save-btn" 
            disabled={!isTested} 
            onClick={handleSave}
            style={{ opacity: isTested ? 1 : 0.5 }}
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigPage;