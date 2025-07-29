-- Independent: Users
INSERT INTO Users (Username, Email, PasswordHash, UserType) VALUES
('alice', 'alice@example.com', 'hash1', 'signed_in'),
('bob', 'bob@example.com', 'hash2', 'signed_in'),
('charlie', 'charlie@example.com', 'hash3', 'signed_in'),
('diana', 'diana@example.com', 'hash4', 'signed_in'),
('eve', 'eve@example.com', 'hash5', 'admin');

select * from users;

-- Independent: Genres
INSERT INTO Genres (GenreName) VALUES
('Drama'), ('Comedy'), ('Romance'), ('Adventure'), ('Sci-Fi'),
('Animation'), ('Mystery'), ('Fantasy'), ('History'), ('Action');

INSERT INTO Genres (GenreName) VALUES ('Crime');
INSERT INTO Genres (GenreName) VALUES ('Horror');
INSERT INTO Genres (GenreName) VALUES ('Thriller');

-- Independent: Studios
INSERT INTO Studios (Name, Logo, FoundedYear, Website) VALUES
('Barunson E&A', 'barunson.png', 1999, 'https://barunsonena.com'),
('Vinod Chopra Films', 'vinodchopra.png', 1985, 'https://vinodchoprafilms.com'),
('CoMix Wave Films', 'comixwave.png', 2007, 'https://www.cwfilms.jp'),
('Satyajit Ray Productions', 'rayproductions.png', 1955, 'https://satyajitray.org'),
('Warner Bros.', 'warnerbros.png', 1923, 'https://warnerbros.com'),
('20th Century Fox', 'fox.png', 1935, 'https://20thcenturystudios.com'),
('Rising Sun Films', 'risingsun.png', 1999, 'https://risingsunfilms.com'),
('Moho Film', 'moho.png', 2002, 'https://moho.co.kr'),
('Studio Ghibli', 'ghibli.png', 1985, 'https://ghibli.jp'),
('Chitrabani Studios', 'chitrabani.png', 1950, 'https://chitrabani.org');

