const express = require("express");

module.exports = ({ db, authenticateToken }) => {
  const router = express.Router();

  // CAST RATING ROUTES

  // 1)  POST /api/cast/ratings/user  (batch‑fetch user ratings)
  router.post("/ratings/user", authenticateToken, async (req, res) => {
    const userId = req.user.userID;
    const { castIds = [], movieId } = req.body || {};

    if (!Array.isArray(castIds) || castIds.length === 0 || !movieId) {
      return res
        .status(400)
        .json({ error: "castIds[] and movieId are required" });
    }

    try {
      const result = await db.query(
        `SELECT cr.CastID  AS "castId",
                cr.RatingScore AS rating,
                cr.UserID AS "userId"
         FROM   CastRatings   cr
         JOIN   Casts         c  ON c.CastID = cr.CastID
         WHERE  cr.UserID = $1
           AND  c.MovieID = $2
           AND  cr.CastID = ANY($3)`,
        [userId, movieId, castIds]
      );

      res.json(result.rows); // → exact array format required
    } catch (err) {
      console.error("Cast rating fetch error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // 2)  POST /api/cast/:castId/rating  (insert or update)
  router.post("/:castId/rating", authenticateToken, async (req, res) => {
    const userId = req.user.userID;
    const castId = parseInt(req.params.castId);
    const { rating, movieId } = req.body || {};
    console.log("Submitting cast rating:", { userId, castId, rating, movieId });

    if (
      isNaN(castId) ||
      rating == null ||
      rating < 0 ||
      rating > 10 ||
      !movieId
    ) {
      return res
        .status(400)
        .json({ error: "castId, movieId, rating(0‑10) required" });
    }

    // optional: verify the cast row belongs to this movieId
    const castCheck = await db.query(
      "SELECT 1 FROM Casts WHERE CastID = $1 AND MovieID = $2",
      [castId, movieId]
    );
    if (castCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Cast member not found in this movie" });
    }

    try {
      await db.query(
        `INSERT INTO CastRatings (UserID, CastID, RatingScore)
         VALUES ($1, $2, $3)
         ON CONFLICT (UserID, CastID)
         DO UPDATE SET RatingScore = EXCLUDED.RatingScore`,
        [userId, castId, rating]
      );

      res.json({
        success: true,
        message: "Rating submitted successfully",
        userRating: rating,
      });
    } catch (err) {
      console.error("Cast rating upsert error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // 3)  DELETE /api/cast/:castId/rating   (remove user’s rating)
  router.delete("/:castId/rating", authenticateToken, async (req, res) => {
    const userId = req.user.userID;
    const castId = parseInt(req.params.castId);
    const { movieId } = req.body || {};

    if (isNaN(castId) || !movieId) {
      return res.status(400).json({ error: "castId and movieId are required" });
    }

    try {
      await db.query(
        `DELETE FROM CastRatings
         USING Casts
         WHERE CastRatings.UserID = $1
           AND CastRatings.CastID = $2
           AND Casts.CastID     = $2
           AND Casts.MovieID    = $3`,
        [userId, castId, movieId]
      );

      res.json({ success: true, message: "Rating removed successfully" });
    } catch (err) {
      console.error("Cast rating delete error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // 4)  GET /api/cast/:castId/rating-stats   (public stats)
  router.get("/:castId/rating-stats", async (req, res) => {
    const castId = parseInt(req.params.castId);
    if (isNaN(castId)) return res.status(400).json({ error: "Invalid castId" });

    try {
      const stats = await db.query(
        `SELECT
            $1::INT                                          AS "castId",
            COALESCE(ROUND(AVG(RatingScore)::NUMERIC, 2), 0) AS "averageRating",
            COUNT(*)                                         AS "totalRatings"
         FROM CastRatings
         WHERE CastID = $1`,
        [castId]
      );

      res.json(stats.rows[0]);
    } catch (err) {
      console.error("Cast rating stats error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};
