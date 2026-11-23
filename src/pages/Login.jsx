
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../App.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:5002/api/auth/login',
        { email, password }
      )

      localStorage.setItem('cybershieldToken', response.data.token)
      localStorage.setItem(
        'cybershieldUser',
        JSON.stringify(response.data.user)
      )

      navigate('/dashboard')
    } catch (error) {
      setMessage(
        error.response?.data?.error || 'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword(event) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:5002/api/auth/forgot-password',
        { email }
      )

      setMessage(response.data.message)
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
        'Unable to send reset email. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function openForgotPassword() {
    setMessage('')
    setForgotMode(true)
  }

  function backToLogin() {
    setMessage('')
    setForgotMode(false)
  }

  return (
    <main className="login-page">
      <div className="background-glow"></div>

      <section className="login-container">
        <div className="brand">
          <div className="brand-icon">⬡</div>
          <span>
            Cyber<span className="blue-text">Shield</span>
          </span>
        </div>

        {forgotMode ? (
          <>
            <div className="login-heading">
              <span className="eyebrow">ACCOUNT RECOVERY</span>
              <h1>Forgot password?</h1>
              <p>
                Enter your registered email address and we'll send you
                a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label htmlFor="forgot-email">Email address</label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send reset link →'}
              </button>

              {message && (
                <p className="success-message" role="status">
                  {message}
                </p>
              )}

              <button
                type="button"
                className="back-to-login"
                onClick={backToLogin}
              >
                ← Back to login
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="login-heading">
              <span className="eyebrow">
                SECURITY OPERATIONS PLATFORM
              </span>
              <h1>Welcome back</h1>
              <p>Sign in to access your security dashboard.</p>
            </div>

            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
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

              <div className="form-options">
                <label className="remember">
                  <input type="checkbox" />
                  Remember me
                </label>

                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={openForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in to CyberShield →'}
              </button>

              {message && (
                <p className="success-message" role="alert">
                  {message}
                </p>
              )}
            </form>
          </>
        )}

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

export default Login
