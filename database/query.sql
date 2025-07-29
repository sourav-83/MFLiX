-- Actor routes query
SELECT
    a.ActorID                       AS id,
    a.Name                          AS name,
    a.Image                         AS image,
    LEFT(a.Bio, 300) || '...'       AS bio,
    COUNT(c.CastID)                 AS movies_count,
    COALESCE(ROUND(a.AverageRating::NUMERIC,1),0) AS popularity_score
    FROM   Actors a
    LEFT JOIN Casts c ON c.ActorID = a.ActorID
    GROUP  BY a.ActorID, a.Name, a.Image, a.Bio
    ORDER  BY popularity_score DESC, movies_count DESC
    LIMIT  10;


SELECT
    a.ActorID        AS id,
    a.Name           AS name,
    a.Image          AS image,
    a.DateOfBirth    AS birth_date,
    a.Nationality    AS nationality,
    a.Bio            AS biography,
    COUNT(c.CastID)  AS movies_count,
    COALESCE(ROUND(a.AverageRating::NUMERIC,1), 0) AS popularity_score
    FROM Actors a
    LEFT JOIN Casts c ON a.ActorID = c.ActorID
    WHERE a.ActorID = $1
    GROUP BY a.ActorID; 


SELECT   
    name as AwardTitle, Year as AwardYear
    FROM Awards
    WHERE RecipientType = 'actor' AND RecipientID = $1
    ORDER BY AwardYear DESC;


SELECT
    m.MovieID       AS movieid,
    m.MovieID       AS id,
    m.Title         AS title,
    m.PosterImage   AS titleimage,
    COALESCE(ROUND(m.AverageRating::NUMERIC,1), 0) AS averagerating,
    m.Duration,
    m.ReleaseDate
    FROM Movies m
    JOIN Casts c ON c.MovieID = m.MovieID
    WHERE c.ActorID = $1
    ORDER BY m.ReleaseDate DESC;


-- admin routes query
WITH watchlist_counts AS (
          SELECT w.UserID, COUNT(DISTINCT wm.MovieID) AS watchlist_count
          FROM Watchlists w
          LEFT JOIN WatchlistMovies wm ON w.WatchlistID = wm.WatchlistID
          GROUP BY w.UserID
      ),
      review_stats AS (
          SELECT 
              r.UserID,
              COUNT(DISTINCT r.ReviewID) FILTER (WHERE r.RatingScore IS NOT NULL) AS rating_count,
              COUNT(DISTINCT r.ReviewID) FILTER (WHERE r.Content IS NOT NULL) AS review_count,
              SUM(COALESCE(r.Upvotes, 0) + COALESCE(r.Downvotes, 0)) AS reaction_count
          FROM Reviews r
          GROUP BY r.UserID
      )
      SELECT
          u.UserID AS id,
          u.Username AS username,
          COALESCE(wc.watchlist_count, 0) AS "watchlistCount",
          COALESCE(rs.rating_count, 0) AS "ratingCount",
          COALESCE(rs.review_count, 0) AS "reviewCount",
          COALESCE(rs.reaction_count, 0) AS "reactionCount"
      FROM Users u
      LEFT JOIN watchlist_counts wc ON u.UserID = wc.UserID
      LEFT JOIN review_stats rs ON u.UserID = rs.UserID
      ORDER BY 
          (COALESCE(rs.review_count, 0) + COALESCE(rs.rating_count, 0) + COALESCE(wc.watchlist_count, 0)) DESC
      LIMIT 20;


SELECT
            rr.ReportID AS id,
            u_commenter.Username AS "commenterUsername",
            u_reporter.Username AS "reporterUsername",
            r.Content AS "reviewContent",
            rr.ReportReason AS "reportReason",
            rr.ReportedAt AS "reportDate",
            r.ReviewID AS "reviewId", -- Include reviewId for actions
            u_commenter.UserID AS "commenterUserId" -- Include commenter's UserID for banning
        FROM
            ReviewReports rr
        JOIN
            Reviews r ON rr.ReviewID = r.ReviewID
        JOIN
            Users u_commenter ON r.UserID = u_commenter.UserID
        LEFT JOIN 
            Users u_reporter ON rr.ReporterUserID = u_reporter.UserID
        WHERE
            rr.IsResolved = FALSE -- Only fetch unresolved reports
        ORDER BY
            rr.ReportedAt DESC;


