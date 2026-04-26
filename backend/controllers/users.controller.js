import bcrypt from 'bcryptjs'
import db from '../config/db.js'

// Reusable regex test — rejects strings that aren't valid email addresses
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Return the profile of the currently authenticated user
export const getMe = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, avatar, joined_date
       FROM users
       WHERE id = $1`,
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json(result.rows[0])
  } catch (error) {
    console.error('getMe error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

// Update the authenticated user's name, email, and/or password
// Password change requires currentPassword for verification before hashing the new one
export const updateMe = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const name = req.body.name?.trim()
    const email = req.body.email?.trim().toLowerCase()

    if (email !== undefined && !isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    if (newPassword && !currentPassword) {
      return res.status(400).json({ error: 'currentPassword is required when setting a new password' })
    }

    if (newPassword && newPassword.trim().length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    const userResult = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [req.user.id]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const user = userResult.rows[0]

    // Fall back to existing values if the fields were not sent
    const updatedName = name || user.name
    const updatedEmail = email || user.email
    let updatedPasswordHash = user.password_hash

    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash)

      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect current password' })
      }

      updatedPasswordHash = await bcrypt.hash(newPassword.trim(), 10)
    }

    const updatedUser = await db.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           password_hash = $3
       WHERE id = $4
       RETURNING id, name, email, role, avatar, joined_date`,
      [updatedName, updatedEmail, updatedPasswordHash, req.user.id]
    )

    return res.json(updatedUser.rows[0])
  } catch (error) {
    console.error('updateMe error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
