const express = require("express");
const bcrypt = require("bcrypt");

// Module exports a function that takes dependencies (db, generateToken, authenticateToken)
module.exports = ({ db, generateToken, authenticateToken }) => {
  const router = express.Router();

  // AUTHENTICATION ROUTES

  router.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt for:", username);
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      const user = result.rows[0];
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const isValid = await bcrypt.compare(password, user.passwordhash);
      if (!isValid)
        return res.status(400).json({ message: "Invalid credentials" });

      //  Banned User Check ---
      if (user.isbanned) {
        const now = new Date();
        const banUntil = user.banuntil ? new Date(user.banuntil) : null;

        if (banUntil && banUntil > now) {
          // User is currently banned
          return res.status(403).json({
            message: `Your account has been banned until ${banUntil.toDateString()} for not following our community guidelines.`,
          });
        } else {
          // Ban has expired, unban the user
          console.log(`Ban for user ${user.username} has expired. Unbanning...`);
          await db.query(
            `UPDATE Users SET IsBanned = FALSE, BanUntil = NULL WHERE UserID = $1;`,
            [user.userid]
          );
          user.isbanned = false;
          user.banuntil = null;
        }
      }
      // --- END NEW: Banned User Check ---

      // Deactivated User Reactivation Check ---
      if (!user.isactive) {
        console.log(`User ${user.username} account was deactivated. Reactivating...`);
        await db.query(
          `UPDATE Users SET IsActive = TRUE WHERE UserID = $1;`,
          [user.userid]
        );
        // Update user object to reflect active status for token generation
        user.isactive = true;
      }
      // --- END NEW: Deactivated User Reactivation Check ---

      const token = generateToken(user);

      res.status(200).json({
        user: { 
          userID: user.userid, // Changed from 'userid' to 'userID' to match other endpoints
          username: user.username, 
          email: user.email 
        },
        token: token,
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Login failed" });
    }
  });

  router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Signup attempt for:", username);
    try {
      // Check if user already exists
      const existingUser = await db.query(
        "SELECT * FROM users WHERE username = $1 OR email = $2",
        [username, email]
      );
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // Insert new user
      const result = await db.query(
        "INSERT INTO users (username, email, passwordhash, usertype) VALUES ($1, $2, $3, $4) RETURNING userid, username, email",
        [username, email, hashedPassword, "signed_in"]
      );
      const newUser = result.rows[0];
      const token = generateToken(newUser); // Generate token for new user
      
      // Return both user and token (matching signin response structure)
      res.status(201).json({
        user: {
          userID: newUser.userid, // Changed from 'userid' to 'userID' to match other endpoints
          username: newUser.username,
          email: newUser.email,
        },
        token: token
      });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Signup failed" });
    }
  });

  
  router.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logged out" });
  });

  // Verify endpoint
  router.get("/verify", authenticateToken, async (req, res) => {
    try {
      const userID = req.user.userID;

      const result = await db.query(
        "SELECT userid, username, usertype, email FROM users WHERE userid = $1",
        [userID]
      );
      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        user: {
          userID: user.userid, // Changed from 'userid' to 'userID' for consistency
          username: user.username,
          usertype: user.usertype,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Token verification error:", err);
      res.status(500).json({ message: "Token verification failed" });
    }
  });
  return router;
};