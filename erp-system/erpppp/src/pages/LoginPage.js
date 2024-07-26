// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage() {
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emailid: email, password })
    });

    const data = await response.json();

    if (response.status === 200) {
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/employee-dashboard');
      }
    } else {
      setError(data.msg);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Login Page</h1>
      <div className="row justify-content-center">
        <div className="col-md-4">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              value="employee"
              checked={role === 'employee'}
              onChange={() => setRole('employee')}
              id="employeeRadio"
            />
            <label className="form-check-label" htmlFor="employeeRadio">
              Employee
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              value="admin"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
              id="adminRadio"
            />
            <label className="form-check-label" htmlFor="adminRadio">
              Admin
            </label>
          </div>
          <button className="btn btn-primary mt-3" onClick={handleLogin}>
            Login
          </button>
          <br />
          <a href="/register" className="btn btn-link mt-3">
            Go to Registration Page
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
