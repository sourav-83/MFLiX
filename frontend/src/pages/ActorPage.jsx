import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  styled,
  Button,
  Chip,
  Divider
} from "@mui/material";
import {
  ArrowBack,
  Star,
  EmojiEvents,
  LocationOn,
  Cake,
  TrendingUp,
  Movie,
  Public
} from "@mui/icons-material";
import MoviesList from "../components/common/MoviesList";
import url from "../constants/url";

// Styled components
const Container = styled(Box)`
  min-height: 100vh;
  background-color: #000;
  color: #e0e0e0;
  padding: 20px;
`;

const HeaderSection = styled(Box)`
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
`;

const ActorImage = styled("img")`
  width: 300px;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #444;
  box-shadow: 0 0 12px rgba(245, 197, 24, 0.15);

  @media (max-width: 768px) {
    width: 250px;
    height: 350px;
  }
`;

const ActorInfo = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background-color: rgba(255, 255, 255, 0.02);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #222;
`;

const ActorName = styled(Typography)`
  font-size: 3rem;
  font-weight: bold;
  color: #f5c518;

  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
`;

const InfoRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: #888;
  }
`;

const InfoLabel = styled(Typography)`
  font-weight: 500;
  color: #aaa;
  min-width: 100px;
`;

const Biography = styled(Typography)`
  line-height: 1.6;
  margin: 20px 0;
  text-align: justify;
  color: #ccc;
`;

const AwardChip = styled(Chip)`
  margin: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
  border: 1px solid #333;
  transition: 0.3s ease;

  &:hover {
    background-color: #f5c518;
    color: #000;
  }
`;

const SectionTitle = styled(Typography)`
  color: #f5c518;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 6px;
  border-bottom: 1px solid #333;
`;

const MoviesSection = styled(Box)`
  margin-top: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid #222;
`;

const AwardsSection = styled(Box)`
  margin-top: 10px;
`;

const BackButton = styled(Button)`
  margin-bottom: 20px;
  color: #f5c518;
  border-color: #444;
  font-weight: 500;
  transition: 0.3s;

  &:hover {
    background-color: #f5c518;
    color: #000;
    border-color: #f5c518;
  }
`;

const LoadingBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;

  h4 {
    color: #ccc;
  }
`;

const ErrorBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  gap: 20px;

  h4 {
    color: #f44336;
  }
`;

const ActorPage = () => {
  const { actorId } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [actorMovies, setActorMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        setLoading(true);
        const apiUrl = url;

        const actorResponse = await axios.get(`${apiUrl}/api/actors/${actorId}`);
        setActor(actorResponse.data);

        const moviesResponse = await axios.get(`${apiUrl}/api/actors/${actorId}/movies`);
        setActorMovies(moviesResponse.data);
      } catch (err) {
        setError("Failed to load actor information");
      } finally {
        setLoading(false);
      }
    };

    if (actorId) {
      fetchActorData();
    }
  }, [actorId]);

  const hasValidAwards = () => {
    return actor.awards && 
           actor.awards.length > 0 && 
           actor.awards.some(award => 
             award && 
             award.trim() !== '' && 
             award !== 'undefined (undefined)' &&
             !award.includes('undefined')
           );
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "Unknown";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <Container>
        <LoadingBox>
          <Typography variant="h4">Loading actor information...</Typography>
        </LoadingBox>
      </Container>
    );
  }

  if (error || !actor) {
    return (
      <Container>
        <ErrorBox>
          <Typography variant="h4">{error || "Actor not found"}</Typography>
          <BackButton variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
            Go Back
          </BackButton>
        </ErrorBox>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
        Back
      </BackButton>

      <HeaderSection>
        <ActorImage
          src={actor.image ? `/img/${actor.image}` : "/img/default-actor.jpg"}
          alt={actor.name}
          onError={(e) => {
            e.target.src = "/img/default-actor.jpg";
          }}
        />

        <ActorInfo>
          <ActorName>{actor.name}</ActorName>

          <InfoRow>
            <Cake />
            <InfoLabel>Age:</InfoLabel>
            <Typography>{calculateAge(actor.birth_date)} years old</Typography>
          </InfoRow>

          <InfoRow>
            <Public />
            <InfoLabel>Nationality:</InfoLabel>
            <Typography>{actor.nationality || "Unknown"}</Typography>
          </InfoRow>

          <InfoRow>
            <Movie />
            <InfoLabel>Movies:</InfoLabel>
            <Typography>{actor.movies_count || actorMovies.length} films</Typography>
          </InfoRow>

          {/* <InfoRow>
            <TrendingUp />
            <InfoLabel>Popularity:</InfoLabel>
            <Typography>{actor.popularity_score || "N/A"}/10</Typography>
          </InfoRow> */}

          {hasValidAwards() && (
            <AwardsSection>
              <InfoRow>
                <EmojiEvents />
                <InfoLabel>Awards:</InfoLabel>
              </InfoRow>
              <Box sx={{ ml: 4 }}>
                {actor.awards
                  .filter(award => 
                    award && 
                    award.trim() !== '' && 
                    award !== 'undefined (undefined)' &&
                    !award.includes('undefined')
                  )
                  .map((award, index) => (
                    <AwardChip key={index} label={award} />
                  ))
                }
              </Box>
            </AwardsSection>
          )}
        </ActorInfo>
      </HeaderSection>

      {actor.biography && (
        <Box>
          <SectionTitle>Biography</SectionTitle>
          <Biography>{actor.biography}</Biography>
        </Box>
      )}

      <Divider sx={{ my: 4, backgroundColor: "#222" }} />

      <MoviesSection>
        <SectionTitle>Movies</SectionTitle>
        {actorMovies.length > 0 ? (
          <MoviesList movies={actorMovies} />
        ) : (
          <Typography color="#aaa">No movies found for this actor.</Typography>
        )}
      </MoviesSection>
    </Container>
  );
};

export default ActorPage;