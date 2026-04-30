import React, { useState, useRef } from 'react';
import { FaLifeRing, FaBolt, FaChartLine, FaWallet, FaUser, FaQuestionCircle } from 'react-icons/fa';
import './Help.css';
import Chatbot from '../components/Chatbot';
import HelpTopicModal from '../components/HelpTopicModal';

const helpTopics = [
  {
    icon: <FaLifeRing size={38} color="#1976d2" />, title: 'General Help', desc: 'Get started, navigation, and common questions.', topics: 12,
    content: (
      <>
        <b>Getting Started:</b> Learn how to use the dashboard, navigate between sections, and understand the main features.<br/><br/>
        <b>Navigation:</b> Use the sidebar to access Expenses, Investments, Stocks, Tax Profile, and more.<br/><br/>
        <b>Common Questions:</b> How to log in/out, reset your password, and personalize your experience.
      </>
    )
  },
  {
    icon: <FaWallet size={38} color="#00b894" />, title: 'Expenses', desc: 'How to add, edit, and track your expenses.', topics: 8,
    content: (
      <>
        <b>Adding Expenses:</b> Go to the Expenses tab and click "Add Expense".<br/><br/>
        <b>Editing/Deleting:</b> Click on an expense to edit or delete it.<br/><br/>
        <b>Tracking:</b> View expense history and trends in the Expenses section.
      </>
    )
  },
  {
    icon: <FaChartLine size={38} color="#6c47e0" />, title: 'Investments', desc: 'Manage your investment portfolio and returns.', topics: 10,
    content: (
      <>
        <b>Investment Goals:</b> Set and track your investment goals.<br/><br/>
        <b>Performance:</b> Monitor your investment returns and portfolio growth.<br/><br/>
        <b>Reports:</b> Access detailed investment reports for insights.
      </>
    )
  },
  {
    icon: <FaBolt size={38} color="#f7b731" />, title: 'Stocks', desc: 'Track, buy, and sell stocks in your account.', topics: 7,
    content: (
      <>
        <b>Buying/Selling:</b> Use the Stocks tab to buy or sell stocks.<br/><br/>
        <b>Portfolio:</b> View your stock holdings and performance.<br/><br/>
        <b>Analytics:</b> Analyze stock trends and make informed decisions.
      </>
    )
  },
  {
    icon: <FaUser size={38} color="#1976d2" />, title: 'My Account', desc: 'Profile, settings, and account security.', topics: 6,
    content: (
      <>
        <b>Profile:</b> Update your personal information and preferences.<br/><br/>
        <b>Settings:</b> Change your password, email, and notification preferences.<br/><br/>
        <b>Security:</b> Enable two-factor authentication for added security.
      </>
    )
  },
  {
    icon: <FaQuestionCircle size={38} color="#d63031" />, title: 'Other', desc: 'Reports, tax, and miscellaneous help.', topics: 5,
    content: (
      <>
        <b>Tax Reports:</b> Generate and download tax-related reports.<br/><br/>
        <b>Support:</b> Contact support for additional help.<br/><br/>
        <b>Miscellaneous:</b> Find answers to other questions not covered above.
      </>
    )
  },
];

export default function Help() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [search, setSearch] = useState('');
  const cardRefs = useRef([]);
  const [highlightedIdx, setHighlightedIdx] = useState(null);

  const handleCardClick = (topic) => {
    setModalTitle(topic.title);
    setModalContent(topic.content);
    setModalOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const idx = helpTopics.findIndex(
      t => t.title.toLowerCase() === search.trim().toLowerCase()
    );
    if (idx !== -1 && cardRefs.current[idx]) {
      cardRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedIdx(idx);
      setTimeout(() => setHighlightedIdx(null), 1200);
    }
  };

  return (
    <div className="help-container">
      {/* Hero Section */}
      <div className="help-hero">
        <div className="help-hero-overlay">
          <h1 className="help-hero-title">How can we help?</h1>
          <form className="help-search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for a topic or question"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit"><FaQuestionCircle size={22} /></button>
          </form>
        </div>
      </div>
      {/* Topics Section */}
      <div className="help-main">
        <h2 className="help-main-title">What do you need help with?</h2>
        <p className="help-main-desc">Find answers about expenses, investments, stocks, your account, and more.</p>
        <div className="help-topics-grid">
          {helpTopics.map((topic, idx) => (
            <div
              className="help-topic-card"
              key={topic.title}
              ref={el => cardRefs.current[idx] = el}
              onClick={() => handleCardClick(topic)}
              style={{ cursor: 'pointer', boxShadow: highlightedIdx === idx ? '0 0 0 4px #1976d2aa' : undefined }}
            >
              <div className="help-topic-icon">{topic.icon}</div>
              <div className="help-topic-title">{topic.title}</div>
              <div className="help-topic-desc">{topic.desc}</div>
              <div className="help-topic-footer"><span className="help-topic-arrow">→</span></div>
            </div>
          ))}
        </div>
        {/* Chatbot Section */}
        <div style={{ margin: '48px auto 0 auto', maxWidth: 420 }}>
          <Chatbot />
        </div>
        <p style={{ marginTop: 24, fontWeight: 500 }}>
          For further support, email us at <a href="mailto:ask.finsmart@gmail.com">ask.finsmart@gmail.com</a>
        </p>
      </div>
      <HelpTopicModal open={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} content={modalContent} />
    </div>
  );
} 