-- Independent: Directors
INSERT INTO Directors (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Bong Joon-ho', 'Bong_Joon-ho.png', '1969-09-14', 'South Korean', 'Director of Parasite and Memories of Murder.'),
('Rajkumar Hirani', 'Rajkumar_Hirani.png', '1962-11-20', 'Indian', 'Known for 3 Idiots and PK.'),
('Makoto Shinkai', 'Makoto_Shinkai.png', '1973-02-09', 'Japanese', 'Directed Your Name and Weathering with You.'),
('Satyajit Ray', 'Satyajit_Ray.png', '1921-05-02', 'Indian', 'Legendary filmmaker known for Pather Panchali.'),
('Christopher Nolan', 'Christopher_Nolan.png', '1970-07-30', 'British-American', 'Famous for Inception and Interstellar.'),
('James Cameron', 'James_Cameron.png', '1954-08-16', 'Canadian', 'Directed Avatar and Titanic.'),
('Park Chan-wook', 'Park_Chan-wook.png', '1963-08-23', 'South Korean', 'Known for The Handmaiden and Oldboy.'),
('Shoojit Sircar', 'Shoojit_Sircar.png', '1967-06-17', 'Indian', 'Directed October and Piku.'),
('Hayao Miyazaki', 'Hayao_Miyazaki.png', '1941-01-05', 'Japanese', 'Co-founder of Studio Ghibli.'),
('Ritwik Ghatak', 'Ritwik_Ghatak.png', '1925-11-04', 'Indian', 'Iconic Bengali filmmaker.');

select * from movies;

-- Independent: Writers
INSERT INTO Writers (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Abhijat Joshi', 'Abhijat_Joshi.png', '1969-12-01', 'Indian', 'Wrote for 3 Idiots and Lage Raho Munna Bhai.'),
('Satyajit Ray', 'Satyajit_Ray.png', '1921-05-02', 'Indian', 'Wrote and directed the Apu Trilogy.'),
('Makoto Shinkai', 'Makoto_Shinkai.png', '1973-02-09', 'Japanese', 'Also writes his own films.'),
('Jonathan Nolan', 'Jonathan_Nolan.png', '1976-06-06', 'British-American', 'Collaborator with Christopher Nolan.'),
('Bong Joon-ho', 'Bong_Joon-ho.png', '1969-09-14', 'South Korean', 'Wrote his own award-winning films.'),
('Park Chan-wook', 'Park_Chan-wook.png', '1963-08-23', 'South Korean', 'Writer of The Handmaiden.'),
('James Cameron', 'James_Cameron.png', '1954-08-16', 'Canadian', 'Also writes his movies.'),
('Shoojit Sircar', 'Shoojit_Sircar.png', '1967-06-17', 'Indian', 'Writer-director.'),
('Hayao Miyazaki', 'Hayao_Miyazaki.png', '1941-01-05', 'Japanese', 'Writes his own anime scripts.'),
('Ritwik Ghatak', 'Ritwik_Ghatak.png', '1925-11-04', 'Indian', 'Writer-director of Meghe Dhaka Tara.');

-- Independent: Actors
INSERT INTO Actors (Name, Image, DateOfBirth, Nationality, AverageRating, Bio) VALUES
('Aamir Khan', 'Aamir_Khan.png', '1965-03-14', 'Indian', 9.4, 'Known for transformative roles in Hindi cinema.'),
('Leonardo DiCaprio', 'Leonardo_DiCaprio.png', '1974-11-11', 'American', 9.1, 'Acclaimed actor and Oscar winner.'),
('Song Kang-ho', 'Song_Kang-ho.png', '1967-01-17', 'South Korean', 9.2, 'Lead actor in Parasite.'),
('Ken Watanabe', 'Ken_Watanabe.png', '1959-10-21', 'Japanese', 8.8, 'Famous for Last Samurai, Inception.'),
('Dev Patel', 'Dev_Patel.png', '1990-04-23', 'British', 8.6, 'Known for Slumdog Millionaire.'),
('Soumitra Chatterjee', 'Soumitra_Chatterjee.png', '1935-01-19', 'Indian', 8.9, 'Worked extensively with Satyajit Ray.'),
('Sam Worthington', 'Sam_Worthington.png', '1976-08-02', 'Australian', 8.3, 'Played Jake Sully in Avatar.'),
('Varun Dhawan', 'Varun_Dhawan.png', '1987-04-24', 'Indian', 8.4, 'Starred in October.'),
('Ryunosuke Kamiki', 'Ryunosuke_Kamiki.png', '1993-05-19', 'Japanese', 8.7, 'Voice actor in Your Name.'),
('Banita Sandhu', 'Banita_Sandhu.png', '1997-06-22', 'British-Indian', 8.2, 'Debuted in October.'),
('Rumi Hiiragi', 'Rumi_Hiiragi.png', '1987-08-01', 'Japanese', 8.5, 'Voice actress known for Spirited Away.'),
('Supriya Devi', 'Supriya_Devi.png', '1933-01-08', 'Indian', 8.8, 'Renowned actress in Bengali cinema.'),
('Kim Min-hee', 'Kim_Min-hee.png', '1982-03-01', 'South Korean', 8.6, 'Award-winning actress from The Handmaiden.');

select * from actors;

-- Independent: Movies
INSERT INTO Movies (Title, ReleaseDate, Duration, TitleImage, PosterImage, AverageRating, Synopsis, Language) VALUES
('Parasite', '2019-05-30', 132, 'Parasite_title.png', 'Parasite_poster.png', 9.5, 'A poor family schemes to become employed by a wealthy family.', 'Korean'),
('3 Idiots', '2009-12-25', 171, '3_Idiots_title.png', '3_Idiots_poster.png', 9.2, 'Three friends learn the true meaning of education.', 'Hindi'),
('Your Name', '2016-08-26', 112, 'Your_Name_title.png', 'Your_Name_poster.png', 8.9, 'Two teenagers swap bodies across time and space.', 'Japanese'),
('Pather Panchali', '1955-08-26', 125, 'Pather_Panchali_title.png', 'Pather_Panchali_poster.png', 9.4, 'A poor Bengali family struggles in rural India.', 'Bengali'),
('Inception', '2010-07-16', 148, 'Inception_title.png', 'Inception_poster.png', 8.8, 'A thief enters dreams to plant ideas.', 'English'),
('The Handmaiden', '2016-06-01', 145, 'The_Handmaiden_title.png', 'The_Handmaiden_poster.png', 8.4, 'A con man hires a pickpocket to swindle a rich woman.', 'Korean'),
('October', '2018-04-13', 115, 'October_title.png', 'October_poster.png', 7.9, 'A man’s bond with a comatose woman changes him.', 'Hindi'),
('Spirited Away', '2001-07-20', 125, 'Spirited_Away_title.png', 'Spirited_Away_poster.png', 9.3, 'A girl is trapped in a spirit world.', 'Japanese'),
('Avatar', '2009-12-18', 162, 'Avatar_title.png', 'Avatar_poster.png', 8.2, 'A paraplegic marine sent to the moon Pandora.', 'English'),
('Meghe Dhaka Tara', '1960-05-14', 130, 'Meghe_Dhaka_Tara_title.png', 'Meghe_Dhaka_Tara_poster.png', 9.1, 'Post-partition Bengali family struggles.', 'Bengali');

INSERT INTO Movies (Title, ReleaseDate, Duration, TitleImage, PosterImage, AverageRating, Synopsis, Language) VALUES
('Avengers: Doomsday', '2026-05-01', 150, 'Avengers_Doomsday_title.png', 'Avengers_Doomsday_poster.png', 0.0, 'The Avengers face Doctor Doom in a multiversal battle to save reality.', 'English');

INSERT INTO Studios (Name, Logo, FoundedYear, Website) VALUES
('Marvel Studios', 'marvelstudios.png', 1993, 'https://www.marvel.com');

-- Insert into Directors
INSERT INTO Directors (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Anthony Russo', 'Anthony_Russo.png', '1970-02-03', 'American', 'Co-director of Avengers: Endgame and Avengers: Doomsday.'),
('Joe Russo', 'Joe_Russo.png', '1971-07-18', 'American', 'Co-director of Avengers: Endgame and Avengers: Doomsday.');

-- Insert into Writers
INSERT INTO Writers (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Stephen McFeely', 'Stephen_McFeely.png', '1970-02-24', 'American', 'Writer for Avengers: Endgame and Avengers: Doomsday.');

-- Insert into Actors
INSERT INTO Actors (Name, Image, DateOfBirth, Nationality, AverageRating, Bio) VALUES
('Robert Downey Jr.', 'Robert_Downey_Jr.png', '1965-04-04', 'American', 9.0, 'Known for Iron Man and playing Doctor Doom in Avengers: Doomsday.'),
('Chris Evans', 'Chris_Evans.png', '1981-06-13', 'American', 8.8, 'Known for Captain America, potential role in Avengers: Doomsday.');

select * from movies;

-- Relational: Movies ↔ Genres
INSERT INTO MovieGenres (GenreID, MovieID) VALUES
(1, 1),  -- Parasite - Drama
(2, 1),  -- Parasite - Thriller

(1, 2),  -- 3 Idiots - Drama
(3, 2),  -- 3 Idiots - Comedy

(1, 3),  -- Your Name - Drama
(4, 3),  -- Your Name - Romance
(6, 3),  -- Your Name - Fantasy

(1, 4),  -- Pather Panchali - Drama
(9, 4),  -- Pather Panchali - Biography

(2, 5),  -- Inception - Thriller
(5, 5),  -- Inception - Sci-Fi

(2, 6),  -- The Handmaiden - Thriller
(7, 6),  -- The Handmaiden - Mystery

(1, 7),  -- October - Drama
(4, 7),  -- October - Romance

(6, 8),  -- Spirited Away - Fantasy
(8, 8),  -- Spirited Away - Animation

(5, 9),  -- Avatar - Sci-Fi
(10, 9), -- Avatar - Action

(1, 10), -- Meghe Dhaka Tara - Drama
(9, 10); -- Meghe Dhaka Tara - Biography

INSERT INTO MovieGenres (GenreID, MovieID) VALUES
(5, 11), -- Avengers: Doomsday - Sci-Fi
(10, 11), -- Avengers: Doomsday - Action
(4, 11); -- Avengers: Doomsday - Adventure

-- Relational: Movies ↔ Directors
INSERT INTO MovieDirectors (MovieID, DirectorID) VALUES
(1, 1),   -- Parasite - Bong Joon-ho
(2, 2),   -- 3 Idiots - Rajkumar Hirani
(3, 3),   -- Your Name - Makoto Shinkai
(4, 4),   -- Pather Panchali - Satyajit Ray
(5, 5),   -- Inception - Christopher Nolan
(6, 7),   -- The Handmaiden - Park Chan-wook
(7, 8),   -- October - Shoojit Sircar
(8, 9),   -- Spirited Away - Hayao Miyazaki
(9, 6),   -- Avatar - James Cameron
(10, 10); -- Meghe Dhaka Tara - Ritwik Ghatak
INSERT INTO MovieDirectors (MovieID, DirectorID) VALUES
(11, 11), -- Avengers: Doomsday - Anthony Russo, Joe Russo
(11, 12); -- Avengers: Doomsday - Stephen McFeely




-- Relational: Movies ↔ Studios
INSERT INTO MovieStudios (MovieID, StudioID) VALUES
(1, 1),   -- Parasite - Barunson E&A
(2, 2),   -- 3 Idiots - Vinod Chopra Films
(3, 3),   -- Your Name - CoMix Wave Films
(4, 4),   -- Pather Panchali - Government of West Bengal
(5, 5),   -- Inception - Syncopy
(6, 8),   -- The Handmaiden - Moho Film
(7, 7),   -- October - Rising Sun Films
(8, 9),   -- Spirited Away - Studio Ghibli
(9, 6),   -- Avatar - Lightstorm Entertainment
(10, 10); -- Meghe Dhaka Tara - Chitrakalpa

INSERT INTO MovieStudios (MovieID, StudioID) VALUES
(11, 11); -- Avengers: Doomsday - Marvel Studios

-- Relational: Movies ↔ Writers
INSERT INTO MovieWriters (MovieID, WriterID) VALUES
(1, 5),   -- Parasite - Bong Joon-ho
(2, 1),   -- 3 Idiots - Abhijat Joshi
(3, 3),   -- Your Name - Makoto Shinkai
(4, 2),   -- Pather Panchali - Satyajit Ray
(5, 4),   -- Inception - Christopher Nolan
(6, 6),   -- The Handmaiden - Park Chan-wook
(7, 8),   -- October - Juhi Chaturvedi
(8, 9),   -- Spirited Away - Hayao Miyazaki
(9, 7),   -- Avatar - James Cameron
(10, 10); -- Meghe Dhaka Tara - Ritwik Ghatak

INSERT INTO MovieWriters (MovieID, WriterID) VALUES
(11, 11); -- Avengers: Doomsday - Stephen McFeely

-- Relational: Movies ↔ Actors
INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
(1, 3, 'Kim Ki-taek', 9.2),                -- Parasite → Song Kang-ho
(2, 1, 'Rancho', 9.4),                     -- 3 Idiots → Aamir Khan
(3, 9, 'Taki Tachibana (voice)', 8.7),     -- Your Name → Ryunosuke Kamiki
(4, 6, 'Apu', 8.9),                        -- Pather Panchali → Soumitra Chatterjee
(5, 2, 'Cobb', 9.1),                       -- Inception → Leonardo DiCaprio
(6, 13, 'Lady Hideko', 8.6),              -- The Handmaiden → Kim Min-hee (ID 12)
(7, 8, 'Dan', 8.4),                        -- October → Varun Dhawan
(8, 11, 'Chihiro (voice)', 8.9),          -- Spirited Away → Rumi Hiiragi (ID 11)
(9, 7, 'Jake Sully', 8.3),                -- Avatar → Sam Worthington
(10, 12, 'Neeta', 8.8);                   -- Meghe Dhaka Tara → Supriya Devi (ID 13)

UPDATE Casts
SET actorID = 13
WHERE actorId = 12 AND MovieID = 6;

UPDATE Casts
SET actorID = 12
WHERE actorId = 13 AND MovieID = 10;
INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
(11, 14, 'Doctor Doom', 0.0), -- Avengers: Doomsday → Robert Downey Jr. (ID 14)
(11, 15, 'Captain America', 0.0); -- Avengers: Doomsday → Chris Evans (ID 15)

-- Relational: Users ↔ Watchlists ↔ Movies
INSERT INTO Watchlists (UserID, Name) VALUES
(1, 'Favorites'), (2, 'Must Watch'), (3, 'Asian Cinema'), (4, 'Animation Picks'), (5, 'Drama Collection');

INSERT INTO WatchlistMovies (WatchlistID, MovieID) VALUES
(1, 1), (1, 2), (2, 5), (2, 6), (2, 9),
(3, 1), (3, 4), (3, 6), (4, 3), (4, 8),
(5, 4), (5, 7), (5, 10);

-- Relational: Movies ↔ Trailers
INSERT INTO Trailers (MovieID, Title, URL, ReleaseDate, Duration) VALUES
(1, 'Parasite Trailer', 'https://youtube.com/parasite', '2019-04-01', 120),
(2, '3 Idiots Trailer', 'https://youtube.com/3idiots', '2009-11-01', 150),
(3, 'Your Name Trailer', 'https://youtube.com/yourname', '2016-07-10', 90),
(4, 'Pather Panchali Trailer', 'https://youtube.com/patherpanchali', '1955-06-01', 60),
(5, 'Inception Trailer', 'https://youtube.com/inception', '2010-05-10', 150),
(6, 'The Handmaiden Trailer', 'https://youtube.com/handmaiden', '2016-04-01', 120),
(7, 'October Trailer', 'https://youtube.com/october', '2018-03-01', 110),
(8, 'Spirited Away Trailer', 'https://youtube.com/spiritedaway', '2001-06-15', 130),
(9, 'Avatar Trailer', 'https://youtube.com/avatar', '2009-10-01', 160),
(10, 'Meghe Dhaka Tara Trailer', 'https://youtube.com/meghedhakatara', '1960-08-01', 70);

-- Update Trailers table with new titles and YouTube video IDs based on provided JSON data
UPDATE Trailers t
SET 
    Title = updates.new_title,
    URL = updates.new_url
FROM (
    VALUES
        ('Parasite', 'Parasite Trailer', '5xH0HfJHsaY'),
        ('3 Idiots', '3 Idiots Trailer', 'K0eDlFX9GMc'),
        ('Your Name', 'Your Name Trailer', 'xU47nhruN-Q'),
        ('Pather Panchali', 'Pather Panchali Trailer', 'KNvVucYbSHE'),
        ('Inception', 'Inception Trailer', 'YoHD9XEInc0'),
        ('The Handmaiden', 'The Handmaiden Trailer', 'whldChqCsYk'),
        ('October', 'October Trailer', '7vracgLyJwI'),
        ('Spirited Away', 'Spirited Away Trailer', 'ByXuk9QqQkk'),
        ('Avatar', 'Avatar Trailer', 'd9MyW72ELq0'),
        ('Meghe Dhaka Tara', 'Meghe Dhaka Tara Trailer', 'ZT5UEzQeDGg')
) AS updates(movie_title, new_title, new_url)
JOIN Movies m ON m.Title = updates.movie_title
WHERE t.MovieID = m.MovieID;

INSERT INTO Trailers (MovieID, Title, URL, ReleaseDate, Duration) VALUES
(11, 'Avengers: Doomsday Trailer', 'aZXBFirj6b4', '2026-04-01', 180);

UPDATE Trailers 
SET 
    url = 'wJnuUMc7gZ4'
WHERE 
    MovieID = 31;

UPDATE Trailers 
SET 
    url = 'AdmTl8vNDUU'
WHERE 
    MovieID = 4;            

select * from trailers;
-- Relational: Users ↔ Reviews ↔ Movies
INSERT INTO Reviews (UserID, MovieID, Title, Content, RatingScore, Upvotes, Downvotes, HasSpoiler) VALUES
(1, 1, 'Masterpiece', 'Parasite is a genius social satire.', 10, 120, 2, FALSE),
(2, 2, 'Inspirational', 'Every student must watch 3 Idiots.', 9, 90, 3, FALSE),
(3, 3, 'Beautiful', 'Animation and story are top-notch.', 9, 85, 1, FALSE),
(4, 4, 'Timeless', 'A moving story of poverty and resilience.', 10, 60, 0, FALSE),
(5, 5, 'Mind-bending', 'Nolan never disappoints.', 9, 150, 5, FALSE);

-- Relational: Movies / Actors / Directors ↔ Awards
INSERT INTO Awards (Name, Category, Year, RecipientType, RecipientID, MovieID) VALUES
('Academy Awards', 'Best Picture', 2020, 'movie', 1, 1),
('Filmfare', 'Best Actor', 2010, 'actor', 1, 2),
('Tokyo Anime Award', 'Animation of the Year', 2017, 'movie', 3, 3),
('National Award', 'Best Director', 1956, 'director', 4, 4),
('Oscar', 'Best Cinematography', 2011, 'movie', 5, 5);

-- Relational: Users ↔ Casts
INSERT INTO CastRatings (UserID, CastID, RatingScore) VALUES
(1, 1, 9), (2, 2, 10), (3, 3, 8), (4, 4, 9), (5, 5, 10);

-- Relational: Users ↔ Reviews
INSERT INTO ReviewVotes (UserID, ReviewID, VoteType) VALUES
(2, 1, 'up'), (3, 2, 'up'), (4, 3, 'up'), (5, 4, 'up'), (1, 5, 'up');

SELECT * FROM Watchlistmovies;
select * from watchlists;

-- 2nd Insertion
-- Additional Movies Data Insertion for Database Enrichment

-- Additional Studios
INSERT INTO Studios (Name, Logo, FoundedYear, Website) VALUES
('Pixar Animation Studios', 'pixar.png', 1986, 'https://www.pixar.com'),
('Universal Pictures', 'universal.png', 1912, 'https://www.universalpictures.com'),
('Sony Pictures', 'sony.png', 1987, 'https://www.sonypictures.com'),
('A24', 'a24.png', 2012, 'https://a24films.com'),
('Legendary Entertainment', 'legendary.png', 2000, 'https://www.legendary.com'),
('Toei Animation', 'toei.png', 1948, 'https://www.toei-anim.co.jp'),
('Dharma Productions', 'dharma.png', 1976, 'https://www.dharmaproductions.com'),
('Yash Raj Films', 'yashraj.png', 1970, 'https://www.yashrajfilms.com'),
('Red Chillies Entertainment', 'redchillies.png', 1999, 'https://www.redchillies.com'),
('Lionsgate', 'lionsgate.png', 1997, 'https://www.lionsgate.com');

-- Additional Directors
INSERT INTO Directors (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Quentin Tarantino', 'Quentin_Tarantino.png', '1963-03-27', 'American', 'Known for Pulp Fiction and Kill Bill.'),
('Martin Scorsese', 'Martin_Scorsese.png', '1942-11-17', 'American', 'Legendary filmmaker behind Goodfellas and The Departed.'),
('Denis Villeneuve', 'Denis_Villeneuve.png', '1967-10-03', 'Canadian', 'Director of Dune and Blade Runner 2049.'),
('Greta Gerwig', 'Greta_Gerwig.png', '1983-08-04', 'American', 'Director of Lady Bird and Barbie.'),
('Jordan Peele', 'Jordan_Peele.png', '1979-02-21', 'American', 'Known for Get Out and Us.'),
('Akira Kurosawa', 'Akira_Kurosawa.png', '1910-03-23', 'Japanese', 'Master filmmaker behind Seven Samurai.'),
('Karan Johar', 'Karan_Johar.png', '1972-05-25', 'Indian', 'Bollywood director known for My Name is Khan.'),
('Zoya Akhtar', 'Zoya_Akhtar.png', '1972-10-14', 'Indian', 'Director of Zindagi Na Milegi Dobara.'),
('Anurag Kashyap', 'Anurag_Kashyap.png', '1972-09-10', 'Indian', 'Known for Gangs of Wasseypur.'),
('Sanjay Leela Bhansali', 'Sanjay_Leela_Bhansali.png', '1963-02-24', 'Indian', 'Director of Padmaavat and Bajirao Mastani.');

-- Additional Writers
INSERT INTO Writers (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Quentin Tarantino', 'Quentin_Tarantino.png', '1963-03-27', 'American', 'Writes his own screenplays.'),
('Charlie Kaufman', 'Charlie_Kaufman.png', '1958-11-19', 'American', 'Screenwriter of Eternal Sunshine.'),
('Chloe Zhao', 'Chloe_Zhao.png', '1982-03-31', 'Chinese-American', 'Writer-director of Nomadland.'),
('Greta Gerwig', 'Greta_Gerwig.png', '1983-08-04', 'American', 'Writer-director of Lady Bird.'),
('Jordan Peele', 'Jordan_Peele.png', '1979-02-21', 'American', 'Writer-director of horror films.'),
('Farhan Akhtar', 'Farhan_Akhtar.png', '1974-01-09', 'Indian', 'Writer-director of Dil Chahta Hai.'),
('Zoya Akhtar', 'Zoya_Akhtar.png', '1972-10-14', 'Indian', 'Writer-director of Zindagi Na Milegi Dobara.'),
('Anurag Kashyap', 'Anurag_Kashyap.png', '1972-09-10', 'Indian', 'Writer-director of indie films.'),
('Sanjay Leela Bhansali', 'Sanjay_Leela_Bhansali.png', '1963-02-24', 'Indian', 'Writer-director of period dramas.'),
('Eric Roth', 'Eric_Roth.png', '1945-03-22', 'American', 'Screenwriter of Forrest Gump and Dune.');

-- Additional Actors
INSERT INTO Actors (Name, Image, DateOfBirth, Nationality, AverageRating, Bio) VALUES
('Brad Pitt', 'Brad_Pitt.png', '1963-12-18', 'American', 8.9, 'Academy Award winner known for Fight Club.'),
('Margot Robbie', 'Margot_Robbie.png', '1990-07-02', 'Australian', 8.7, 'Known for Barbie and I, Tonya.'),
('Timothée Chalamet', 'Timothee_Chalamet.png', '1995-12-27', 'American-French', 8.8, 'Young actor known for Dune and Call Me by Your Name.'),
('Zendaya', 'Zendaya.png', '1996-09-01', 'American', 8.6, 'Known for Spider-Man and Dune.'),
('Ryan Gosling', 'Ryan_Gosling.png', '1980-11-12', 'Canadian', 8.8, 'Known for La La Land and Blade Runner 2049.'),
('Emma Stone', 'Emma_Stone.png', '1988-11-06', 'American', 8.7, 'Academy Award winner for La La Land.'),
('Oscar Isaac', 'Oscar_Isaac.png', '1979-03-09', 'American', 8.5, 'Known for Ex Machina and Dune.'),
('Lupita Nyong''o', 'Lupita_Nyongo.png', '1983-03-01', 'Kenyan-Mexican', 8.6, 'Academy Award winner for 12 Years a Slave.'),
('Toshiro Mifune', 'Toshiro_Mifune.png', '1920-04-01', 'Japanese', 9.0, 'Legendary actor in Kurosawa films.'),
('Shah Rukh Khan', 'Shah_Rukh_Khan.png', '1965-11-02', 'Indian', 8.9, 'Bollywood superstar known as King Khan.'),
('Deepika Padukone', 'Deepika_Padukone.png', '1986-01-05', 'Indian', 8.5, 'Leading Bollywood actress.'),
('Ranveer Singh', 'Ranveer_Singh.png', '1985-07-06', 'Indian', 8.4, 'Known for Padmaavat and Bajirao Mastani.'),
('Priyanka Chopra', 'Priyanka_Chopra.png', '1982-07-18', 'Indian', 8.3, 'Global star known for Quantico.'),
('Hrithik Roshan', 'Hrithik_Roshan.png', '1974-01-10', 'Indian', 8.6, 'Known for Zindagi Na Milegi Dobara.'),
('Alia Bhatt', 'Alia_Bhatt.png', '1993-03-15', 'Indian', 8.2, 'Rising star in Bollywood.'),
('Ranbir Kapoor', 'Ranbir_Kapoor.png', '1982-09-28', 'Indian', 8.3, 'Known for Rockstar and Barfi.'),
('Nawazuddin Siddiqui', 'Nawazuddin_Siddiqui.png', '1974-05-19', 'Indian', 8.8, 'Acclaimed character actor.'),
('Irrfan Khan', 'Irrfan_Khan.png', '1967-01-07', 'Indian', 9.1, 'International star known for Life of Pi.'),
('Viola Davis', 'Viola_Davis.png', '1965-08-11', 'American', 8.9, 'Academy Award winner for Fences.'),
('Mahershala Ali', 'Mahershala_Ali.png', '1974-02-16', 'American', 8.8, 'Two-time Academy Award winner.');

-- Inserting additional Actors

INSERT INTO Actors (Name, Image, DateOfBirth, Nationality, AverageRating, Bio) VALUES
('Kajol', 'kajol.png', '1974-08-05', 'Indian', 8.5, 'Acclaimed Indian actress known for her work in Hindi cinema.'),
('Kangana Ranaut', 'kangana_ranaut.png', '1987-03-23', 'Indian', 8.2, 'Award-winning Indian actress and filmmaker, known for her strong performances.'),
('Ayushmann Khurrana', 'ayushmann_khurrana.png', '1984-09-14', 'Indian', 8.1, 'Indian actor and singer, known for portraying ordinary men often battling social norms.'),
('Radhika Apte', 'radhika_apte.png', '1985-09-07', 'Indian', 8.0, 'Versatile Indian actress working in Hindi, Marathi, Telugu, Tamil, and English films.');

-- Additional Movies
INSERT INTO Movies (Title, ReleaseDate, Duration, TitleImage, PosterImage, AverageRating, Synopsis, Language) VALUES
('Pulp Fiction', '1994-10-14', 154, 'Pulp_Fiction_title.png', 'Pulp_Fiction_poster.png', 8.9, 'Interconnected stories of crime in Los Angeles.', 'English'),
('The Godfather', '1972-03-24', 175, 'The_Godfather_title.png', 'The_Godfather_poster.png', 9.2, 'The aging patriarch of an organized crime dynasty.', 'English'),
('Dune', '2021-10-22', 155, 'Dune_title.png', 'Dune_poster.png', 8.0, 'A noble family becomes embroiled in a war for control over the galaxy.', 'English'),
('Barbie', '2023-07-21', 114, 'Barbie_title.png', 'Barbie_poster.png', 6.9, 'Barbie and Ken are having the time of their lives in Barbieland.', 'English'),
('Get Out', '2017-02-24', 104, 'Get_Out_title.png', 'Get_Out_poster.png', 7.7, 'A young black man visits his white girlfriend''s family estate.', 'English'),
('Seven Samurai', '1954-04-26', 207, 'Seven_Samurai_title.png', 'Seven_Samurai_poster.png', 9.0, 'A village hires seven samurai to protect them from bandits.', 'Japanese'),
('My Name is Khan', '2010-02-12', 165, 'My_Name_is_Khan_title.png', 'My_Name_is_Khan_poster.png', 8.0, 'A Muslim man with autism travels across America.', 'Hindi'),
('Zindagi Na Milegi Dobara', '2011-07-15', 155, 'Zindagi_Na_Milegi_Dobara_title.png', 'Zindagi_Na_Milegi_Dobara_poster.png', 8.2, 'Three friends go on a bachelor trip to Spain.', 'Hindi'),
('Gangs of Wasseypur', '2012-06-22', 321, 'Gangs_of_Wasseypur_title.png', 'Gangs_of_Wasseypur_poster.png', 8.2, 'A clash between coal mining mafia in Dhanbad.', 'Hindi'),
('Padmaavat', '2018-01-25', 164, 'Padmaavat_title.png', 'Padmaavat_poster.png', 7.0, 'Queen Padmavati becomes the target of Sultan Alauddin Khalji.', 'Hindi'),
('The Pianist', '2002-09-25', 150, 'The_Pianist_title.png', 'The_Pianist_poster.png', 8.5, 'A Polish Jewish musician struggles to survive the Warsaw Ghetto.', 'English'),
('Nomadland', '2020-09-11', 107, 'Nomadland_title.png', 'Nomadland_poster.png', 7.3, 'A woman embarks on a journey through the American West.', 'English'),
('Moonlight', '2016-10-21', 111, 'Moonlight_title.png', 'Moonlight_poster.png', 7.4, 'A young black man grapples with identity and sexuality.', 'English'),
('La La Land', '2016-12-09', 128, 'La_La_Land_title.png', 'La_La_Land_poster.png', 8.0, 'A jazz musician and an actress fall in love in Los Angeles.', 'English'),
('Blade Runner 2049', '2017-10-06', 164, 'Blade_Runner_2049_title.png', 'Blade_Runner_2049_poster.png', 8.0, 'A young blade runner discovers a secret that could plunge society into chaos.', 'English'),
('Dangal', '2016-12-23', 161, 'Dangal_title.png', 'Dangal_poster.png', 8.4, 'A former wrestler trains his daughters to become world-class wrestlers.', 'Hindi'),
('Queen', '2013-03-07', 146, 'Queen_title.png', 'Queen_poster.png', 8.2, 'A Delhi girl travels alone on her honeymoon to Paris and Amsterdam.', 'Hindi'),
('Andhadhun', '2018-10-05', 139, 'Andhadhun_title.png', 'Andhadhun_poster.png', 8.2, 'A blind pianist gets embroiled in a murder mystery.', 'Hindi'),
('Gully Boy', '2019-02-14', 153, 'Gully_Boy_title.png', 'Gully_Boy_poster.png', 7.9, 'A street rapper from Mumbai slums rises to fame.', 'Hindi'),
('The Lunchbox', '2013-09-20', 104, 'The_Lunchbox_title.png', 'The_Lunchbox_poster.png', 7.8, 'A mistaken delivery in Mumbai connects a housewife and an office worker.', 'Hindi');

-- Movie-Genre Relationships
INSERT INTO MovieGenres (GenreID, MovieID) VALUES
-- Pulp Fiction (ID: 12)
(1, 12), (11, 12), -- Drama, Crime

-- The Godfather (ID: 13)
(1, 13), (11, 13), -- Drama, Crime

-- Dune (ID: 14)
(5, 14), (10, 14), (4, 14), -- Sci-Fi, Action, Adventure

-- Barbie (ID: 15)
(2, 15), (8, 15), -- Comedy, Fantasy

-- Get Out (ID: 16)
(12, 16), (13, 16), -- Thriller, Horror

-- Seven Samurai (ID: 17)
(1, 17), (10, 17), -- Drama, Action

-- My Name is Khan (ID: 18)
(1, 18), (3, 18), -- Drama, Romance

-- Zindagi Na Milegi Dobara (ID: 19)
(2, 19), (1, 19), (4, 19), -- Comedy, Drama, Adventure

-- Gangs of Wasseypur (ID: 20)
(11, 20), (1, 20), -- Crime, Drama

-- Padmaavat (ID: 21)
(1, 21), (9, 21), (4, 21), -- Drama, Historical, Romance

-- The Pianist (ID: 22)
(1, 22), (9, 22), -- Drama, Biography

-- Nomadland (ID: 23)
(1, 23), -- Drama

-- Moonlight (ID: 24)
(1, 24), -- Drama

-- La La Land (ID: 25)
(4, 25), (1, 25), -- Romance, Drama

-- Blade Runner 2049 (ID: 26)
(5, 26), (12, 26), -- Sci-Fi, Thriller

-- Dangal (ID: 27)
(1, 27), (9, 27), -- Drama, Biography

-- Queen (ID: 28)
(2, 28), (1, 28), -- Comedy, Drama

-- Andhadhun (ID: 29)
(12, 29), (7, 29), -- Thriller, Mystery

-- Gully Boy (ID: 30)
(1, 30), -- Drama

-- The Lunchbox (ID: 31)
(1, 31), (3, 31); -- Drama, Romance

-- Movie-Director Relationships
INSERT INTO MovieDirectors (MovieID, DirectorID) VALUES
(12, 13), -- Pulp Fiction - Quentin Tarantino
(13, 14), -- The Godfather - Martin Scorsese (Note: Actually Francis Ford Coppola, but using available directors)
(14, 15), -- Dune - Denis Villeneuve
(15, 16), -- Barbie - Greta Gerwig
(16, 17), -- Get Out - Jordan Peele
(17, 18), -- Seven Samurai - Akira Kurosawa
(18, 19), -- My Name is Khan - Karan Johar
(19, 20), -- Zindagi Na Milegi Dobara - Zoya Akhtar
(20, 21), -- Gangs of Wasseypur - Anurag Kashyap
(21, 22), -- Padmaavat - Sanjay Leela Bhansali
(22, 15), -- The Pianist - Denis Villeneuve (placeholder)
(23, 15), -- Nomadland - Denis Villeneuve (placeholder)
(24, 17), -- Moonlight - Jordan Peele (placeholder)
(25, 16), -- La La Land - Greta Gerwig (placeholder)
(26, 15), -- Blade Runner 2049 - Denis Villeneuve
(27, 2),  -- Dangal - Rajkumar Hirani (placeholder)
(28, 20), -- Queen - Zoya Akhtar (placeholder)
(29, 21), -- Andhadhun - Anurag Kashyap (placeholder)
(30, 20), -- Gully Boy - Zoya Akhtar
(31, 8);  -- The Lunchbox - Shoojit Sircar (placeholder)

-- Movie-Studio Relationships
INSERT INTO MovieStudios (MovieID, StudioID) VALUES
(12, 21),  -- Pulp Fiction - Lionsgate
(13, 13),  -- The Godfather - Universal Pictures
(14, 16),  -- Dune - Legendary Entertainment
(15, 5),  -- Barbie - Warner Bros.
(16, 13),  -- Get Out - Universal Pictures
(17, 17), -- Seven Samurai - Toei Animation
(18, 18), -- My Name is Khan - Dharma Productions
(19, 19), -- Zindagi Na Milegi Dobara - Yash Raj Films
(20, 1),  -- Gangs of Wasseypur - Barunson E&A (placeholder)
(21, 18), -- Padmaavat - Dharma Productions
(22, 13),  -- The Pianist - Universal Pictures
(23, 15),  -- Nomadland - A24
(24, 15),  -- Moonlight - A24
(25, 21),  -- La La Land - Lionsgate
(26, 5),  -- Blade Runner 2049 - Warner Bros.
(27, 18), -- Dangal - Dharma Productions
(28, 19), -- Queen - Yash Raj Films
(29, 20), -- Andhadhun - Red Chillies Entertainment
(30, 18), -- Gully Boy - Dharma Productions
(31, 7);  -- The Lunchbox - Rising Sun Films

UPDATE MovieStudios
SET StudioID = 18
WHERE MovieID IN (30); -- Update Pulp Fiction to Pixar Animation Studios

-- Movie-Writer Relationships
INSERT INTO MovieWriters (MovieID, WriterID) VALUES
(12, 12), -- Pulp Fiction - Quentin Tarantino
(13, 13), -- The Godfather - Charlie Kaufman (placeholder)
(14, 21), -- Dune - Eric Roth
(15, 15), -- Barbie - Greta Gerwig
(16, 16), -- Get Out - Jordan Peele
(17, 18), -- Seven Samurai - Akira Kurosawa (placeholder)
(18, 19), -- My Name is Khan - Karan Johar
(19, 18), -- Zindagi Na Milegi Dobara - Zoya Akhtar
(20, 19), -- Gangs of Wasseypur - Anurag Kashyap
(21, 20), -- Padmaavat - Sanjay Leela Bhansali
(22, 21), -- The Pianist - Eric Roth
(23, 14), -- Nomadland - Chloe Zhao
(24, 16), -- Moonlight - Jordan Peele (placeholder)
(25, 15), -- La La Land - Greta Gerwig (placeholder)
(26, 21), -- Blade Runner 2049 - Eric Roth
(27, 17), -- Dangal - Farhan Akhtar
(28, 18), -- Queen - Zoya Akhtar
(29, 19), -- Andhadhun - Anurag Kashyap
(30, 18), -- Gully Boy - Zoya Akhtar
(31, 17); -- The Lunchbox - Farhan Akhtar

DELETE FROM CASTS where movieid = 18 and actorid = 27;

UPDATE casts
set actorid = 59
where movieid = 28 and actorid = 30;

INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
-- Andhadhun
(29, 60, 'Akash', 8.3), -- ayusman khurana
(29, 61, 'Simi', 8.8); --  radika apte

-- Cast Information
INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
-- Pulp Fiction
(12, 16, 'Vincent Vega', 8.9), -- Brad Pitt
(12, 35, 'Jules Winnfield', 8.8), -- Mahershala Ali

-- The Godfather
(13, 16, 'Michael Corleone', 9.2), -- Brad Pitt
(13, 25, 'Kay Adams', 8.7), -- Viola Davis

-- Dune
(14, 18, 'Paul Atreides', 8.8), -- Timothée Chalamet
(14, 19, 'Chani', 8.6), -- Zendaya
(14, 23, 'Duke Leto', 8.5), -- Oscar Isaac

-- Barbie
(15, 17, 'Barbie', 8.7), -- Margot Robbie
(15, 20, 'Ken', 8.8), -- Ryan Gosling

-- Get Out
(16, 23, 'Rose Armitage', 8.6), -- Lupita Nyong'o

-- Seven Samurai
(17, 24, 'Kambei', 9.0), -- Toshiro Mifune

-- My Name is Khan
(18, 25, 'Rizwan Khan', 8.9), -- Shah Rukh Khan

-- Gangs of Wasseypur
(20, 32, 'Faizal Khan', 8.8), -- Nawazuddin Siddiqui

-- Padmaavat
(21, 26, 'Padmavati', 8.5), -- Deepika Padukone
(21, 27, 'Maharawal Ratan Singh', 8.4), -- Ranveer Singh

-- Dangal
(27, 1, 'Mahavir Singh Phogat', 9.4), -- Aamir Khan

-- Queen
(28, 59, 'Rani', 8.2), -- kangana raunat


-- Gully Boy
(30, 28, 'Murad', 8.4), -- Ranveer Singh
(30, 30, 'Safeena', 8.2), -- Alia Bhatt 

-- The Lunchbox
(31, 34, 'Saajan Fernandes', 9.1); -- Irrfan Khan

-- Additional Trailers
INSERT INTO Trailers (MovieID, Title, URL, ReleaseDate, Duration) VALUES
(12, 'Pulp Fiction Trailer', 'tGpTpVyI_OQ', '1994-09-01', 150),
(13, 'The Godfather Trailer', 'sY1S34973zA', '1972-02-01', 180),
(14, 'Dune Trailer', '8g18jFHCLXk', '2021-09-01', 155),
(15, 'Barbie Trailer', 'pBk4NYhWNMM', '2023-06-01', 120),
(16, 'Get Out Trailer', 'DzfpyUB60YY', '2017-01-01', 140),
(17, 'Seven Samurai Trailer', 'wJ1TOratCTo', '1954-03-01', 90),
(18, 'My Name is Khan Trailer', 'yQj-4DmP1Vo', '2010-01-01', 165),
(19, 'Zindagi Na Milegi Dobara Trailer', 'KdV0KSJJtdA', '2011-06-01', 140),
(20, 'Gangs of Wasseypur Trailer', 'S8_5pVNMyk8', '2012-05-01', 180),
(21, 'Padmaavat Trailer', 'X_5_BLt_Oaw', '2018-01-01', 150),
(22, 'The Pianist Trailer', 'BFwGqLa_oAo', '2002-08-01', 160),
(23, 'Nomadland Trailer', '6sxCFZ8_d84', '2020-08-01', 120),
(24, 'Moonlight Trailer', '9NJj12tJzqc', '2016-09-01', 130),
(25, 'La La Land Trailer', '0pdqf4P9MB8', '2016-11-01', 140),
(26, 'Blade Runner 2049 Trailer', 'gCcx85zbxz4', '2017-08-01', 160),
(27, 'Dangal Trailer', 'x_7YlGv9u1g', '2016-11-01', 150),
(28, 'Queen Trailer', 'KjLKZZBJZnc', '2013-12-01', 140),
(29, 'Andhadhun Trailer', 'soNpFBhIwvE', '2018-09-01', 130),
(30, 'Gully Boy Trailer', 'JFscFOKDWEw', '2019-01-01', 145),
(31, 'The Lunchbox Trailer', 'hmKJzNmxe6Y', '2013-08-01', 115);

-- Additional Reviews
INSERT INTO Reviews (UserID, MovieID, Title, Content, RatingScore, Upvotes, Downvotes, HasSpoiler) VALUES
(1, 12, 'Iconic', 'Tarantino at his finest with incredible dialogue.', 9, 200, 5, FALSE),
(2, 13, 'Masterpiece', 'The greatest crime film ever made.', 10, 300, 2, FALSE),
(3, 14, 'Visually Stunning', 'Villeneuve creates a breathtaking sci-fi epic.', 8, 150, 10, FALSE),
(4, 15, 'Surprisingly Good', 'More depth than expected from a toy movie.', 7, 100, 15, FALSE),
(5, 16, 'Brilliant Horror', 'Smart social commentary wrapped in thriller.', 8, 180, 8, FALSE),
(1, 18, 'Emotional Journey', 'SRK delivers a powerful performance.', 9, 120, 3, FALSE),
(2, 19, 'Perfect Friendship', 'Great chemistry between the leads.', 8, 90, 2, FALSE),
(3, 27, 'Inspiring', 'Aamir Khan transforms completely for this role.', 9, 250, 5, FALSE),
(4, 30, 'Raw and Real', 'Captures the Mumbai rap scene authentically.', 8, 130, 7, FALSE),
(5, 31, 'Heartwarming', 'A simple story told beautifully.', 8, 110, 4, FALSE);

-- Additional Awards
INSERT INTO Awards (Name, Category, Year, RecipientType, RecipientID, MovieID) VALUES
('Academy Awards', 'Best Original Screenplay', 1995, 'movie', 12, 12),
('Academy Awards', 'Best Picture', 1973, 'movie', 13, 13),
('Academy Awards', 'Best Cinematography', 2022, 'movie', 14, 14),
('Academy Awards', 'Best Production Design', 2024, 'movie', 15, 15),
('Academy Awards', 'Best Original Screenplay', 2018, 'movie', 16, 16),
('Filmfare', 'Best Actor', 2011, 'actor', 26, 18),
('Filmfare', 'Best Film', 2012, 'movie', 19, 19),
('National Film Award', 'Best Popular Film', 2017, 'movie', 27, 27),
('National Film Award', 'Best Feature Film', 2014, 'movie', 31, 31),
('Filmfare', 'Best Actor', 2020, 'actor', 28, 30);

-- Bangladeshi movie addition
-- Inserting Movies
INSERT INTO Movies (Title, ReleaseDate, Duration, TitleImage, PosterImage, AverageRating, Synopsis, Language) VALUES
('Taandob', '2025-06-07', 129, 'taandob_title.png', 'taandob_poster.png', NULL, 'A Bangladeshi political action thriller film revolving around an attack on a fictional television channel in Bangladesh.', 'Bangla'),
('Aynabaji', '2016-09-30', 146, 'aynabaji_title.png', 'aynabaji_poster.png', 8.5, 'The film follows the story of Ayna, a professional imposter who is hired to impersonate different individuals for financial gain. As Ayna delves deeper into his work, he becomes embroiled in a web of deceit, murder, and intrigue that threatens to unravel his life.', 'Bengali'),
('Monpura', '2009-02-13', 138, 'monpura_title.png', 'monpura_poster.png', 8.7, 'A romantic tragedy film set in rural Bangladesh, following a man-servant who takes the blame for a murder and is marooned on an island, where he falls in love.', 'Bengali'),
('Devi', '2018-10-19', 100, 'devi_title.png', 'devi_poster.png', 7.5, 'Based on Humayun Ahmed''s popular novel "Debi", the film is a psychological thriller revolving around Ranu, who claims to be possessed by a supernatural entity, and Misir Ali, a psychologist who tries to unravel the mystery.', 'Bengali');

---

-- Inserting Genres
INSERT INTO Genres (GenreName) VALUES
('Tragedy'),
('Psychological');

---

-- Inserting Actors
INSERT INTO Actors (Name, Image, DateOfBirth, Nationality, AverageRating, Bio) VALUES
('Shakib Khan', 'shakib_khan.png', '1979-03-28', 'Bangladeshi', NULL, 'One of the most commercially successful actors in Bangladeshi cinema.'),
('Sabila Nur', 'sabila_nur.png', '1995-05-27', 'Bangladeshi', NULL, 'Popular Bangladeshi model and actress.'),
('Jaya Ahsan', 'jaya_ahsan.png', '1983-07-01', 'Bangladeshi', 8.0, 'Acclaimed Bangladeshi actress, known for her versatility.'),
('Chanchal Chowdhury', 'chanchal_chowdhury.png', '1974-06-01', 'Bangladeshi', 8.6, 'Highly respected Bangladeshi actor, known for his strong performances.'),
('Masuma Rahman Nabila', 'masuma_rahman_nabila.png', '1985-04-11', 'Bangladeshi', NULL, 'Actress and model, gained prominence with "Aynabaji".'),
('Partha Barua', 'partha_barua.png', '1979-03-23', 'Bangladeshi', NULL, 'Actor and musician from Bangladesh.'),
('Farhana Mili', 'farhana_mili.png', '1984-03-09', 'Bangladeshi', NULL, 'Bangladeshi actress, known for her role in "Monpura".'),
('Fazlur Rahman Babu', 'fazlur_rahman_babu.png', '1961-08-22', 'Bangladeshi', NULL, 'Veteran Bangladeshi actor and singer.');

---

-- Inserting Directors
INSERT INTO Directors (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Raihan Rafi', 'raihan_rafi.png', NULL, 'Bangladeshi', 'Prominent Bangladeshi film director, known for action thrillers.'),
('Amitabh Reza Chowdhury', 'amitabh_reza_chowdhury.png', '1976-10-15', 'Bangladeshi', 'Award-winning Bangladeshi filmmaker, known for his distinct style.'),
('Giasuddin Selim', 'giasuddin_selim.png', '1972-02-13', 'Bangladeshi', 'Renowned Bangladeshi film director and screenwriter.'),
('Anam Biswas', 'anam_biswas.png', NULL, 'Bangladeshi', 'Bangladeshi filmmaker and screenwriter.');

---

-- Inserting Studios
INSERT INTO Studios (Name, Logo, FoundedYear, Website) VALUES
('Alpha-i', 'alpha_i_logo.png', NULL, NULL),
('SVF', 'svf_logo.png', 1995, 'https://www.svf.in/'),
('Content Matters Production', 'content_matters_logo.png', NULL, NULL),
('Maasranga Production', 'maasranga_production_logo.png', NULL, NULL),
('Jazz Multimedia', 'jazz_multimedia_logo.png', 2011, 'http://www.jazzmultimedia.com/');

---

-- Inserting Writers
INSERT INTO Writers (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Raihan Rafi', 'raihan_rafi.png', NULL, 'Bangladeshi', 'Also directs his films.'),
('Adnan Adib Khan', 'adnan_adib_khan.png', NULL, 'Bangladeshi', 'Screenwriter.'),
('Gousul Alam Shaon', 'gousul_alam_shaon.png', NULL, 'Bangladeshi', 'Writer and advertising professional.'),
('Anam Biswas', 'anam_biswas.png', NULL, 'Bangladeshi', 'Also directs his films.'),
('Giasuddin Selim', 'giasuddin_selim.png', NULL, 'Bangladeshi', 'Also directs his films.'),
('Humayun Ahmed', 'humayun_ahmed.png', '1948-11-13', 'Bangladeshi', 'Legendary Bangladeshi novelist, dramatist, and filmmaker.');

---

-- Inserting MovieDirectors
INSERT INTO MovieDirectors (MovieID, DirectorID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT DirectorID FROM Directors WHERE Name = 'Raihan Rafi')),
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), (SELECT DirectorID FROM Directors WHERE Name = 'Amitabh Reza Chowdhury')),
((SELECT MovieID FROM Movies WHERE Title = 'Monpura'), (SELECT DirectorID FROM Directors WHERE Name = 'Giasuddin Selim')),
((SELECT MovieID FROM Movies WHERE Title = 'Devi'), (SELECT DirectorID FROM Directors WHERE Name = 'Anam Biswas'));

---

-- Inserting MovieStudios
INSERT INTO MovieStudios (MovieID, StudioID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT StudioID FROM Studios WHERE Name = 'Alpha-i')),
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT StudioID FROM Studios WHERE Name = 'SVF')),
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), (SELECT StudioID FROM Studios WHERE Name = 'Content Matters Production')),
((SELECT MovieID FROM Movies WHERE Title = 'Monpura'), (SELECT StudioID FROM Studios WHERE Name = 'Maasranga Production')),
((SELECT MovieID FROM Movies WHERE Title = 'Devi'), (SELECT StudioID FROM Studios WHERE Name = 'Jazz Multimedia'));

