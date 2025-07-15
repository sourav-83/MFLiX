const express = require("express");

module.exports = ({ db, authenticateToken }) => {
  const router = express.Router();

  // USER PROFILE & DATA ROUTES

  // User profile stats endpoint
  router.get("/stats", authenticateToken, async (req, res) => {
    const userID = req.user.userID;

    try {
      const ratingsCount = await db.query(
        "SELECT COUNT(*) FROM Reviews WHERE UserID = $1 AND RatingScore IS NOT NULL",
        [userID]
      );

      const reviewsCount = await db.query(
        "SELECT COUNT(*) FROM Reviews WHERE UserID = $1 AND Content IS NOT NULL",
        [userID]
      );

      const watchlistResult = await db.query(
        `SELECT COUNT(wm.MovieID) AS count
         FROM Watchlists w
         JOIN WatchlistMovies wm ON w.WatchlistID = wm.WatchlistID
         WHERE w.UserID = $1`,
        [userID]
      );

      res.json({
        ratingsCount: parseInt(ratingsCount.rows[0].count),
        reviewsCount: parseInt(reviewsCount.rows[0].count),
        watchlistCount: parseInt(watchlistResult.rows[0].count),
      });
    } catch (error) {
      console.error("User stats error:", error);
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // Update user's movie rating (moved from /api/reviews/user/rating/:movieId to here for user-centric focus)
  router.put("/rating/:movieId", authenticateToken, async (req, res) => {
    const userId = req.user.userID;
    const movieId = parseInt(req.params.movieId, 10);
    const { rating } = req.body || {};

    if (Number.isNaN(movieId))
      return res.status(400).json({ error: "Invalid movie ID" });
    if (rating == null || rating < 0 || rating > 10)
      return res.status(400).json({ error: "rating (0‑10) is required" });

    try {
      const result = await db.query(
        `UPDATE Reviews
         SET RatingScore = $1, CreatedAt = NOW()
         WHERE UserID = $2 AND MovieID = $3
         RETURNING ReviewID, MovieID, RatingScore`,
        [rating, userId, movieId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "No existing review to update" });
      }

      res.json({
        success: true,
        message: "Rating updated successfully",
        review: result.rows[0],
      });
    } catch (err) {
      console.error("Update-rating error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  // Get user's reviewed movies (Protected)
  router.get("/reviewed-movies", authenticateToken, async (req, res) => {
    const userID = req.user.userID;

    try {
      const result = await db.query(
        `
        SELECT
          m.MovieID AS MovieID,
          m.Title,
          m.posterimage,
          m.titleimage,
          r.Content AS review
        FROM Reviews r
        JOIN Movies m ON m.MovieID = r.MovieID
        WHERE r.UserID = $1 AND r.Content IS NOT NULL
        ORDER BY r.CreatedAt DESC
      `,
        [userID]
      );

      res.json({ movies: result.rows });
    } catch (error) {
      console.error("Reviewed movies error:", error);
      res.status(500).json({ error: "Failed to fetch reviewed movies" });
    }
  });

  // Get user's rated movies (Protected)
  router.get("/rated-movies", authenticateToken, async (req, res) => {
    const userID = req.user.userID;

    try {
      const result = await db.query(
        `
        SELECT
          m.MovieID AS MovieID,
          m.Title,
          m.posterimage,
          m.titleimage,
          r.RatingScore
        FROM Reviews r
        JOIN Movies m ON m.MovieID = r.MovieID
        WHERE r.UserID = $1 AND r.RatingScore IS NOT NULL
        ORDER BY r.RatingScore DESC
      `,
        [userID]
      );

      res.json({ movies: result.rows });
    } catch (error) {
      console.error("Rated movies error:", error);
      res.status(500).json({ error: "Failed to fetch rated movies" });
    }
  });

  // ADMIN ROUTE: Check if user is admin
  router.get('/is_admin', authenticateToken, async (req, res) => {
    /**
     * Endpoint to check if the authenticated user is an administrator.
     * Returns: {"isAdmin": true/false}
     */
    const userId = req.user.userID; // UserID from authenticated token

    try {
        const result = await db.query(
            "SELECT UserType FROM Users WHERE UserID = $1;",
            [userId]
        );

        let isAdmin = false;
        if (result.rows.length > 0) {
            const userType = result.rows[0].usertype; // Column names are lowercase by default in pg
            if (userType === 'admin') {
                isAdmin = true;
            }
        }

        res.json({ isAdmin: isAdmin });

    } catch (error) {
        console.error('Database query error for is_admin:', error.stack);
        res.status(500).json({ isAdmin: false, message: "Internal server error" });
    }
  });

  // POST /api/user/deactivate - Deactivate a user's account
  router.post('/deactivate', authenticateToken, async (req, res) => {
    const userID = req.user.userID;
    console.log(`[Deactivate User] Received request to deactivate user ID: ${userID}`);

    try {
      // First, check the current status of the user
      const userCheckResult = await db.query(
        `SELECT IsActive, Username FROM Users WHERE UserID = $1;`,
        [userID]
      );

      if (userCheckResult.rowCount === 0) {
        console.log(`[Deactivate User] User with ID ${userID} not found.`);
        return res.status(404).json({ message: 'User not found' });
      }

      const { isactive, username } = userCheckResult.rows[0];

      if (!isactive) {
        console.log(`[Deactivate User] User ${username} (ID: ${userID}) is already deactivated.`);
        return res.status(400).json({ success: false, message: 'Account is already deactivated.' });
      }

      // Proceed with deactivation
      const result = await db.query(
        `UPDATE Users
         SET IsActive = FALSE
         WHERE UserID = $1
         RETURNING UserID, Username, IsActive;`,
        [userID]
      );

      console.log(`[Deactivate User] User ${result.rows[0].username} (ID: ${userID}) deactivated successfully.`);
      res.json({ success: true, message: 'Account deactivated successfully. You will be logged out.' });

    } catch (error) {
      console.error('[Deactivate User] Error deactivating user:', error);
      res.status(500).json({ message: 'Internal server error', details: error.message });
    }
  });


  return router;
};
