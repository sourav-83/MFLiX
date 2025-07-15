-- Active: 1750266580711@@127.0.0.1@5432@silscreendb
CREATE TYPE user_type_enum AS ENUM ('guest', 'signed_in', 'admin');
CREATE TYPE recipient_type_enum AS ENUM ('actor', 'director', 'movie');
CREATE TYPE vote_type_enum AS ENUM ('up', 'down');

CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR NOT NULL UNIQUE,
    Email VARCHAR NOT NULL UNIQUE,
    PasswordHash VARCHAR NOT NULL,
    UserType user_type_enum NOT NULL
);

ALTER TABLE Users
ADD COLUMN IsActive BOOLEAN DEFAULT TRUE;

CREATE TABLE Movies (
    MovieID SERIAL PRIMARY KEY,
    Title VARCHAR NOT NULL,
    ReleaseDate DATE,
    Duration INT CHECK (Duration > 0),
    TitleImage VARCHAR,
    PosterImage VARCHAR,
    AverageRating FLOAT CHECK (AverageRating BETWEEN 0 AND 10),
    Synopsis TEXT,
    Language VARCHAR
);


CREATE TABLE Genres (
    GenreID SERIAL PRIMARY KEY,
    GenreName VARCHAR NOT NULL UNIQUE
);

CREATE TABLE Actors (
    ActorID SERIAL PRIMARY KEY,
    Name VARCHAR NOT NULL,
    Image VARCHAR,
    DateOfBirth DATE,
    Nationality VARCHAR,
    AverageRating FLOAT CHECK (AverageRating BETWEEN 0 AND 10),
    Bio TEXT
);

CREATE TABLE Directors (
    DirectorID SERIAL PRIMARY KEY,
    Name VARCHAR NOT NULL,
    Image VARCHAR,
    DateOfBirth DATE,
    Nationality VARCHAR,
    Bio TEXT
); 

CREATE TABLE Studios (
    StudioID SERIAL PRIMARY KEY,
    Name VARCHAR NOT NULL,
    Logo VARCHAR,
    FoundedYear INT,
    Website VARCHAR
);

CREATE TABLE Trailers (
    TrailerID SERIAL PRIMARY KEY,
    MovieID INT UNIQUE REFERENCES Movies(MovieID) ON DELETE CASCADE,
    Title VARCHAR NOT NULL,
    URL VARCHAR NOT NULL,
    ReleaseDate DATE,
    Duration INT CHECK (Duration > 0)
);

CREATE TABLE Watchlists (
    WatchlistID SERIAL PRIMARY KEY,
    UserID INT REFERENCES Users(UserID) ON DELETE CASCADE,
    Name VARCHAR NOT NULL
);

ALTER TABLE watchlists
ADD CONSTRAINT unique_user_watchlist UNIQUE (userid);


CREATE TABLE WatchlistMovies (
    WatchlistID INT NOT NULL REFERENCES Watchlists(WatchlistID) ON DELETE CASCADE,
    MovieID INT NOT NULL REFERENCES Movies(MovieID) ON DELETE CASCADE,
    PRIMARY KEY (WatchlistID, MovieID)
);

CREATE TABLE Casts (
    CastID SERIAL PRIMARY KEY,
    MovieID INT NOT NULL REFERENCES Movies(MovieID) ON DELETE CASCADE,
    ActorID INT NOT NULL REFERENCES Actors(ActorID) ON DELETE CASCADE,
    RoleName VARCHAR NOT NULL,
    AverageRating FLOAT CHECK (AverageRating BETWEEN 0 AND 10)
);



CREATE TABLE MovieDirectors (
    MovieID INT NOT NULL REFERENCES Movies(MovieID) ON DELETE CASCADE,
    DirectorID INT NOT NULL REFERENCES Directors(DirectorID) ON DELETE CASCADE,
    PRIMARY KEY (MovieID, DirectorID)
);

CREATE TABLE MovieStudios (
    MovieID INT NOT NULL REFERENCES Movies(MovieID) ON DELETE CASCADE,
    StudioID INT NOT NULL REFERENCES Studios(StudioID) ON DELETE CASCADE,
    PRIMARY KEY (MovieID, StudioID)
);

