
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '../config'
import '../App.css'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(event) {
    event.preventDefault()
    setMessage('')

    if (password.length < 8) {
      setMessage('Password must contain at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      })

      navigate('/login', {
        state: { message: 'Account created successfully! Please sign in.' }
      })
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
        'Unable to create account. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="background-glow"></div>

      <section className="login-container">

        {/* Brand */}
        <div className="brand">
          <div className="brand-icon">⬡</div>
          <span>
            Cyber<span className="blue-text">Shield</span>
          </span>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <span className="eyebrow">SECURITY OPERATIONS PLATFORM</span>
          <h1>Create account</h1>
          <p>
            Get started with CyberShield and protect your digital world.
          </p>
        </div>

        {/* Registration form */}
        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={event => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={password}
              onChange={event => setPassword(event.target.value)}
              minLength={8}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {message && (
            <p className="success-message" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create CyberShield Account →'}
          </button>

        </form>

        {/* Login link */}
        <p style={{
          textAlign: 'center',
          color: '#929bb2',
          fontSize: '13px',
          marginTop: '24px'
        }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: '#8297ff', textDecoration: 'none' }}
          >
            Sign in
          </Link>
        </p>

        <div className="security-note">
          <span>⬡</span>
          Protected by CyberShield security
        </div>

        <footer>
          © 2026 CyberShield. All rights reserved.
        </footer>

      </section>
    </main>
  )
}

export default Register
