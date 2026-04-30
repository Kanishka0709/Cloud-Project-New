import React, { useEffect, useState } from 'react';
import {
  getTaxProfiles,
  addTaxProfile,
  updateTaxProfile,
  deleteTaxProfile
} from '../api/taxProfileApi';
import './TaxProfile.css';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaDownload } from 'react-icons/fa';

// Mock data for charts and analytics
const pieData = [
  { year: 2023, value: 87, color: '#1976d2' },
  { year: 2022, value: 75, color: '#00b894' },
  { year: 2021, value: 70, color: '#fdcb6e' },
];
const yearlyStats = [
  { year: 2023, onTime: 7200, late: 300, due: 320, overdue: 420, completed: 5000, logged: 75, total: 120 },
  { year: 2022, onTime: 4566, late: 567, due: 634, overdue: 357, completed: 6899, logged: 32, total: 64 },
  { year: 2021, onTime: 3200, late: 865, due: 754, overdue: 752, completed: 5467, logged: 76, total: 98 },
];
const barData = [
  { month: 'Jan', '2023': 42, '2022': 39, '2021': 36 },
  { month: 'Feb', '2023': 39, '2022': 36, '2021': 33 },
  { month: 'Mar', '2023': 41, '2022': 38, '2021': 34 },
  { month: 'Apr', '2023': 38, '2022': 35, '2021': 32 },
  { month: 'May', '2023': 40, '2022': 37, '2021': 34 },
  { month: 'Jun', '2023': 37, '2022': 34, '2021': 31 },
  { month: 'Jul', '2023': 42, '2022': 39, '2021': 36 },
  { month: 'Aug', '2023': 39, '2022': 36, '2021': 33 },
  { month: 'Sep', '2023': 41, '2022': 38, '2021': 34 },
  { month: 'Oct', '2023': 38, '2022': 35, '2021': 32 },
  { month: 'Nov', '2023': 40, '2022': 37, '2021': 34 },
  { month: 'Dec', '2023': 37, '2022': 34, '2021': 31 },
];
const outstandingReports = [
  { label: 'READY FOR LODGEMENT', value: 4620 },
  { label: 'TOTAL PAYABLE', value: 25000 },
  { label: 'OVER ALL NOT STARTED', value: 780 },
  { label: 'TOTAL DUE', value: 250 },
];
const communications = [
  { name: 'MR CONNELLS NAME', tfn: '123 199 555 911', category: 'Category', date: '11/11/2023', type: 'View', action: 'Go to Profile' },
  { name: 'MS CONNELLS NAME', tfn: '199 599 911', category: 'Category', date: '11/11/2023', type: 'Email', action: 'Go to Profile' },
];
const reconciliation = [
  { name: 'MR CONNELLS NAME', tfn: '123 199 555 911', refund: '$20,550', date: '11/11/2023' },
  { name: 'MS ELIZABETH METH', tfn: '199 599 911', refund: '$2,387', date: '11/11/2023' },
  { name: 'MR CONN CITE', tfn: '199 599 911', refund: '$1,200', date: '11/11/2023' },
  { name: 'MISS BENNETTTE', tfn: '199 599 911', refund: '$1,068', date: '11/11/2023' },
];
const pieColors = ['#1976d2', '#00b894', '#fdcb6e'];

const initialForm = {
  annualIncome: '',
  employer: '',
  filingStatus: '',
  financialYear: '',
  panNumber: '',
  taxPaid: ''
};

