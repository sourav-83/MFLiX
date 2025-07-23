const express = require("express");

// Module exports a function that takes dependencies (db, authenticateAdmin, authenticateToken)
module.exports = ({ db, authenticateAdmin, authenticateToken }) => {
  const router = express.Router();

  // --- Content Management Routes ---

  // 1. Get All Genres
  // Method: GET
  // URL: /api/content-management/genres
  router.get('/genres', async (req, res) => {
    try {
        // Removed double quotes from "Genres" and "GenreID", "GenreName"
        const result = await db.query('SELECT GenreID, GenreName FROM Genres ORDER BY GenreName');
        // Ensure column names are returned as expected by frontend (e.g., camelCase or specific casing)
        const genres = result.rows.map(row => ({
            genreId: row.genreid, // PostgreSQL returns lowercase by default
            genreName: row.genrename
        }));
        res.json(genres);
    } catch (err) {
        console.error('Error fetching genres:', err);
        res.status(500).json({ message: 'Failed to fetch genres.' });
    }
  });

  // 2. Get All Languages (assuming `Movies` table's Language column defines available languages)
  // Method: GET
  // URL: /api/content-management/languages
  router.get('/languages', async (req, res) => {
    try {
        // Removed double quotes from "Movies" and "Language"
        const result = await db.query('SELECT DISTINCT Language FROM Movies WHERE Language IS NOT NULL ORDER BY Language');
        const languages = result.rows.map(row => row.language); // Access as lowercase
        res.json(languages);
    } catch (err) {
        console.error('Error fetching languages:', err);
        res.status(500).json({ message: 'Failed to fetch languages.' });
    }
  });

  // 3. Search Actors
  // Method: GET
  // URL: /api/content-management/actors/search?name={query}
  router.get('/actors/search', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ message: 'Name query parameter is required.' });
    }
    try {
        // Removed double quotes from "Actors" and "Name", but kept for "ActorID" AS "id" as it's an alias
        const result = await db.query(
            'SELECT ActorID AS id, Name AS name FROM Actors WHERE Name ILIKE $1 ORDER BY Name LIMIT 10',
            [`%${name}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error searching actors:', err);
        res.status(500).json({ message: 'Failed to search actors.' });
    }
  });

  // 4. Search Directors
  // Method: GET
  // URL: /api/content-management/directors/search?name={query}
  router.get('/directors/search', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ message: 'Name query parameter is required.' });
    }
    try {
        // Removed double quotes from "Directors" and "Name", but kept for "DirectorID" AS "id"
        const result = await db.query(
            'SELECT DirectorID AS id, Name AS name FROM Directors WHERE Name ILIKE $1 ORDER BY Name LIMIT 10',
            [`%${name}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error searching directors:', err);
        res.status(500).json({ message: 'Failed to search directors.' });
    }
  });

  // 5. Search Writers
  // Method: GET
  // URL: /api/content-management/writers/search?name={query}
  router.get('/writers/search', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ message: 'Name query parameter is required.' });
    }
    try {
        // Removed double quotes from "Writers" and "Name", but kept for "WriterID" AS "id"
        const result = await db.query(
            'SELECT WriterID AS id, Name AS name FROM Writers WHERE Name ILIKE $1 ORDER BY Name LIMIT 10',
            [`%${name}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error searching writers:', err);
        res.status(500).json({ message: 'Failed to search writers.' });
    }
  });


  // 6. Add New Movie (Comprehensive Endpoint)
  // Method: POST
  // URL: /api/content-management/movies/add
  // ADDED authenticateToken BEFORE authenticateAdmin
  router.post('/movies/add', authenticateToken, authenticateAdmin, async (req, res) => {
    const client = await db.pool.connect(); // Get a client from the pool
    try {
        await client.query('BEGIN'); // Start transaction

        const {
            title, synopsis, releaseDate, duration, language, posterImage, trailer,
            genres, directors, actors, writers
        } = req.body;

        // Generate titleImage from title
        const titleImage = title.replace(/\s+/g, '') + '_title.png'; // Remove spaces and add suffix

        // 1. Insert into Movies table
        // Added TitleImage to the INSERT statement
        const movieInsertResult = await client.query(
            `INSERT INTO Movies (Title, Synopsis, ReleaseDate, Duration, PosterImage, Language, TitleImage)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING MovieID`,
            [title, synopsis, releaseDate, duration, posterImage, language, titleImage] // Added titleImage to values
        );
        const movieId = movieInsertResult.rows[0].movieid; // Access as lowercase

        // 2. Process Genres
        if (genres && Array.isArray(genres)) {
            for (const genreName of genres) {
                let genreId;
                // Check if genre exists
                // Removed double quotes from table name and column names
                const existingGenre = await client.query('SELECT GenreID FROM Genres WHERE GenreName = $1', [genreName]);
                if (existingGenre.rows.length > 0) {
                    genreId = existingGenre.rows[0].genreid; // Access as lowercase
                } else {
                    // Insert new genre if it doesn't exist
                    // Removed double quotes from table name and column names
                    const newGenre = await client.query('INSERT INTO Genres (GenreName) VALUES ($1) RETURNING GenreID', [genreName]);
                    genreId = newGenre.rows[0].genreid; // Access as lowercase
                }
                // Link movie and genre
                // Removed double quotes from table name and column names
                await client.query('INSERT INTO MovieGenres (MovieID, GenreID) VALUES ($1, $2)', [movieId, genreId]);
            }
        }


        // Helper function to process person entities (Actors, Directors, Writers)
        const processPerson = async (personList, tableName, linkTable, personIdColumn, linkPersonIdColumn) => {
            if (!personList || !Array.isArray(personList)) return; // Handle empty or invalid lists
            for (const person of personList) {
                let personId;
                if (person.isNew) {
                    // Check if a person with this name already exists (case-insensitive)
                    // Removed double quotes from tableName and column name
                    const existingPerson = await client.query(
                        `SELECT ${personIdColumn} FROM ${tableName} WHERE Name ILIKE $1`,
                        [person.name]
                    );

                    if (existingPerson.rows.length > 0) {
                        personId = existingPerson.rows[0][personIdColumn.toLowerCase()]; // Access as lowercase
                    } else {
                        // Insert new person with full details
                        // Removed double quotes from tableName and column names
                        const newPerson = await client.query(
                            `INSERT INTO ${tableName} (Name, Image, DateOfBirth, Nationality, Bio)
                             VALUES ($1, $2, $3, $4, $5) RETURNING ${personIdColumn}`,
                            [person.name, person.image || null, person.dateOfBirth || null, person.nationality || null, person.bio || null]
                        );
                        personId = newPerson.rows[0][personIdColumn.toLowerCase()]; // Access as lowercase
                    }
                } else {
                    personId = person.id; // Use existing ID
                }

                // Link movie and person in the respective join table
                if (linkTable === 'Casts') {
                    // Removed double quotes from "Casts" and column names
                    await client.query(
                        'INSERT INTO Casts (MovieID, ActorID, RoleName) VALUES ($1, $2, $3)',
                        [movieId, personId, person.roleName || null] // RoleName can be null
                    );
                } else {
                    // Removed double quotes from linkTable and column names
                    await client.query(
                        `INSERT INTO ${linkTable} (MovieID, ${linkPersonIdColumn}) VALUES ($1, $2)`,
                        [movieId, personId]
                    );
                }
            }
        };

        // 3. Process Directors
        await processPerson(directors, 'Directors', 'MovieDirectors', 'DirectorID', 'DirectorID');

        // 4. Process Actors (Casts)
        await processPerson(actors, 'Actors', 'Casts', 'ActorID', 'ActorID'); // Special case for Casts table

        // 5. Process Writers
        await processPerson(writers, 'Writers', 'MovieWriters', 'WriterID', 'WriterID');

        // 6. Process Trailer
        if (trailer && trailer.url) { // Ensure trailer object and URL exist
            // Removed double quotes from "Trailers" and column names
            await client.query(
                `INSERT INTO Trailers (MovieID, Title, URL, ReleaseDate, Duration)
                 VALUES ($1, $2, $3, $4, $5)`,
                [movieId, trailer.title || null, trailer.url, trailer.releaseDate || null, trailer.duration || null]
            );
        }

        await client.query('COMMIT'); // Commit transaction
        res.status(201).json({ message: 'Movie added successfully!', movieId });

    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error adding movie:', err);
        // Distinguish between client-side validation errors and server errors
        if (err.code === '23505') { // PostgreSQL unique violation error code
             if (err.constraint === 'unique_movie_title') { // Example custom unique constraint name (if you have one)
                 return res.status(409).json({ message: 'A movie with this title already exists.' });
             }
             // Generic primary key / unique constraint error
             return res.status(409).json({ message: 'Duplicate entry detected. This might be a database issue or a movie with this title/combination already exists.' });
        }
        res.status(500).json({ message: 'Failed to add movie. An unexpected error occurred.', details: err.message });
    } finally {
        client.release(); // Release client back to the pool
    }
  });

  return router;
};
