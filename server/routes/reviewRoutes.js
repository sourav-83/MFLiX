const express = require("express");

module.exports = ({ db, authenticateToken }) => {
  const router = express.Router();

  // REVIEW ROUTES
  router.get("/user/all", authenticateToken, async (req, res) => {
    console.log('User reviews endpoint called');
    console.log('User from token:', req.user);
    

    const userId = req.user?.userID || req.user?.userid;
    
    if (!userId) {
      console.error('No user ID found in token');
      console.error('Available properties:', Object.keys(req.user || {}));
      return res.status(400).json({ error: "User ID not found in token" });
    }

    try {
      console.log('Fetching reviews for user ID:', userId);
      
      const result = await db.query(
        `SELECT r.reviewid, r.title, r.content, r.ratingscore, r.createdat, r.hasspoiler, r.movieid, m.title AS movieTitle, m.titleimage 
         FROM reviews r JOIN movies m ON(r.movieid = m.movieid)
         WHERE r.userid = $1 AND r.title IS NOT NULL AND r.content IS NOT NULL
         ORDER BY r.createdat DESC`,
        [userId]
      );

      console.log('Database query result:', result.rows.length, 'reviews found');

      const reviews = result.rows.map(row => ({
        reviewId: row.reviewid,
        title: row.title,
        content: row.content,
        ratingscore: row.ratingscore,
        createdAt: row.createdat,
        hasSpoiler: row.hasspoiler,
        movieId: row.movieid,
        movieTitle: row.movietitle, 
        moviePoster: row.titleimage
      }));

      console.log('Sending reviews response:', reviews);
      res.json({ reviews });
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  });

  router.get("/user/check/:movieId", authenticateToken, async (req, res) => {
    const userId = req.user?.userID || req.user?.userid;
    const movieId = parseInt(req.params.movieId);

    if (isNaN(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    try {
      const result = await db.query(
        `SELECT reviewid, title, content, ratingscore, createdat, hasspoiler
       FROM reviews
       WHERE userid = $1 AND movieid = $2`,
        [userId, movieId]
      );

      if (result.rows.length === 0) {
        return res.status(200).json({
          hasReviewed: false,
        });
      }

      // Get the review data
      const review = result.rows[0];

      return res.status(200).json({
        hasReviewed: true,
        reviewId: review.reviewid,
        title: review.title,
        content: review.content,
        ratingscore: review.ratingscore,
        createdAt: review.createdat,
        hasSpoiler: review.hasspoiler,
      });
    } catch (error) {
      console.error("Error checking review status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/movie/:movieId", async (req, res) => {
    const movieId = parseInt(req.params.movieId);

    if (isNaN(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    try {
      const query = `
      SELECT r.reviewid AS id, r.title, r.content, r.ratingscore, r.hasspoiler,
             r.upvotes, r.downvotes, r.createdat,
             u.userid AS "user.id", u.username AS "user.username", u.email AS "user.email"
      FROM reviews r
      JOIN users u ON r.userid = u.userid
      WHERE r.movieid = $1 AND u.IsActive = TRUE 
      ORDER BY r.createdat DESC
    `;
      const result = await db.query(query, [movieId]);

      const reviews = result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        ratingscore: row.ratingscore,
        hasspoiler: row.hasspoiler,
        upvotes: row.upvotes,
        downvotes: row.downvotes,
        createdat: row.createdat,
        user: {
          id: row["user.id"],
          username: row["user.username"],
          email: row["user.email"], // Optional: omit if not needed
        },
      }));

      res.json({ reviews });
    } catch (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // This parameterized route should come AFTER specific routes
  router.get("/user/:movieId", authenticateToken, async (req, res) => {
    const userID = req.user?.userID || req.user?.userid;
    const movieID = parseInt(req.params.movieId);

    // ADDED: Check for NaN here
    if (isNaN(movieID)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    try {
      const result = await db.query(
        `SELECT reviewid id, content review_text, ratingscore rating, createdat created_at, hasspoiler contains_spoiler
      FROM Reviews
       WHERE UserID = $1 AND MovieID = $2`,
        [userID, movieID]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error fetching review:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/reviews   (create OR update if already exists)
  router.post("/", authenticateToken, async (req, res) => {
    const userID = req.user?.userID || req.user?.userid;
    const { movieId, title, content, rating, hasSpoiler } = req.body;

    console.log("Upsert review:", { userID, movieId, title, rating, hasSpoiler });

    if (!movieId || rating == null) {
      return res.status(400).json({ error: "movieId and rating are required" });
    }
    if (rating < 0 || rating > 10) {
      return res.status(400).json({ error: "rating must be between 0 and 10" });
    }

    try {
      const result = await db.query(
        `INSERT INTO Reviews (UserID, MovieID, Title, Content, RatingScore, HasSpoiler)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON  CONFLICT (UserID, MovieID)         -- unique_user_movie_review
         DO UPDATE
           SET Title        = EXCLUDED.Title,
               Content      = EXCLUDED.Content,
               RatingScore  = EXCLUDED.RatingScore,
               HasSpoiler   = EXCLUDED.HasSpoiler,
               CreatedAt    = NOW()
         RETURNING *`,
        [
          userID,
          movieId,
          title || null,
          content || null,
          rating,
          hasSpoiler ?? false,
        ]
      );

      res.status(201).json(result.rows[0]); // same shape for insert or update
    } catch (err) {
      console.error("Upsert review error:", err);
      res.status(500).json({ error: "Failed to save review" });
    }
  });

  router.put("/:reviewId", authenticateToken, async (req, res) => {
    const userID = req.user?.userID || req.user?.userid;
    const reviewID = parseInt(req.params.reviewId);
    const { movieid, rating, review_text, contains_spoiler } = req.body;
    console.log("Updating review:", {
      reviewID,
      movieid,
      rating,
      review_text,
      contains_spoiler,
    });

    try {
      const existing = await db.query(
        "SELECT * FROM Reviews WHERE ReviewID = $1 AND UserID = $2",
        [reviewID, userID]
      );

      if (existing.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Review not found or unauthorized" });
      }

      const updated = await db.query(
        `UPDATE Reviews
         SET MovieID = $1, RatingScore = $2, Content = $3, HasSpoiler = $4
         WHERE ReviewID = $5
         RETURNING *`,
        [
          movieid,
          rating,
          review_text || null,
          contains_spoiler || false,
          reviewID,
        ]
      );

      res.json(updated.rows[0]);
    } catch (err) {
      console.error("Error updating review:", err);
      res.status(500).json({ error: "Failed to update review" });
    }
  });

  router.delete("/:reviewId", authenticateToken, async (req, res) => {
    const userID = req.user?.userID || req.user?.userid;
    const reviewID = parseInt(req.params.reviewId);

    try {
      // Ensure the user owns the review
      const check = await db.query(
        "SELECT * FROM Reviews WHERE ReviewID = $1 AND UserID = $2",
        [reviewID, userID]
      );

      if (check.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Review not found or unauthorized" });
      }

      await db.query("DELETE FROM Reviews WHERE ReviewID = $1", [reviewID]);

      res.json({ message: "Review deleted successfully" });
    } catch (err) {
      console.error("Error deleting review:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/:reviewId/vote", authenticateToken, async (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    const userId = req.user?.userID || req.user?.userid;
    let { voteType } = req.body;
    console.log("Voting on review:", { reviewId, userId, voteType });

    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    voteType = voteType === "upvote" ? "up" : "down";

    try {
      // Check existing vote
      const existingVote = await db.query(
        `SELECT votetype FROM reviewvotes WHERE userid = $1 AND reviewid = $2`,
        [userId, reviewId]
      );

      if (existingVote.rows.length > 0) {
        // Update vote
        await db.query(
          `UPDATE reviewvotes SET votetype = $1 WHERE userid = $2 AND reviewid = $3`,
          [voteType, userId, reviewId]
        );
      } else {
        // Insert new vote
        await db.query(
          `INSERT INTO reviewvotes (userid, reviewid, votetype) VALUES ($1, $2, $3)`,
          [userId, reviewId, voteType]
        );
      }

      // Recalculate upvotes and downvotes using correct enum values
      const voteCounts = await db.query(
        `SELECT
           COUNT(*) FILTER (WHERE votetype = 'up') AS upvotes,
           COUNT(*) FILTER (WHERE votetype = 'down') AS downvotes
         FROM reviewvotes
         WHERE reviewid = $1`,
        [reviewId]
      );

      const { upvotes, downvotes } = voteCounts.rows[0];

      // Update Reviews table counts
      await db.query(
        `UPDATE reviews SET upvotes = $1, downvotes = $2 WHERE reviewid = $3`,
        [upvotes, downvotes, reviewId]
      );

      res.json({
        success: true,
        upvotes: parseInt(upvotes),
        downvotes: parseInt(downvotes),
        userVote: voteType, // returns 'up' or 'down'
      });
    } catch (err) {
      console.error("Error voting on review:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get(
    "/movie/:movieId/votes",
    authenticateToken,
    async (req, res) => {
      const movieId = parseInt(req.params.movieId);
      const userId = req.user?.userID || req.user?.userid;

      if (isNaN(movieId)) {
        return res.status(400).json({ error: "Invalid movie ID" });
      }

      try {
        const query = `
        SELECT r.reviewid, rv.votetype
        FROM reviews r
        LEFT JOIN reviewvotes rv
          ON r.reviewid = rv.reviewid AND rv.userid = $1
        WHERE r.movieid = $2
      `;
        const result = await db.query(query, [userId, movieId]);

        const votes = {};
        for (const row of result.rows) {
          votes[row.reviewid] = row.votetype || null;
        }

        res.json({ votes });
      } catch (err) {
        console.error("Error getting user votes:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // NEW: POST /api/reviews/{reviewId}/report - Report a review
  router.post("/:reviewId/report", authenticateToken, async (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    const reporterUserId = req.user?.userID || req.user?.userid;
    let { reportReason } = req.body; // Use 'let' to allow modification

    if (isNaN(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // If reportReason is not provided or is empty, set a default
    if (!reportReason || reportReason.trim() === "") {
      reportReason = "General Report"; // Default reason
    }

    try {
      // Optional: Check if the review actually exists
      const reviewExists = await db.query(
        "SELECT 1 FROM Reviews WHERE ReviewID = $1;",
        [reviewId]
      );
      if (reviewExists.rows.length === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Insert the report
      const result = await db.query(
        `INSERT INTO ReviewReports (ReviewID, ReporterUserID, ReportReason)
         VALUES ($1, $2, $3)
         ON CONFLICT (ReviewID, ReporterUserID) DO UPDATE
         SET ReportReason = EXCLUDED.ReportReason, ReportedAt = NOW(), IsResolved = FALSE
         RETURNING ReportID;`,
        [reviewId, reporterUserId, reportReason]
      );

      res.status(201).json({
        success: true,
        message: "Review reported successfully",
        reportId: result.rows[0].reportid,
      });
    } catch (error) {
      console.error("Error reporting review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


  return router;
};