---

-- Inserting MovieGenres
INSERT INTO MovieGenres (MovieID, GenreID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT GenreID FROM Genres WHERE GenreName = 'Action')),
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT GenreID FROM Genres WHERE GenreName = 'Thriller')),
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT GenreID FROM Genres WHERE GenreName = 'Drama')),
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), (SELECT GenreID FROM Genres WHERE GenreName = 'Crime')),
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), (SELECT GenreID FROM Genres WHERE GenreName = 'Mystery')),
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), (SELECT GenreID FROM Genres WHERE GenreName = 'Thriller')),
((SELECT MovieID FROM Movies WHERE Title = 'Monpura'), (SELECT GenreID FROM Genres WHERE GenreName = 'Romance')),
((SELECT MovieID FROM Movies WHERE Title = 'Monpura'), (SELECT GenreID FROM Genres WHERE GenreName = 'Tragedy')),
((SELECT MovieID FROM Movies WHERE Title = 'Monpura'), (SELECT GenreID FROM Genres WHERE GenreName = 'Drama')),
((SELECT MovieID FROM Movies WHERE Title = 'Devi'), (SELECT GenreID FROM Genres WHERE GenreName = 'Psychological')),
((SELECT MovieID FROM Movies WHERE Title = 'Devi'), (SELECT GenreID FROM Genres WHERE GenreName = 'Thriller')),
((SELECT MovieID FROM Movies WHERE Title = 'Devi'), (SELECT GenreID FROM Genres WHERE GenreName = 'Mystery'));

