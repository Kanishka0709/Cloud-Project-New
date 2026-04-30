import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import { addUser, getUsers } from '../api/userApi';
import testimonialImg from '../api/assets/hero-image.jpg'; // Use the same hero image as Login

const testimonial = {
  quote: '"BearPlex helped us build systems to streamline our processes and solved problems with brilliant approach."',
  name: 'Arthur J. Nicol',
  title: 'CFO, Founder',
  company: 'The Medside',
};

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [dob, setDob] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!firstName || firstName.length < 2) return 'First name is required (min 2 chars).';
    if (!lastName || lastName.length < 2) return 'Last name is required (min 2 chars).';
    if (!username || username.length < 3) return 'Username is required (min 3 chars).';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return 'Valid email is required.';
    if (!address || address.length < 5) return 'Address is required (min 5 chars).';
    if (!contactNumber || !/^[6-9]\d{9}$/.test(contactNumber)) return 'Valid Indian contact number is required.';
    if (!city) return 'City is required.';
    if (!state) return 'State is required.';
    if (!password || password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await addUser({
        firstName,
        lastName,
        username,
        email,
        address,
        contactNumber,
        city,
        state,
        password
      });
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('Username or email already exists.');
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="signup-split-container">
      {/* Left: Testimonial/Image */}
      <div className="signup-split-left">
        <img src={testimonialImg} alt="Testimonial" className="signup-split-img" />
        {/* Removed testimonial overlay content */}
      </div>
      {/* Right: Signup Form */}
      <div className="signup-split-right">
        <div className="signup-form-card">
          <h2 className="signup-form-title">Create account</h2>
          <p className="signup-form-desc">For business, demo or reliability.</p>
          <form onSubmit={handleSignup} className="signup-form signup-form-modern">
            <div className="signup-form-row">
              <div className="signup-form-col">
                <label className="signup-form-label">First Name</label>
                <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div className="signup-form-col">
                <label className="signup-form-label">Last Name</label>
                <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="signup-form-row">
              <div className="signup-form-col">
                <label className="signup-form-label">Username</label>
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
              <div className="signup-form-col">
                <label className="signup-form-label">Email</label>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="signup-form-row">
              <div className="signup-form-col">
                <label className="signup-form-label">Address</label>
                <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
              </div>
              <div className="signup-form-col">
                <label className="signup-form-label">Contact Number</label>
                <input type="text" placeholder="Contact Number" value={contactNumber} onChange={e => setContactNumber(e.target.value)} required />
              </div>
            </div>
            <div className="signup-form-row">
              <div className="signup-form-col">
                <label className="signup-form-label">City</label>
                <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required />
              </div>
              <div className="signup-form-col">
                <label className="signup-form-label">State</label>
                <input type="text" placeholder="State" value={state} onChange={e => setState(e.target.value)} required />
              </div>
            </div>
            <div className="signup-form-row">
              <div className="signup-form-col">
                <label className="signup-form-label">Password</label>
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="signup-form-col">
                <label className="signup-form-label">Confirm Password</label>
                <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
            </div>
             <div className="signup-form-row">
                <div className="signup-form-col-full">
                    <label className="signup-form-checkbox-label">
                        <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                        Show Password
                    </label>
                </div>
            </div>
            <button type="submit" className="signup-form-btn">Create account</button>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
