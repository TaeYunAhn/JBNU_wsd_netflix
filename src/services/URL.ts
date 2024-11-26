import axios from 'axios';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const TMDbAPI = {
  getNowPlaying: async (apiKey, page = 1) => {
    const response = await axios.get(
      `${API_BASE_URL}/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`
    );
    return response.data;
  },

  getPopularMovies: async (apiKey, page = 1) => {
    const response = await axios.get(
      `${API_BASE_URL}/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`
    );
    console.log('API Request URL:', response.config.url); // 요청 URL 확인
    return response.data;
  },

  getGenres: async (apiKey) => {
    const response = await axios.get(
      `${API_BASE_URL}/genre/movie/list?api_key=${apiKey}&language=ko-KR`
    );
    return response.data;
  },

  getMoviesByGenre: async (apiKey, genreId, page = 1) => {
    const response = await axios.get(
      `${API_BASE_URL}/discover/movie?api_key=${apiKey}&language=ko-KR&with_genres=${genreId}&page=${page}`
    );
    return response.data;
  },

  searchMovies: async (apiKey, query, page = 1) => {
    const response = await axios.get(
      `${API_BASE_URL}/search/movie?api_key=${apiKey}&language=ko-KR&query=${query}&page=${page}`
    );
    return response.data;
  },
};

export default TMDbAPI;
