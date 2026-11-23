
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import '../App.css'

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (!token) {
      setMessage('This reset link is invalid. Please request a new one.')
      return
    }

    if (password.length < 8) {
      setMessage('Your password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('The passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:5002/api/auth/reset-password',
        { token, password }
      )

      setMessage(response.data.message)
      setSuccess(true)
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
        'Unable to reset password. Please request a new link.'
      )
    } finally {
      setLoading(false)
    }
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

        <div className="login-heading">
          <span className="eyebrow">ACCOUNT RECOVERY</span>
          <h1>{success ? 'Password updated!' : 'Reset password'}</h1>
          <p>
            {success
              ? 'Your password has been changed successfully.'
              : 'Create a new password for your CyberShield account.'}
          </p>
        </div>

        {success ? (
          <>
            <p className="success-message" role="status">
              {message}
            </p>

            <button
              type="button"
              className="login-button"
              onClick={() => navigate('/login')}
            >
              Back to login →
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>

            <label className="remember">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={event => setShowPassword(event.target.checked)}
              />
              Show passwords
            </label>

            <button
              type="submit"
              className="login-button"
              disabled={loading || !token}
            >
              {loading ? 'Updating password...' : 'Update password →'}
            </button>

            {message && (
              <p className="success-message" role="alert">
                {message}
              </p>
            )}
          </form>
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

export default ResetPassword
