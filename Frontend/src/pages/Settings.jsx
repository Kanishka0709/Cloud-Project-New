import React, { useState, useEffect } from 'react';
import './Settings.css';
import avatar from '../api/assets/logo.png'; // Use your logo or a placeholder avatar
import { getUserById, updateUserByUsername } from '../api/userApi';

export default function Settings() {
  const [form, setForm] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      address: user.address || '',
      contactNumber: user.contactNumber || '',
      city: user.city || '',
      state: user.state || '',
    } : {
      firstName: '', lastName: '', username: '', email: '', address: '', contactNumber: '', city: '', state: ''
    };
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Get userId from localStorage
  const userId = JSON.parse(localStorage.getItem('user'))?.id;
  const username = form.username;

  useEffect(() => {
    if (userId) {
      getUserById(userId)
        .then(res => {
          setForm(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => setError('Failed to fetch user info.'));
    }
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!username) {
      setError('Username not found. Please log in again.');
      return;
    }
    updateUserByUsername(username, form)
      .then((res) => {
        setSuccess('Profile updated successfully!');
        localStorage.setItem('user', JSON.stringify(res.data || form));
      })
      .catch(err => setError('Failed to update profile. ' + (err.response?.data?.message || '')));
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <div className="settings-header">
          <h2>Edit profile</h2>
          <img src={avatar} alt="Profile" className="settings-avatar" />
        </div>
        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="settings-row">
            <div className="settings-field">
              <label>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required />
            </div>
            <div className="settings-field">
              <label>Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" required />
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-field">
              <label>Username</label>
              <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
            </div>
            <div className="settings-field">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required readOnly />
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-field" style={{ flex: 2 }}>
              <label>Address</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
            </div>
            <div className="settings-field" style={{ flex: 1 }}>
              <label>Contact Number</label>
              <input name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Contact Number" required />
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-field">
              <label>City</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
            </div>
            <div className="settings-field">
              <label>State</label>
              <input name="state" value={form.state} onChange={handleChange} placeholder="State" required />
            </div>
          </div>
          <button type="submit" className="settings-save-btn">Save Changes</button>
          {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
} 