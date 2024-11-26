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
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    // 로그인 여부 확인: 로컬 스토리지에서 API 키를 확인
    const storedApiKey = JSON.parse(localStorage.getItem('loggedInUser'))?.apiKey;
    if (!storedApiKey) {
      navigate('/signin'); // 로그인 화면으로 리다이렉트
    } else {
      setApiKey(storedApiKey);
    }
  }, [navigate]);

  useEffect(() => {
    if (apiKey) {
      const fetchInitialData = async () => {
        try {
          // 인기 영화 데이터 가져오기
          const popularData = await TMDbAPI.getPopularMovies(apiKey);
          setPopularMovies(popularData.results.slice(0, 10)); // 인기 영화 10개
          setBannerMovie(
            popularData.results[Math.floor(Math.random() * popularData.results.length)]
          );

          // 장르 목록 가져오기
          const genreData = await TMDbAPI.getGenres(apiKey);
          setGenres(genreData.genres); // 전체 장르 저장
          loadNextGenres(genreData.genres.slice(0, 5)); // 초기 5개 장르 로드
        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
      };

      fetchInitialData();
    }
  }, [apiKey]);

  useEffect(() => {
    if (popularMovies.length > 0) {
      const interval = setInterval(() => {
        setBannerMovie(
          popularMovies[Math.floor(Math.random() * popularMovies.length)]
        );
      }, 5000); // 5초마다 변경
      return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
    }
  }, [popularMovies]);

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
    setGenreMovies((prev) => [...prev, ...newGenreMovies]); // 새로운 장르 추가
    setLoadedGenres((prev) => [...prev, ...nextGenres]); // 로드된 장르 추가
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 200
    ) {
      const remainingGenres = genres.filter(
        (genre) => !loadedGenres.some((loaded) => loaded.id === genre.id)
      );
      if (remainingGenres.length > 0) {
        loadNextGenres(remainingGenres.slice(0, 3)); // 추가로 3개의 장르 로드
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [genres, loadedGenres]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie); // 선택된 영화 설정
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setSelectedMovie(null); // 선택된 영화 초기화
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className="home">
      {/* 랜덤 인기 영화 배너 */}
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

      {/* 인기 영화 슬라이더 */}
      <MovieSlider title="지금 뜨는 콘텐츠" movies={popularMovies} onMovieClick={handleMovieClick} />

      {/* 장르별 슬라이더 */}
      {genreMovies.map(({ genreName, movies }) => (
        <MovieSlider
          key={genreName}
          title={genreName}
          movies={movies}
          onMovieClick={handleMovieClick}
        />
      ))}

      {/* 모달 */}
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Home;