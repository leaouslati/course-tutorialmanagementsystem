import bcrypt from 'bcryptjs'
import pool from '../config/db.js'

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' })
    }

    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
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