---

-- Inserting MovieWriters
INSERT INTO MovieWriters (MovieID, WriterID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT WriterID FROM Writers WHERE Name = 'Raihan Rafi')),
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT WriterID FROM Writers WHERE Name = 'Adnan Adib Khan')),
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), (SELECT WriterID FROM Writers WHERE Name = 'Gousul Alam Shaon')),
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), (SELECT WriterID FROM Writers WHERE Name = 'Anam Biswas')),
((SELECT MovieID FROM Movies WHERE Title = 'Monpura'), (SELECT WriterID FROM Writers WHERE Name = 'Giasuddin Selim')),
((SELECT MovieID FROM Movies WHERE Title = 'Devi'), (SELECT WriterID FROM Writers WHERE Name = 'Humayun Ahmed'));

---

-- Inserting Trailers
INSERT INTO Trailers (MovieID, Title, URL, ReleaseDate, Duration) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), 'Taandob Official Trailer', 'pVk_S1XkM0Q', '2025-05-15', 180),
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), 'Aynabaji Official Trailer', 'W1yIglrT5g0', '2016-09-01', 150),
((SELECT MovieID FROM Movies WHERE Title = 'Monpura'), 'Monpura Official Trailer', 'e7S2u-EaQ-A', '2009-01-20', 120),
((SELECT MovieID FROM Movies WHERE Title = 'Devi'), 'Devi Official Trailer', 'Hl_hC68P2zI', '2018-09-25', 135);

