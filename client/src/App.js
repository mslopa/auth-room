// src/App.js

import React, { useState } from 'react';
import axios from 'axios';

// Create an instance of axios with the base URL and headers
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

function App() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await api.post('/api/register', { name, password }, { headers: { 'Content-Type': 'application/json' } });
      alert('User registered successfully');
    } catch (error) {
      console.error(error);
      alert('Error registering user');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await api.post('/api/login', { name, password }, { headers: { 'Content-Type': 'application/json' } });
      alert('User logged in successfully! Token: ' + response.data.token);
    } catch (error) {
      console.error(error);
      alert('Invalid email or password');
    }
  };

  return (
    <div>
      <h1>Registration & Login</h1>
      <input type="username" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default App;