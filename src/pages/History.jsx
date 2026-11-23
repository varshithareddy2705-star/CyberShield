
import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import '../History.css'

const API_URL = 'http://localhost:5002/api'

function History() {
  const [scans, setScans] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchScans() {
    try {
      setError('')
      const response = await axios.get(`${API_URL}/scans`)
      setScans(response.data)
    } catch (err) {
      console.error('Error fetching scans:', err)
      setError('Unable to load scan history. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScans()
  }, [])

  async function deleteScan(id) {
    try {
      await axios.delete(`${API_URL}/scans/${id}`)
      setScans(current => current.filter(scan => scan.id !== id))
    } catch (err) {
      console.error('Delete error:', err)
      setError('Unable to delete this scan.')
    }
  }

  async function clearHistory() {
    if (!window.confirm('Are you sure you want to clear all scan history?')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/scans`)
      setScans([])
      setError('')
    } catch (err) {
      console.error('Clear history error:', err)
      setError('Unable to clear scan history.')
    }
  }

  const filteredScans = scans.filter(scan =>
    scan.url.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="history-page">

        <header className="history-header">
          <div>
            <p>SECURITY OPERATIONS / RECORDS</p>
            <h1>Scan History</h1>
            <span>
              Review previously analysed URLs and their security results.
            </span>
          </div>

          <div className="history-count">
            {scans.length} Total Scans
          </div>
        </header>

        <section className="history-stats">
          <div>
            <span>Total Scans</span>
            <h2>{scans.length}</h2>
          </div>

          <div>
            <span>High Risk</span>
            <h2 className="danger">
              {scans.filter(scan => scan.level === 'High').length}
            </h2>
          </div>

          <div>
            <span>Medium Risk</span>
            <h2 className="warning">
              {scans.filter(scan => scan.level === 'Medium').length}
            </h2>
          </div>

          <div>
            <span>Low Risk</span>
            <h2 className="safe">
              {scans.filter(scan => scan.level === 'Low').length}
            </h2>
          </div>
        </section>

        <section className="history-table-section">

          <div className="history-toolbar">
            <div>
              <h2>Previous Scans</h2>
              <p>Your saved URL analysis records.</p>
            </div>

            <div className="history-actions">
              <input
                type="text"
                placeholder="Search URLs..."
                value={search}
                onChange={event => setSearch(event.target.value)}
              />

              <button
                className="clear-button"
                onClick={clearHistory}
                disabled={scans.length === 0}
              >
                Clear History
              </button>
            </div>
          </div>

          {loading ? (
            <div className="empty-history">
              <h3>Loading scan history...</h3>
            </div>
          ) : error ? (
            <div className="empty-history">
              <h3>{error}</h3>
              <button onClick={fetchScans}>Try Again</button>
            </div>
          ) : filteredScans.length === 0 ? (
            <div className="empty-history">
              <h3>No scans found</h3>
              <p>
                {scans.length === 0
                  ? 'Your scan records will appear here after you analyse a URL.'
                  : 'Try searching for a different URL.'}
              </p>
            </div>
          ) : (
            <div className="history-table">

              <div className="history-row history-table-heading">
                <span>Website</span>
                <span>Risk Score</span>
                <span>Risk Level</span>
                <span>Date</span>
                <span>Action</span>
              </div>

              {filteredScans.map(scan => (
                <div className="history-row" key={scan.id}>
                  <span className="history-url">
                    {scan.hostname}
                  </span>

                  <span>{scan.score}/100</span>

                  <span>
                    <span className={`history-badge ${scan.level.toLowerCase()}`}>
                      {scan.level}
                    </span>
                  </span>

                  <span className="history-date">
                    {new Date(scan.createdAt).toLocaleString()}
                  </span>

                  <button
                    className="delete-button"
                    onClick={() => deleteScan(scan.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}

            </div>
          )}

        </section>
      </main>
    </div>
  )
}

export default History
