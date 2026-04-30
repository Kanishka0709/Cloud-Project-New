import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './SIPCalculator.css';

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(585100);
  const [expectedReturn, setExpectedReturn] = useState(4.9);
  const [timePeriod, setTimePeriod] = useState(18);

  // Calculate SIP values
  const calculateSIP = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timePeriod * 12;
    const totalInvestment = monthlyInvestment * totalMonths;
    
    // SIP formula: FV = P × (((1 + r)^n - 1) / r) × (1 + r)
    const futureValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    
    const estimatedReturns = futureValue - totalInvestment;
    
    return {
      investedAmount: totalInvestment,
      estimatedReturns: estimatedReturns,
      totalValue: futureValue
    };
  };

  const sipValues = calculateSIP();

  // Data for donut chart
  const chartData = [
    { name: 'Invested amount', value: sipValues.investedAmount, color: '#E5E7EB' },
    { name: 'Est. returns', value: sipValues.estimatedReturns, color: '#3B82F6' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const formatYears = (years) => {
    return `${years} Yr`;
  };

  return (
    <div className="sip-calculator">
      <div className="calculator-container">
        {/* Left Section - Input and Calculated Values */}
        <div className="left-section">
          {/* Calculator Title */}
          <div className="calculator-title">
            <h2>SIP Calculator</h2>
          </div>

          {/* Input Sliders */}
          <div className="input-section">
            <div className="input-group">
              <label>Monthly investment</label>
              <div className="value-display">
                {formatCurrency(monthlyInvestment)}
              </div>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="slider"
              />
            </div>

            <div className="input-group">
              <label>Expected return rate (p.a)</label>
              <div className="value-display">
                {formatPercentage(expectedReturn)}
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.1"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="slider"
              />
            </div>

            <div className="input-group">
              <label>Time period</label>
              <div className="value-display">
                {formatYears(timePeriod)}
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="slider"
              />
            </div>
          </div>

          {/* Calculated Summary */}
          <div className="summary-section">
            <div className="summary-item">
              <span className="summary-label">Invested amount</span>
              <span className="summary-value">{formatCurrency(sipValues.investedAmount)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Est. returns</span>
              <span className="summary-value">{formatCurrency(sipValues.estimatedReturns)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total value</span>
              <span className="summary-value">{formatCurrency(sipValues.totalValue)}</span>
            </div>
          </div>
        </div>

        {/* Right Section - Chart and Button */}
        <div className="right-section">
          {/* Legend */}
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color invested"></div>
              <span>Invested amount</span>
            </div>
            <div className="legend-item">
              <div className="legend-color returns"></div>
              <span>Est. returns</span>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={() => ''}
                />
                {/* Custom Labels for amounts */}
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="chart-label"
                  fill="#374151"
                  fontSize="12"
                  fontWeight="600"
                >
                  {formatCurrency(sipValues.investedAmount)}
                </text>
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="chart-label"
                  fill="#6b7280"
                  fontSize="10"
                  fontWeight="500"
                >
                  Invested
                </text>
                <text
                  x="50%"
                  y="65%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="chart-label"
                  fill="#3b82f6"
                  fontSize="10"
                  fontWeight="600"
                >
                  +{formatCurrency(sipValues.estimatedReturns)}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>


        </div>
      </div>
    </div>
  );
};

export default SIPCalculator; 