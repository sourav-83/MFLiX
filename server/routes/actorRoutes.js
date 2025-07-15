const express = require("express");

module.exports = ({ db }) => {
  const router = express.Router();

  // ACTOR ROUTES

  // GET /api/actors  – popular actors sorted by rating & movie count
  router.get('/', async (req, res) => {
    try {
      const rows = await db.query(
        `SELECT
           a.ActorID                       AS id,
           a.Name                          AS name,
           a.Image                         AS image,
           LEFT(a.Bio, 300) || '...'       AS bio,
           COUNT(c.CastID)                 AS movies_count,
           COALESCE(ROUND(a.AverageRating::NUMERIC,1),0) AS popularity_score
         FROM   Actors a
         LEFT JOIN Casts c ON c.ActorID = a.ActorID
         GROUP  BY a.ActorID
         ORDER  BY popularity_score DESC, movies_count DESC
         LIMIT  10`
      );

      res.json(rows.rows);   // matches requested JSON
    } catch (err) {
      console.error('Actors list error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/actors/:id – detailed actor info
  router.get('/:id', async (req, res) => {
    const actorId = req.params.id;

    try {
      const actorResult = await db.query(
        `SELECT
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
         GROUP BY a.ActorID`,
        [actorId]
      );

      if (actorResult.rows.length === 0) {
        return res.status(404).json({ error: 'Actor not found' });
      }

      const awardsResult = await db.query(
        `SELECT name as AwardTitle, Year as AwardYear
         FROM Awards
         WHERE RecipientType = 'actor' AND RecipientID = $1
         ORDER BY AwardYear DESC`,
        [actorId]
      );

      const awards = awardsResult.rows.map(
        award => `${award.AwardTitle} (${award.AwardYear})`
      );

      const actorData = { ...actorResult.rows[0], awards };

      console.log('Actor data:', actorData);

      res.json(actorData);
    } catch (err) {
      console.error('Error fetching actor details:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // GET /api/actors/:id/movies – all movies with the actor
  router.get('/:id/movies', async (req, res) => {
    const actorId = req.params.id;

    try {
      const result = await db.query(
        `SELECT
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
         ORDER BY m.ReleaseDate DESC`,
        [actorId]
      );

      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching actor movies:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
