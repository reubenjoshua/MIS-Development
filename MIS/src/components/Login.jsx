import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        if (onLogin) onLogin();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Management Information System</h2>
        <label style={styles.label} htmlFor="username">Username</label>
        <input
          style={styles.input}
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <label style={styles.label} htmlFor="password">Password</label>
        <input
          style={styles.input}
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <div style={styles.error}>{error}</div>}
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff',
  },
  card: {
    background: '#fff',
    padding: '2rem 2.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '340px',
    maxWidth: '90vw',
  },
  title: {
    marginBottom: '1.5rem',
    fontWeight: 400,
    fontSize: '1.15rem',
    textAlign: 'left',
  },
  label: {
    fontSize: '0.95rem',
    marginBottom: '0.25rem',
    marginTop: '0.5rem',
    textAlign: 'left',
  },
  input: {
    border: '1px solid #888',
    borderRadius: '8px',
    padding: '0.4rem 0.7rem',
    marginBottom: '0.7rem',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    marginTop: '0.7rem',
    background: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    alignSelf: 'center',
    minWidth: '90px',
  },
  error: {
    color: 'red',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
    textAlign: 'center',
  }
};

export default Login; 