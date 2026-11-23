
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import '../Settings.css'

const defaultPreferences = {
  emailAlerts: true,
  scanNotifications: true,
  incidentAlerts: true,
  sessionTimeout: '30'
}

function Settings() {
  const navigate = useNavigate()

  const user = JSON.parse(
    localStorage.getItem('cybershieldUser') || '{}'
  )

  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    role: 'Security Administrator'
  })

  const [preferences, setPreferences] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('cybershieldPreferences')
      ) || defaultPreferences
    } catch {
      return defaultPreferences
    }
  })

  const [message, setMessage] = useState('')

  function saveProfile(event) {
    event.preventDefault()

    const updatedUser = {
      ...user,
      name: profile.name,
      email: profile.email
    }

    localStorage.setItem(
      'cybershieldUser',
      JSON.stringify(updatedUser)
    )

    setMessage('Profile updated successfully!')
  }

  function savePreferences() {
    localStorage.setItem(
      'cybershieldPreferences',
      JSON.stringify(preferences)
    )

    setMessage('Security preferences saved!')
  }

  function handlePreferenceChange(event) {
    const { name, checked } = event.target

    setPreferences(current => ({
      ...current,
      [name]: checked
    }))
  }

  function handleLogout() {
    localStorage.removeItem('cybershieldToken')
    localStorage.removeItem('cybershieldUser')
    navigate('/login', { replace: true })
  }

  return (
    <div className="settings-layout">
      <Sidebar />

      <main className="settings-page">

        <header className="settings-header">
          <div>
            <p className="settings-eyebrow">
              SECURITY OPERATIONS / CONFIGURATION
            </p>

            <h1>Settings</h1>

            <span>
              Manage your account and security preferences.
            </span>
          </div>

          <div className="settings-status">
            <span>●</span> System Online
          </div>
        </header>

        {message && (
          <div className="settings-message">
            {message}
          </div>
        )}

        <section className="settings-card">

          <div className="settings-section-heading">
            <div className="settings-icon">◉</div>

            <div>
              <h2>Admin Profile</h2>
              <p>Manage your account information.</p>
            </div>
          </div>

          <form onSubmit={saveProfile}>

            <div className="settings-form-grid">

              <div className="settings-field">
                <label>Full Name</label>

                <input
                  type="text"
                  value={profile.name}
                  onChange={event =>
                    setProfile({
                      ...profile,
                      name: event.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="settings-field">
                <label>Email Address</label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="settings-field">
                <label>Role</label>

                <input
                  type="text"
                  value={profile.role}
                  disabled
                />
              </div>

            </div>

            <button type="submit" className="settings-primary-button">
              Save Profile →
            </button>

          </form>
        </section>

        <section className="settings-card">

          <div className="settings-section-heading">
            <div className="settings-icon">⬡</div>

            <div>
              <h2>Security Preferences</h2>
              <p>Configure how CyberShield notifies you.</p>
            </div>
          </div>

          <div className="settings-options">

            <div className="settings-option">
              <div>
                <h3>Email Alerts</h3>
                <p>Receive security notifications by email.</p>
              </div>

              <input
                type="checkbox"
                name="emailAlerts"
                checked={preferences.emailAlerts}
                onChange={handlePreferenceChange}
              />
            </div>

            <div className="settings-option">
              <div>
                <h3>Scan Notifications</h3>
                <p>Receive notifications when a URL scan completes.</p>
              </div>

              <input
                type="checkbox"
                name="scanNotifications"
                checked={preferences.scanNotifications}
                onChange={handlePreferenceChange}
              />
            </div>

            <div className="settings-option">
              <div>
                <h3>Incident Alerts</h3>
                <p>Receive alerts about security incidents.</p>
              </div>

              <input
                type="checkbox"
                name="incidentAlerts"
                checked={preferences.incidentAlerts}
                onChange={handlePreferenceChange}
              />
            </div>

          </div>

          <div className="settings-field session-field">
            <label>Session Timeout</label>

            <select
              value={preferences.sessionTimeout}
              onChange={event =>
                setPreferences({
                  ...preferences,
                  sessionTimeout: event.target.value
                })
              }
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="120">120 minutes</option>
            </select>
          </div>

          <button
            className="settings-primary-button"
            onClick={savePreferences}
          >
            Save Preferences →
          </button>

        </section>

        <section className="settings-card">

          <div className="settings-section-heading">
            <div className="settings-icon">⌑</div>

            <div>
              <h2>Password Management</h2>
              <p>Keep your account protected.</p>
            </div>
          </div>

          <div className="settings-password-info">
            <div>
              <h3>Change Password</h3>
              <p>
                Password updates are not yet implemented.
              </p>
            </div>

            <span className="coming-soon">Coming Soon</span>
          </div>

        </section>

        <section className="settings-card logout-card">

          <div>
            <h2>Sign Out</h2>
            <p>Return to the CyberShield login page.</p>
          </div>

          <button
            className="settings-logout-button"
            onClick={handleLogout}
          >
            Sign Out →
          </button>

        </section>

        <footer className="settings-footer">
          CyberShield © 2026 · Security Operations Platform
        </footer>

      </main>
    </div>
  )
}

export default Settings
