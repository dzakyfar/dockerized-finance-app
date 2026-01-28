import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getStatisticsByCategory, getTotalExpenses, getExpenses, addExpense, deleteExpense, getCategories } from '../services/api';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState([]);
  const [categories, setCategories] = useState([]); // Tambahan: state untuk categories
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category_id: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch categories saat component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  // Function untuk fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
      console.log('Categories loaded:', response.data); // Debug
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Gagal memuat kategori. Pastikan backend running!');
    }
  };

  const fetchData = async () => {
    try {
      const [statsRes, totalRes, expensesRes] = await Promise.all([
        getStatisticsByCategory(selectedMonth, selectedYear),
        getTotalExpenses(selectedMonth, selectedYear),
        getExpenses(selectedMonth, selectedYear)
      ]);
      
      setStats(statsRes.data);
      setTotalExpense(totalRes.data.total);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await addExpense(newExpense);
      setShowAddModal(false);
      setNewExpense({
        category_id: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchData();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Gagal menambahkan pengeluaran');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Yakin ingin menghapus pengeluaran ini?')) {
      try {
        await deleteExpense(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const pieData = stats.filter(s => s.total > 0).map(stat => ({
    name: stat.name,
    value: parseFloat(stat.total),
    color: stat.color
  }));

  const maxTotal = Math.max(...stats.map(s => parseFloat(s.total)));

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-logo">💰</span>
          <span className="nav-title">Finance Manager</span>
        </div>
        <div className="nav-right">
          <span className="nav-user">👋 {user.full_name || user.username}</span>
          <button onClick={onLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard Keuangan</h1>
          <div className="header-controls">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="select-month"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx + 1}>{month}</option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="select-year"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button onClick={() => setShowAddModal(true)} className="btn-add">
              + Tambah Pengeluaran
            </button>
          </div>
        </div>

        <div className="stats-card total-card">
          <h3>Total Pengeluaran</h3>
          <p className="total-amount">{formatCurrency(totalExpense)}</p>
          <p className="total-period">{months[selectedMonth - 1]} {selectedYear}</p>
        </div>

        <div className="dashboard-grid">
          <div className="card chart-card">
            <h2>Pengeluaran per Kategori</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data">Belum ada data pengeluaran</p>
            )}
          </div>

          <div className="card categories-card">
            <h2>Detail Kategori</h2>
            <div className="categories-list">
              {stats.map((stat) => {
                const percentage = maxTotal > 0 ? (parseFloat(stat.total) / maxTotal) * 100 : 0;
                return (
                  <div key={stat.id} className="category-item">
                    <div className="category-header">
                      <span className="category-icon">{stat.icon}</span>
                      <span className="category-name">{stat.name}</span>
                      <span className="category-amount">{formatCurrency(parseFloat(stat.total))}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: "${percentage}%",
                          backgroundColor: stat.color 
                        }}
                      ></div>
                    </div>
                    <div className="category-percentage">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card expenses-card">
          <h2>Riwayat Transaksi</h2>
          <div className="expenses-list">
            {expenses.length > 0 ? expenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="expense-icon" style={{ backgroundColor: expense.color }}>
                  {expense.icon}
                </div>
                <div className="expense-details">
                  <h4>{expense.category_name}</h4>
                  <p>{expense.description || 'Tidak ada deskripsi'}</p>
                  <span className="expense-date">
                    {new Date(expense.date).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div className="expense-right">
                  <span className="expense-amount">{formatCurrency(parseFloat(expense.amount))}</span>
                  <button 
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )) : (
              <p className="no-data">Belum ada transaksi</p>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Tambah Pengeluaran</h2>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label>Kategori</label>
                <select
                  value={newExpense.category_id}
                  onChange={(e) => setNewExpense({...newExpense, category_id: e.target.value})}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {/* PERBAIKAN: Gunakan categories, bukan stats */}
                  {categories.length > 0 ? (
                    categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Memuat kategori...</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Jumlah (Rp)</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  placeholder="Contoh: 50000"
                  required
                />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="Deskripsi pengeluaran (opsional)"
                />
              </div>
              <div className="form-group">
                <label>Tanggal</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-cancel">
                  Batal
                </button>
                <button type="submit" className="btn-submit">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;