import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function QueryEditorPage() {
  const [connections, setConnections] = useState([]);
  const [selectedConnId, setSelectedConnId] = useState("");
  const [query, setQuery] = useState("select * from emp");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Load all saved connections when the page opens
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("all_connections") || "[]");
    setConnections(saved);
  }, []);

  const handleExecute = async () => {
    setError("");
    if (!selectedConnId) return alert("Please select a database from the dropdown!");

    // Find the connection details for the selected ID
    const selectedDetails = connections.find(c => c.id.toString() === selectedConnId);

    try {
      const response = await fetch('http://localhost:5000/api/execute-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connection: selectedDetails, sql: query }),
      });

      const data = await response.json();
      if (response.ok) {
        setResults(data.rows);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to connect to backend server.");
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="login-container" style={{ maxWidth: '1000px', paddingTop: '20px' }}>
        <div className="login-card" style={{ width: '100%' }}>
          <h2 style={{ color: "white" }}>SQL Query Editor</h2>
          
          {/* Dynamic Dropdown List */}
          <select 
            value={selectedConnId} 
            onChange={(e) => setSelectedConnId(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '4px', marginBottom: '15px' }}
          >
            <option value="">-- Choose Configured Database --</option>
            {connections.map((conn) => (
              <option key={conn.id} value={conn.id}>{conn.displayName}</option>
            ))}
          </select>

          <textarea 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', height: '100px', fontFamily: 'monospace', padding: '10px' }}
          />
          
          <button className="primary-button" onClick={handleExecute} style={{ marginTop: '10px' }}>
            Execute Query
          </button>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: "white" }}>Query Output</h3>
            {error && <p style={{ color: '#ff4d4f', background: 'rgba(255,255,255,0.1)', padding: '10px' }}>{error}</p>}
            
            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '4px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#333' }}>
                <thead>
                  <tr style={{ backgroundColor: '#764ba2', color: 'white' }}>
                    {results.length > 0 && Object.keys(results[0]).map(key => (
                      <th key={key} style={{ padding: '10px', border: '1px solid #ddd' }}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td key={i} style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {/* Fix for [object Object] error: check if value is an object */}
                          {typeof val === 'object' && val !== null 
                            ? JSON.stringify(val) 
                            : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueryEditorPage;