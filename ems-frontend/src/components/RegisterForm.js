import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterForm.css';

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: '',
    userName: '',
    email: '',
    password: '',
    roleNames: ['ROLE_USER']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setForm((prev) => ({ ...prev, roleNames: [e.target.value] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const contentType = res.headers.get('content-type');
      const data = contentType?.includes('application/json') ? await res.json() : await res.text();

      if (!res.ok) {
        throw new Error((data && data.error) || data || 'Registration failed');
      }

      setSuccess(typeof data === 'string' ? data : (data.message || 'Registration successful'));
      setForm({ name: '', userName: '', email: '', password: '', roleNames: ['ROLE_USER'] });

      // Redirect to login
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <div className="form-row">
        <label>name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <label>userName</label>
        <input type="text" name="userName" value={form.userName} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <label>email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <label>password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required autoComplete="current-password" />
      </div>
      <div className="form-row">
        <label>roleNames</label>
        <div className="role-radio-group">
          <label className="role-radio">
            <input
              type="radio"
              name="roleNames"
              value="ROLE_ADMIN"
              checked={form.roleNames[0] === 'ROLE_ADMIN'}
              onChange={handleRoleChange}
            />
            Admin
          </label>
          <label className="role-radio">
            <input
              type="radio"
              name="roleNames"
              value="ROLE_USER"
              checked={form.roleNames[0] === 'ROLE_USER'}
              onChange={handleRoleChange}
            />
            User
          </label>
        </div>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>

      <button
        type="button"
        onClick={() => navigate('/login')}
        style={{ marginTop: 10, background: '#fff', color: '#1976d2', border: '1.5px solid #1976d2', fontWeight: 600 }}
      >
        Already have an account? Login
      </button>
    </form>
  );
};

export default RegisterForm;
