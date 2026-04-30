import React, { useState } from 'react';
import { getUsers, loginUser } from '../api/userApi';
import { getAllExpenses } from '../api/expenseApi';
import { getInvestments } from '../api/investmentApi';
import { getAllStocks } from '../api/stockApi';
import { getTaxProfiles } from '../api/taxProfileApi';

const ApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const testApi = async (apiName, apiCall) => {
    setLoading(prev => ({ ...prev, [apiName]: true }));
    setError(prev => ({ ...prev, [apiName]: null }));
    
    try {
      const response = await apiCall();
      setResults(prev => ({ ...prev, [apiName]: response.data }));
      console.log(`✅ ${apiName} API Test Success:`, response.data);
    } catch (err) {
      setError(prev => ({ ...prev, [apiName]: err.message }));
      console.error(`❌ ${apiName} API Test Failed:`, err);
    } finally {
      setLoading(prev => ({ ...prev, [apiName]: false }));
    }
  };

  const testLogin = async () => {
    setLoading(prev => ({ ...prev, login: true }));
    setError(prev => ({ ...prev, login: null }));
    
    try {
      const response = await loginUser('testuser', 'testpass');
      setResults(prev => ({ ...prev, login: response.data }));
      console.log('✅ Login API Test Success:', response.data);
    } catch (err) {
      setError(prev => ({ ...prev, login: err.message }));
      console.error('❌ Login API Test Failed:', err);
    } finally {
      setLoading(prev => ({ ...prev, login: false }));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🔧 API Connectivity Test</h2>
      <p>Use this component to test if your frontend can connect to the backend APIs.</p>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>📋 Test Instructions:</h3>
        <ol>
          <li>Make sure your backend server is running</li>
          <li>Check the console for API Base URL (should be http://localhost:8080)</li>
          <li>Click the test buttons below</li>
          <li>Check the browser console for detailed error messages</li>
        </ol>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        <button 
          onClick={() => testApi('Users', getUsers)}
          disabled={loading.Users}
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {loading.Users ? 'Testing...' : 'Test Users API'}
        </button>

        <button 
          onClick={() => testApi('Expenses', getAllExpenses)}
          disabled={loading.Expenses}
          style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {loading.Expenses ? 'Testing...' : 'Test Expenses API'}
        </button>

        <button 
          onClick={() => testApi('Investments', getInvestments)}
          disabled={loading.Investments}
          style={{ padding: '10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px' }}
        >
          {loading.Investments ? 'Testing...' : 'Test Investments API'}
        </button>

        <button 
          onClick={() => testApi('Stocks', getAllStocks)}
          disabled={loading.Stocks}
          style={{ padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {loading.Stocks ? 'Testing...' : 'Test Stocks API'}
        </button>

        <button 
          onClick={() => testApi('Tax Profiles', getTaxProfiles)}
          disabled={loading['Tax Profiles']}
          style={{ padding: '10px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {loading['Tax Profiles'] ? 'Testing...' : 'Test Tax Profiles API'}
        </button>

        <button 
          onClick={testLogin}
          disabled={loading.login}
          style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {loading.login ? 'Testing...' : 'Test Login API'}
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>📊 Test Results:</h3>
        {Object.keys(results).length === 0 && Object.keys(error).length === 0 && (
          <p>No tests run yet. Click the buttons above to test API connectivity.</p>
        )}
        
        {Object.entries(results).map(([apiName, data]) => (
          <div key={apiName} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
            <strong>✅ {apiName}:</strong> Success
            <pre style={{ fontSize: '12px', marginTop: '5px' }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        ))}
        
        {Object.entries(error).map(([apiName, errorMsg]) => (
          <div key={apiName} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '5px' }}>
            <strong>❌ {apiName}:</strong> {errorMsg}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
        <h3>🔍 Troubleshooting Tips:</h3>
        <ul>
          <li><strong>Network Error:</strong> Backend server is not running or wrong port</li>
          <li><strong>404 Error:</strong> API endpoint doesn't exist on backend</li>
          <li><strong>401 Error:</strong> Authentication required</li>
          <li><strong>500 Error:</strong> Backend server error</li>
          <li><strong>CORS Error:</strong> Backend CORS configuration issue</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTest; 