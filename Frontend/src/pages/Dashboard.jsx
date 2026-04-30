import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { FaWallet, FaChartLine, FaPiggyBank, FaFileInvoiceDollar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// Import API functions
import { getAllExpenses } from '../api/expenseApi';
import { getAllStocks } from '../api/stockApi';
import { getTaxProfiles } from '../api/taxProfileApi';
import { getIncome } from '../api/incomeApi'; // For investments, if you have a separate API, use that instead
import { PieLabelRenderProps } from 'recharts'; // for type hinting if needed
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { MdFormatAlignJustify } from 'react-icons/md';

const overviewCards = [
  { title: 'Expenses Overview', color: '#29b6f6', icon: <FaWallet size={36} color="#29b6f6" style={{ background: '#e3f4fd', borderRadius: '50%', padding: 8, marginRight: 18 }} /> },
  { title: 'Investments Overview', color: '#7e8ce0', icon: <FaPiggyBank size={36} color="#7e8ce0" style={{ background: '#f0f2fd', borderRadius: '50%', padding: 8, marginRight: 18 }} /> },
  { title: 'Stocks Overview', color: '#6c47e0', icon: <FaChartLine size={36} color="#6c47e0" style={{ background: '#ede8fd', borderRadius: '50%', padding: 8, marginRight: 18 }} /> },
  { title: 'TaxProfile Overview', color: '#90caf9', icon: <FaFileInvoiceDollar size={36} color="#90caf9" style={{ background: '#eaf6fd', borderRadius: '50%', padding: 8, marginRight: 18 }} /> },
];

export default function Dashboard() {
  // Example: get username from localStorage (customize as needed)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.username || 'User';

  // State for chart data
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);

  // Totals for overview cards
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [totalStocks, setTotalStocks] = useState(0);
  const [totalTax, setTotalTax] = useState(0);

  // Fetch totals for each overview
  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    if (!user) {
      console.log('User not authenticated, redirecting to login');
      window.location.href = '/login';
      return;
    }

    // Make API calls with error handling
    getAllExpenses()
      .then(res => {
        const expenses = res.data || [];
        setTotalExpenses(expenses.reduce((sum, e) => sum + (e.amount || 0), 0));
      })
      .catch(error => {
        console.error('Error fetching expenses:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      });

    getAllStocks()
      .then(res => {
        const stocks = res.data || [];
        setTotalStocks(stocks.reduce((sum, s) => sum + (s.currentPrice || s.price || 0), 0));
      })
      .catch(error => {
        console.error('Error fetching stocks:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      });

    getTaxProfiles()
      .then(res => {
        const profiles = res.data || [];
        setTotalTax(profiles.reduce((sum, t) => sum + (t.taxPaid || 0), 0));
      })
      .catch(error => {
        console.error('Error fetching tax profiles:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      });

    // For investments, if you have a separate API, use it. Here, using incomes as a placeholder.
    if (getIncome) {
      getIncome()
        .then(res => {
          let investments = [];
          if (Array.isArray(res.data)) {
            investments = res.data;
          } else if (res.data && Array.isArray(res.data.incomes)) {
            investments = res.data.incomes;
          } else if (res.data) {
            investments = [res.data];
          }
          setTotalInvestments(investments.reduce((sum, i) => sum + (i.amount || 0), 0));
        })
        .catch(error => {
          console.error('Error fetching income:', error);
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        });
    }
  }, []);

  // Pie Chart: Expenses by category
  useEffect(() => {
    getAllExpenses()
      .then(res => {
        const expenses = res.data || [];
        // Group by category
        const grouped = expenses.reduce((acc, curr) => {
          const cat = curr.category || 'Other';
          acc[cat] = (acc[cat] || 0) + (curr.amount || 0);
          return acc;
        }, {});
        setPieData(Object.entries(grouped).map(([name, value]) => ({ name, value })));
      })
      .catch(error => {
        console.error('Error fetching expenses for pie chart:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          setPieData([]);
        }
      });
  }, []);

  // Line Chart: Stocks (mock time series if not present)
  useEffect(() => {
    getAllStocks()
      .then(res => {
        const stocks = res.data || [];
        // If stocks have a date or time, use it; else, mock by index
        const data = stocks.map((s, idx) => ({
          name: s.name || `Stock ${idx + 1}`,
          Value: s.currentPrice || s.price || 0,
          idx
        }));
        setLineData(data);
      })
      .catch(error => {
        console.error('Error fetching stocks for line chart:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          setLineData([]);
        }
      });
  }, []);

  // Bar Chart: Tax Profile (tax paid by year or type)
  useEffect(() => {
    getTaxProfiles()
      .then(res => {
        const profiles = res.data || [];
        // Group by financialYear (not year)
        const grouped = profiles.reduce((acc, curr) => {
          const year = curr.financialYear || 'Unknown';
          acc[year] = (acc[year] || 0) + (curr.taxPaid || 0);
          return acc;
        }, {});
        setBarData(Object.entries(grouped).map(([name, value]) => ({ name, value })));
      })
      .catch(error => {
        console.error('Error fetching tax profiles for bar chart:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          setBarData([]);
        }
      });
  }, []);

  const navigate = useNavigate();

  // Card click handlers
  const handleCardClick = (idx) => {
    switch (idx) {
      case 0:
        navigate('/expenses');
        break;
      case 1:
        navigate('/investments');
        break;
      case 2:
        navigate('/stocks');
        break;
      case 3:
        navigate('/tax');
        break;
      default:
        break;
    }
  };

  const pieColors = ['#29b6f6', '#7e8ce0', '#90caf9', '#6c47e0', '#fbc02d', '#e57373'];

  // Helper for Pie Chart label - positioned outside the pie
  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // Position labels outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Determine text anchor based on position
    const textAnchor = x > cx ? 'start' : 'end';
    
    return (
      <g>
        {/* Line connecting pie slice to label */}
        <line
          x1={cx + (outerRadius + 5) * Math.cos(-midAngle * RADIAN)}
          y1={cy + (outerRadius + 5) * Math.sin(-midAngle * RADIAN)}
          x2={x - (textAnchor === 'start' ? 5 : -5)}
          y2={y}
          stroke="#666"
          strokeWidth={1}
        />
        {/* Label text */}
        <text 
          x={x} 
          y={y} 
          fill="#333" 
          textAnchor={textAnchor} 
          dominantBaseline="central" 
          fontSize={12} 
          fontWeight={600}
        >
          {`${name}: ₹${value}`}
        </text>
        {/* Percentage text */}
        <text 
          x={x} 
          y={y + 16} 
          fill="#666" 
          textAnchor={textAnchor} 
          dominantBaseline="central" 
          fontSize={10} 
          fontWeight={500}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  // Helper for Bar Chart label
  const renderBarLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text x={x + width / 2} y={y - 8} fill="#222" textAnchor="middle" fontSize={13} fontWeight={600}>
        {value}
      </text>
    );
  };

  // For bar colors
  const barColors = ['#29b6f6', '#7e8ce0', '#90caf9', '#6c47e0', '#fbc02d', '#e57373'];

  // Add a currency formatter
  const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

  const formatK = (value) => {
    if (value >= 100000) {
      const lakhs = (value / 100000).toFixed(1);
      return lakhs.endsWith('.0') ? lakhs.slice(0, -2) + 'L' : lakhs + 'L';
    } else if (value >= 1000) {
      const thousands = (value / 1000).toFixed(1);
      return thousands.endsWith('.0') ? thousands.slice(0, -2) + 'K' : thousands + 'K';
    }
    return value.toLocaleString('en-IN');
  };

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', width: '100%', padding: '24px 0' }}>
      {/* Welcome Message */}
      <div style={{ fontSize: 28, fontWeight: 800, color: '#1976d2', marginBottom: 24, marginLeft: 24 }}>
        Welcome, {username}!
      </div>
      {/* Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 28,
        marginBottom: 32,
        padding: '0 24px',
        width: '100%',
        maxWidth: 1600,
        boxSizing: 'border-box',
      }}>
        {overviewCards.map((card, idx) => (
          <div
            key={card.title}
            onClick={() => handleCardClick(idx)}
            style={{
              background: '#fff',
              border: `3px solid ${card.color}`,
              borderRadius: 28,
              minHeight: 170,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px 18px 22px 18px',
              color: '#222',
              fontWeight: 700,
              fontSize: 22,
              boxShadow: '0 2px 16px #0001',
              transition: 'box-shadow 0.2s, transform 0.2s',
              minWidth: 220,
              flex: 1,
              cursor: 'pointer',
              outline: 'none',
              userSelect: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = `0 4px 24px ${card.color}33`}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 16px #0001'}
            tabIndex={0}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
              {card.icon}
            </div>
            <span style={{ textAlign: 'center', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{card.title}</span>
            <span style={{
              display: 'block',
              textAlign: 'center',
              fontSize: 22,
              fontWeight: 800,
              color: card.color,
              background: '#f5f7fa',
              borderRadius: 12,
              padding: '4px 18px',
              boxShadow: '0 1px 4px #0001',
              marginTop: 4,
            }}>
              {idx === 0 && `₹${totalExpenses.toLocaleString('en-IN')}`}
              {idx === 1 && `₹${totalInvestments.toLocaleString('en-IN')}`}
              {idx === 2 && `₹${totalStocks.toLocaleString('en-IN')}`}
              {idx === 3 && `₹${totalTax.toLocaleString('en-IN')}`}
            </span>
          </div>
        ))}
      </div>
      {/* Charts Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 28,
        padding: '0 24px',
        maxWidth: 1600,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, minWidth: 0 }}>
          {/* Pie Chart Card */}
          <div style={{ background: '#fff', borderRadius: 28, padding: 0, boxShadow: '0 2px 16px #0001', minHeight: 400, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', flex: 1 }}>
            <div style={{ padding: '18px 18px 0 18px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: '#1976d2' }}>Expenses Breakdown</div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 2 }}>This pie chart shows the distribution of your expenses by category.</div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, minWidth: 0, padding: '20px' }}>
              <ResponsiveContainer width="100%" height={400} minWidth={250} minHeight={250}>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    label={renderPieLabel} 
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Line Chart Card */}
          <div style={{ background: '#fff', borderRadius: 28, padding: 0, boxShadow: '0 2px 16px #0001', minHeight: 400, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', flex: 1 }}>
            <div style={{ padding: '18px 18px 0 18px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: '#1976d2' }}>Stock Value Over Time</div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 2 }}>This line chart visualizes your stock portfolio values.</div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height={320} minWidth={200} minHeight={200}>
                <LineChart data={lineData} margin={{ top: 16, right: 24, left: 0, bottom: 24 }}>
                  <XAxis dataKey="name" label={{ value: 'Stock', position: 'insideBottom', offset: -10 }} tick={{ fontSize: 13 }} />
                  <YAxis label={{ value: 'Value (₹)', angle: -90, position: 'insideLeft', offset: 10 }} tick={{ fontSize: 13 }} />
                  <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="Value" stroke="#29b6f6" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Improved Bar Chart Card */}
        <div style={{
          background: '#fff',
          borderRadius: 28,
          padding: 0,
          boxShadow: '0 2px 16px #0001',
          minHeight: 400,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flex: 1,
          maxWidth: 480,
          margin: '0 auto'
        }}>
          <div style={{ padding: '18px 18px 0 18px', borderBottom: '1px solid #f0f0f0', width: '100%', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#1976d2', letterSpacing: 0.5 }}>Tax Trends by Year</div>
            <div style={{ fontSize: 14, color: '#666', marginTop: 2, marginBottom: 4 }}>
              Visualize your annual tax payments and spot trends at a glance.
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320, minWidth: 0, position: 'relative', padding: 8, width: '100%' }}>
            {barData.length === 0 ? (
              <div style={{ position: 'absolute', top: 60, left: 0, right: 0, textAlign: 'center', color: '#e57373', fontWeight: 600, fontSize: 16, zIndex: 2 }}>
                No tax data available for the selected period.
              </div>
            ) : null}
            <div style={{ width: '90%', margin: '0 auto' }}>
              <ResponsiveContainer width="100%" height={320} minWidth={200} minHeight={200}>
                <BarChart data={barData} margin={{ top: 40, right: 24, left: 70, bottom: 24 }} barCategoryGap={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" label={{ value: 'Year', position: 'insideBottom', offset: -10, fontWeight: 700, fill: '#1976d2' }} tick={{ fontSize: 14, fontWeight: 600, fill: '#333' }} />
                  <YAxis
                    label={{
                      value: 'Tax Paid (₹)',
                      angle: -90,
                      position: 'left',
                      offset: 30, // Increased offset
                      fontWeight: 700,
                      fill: '#1976d2'
                    }}
                    tick={{ fontSize: 14, fontWeight: 600, fill: '#333' }}
                    tickFormatter={formatK}
                  />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #1976d2', borderRadius: 8, fontWeight: 600 }} formatter={(value, name) => [formatK(value), 'Tax Paid']} labelStyle={{ color: '#1976d2', fontWeight: 700 }} />
                  {/* No legend for clean look */}
                  <Bar dataKey="value" fill="url(#taxBarGradient)" radius={[8, 8, 0, 0]} label={({ x, y, width, value }) => {
                    const formattedValue = formatK(value);
                    return (
                      <g>
                        {/* Background rectangle for better visibility */}
                        <rect 
                          x={x + width / 2 - 30} 
                          y={y - 25} 
                          width={60} 
                          height={20} 
                          fill="rgba(255, 255, 255, 0.9)" 
                          rx={4}
                          stroke="#1976d2"
                          strokeWidth={1}
                        />
                        {/* Text label */}
                        <text 
                          x={x + width / 2} 
                          y={y - 12} 
                          fill="#1976d2" 
                          textAnchor="middle" 
                          fontSize={12} 
                          fontWeight={700}
                        >
                          {formattedValue}
                        </text>
                      </g>
                    );
                  }} isAnimationActive shadow="true" />
                  <defs>
                    <linearGradient id="taxBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#29b6f6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#1976d2" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}