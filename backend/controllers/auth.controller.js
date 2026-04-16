import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../config/db.js'

export async function register(req, res) {
  const { name, email, password, role } = req.body

  try {
    // Check if email already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert the new user
    const result = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    )
    const user = result.rows[0]

    // Create JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, user })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function checkEmail(req, res) {
  const { email } = req.body
  try {
    const result = await db.query('SELECT id FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No account found with this email' })
    }
    res.json({ exists: true })
  } catch (error) {
    console.error('Check email error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function forgotPassword(req, res) {
  const { email, newPassword } = req.body

  try {
    const result = await db.query('SELECT id FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No account found with this email' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await db.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hashedPassword, email])

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function login(req, res) {
  const { email, password } = req.body

  try {
    // Find user by email
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}
