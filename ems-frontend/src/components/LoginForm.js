import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterForm.css';

const LoginForm = () => {
  const [form, setForm] = useState({ userName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const contentType = res.headers.get('content-type');
      const data = contentType?.includes('application/json') ? await res.json() : await res.text();

      if (!res.ok) {
        throw new Error((data && data.error) || data || 'Login failed');
      }

      if (data && data.token) {
        localStorage.setItem('token', data.token);
      }

      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} style={{ maxWidth: 420, marginTop: 60 }}>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <div className="form-row">
        <label>Username</label>
        <input type="text" name="userName" value={form.userName} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <button
        type="button"
        className="signup-btn"
        style={{ marginTop: 16, background: '#fff', color: '#1976d2', border: '1.5px solid #1976d2', fontWeight: 600 }}
        onClick={() => navigate('/register')}
      >
        Don't have an account? Register
      </button>
    </form>
  );
};

export default LoginForm;
