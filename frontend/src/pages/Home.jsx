import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

// import Header from "../components/common/Header";
import Banner from "../components/Banner";
import UpNext from "../components/common/UpNext";
import Slide from "../components/common/Slide";
import url from "../constants/url";

import { Box, styled, Typography } from '@mui/material';

const Wrapper = styled(Box)`
  display: flex;
  padding: 20px 0;
`;

const Component = styled(Box)`
  padding: 0 115px;
`;

const SectionTitle = styled(Typography)`
  color: #f5c518;
  font-size: 24px;
  font-weight: bold;
  margin: 30px 0 20px 115px;
  font-family: 'Roboto', sans-serif;
`;

const SlideContainer = styled(Box)`
  padding: 0 115px;
`;

const ActorsSection = styled(Box)`
  padding: 0 115px;
  margin: 40px 0;
`;

const actorsResponsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 8, slidesToSlide: 4 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 4, slidesToSlide: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 2, slidesToSlide: 1 }
};

const ActorCard = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0 10px;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ActorImage = styled('img')`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f5c518;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: #ffffff;
  }
`;

const ActorName = styled(Typography)`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px;
  text-align: center;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [actors, setActors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = url;

    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/movies`);
        setMovies(response.data);
        console.log("Fetched movies from backend:", response.data);
      } catch (error) {
        console.error("Error fetching movies from backend:", error);
      }
    };

    const fetchTopPicks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/top-picks`);
        setTopPicks(response.data);
        console.log("Fetched top picks from backend:", response.data);
      } catch (error) {
        console.error("Error fetching top picks from backend:", error);
      }
    };

    const fetchActors = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/actors`);
        setActors(response.data);
        console.log("Fetched actors from backend:", response.data);
      } catch (error) {
        console.error("Error fetching actors from backend:", error);
      }
    };

    fetchMovies();
    fetchTopPicks();
    fetchActors();
  }, []);

  const handleActorClick = (actorId) => {
    // Navigate to actor page
    navigate(`/actor/${actorId}`);
  };

  return (
    <>
      <Component>
        <Wrapper>
          <Banner movies={movies} />
          <UpNext movies={movies} />
        </Wrapper>
        {/* <Slide movies={movies} /> */}
      </Component>
      
      {/* Top Picks Section */}
      <SectionTitle>Top Picks for you</SectionTitle>
      <SlideContainer>
        <Slide movies={topPicks} />
      </SlideContainer>
      
      {/* Actors Section */}
      <ActorsSection>
        <SectionTitle style={{ margin: '0 0 20px 0' }}>Popular Actors</SectionTitle>
        <Carousel
          responsive={actorsResponsive}
          swipeable={true}
          draggable={true}
          showDots={false}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={4000}
          keyBoardControl={true}
          slidesToSlide={1}
          containerClass="actors-carousel"
        >
          {actors.map((actor) => (
            <ActorCard key={actor.id} onClick={() => handleActorClick(actor.id)}>
              <ActorImage 
                src={`/img/${actor.image}`} 
                alt={actor.name}
                onError={(e) => {
                  e.target.src = '/img/default-actor.jpg'; // Fallback image
                }}
              />
              <ActorName>{actor.name}</ActorName>
            </ActorCard>
          ))}
        </Carousel>
      </ActorsSection>
    </>
  );
};

export default Home;