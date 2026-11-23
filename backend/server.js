require('dotenv').config()

const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const scannerRoutes = require('./routes/scanner')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', scannerRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CyberShield Backend!',
    status: 'Server is running'
  })
})

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`CyberShield server running on port ${PORT}`)
})