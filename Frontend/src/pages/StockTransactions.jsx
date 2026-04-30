import React, { useEffect, useState } from 'react';
import {
  getAllStockTransactions,
  createStockTransaction,
  updateStockTransaction,
  deleteStockTransaction
} from '../api/stockApi';

const initialForm = {
  currentPrice: '',
  purchasePrice: '',
  quantity: '',
  transactionDate: '',
  transactionType: '',
  stock: { id: '' },
};

export default function StockTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTransactions = () => {
    getAllStockTransactions()
      .then(res => setTransactions(res.data))
      .catch(() => setTransactions([]));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    createStockTransaction({ ...form, stock: { id: form.stock.id } })
      .then(() => {
        setSuccess('Transaction added.');
        setForm(initialForm);
        fetchTransactions();
      })
      .catch(() => setError('Failed to add transaction.'));
  };

  const handleEdit = (tx) => {
    setEditId(tx.id);
    setEditForm({
      currentPrice: tx.currentPrice,
      purchasePrice: tx.purchasePrice,
      quantity: tx.quantity,
      transactionDate: tx.transactionDate?.slice(0, 10),
      transactionType: tx.transactionType,
      stock: { id: tx.stock?.id || '' },
    });
  };

  const handleEditSave = (id) => {
    updateStockTransaction(id, { ...editForm, stock: { id: editForm.stock.id } })
      .then(() => {
        setSuccess('Transaction updated.');
        setEditId(null);
        fetchTransactions();
      })
      .catch(() => setError('Failed to update transaction.'));
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    deleteStockTransaction(id)
      .then(() => {
        setSuccess('Transaction deleted.');
        fetchTransactions();
      })
      .catch(() => setError('Failed to delete transaction.'));
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Stock Transactions</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input name="currentPrice" type="number" step="0.01" placeholder="Current Price" value={form.currentPrice} onChange={handleInputChange} required />
        <input name="purchasePrice" type="number" step="0.01" placeholder="Purchase Price" value={form.purchasePrice} onChange={handleInputChange} required />
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleInputChange} required />
        <input name="transactionDate" type="date" placeholder="Date" value={form.transactionDate} onChange={handleInputChange} required />
        <input name="transactionType" type="text" placeholder="Type (buy/sell)" value={form.transactionType} onChange={handleInputChange} required />
        <input name="stock.id" type="number" placeholder="Stock ID" value={form.stock.id} onChange={e => setForm({ ...form, stock: { id: e.target.value } })} required />
        <button type="submit">Add</button>
      </form>
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Current Price</th>
            <th>Purchase Price</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Type</th>
            <th>Stock ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              {editId === tx.id ? (
                <>
                  <td><input name="currentPrice" type="number" value={editForm.currentPrice} onChange={handleEditChange} /></td>
                  <td><input name="purchasePrice" type="number" value={editForm.purchasePrice} onChange={handleEditChange} /></td>
                  <td><input name="quantity" type="number" value={editForm.quantity} onChange={handleEditChange} /></td>
                  <td><input name="transactionDate" type="date" value={editForm.transactionDate} onChange={handleEditChange} /></td>
                  <td><input name="transactionType" type="text" value={editForm.transactionType} onChange={handleEditChange} /></td>
                  <td><input name="stock.id" type="number" value={editForm.stock.id} onChange={e => setEditForm({ ...editForm, stock: { id: e.target.value } })} /></td>
                  <td>
                    <button onClick={() => handleEditSave(tx.id)}>Save</button>
                    <button onClick={handleEditCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{tx.currentPrice}</td>
                  <td>{tx.purchasePrice}</td>
                  <td>{tx.quantity}</td>
                  <td>{tx.transactionDate?.slice(0, 10)}</td>
                  <td>{tx.transactionType}</td>
                  <td>{tx.stock?.id}</td>
                  <td>
                    <button onClick={() => handleEdit(tx)}>Edit</button>
                    <button onClick={() => handleDelete(tx.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 