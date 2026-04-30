import React, { useState } from 'react';
import '../styles/Home.css';
import heroImage from '../api/assets/hero-image.jpg';
import stockVideo from '../api/assets/stock-bg.mp4';
import financeImg from '../api/assets/finance-coins-chart.jpg';
import { FaChartLine, FaPiggyBank, FaReceipt, FaLock, FaUserPlus, FaWallet, FaCheckCircle, FaBullseye, FaArrowRight } from 'react-icons/fa';

const slides = [
  {
    subheading: 'WE ARE HERE',
    headline: 'TO MANAGE\nYOUR FINANCES',
    text: 'Your all-in-one personal finance companion. Take control of your money, investments, and taxes with ease.',
    image: heroImage,
  },
  {
    subheading: 'SMART SOLUTIONS',
    headline: 'TRACK, PLAN\nAND GROW',
    text: 'Monitor expenses, plan investments, and simplify your tax journey with Finsmart Finances.',
    image: heroImage,
  },
];

const features = [
  {
    icon: <FaReceipt className="feature-icon" />, title: 'Track Expenses', desc: 'Easily record and categorize your daily spending.'
  },
  {
    icon: <FaPiggyBank className="feature-icon" />, title: 'Grow Investments', desc: 'Monitor and analyze your investment portfolio.'
  },
  {
    icon: <FaChartLine className="feature-icon" />, title: 'Smart Reports', desc: 'Visualize your financial health with insightful charts.'
  },
  {
    icon: <FaLock className="feature-icon" />, title: 'Secure & Private', desc: 'Your data is encrypted and protected at all times.'
  },
];

const steps = [
  { icon: <FaUserPlus />, label: 'Sign Up', desc: 'Create your free account in seconds.' },
  { icon: <FaWallet />, label: 'Connect Accounts', desc: 'Add your expenses, investments, and stocks.' },
  { icon: <FaCheckCircle />, label: 'Track & Analyze', desc: 'Monitor your finances with real-time charts.' },
  { icon: <FaBullseye />, label: 'Achieve Goals', desc: 'Set and reach your financial targets.' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Financial Analyst',
    content: 'Finsmart has completely transformed how I manage my finances. The investment tracking is incredible!',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Entrepreneur',
    content: 'The expense tracking and tax features saved me hours every month. Highly recommended!',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Student',
    content: 'Perfect for beginners! The interface is intuitive and the reports are so helpful.',
    rating: 5
  }
];

const stats = [
  { number: '10K+', label: 'Active Users' },
  { number: '$2M+', label: 'Assets Tracked' },
  { number: '95%', label: 'User Satisfaction' },
  { number: '24/7', label: 'Support Available' }
];

