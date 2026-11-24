
import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'
import Sidebar from '../components/Sidebar'
import '../Scanner.css'

function Scanner() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleScan(event) {
    event.preventDefault()

    setResult(null)
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        `${API_URL}/scan`,
        { url: url.trim() }
      )

      const data = response.data

      setResult({
        ...data,
        findings: data.findings.length > 0
          ? data.findings
          : ['No suspicious patterns were detected by these basic checks.']
      })

    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Cannot connect to the CyberShield backend.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="scanner-page">

        <header className="scanner-header">
          <div>
            <p>SECURITY OPERATIONS / THREAT ANALYSIS</p>
            <h1>Threat Scanner</h1>
            <span>
              Analyse suspicious URLs and identify potential warning signs.
            </span>
          </div>

          <div className="scanner-status">● Scanner Online</div>
        </header>

        <section className="scanner-card">
          <div className="scanner-icon">⌕</div>

          <h2>URL Security Analysis</h2>

          <p>Enter a website URL to analyse its security indicators.</p>

          <form onSubmit={handleScan}>
            <label htmlFor="url-input">Website URL</label>

            <div className="url-input-group">
              <input
                id="url-input"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={event => setUrl(event.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? 'Scanning...' : 'Scan URL →'}
              </button>
            </div>
          </form>

          {error && (
            <p className="scanner-error">{error}</p>
          )}
        </section>

        {result && (
          <section className="scan-result">

            <div className="result-heading">
              <div>
                <p>SCAN RESULTS</p>
                <h2>Analysis Complete</h2>
              </div>

              <span className={`risk-badge ${result.level.toLowerCase()}`}>
                {result.level} Risk
              </span>
            </div>

            <div className="risk-score">
              <div>
                <span>Risk Score</span>
                <h2>{result.score}<small>/100</small></h2>
              </div>

              <div className="score-track">
                <div
                  className={`score-fill ${result.level.toLowerCase()}`}
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
            </div>

            <div className="result-details">
              <span>Analysed domain</span>
              <strong>{result.hostname}</strong>
            </div>

            <div className="findings">
              <h3>Security Findings</h3>

              {result.findings.map((finding, index) => (
                <div className="finding-item" key={index}>
                  <span>⚠</span>
                  {finding}
                </div>
              ))}
            </div>

            <p className="disclaimer">
              This is a basic heuristic assessment, not a verified malware
              scan. A low score does not guarantee that a website is safe.
            </p>

          </section>
        )}

      </main>
    </div>
  )
}

export default Scanner
