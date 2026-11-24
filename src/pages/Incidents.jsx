
import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import '../Incidents.css'

import { API_URL } from '../config';

const initialForm = {
  title: '',
  description: '',
  severity: 'Medium',
  status: 'Open'
}

function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [form, setForm] = useState(initialForm)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch incidents from PostgreSQL
  async function fetchIncidents() {
    try {
      setError('')
      const response = await axios.get(`${API_URL}/incidents`)
      setIncidents(response.data)
    } catch (err) {
      console.error(err)
      setError('Unable to load incidents.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [])

  // Create a new incident
  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const response = await axios.post(
        `${API_URL}/incidents`,
        form
      )

      setIncidents(current => [response.data, ...current])
      setForm(initialForm)
      setShowForm(false)
      setError('')
    } catch (err) {
      console.error(err)
      setError('Unable to create incident.')
    }
  }

  // Update incident severity or status
  async function updateIncident(id, field, value) {
    try {
      const incident = incidents.find(item => item.id === id)

      const response = await axios.put(
        `${API_URL}/incidents/${id}`,
        {
          severity: field === 'severity' ? value : incident.severity,
          status: field === 'status' ? value : incident.status
        }
      )

      setIncidents(current =>
        current.map(item =>
          item.id === id ? response.data : item
        )
      )
    } catch (err) {
      console.error(err)
      setError('Unable to update incident.')
    }
  }

  // Delete an incident
  async function deleteIncident(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this incident?'
    )

    if (!confirmed) return

    try {
      await axios.delete(`${API_URL}/incidents/${id}`)

      setIncidents(current =>
        current.filter(incident => incident.id !== id)
      )

      setError('')
    } catch (err) {
      console.error(err)
      setError('Unable to delete incident.')
    }
  }

  // Search and filter incidents
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch =
      incident.title.toLowerCase().includes(search.toLowerCase()) ||
      incident.description.toLowerCase().includes(search.toLowerCase())

    const matchesFilter =
      filter === 'All' || incident.status === filter

    return matchesSearch && matchesFilter
  })

  // Incident statistics
  const openCount = incidents.filter(
    incident => incident.status === 'Open'
  ).length

  const investigatingCount = incidents.filter(
    incident => incident.status === 'Investigating'
  ).length

  const resolvedCount = incidents.filter(
    incident => incident.status === 'Resolved'
  ).length

  const criticalCount = incidents.filter(
    incident => incident.severity === 'Critical'
  ).length

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="incidents-page">

        <header className="incidents-header">
          <div>
            <p className="incidents-eyebrow">
              SECURITY OPERATIONS / INCIDENT RESPONSE
            </p>

            <h1>Incident Management</h1>

            <span>
              Monitor, investigate and manage security incidents.
            </span>
          </div>

          <button
            className="add-incident-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Close Form' : '+ New Incident'}
          </button>
        </header>

        {error && (
          <p role="alert">{error}</p>
        )}

        <section className="incident-stats">

          <div className="incident-stat-card">
            <span>Total Incidents</span>
            <h2>{incidents.length}</h2>
          </div>

          <div className="incident-stat-card">
            <span>Open</span>
            <h2 className="incident-open">{openCount}</h2>
          </div>

          <div className="incident-stat-card">
            <span>Investigating</span>
            <h2 className="incident-investigating">
              {investigatingCount}
            </h2>
          </div>

          <div className="incident-stat-card">
            <span>Resolved</span>
            <h2 className="incident-resolved">{resolvedCount}</h2>
          </div>

          <div className="incident-stat-card">
            <span>Critical Severity</span>
            <h2 className="incident-critical">{criticalCount}</h2>
          </div>

        </section>

        {showForm && (
          <section className="incident-form-card">

            <h2>Create New Incident</h2>
            <p>Add a security incident to your records.</p>

            <form onSubmit={handleSubmit}>

              <label>Incident Title</label>

              <input
                type="text"
                placeholder="e.g. Suspicious Login Attempt"
                value={form.title}
                onChange={event =>
                  setForm({ ...form, title: event.target.value })
                }
                required
              />

              <label>Description</label>

              <textarea
                placeholder="Describe the security incident..."
                value={form.description}
                onChange={event =>
                  setForm({ ...form, description: event.target.value })
                }
                required
              />

              <div className="incident-form-row">

                <div>
                  <label>Severity</label>

                  <select
                    value={form.severity}
                    onChange={event =>
                      setForm({ ...form, severity: event.target.value })
                    }
                  >
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <label>Status</label>

                  <select
                    value={form.status}
                    onChange={event =>
                      setForm({ ...form, status: event.target.value })
                    }
                  >
                    <option>Open</option>
                    <option>Investigating</option>
                    <option>Resolved</option>
                  </select>
                </div>

              </div>

              <button
                type="submit"
                className="submit-incident-button"
              >
                Create Incident →
              </button>

            </form>
          </section>
        )}

        <section className="incident-list-card">

          <div className="incident-list-heading">

            <div>
              <h2>Security Incidents</h2>
              <p>All recorded security events.</p>
            </div>

            <div className="incident-filters">

              <input
                type="text"
                placeholder="Search incidents..."
                value={search}
                onChange={event => setSearch(event.target.value)}
              />

              <select
                value={filter}
                onChange={event => setFilter(event.target.value)}
              >
                <option>All</option>
                <option>Open</option>
                <option>Investigating</option>
                <option>Resolved</option>
              </select>

            </div>
          </div>

          {loading ? (
            <div className="incident-empty">
              <h3>Loading incidents...</h3>
            </div>

          ) : filteredIncidents.length === 0 ? (
            <div className="incident-empty">
              <div className="empty-icon">⬡</div>
              <h3>No incidents found</h3>

              <p>
                Create a new incident or change your search filters.
              </p>
            </div>

          ) : (
            <div className="incident-records">

              {filteredIncidents.map(incident => (
                <article
                  className="incident-record"
                  key={incident.id}
                >

                  <div className="incident-record-main">

                    <div>
                      <h3>{incident.title}</h3>
                      <p>{incident.description}</p>

                      <span className="incident-date">
                        Created: {new Date(
                          incident.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>

                    <button
                      className="incident-delete-button"
                      onClick={() => deleteIncident(incident.id)}
                    >
                      Delete
                    </button>

                  </div>

                  <div className="incident-record-controls">

                    <div>
                      <label>Severity</label>

                      <select
                        className={`severity-select ${incident.severity.toLowerCase()}`}
                        value={incident.severity}
                        onChange={event =>
                          updateIncident(
                            incident.id,
                            'severity',
                            event.target.value
                          )
                        }
                      >
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>

                    <div>
                      <label>Status</label>

                      <select
                        className="status-select"
                        value={incident.status}
                        onChange={event =>
                          updateIncident(
                            incident.id,
                            'status',
                            event.target.value
                          )
                        }
                      >
                        <option>Open</option>
                        <option>Investigating</option>
                        <option>Resolved</option>
                      </select>
                    </div>

                  </div>
                </article>
              ))}

            </div>
          )}

        </section>
      </main>
    </div>
  )
}

export default Incidents
