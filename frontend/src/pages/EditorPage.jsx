import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { queryApi, dbConfigApi } from '../utils/api';
import '../styles/EditorPage.css';

/**
 * EditorPage - Query editor page (accessible to all authenticated users)
 * 
 * Features:
 * - SQL query editor
 * - Database selection dropdown
 * - Query execution using /api/query/run endpoint
 * - Results display
 */
const EditorPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [loadingDatabases, setLoadingDatabases] = useState(true);

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    try {
      setLoadingDatabases(true);
      const response = await dbConfigApi.getAll();
      setDatabases(response.data);
      if (response.data.length > 0) {
        setSelectedDatabase(response.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch databases:', err);
      setError('Failed to load database configurations');
    } finally {
      setLoadingDatabases(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExecute = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    if (!selectedDatabase) {
      setError('Please select a database');
      return;
    }

    const configId = Number(selectedDatabase);
    if (Number.isNaN(configId) || configId <= 0) {
      setError('Please select a valid database configuration');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await queryApi.runQuery(query, configId);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Query execution failed');
      console.error('Query execution failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-left">
            <h2>Query Editor</h2>
          </div>
          <div className="nav-menu">
            <button onClick={() => navigate('/editor')} className="nav-link active">
              📝 Editor
            </button>
            <button onClick={() => navigate('/query')} className="nav-link">
              🔍 Query
            </button>
            <button onClick={() => navigate('/reports')} className="nav-link">
              📊 Reports
            </button>
            {user?.role === 'admin' && (
              <button onClick={() => navigate('/config')} className="nav-link">
                ⚙️ Config
              </button>
            )}
          </div>
          <div className="nav-right">
            <span className="user-info">👤 {user?.username} ({user?.role})</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="page-content">
        {error && <div className="error-message">{error}</div>}

        <div className="editor-card">
          <h3>SQL Query</h3>

          <div className="form-group">
            <label htmlFor="database-select">Select PostgreSQL Database</label>
            {loadingDatabases ? (
              <p className="loading-text">Loading databases...</p>
            ) : databases.length === 0 ? (
              <p className="no-databases">
                No PostgreSQL databases configured. Ask your admin to add one in the Configuration page.
              </p>
            ) : (
              <select
                id="database-select"
                value={selectedDatabase}
                onChange={(e) => setSelectedDatabase(e.target.value)}
                className="database-select"
                disabled={loading}
              >
                <option value="">-- Select a database --</option>
                {databases.map((db) => (
                  <option key={db.id} value={db.id}>
                    {db.name} ({db.host}:{db.port}/{db.database})
                  </option>
                ))}
              </select>
            )}
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SELECT * FROM users LIMIT 10;"
            className="query-textarea"
            disabled={loading}
          />
          <button onClick={handleExecute} className="execute-btn" disabled={loading || !selectedDatabase}>
            {loading ? 'Executing...' : 'Execute Query'}
          </button>
        </div>

        {results && (
          <div className="results-card">
            <h3>Query Results</h3>
            {Array.isArray(results) && results.length > 0 ? (
              <table className="results-table">
                <thead>
                  <tr>
                    {Object.keys(results[0]).map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((value, colIdx) => (
                        <td key={`${idx}-${colIdx}`}>{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-results">Query executed successfully. No results to display.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPage;

