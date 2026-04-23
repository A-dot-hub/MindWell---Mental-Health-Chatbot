'use client';

import { useState } from 'react'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleSendOtp = async () => {
    setMessage('')
    
    if (!email) {
      setMessage('Please enter your email')
      setMessageType('error')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('OTP sent to your email')
        setMessageType('success')
        setOtpSent(true)
      } else {
        setMessage(data.message || 'Failed to send OTP')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Server error. Please try again.')
      setMessageType('error')
    }
  }

  const handleVerifyOtp = async () => {
    setMessage('')
    
    if (!otp || !newPassword) {
      setMessage('Please fill all fields')
      setMessageType('error')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('Password reset successful!')
        setMessageType('success')
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setMessage(data.message || 'Password reset failed')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Server error. Please try again.')
      setMessageType('error')
    }
  }

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      
      <input
        type="email"
        placeholder="Enter Registered Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      {!otpSent ? (
        <button onClick={handleSendOtp}>Send OTP</button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br />
          
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br />
          
          <button onClick={handleVerifyOtp}>Reset Password</button>
        </>
      )}

      {message && (
        <span style={{ color: messageType === 'success' ? 'green' : 'red', fontSize: '14px', display: 'block', marginTop: '10px' }}>
          {message}
        </span>
      )}
    </div>
  )
}

export default ForgotPassword
