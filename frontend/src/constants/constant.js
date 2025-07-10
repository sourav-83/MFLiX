import url from "./url";

// export const logoURL =
//   'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/2560px-IMDB_Logo_2016.svg.png';
export const logoURL = "/img/MFL!X.png";

const BASE_URL =
  (typeof import.meta !== 'undefined' &&
   import.meta.env &&
   import.meta.env.VITE_API_URL) ||
  url;

export const POPULAR_API_URL = `${BASE_URL}/api/movies/popular`;
export const UPCOMING_API_URL = `${BASE_URL}/api/movies/upcoming`;
export const TOPRATED_API_URL = `${BASE_URL}/api/movies/toprated`;
export const NOWPLAYING_API_URL = `${BASE_URL}/api/movies/nowplaying`;

export const moviesType = {
  upcoming: 'upcoming',
  toprated: 'toprated',
  popular: 'popular',
  nowplaying: 'nowplaying',
};
