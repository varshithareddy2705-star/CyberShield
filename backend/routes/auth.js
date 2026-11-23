
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const prisma = require('../lib/prisma')

const router = express.Router()

// Gmail transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        error: 'All fields are required.'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must contain at least 8 characters.'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
      }
    })

    res.status(201).json({
      message: 'Registration successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      error: 'Unable to register user.'
    })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    })

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      })
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      error: 'Unable to login.'
    })
  }
})

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email?.trim()) {
      return res.status(400).json({
        error: 'Please enter your email address.'
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase()
      }
    })

    const message =
      'If an account exists with that email, a reset link will be sent.'

    if (!user) {
      return res.json({ message })
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    const expiry = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expiry
      }
    })

    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:5173'

    const resetLink =
      `${frontendUrl}/reset-password?token=${resetToken}`

    const emailResult = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Reset your CyberShield password',
      html: `
        <div style="font-family:Arial,sans-serif;padding:25px;color:#1e293b">
          <h2 style="color:#2563eb">CyberShield Password Reset</h2>
          <p>Hello,</p>
          <p>We received a request to reset your CyberShield password.</p>
          <p>This link expires in 15 minutes.</p>
          <a href="${resetLink}"
             style="display:inline-block;background:#2563eb;color:white;padding:13px 22px;text-decoration:none;border-radius:7px">
            Reset Password
          </a>
          <p>If you did not request this, ignore this email.</p>
        </div>
      `
    })
console.log('PASSWORD RESET EMAIL SENT:', emailResult.messageId)
    res.json({ message })
  } catch (error) {
    console.error('PASSWORD RESET ERROR:', error)
    console.error('ERROR MESSAGE:', error.message)
    console.error('ERROR CODE:', error.code)
    console.error('ERROR RESPONSE:', error.response)

    res.status(500).json({
      error: 'Unable to send reset email. Please try again.'
    })
  }
})

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        error: 'Token and new password are required.'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must contain at least 8 characters.'
      })
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    const user = await prisma.user.findUnique({
      where: { resetPasswordToken: hashedToken }
    })

    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      return res.status(400).json({
        error: 'Reset link is invalid or expired.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    })

    res.json({
      message: 'Password reset successful. You can now log in.'
    })
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error)

    res.status(500).json({
      error: 'Unable to reset password.'
    })
  }
})
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' })
})
module.exports = router
