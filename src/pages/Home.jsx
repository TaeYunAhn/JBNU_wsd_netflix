import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TMDbAPI from '../services/URL.ts';
import MovieSlider from '../components/MovieSlider';
import MovieModal from '../components/MovieModal';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [bannerMovie, setBannerMovie] = useState(null); // 메인 배너 영화
  const [popularMovies, setPopularMovies] = useState([]); // 인기 영화
  const [genreMovies, setGenreMovies] = useState([]); // 로드된 장르별 영화
  const [loadedGenres, setLoadedGenres] = useState([]); // 이미 로드된 장르
  const [genres, setGenres] = useState([]); // 전체 장르 목록
  const [wishlist, setWishlist] = useState([]); // 찜 목록
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return loggedInUser?.apiKey || null;
  });

  // 찜 목록 로드 함수
  const loadWishlist = () => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  };

  useEffect(() => {
    loadWishlist(); // 초기 로드 시 찜 목록 가져오기
  }, []);

  useEffect(() => {
    if (apiKey) {
      const fetchInitialData = async () => {
        try {
          const popularData = await TMDbAPI.getPopularMovies(apiKey);
          setPopularMovies(popularData.results.slice(0, 10));
          setBannerMovie(
            popularData.results[Math.floor(Math.random() * popularData.results.length)]
          );

          const genreData = await TMDbAPI.getGenres(apiKey);
          setGenres(genreData.genres);
          loadNextGenres(genreData.genres.slice(0, 5));
        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
      };

      fetchInitialData();
    }
  }, [apiKey]);

  const loadNextGenres = async (nextGenres) => {
    const newGenreMovies = [];
    for (const genre of nextGenres) {
      try {
        const movies = await TMDbAPI.getMoviesByGenre(apiKey, genre.id);
        newGenreMovies.push({ genreName: genre.name, movies: movies.results.slice(0, 10) });
      } catch (error) {
        console.error(`Error loading movies for genre: ${genre.name}`, error);
      }
    }
    setGenreMovies((prev) => [...prev, ...newGenreMovies]);
    setLoadedGenres((prev) => [...prev, ...nextGenres]);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
    loadWishlist(); // 모달 닫힐 때 찜 목록 다시 로드
  };

  return (
    <div className="home">
      {bannerMovie && (
        <div
          className="banner"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${bannerMovie.backdrop_path})`,
          }}
        >
          <div className="banner-overlay">
            <div className="banner-content">
              <h1>{bannerMovie.title}</h1>
              <p>{bannerMovie.overview}</p>
              <div className="banner-buttons">
                <button className="play-button" onClick={() => alert('재생 기능은 아직 구현되지 않았습니다.')}>
                  재생
                </button>
                <button
                  className="details-button"
                  onClick={() => handleMovieClick(bannerMovie)}
                >
                  상세 정보
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <MovieSlider title="지금 뜨는 콘텐츠" movies={popularMovies} onMovieClick={handleMovieClick} wishlist={wishlist} />
      {genreMovies.map(({ genreName, movies }) => (
        <MovieSlider
          key={genreName}
          title={genreName}
          movies={movies}
          onMovieClick={handleMovieClick}
          wishlist={wishlist}
        />
      ))}
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Home;
