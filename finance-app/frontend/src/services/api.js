import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth
export const login = (username, password) => 
  api.post('/auth/login', { username, password });

export const register = (userData) => 
  api.post('/auth/register', userData);

// Categories
export const getCategories = () => 
  api.get('/categories');

// Expenses
export const getExpenses = (month, year) => 
  api.get('/expenses', { params: { month, year } });

export const addExpense = (expenseData) => 
  api.post('/expenses', expenseData);

export const updateExpense = (id, expenseData) => 
  api.put(`/expenses/${id}`, expenseData);

export const deleteExpense = (id) => 
  api.delete(`/expenses/${id}`);

// Statistics
export const getStatisticsByCategory = (month, year) => 
  api.get('/statistics/by-category', { params: { month, year } });

export const getTotalExpenses = (month, year) => 
  api.get('/statistics/total', { params: { month, year } });

export default api;
