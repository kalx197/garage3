const API_BASE = 'http://localhost:5000/api';

const fetchAPI = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Server interaction failure execution routine.');
  return data;
};
