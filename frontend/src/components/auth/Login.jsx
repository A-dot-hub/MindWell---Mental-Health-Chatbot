'use client';

import { useState } from 'react'

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')

    if (!email || !password) {
      setError('Please fill all fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      })

      const data = await response.json()

      if (data.success) {
        onLoginSuccess()
      } else {
        setError(data.message || 'Incorrect email or password')
      }
    } catch (err) {
      setError('Server error. Please try again later.')
    }
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginTop: '12px' }}
      />
      <br />

      {error && (
        <span
          style={{
            color: 'red',
            fontSize: '14px',
            display: 'block',
            marginTop: '5px',
            marginLeft: '10px'
          }}
        >
          {error}
        </span>
      )}

      <button onClick={handleLogin} style={{ marginTop: '12px' }}>
        Log In
      </button>
    </div>
  )
}

export default Login
