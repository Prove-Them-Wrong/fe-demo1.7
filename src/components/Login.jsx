import React, { useState } from 'react';

// Hard-coded admin for demo
const adminCredentials = { email: 'admin@example.com', password: 'adminpass', role: 'admin' };

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.email === email && parsed.password === password) {
        onLogin(parsed);
        return;
      }
    }
    // Check for admin
    if (email === adminCredentials.email && password === adminCredentials.password) {
      onLogin(adminCredentials);
      return;
    }
    setError('Invalid credentials');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;