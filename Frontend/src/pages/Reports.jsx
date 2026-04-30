import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Reports.css';
import { getAllExpenses } from '../api/expenseApi';
import { getAllStocks } from '../api/stockApi';
import { getTaxProfiles } from '../api/taxProfileApi';
import { getInvestments } from '../api/investmentApi';
import { getTransactions } from '../api/investmentApi';
import { FaDownload } from 'react-icons/fa';

const pieColors = ['#1976d2', '#00b894', '#fdcb6e', '#d63031', '#6c47e0', '#f7b731', '#636e72'];

export default function Reports() {
  // State for all data
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [taxProfiles, setTaxProfiles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Pagination state for transactions table
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  useEffect(() => {
    getAllExpenses().then(res => setExpenses(res.data || []));
    getInvestments().then(res => setInvestments(res.data || []));
    getAllStocks().then(res => setStocks(res.data || []));
    getTaxProfiles().then(res => setTaxProfiles(res.data || []));
    getTransactions().then(res => setTransactions(res.data || []));
  }, []);

  // Expense metrics
  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const avgExpense = expenses.length ? (totalExpense / expenses.length).toFixed(2) : 0;
  const minExpense = expenses.length ? Math.min(...expenses.map(e => e.amount)) : 0;
  const maxExpense = expenses.length ? Math.max(...expenses.map(e => e.amount)) : 0;

  // Investment metrics
  const totalInvestment = investments.reduce((sum, i) => sum + (i.targetAmount || 0), 0);
  const avgInvestment = investments.length ? (totalInvestment / investments.length).toFixed(2) : 0;
  const bestInvestment = investments.reduce((best, i) => (!best || i.targetAmount > best.targetAmount) ? i : best, null);
  const worstInvestment = investments.reduce((worst, i) => (!worst || i.targetAmount < worst.targetAmount) ? i : worst, null);

  // Stock metrics
  const totalStockValue = stocks.reduce((sum, s) => sum + (s.currentPrice || s.price || 0), 0);
  const bestStock = stocks.reduce((best, s) => (!best || (s.currentPrice || s.price || 0) > (best.currentPrice || best.price || 0)) ? s : best, null);
  const worstStock = stocks.reduce((worst, s) => (!worst || (s.currentPrice || s.price || 0) < (worst.currentPrice || worst.price || 0)) ? s : worst, null);

  // Tax metrics
  const totalTax = taxProfiles.reduce((sum, t) => sum + (t.taxPaid || 0), 0);
  const avgTax = taxProfiles.length ? (totalTax / taxProfiles.length).toFixed(2) : 0;
  const bestYear = taxProfiles.reduce((best, t) => (!best || t.taxPaid < best.taxPaid) ? t : best, null);
  const worstYear = taxProfiles.reduce((worst, t) => (!worst || t.taxPaid > worst.taxPaid) ? t : worst, null);

  // Pie chart for expenses by category
  const pieData = Object.entries(expenses.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (curr.amount || 0);
    return acc;
  }, {})).map(([name, value], idx) => ({ name, value, color: pieColors[idx % pieColors.length] }));

  // Line chart for investment transactions over time
  const investmentTx = transactions.filter(tx => tx.goalId); // Only investment transactions
  const lineData = investmentTx.map(tx => ({
    date: tx.dateTime ? tx.dateTime.slice(0, 10) : '',
    amount: tx.amount || 0
  }));

  // Pagination logic for transactions table
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = investmentTx.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(investmentTx.length / transactionsPerPage);

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format as Indian Rupees
  const formatINR = value => `₹${Number(value).toLocaleString('en-IN')}`;

  // PDF Download Function
  const downloadReportsPDF = () => {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    
    // Get current date for the report
    const currentDate = new Date().toLocaleDateString('en-IN');
    
    // Calculate additional metrics
    const totalIncome = 0; // This would need to be fetched from income API
    const totalSavings = totalIncome - totalExpense;
    const netWorth = totalInvestment + totalStockValue - totalTax;
    
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Finsmart Finances - Comprehensive Financial Report</title>
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
          .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .metric-card {
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          .metric-card h3 {
            color: #1976d2;
            margin: 0 0 10px 0;
            font-size: 18px;
          }
          .metric-card .value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }
          .metric-card .subtitle {
            font-size: 14px;
            color: #666;
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
          <p>Comprehensive Financial Report</p>
          <p>Generated on: ${currentDate}</p>
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <h3>Total Net Worth</h3>
            <p>₹${netWorth.toLocaleString('en-IN')}</p>
          </div>
          <div class="summary-item">
            <h3>Total Assets</h3>
            <p>₹${(totalInvestment + totalStockValue).toLocaleString('en-IN')}</p>
          </div>
          <div class="summary-item">
            <h3>Total Liabilities</h3>
            <p>₹${(totalExpense + totalTax).toLocaleString('en-IN')}</p>
          </div>
          <div class="summary-item">
            <h3>Total Savings</h3>
            <p>₹${totalSavings.toLocaleString('en-IN')}</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Financial Overview</h2>
          <div class="metric-grid">
            <div class="metric-card">
              <h3>Expenses</h3>
              <div class="value">₹${totalExpense.toLocaleString('en-IN')}</div>
              <div class="subtitle">Avg: ₹${avgExpense} | Min: ₹${minExpense} | Max: ₹${maxExpense}</div>
            </div>
            <div class="metric-card">
              <h3>Investments</h3>
              <div class="value">₹${totalInvestment.toLocaleString('en-IN')}</div>
              <div class="subtitle">Avg: ₹${avgInvestment} | Best: ${bestInvestment ? bestInvestment.goalName : 'N/A'}</div>
            </div>
            <div class="metric-card">
              <h3>Stocks</h3>
              <div class="value">₹${totalStockValue.toLocaleString('en-IN')}</div>
              <div class="subtitle">Best: ${bestStock ? bestStock.symbol : 'N/A'} | Worst: ${worstStock ? worstStock.symbol : 'N/A'}</div>
            </div>
            <div class="metric-card">
              <h3>Tax Paid</h3>
              <div class="value">₹${totalTax.toLocaleString('en-IN')}</div>
              <div class="subtitle">Avg: ₹${avgTax} | Best Year: ${bestYear ? bestYear.financialYear : 'N/A'}</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Expense Breakdown by Category</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${pieData.map(item => {
                const percentage = totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : '0.0';
                return `
                  <tr>
                    <td>${item.name}</td>
                    <td>₹${item.value.toLocaleString('en-IN')}</td>
                    <td>${percentage}%</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Investment Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              ${investmentTx.map(tx => `
                <tr>
                  <td>${tx.dateTime ? tx.dateTime.slice(0, 10) : 'N/A'}</td>
                  <td>₹${Number(tx.amount).toLocaleString('en-IN')}</td>
                  <td>${tx.mode || 'N/A'}</td>
                  <td>${tx.note || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Investment Goals Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Goal Name</th>
                <th>Target Amount</th>
                <th>Status</th>
                <th>Financial Year</th>
              </tr>
            </thead>
            <tbody>
              ${investments.map(inv => `
                <tr>
                  <td>${inv.goalName || 'N/A'}</td>
                  <td>₹${Number(inv.targetAmount).toLocaleString('en-IN')}</td>
                  <td>${inv.status || 'N/A'}</td>
                  <td>${inv.financialYear || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Stock Portfolio Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Current Price</th>
                <th>Exchange</th>
                <th>Sector</th>
              </tr>
            </thead>
            <tbody>
              ${stocks.map(stock => `
                <tr>
                  <td>${stock.symbol || 'N/A'}</td>
                  <td>₹${Number(stock.currentPrice || stock.price || 0).toLocaleString('en-IN')}</td>
                  <td>${stock.exchange || 'N/A'}</td>
                  <td>${stock.sector || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Tax Profile Summary</h2>
          <table>
            <thead>
              <tr>
                <th>PAN Number</th>
                <th>Annual Income</th>
                <th>Tax Paid</th>
                <th>Filing Status</th>
                <th>Financial Year</th>
              </tr>
            </thead>
            <tbody>
              ${taxProfiles.map(tax => `
                <tr>
                  <td>${tax.panNumber || 'N/A'}</td>
                  <td>₹${Number(tax.annualIncome).toLocaleString('en-IN')}</td>
                  <td>₹${Number(tax.taxPaid).toLocaleString('en-IN')}</td>
                  <td>${tax.filingStatus || 'N/A'}</td>
                  <td>${tax.financialYear || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>This comprehensive financial report was generated by Finsmart Finances</p>
          <p>Total Records: Expenses: ${expenses.length} | Investments: ${investments.length} | Stocks: ${stocks.length} | Tax Profiles: ${taxProfiles.length}</p>
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

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', width: '100%', padding: '32px 0' }}>
      {/* Download Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 24px 24px 24px' }}>
        <button 
          onClick={downloadReportsPDF}
          style={{ 
            background: '#1976d2', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 8, 
            padding: '12px 24px', 
            fontWeight: 600, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)'
          }}
        >
          <FaDownload size={18} />
          Download Comprehensive Report
        </button>
      </div>
      {/* Top Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 24, padding: '0 24px' }}>
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 18px', boxShadow: '0 2px 12px #0001', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>
          <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Total Expenses</div>
          <div style={{ color: '#1976d2', fontWeight: 900, fontSize: 28 }}>{formatINR(totalExpense)}</div>
          <div style={{ color: '#888', fontSize: 13 }}>Avg: {formatINR(avgExpense)} | Min: {formatINR(minExpense)} | Max: {formatINR(maxExpense)}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 18px', boxShadow: '0 2px 12px #0001', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>
          <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Total Investment</div>
          <div style={{ color: '#1976d2', fontWeight: 900, fontSize: 28 }}>{formatINR(totalInvestment)}</div>
          <div style={{ color: '#888', fontSize: 13 }}>Avg: {formatINR(avgInvestment)} | Best: {bestInvestment ? bestInvestment.goalName : 'N/A'} | Worst: {worstInvestment ? worstInvestment.goalName : 'N/A'}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 18px', boxShadow: '0 2px 12px #0001', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>
          <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Total Stock Value</div>
          <div style={{ color: '#1976d2', fontWeight: 900, fontSize: 28 }}>{formatINR(totalStockValue)}</div>
          <div style={{ color: '#888', fontSize: 13 }}>Best: {bestStock ? bestStock.name : 'N/A'} | Worst: {worstStock ? worstStock.name : 'N/A'}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 18px', boxShadow: '0 2px 12px #0001', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>
          <div style={{ color: '#888', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Total Tax Paid</div>
          <div style={{ color: '#1976d2', fontWeight: 900, fontSize: 28 }}>{formatINR(totalTax)}</div>
          <div style={{ color: '#888', fontSize: 13 }}>Avg: {formatINR(avgTax)} | Best Year: {bestYear ? bestYear.year : 'N/A'} | Worst Year: {worstYear ? worstYear.year : 'N/A'}</div>
        </div>
      </div>
      {/* Middle Section: Pie and Line Charts */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24, padding: '0 24px', flexWrap: 'wrap' }}>
        {/* Pie Chart */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 320 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Expense Analysis Chart</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <PieChart width={320} height={32} style={{ pointerEvents: 'none' }}>
              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconType="circle"
                wrapperStyle={{ position: 'relative' }}
              />
            </PieChart>
          </div>
        </div>
        {/* Line Chart */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320, flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Investment Transactions Over Time</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bottom Section: Transactions Table */}
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 12px #0001',
        padding: 24,
        margin: '0 auto',
        minWidth: 320,
        maxWidth: 700
      }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
          Investment Transactions ({investmentTx.length} total)
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: '#f8fafc', color: '#888', fontWeight: 600 }}>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>Date</th>
              <th style={{ textAlign: 'center', padding: '10px 12px' }}>Amount</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>Mode</th>
              <th style={{ textAlign: 'left', padding: '10px 12px' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((tx, idx) => (
              <tr key={tx.id || idx} style={{ borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' }}>
                <td style={{ textAlign: 'left', padding: '10px 12px' }}>{tx.dateTime ? tx.dateTime.slice(0, 10) : ''}</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 700 }}>{formatINR(tx.amount)}</td>
                <td style={{ textAlign: 'left', padding: '10px 12px' }}>{tx.mode}</td>
                <td style={{ textAlign: 'left', padding: '10px 12px' }}>{tx.note}</td>
              </tr>
            ))}
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
            Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, investmentTx.length)} of {investmentTx.length} transactions
          </div>
        )}
      </div>
    </div>
  );
} 