UPDATE ReviewReports
         SET IsResolved = TRUE
         WHERE ReportID = $1
         RETURNING ReportID;



SELECT ReviewID FROM ReviewReports WHERE ReportID = $1;


DELETE FROM Reviews
         WHERE ReviewID = $1
         RETURNING ReviewID;


-- auth routes query

UPDATE Users
         SET IsBanned = TRUE, BanUntil = $1
         WHERE Username = $2
         RETURNING UserID, Username, IsBanned, BanUntil;


SELECT * FROM users WHERE username = $1


UPDATE Users SET IsBanned = FALSE, BanUntil = NULL WHERE UserID = $1;


SELECT * FROM users WHERE username = $1 OR email = $2

SELECT userid, username, usertype, email FROM users WHERE userid = $1

-- cast rating routes query
SELECT cr.CastID  AS "castId",
                cr.RatingScore AS rating,
                cr.UserID AS "userId"
         FROM   CastRatings   cr
         JOIN   Casts         c  ON c.CastID = cr.CastID
         WHERE  cr.UserID = $1
           AND  c.MovieID = $2
           AND  cr.CastID = ANY($3);


INSERT INTO CastRatings (UserID, CastID, RatingScore)
         VALUES ($1, $2, $3)
         ON CONFLICT (UserID, CastID)
         DO UPDATE SET RatingScore = EXCLUDED.RatingScore;


DELETE FROM CastRatings
         USING Casts
         WHERE CastRatings.UserID = $1
           AND CastRatings.CastID = $2
           AND Casts.CastID     = $2
           AND Casts.MovieID    = $3;

SELECT
    $1::INT                                          AS "castId",
    COALESCE(ROUND(AVG(RatingScore)::NUMERIC, 2), 0) AS "averageRating",
    COUNT(*)                                         AS "totalRatings"
    FROM CastRatings
    WHERE CastID = $1;                    


-- content management route
INSERT INTO ${tableName} (Name, Image, DateOfBirth, Nationality, Bio)
        VALUES ($1, $2, $3, $4, $5) RETURNING ${personIdColumn};


INSERT INTO Movies (Title, Synopsis, ReleaseDate, Duration, PosterImage, Language, TitleImage)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING MovieID;


SELECT GenreID, GenreName FROM Genres ORDER BY GenreName;

SELECT DISTINCT Language FROM Movies WHERE Language IS NOT NULL ORDER BY Language;

SELECT ActorID AS id, Name AS name FROM Actors WHERE Name ILIKE $1 ORDER BY Name LIMIT 10;

SELECT DirectorID AS id, Name AS name FROM Directors WHERE Name ILIKE $1 ORDER BY Name LIMIT 10;

SELECT WriterID AS id, Name AS name FROM Writers WHERE Name ILIKE $1 ORDER BY Name LIMIT 10;

INSERT INTO Casts (MovieID, ActorID, RoleName) VALUES ($1, $2, $3);

INSERT INTO ${linkTable} (MovieID, ${linkPersonIdColumn}) VALUES ($1, $2);

INSERT INTO Trailers (MovieID, Title, URL, ReleaseDate, Duration)
                 VALUES ($1, $2, $3, $4, $5);


--  movie routes query
SELECT * FROM movies;

SELECT * FROM movies
        ORDER BY averagerating DESC
        LIMIT 13;

SELECT m.*, COUNT(r.reviewid) AS review_count
        FROM movies m
        LEFT JOIN reviews r ON m.movieid = r.movieid
        WHERE m.releasedate >= CURRENT_DATE - INTERVAL '10 years'
        GROUP BY m.movieid
        ORDER BY review_count DESC, m.averagerating DESC
        LIMIT 20;


SELECT * FROM movies
        WHERE releasedate > CURRENT_DATE
        ORDER BY releasedate ASC
        LIMIT 20;


SELECT DISTINCT m.movieid, m.title
      FROM movies m
      WHERE LOWER(m.title) LIKE LOWER($1)
      ORDER BY m.title ASC
      LIMIT 5;

SELECT DISTINCT m.*
        FROM movies m
        WHERE
          LOWER(m.title) LIKE LOWER($1)
          OR LOWER(m.synopsis) LIKE LOWER($1);



