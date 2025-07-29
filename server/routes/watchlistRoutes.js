const express = require("express");

module.exports = ({ db, authenticateToken }) => {
  const router = express.Router();

  // WATCHLIST ROUTES

  // Add a movie to user's watchlist (Protected)
  router.post("/add", authenticateToken, async (req, res) => {
    const { movieid } = req.body;
    console.log("Adding movie to watchlist:", movieid);
    const userID = req.user.userID;

    try {
      let watchlist = await db.query(
        "SELECT watchlistid FROM watchlists WHERE userid = $1",
        [userID]
      );

      let watchlistId;
      if (watchlist.rows.length === 0) {
        const newWatchlist = await db.query(
          "INSERT INTO watchlists (userid, name) VALUES ($1, $2) RETURNING watchlistid",
          [userID, "My Watchlist"]
        );
        watchlistId = newWatchlist.rows[0].watchlistid;
      } else {
        watchlistId = watchlist.rows[0].watchlistid;
      }

      const exists = await db.query(
        "SELECT * FROM watchlistmovies WHERE watchlistid = $1 AND movieid = $2",
        [watchlistId, movieid]
      );

      if (exists.rows.length > 0) {
        return res.status(400).json({ message: "Movie already in watchlist" });
      }

      await db.query(
        "INSERT INTO watchlistmovies (watchlistid, movieid) VALUES ($1, $2)",
        [watchlistId, movieid]
      );

      res.status(200).json({ message: "Movie added to watchlist" });
    } catch (err) {
      console.error("Add movie error:", err);
      res.status(500).json({ message: "Failed to add movie to watchlist" });
    }
  });

  // Remove a movie from user's watchlist (Protected)
  router.delete("/remove", authenticateToken, async (req, res) => {
    const { movieid } = req.body;
    console.log("Removing movie from watchlist:", movieid);
    const userID = req.user.userID;

    try {
      const watchlist = await db.query(
        "SELECT watchlistid FROM watchlists WHERE userid = $1",
        [userID]
      );

      if (watchlist.rows.length === 0) {
        return res.status(404).json({ message: "Watchlist not found" });
      }

      const watchlistId = watchlist.rows[0].watchlistid;

      const result = await db.query(
        "DELETE FROM watchlistmovies WHERE watchlistid = $1 AND movieid = $2",
        [watchlistId, movieid]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Movie not found in watchlist" });
      }

      res.status(200).json({ message: "Movie removed from watchlist" });
    } catch (err) {
      console.error("Remove movie error:", err);
      res.status(500).json({ message: "Failed to remove movie from watchlist" });
    }
  });

  // Get user's watchlist (Protected) - Updated to return just movies array
  router.get("/", authenticateToken, async (req, res) => { // Path changed to "/" as it's mounted under /api/users/watchlist
    const userID = req.user.userID;
    console.log("Fetching watchlist for user:", userID);

    try {
      const result = await db.query(
        `SELECT
          w.watchlistid,
          w.name AS watchlist_name,
          m.*
        FROM watchlists w
        LEFT JOIN watchlistmovies wm ON w.watchlistid = wm.watchlistid
        LEFT JOIN movies m ON wm.movieid = m.movieid
        WHERE w.userid = $1
        ORDER BY wm.movieid`,
        [userID]
      );

      if (result.rows.length === 0) {
        return res.status(200).json([]);
      }

      const movies = [];

      result.rows.forEach((row) => {
        if (row.movieid) {
          movies.push({
            movieid: row.movieid,
            title: row.title,
            releasedate: row.releasedate,
            titleimage: row.titleimage,
            posterimage: row.posterimage,
            averagerating: row.averagerating,
            synopsis: row.synopsis,
            duration: row.duration,
            language: row.language,
          });
        }
      });

      res.status(200).json(movies);
      console.log(movies.length, "movies found in watchlist for user:", userID);
    } catch (err) {
      console.error("Fetch watchlist error:", err);
      res.status(500).json({ message: "Failed to retrieve watchlist" });
    }
  });

  router.get(
    "/check/:movieId", 
    authenticateToken,
    async (req, res) => {
      const userId = req.user.userID;
      const movieId = parseInt(req.params.movieId);

      if (isNaN(movieId)) {
        return res.status(400).json({ error: "Invalid movie ID" });
      }

      try {
        const query = `
        SELECT 1
        FROM watchlistmovies wm
        JOIN watchlists w ON wm.watchlistid = w.watchlistid
        WHERE w.userid = $1 AND wm.movieid = $2
        LIMIT 1
      `;
        const result = await db.query(query, [userId, movieId]);

        const inWatchlist = result.rows.length > 0;
        return res.status(200).json({ inWatchlist });
      } catch (err) {
        console.error("Error checking watchlist:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  return router;
};
