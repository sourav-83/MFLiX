const express = require("express");

module.exports = ({ db, authenticateOptionalToken }) => {
  const router = express.Router();

  // TOP PICKS ROUTE
  router.get("/", authenticateOptionalToken, async (req, res) => {
    const userID = req.user?.userID || null;

    console.log("UserID:", userID);

    try {
      let result;

      if (userID) {
        console.log("Fetching preferences for user:", userID);
        const { rows: watchlistPreferences } = await db.query(
          `SELECT DISTINCT mg.GenreID, m.Language
           FROM WatchlistMovies wm
           JOIN MovieGenres mg ON wm.MovieID = mg.MovieID
           JOIN Movies m ON wm.MovieID = m.MovieID
           JOIN Watchlists w ON wm.WatchlistID = w.WatchlistID
           WHERE w.UserID = $1`,
          [userID]
        );

        const genreIds = [...new Set(watchlistPreferences.map(p => p.genreid))];
        const languages = [...new Set(watchlistPreferences.map(p => p.language))];

        console.log("User preferences - Genres:", genreIds, "Languages:", languages);

        
        if (genreIds.length > 0) { 
          let preferenceConditions = [];
          let queryParams = [];
          let paramIndex = 1; 

          if (genreIds.length > 0) {
            preferenceConditions.push(`mg.GenreID = ANY ($${paramIndex})`);
            queryParams.push(genreIds);
            paramIndex++;
          }


          const userIdParamIndex = paramIndex;
          queryParams.push(userID);

          const whereClause = `WHERE (${preferenceConditions.join(' OR ')})
                               AND m.MovieID NOT IN (
                                 SELECT MovieID FROM WatchlistMovies wm
                                 JOIN Watchlists w ON wm.watchlistid = w.watchlistid
                                 WHERE w.UserID = $${userIdParamIndex}
                               )
                               AND m.ReleaseDate >= CURRENT_DATE - INTERVAL '10 years'`;

          console.log("Running personalized query for user:", userID);
          result = await db.query(
            `SELECT
                    m.MovieID AS MovieID,
                    m.Title,
                    m.TitleImage AS titleimage,
                    COALESCE(ROUND(m.AverageRating::NUMERIC, 1), 0) AS rating,
                    STRING_AGG(g.GenreName, ', ') AS genres,
                    EXTRACT(YEAR FROM m.ReleaseDate)::INT AS year,
                    LEFT(m.Synopsis, 200) || '...' AS description,
                    m.AverageRating,
                    m.ReleaseDate
             FROM Movies m
             JOIN MovieGenres mg ON mg.MovieID = m.MovieID
             JOIN Genres g ON g.GenreID = mg.GenreID
             ${whereClause}
             GROUP BY m.MovieID, m.Title, m.TitleImage, m.AverageRating, m.ReleaseDate, m.Synopsis
             ORDER BY m.AverageRating DESC, m.ReleaseDate DESC, m.MovieID DESC
             LIMIT 20`,
            queryParams
          );

          console.log("Personalized results count:", result.rows.length);
        } else {
          console.log("No relevant genre preferences found for user:", userID); // Updated log
        }
      }

      // Fallback: either guest or no matches found from personalized query
      if (!result || result.rows.length === 0) {
        console.log("Using fallback query. UserID:", userID);
        let queryParams = [];
        let userIdCondition = "";
        let paramIndex = 1; // Start paramIndex for the fallback query

        if (userID) {
          // If userID exists, add a condition to exclude movies already in the user's watchlist
          userIdCondition = `
            AND m.MovieID NOT IN (
              SELECT MovieID FROM WatchlistMovies wm
              JOIN Watchlists w ON wm.watchlistid = w.watchlistid
              WHERE w.UserID = $${paramIndex}
            )
          `;
          queryParams.push(userID);
          // paramIndex is not incremented here as it's the last parameter for this specific condition
        }

        result = await db.query(
          `SELECT
                    m.MovieID AS MovieID,
                    m.Title,
                    m.TitleImage AS titleimage,
                    COALESCE(ROUND(m.AverageRating::NUMERIC, 1), 0) AS rating,
                    STRING_AGG(g.GenreName, ', ') AS genres,
                    EXTRACT(YEAR FROM m.ReleaseDate)::INT AS year,
                    LEFT(m.Synopsis, 200) || '...' AS description,
                    m.AverageRating,
                    m.ReleaseDate
           FROM Movies m
           JOIN MovieGenres mg ON mg.MovieID = m.MovieID
           JOIN Genres g ON g.GenreID = mg.GenreID
           WHERE m.Language IN (
             SELECT Language
             FROM Movies
             GROUP BY Language
             ORDER BY COUNT(*) DESC
             LIMIT 3
           )
           AND m.ReleaseDate >= CURRENT_DATE - INTERVAL '5 years'
           AND m.AverageRating >= 7.0
           ${userIdCondition}
           GROUP BY m.MovieID, m.Title, m.TitleImage, m.AverageRating, m.ReleaseDate, m.Synopsis
           ORDER BY m.AverageRating DESC, m.ReleaseDate DESC, m.MovieID DESC
           LIMIT 20`,
           queryParams
        );
        console.log("Fallback results count:", result.rows.length);
      }

      const cleanedRows = result.rows.map(
        ({ averagerating, releasedate, ...rest }) => rest
      );

      console.log("Returning", cleanedRows.length, "movies for user:", userID);
      res.json(cleanedRows);
    } catch (err) {
      console.error("Top-picks error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};