CREATE TABLE MovieGenres (
    GenreID INT NOT NULL REFERENCES Genres(GenreID) ON DELETE CASCADE,
    MovieID INT NOT NULL REFERENCES Movies(MovieID) ON DELETE CASCADE,
    PRIMARY KEY (GenreID, MovieID)
);

CREATE TABLE Awards (
    AwardID SERIAL PRIMARY KEY,
    Name VARCHAR NOT NULL,
    Category VARCHAR NOT NULL,
    Year INT,
    RecipientType recipient_type_enum NOT NULL,
    RecipientID INT NOT NULL,
    MovieID INT REFERENCES Movies(MovieID) ON DELETE SET NULL
);

CREATE TABLE CastRatings (
    UserID INT NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    CastID INT NOT NULL REFERENCES Casts(CastID) ON DELETE CASCADE,
    RatingScore INT CHECK (RatingScore BETWEEN 0 AND 10),
    PRIMARY KEY (UserID, CastID)
);

CREATE TABLE Reviews (
    ReviewID SERIAL PRIMARY KEY,
    UserID INT REFERENCES Users(UserID) ON DELETE SET NULL,
    MovieID INT REFERENCES Movies(MovieID) ON DELETE CASCADE,
    Title VARCHAR,
    Content TEXT,
    RatingScore INT CHECK (RatingScore BETWEEN 0 AND 10),
    Upvotes INT DEFAULT 0,
    Downvotes INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    HasSpoiler BOOLEAN DEFAULT FALSE
);

ALTER TABLE Reviews ADD CONSTRAINT unique_user_movie_review UNIQUE (UserID, MovieID);

CREATE INDEX idx_reviews_userid_movieid ON Reviews(UserID, MovieID);
CREATE INDEX idx_reviews_movieid ON Reviews(MovieID);


CREATE TABLE ReviewVotes (
    UserID INT NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    ReviewID INT NOT NULL REFERENCES Reviews(ReviewID) ON DELETE CASCADE,
    VoteType vote_type_enum NOT NULL,
    PRIMARY KEY (UserID, ReviewID)
);

CREATE TABLE Writers (
    WriterID SERIAL PRIMARY KEY,
    Name VARCHAR NOT NULL,
    Image VARCHAR,
    DateOfBirth DATE,
    Nationality VARCHAR,
    Bio TEXT
);

CREATE TABLE MovieWriters (
    MovieID INT NOT NULL REFERENCES Movies(MovieID) ON DELETE CASCADE,
    WriterID INT NOT NULL REFERENCES Writers(WriterID) ON DELETE CASCADE,
    PRIMARY KEY (MovieID, WriterID)
);

-- Add a new table for Review Reports
CREATE TABLE ReviewReports (
    ReportID SERIAL PRIMARY KEY,
    ReviewID INT NOT NULL REFERENCES Reviews(ReviewID) ON DELETE CASCADE,
    ReporterUserID INT REFERENCES Users(UserID) ON DELETE SET NULL, -- User who reported
    ReportReason TEXT NOT NULL,
    ReportedAt TIMESTAMP DEFAULT NOW(),
    IsResolved BOOLEAN DEFAULT FALSE -- To track if the report has been actioned (ignored/addressed)
);

-- Add a unique constraint to prevent duplicate reports from the same user on the same review
ALTER TABLE ReviewReports
ADD CONSTRAINT unique_user_review_report UNIQUE (ReviewID, ReporterUserID);

-- Add columns to the Users table for banning functionality
ALTER TABLE Users
ADD COLUMN IsBanned BOOLEAN DEFAULT FALSE,
ADD COLUMN BanUntil DATE;

-- You might also want to add an index for faster lookup of reported reviews
CREATE INDEX idx_reviewreports_reviewid ON ReviewReports(ReviewID);
CREATE INDEX idx_reviewreports_isresolved ON ReviewReports(IsResolved);
CREATE INDEX idx_users_isbanned ON Users(IsBanned);







