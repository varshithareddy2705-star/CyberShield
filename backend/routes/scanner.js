const authenticateToken = require('../middleware/auth')
const prisma = require('../lib/prisma')
const express = require('express')
const router = express.Router()
router.use(authenticateToken)

router.post('/scan', async (req, res) => {
  const { url } = req.body

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      error: 'Please provide a valid URL.'
    })
  }

  let parsedURL

  try {
    parsedURL = new URL(url.trim())
  } catch {
    return res.status(400).json({
      error: 'Invalid URL format.'
    })
  }

  if (!['http:', 'https:'].includes(parsedURL.protocol)) {
    return res.status(400).json({
      error: 'Only HTTP and HTTPS URLs are supported.'
    })
  }

  const hostname = parsedURL.hostname
  let score = 0
  const findings = []

  // Check HTTPS
  if (parsedURL.protocol === 'http:') {
    score += 20
    findings.push('Website does not use HTTPS.')
  }

  // Check for IP address
  const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)

  if (isIP) {
    score += 25
    findings.push('URL uses an IP address instead of a domain.')
  }

  // Check for embedded credentials
  if (parsedURL.username || parsedURL.password) {
    score += 25
    findings.push('URL contains embedded credentials.')
  }

  // Check for punycode
  if (hostname.includes('xn--')) {
    score += 20
    findings.push('Domain contains a punycode label.')
  }

  // Check for suspicious words
  const suspiciousWords = [
    'login', 'verify', 'secure', 'account',
    'update', 'password', 'banking', 'confirm'
  ]

  if (suspiciousWords.some(word => hostname.toLowerCase().includes(word))) {
    score += 15
    findings.push('Domain contains suspicious keywords.')
  }

  // Check hostname length
  if (hostname.split('.').length > 4) {
    score += 10
    findings.push('Domain contains an unusually large number of subdomains.')
  }

  score = Math.min(score, 100)

  let level = 'Low'

  if (score >= 50) {
    level = 'High'
  } else if (score >= 25) {
    level = 'Medium'
  }
try {
  
const savedScan = await prisma.scan.create({
  data: {
    url: url.trim(),
    hostname,
    score,
    level,
    findings,
    userId: req.user.userId
  }
})

res.status(201).json({
  id: savedScan.id,
  url: savedScan.url,
  hostname: savedScan.hostname,
  score: savedScan.score,
  level: savedScan.level,
  findings: savedScan.findings,
  createdAt: savedScan.createdAt,
  message: 'URL analysis completed and saved successfully.'
})


} catch (error) {
  console.error('Database error:', error)

  res.status(500).json({
    error: 'Unable to save scan to database.'
  })
}
  
})
router.get('/scans', async (req, res) => {
  try {
    const scans = await prisma.scan.findMany({
  where: { userId: req.user.userId },
  orderBy: { createdAt: 'desc' }

    })

    res.json(scans)
  } catch (error) {
    console.error('Error fetching scans:', error)

    res.status(500).json({
      error: 'Unable to fetch scan history.'
    })
  }
})
// Delete one scan
router.delete('/scans/:id', async (req, res) => {
  try {
    await prisma.scan.delete({
      where: {
        id: req.params.id
      }
    })

    res.json({ message: 'Scan deleted successfully.' })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: 'Unable to delete scan.' })
  }
})

// Clear all scans
router.delete('/scans', async (req, res) => {
  try {
    await prisma.scan.deleteMany()

    res.json({ message: 'Scan history cleared successfully.' })
  } catch (error) {
    console.error('Clear history error:', error)
    res.status(500).json({ error: 'Unable to clear scan history.' })
  }
})

// Get all incidents
router.get('/incidents', async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
  where: { userId: req.user.userId },
  orderBy: { createdAt: 'desc' }

    })

    res.json(incidents)
  } catch (error) {
    console.error('Fetch incidents error:', error)
    res.status(500).json({ error: 'Unable to fetch incidents.' })
  }
})

// Create a new incident
router.post('/incidents', async (req, res) => {
  try {
    const { title, description, severity, status } = req.body

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        error: 'Title and description are required.'
      })
    }

    const incident = await prisma.incident.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        severity,
        status
      }
    })

    res.status(201).json(incident)
  } catch (error) {
    console.error('Create incident error:', error)
    res.status(500).json({ error: 'Unable to create incident.' })
  }
})

// Update an incident
router.put('/incidents/:id', async (req, res) => {
  try {
    const { severity, status } = req.body

    const incident = await prisma.incident.update({
      where: { id: req.params.id },
      data: { severity, status }
    })

    res.json(incident)
  } catch (error) {
    console.error('Update incident error:', error)
    res.status(500).json({ error: 'Unable to update incident.' })
  }
})

// Delete an incident
router.delete('/incidents/:id', async (req, res) => {
  try {
    await prisma.incident.delete({
      where: { id: req.params.id }
    })

    res.json({ message: 'Incident deleted successfully.' })
  } catch (error) {
    console.error('Delete incident error:', error)
    res.status(500).json({ error: 'Unable to delete incident.' })
  }
})

module.exports = router