-- Inserting Casts for Taandob
INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT ActorID FROM Actors WHERE Name = 'Shakib Khan'), 'Mikhail / Shadhin', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT ActorID FROM Actors WHERE Name = 'Sabila Nur'), 'Nishat', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT ActorID FROM Actors WHERE Name = 'Jaya Ahsan'), 'Saira Ali', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Taandob'), (SELECT ActorID FROM Actors WHERE Name = 'Fazlur Rahman Babu'), 'Muhibuddin (Senior Police Officer)', NULL);

-- Inserting Casts for Aynabaji
INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), (SELECT ActorID FROM Actors WHERE Name = 'Chanchal Chowdhury'), 'Ayna', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), (SELECT ActorID FROM Actors WHERE Name = 'Masuma Rahman Nabila'), 'Hridi', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), (SELECT ActorID FROM Actors WHERE Name = 'Partha Barua'), 'Saber Hossain (News Reporter)', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Aynabaji'), (SELECT ActorID FROM Actors WHERE Name = 'Fazlur Rahman Babu'), 'Prison Officer', NULL); -- Assuming Fazlur Rahman Babu had a role here

-- Inserting Casts for Monpura
INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Monpura'), (SELECT ActorID FROM Actors WHERE Name = 'Chanchal Chowdhury'), 'Shonai', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Monpura'), (SELECT ActorID FROM Actors WHERE Name = 'Farhana Mili'), 'Pori', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Monpura'), (SELECT ActorID FROM Actors WHERE Name = 'Fazlur Rahman Babu'), 'Pori''s Father', NULL);

