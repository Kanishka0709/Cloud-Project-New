// src/pages/Investment.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartLine, FaPiggyBank, FaWallet, FaPercent, FaGift, FaUser, FaDollarSign, FaDownload } from 'react-icons/fa';
import './Investment.css';
import { getInvestments, addInvestment, updateInvestment, deleteInvestment, getTransactions, addTransaction, deleteTransaction, updateTransaction } from '../api/investmentApi';
import SIPCalculator from '../components/SIPCalculator';

// Mock data
// Remove mock topCards and investedFunds

const portfolioCards = [
  { label: '20% Off', sub: 'Our Your Invest', icon: <FaGift size={28} color="#f7b731" />, bg: '#fffbe7' },
  { label: 'Demographic', value: '30', icon: <FaUser size={28} color="#20bf6b" />, bg: '#fdf3f3' },
  { label: 'Earning', value: '$5897', icon: <FaDollarSign size={28} color="#8854d0" />, bg: '#f3f8fa' },
];

export default function Investment() {
  // Authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // CRUD state for investment goals
  const [goals, setGoals] = useState([]);
  const [goalForm, setGoalForm] = useState({ 
    goal_name: '', 
    start_date: '', 
    end_date: '', 
    status: '', 
    target_amount: '', 
    user_id: 1,
    isSIP: false,
    sipFrequency: '',
    sipAmount: '',
    nextScheduledInvestment: ''
  });
  const [editGoalId, setEditGoalId] = useState(null);
  const [editGoalForm, setEditGoalForm] = useState(goalForm);
  const [goalError, setGoalError] = useState('');
  const [goalSuccess, setGoalSuccess] = useState('');

  // CRUD state for investment transactions
  const [transactions, setTransactions] = useState([]);
  const [txForm, setTxForm] = useState({ 
    amount: '', 
    date_time: '', 
    mode: '', 
    note: '', 
    goal_id: '',
    transactionType: 'investment' // Add transaction type
  });
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [txError, setTxError] = useState('');
  const [txSuccess, setTxSuccess] = useState('');

  // CRUD state for investment transactions (edit)
  const [editTxId, setEditTxId] = useState(null);
  const [editTxForm, setEditTxForm] = useState({ 
    amount: '', 
    date_time: '', 
    mode: '', 
    note: '',
    transactionType: 'investment'
  });

  // Pagination state for transactions table
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  // Transaction types for better categorization
  const transactionTypes = [
    { value: 'investment', label: 'Investment' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'dividend', label: 'Dividend' },
    { value: 'interest', label: 'Interest' },
    { value: 'bonus', label: 'Bonus' },
    { value: 'fees', label: 'Fees/Charges' },
    { value: 'transfer', label: 'Transfer' }
  ];

  // Payment modes
  const paymentModes = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online Payment' }
  ];

  // Fetch goals
  const fetchGoals = () => {
    getInvestments()
      .then(res => {
        setGoals(res.data);
        if (res.data.length > 0 && (!selectedGoalId || selectedGoalId === 'undefined')) {
          setSelectedGoalId(String(res.data[0].id));
        }
      })
      .catch((error) => {
        console.error('Error fetching goals:', error);
        if (error.response && error.response.status === 401) {
          setGoalError('Authentication failed. Please log in again.');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          setGoals([]);
        }
      });
  };
  // Check authentication on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      console.log('No user found, redirecting to login');
      window.location.href = '/login';
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      if (userData && userData.username) {
        setIsAuthenticated(true);
        console.log('User authenticated:', userData.username);
      } else {
        console.log('Invalid user data, redirecting to login');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
    }
  }, [isAuthenticated]);

  // Fetch transactions
  const fetchTransactions = () => {
    getTransactions()
      .then(res => {
        setTransactions(res.data);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
        if (error.response && error.response.status === 401) {
          setTxError('Authentication failed. Please log in again.');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          setTransactions([]);
        }
      });
  };
  useEffect(() => { 
    if (isAuthenticated) {
      fetchTransactions(); 
    }
  }, [isAuthenticated]);

  const handleGoalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    console.log('Input change:', { name, value, type, checked, newValue });
    
    if (name === 'isSIP' && !checked) {
      // Clear SIP fields when SIP is disabled
      setGoalForm({ 
        ...goalForm, 
        [name]: newValue,
        sipFrequency: '',
        sipAmount: '',
        nextScheduledInvestment: ''
      });
    } else {
      setGoalForm({ ...goalForm, [name]: newValue });
    }
  };
  const handleGoalEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    if (name === 'isSIP' && !checked) {
      // Clear SIP fields when SIP is disabled
      setEditGoalForm({ 
        ...editGoalForm, 
        [name]: newValue,
        sipFrequency: '',
        sipAmount: '',
        nextScheduledInvestment: ''
      });
    } else {
      setEditGoalForm({ ...editGoalForm, [name]: newValue });
    }
  };
  const handleGoalAdd = (e) => {
    e.preventDefault(); setGoalError(''); setGoalSuccess('');
    
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    if (!user) {
      setGoalError('Please log in to add investment goals.');
      return;
    }
    
    console.log('Form data before destructuring:', goalForm);
    const { user_id, goal_name, start_date, end_date, target_amount, isSIP, sipFrequency, sipAmount, nextScheduledInvestment, ...rest } = goalForm;
    console.log('SIP fields extracted:', { isSIP, sipFrequency, sipAmount, nextScheduledInvestment });
    const goalPayload = {
      goalName: goal_name,
      startDate: start_date,
      endDate: end_date,
      status: rest.status,
      targetAmount: Number(target_amount),
      isSIP: isSIP,
      sipFrequency: sipFrequency,
      sipAmount: sipAmount ? Number(sipAmount) : 0,
      nextScheduledInvestment: nextScheduledInvestment
    };
    console.log('Final payload:', goalPayload);
    console.log('SIP enabled:', isSIP);
    console.log('SIP frequency:', sipFrequency);
    console.log('SIP amount:', sipAmount);
    console.log('Next scheduled investment:', nextScheduledInvestment);
    
    addInvestment(goalPayload)
      .then(() => { 
        setGoalSuccess('Goal added.'); 
        setGoalForm({ 
          ...goalForm, 
          goal_name: '', 
          start_date: '', 
          end_date: '', 
          status: '', 
          target_amount: '',
          isSIP: false,
          sipFrequency: '',
          sipAmount: '',
          nextScheduledInvestment: ''
        }); 
        fetchGoals(); 
      })
      .catch((error) => {
        console.error('Error adding goal:', error);
        if (error.response && error.response.status === 401) {
          setGoalError('Authentication failed. Please log in again.');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else if (error.response && error.response.status === 500) {
          setGoalError('Server error. Please try again or contact support.');
        } else {
          setGoalError('Failed to add goal. Please check your input and try again.');
        }
      });
  };
  const handleGoalEdit = (goal) => {
    setEditGoalId(goal.id);
    // Map camelCase backend fields to snake_case form fields for editing
    setEditGoalForm({
      goal_name: goal.goalName || '',
      start_date: goal.startDate || '',
      end_date: goal.endDate || '',
      status: goal.status || '',
      target_amount: goal.targetAmount || '',
      user_id: goal.userId || 1,
      isSIP: goal.isSIP || false,
      sipFrequency: goal.sipFrequency || '',
      sipAmount: goal.sipAmount || '',
      nextScheduledInvestment: goal.nextScheduledInvestment || ''
    });
  };
  const handleGoalEditSave = (id) => {
    const { user_id, goal_name, start_date, end_date, target_amount, isSIP, sipFrequency, sipAmount, nextScheduledInvestment, ...rest } = editGoalForm;
    const goalPayload = {
      goalName: goal_name,
      startDate: start_date,
      endDate: end_date,
      status: rest.status,
      targetAmount: Number(target_amount),
      isSIP: isSIP,
      sipFrequency: sipFrequency,
      sipAmount: sipAmount ? Number(sipAmount) : 0,
      nextScheduledInvestment: nextScheduledInvestment
    };
    updateInvestment(id, goalPayload)
      .then(() => { setGoalSuccess('Goal updated.'); setGoalError(''); setEditGoalId(null); fetchGoals(); })
      .catch(() => { setGoalError('Failed to update goal.'); setGoalSuccess(''); });
  };
  const handleGoalEditCancel = () => { setEditGoalId(null); };
  const handleGoalDelete = (id) => {
    if (!window.confirm('Delete this goal?')) return;
    deleteInvestment(id)
      .then(() => { setGoalSuccess('Goal deleted.'); fetchGoals(); })
      .catch(() => setGoalError('Failed to delete goal.'));
  };

  const handleTxInputChange = (e) => {
    const { name, value } = e.target;
    setTxForm({ ...txForm, [name]: value });
  };

  // Quick action to set current date/time
  const setCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    setTxForm({ ...txForm, date_time: currentDateTime });
  };
  const handleTxAdd = (e) => {
    e.preventDefault(); 
    setTxError(''); 
    setTxSuccess('');
    
    // Enhanced validation
    if (!selectedGoalId || selectedGoalId === 'undefined') {
      setTxError('Please select a goal.');
      return;
    }
    
    if (!txForm.amount || Number(txForm.amount) <= 0) {
      setTxError('Please enter a valid amount greater than 0.');
      return;
    }
    
    if (!txForm.date_time) {
      setTxError('Please select a date and time.');
      return;
    }
    
    if (!txForm.mode) {
      setTxError('Please select a payment mode.');
      return;
    }
    
    // Build payload as per backend expectation
    let dateTime = txForm.date_time;
    // If dateTime is missing seconds, add ':00'
    if (dateTime && dateTime.length === 16) dateTime = dateTime + ':00';
    
    const txPayload = {
      amount: Number(txForm.amount),
      mode: txForm.mode,
      dateTime: dateTime,
      note: txForm.note,
      goalId: Number(selectedGoalId),
      transactionType: txForm.transactionType
    };
    
    addTransaction(txPayload)
      .then(() => { 
        setTxSuccess('Transaction added successfully!'); 
        setTxForm({ 
          amount: '', 
          date_time: '', 
          mode: '', 
          note: '', 
          goal_id: selectedGoalId,
          transactionType: 'investment'
        }); 
        fetchTransactions(); 
      })
      .catch((error) => {
        console.error('Transaction error:', error);
        if (error.response && error.response.status === 401) {
          setTxError('Authentication failed. Please log in again.');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          setTxError('Failed to add transaction. Please try again.');
        }
      });
  };
  const handleTxEdit = (tx) => {
    setEditTxId(tx.id);
    setEditTxForm({
      amount: tx.amount,
      date_time: tx.dateTime ? tx.dateTime.slice(0, 16) : '',
      mode: tx.mode,
      note: tx.note || '',
      transactionType: tx.transactionType || 'investment'
    });
  };
  const handleTxEditChange = (e) => {
    setEditTxForm({ ...editTxForm, [e.target.name]: e.target.value });
  };
  const handleTxEditSave = (id) => {
    // Enhanced validation for edit
    if (!editTxForm.amount || Number(editTxForm.amount) <= 0) {
      setTxError('Please enter a valid amount greater than 0.');
      return;
    }
    
    if (!editTxForm.date_time) {
      setTxError('Please select a date and time.');
      return;
    }
    
    if (!editTxForm.mode) {
      setTxError('Please select a payment mode.');
      return;
    }
    
    const txPayload = {
      amount: Number(editTxForm.amount),
      mode: editTxForm.mode,
      dateTime: editTxForm.date_time,
      note: editTxForm.note,
      goalId: Number(selectedGoalId),
      transactionType: editTxForm.transactionType
    };
    
    updateTransaction(id, txPayload)
      .then(() => { 
        setTxSuccess('Transaction updated successfully!'); 
        setEditTxId(null); 
        fetchTransactions(); 
      })
      .catch((error) => {
        console.error('Update transaction error:', error);
        if (error.response && error.response.status === 401) {
          setTxError('Authentication failed. Please log in again.');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          setTxError('Failed to update transaction. Please try again.');
        }
      });
  };
  const handleTxEditCancel = () => { setEditTxId(null); };
  const handleTxDelete = (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    deleteTransaction(id)
      .then(() => { setTxSuccess('Transaction deleted.'); fetchTransactions(); })
      .catch(() => setTxError('Failed to delete transaction.'));
  };
  // Filter transactions by selected goal
  const filteredTx = selectedGoalId
    ? transactions.filter(tx => String(tx.goal?.id || tx.goalId) === String(selectedGoalId))
    : [];

  // Pagination logic for transactions table
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTx.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTx.length / transactionsPerPage);

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when goal changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGoalId]);

  // Check for duplicate IDs and warn
  const goalIds = goals.map(g => g.id);
  const hasDuplicateIds = new Set(goalIds).size !== goalIds.length;
  if (hasDuplicateIds) {
    console.warn('Duplicate goal IDs detected in investment goals:', goalIds);
  }

  // Calculate real values from backend data
  const yourInvestment = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0);
  const currentValue = filteredTx.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const roi = yourInvestment > 0 ? (((currentValue - yourInvestment) / yourInvestment) * 100).toFixed(2) : '0.00';
  const indexValue = 41045.12; // Placeholder, replace with real index if available
  const indexChange = '+1500 1.5%'; // Placeholder

  // Format as Indian Rupees
  const formatINR = value => `₹${Number(value).toLocaleString('en-IN')}`;

  // ROI formatting helper
  const formatRoi = roi =>
    roi > 0 ? `+${parseFloat(roi).toFixed(2)}%`
    : roi < 0 ? `-${Math.abs(parseFloat(roi)).toFixed(2)}%`
    : '0.00%';

  // PDF Download Function
  const downloadInvestmentPDF = () => {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    
    // Get current date for the report
    const currentDate = new Date().toLocaleDateString('en-IN');
    
    // Calculate totals
    const totalInvestment = goals.reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0);
    const totalTransactions = filteredTx.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const totalInvested = filteredTx.reduce((sum, tx) => sum + (tx.transactionType === 'withdrawal' || tx.transactionType === 'fees' ? 0 : Number(tx.amount) || 0), 0);
    const totalWithdrawn = filteredTx.reduce((sum, tx) => sum + (tx.transactionType === 'withdrawal' || tx.transactionType === 'fees' ? Number(tx.amount) || 0 : 0), 0);
    const totalReturns = filteredTx.reduce((sum, tx) => sum + (tx.transactionType === 'dividend' || tx.transactionType === 'interest' || tx.transactionType === 'bonus' ? Number(tx.amount) || 0 : 0), 0);
    const roi = totalInvestment > 0 ? (((totalTransactions - totalInvestment) / totalInvestment) * 100).toFixed(2) : '0.00';
    
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Finsmart Finances - Investment Report</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #1976d2;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #1976d2;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .summary {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            flex-wrap: wrap;
          }
          .summary-item {
            text-align: center;
            flex: 1;
            min-width: 150px;
            margin: 10px;
          }
          .summary-item h3 {
            margin: 0;
            color: #1976d2;
            font-size: 16px;
          }
          .summary-item p {
            margin: 5px 0;
            font-size: 20px;
            font-weight: bold;
            color: #333;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #1976d2;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #1976d2;
            color: white;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          @media print {
            body { margin: 0; }
            .summary { page-break-inside: avoid; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Finsmart Finances</h1>
          <p>Investment Portfolio Report</p>
          <p>Generated on: ${currentDate}</p>
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <h3>Total Investment Goals</h3>
            <p>${goals.length}</p>
          </div>
          <div class="summary-item">
            <h3>Total Target Amount</h3>
            <p>${formatINR(totalInvestment)}</p>
          </div>
          <div class="summary-item">
            <h3>Total Invested</h3>
            <p>${formatINR(totalInvested)}</p>
          </div>
          <div class="summary-item">
            <h3>Total Returns</h3>
            <p>${formatINR(totalReturns)}</p>
          </div>
          <div class="summary-item">
            <h3>Total Withdrawn</h3>
            <p>${formatINR(totalWithdrawn)}</p>
          </div>
          <div class="summary-item">
            <h3>ROI</h3>
            <p>${formatRoi(roi)}</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Investment Goals</h2>
          <table>
            <thead>
              <tr>
                <th>Goal Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Target Amount</th>
                <th>SIP</th>
                <th>Frequency</th>
                <th>SIP Amount</th>
              </tr>
            </thead>
            <tbody>
              ${goals.map(goal => `
                <tr>
                  <td>${goal.goalName || 'N/A'}</td>
                  <td>${goal.startDate || 'N/A'}</td>
                  <td>${goal.endDate || 'N/A'}</td>
                  <td>${goal.status || 'N/A'}</td>
                  <td>${formatINR(goal.targetAmount || 0)}</td>
                  <td>${goal.isSIP ? 'Yes' : 'No'}</td>
                  <td>${goal.sipFrequency || 'N/A'}</td>
                  <td>${goal.sipAmount ? formatINR(goal.sipAmount) : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Investment Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date/Time</th>
                <th>Payment Mode</th>
                <th>Note</th>
                <th>Goal</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTx.map(tx => `
                <tr>
                  <td>${transactionTypes.find(t => t.value === tx.transactionType)?.label || 'Investment'}</td>
                  <td>${tx.transactionType === 'withdrawal' || tx.transactionType === 'fees' ? '-' : '+'}${formatINR(tx.amount || 0)}</td>
                  <td>${tx.dateTime ? new Date(tx.dateTime).toLocaleString('en-IN') : 'N/A'}</td>
                  <td>${paymentModes.find(m => m.value === tx.mode)?.label || tx.mode || 'N/A'}</td>
                  <td>${tx.note || 'N/A'}</td>
                  <td>${goals.find(g => String(g.id) === String(tx.goalId))?.goalName || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>This report was generated by Finsmart Finances</p>
          <p>Total Goals: ${goals.length} | Total Transactions: ${filteredTx.length}</p>
        </div>
      </body>
      </html>
    `;
    
    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.print();
      printWindow.close();
    };
  };

  // For Invested Funds Table, use goals
  const investedFunds = goals.map(g => ({
    icon: <FaWallet size={22} color="#4b7bec" />, // Optionally vary icon/color by type
    name: g.goalName,
    id: g.id,
    type: g.status || 'N/A',
    acc: 'Personal account',
    last: g.endDate || '',
    value: g.targetAmount
  }));

  // For Investment Growth Chart, use transactions over time
  const lineData = filteredTx.map(tx => ({
    day: tx.dateTime ? tx.dateTime.slice(5, 10) : '',
    value: Number(tx.amount) || 0
  }));

  // Calculate best performing investment (by targetAmount as a proxy)
  const bestInvestment = goals.reduce((best, g) => {
    return (!best || g.targetAmount > best.targetAmount) ? g : best;
  }, null);
  // Get user age from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userAge = user.age || 'N/A';
  // Calculate total number of investments
  const totalInvestments = goals.length;

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div style={{ 
        background: '#f8fafc', 
        minHeight: '100vh', 
        width: '100%', 
        padding: '32px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#1976d2', marginBottom: '8px' }}>
            Checking authentication...
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Please wait while we verify your login status.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', width: '100%', padding: '32px 0' }}>
      {/* Top Section */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, padding: '0 24px' }}>
        <div style={{ background: '#f3f8fa', borderRadius: 18, padding: '24px 18px', minWidth: 180, flex: 1, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><FaChartLine size={28} color="#1976d2" /><span style={{ fontWeight: 700, fontSize: 16 }}>Index</span></div>
          <div style={{ fontWeight: 900, fontSize: 28, color: '#222', marginBottom: 4 }}>{indexValue}</div>
          <div style={{ fontSize: 13, color: '#20bf6b', fontWeight: 600 }}>{indexChange}</div>
        </div>
        <div style={{ background: '#fffbe7', borderRadius: 18, padding: '24px 18px', minWidth: 180, flex: 1, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><FaPiggyBank size={28} color="#f7b731" /><span style={{ fontWeight: 700, fontSize: 16 }}>Your Investment</span></div>
          <div style={{ fontWeight: 900, fontSize: 28, color: '#222', marginBottom: 4 }}>{formatINR(yourInvestment)}</div>
        </div>
        <div style={{ background: '#f7f3fa', borderRadius: 18, padding: '24px 18px', minWidth: 180, flex: 1, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><FaWallet size={28} color="#a55eea" /><span style={{ fontWeight: 700, fontSize: 16 }}>Current Value</span></div>
          <div style={{ fontWeight: 900, fontSize: 28, color: '#222', marginBottom: 4 }}>{formatINR(currentValue)}</div>
        </div>
        <div style={{ background: '#fdf3f3', borderRadius: 18, padding: '24px 18px', minWidth: 180, flex: 1, boxShadow: '0 2px 12px #0001', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><FaPercent size={28} color="#eb3b5a" /><span style={{ fontWeight: 700, fontSize: 16 }}>% ROI</span></div>
          <div style={{ fontWeight: 900, fontSize: 28, color: '#222', marginBottom: 4 }}>{formatRoi(roi)}</div>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', padding: '0 24px', flexWrap: 'wrap' }}>
        {/* Left: Invested Funds Table */}
        <div style={{ flex: 2, minWidth: 340 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Invested Funds</div>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 18 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
                <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
                  <th style={{ padding: '8px 0' }}> </th>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Account</th>
                  <th>Last Payment</th>
                  <th style={{ textAlign: 'right' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {investedFunds.map((fund, idx) => (
                  <tr key={fund.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td>{fund.icon}</td>
                    <td>{fund.name}</td>
                    <td>{fund.id}</td>
                    <td>{fund.type}</td>
                    <td>{fund.acc}</td>
                    <td>{fund.last}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatINR(fund.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Right: Investment Growth Chart and Portfolio */}
        <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 18, marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Investment Growth</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={lineData}>
                <XAxis dataKey="day" />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#f7b731" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Your Portfolio */}
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Your Portfolio</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#fffbe7', borderRadius: 14, padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px #0001', fontWeight: 600, fontSize: 16 }}>
              <FaGift size={28} color="#f7b731" />
              <div>
                <div style={{ fontSize: 15, color: '#888', fontWeight: 600 }}>Best Investment</div>
                <div style={{ fontSize: 20, color: '#222', fontWeight: 800 }}>{bestInvestment ? bestInvestment.goalName : 'N/A'}</div>
              </div>
            </div>
            <div style={{ background: '#fdf3f3', borderRadius: 14, padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px #0001', fontWeight: 600, fontSize: 16 }}>
              <FaUser size={28} color="#20bf6b" />
              <div>
                <div style={{ fontSize: 15, color: '#888', fontWeight: 600 }}>Total Investments</div>
                <div style={{ fontSize: 20, color: '#222', fontWeight: 800 }}>{totalInvestments}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CRUD for Investment Goals */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 32, maxWidth: 1200, margin: '32px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontWeight: 700, fontSize: 22, margin: 0, color: '#1976d2' }}>Investment Goals</h2>
          <button 
            onClick={downloadInvestmentPDF}
            style={{ 
              background: '#1976d2', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '10px 20px', 
              fontWeight: 600, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <FaDownload size={16} />
            Download PDF
          </button>
        </div>
        <form onSubmit={handleGoalAdd} style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input name="goal_name" type="text" placeholder="Goal Name" value={goalForm.goal_name} onChange={handleGoalInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }} />
          <input name="start_date" type="date" placeholder="Start Date" value={goalForm.start_date} onChange={handleGoalInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }} />
          <input name="end_date" type="date" placeholder="End Date" value={goalForm.end_date} onChange={handleGoalInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }} />
          <input name="status" type="text" placeholder="Status" value={goalForm.status} onChange={handleGoalInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          <input name="target_amount" type="number" placeholder="Target Amount" value={goalForm.target_amount} onChange={handleGoalInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          
          {/* SIP Fields */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input 
              name="isSIP" 
              type="checkbox" 
              checked={goalForm.isSIP} 
              onChange={handleGoalInputChange} 
              style={{ margin: 0 }}
            />
            <label style={{ fontSize: 14, color: '#666' }}>SIP Goal</label>
          </div>
          
          {goalForm.isSIP && (
            <>
              <select 
                name="sipFrequency" 
                value={goalForm.sipFrequency} 
                onChange={handleGoalInputChange} 
                required 
                style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }}
              >
                <option value="">Select Frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <input 
                name="sipAmount" 
                type="number" 
                placeholder="SIP Amount" 
                value={goalForm.sipAmount} 
                onChange={handleGoalInputChange} 
                required 
                style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} 
              />
              <input 
                name="nextScheduledInvestment" 
                type="date" 
                placeholder="Next Investment Date" 
                value={goalForm.nextScheduledInvestment} 
                onChange={handleGoalInputChange} 
                required 
                style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 140 }} 
              />
            </>
          )}
          
          <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
        </form>
        {goalSuccess && <div style={{ color: '#00b894', marginBottom: 8 }}>{goalSuccess}</div>}
        {goalError && <div style={{ color: '#d63031', marginBottom: 8 }}>{goalError}</div>}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ background: '#f3f8fa' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Goal Name</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Start Date</th>
              <th style={{ padding: 8, textAlign: 'left' }}>End Date</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Status</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Target Amount</th>
              <th style={{ padding: 8, textAlign: 'left' }}>SIP</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Frequency</th>
              <th style={{ padding: 8, textAlign: 'left' }}>SIP Amount</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Next Investment</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr key={goal.id} style={{ borderBottom: '1px solid #e3eafc', background: editGoalId === goal.id ? '#eafaf1' : undefined }}>
                {editGoalId === goal.id ? (
                  <>
                    <td><input name="goal_name" type="text" value={editGoalForm.goal_name} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 100 }} /></td>
                    <td><input name="start_date" type="date" value={editGoalForm.start_date} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 100 }} /></td>
                    <td><input name="end_date" type="date" value={editGoalForm.end_date} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 100 }} /></td>
                    <td><input name="status" type="text" value={editGoalForm.status} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="target_amount" type="number" value={editGoalForm.target_amount} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="isSIP" type="checkbox" checked={editGoalForm.isSIP} onChange={handleGoalEditChange} /></td>
                    <td><select name="sipFrequency" value={editGoalForm.sipFrequency} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }}>
                      <option value="">Select</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select></td>
                    <td><input name="sipAmount" type="number" value={editGoalForm.sipAmount} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="nextScheduledInvestment" type="date" value={editGoalForm.nextScheduledInvestment} onChange={handleGoalEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 100 }} /></td>
                    <td>
                      <button onClick={() => handleGoalEditSave(goal.id)} style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Save</button>
                      <button onClick={handleGoalEditCancel} style={{ background: '#e3eafc', color: '#1976d2', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{goal.goalName}</td>
                    <td>{goal.startDate}</td>
                    <td>{goal.endDate}</td>
                    <td>{goal.status}</td>
                    <td>{goal.targetAmount}</td>
                    <td>{goal.isSIP ? 'Yes' : 'No'}</td>
                    <td>{goal.sipFrequency || '-'}</td>
                    <td>{goal.sipAmount ? formatINR(goal.sipAmount) : '-'}</td>
                    <td>{goal.nextScheduledInvestment || '-'}</td>
                    <td>
                      <button onClick={() => handleGoalEdit(goal)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Edit</button>
                      <button onClick={() => handleGoalDelete(goal.id)} style={{ background: '#d63031', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* CRUD for Investment Transactions */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 32, maxWidth: 1200, margin: '32px auto' }}>
        <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, color: '#1976d2' }}>Investment Transactions</h3>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="goalSelect" style={{ marginRight: 8, fontWeight: 600, color: '#333' }}>Select Goal:</label>
          <select id="goalSelect" value={selectedGoalId} onChange={e => setSelectedGoalId(e.target.value)} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 200 }}>
            <option value="">-- Select a goal to view transactions --</option>
            {goals.map((goal, idx) => <option key={goal.id || (goal.goalName + idx)} value={String(goal.id)}>{goal.goalName}</option>)}
          </select>
        </div>
        
        {/* Transaction Summary for Selected Goal */}
        {selectedGoalId && selectedGoalId !== 'undefined' && (
          <div style={{ 
            background: '#f8f9fa', 
            borderRadius: 12, 
            padding: 16, 
            marginBottom: 16,
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#333' }}>
              Transaction Summary for {goals.find(g => String(g.id) === selectedGoalId)?.goalName}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1976d2' }}>
                  {filteredTx.length}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>Total Transactions</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#2e7d32' }}>
                  ₹{filteredTx.reduce((sum, tx) => sum + (tx.transactionType === 'withdrawal' || tx.transactionType === 'fees' ? 0 : Number(tx.amount) || 0), 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>Total Invested</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#d32f2f' }}>
                  ₹{filteredTx.reduce((sum, tx) => sum + (tx.transactionType === 'withdrawal' || tx.transactionType === 'fees' ? Number(tx.amount) || 0 : 0), 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>Total Withdrawn</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f57c00' }}>
                  ₹{filteredTx.reduce((sum, tx) => sum + (tx.transactionType === 'dividend' || tx.transactionType === 'interest' || tx.transactionType === 'bonus' ? Number(tx.amount) || 0 : 0), 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>Total Returns</div>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleTxAdd} style={{ marginBottom: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#333' }}>Transaction Type</label>
              <select 
                name="transactionType" 
                value={txForm.transactionType} 
                onChange={handleTxInputChange} 
                required 
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e3eafc', fontSize: 14 }}
              >
                {transactionTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#333' }}>Amount (₹)</label>
              <input 
                name="amount" 
                type="number" 
                placeholder="Enter amount" 
                value={txForm.amount} 
                onChange={handleTxInputChange} 
                required 
                min="0"
                step="0.01"
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e3eafc', fontSize: 14 }} 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#333' }}>Date & Time</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  name="date_time" 
                  type="datetime-local" 
                  value={txForm.date_time} 
                  onChange={handleTxInputChange} 
                  required 
                  style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e3eafc', fontSize: 14 }} 
                />
                <button 
                  type="button"
                  onClick={setCurrentDateTime}
                  style={{ 
                    padding: '8px 12px', 
                    background: '#f8f9fa', 
                    border: '1px solid #e3eafc', 
                    borderRadius: 8, 
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#666',
                    whiteSpace: 'nowrap'
                  }}
                  title="Set current date and time"
                >
                  Now
                </button>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#333' }}>Payment Mode</label>
              <select 
                name="mode" 
                value={txForm.mode} 
                onChange={handleTxInputChange} 
                required 
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e3eafc', fontSize: 14 }}
              >
                <option value="">Select Payment Mode</option>
                {paymentModes.map(mode => (
                  <option key={mode.value} value={mode.value}>{mode.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 600, color: '#333' }}>Note (Optional)</label>
              <input 
                name="note" 
                type="text" 
                placeholder="Add a note..." 
                value={txForm.note} 
                onChange={handleTxInputChange} 
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e3eafc', fontSize: 14 }} 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            style={{ 
              background: '#1976d2', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 8, 
              padding: '10px 24px', 
              fontWeight: 700, 
              cursor: 'pointer',
              fontSize: 14,
              opacity: (!selectedGoalId || selectedGoalId === 'undefined') ? 0.6 : 1
            }} 
            disabled={!selectedGoalId || selectedGoalId === 'undefined'}
          >
            Add Transaction
          </button>
        </form>
        {txSuccess && <div style={{ color: '#00b894', marginBottom: 8 }}>{txSuccess}</div>}
        {txError && <div style={{ color: '#d63031', marginBottom: 8 }}>{txError}</div>}
        <div style={{ overflowX: 'auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '12px',
            fontSize: '14px',
            color: '#666'
          }}>
            <span>Total Transactions: {filteredTx.length}</span>
            {totalPages > 1 && (
              <span>Page {currentPage} of {totalPages}</span>
            )}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8, minWidth: 800 }}>
            <thead>
              <tr style={{ background: '#f3f8fa' }}>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14, fontWeight: 600 }}>Type</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14, fontWeight: 600 }}>Amount (₹)</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14, fontWeight: 600 }}>Date/Time</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14, fontWeight: 600 }}>Payment Mode</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14, fontWeight: 600 }}>Note</th>
                <th style={{ padding: 12, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 24, textAlign: 'center', color: '#666', fontSize: 14 }}>
                    No transactions found for this goal. Add your first transaction above.
                  </td>
                </tr>
              ) : (
                currentTransactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #e3eafc', background: editTxId === tx.id ? '#eafaf1' : undefined }}>
                    {editTxId === tx.id ? (
                      <>
                        <td>
                          <select name="transactionType" value={editTxForm.transactionType} onChange={handleTxEditChange} style={{ padding: 6, borderRadius: 6, border: '1px solid #e3eafc', width: 100, fontSize: 12 }}>
                            {transactionTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </td>
                        <td><input name="amount" type="number" value={editTxForm.amount} onChange={handleTxEditChange} style={{ padding: 6, borderRadius: 6, border: '1px solid #e3eafc', width: 80, fontSize: 12 }} /></td>
                        <td><input name="date_time" type="datetime-local" value={editTxForm.date_time} onChange={handleTxEditChange} style={{ padding: 6, borderRadius: 6, border: '1px solid #e3eafc', width: 160, fontSize: 12 }} /></td>
                        <td>
                          <select name="mode" value={editTxForm.mode} onChange={handleTxEditChange} style={{ padding: 6, borderRadius: 6, border: '1px solid #e3eafc', width: 120, fontSize: 12 }}>
                            {paymentModes.map(mode => (
                              <option key={mode.value} value={mode.value}>{mode.label}</option>
                            ))}
                          </select>
                        </td>
                        <td><input name="note" type="text" value={editTxForm.note} onChange={handleTxEditChange} style={{ padding: 6, borderRadius: 6, border: '1px solid #e3eafc', width: 120, fontSize: 12 }} /></td>
                        <td style={{ textAlign: 'center' }}>
                          <button onClick={() => handleTxEditSave(tx.id)} style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', marginRight: 4, fontSize: 12 }}>Save</button>
                          <button onClick={handleTxEditCancel} style={{ background: '#e3eafc', color: '#1976d2', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: 12, 
                            fontSize: 12, 
                            fontWeight: 600,
                            background: tx.transactionType === 'investment' ? '#e3f2fd' : 
                                       tx.transactionType === 'withdrawal' ? '#ffebee' :
                                       tx.transactionType === 'dividend' ? '#e8f5e8' :
                                       tx.transactionType === 'interest' ? '#fff3e0' :
                                       tx.transactionType === 'bonus' ? '#f3e5f5' :
                                       tx.transactionType === 'fees' ? '#ffebee' : '#f5f5f5',
                            color: tx.transactionType === 'investment' ? '#1976d2' :
                                   tx.transactionType === 'withdrawal' ? '#d32f2f' :
                                   tx.transactionType === 'dividend' ? '#388e3c' :
                                   tx.transactionType === 'interest' ? '#f57c00' :
                                   tx.transactionType === 'bonus' ? '#7b1fa2' :
                                   tx.transactionType === 'fees' ? '#d32f2f' : '#666'
                          }}>
                            {transactionTypes.find(t => t.value === tx.transactionType)?.label || 'Investment'}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: tx.transactionType === 'withdrawal' || tx.transactionType === 'fees' ? '#d32f2f' : '#2e7d32' }}>
                          {tx.transactionType === 'withdrawal' || tx.transactionType === 'fees' ? '-' : '+'}₹{Number(tx.amount).toLocaleString('en-IN')}
                        </td>
                        <td>{tx.dateTime ? new Date(tx.dateTime).toLocaleString('en-IN') : '-'}</td>
                        <td>
                          <span style={{ 
                            padding: '2px 6px', 
                            borderRadius: 8, 
                            fontSize: 11, 
                            background: '#f5f5f5',
                            color: '#666'
                          }}>
                            {paymentModes.find(m => m.value === tx.mode)?.label || tx.mode}
                          </span>
                        </td>
                        <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tx.note || '-'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button onClick={() => handleTxEdit(tx)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', marginRight: 4, fontSize: 12 }}>Edit</button>
                          <button onClick={() => handleTxDelete(tx.id)} style={{ background: '#d63031', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '8px', 
              marginTop: '20px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e3eafc',
                  background: currentPage === 1 ? '#f5f5f5' : '#fff',
                  color: currentPage === 1 ? '#ccc' : '#1976d2',
                  borderRadius: '6px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Previous
              </button>
              
              {(() => {
                const pageNumbers = [];
                const maxVisiblePages = 5;
                
                if (totalPages <= maxVisiblePages) {
                  // Show all pages if total is 5 or less
                  for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                  }
                } else {
                  // Show limited pages with ellipsis
                  if (currentPage <= 3) {
                    // Show first 3 pages + ellipsis + last page
                    for (let i = 1; i <= 3; i++) {
                      pageNumbers.push(i);
                    }
                    pageNumbers.push('...');
                    pageNumbers.push(totalPages);
                  } else if (currentPage >= totalPages - 2) {
                    // Show first page + ellipsis + last 3 pages
                    pageNumbers.push(1);
                    pageNumbers.push('...');
                    for (let i = totalPages - 2; i <= totalPages; i++) {
                      pageNumbers.push(i);
                    }
                  } else {
                    // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
                    pageNumbers.push(1);
                    pageNumbers.push('...');
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                      pageNumbers.push(i);
                    }
                    pageNumbers.push('...');
                    pageNumbers.push(totalPages);
                  }
                }
                
                return pageNumbers.map((number, index) => (
                  <span key={index}>
                    {number === '...' ? (
                      <span style={{ 
                        padding: '8px 12px', 
                        color: '#666',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => paginate(number)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #e3eafc',
                          background: currentPage === number ? '#1976d2' : '#fff',
                          color: currentPage === number ? '#fff' : '#1976d2',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          minWidth: '40px'
                        }}
                      >
                        {number}
                      </button>
                    )}
                  </span>
                ));
              })()}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e3eafc',
                  background: currentPage === totalPages ? '#f5f5f5' : '#fff',
                  color: currentPage === totalPages ? '#ccc' : '#1976d2',
                  borderRadius: '6px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Next
              </button>
            </div>
          )}
          
          {/* Page Info */}
          {totalPages > 1 && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '12px', 
              fontSize: '14px', 
              color: '#666' 
            }}>
              Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, filteredTx.length)} of {filteredTx.length} transactions
            </div>
          )}
        </div>
      </div>
      
      {/* SIP Calculator */}
      <SIPCalculator />
    </div>
  );
}
