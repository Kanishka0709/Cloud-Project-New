import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import testimonialImg from '../api/assets/hero-image.jpg';

const testimonial = {
  quote: '"BearPlex helped us build systems to streamline our processes and solved problems with brilliant approach."',
  name: 'Arthur J. Nicol',
  title: 'CFO, Founder',
  company: 'The Medside',
};

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-fill token from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await axios.post('/api/auth/reset-password', { token, newPassword });
      setMessage('Password reset successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      {/* Left: Testimonial/Image */}
      <div className="login-split-left">
        <img src={testimonialImg} alt="Testimonial" className="login-split-img" />
        <div className="login-split-overlay">
          <div className="login-split-quote">{testimonial.quote}</div>
          <div className="login-split-name">{testimonial.name}</div>
          <div className="login-split-title">{testimonial.title} <span className="login-split-company">{testimonial.company}</span></div>
        </div>
      </div>
      {/* Right: Reset Password Form */}
      <div className="login-split-right">
        <div className="login-form-card">
          <h2 className="login-form-title">Reset Password</h2>
          <p className="login-form-desc">Enter your reset code and new password.</p>
          <form onSubmit={handleSubmit} className="login-form-modern">
            <label>Reset Code</label>
            <input
              type="text"
              placeholder="Enter your reset code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-signin-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            {message && <div style={{ color: 'green', marginTop: 8 }}>{message}</div>}
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          </form>
          <div className="login-signup-link">
            Remembered your password? <span onClick={() => navigate('/login')}>Sign in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 