SELECT DISTINCT
          m.*,
          COALESCE(AVG(r.ratingscore)::NUMERIC, 0) as averagerating,
          COUNT(r.ratingscore) as ratingcount
        FROM movies m
        LEFT JOIN reviews r ON m.movieid = r.movieid
        LEFT JOIN moviegenres mg ON m.movieid = mg.movieid
        LEFT JOIN genres g ON mg.genreid = g.genreid
        WHERE 1=1;


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


SELECT m.language, ARRAY_AGG(g.genrename) AS genres
        FROM movies m
        LEFT JOIN moviegenres mg ON m.movieid = mg.movieid
        LEFT JOIN genres g ON mg.genreid = g.genreid
        WHERE m.movieid = $1
        GROUP BY m.language


SELECT GenreID FROM Genres WHERE GenreName = ANY($1);


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
          LIMIT 10;


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
          LIMIT 10;



SELECT DISTINCT mg.GenreID
           FROM WatchlistMovies wm
           JOIN MovieGenres mg ON wm.MovieID = mg.MovieID
           JOIN Watchlists w ON wm.WatchlistID = w.WatchlistID
           WHERE w.UserID = $1
           ORDER BY mg.GenreID;


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
             WHERE mg.GenreID = ANY ($1)
               AND m.MovieID NOT IN (
                 SELECT MovieID FROM WatchlistMovies wm JOIN Watchlists w ON(wm.watchlistid = w.watchlistid) WHERE w.UserID = $2
               )
               AND m.ReleaseDate >= CURRENT_DATE - INTERVAL '10 years'
             GROUP BY m.MovieID, m.Title, m.TitleImage, m.AverageRating, m.ReleaseDate, m.Synopsis
             ORDER BY m.AverageRating DESC, m.ReleaseDate DESC, m.MovieID DESC
             LIMIT 20;           


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
           WHERE m.Language IN (
             SELECT Language
             FROM Movies
             GROUP BY Language
             ORDER BY COUNT(*) DESC
             LIMIT 3
           )
           AND m.ReleaseDate >= CURRENT_DATE - INTERVAL '10 years'
           ${userIdCondition} -- Dynamically add this condition
           GROUP BY m.MovieID, m.Title, m.TitleImage, m.AverageRating, m.ReleaseDate, m.Synopsis
           ORDER BY m.AverageRating DESC, m.ReleaseDate DESC, m.MovieID DESC
           LIMIT 20;


-- review routes query
SELECT r.reviewid, r.title, r.content, r.ratingscore, r.createdat, r.hasspoiler, r.movieid, m.title AS movieTitle, m.titleimage 
         FROM reviews r JOIN movies m ON(r.movieid = m.movieid)
         WHERE r.userid = $1 AND r.title IS NOT NULL AND r.content IS NOT NULL
         ORDER BY r.createdat DESC;


SELECT reviewid, title, content, ratingscore, createdat, hasspoiler
       FROM reviews
       WHERE userid = $1 AND movieid = $2;



SELECT r.reviewid AS id, r.title, r.content, r.ratingscore, r.hasspoiler,
             r.upvotes, r.downvotes, r.createdat,
             u.userid AS "user.id", u.username AS "user.username", u.email AS "user.email"
      FROM reviews r
      JOIN users u ON r.userid = u.userid
      WHERE r.movieid = $1 AND u.IsActive = TRUE 
      ORDER BY r.createdat DESC;


SELECT reviewid id, content review_text, ratingscore rating, createdat created_at, hasspoiler contains_spoiler
      FROM Reviews
       WHERE UserID = $1 AND MovieID = $2;


INSERT INTO Reviews (UserID, MovieID, Title, Content, RatingScore, HasSpoiler)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON  CONFLICT (UserID, MovieID)
         DO UPDATE
           SET Title        = EXCLUDED.Title,
               Content      = EXCLUDED.Content,
               RatingScore  = EXCLUDED.RatingScore,
               HasSpoiler   = EXCLUDED.HasSpoiler,
               CreatedAt    = NOW()
         RETURNING *;


SELECT * FROM Reviews WHERE ReviewID = $1 AND UserID = $2;