export default function Home() {
  const [current] = useState(0);

  return (
    <div className="home-container">
      {/* Hero Section (fills viewport) with video background */}
      <div className="hero-full-bg" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        {/* Video background */}
        <video className="hero-bg-video" src={stockVideo} autoPlay loop muted playsInline />
        {/* Semi-transparent overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.45)', // dark overlay, adjust alpha for more/less transparency
          zIndex: 1
        }} />
        {/* Content above video */}
        <div className="hero-content-row d-flex align-items-center justify-content-between px-4 py-5" style={{ width: '100%', position: 'relative', zIndex: 2 }}>
          {/* Left: Text Content */}
          <div className="hero-content-left text-start">
            {/* Logo and App Name */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.2rem' }}>
              {/* <img src={logo} alt="FinSmart Logo" style={{ width: '72px', height: '72px', borderRadius: '16px', marginRight: '18px', boxShadow: '0 4px 16px rgba(25, 118, 210, 0.18)' }} /> */}
              <span style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', textShadow: '0 4px 16px rgba(25, 118, 210, 0.18)' }}>Finsmart Finances</span>
            </div>
            {/* Tagline */}
            <div style={{ fontSize: '1.25rem', color: '#e3eeff', fontWeight: 500, marginBottom: '1.5rem', textShadow: '0 2px 8px rgba(25, 118, 210, 0.10)' }}>
              Your smart way to manage, grow, and secure your money.
            </div>
            <div className="hero-subheading mb-2 animate__animated animate__fadeInDown">{slides[current].subheading}</div>
            <h1 className="hero-main-heading mb-3 animate__animated animate__fadeInUp">
              {slides[current].headline.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
            </h1>
            <p className="hero-support-text mb-4 animate__animated animate__fadeInUp animate__delay-1s">{slides[current].text}</p>
            <div className="hero-buttons d-flex gap-3 flex-wrap">
              <button className="pill-btn-white" onClick={() => window.location.href = '/login'}>
                START JOURNEY <FaArrowRight className="arrow ms-2" />
              </button>
              <button className="pill-btn-outline" onClick={() => window.location.href = '/signup'}>
                SIGN UP FREE
              </button>
            </div>
          </div>
          {/* Right: Finance Image (coins and chart) */}
          <div className="hero-content-right d-flex align-items-center justify-content-center">
            <img src={financeImg} alt="Finance Coins and Chart" className="hero-image-circle" style={{ objectFit: 'cover', border: '8px solid #fff', boxShadow: '0 12px 40px rgba(25, 118, 210, 0.18)' }} />
          </div>
        </div>
      </div>

      {/* Feature Highlights Section */}
      <div className="feature-highlights-section container py-5" style={{ marginTop: '60px' }}>
        <div className="row justify-content-center mb-4">
          <h2 className="section-title text-center" style={{ marginTop: '2.5rem', marginBottom: '2rem', fontWeight: 800, fontSize: '2.1rem', letterSpacing: '1px' }}>
            Why Choose <span className="brand-highlight">Finsmart</span>?
          </h2>
        </div>
        <div className="row justify-content-center g-4">
          {features.map((f, idx) => (
            <div className="col-12 col-sm-6 col-md-3 d-flex align-items-stretch" key={idx}>
              <div className="feature-card text-center p-4 w-100">
                {f.icon}
                <h5 className="feature-title mt-3 mb-2">{f.title}</h5>
                <p className="feature-desc mb-0">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-section py-5">
        <div className="container">
          <div className="row justify-content-center g-4">
            {stats.map((stat, idx) => (
              <div className="col-6 col-md-3 text-center" key={idx}>
                <div className="stat-card">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center mb-5">How It Works</h2>
          <div className="row justify-content-center align-items-center">
            {steps.map((step, idx) => (
              <div className="col-6 col-md-3 text-center mb-4 mb-md-0" key={idx}>
                <div className="how-step-icon mb-3">{step.icon}</div>
                <div className="how-step-label fw-bold mb-2">{step.label}</div>
                <div className="how-step-desc text-muted">{step.desc}</div>
                {idx < steps.length - 1 && (
                  <div className="how-step-arrow d-none d-md-block">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section py-5">
        <div className="container">
          <h2 className="section-title text-center mb-5">What Our Users Say</h2>
          <div className="row justify-content-center g-4">
            {testimonials.map((testimonial, idx) => (
              <div className="col-12 col-md-4" key={idx}>
                <div className="testimonial-card text-center p-4 h-100">
                  <div className="testimonial-stars mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} style={{ color: '#ffc107', fontSize: '1.2rem' }}>★</span>
                    ))}
                  </div>
                  <p className="testimonial-content mb-3">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <div className="text-muted small">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="get-started-section py-5">
        <div className="container text-center">
          <h2 className="section-title mb-4">Ready to Start Your Financial Journey?</h2>
          <p className="section-subtitle mb-5">Join thousands of users who are already managing their finances smarter with Finsmart.</p>
          <button className="get-started-btn" onClick={() => window.location.href = '/login'}>
            Get Started Now <FaArrowRight className="arrow ms-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
