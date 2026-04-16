import bcrypt from "bcrypt";
import db from "../db.js"; // adjust path if needed

// ==========================
// GET LOGGED-IN USER PROFILE
// ==========================
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT id, name, email, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// UPDATE LOGGED-IN USER
// ==========================
export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;

    // 1. Get current user
    const userResult = await db.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // 2. Prepare updated values (keep old if not provided)
    const updatedName = name ?? user.name;
    const updatedEmail = email ?? user.email;

    let updatedPasswordHash = user.password_hash;

    // 3. Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required",
        });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password_hash
      );

      if (!isMatch) {
        return res.status(401).json({
          message: "Incorrect current password",
        });
      }

      updatedPasswordHash = await bcrypt.hash(newPassword, 10);
    }

    // 4. Update user in DB
    const updatedUser = await db.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           password_hash = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, created_at, updated_at`,
      [updatedName, updatedEmail, updatedPasswordHash, userId]
    );

    return res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error("updateMe error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};