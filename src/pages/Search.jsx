import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TMDbAPI from '../services/URL.ts';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import '../styles/Search.css';

const Search = () => {
  const navigate = useNavigate();
  const apiKey = JSON.parse(localStorage.getItem('loggedInUser'))?.apiKey;
  
  const [query, setQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedYear, setSelectedYear] = useState(''); // 개봉년도
  const [selectedCertification, setSelectedCertification] = useState(''); // 영화 등급
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      navigate('/signin');
    }
  }, [apiKey, navigate]);

  useEffect(() => {
    const fetchGenres = async () => {
      if (!apiKey) return;

      try {
        const genreData = await TMDbAPI.getGenres(apiKey);
        setGenres(genreData.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [apiKey]);

  const fetchMovies = async (reset = false) => {
    if (!apiKey || loading) return;

    setLoading(true);

    try {
      let url;
      const queryParams = [
        `api_key=${apiKey}`,
        `language=ko-KR`,
        `page=${page}`,
      ];

      if (query) {
        url = `https://api.themoviedb.org/3/search/movie`;
        queryParams.push(`query=${encodeURIComponent(query)}`);
      } else {
        url = `https://api.themoviedb.org/3/discover/movie`;
        if (selectedGenre) queryParams.push(`with_genres=${selectedGenre}`);
        if (selectedRating) queryParams.push(`vote_average.gte=${selectedRating}`);
        if (selectedYear) queryParams.push(`primary_release_year=${selectedYear}`);
        if (selectedCertification) queryParams.push(`certification_country=US&certification=${selectedCertification}`);
        if (selectedLanguage) queryParams.push(`with_original_language=${selectedLanguage}`);
      }

      const response = await axios.get(`${url}?${queryParams.join('&')}`);
      let results = response.data.results;

      if (reset) {
        setMovies(results);
      } else {
        setMovies((prev) => [...prev, ...results]);
      }

      setHasMore(results.length > 0);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(true);
  }, [query, selectedGenre, selectedRating, selectedLanguage, selectedYear, selectedCertification]);

  useEffect(() => {
    if (page > 1) {
      fetchMovies();
    }
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 200 &&
      hasMore &&
      !loading
    ) {
      setPage((prev) => prev + 1);
    }

    if (window.scrollY > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  const handleReset = () => {
    setQuery('');
    setSelectedGenre('');
    setSelectedRating('');
    setSelectedLanguage('');
    setSelectedYear('');
    setSelectedCertification('');
    setMovies([]);
    setPage(1);
    setHasMore(true);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="search">
      <h1>🧐 어떤 영화를 찾으시나요?</h1>
      <div className="filters">
        <keyword-input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목 또는 키워드 입력"
        />
        <br />
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">장르 (전체)</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
          <option value="">평점 (전체)</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} 이상
            </option>
          ))}
        </select>
        <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
          <option value="">언어 (전체)</option>
          <option value="en">영어 ENG</option>
          <option value="ko">한국어 KOR</option>
          <option value="ja">일본어 JPN</option>
          <option value="zh">중국어 CHN</option>
          <option value="de">독일어 DEU</option>
          <option value="it">이태리어 ITA</option>
          <option value="ru">러시아어 RUS</option>
          <option value="es">스페인어 ESP</option>
          <option value="fr">프랑스어 FRA</option>
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">개봉년도 (전체)</option>
          {Array.from({ length: 50 }, (_, i) => (
            <option key={2023 - i} value={2023 - i}>
              {2023 - i}
            </option>
          ))}
        </select>
        <select value={selectedCertification} onChange={(e) => setSelectedCertification(e.target.value)}>
          <option value="">영화 등급 (전체)</option>
          <option value="G">G - 전체 관람가</option>
          <option value="PG">PG - 일부 관람가</option>
          <option value="PG-13">PG-13 - 13세 이상</option>
          <option value="R">R - 17세 이상</option>
          <option value="NC-17">NC-17 - 18세 이상</option>
        </select>
        <reset-button type="button" onClick={handleReset}>
          초기화
        </reset-button>
      </div>

      {loading && page === 1 ? (
        <p>로딩 중...</p>
      ) : movies.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} onClick={() => handleMovieClick(movie)}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

      {loading && page > 1 && <p>추가 로딩 중...</p>}

      {isModalOpen && selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}

      {showButton && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default Search;