-- Inserting Casts for Devi
INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Devi'), (SELECT ActorID FROM Actors WHERE Name = 'Jaya Ahsan'), 'Ranu', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Devi'), (SELECT ActorID FROM Actors WHERE Name = 'Chanchal Chowdhury'), 'Misir Ali', NULL);

-- Inserting Movies
INSERT INTO Movies (Title, ReleaseDate, Duration, Synopsis, Language, TitleImage, PosterImage) VALUES
('Utshob', '2025-06-07', 113, 'Jahangir, a local businessman, guided by spiritual revelations, learns the essence of generosity and community, transforming from a self-centered miser to a compassionate man. The story is inspired by Charles Dickens'' "A Christmas Carol".', 'Bengali', 'utshob_title.png', 'utshob_poster.png');

---

-- Inserting Directors
INSERT INTO Directors (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Tanim Noor', 'tanim_noor.png', NULL, 'Bangladeshi', 'Bangladeshi film director and producer.');

---

-- Inserting Writers
INSERT INTO Writers (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Ayman Asib Shadhin', 'ayman_asib_shadhin.png', NULL, 'Bangladeshi', 'Bangladeshi screenwriter.'),
('Samiul Bhuiyan', 'samiul_bhuiyan.png', NULL, 'Bangladeshi', 'Bangladeshi screenwriter.');

---

-- Inserting Actors (Adding new actors and updating existing ones if necessary)
-- Re-inserting existing actors to ensure they have the latest available info (e.g., bio)
INSERT INTO Actors (Name, Image, DateOfBirth, Nationality, AverageRating, Bio) VALUES
('Zahid Hasan', 'zahid_hasan.png', '1967-10-04', 'Bangladeshi', NULL, 'Prominent Bangladeshi actor, known for his versatile roles.'),
('Aupee Karim', 'aupee_karim.png', '1979-05-01', 'Bangladeshi', NULL, 'Bangladeshi actress, model, and architect.'),
('Afsana Mimi', 'afsana_mimi.png', '1970-12-20', 'Bangladeshi', NULL, 'Veteran Bangladeshi actress and director.'),
('Tariq Anam Khan', 'tariq_anam_khan.png', '1953-05-10', 'Bangladeshi', NULL, 'Distinguished Bangladeshi actor and theatre personality.'),
('Azad Abul Kalam', 'azad_abul_kalam.png', NULL, 'Bangladeshi', NULL, 'Bangladeshi actor.'),
('Intekhab Dinar', 'intekhab_dinar.png', NULL, 'Bangladeshi', NULL, 'Bangladeshi actor.'),
('Sunerah Binte Kamal', 'sunerah_binte_kamal.png', '1999-06-18', 'Bangladeshi', NULL, 'Bangladeshi model and actress.'),
('Shoumya Joyti', 'shoumya_joyti.png', NULL, 'Bangladeshi', NULL, 'Bangladeshi actor (often plays younger versions of characters).'),
('Sadia Ayman', 'sadia_ayman.png', NULL, 'Bangladeshi', NULL, 'Bangladeshi actress.');
-- For Jaya Ahsan and Chanchal Chowdhury, they are already in the database from previous inserts.

---

-- Inserting Studios
INSERT INTO Studios (Name, Logo, FoundedYear, Website) VALUES
('Dope Productions', 'dope_productions_logo.png', NULL, NULL),
('Chorki', 'chorki_logo.png', 2021, 'https://chorki.com/'),
('Laughing Elephant', 'laughing_elephant_logo.png', NULL, NULL);

---


---

-- Inserting MovieDirectors
INSERT INTO MovieDirectors (MovieID, DirectorID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT DirectorID FROM Directors WHERE Name = 'Tanim Noor'));

---

-- Inserting MovieWriters
INSERT INTO MovieWriters (MovieID, WriterID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT WriterID FROM Writers WHERE Name = 'Ayman Asib Shadhin')),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT WriterID FROM Writers WHERE Name = 'Samiul Bhuiyan'));

