const express = require("express");

module.exports = ({ db, authenticateOptionalToken }) => {
  const router = express.Router();

  // MOVIE ROUTES

  router.get("/", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM movies");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Get top-rated movies
  router.get("/toprated", async (req, res) => {
    try {
      const result = await db.query(`
        SELECT * FROM movies
        ORDER BY averagerating DESC
        LIMIT 13
      `);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Top rated fetch error:", err);
      res.status(500).json({ message: "Failed to fetch top rated movies" });
    }
  });

  // Get popular movies
  router.get("/popular", async (req, res) => {
    try {
      const result = await db.query(`
        SELECT m.*, COUNT(r.reviewid) AS review_count
        FROM movies m
        LEFT JOIN reviews r ON m.movieid = r.movieid
        WHERE m.releasedate >= CURRENT_DATE - INTERVAL '10 years'
        GROUP BY m.movieid
        ORDER BY review_count DESC, m.averagerating DESC
        LIMIT 20;
      `);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Popular fetch error:", err);
      res.status(500).json({ message: "Failed to fetch popular movies" });
    }
  });

  // Get upcoming movies
  router.get("/upcoming", async (req, res) => {
    try {
      const result = await db.query(`
        SELECT * FROM movies
        WHERE releasedate > CURRENT_DATE
        ORDER BY releasedate ASC
        LIMIT 20
      `);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Upcoming fetch error:", err);
      res.status(500).json({ message: "Failed to fetch upcoming movies" });
    }
  });

  router.get("/suggestions", async (req, res) => {
    console.log("Suggestions query parameters:", req.query);
    const keyword = req.query.q;
    console.log("Suggestions keyword:", keyword);

    if (!keyword || keyword.trim() === "" || keyword.length < 1) {
      return res.status(200).json([]); // Return empty array for short queries
    }

    try {
      const suggestionsQuery = `
      SELECT DISTINCT m.movieid, m.title
      FROM movies m
      WHERE LOWER(m.title) LIKE LOWER($1)
      ORDER BY m.title ASC
      LIMIT 5
    `;

      const result = await db.query(suggestionsQuery, [`%${keyword}%`]);

      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching movie suggestions:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/search", async (req, res) => {
    console.log("Query parameters:", req.query); // Debug log
    const keyword = req.query.q;
    console.log("Search keyword:", keyword);

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Search keyword is required" });
    }

    try {
      const searchQuery = `
        SELECT DISTINCT m.*
        FROM movies m
        WHERE
          LOWER(m.title) LIKE LOWER($1)
          OR LOWER(m.synopsis) LIKE LOWER($1)
      `;

      const result = await db.query(searchQuery, [`%${keyword}%`]);

      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error searching movies:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/advanced-search", async (req, res) => {
    console.log("=== ADVANCED SEARCH REQUEST ===");
    console.log("Raw body:", req.body);

    const {
      query,
      genres,
      yearStart,
      yearEnd,
      ratingMin,
      ratingMax,
      sortBy,
      language,
    } = req.body || {};

    // Check if at least one search criteria is provided
    const hasValidCriteria =
      (query && query.trim() !== "") ||
      (genres && Array.isArray(genres) && genres.length > 0) ||
      (language && language !== "any" && language !== null) ||
      (yearStart &&
        yearEnd &&
        (yearStart !== 1980 || yearEnd !== new Date().getFullYear())) ||
      (ratingMin !== undefined &&
        ratingMax !== undefined &&
        (ratingMin !== 0 || ratingMax !== 10));

    if (!hasValidCriteria) {
      return res.status(400).json({
        error:
          "At least one search criteria is required (title, genre, language, year range, or rating range)",
      });
    }

    try {
      const values = [];
      let paramIndex = 1;

      // Base query with JOIN to get all movie data
      let searchQuery = `
        SELECT DISTINCT
          m.*,
          COALESCE(AVG(r.ratingscore)::NUMERIC, 0) as averagerating,
          COUNT(r.ratingscore) as ratingcount
        FROM movies m
        LEFT JOIN reviews r ON m.movieid = r.movieid
        LEFT JOIN moviegenres mg ON m.movieid = mg.movieid
        LEFT JOIN genres g ON mg.genreid = g.genreid
        WHERE 1=1
      `;

      // Add title/synopsis search only if query is provided
      if (query && query.trim() !== "") {
        searchQuery += ` AND (
          LOWER(m.title) LIKE LOWER($${paramIndex})
          OR LOWER(m.synopsis) LIKE LOWER($${paramIndex})
        )`;
        values.push(`%${query.trim()}%`);
        paramIndex++;
      }

      // Filter by genres (if provided)
      if (genres && Array.isArray(genres) && genres.length > 0) {
        searchQuery += ` AND g.genrename = ANY($${paramIndex})`;
        values.push(genres);
        paramIndex++;
      }

      // Filter by year range
      if (yearStart && yearEnd) {
        searchQuery += ` AND EXTRACT(YEAR FROM m.releasedate) BETWEEN $${paramIndex} AND $${
          paramIndex + 1
        }`;
        values.push(yearStart, yearEnd);
        paramIndex += 2;
      }

      // Filter by language (only if not 'any' or null)
      if (language && language !== "any" && language !== null) {
        searchQuery += ` AND LOWER(m.language) = LOWER($${paramIndex})`;
        values.push(language);
        paramIndex++;
      }

      // Group by movie fields to handle aggregation
      searchQuery += `
        GROUP BY m.movieid, m.title, m.synopsis, m.releasedate, m.language, m.titleimage
      `;

      // Filter by rating range (after aggregation)
      if (ratingMin !== undefined && ratingMax !== undefined) {
        searchQuery += ` HAVING COALESCE(AVG(r.ratingscore)::NUMERIC, 0) BETWEEN $${paramIndex} AND $${
          paramIndex + 1
        }`;
        values.push(ratingMin, ratingMax);
        paramIndex += 2;
      }

      // Add sorting
      switch (sortBy) {
        case "rating":
          searchQuery += ` ORDER BY COALESCE(AVG(r.ratingscore)::NUMERIC, 0) DESC, m.title ASC`;
          break;
        case "release":
          searchQuery += ` ORDER BY m.releasedate DESC, m.title ASC`;
          break;
        case "title":
        default:
          searchQuery += ` ORDER BY m.title ASC`;
          break;
      }

      // Add limit to prevent too many results
      searchQuery += ` LIMIT 100`;

      console.log("=== EXECUTING QUERY ===");
      console.log("Query:", searchQuery);
      console.log("Values:", values);

      const result = await db.query(searchQuery, values);

      console.log("=== QUERY RESULTS ===");
      console.log("Found movies:", result.rows.length);

      if (result.rows.length > 0) {
        console.log("First movie sample:", {
          movieid: result.rows[0].movieid,
          title: result.rows[0].title,
          averagerating: result.rows[0].averagerating,
          releasedate: result.rows[0].releasedate,
          titleimage: result.rows[0].titleimage,
        });
      }

      // Transform the results to match your frontend expectations
      const transformedResults = result.rows.map((movie) => ({
        movieid: movie.movieid,
        title: movie.title,
        synopsis: movie.synopsis,
        releasedate: movie.releasedate,
        duration: movie.duration,
        language: movie.language,
        titleimage: movie.titleimage,
        averagerating: movie.averagerating
          ? parseFloat(movie.averagerating).toFixed(1)
          : null,
        ratingcount: movie.ratingcount || 0,
      }));

      console.log("Transformed results count:", transformedResults.length);
      res.status(200).json(transformedResults);
    } catch (error) {
      console.error("=== SEARCH ERROR ===");
      console.error("Error details:", error);
      console.error("Stack:", error.stack);
      res.status(500).json({
        error: "Search failed",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });

  router.get("/:id", async (req, res) => {
    const movieId = req.params.id;

    // Validate movieId
    if (
      !movieId ||
      movieId === "undefined" ||
      isNaN(parseInt(movieId)) ||
      parseInt(movieId) <= 0
    ) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const parsedMovieId = parseInt(movieId); // Convert to integer

    try {
      const query = `
        SELECT
          m.MovieID, m.Title, m.ReleaseDate, m.Duration, m.TitleImage, m.PosterImage,
          m.AverageRating, m.Synopsis, m.Language,
          COALESCE(json_agg(DISTINCT t.*) FILTER (WHERE t.TrailerID IS NOT NULL), '[]') AS trailers,
          COALESCE(json_agg(DISTINCT r.*) FILTER (WHERE r.ReviewID IS NOT NULL), '[]') AS reviews,
          COALESCE(json_agg(DISTINCT jsonb_build_object(
            'ActorID', a.ActorID,
            'CastID', c.CastID,
            'Name', a.Name,
            'Image', a.Image,
            'DateOfBirth', a.DateOfBirth,
            'Nationality', a.Nationality,
            'AverageRating', a.AverageRating,
            'Bio', a.Bio,
            'RoleName', c.RoleName,
            'CastRating', c.AverageRating
          )) FILTER (WHERE a.ActorID IS NOT NULL), '[]') AS cast,
          COALESCE(json_agg(DISTINCT d.*) FILTER (WHERE d.DirectorID IS NOT NULL), '[]') AS directors,
          COALESCE(json_agg(DISTINCT w.*) FILTER (WHERE w.WriterID IS NOT NULL), '[]') AS writers,
          COALESCE(json_agg(DISTINCT s.*) FILTER (WHERE s.StudioID IS NOT NULL), '[]') AS studios,
          COALESCE(json_agg(DISTINCT g.GenreName) FILTER (WHERE g.GenreID IS NOT NULL), '[]') AS genres,
          COALESCE(json_agg(DISTINCT jsonb_build_object(
            'AwardID', aw.AwardID,
            'Name', aw.Name,
            'Category', aw.Category,
            'Year', aw.Year,
            'RecipientType', aw.RecipientType,
            'RecipientID', aw.RecipientID,
            'RecipientName', CASE
              WHEN aw.RecipientType = 'actor' THEN award_actor.Name
              WHEN aw.RecipientType = 'director' THEN award_director.Name
              WHEN aw.RecipientType = 'movie' THEN m.Title
            END
          )) FILTER (WHERE aw.AwardID IS NOT NULL), '[]') AS awards
        FROM Movies m
        LEFT JOIN Trailers t ON m.MovieID = t.MovieID
        LEFT JOIN Reviews r ON m.MovieID = r.MovieID
        LEFT JOIN Casts c ON m.MovieID = c.MovieID
        LEFT JOIN Actors a ON c.ActorID = a.ActorID
        LEFT JOIN MovieDirectors md ON m.MovieID = md.MovieID
        LEFT JOIN Directors d ON md.DirectorID = d.DirectorID
        LEFT JOIN MovieWriters mw ON m.MovieID = mw.MovieID
        LEFT JOIN Writers w ON mw.WriterID = w.WriterID
        LEFT JOIN MovieStudios ms ON m.MovieID = ms.MovieID
        LEFT JOIN Studios s ON ms.StudioID = s.StudioID
        LEFT JOIN MovieGenres mg ON m.MovieID = mg.MovieID
        LEFT JOIN Genres g ON mg.GenreID = g.GenreID
        LEFT JOIN Awards aw ON m.MovieID = aw.MovieID
        LEFT JOIN Actors award_actor ON aw.RecipientType = 'actor' AND aw.RecipientID = award_actor.ActorID
        LEFT JOIN Directors award_director ON aw.RecipientType = 'director' AND aw.RecipientID = award_director.DirectorID
        WHERE m.MovieID = $1
        GROUP BY m.MovieID;
      `;

      const result = await db.query(query, [parsedMovieId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Movie not found" });
      }

      const movie = result.rows[0];
      console.log("Raw trailers:", movie.trailers);
      console.log("Raw reviews:", movie.reviews);
      console.log("Raw cast:", movie.cast);
      console.log("Raw directors:", movie.directors);
      console.log("Raw writers:", movie.writers);
      console.log("Raw studios:", movie.studios);
      console.log("Raw genres:", movie.genres);
      console.log("Raw awards:", movie.awards);

      res.json(movie);
    } catch (err) {
      console.error(
        "Error fetching movie details for movieId:",
        parsedMovieId,
        err
      );
      res.status(500).json({ message: "Server error" });
    }
  });

  //Suggest similar movies based on genres and language
  router.get("/:id/similar", authenticateOptionalToken, async (req, res) => {
    const movieId = req.params.id;
    const userID = req.user?.userID || null; // Get authenticated user ID if available

    try {
      const movieInfoQuery = `
        SELECT m.language, ARRAY_AGG(g.genrename) AS genres
        FROM movies m
        LEFT JOIN moviegenres mg ON m.movieid = mg.movieid
        LEFT JOIN genres g ON mg.genreid = g.genreid
        WHERE m.movieid = $1
        GROUP BY m.language
      `;
      const movieInfoResult = await db.query(movieInfoQuery, [movieId]);

      if (movieInfoResult.rows.length === 0) {
        return res.status(404).json({ message: "Movie not found" });
      }

      const { language, genres: genreNames } = movieInfoResult.rows[0]; // Renamed to genreNames

      let genreIds = [];
      if (genreNames && genreNames.length > 0) {
        const genreIdsResult = await db.query(
          `SELECT GenreID FROM Genres WHERE GenreName = ANY($1);`,
          [genreNames]
        );
        genreIds = genreIdsResult.rows.map((row) => row.genreid);
      }

      // Prioritize movies not in the user's watchlist if authenticated
      let similarMoviesQuery;
      let queryParams;

      if (userID && genreIds.length > 0) {
        // If user is logged in and has genres in watchlist, suggest based on those
        similarMoviesQuery = `
          SELECT
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
          WHERE m.MovieID != $1
            AND mg.GenreID = ANY ($2)
            AND m.MovieID NOT IN (
              SELECT MovieID FROM WatchlistMovies wm JOIN Watchlists w ON(wm.watchlistid = w.watchlistid) WHERE w.UserID = $3
            )
            AND m.ReleaseDate >= CURRENT_DATE - INTERVAL '10 years' -- Recent movies
          GROUP BY m.MovieID, m.Title, m.TitleImage, m.AverageRating, m.ReleaseDate, m.Synopsis
          ORDER BY m.AverageRating DESC, m.ReleaseDate DESC
          LIMIT 10
        `;
        queryParams = [movieId, genreIds, userID]; // Pass genreIds
      } else {
        // Fallback for guest users or users with empty watchlists
        similarMoviesQuery = `
          SELECT
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
          WHERE m.MovieID != $1
            AND (LOWER(m.language) = LOWER($2) OR mg.GenreID = ANY($3)) -- Use mg.GenreID and $3
            AND m.ReleaseDate >= CURRENT_DATE - INTERVAL '10 years' -- Recent movies
          GROUP BY m.MovieID, m.Title, m.TitleImage, m.AverageRating, m.ReleaseDate, m.Synopsis
          ORDER BY m.AverageRating DESC, m.ReleaseDate DESC
          LIMIT 10
        `;
        queryParams = [movieId, language, genreIds]; // Pass genreIds
      }

      const result = await db.query(similarMoviesQuery, queryParams);

      // Remove extra fields from the response
      const cleanedRows = result.rows.map(
        ({ averagerating, releasedate, ...rest }) => rest
      );
      res.status(200).json(cleanedRows);
    } catch (error) {
      console.error("Error fetching similar movies:", error);
      res.status(500).json({ message: "Server error fetching similar movies" });
    }
  });

  return router;
};
