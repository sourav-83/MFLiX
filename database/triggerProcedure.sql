CREATE OR REPLACE FUNCTION update_avg_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE Movies
  SET AverageRating = (
    SELECT ROUND(AVG(RatingScore)::numeric, 1)
    FROM Reviews
    WHERE MovieID = COALESCE(NEW.MovieID, OLD.MovieID)
  )
  WHERE MovieID = COALESCE(NEW.MovieID, OLD.MovieID);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_rating_after_insert_update
AFTER INSERT OR UPDATE OF RatingScore, MovieID ON Reviews
FOR EACH ROW
EXECUTE FUNCTION update_avg_rating();

CREATE TRIGGER trg_update_rating_after_delete
AFTER DELETE ON Reviews
FOR EACH ROW
EXECUTE FUNCTION update_avg_rating();


-- trigger for updating average rating in Casts
-- Function
CREATE OR REPLACE FUNCTION update_cast_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE Casts
  SET AverageRating = (
      SELECT ROUND(AVG(RatingScore)::NUMERIC, 2)
      FROM   CastRatings
      WHERE  CastID = COALESCE(NEW.CastID, OLD.CastID)
  )
  WHERE CastID = COALESCE(NEW.CastID, OLD.CastID);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Fire after INSERT/UPDATE of RatingScore
CREATE TRIGGER trg_cast_rating_i_u
AFTER INSERT OR UPDATE OF RatingScore ON CastRatings
FOR EACH ROW EXECUTE FUNCTION update_cast_average_rating();

-- Fire after DELETE
CREATE TRIGGER trg_cast_rating_d
AFTER DELETE ON CastRatings
FOR EACH ROW EXECUTE FUNCTION update_cast_average_rating();