UPDATE Reviews
         SET MovieID = $1, RatingScore = $2, Content = $3, HasSpoiler = $4
         WHERE ReviewID = $5
         RETURNING *;

SELECT * FROM Reviews WHERE ReviewID = $1 AND UserID = $2;

DELETE FROM Reviews WHERE ReviewID = $1;

SELECT votetype FROM reviewvotes WHERE userid = $1 AND reviewid = $2;

UPDATE reviewvotes SET votetype = $1 WHERE userid = $2 AND reviewid = $3;

INSERT INTO reviewvotes (userid, reviewid, votetype) VALUES ($1, $2, $3);

SELECT
           COUNT(*) FILTER (WHERE votetype = 'up') AS upvotes,
           COUNT(*) FILTER (WHERE votetype = 'down') AS downvotes
         FROM reviewvotes
         WHERE reviewid = $1;

SELECT r.reviewid, rv.votetype
        FROM reviews r
        LEFT JOIN reviewvotes rv
          ON r.reviewid = rv.reviewid AND rv.userid = $1
        WHERE r.movieid = $2;



SELECT 1 FROM Reviews WHERE ReviewID = $1;

INSERT INTO ReviewReports (ReviewID, ReporterUserID, ReportReason)
         VALUES ($1, $2, $3)
         ON CONFLICT (ReviewID, ReporterUserID) DO UPDATE
         SET ReportReason = EXCLUDED.ReportReason, ReportedAt = NOW(), IsResolved = FALSE
         RETURNING ReportID;

--  user routes query

SELECT COUNT(*) FROM Reviews WHERE UserID = $1 AND RatingScore IS NOT NULL;

SELECT COUNT(*) FROM Reviews WHERE UserID = $1 AND Content IS NOT NULL;

SELECT COUNT(wm.MovieID) AS count
         FROM Watchlists w
         JOIN WatchlistMovies wm ON w.WatchlistID = wm.WatchlistID
         WHERE w.UserID = $1;

UPDATE Reviews
         SET RatingScore = $1, CreatedAt = NOW()
         WHERE UserID = $2 AND MovieID = $3
         RETURNING ReviewID, MovieID, RatingScore;

SELECT
          m.MovieID AS MovieID,
          m.Title,
          m.posterimage,
          m.titleimage,
          r.Content AS review
        FROM Reviews r
        JOIN Movies m ON m.MovieID = r.MovieID
        WHERE r.UserID = $1 AND r.Content IS NOT NULL
        ORDER BY r.CreatedAt DESC;

SELECT
          m.MovieID AS MovieID,
          m.Title,
          m.posterimage,
          m.titleimage,
          r.RatingScore
        FROM Reviews r
        JOIN Movies m ON m.MovieID = r.MovieID
        WHERE r.UserID = $1 AND r.RatingScore IS NOT NULL
        ORDER BY r.RatingScore DESC;


SELECT UserType FROM Users WHERE UserID = $1;       


SELECT IsActive, Username FROM Users WHERE UserID = $1;

UPDATE Users
         SET IsActive = FALSE
         WHERE UserID = $1
         RETURNING UserID, Username, IsActive;


SELECT PasswordHash FROM Users WHERE UserID = $1;

UPDATE Users SET PasswordHash = $1 WHERE UserID = $2;

SELECT watchlistid FROM watchlists WHERE userid = $1;

INSERT INTO watchlists (userid, name) VALUES ($1, $2) RETURNING watchlistid;

SELECT * FROM watchlistmovies WHERE watchlistid = $1 AND movieid = $2;

INSERT INTO watchlistmovies (watchlistid, movieid) VALUES ($1, $2);

SELECT watchlistid FROM watchlists WHERE userid = $1;

DELETE FROM watchlistmovies WHERE watchlistid = $1 AND movieid = $2;

SELECT
          w.watchlistid,
          w.name AS watchlist_name,
          m.*
        FROM watchlists w
        LEFT JOIN watchlistmovies wm ON w.watchlistid = wm.watchlistid
        LEFT JOIN movies m ON wm.movieid = m.movieid
        WHERE w.userid = $1
        ORDER BY wm.movieid;


SELECT 1
        FROM watchlistmovies wm
        JOIN watchlists w ON wm.watchlistid = w.watchlistid
        WHERE w.userid = $1 AND wm.movieid = $2
        LIMIT 1;

        