---

-- Inserting MovieStudios
INSERT INTO MovieStudios (MovieID, StudioID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT StudioID FROM Studios WHERE Name = 'Dope Productions')),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT StudioID FROM Studios WHERE Name = 'Chorki')),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT StudioID FROM Studios WHERE Name = 'Laughing Elephant'));

---

-- Inserting MovieGenres
INSERT INTO MovieGenres (MovieID, GenreID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT GenreID FROM Genres WHERE GenreName = 'Comedy')),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT GenreID FROM Genres WHERE GenreName = 'Drama'));

---

-- Inserting Trailers
INSERT INTO Trailers (MovieID, Title, URL, ReleaseDate, Duration) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), 'Utshob Official Trailer', 'pQk-S1XkM0Q', '2025-05-20', 160); -- Placeholder YouTube ID

---

-- Inserting Casts
INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT ActorID FROM Actors WHERE Name = 'Zahid Hasan'), 'Jahangir', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT ActorID FROM Actors WHERE Name = 'Jaya Ahsan'), 'Ghost of Present (herself)', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT ActorID FROM Actors WHERE Name = 'Aupee Karim'), 'Ghost of Future (herself)', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT ActorID FROM Actors WHERE Name = 'Chanchal Chowdhury'), 'Ghost of the Past (himself)', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT ActorID FROM Actors WHERE Name = 'Afsana Mimi'), 'Jesmin', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT ActorID FROM Actors WHERE Name = 'Tariq Anam Khan'), 'Mobarak', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT ActorID FROM Actors WHERE Name = 'Azad Abul Kalam'), 'Supporting Role', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT ActorID FROM Actors WHERE Name = 'Intekhab Dinar'), 'Doctor', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT ActorID FROM Actors WHERE Name = 'Sunerah Binte Kamal'), 'Esha (Jahangir''s daughter)', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT ActorID FROM Actors WHERE Name = 'Shoumya Joyti'), 'Young Jahangir', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Utshob'), (SELECT ActorID FROM Actors WHERE Name = 'Sadia Ayman'), 'Young Jesmin', NULL);


UPDATE trailers
SET url = '_e1QPQdTvgQ'
WHERE movieid = 35;

-- three upcoming movies
-- *** Upcoming Movies Data ***

-- Inserting Movies
INSERT INTO Movies (Title, ReleaseDate, Duration, Synopsis, Language, TitleImage, PosterImage) VALUES
('Jolly LLB 3', '2025-09-19', 145, 'A social comedy legal drama where two "Jolly" lawyers, Jagdishwar Mishra and Jagdish Tyagi, face off in a high-stakes courtroom battle.', 'Hindi', 'jolly_llb3_title.png', 'jolly_llb3_poster.png'),
('Avatar: Fire and Ash', '2025-12-19', 192, 'The third installment in the Avatar series, exploring new regions of Pandora and introducing the "Ash People" (Na''vi of fire).', 'English', 'avatar_fireandash_title.png', 'avatar_fireandash_poster.png'),
('Now You See Me: Now You Don''t', '2025-11-14', 120, 'The Four Horsemen return, along with a new generation of illusionists, performing mind-melding twists, turns, surprises, and magic unlike anything ever captured on film.', 'English', 'nysmnyd_title.png', 'nysmnyd_poster.png');

