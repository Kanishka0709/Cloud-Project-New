import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import testimonialImg from '../api/assets/hero-image.jpg';
import { getUsers } from '../api/userApi';

const testimonial = {
  quote: '"BearPlex helped us build systems to streamline our processes and solved problems with brilliant approach."',
  name: 'Arthur J. Nicol',
  title: 'CFO, Founder',
  company: 'The Medside',
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    
    try {
      // First, validate if the email exists in the system
      const usersResponse = await getUsers();
      const users = usersResponse.data || [];
      
      // Check if the email exists in any user account
      const userExists = users.some(user => 
        user.email && user.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!userExists) {
        setError('No account found with this email address. Please check your email or sign up for a new account.');
        setLoading(false);
        return;
      }
      
      // If email exists, proceed with password reset
      await axios.post('/api/auth/forgot-password', { email });
      setMessage('Check your email for a reset code.');
      setTimeout(() => {
        navigate('/reset-password');
      }, 1500);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No account found with this email address. Please check your email or sign up for a new account.');
      } else {
        setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
      }
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
      {/* Right: Forgot Password Form */}
      <div className="login-split-right">
        <div className="login-form-card">
          <h2 className="login-form-title">Forgot Password</h2>
          <p className="login-form-desc">Enter the email address you used when creating your account.</p>
          <form onSubmit={handleSubmit} className="login-form-modern">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="login-signin-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
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

export default ForgotPassword; 