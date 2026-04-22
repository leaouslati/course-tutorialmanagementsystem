import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

// Simple email format check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// REGISTER
export const register = async (req, res) => {
  try {
    const name = req.body.name?.trim()
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password?.trim()
    const role = req.body.role?.trim()

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'name, email, password, and role are all required' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    if (!['student', 'instructor'].includes(role)) {
      return res.status(400).json({ error: 'Role must be student or instructor' })
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Email already taken' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, passwordHash, role]
    )

    const user = result.rows[0]

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    return res.status(201).json({ token, user })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// CHECK EMAIL (used by forgot-password flow)
export const checkEmail = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase()

    if (!email) return res.status(400).json({ error: 'Email is required' })
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' })

    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No account found with this email' })
    }
    return res.json({ message: 'Email found' })
  } catch (error) {
    console.error('checkEmail error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// LOGIN
export const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password?.trim()

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const result = await pool.query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const user = result.rows[0]

    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// RESET / FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase()
    const newPassword = req.body.newPassword?.trim()

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and newPassword are required' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'No account found with this email' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [hashedPassword, email]
    )

    return res.status(200).json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