-- Inserting new Directors (if not already present from initial demo data)
INSERT INTO Directors (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Subhash Kapoor', 'subhash_kapoor.png', NULL, 'Indian', 'Indian film director and screenwriter, known for the Jolly LLB series.') ,
('James Cameron', 'james_cameron.png', '1954-08-16', 'Canadian', 'Legendary filmmaker known for Titanic, Avatar, and Terminator series.') ,
('Ruben Fleischer', 'ruben_fleischer.png', '1974-10-31', 'American', 'Film director known for Zombieland, Venom, and Uncharted.') ;


INSERT INTO Writers (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Subhash Kapoor', 'subhash_kapoor.png', NULL, 'Indian', 'Indian film director and screenwriter, known for the Jolly LLB series.') ;

-- Inserting new Writers (if not already present from initial demo data)
INSERT INTO Writers (Name, Image, DateOfBirth, Nationality, Bio) VALUES
('Rick Jaffa', 'rick_jaffa.png', NULL, 'American', 'Screenwriter known for Avatar sequels and Planet of the Apes franchise.') ,
('Amanda Silver', 'amanda_silver.png', NULL, 'American', 'Screenwriter known for Avatar sequels and Planet of the Apes franchise.') ,
('Josh Friedman', 'josh_friedman.png', NULL, 'American', 'Screenwriter known for War of the Worlds and Avatar sequels.') ,
('Shane Salerno', 'shane_salerno.png', NULL, 'American', 'Screenwriter and producer known for Savages and Avatar sequels.') ,
('Eric Warren Singer', 'eric_warren_singer.png', NULL, 'American', 'Screenwriter known for American Hustle and Top Gun: Maverick.') ,
('Seth Grahame-Smith', 'seth_grahame_smith.png', NULL, 'American', 'Author and screenwriter known for Pride and Prejudice and Zombies.') ,
('Michael Lesslie', 'michael_lesslie.png', NULL, 'British', 'Screenwriter and playwright known for Assassin''s Creed.') ;

-- Inserting new Actors (if not already present from initial demo data)
INSERT INTO Actors (Name, Image, DateOfBirth, Nationality, AverageRating, Bio) VALUES
('Akshay Kumar', 'akshay_kumar.png', '1967-09-09', 'Indian', 8.0, 'Prominent Bollywood actor.') ,
('Arshad Warsi', 'arshad_warsi.png', '1968-04-19', 'Indian', 7.8, 'Indian actor known for his comedic and versatile roles.') ,
-- ('Sam Worthington', 'sam_worthington.png', '1976-08-02', 'Australian', 7.5, 'Actor known for Avatar and Clash of the Titans.') ,
('Zoe Saldaña', 'zoe_saldana.png', '1978-06-19', 'American', 8.0, 'Actress known for Avatar, Guardians of the Galaxy, and Star Trek.') ,
('Jesse Eisenberg', 'jesse_eisenberg.png', '1983-10-05', 'American', 7.8, 'Actor known for The Social Network and Zombieland.') ,
('Woody Harrelson', 'woody_harrelson.png', '1961-07-23', 'American', 8.2, 'Versatile actor known for True Detective and The Hunger Games.') ;

-- Inserting new Studios (if not already present from initial demo data)
INSERT INTO Studios (Name, Logo, FoundedYear, Website) VALUES
('Star Studios', 'star_studios_logo.png', NULL, NULL) ,
('Kangra Talkies', 'kangra_talkies_logo.png', NULL, NULL) ,
('20th Century Studios', '20th_century_studios_logo.png', 1935, 'https://www.20thcenturystudios.com/') ,
('Lightstorm Entertainment', 'lightstorm_entertainment_logo.png', 1990, 'https://www.lightstorm.com/') ,
('Summit Entertainment', 'summit_entertainment_logo.png', 1991, 'https://www.summit-ent.com/') ,
('Secret Hideout', 'secret_hideout_logo.png', NULL, NULL) ,
('Lionsgate Films', 'lionsgate_films_logo.png', 1997, 'https://www.lionsgate.com/') ; -- Assuming this is the main distribution arm, Lionsgate already exists.

-- Inserting new Genres (if not already present from initial demo data)
INSERT INTO Genres (GenreName) VALUES
('Legal') ON CONFLICT (GenreName) DO NOTHING;
-- Comedy, Drama, Thriller, Crime should already exist from previous steps or demo data.

-- Linking data for Jolly LLB 3
INSERT INTO MovieDirectors (MovieID, DirectorID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Jolly LLB 3'), (SELECT DirectorID FROM Directors WHERE Name = 'Subhash Kapoor'));

INSERT INTO MovieWriters (MovieID, WriterID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Jolly LLB 3'), (SELECT WriterID FROM Writers WHERE Name = 'Subhash Kapoor'));

INSERT INTO MovieStudios (MovieID, StudioID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Jolly LLB 3'), (SELECT StudioID FROM Studios WHERE Name = 'Star Studios')),
((SELECT MovieID FROM Movies WHERE Title = 'Jolly LLB 3'), (SELECT StudioID FROM Studios WHERE Name = 'Kangra Talkies'));

INSERT INTO MovieGenres (MovieID, GenreID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Jolly LLB 3'), (SELECT GenreID FROM Genres WHERE GenreName = 'Comedy')),
((SELECT MovieID FROM Movies WHERE Title = 'Jolly LLB 3'), (SELECT GenreID FROM Genres WHERE GenreName = 'Drama')),
((SELECT MovieID FROM Movies WHERE Title = 'Jolly LLB 3'), (SELECT GenreID FROM Genres WHERE GenreName = 'Legal'));

INSERT INTO Trailers (MovieID, Title, URL, ReleaseDate, Duration) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Jolly LLB 3'), 'Jolly LLB 3 Official Trailer', 'bYSaFrpuUNE', '2025-08-01', 180); -- Placeholder URL

INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Jolly LLB 3'), (SELECT ActorID FROM Actors WHERE Name = 'Akshay Kumar'), 'Advocate Jagdishwar "Jolly" Mishra', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Jolly LLB 3'), (SELECT ActorID FROM Actors WHERE Name = 'Arshad Warsi'), 'Advocate Jagdish "Jolly" Tyagi', NULL);

-- Linking data for Avatar: Fire and Ash
INSERT INTO MovieDirectors (MovieID, DirectorID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT DirectorID FROM Directors WHERE Name = 'James Cameron'));

DELETE from directors where directorid = 29;

INSERT INTO MovieWriters (MovieID, WriterID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT WriterID FROM Writers WHERE Name = 'James Cameron')),
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT WriterID FROM Writers WHERE Name = 'Rick Jaffa')),
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT WriterID FROM Writers WHERE Name = 'Amanda Silver')),
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT WriterID FROM Writers WHERE Name = 'Josh Friedman')),
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT WriterID FROM Writers WHERE Name = 'Shane Salerno'));

INSERT INTO MovieStudios (MovieID, StudioID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT StudioID FROM Studios WHERE Name = '20th Century Studios')),
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT StudioID FROM Studios WHERE Name = 'Lightstorm Entertainment'));

INSERT INTO MovieGenres (MovieID, GenreID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT GenreID FROM Genres WHERE GenreName = 'Sci-Fi')),
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT GenreID FROM Genres WHERE GenreName = 'Adventure')),
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT GenreID FROM Genres WHERE GenreName = 'Fantasy'));

INSERT INTO Trailers (MovieID, Title, URL, ReleaseDate, Duration) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), 'Avatar: Fire and Ash Official Trailer', 'v6gDsi6dzrM', '2025-09-01', 200); -- Placeholder URL

INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT ActorID FROM Actors WHERE Name = 'Sam Worthington'), 'Jake Sully', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Avatar: Fire and Ash'), (SELECT ActorID FROM Actors WHERE Name = 'Zoe Saldaña'), 'Neytiri', NULL);

-- Linking data for Now You See Me: Now You Don't
INSERT INTO MovieDirectors (MovieID, DirectorID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), (SELECT DirectorID FROM Directors WHERE Name = 'Ruben Fleischer'));

INSERT INTO MovieWriters (MovieID, WriterID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), (SELECT WriterID FROM Writers WHERE Name = 'Eric Warren Singer')),
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), (SELECT WriterID FROM Writers WHERE Name = 'Seth Grahame-Smith')),
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), (SELECT WriterID FROM Writers WHERE Name = 'Michael Lesslie'));

INSERT INTO MovieStudios (MovieID, StudioID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), (SELECT StudioID FROM Studios WHERE Name = 'Summit Entertainment')),
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), (SELECT StudioID FROM Studios WHERE Name = 'Secret Hideout')),
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), (SELECT StudioID FROM Studios WHERE Name = 'Lionsgate Films'));

INSERT INTO MovieGenres (MovieID, GenreID) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), (SELECT GenreID FROM Genres WHERE GenreName = 'Thriller')),
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), (SELECT GenreID FROM Genres WHERE GenreName = 'Crime'));

INSERT INTO Trailers (MovieID, Title, URL, ReleaseDate, Duration) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), 'Now You See Me: Now You Don''t Official Trailer', 'E3lMRx7HRQ', '2025-09-14', 150); -- Placeholder URL

UPDATE trailers
SET url = 'AEreCxv1YrI'
WHERE movieid = 39;

INSERT INTO Casts (MovieID, ActorID, RoleName, AverageRating) VALUES
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), (SELECT ActorID FROM Actors WHERE Name = 'Jesse Eisenberg'), 'J. Daniel Atlas', NULL),
((SELECT MovieID FROM Movies WHERE Title = 'Now You See Me: Now You Don''t'), (SELECT ActorID FROM Actors WHERE Name = 'Woody Harrelson'), 'Merritt McKinney', NULL);

SELECT 