export default function TaxProfile() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfiles = () => {
    getTaxProfiles()
      .then(res => {
        // Backend now returns a list of tax profiles
        if (Array.isArray(res.data)) {
          setProfiles(res.data);
        } else {
          // Fallback - set empty array
          setProfiles([]);
        }
      })
      .catch(() => setProfiles([]));
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Indian Tax Calculation Function
  const calculateIndianTax = (annualIncome) => {
    const income = parseFloat(annualIncome) || 0;
    let tax = 0;
    
    // Indian Tax Slabs (FY 2024-25)
    if (income <= 300000) {
      tax = 0;
    } else if (income <= 600000) {
      tax = (income - 300000) * 0.05;
    } else if (income <= 900000) {
      tax = 15000 + (income - 600000) * 0.10;
    } else if (income <= 1200000) {
      tax = 45000 + (income - 900000) * 0.15;
    } else if (income <= 1500000) {
      tax = 90000 + (income - 1200000) * 0.20;
    } else {
      tax = 150000 + (income - 1500000) * 0.30;
    }
    
    // Add 4% Health and Education Cess
    const cess = tax * 0.04;
    return Math.round(tax + cess);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'annualIncome') {
      const calculatedTax = calculateIndianTax(value);
      setForm({ 
        ...form, 
        [name]: value,
        taxPaid: calculatedTax.toString()
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'annualIncome') {
      const calculatedTax = calculateIndianTax(value);
      setEditForm({ 
        ...editForm, 
        [name]: value,
        taxPaid: calculatedTax.toString()
      });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    
    // Validate required fields
    if (!form.panNumber || !form.annualIncome || !form.filingStatus || !form.financialYear) {
      setError('Please fill in all required fields: PAN Number, Annual Income, Filing Status, and Financial Year.');
      return;
    }
    
    // Convert string values to proper data types for backend
    const payload = {
      panNumber: form.panNumber.toUpperCase(), // Ensure PAN is uppercase
      annualIncome: parseFloat(form.annualIncome) || 0,
      taxPaid: parseFloat(form.taxPaid) || 0,
      financialYear: form.financialYear, // Keep as string (e.g., "25-26")
      filingStatus: form.filingStatus,
      employer: form.employer || ''
    };
    
    // Log the exact payload being sent
    console.log('Form data:', form);
    console.log('Converted payload:', payload);
    console.log('Payload JSON:', JSON.stringify(payload));
    
    console.log('Sending payload:', payload); // For debugging
    
    console.log('Sending actual form payload:', payload);
    
    addTaxProfile(payload)
      .then(() => {
        setSuccess('Tax profile added.');
        setForm(initialForm);
        fetchProfiles();
      })
      .catch((error) => {
        console.error('Error details:', error.response?.data); // For debugging
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        setError(`Failed to add tax profile. Error: ${error.response?.data?.message || error.message}`);
      });
  };

  const handleEdit = (profile) => {
    setEditId(profile.id);
    setEditForm({
      annualIncome: profile.annualIncome,
      employer: profile.employer,
      filingStatus: profile.filingStatus,
      financialYear: profile.financialYear,
      panNumber: profile.panNumber,
      taxPaid: profile.taxPaid
    });
  };

  const handleEditSave = (id) => {
    // Ensure all fields are present and valid before sending
    const { annualIncome, employer, filingStatus, financialYear, panNumber, taxPaid } = editForm;
    if (
      annualIncome === '' ||
      filingStatus === '' ||
      financialYear === '' ||
      panNumber === '' ||
      taxPaid === ''
    ) {
      setError('All fields except employer are required.');
      setSuccess('');
      return;
    }
    // Convert string values to proper data types for backend
    const payload = {
      panNumber: panNumber.toUpperCase(), // Ensure PAN is uppercase
      annualIncome: parseFloat(annualIncome) || 0,
      taxPaid: parseFloat(taxPaid) || 0,
      financialYear: financialYear, // Keep as string (e.g., "25-26")
      filingStatus: filingStatus,
      employer: employer || ''
    };
    
    console.log('Updating payload:', payload); // For debugging
    
    updateTaxProfile(id, payload)
      .then(() => {
        setSuccess('Tax profile updated.');
        setError('');
        setEditId(null);
        fetchProfiles();
      })
      .catch(() => {
        setError('Failed to update tax profile.');
        setSuccess('');
      });
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this tax profile?')) return;
    deleteTaxProfile(id)
      .then(() => {
        setSuccess('Tax profile deleted.');
        fetchProfiles();
      })
      .catch(() => setError('Failed to delete tax profile.'));
  };

  // Pie chart for filing status distribution
  const filedCount = profiles.filter(p => p.filingStatus === 'FILED').length;
  const pendingCount = profiles.filter(p => p.filingStatus === 'PENDING').length;
  const reviewCount = profiles.filter(p => p.filingStatus === 'REVIEW').length;
  const total = profiles.length;
  const pieData = [
    { name: 'Filed', value: filedCount, color: '#00b894' },
    { name: 'Pending', value: pendingCount, color: '#1976d2' },
    { name: 'Review', value: reviewCount, color: '#fdcb6e' },
  ];

  // Yearly stats from profiles
  const yearlyStats = [];
  const years = [...new Set(profiles.map(p => p.financialYear))];
  years.forEach(year => {
    const yearProfiles = profiles.filter(p => p.financialYear === year);
    yearlyStats.push({
      year,
      filed: yearProfiles.filter(p => p.filingStatus === 'FILED').length,
      pending: yearProfiles.filter(p => p.filingStatus === 'PENDING').length,
      review: yearProfiles.filter(p => p.filingStatus === 'REVIEW').length,
      total: yearProfiles.length
    });
  });

  // Bar chart: total tax paid per year
  const barData = years
    .filter(year => year && year.trim() !== "") // Only use valid years
    .map(year => {
      const yearProfiles = profiles.filter(p => p.financialYear === year);
      return {
        year,
        taxPaid: yearProfiles.reduce((sum, p) => sum + Number(p.taxPaid), 0)
      };
    });

  // Compute progress for each year
  const yearProgress = years.map(year => {
    const yearProfiles = profiles.filter(p => p.financialYear === year);
    const filed = yearProfiles.filter(p => p.filingStatus === 'FILED').length;
    const percent = yearProfiles.length ? Math.round((filed / yearProfiles.length) * 100) : 0;
    return { year, percent };
  });
  const mostRecent = yearProgress[yearProgress.length - 1] || { year: '', percent: 0 };

  // Outstanding Reports based on real data
  const readyForLodgement = profiles.filter(p => p.filingStatus === 'REVIEW').length;
  const totalOverDue = profiles.filter(p => p.filingStatus === 'PENDING').length;
  const notStarted = profiles.filter(p => Number(p.annualIncome) === 0).length;
  const totalDue = profiles.filter(p => Number(p.taxPaid) === 0).length;

  // ATD Client Communications from real data
  const communications = profiles.map(p => ({
    name: p.employer,
    tfn: p.panNumber,
    category: p.filingStatus,
    date: p.financialYear,
    type: p.filingStatus === 'FILED' ? 'Filed' : 'Pending',
    action: 'Go to Profile'
  }));

  // EFT Reconciliation Statement from real data
  const reconciliation = profiles.map(p => ({
    name: p.employer,
    tfn: p.panNumber,
    refund: `₹${Number(p.taxPaid).toLocaleString('en-IN')}`,
    date: p.financialYear
  }));

  // PDF Download Function
  const downloadTaxPDF = () => {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    
    // Get current date for the report
    const currentDate = new Date().toLocaleDateString('en-IN');
    
    // Calculate additional metrics
    const totalIncome = profiles.reduce((sum, p) => sum + Number(p.annualIncome), 0);
    const totalTaxPaid = profiles.reduce((sum, p) => sum + Number(p.taxPaid), 0);
    const filedProfiles = profiles.filter(p => p.filingStatus === 'FILED').length;
    const pendingProfiles = profiles.filter(p => p.filingStatus === 'PENDING').length;
    const reviewProfiles = profiles.filter(p => p.filingStatus === 'REVIEW').length;
    const totalProfiles = profiles.length;
    
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Finsmart Finances - Tax Profile Report</title>
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
          .status-filed {
            color: #00b894;
            font-weight: bold;
          }
          .status-pending {
            color: #1976d2;
            font-weight: bold;
          }
          .status-review {
            color: #fdcb6e;
            font-weight: bold;
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
          <p>Tax Profile Report</p>
          <p>Generated on: ${currentDate}</p>
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <h3>Total Profiles</h3>
            <p>${totalProfiles}</p>
          </div>
          <div class="summary-item">
            <h3>Total Income</h3>
            <p>₹${totalIncome.toLocaleString('en-IN')}</p>
          </div>
          <div class="summary-item">
            <h3>Total Tax Paid</h3>
            <p>₹${totalTaxPaid.toLocaleString('en-IN')}</p>
          </div>
          <div class="summary-item">
            <h3>Filed Returns</h3>
            <p>${filedProfiles}</p>
          </div>
          <div class="summary-item">
            <h3>Pending Returns</h3>
            <p>${pendingProfiles}</p>
          </div>
          <div class="summary-item">
            <h3>Under Review</h3>
            <p>${reviewProfiles}</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Tax Profiles</h2>
          <table>
            <thead>
              <tr>
                <th>PAN Number</th>
                <th>Employer</th>
                <th>Annual Income</th>
                <th>Tax Amount</th>
                <th>Filing Status</th>
                <th>Financial Year</th>
              </tr>
            </thead>
            <tbody>
              ${profiles.map(profile => `
                <tr>
                  <td>${profile.panNumber || 'N/A'}</td>
                  <td>${profile.employer || 'N/A'}</td>
                  <td>₹${Number(profile.annualIncome).toLocaleString('en-IN')}</td>
                  <td>₹${Number(profile.taxPaid).toLocaleString('en-IN')}</td>
                  <td class="status-${profile.filingStatus.toLowerCase()}">${profile.filingStatus || 'N/A'}</td>
                  <td>${profile.financialYear || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Yearly Statistics</h2>
          <table>
            <thead>
              <tr>
                <th>Financial Year</th>
                <th>Filed</th>
                <th>Pending</th>
                <th>Review</th>
                <th>Total</th>
                <th>Total Tax Paid</th>
              </tr>
            </thead>
            <tbody>
              ${yearlyStats.map(stat => {
                const yearTaxPaid = profiles
                  .filter(p => p.financialYear === stat.year)
                  .reduce((sum, p) => sum + Number(p.taxPaid), 0);
                return `
                  <tr>
                    <td>${stat.year}</td>
                    <td>${stat.filed}</td>
                    <td>${stat.pending}</td>
                    <td>${stat.review}</td>
                    <td>${stat.total}</td>
                    <td>₹${yearTaxPaid.toLocaleString('en-IN')}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Outstanding Reports Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Count</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ready for Lodgement</td>
                <td>${readyForLodgement}</td>
                <td>Profiles under review ready for filing</td>
              </tr>
              <tr>
                <td>Total Pending</td>
                <td>${totalOverDue}</td>
                <td>Profiles with pending filing status</td>
              </tr>
              <tr>
                <td>Not Started</td>
                <td>${notStarted}</td>
                <td>Profiles with zero annual income</td>
              </tr>
              <tr>
                <td>Total Due</td>
                <td>${totalDue}</td>
                <td>Profiles with zero tax paid</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Client Communications</h2>
          <table>
            <thead>
              <tr>
                <th>Employer Name</th>
                <th>PAN Number</th>
                <th>Filing Status</th>
                <th>Financial Year</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${communications.map(comm => `
                <tr>
                  <td>${comm.name || 'N/A'}</td>
                  <td>${comm.tfn || 'N/A'}</td>
                  <td class="status-${comm.category.toLowerCase()}">${comm.category || 'N/A'}</td>
                  <td>${comm.date || 'N/A'}</td>
                  <td>${comm.type || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>EFT Reconciliation Statement</h2>
          <table>
            <thead>
              <tr>
                <th>Employer Name</th>
                <th>PAN Number</th>
                <th>Tax Amount</th>
                <th>Financial Year</th>
              </tr>
            </thead>
            <tbody>
              ${reconciliation.map(rec => `
                <tr>
                  <td>${rec.name || 'N/A'}</td>
                  <td>${rec.tfn || 'N/A'}</td>
                  <td>${rec.refund}</td>
                  <td>${rec.date || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>This report was generated by Finsmart Finances</p>
          <p>Total Profiles: ${totalProfiles} | Total Tax Paid: ₹${totalTaxPaid.toLocaleString('en-IN')}</p>
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
      {/* Top Section: Pie Charts and Yearly Stats */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24, padding: '0 24px', flexWrap: 'wrap' }}>
        {/* Large Pie Chart */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 220, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, textAlign: 'center' }}>{mostRecent.year} Progress</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 120, height: 120 }}>
            <PieChart width={120} height={120} style={{ position: 'absolute', top: 0, left: 0 }}>
              <Pie
                data={[
                  { value: mostRecent.percent },
                  { value: 100 - mostRecent.percent }
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#1976d2" />
                <Cell fill="#e3eafc" />
              </Pie>
            </PieChart>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontWeight: 900,
                fontSize: 32,
                color: '#1976d2',
                textAlign: 'center',
                width: '100%'
              }}
            >
              {mostRecent.percent}%
            </div>
          </div>
        </div>
        {/* Small pie charts: all other years (except most recent) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
          {yearProgress.slice(0, -1).map((yp, idx) => (
            <div key={yp.year} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 18, minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{yp.year} Progress</div>
              <PieChart width={60} height={60}>
                <Pie
                  data={[
                    { value: yp.percent },
                    { value: 100 - yp.percent }
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={18}
                  outerRadius={28}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill={['#1976d2', '#00b894', '#fdcb6e'][idx % 3]} />
                  <Cell fill="#e3eafc" />
                </Pie>
              </PieChart>
              <div style={{ fontWeight: 800, fontSize: 18, color: ['#1976d2', '#00b894', '#fdcb6e'][idx % 3], marginTop: -10 }}>{yp.percent}%</div>
            </div>
          ))}
        </div>
        {/* Yearly Stats Table */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 18, minWidth: 320, flex: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Yearly Stats</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
                <th>Year</th><th>Filed</th><th>Pending</th><th>Review</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
              {yearlyStats.map((row, idx) => (
                <tr key={row.year} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td>{row.year}</td>
                  <td>{row.filed}</td>
                  <td>{row.pending}</td>
                  <td>{row.review}</td>
                  <td>{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Bar Chart: Tax Paid by Year */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 18, minWidth: 320, flex: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Tax Amount Trends by Year</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="taxPaid" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bottom Section: Cards and Tables */}
      <div style={{ display: 'flex', gap: 24, padding: '0 24px', flexWrap: 'wrap' }}>
        {/* Outstanding Reports Cards */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 220, flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Outstanding Reports</div>
          <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16, color: '#1976d2' }}>READY FOR LODGEMENT: <span style={{ fontWeight: 900, fontSize: 20 }}>{readyForLodgement}</span></div>
          <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16, color: '#d63031' }}>TOTAL PENDING: <span style={{ fontWeight: 900, fontSize: 20 }}>{totalOverDue}</span></div>
          <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16, color: '#1976d2' }}>OVER ALL NOT STARTED: <span style={{ fontWeight: 900, fontSize: 20 }}>{notStarted}</span></div>
          <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16, color: '#1976d2' }}>TOTAL DUE: <span style={{ fontWeight: 900, fontSize: 20 }}>{totalDue}</span></div>
        </div>
        {/* Communications Table */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320, flex: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>ATD Client Communications</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
                <th>Name</th><th>TFN / ABN</th><th>Category</th><th>Date</th><th>Type</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {communications.map((row, idx) => (
                <tr key={row.tfn + row.date + idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td>{row.name}</td>
                  <td>{row.tfn}</td>
                  <td>{row.category}</td>
                  <td>{row.date}</td>
                  <td>{row.type}</td>
                  <td>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Reconciliation Table */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320, flex: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>EFT Reconciliation Statement</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
                <th>Name</th><th>TFN / ABN</th><th>Refund Amount</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reconciliation.map((row, idx) => (
                <tr key={row.tfn + row.date + idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td>{row.name}</td>
                  <td>{row.tfn}</td>
                  <td>{row.refund}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Tax Profile CRUD Table and Form Below Analytics */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 32, maxWidth: 1200, margin: '24px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontWeight: 700, fontSize: 22, margin: 0, color: '#1976d2' }}>Tax Profiles</h2>
          <button 
            onClick={downloadTaxPDF}
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
        <div style={{ marginBottom: 16, padding: '12px 16px', background: '#e3f4fd', borderRadius: 8, border: '1px solid #1976d2', fontSize: 14, color: '#1976d2' }}>
          💡 <strong>Auto Tax Calculation:</strong> Tax amount is automatically calculated based on Indian tax slabs (FY 2024-25) when you enter your annual income.
        </div>
        <form onSubmit={handleAdd} style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input name="annualIncome" type="number" placeholder="Annual Income" value={form.annualIncome} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }} />
          <input name="employer" type="text" placeholder="Employer" value={form.employer} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          <select name="filingStatus" value={form.filingStatus} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }}>
            <option value="">Select Filing Status</option>
            <option value="FILED">FILED</option>
            <option value="PENDING">PENDING</option>
            <option value="REVIEW">REVIEW</option>
          </select>
          <select name="financialYear" value={form.financialYear} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }}>
            <option value="">Select Financial Year</option>
            <option value="25-26">2025-2026 (25-26)</option>
            <option value="24-25">2024-2025 (24-25)</option>
            <option value="23-24">2023-2024 (23-24)</option>
            <option value="22-23">2022-2023 (22-23)</option>
            <option value="21-22">2021-2022 (21-22)</option>
          </select>
          <input name="panNumber" type="text" placeholder="PAN Number (e.g., ABCDE1234F)" value={form.panNumber} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 140 }} maxLength={10} />
          <input name="taxPaid" type="number" placeholder="Tax Amount (Auto-calculated)" value={form.taxPaid} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 140, backgroundColor: '#f8f9fa' }} readOnly />
          <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
        </form>
        {success && <div style={{ color: '#00b894', marginBottom: 8 }}>{success}</div>}
        {error && <div style={{ color: '#d63031', marginBottom: 8 }}>{error}</div>}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ background: '#f3f8fa' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Annual Income</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Employer</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Filing Status</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Financial Year</th>
              <th style={{ padding: 8, textAlign: 'left' }}>PAN Number</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Tax Amount</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(profile => (
              <tr key={profile.id} style={{ borderBottom: '1px solid #e3eafc', background: editId === profile.id ? '#eafaf1' : undefined }}>
                {editId === profile.id ? (
                  <>
                    <td><input name="annualIncome" type="number" value={editForm.annualIncome} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 100 }} /></td>
                    <td><input name="employer" type="text" value={editForm.employer} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td>
                      <select name="filingStatus" value={editForm.filingStatus} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }}>
                        <option value="FILED">FILED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REVIEW">REVIEW</option>
                      </select>
                    </td>
                    <td>
                      <select name="financialYear" value={editForm.financialYear} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }}>
                        <option value="25-26">2025-2026 (25-26)</option>
                        <option value="24-25">2024-2025 (24-25)</option>
                        <option value="23-24">2023-2024 (23-24)</option>
                        <option value="22-23">2022-2023 (22-23)</option>
                        <option value="21-22">2021-2022 (21-22)</option>
                      </select>
                    </td>
                    <td><input name="panNumber" type="text" value={editForm.panNumber} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="taxPaid" type="number" value={editForm.taxPaid} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 100, backgroundColor: '#f8f9fa' }} readOnly /></td>
                    <td>
                      <button onClick={() => handleEditSave(profile.id)} style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Save</button>
                      <button onClick={handleEditCancel} style={{ background: '#e3eafc', color: '#1976d2', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{profile.annualIncome}</td>
                    <td>{profile.employer}</td>
                    <td>{profile.filingStatus}</td>
                    <td>{profile.financialYear}</td>
                    <td>{profile.panNumber}</td>
                    <td>{profile.taxPaid}</td>
                    <td>
                      <button onClick={() => handleEdit(profile)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Edit</button>
                      <button onClick={() => handleDelete(profile.id)} style={{ background: '#d63031', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}