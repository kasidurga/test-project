import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // KEEPING YOUR EXACT LOGIC BELOW
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("token", "true");
      localStorage.setItem("role", "admin");
      navigate("/db-config");
    } else if (username === "user1" && password === "pass123") {
      localStorage.setItem("token", "true");
      localStorage.setItem("role", "user");
      navigate("/query");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h2 style={styles.title}>Auth Application</h2>
        <p style={styles.subtitle}>Please enter your details</p>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              style={styles.input}
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              style={styles.input}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// Modern UI Styles
const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  loginCard: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '26px',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginBottom: '25px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    marginTop: '10px',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#764ba2',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};

export default LoginPage;