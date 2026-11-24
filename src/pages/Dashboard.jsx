
import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import '../Dashboard.css'
import Analytics from './Analytics'
import Sidebar from '../components/Sidebar'

function Dashboard() {
  const [scans, setScans] = useState([])
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(
    localStorage.getItem('cybershieldUser') || '{}'
  )

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [scanResponse, incidentResponse] = await Promise.all([
          axios.get(`${API_URL}/scans`),
          axios.get(`${API_URL}/incidents`)
        ])

        setScans(scanResponse.data)
        setIncidents(incidentResponse.data)
      } catch (error) {
        console.error('Dashboard loading error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const totalScans = scans.length

  const highRisk = scans.filter(
    scan => scan.level === 'High'
  ).length

  const mediumRisk = scans.filter(
    scan => scan.level === 'Medium'
  ).length

  const lowRisk = scans.filter(
    scan => scan.level === 'Low'
  ).length

  const recentIncidents = incidents.slice(0, 5)

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-main">

        <header className="topbar">
          <div>
            <p className="breadcrumb">SECURITY OPERATIONS / OVERVIEW</p>
            <h1>Security Overview</h1>
            <p className="dashboard-subtitle">
              Your security activity at a glance.
            </p>
          </div>

          <div className="user-profile">
            <span className="profile-indicator"></span>
            <div>
              <strong>{user.name || 'User'}</strong>
              <small>Security Administrator</small>
            </div>
          </div>
        </header>

        <section className="welcome">
          <div className="welcome-content">
            <span className="welcome-tag">
              <span className="welcome-dot"></span>
              SECURITY OPERATIONS CENTER
            </span>

            <h2>
              Welcome back, {user.name || 'User'}!
            </h2>

            <p>
              Monitor, analyse and manage your security environment
              from one centralised dashboard.
            </p>
          </div>

          <div className="welcome-graphic">
            <svg viewBox="0 0 120 120" fill="none">
              <path
                d="M60 8L103 32V82L60 108L17 82V32L60 8Z"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                d="M60 28L84 42V70L60 84L36 70V42L60 28Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M48 56L56 64L73 46"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </section>

        <div className="dashboard-section-title">
          <div>
            <h2>Security Statistics</h2>
            <p>Overview of your URL analysis activity.</p>
          </div>
          <span className="live-indicator">
            <span></span> LIVE DATA
          </span>
        </div>

        <section className="stats-grid">

          <div className="stat-card total-card">
            <div className="stat-card-top">
              <span>Total Scans</span>
              <div className="stat-icon blue-icon">⌕</div>
            </div>
            <h2>{loading ? '...' : totalScans}</h2>
            <p>Total URLs analysed</p>
          </div>

          <div className="stat-card high-card">
            <div className="stat-card-top">
              <span>High Risk</span>
              <div className="stat-icon red-icon">!</div>
            </div>
            <h2 className="danger">
              {loading ? '...' : highRisk}
            </h2>
            <p>Require immediate attention</p>
          </div>

          <div className="stat-card medium-card">
            <div className="stat-card-top">
              <span>Medium Risk</span>
              <div className="stat-icon yellow-icon">⚠</div>
            </div>
            <h2 className="warning">
              {loading ? '...' : mediumRisk}
            </h2>
            <p>Require further review</p>
          </div>

          <div className="stat-card low-card">
            <div className="stat-card-top">
              <span>Low Risk</span>
              <div className="stat-icon green-icon">✓</div>
            </div>
            <h2 className="success">
              {loading ? '...' : lowRisk}
            </h2>
            <p>Low-risk indicators detected</p>
          </div>

        </section>

        {!loading && <Analytics scans={scans} />}

        <section className="activity-section">

          <div className="section-heading">
            <div>
              <h2>Recent Security Incidents</h2>
              <p>
                Latest security activity across your environment.
              </p>
            </div>

            <button
              onClick={() => window.location.href = '/incidents'}
            >
              View all →
            </button>
          </div>

          <div className="incident-table">

            <div className="table-row table-header">
              <span>Incident</span>
              <span>Severity</span>
              <span>Status</span>
            </div>

            {loading ? (
              <div className="table-row">
                <span>Loading incidents...</span>
              </div>
            ) : recentIncidents.length === 0 ? (
              <div className="table-row">
                <span>No incidents recorded yet.</span>
              </div>
            ) : (
              recentIncidents.map(incident => (
                <div className="table-row" key={incident.id}>
                  <span>{incident.title}</span>

                  <span className={incident.severity.toLowerCase()}>
                    {incident.severity}
                  </span>

                  <span className="incident-status">
                    {incident.status}
                  </span>
                </div>
              ))
            )}

          </div>
        </section>

        <footer className="dashboard-footer">
          CyberShield © 2026 · Security Operations Platform
        </footer>

      </main>
    </div>
  )
}

export default Dashboard
