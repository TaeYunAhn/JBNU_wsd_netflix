import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocalStorageService from '../services/LocalStorageService';
import '../styles/MovieModal.css';

const MovieModal = ({ movie, onClose }) => {
  const navigate = useNavigate();
  const { id, title, overview, release_date, vote_average, poster_path } = movie;
  const [isWishlisted, setIsWishlisted] = useState(false); // 찜 상태 관리
  const [detailedInfo, setDetailedInfo] = useState(null); // 영화 세부 정보 상태
  const [apiKey, setApiKey] = useState(null); // 로그인된 사용자의 API 키

  // 로그인 여부 확인
  useEffect(() => {
    const storedApiKey = JSON.parse(localStorage.getItem('loggedInUser'))?.apiKey;
    if (!storedApiKey) {
      navigate('/signin'); // 로그인 화면으로 리다이렉트
    } else {
      setApiKey(storedApiKey); // API 키 설정
    }
  }, [navigate]);

  // 영화 세부 정보 가져오기
  useEffect(() => {
    if (apiKey) {
      const fetchMovieDetails = async () => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=ko-KR`
          );
          setDetailedInfo(response.data);
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      };

      fetchMovieDetails();
    }
  }, [id, apiKey]);

  // 초기 찜 상태 확인
  useEffect(() => {
    const wishlist = LocalStorageService.get('wishlist') || [];
    setIsWishlisted(wishlist.some((item) => item.id === id));
  }, [id]);

  // 찜 상태 토글
  const handleWishlist = () => {
    const wishlist = LocalStorageService.get('wishlist') || [];

    if (isWishlisted) {
      // 찜 해제
      const updatedWishlist = wishlist.filter((item) => item.id !== id);
      LocalStorageService.set('wishlist', updatedWishlist);
      alert(`${title}을(를) 찜 목록에서 제거했습니다!`);
    } else {
      // 찜 추가
      const newMovieData = {
        id,
        title,
        overview,
        release_date,
        vote_average,
        poster_path,
      };
      wishlist.push(newMovieData);
      LocalStorageService.set('wishlist', wishlist);
      alert(`${title}을(를) 찜 목록에 추가했습니다!`);
    }

    setIsWishlisted(!isWishlisted);
  };

  if (!detailedInfo) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const {
    original_title,
    runtime,
    genres,
    vote_count,
    original_language,
    production_companies,
    budget,
    revenue,
  } = detailedInfo;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="modal-header">
          <img
            src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
            alt={title}
            className="modal-poster"
          />
          <div className="modal-info">
            <h2>{title}</h2>
            <p>
              <strong>원제목:</strong> {original_title}
            </p>
            <p>
              <strong>개봉일:</strong> {release_date}
            </p>
            <p>
              <strong>평점:</strong> {vote_average} ({vote_count}명 투표)
            </p>
            <p>
              <strong>장르:</strong> {genres.map((genre) => genre.name).join(', ')}
            </p>
            <p>
              <strong>러닝 타임:</strong> {runtime}분
            </p>
            <p>
              <strong>언어:</strong> {original_language.toUpperCase()}
            </p>
            <p>
              <strong>제작사:</strong>{' '}
              {production_companies.length
                ? production_companies.map((company) => company.name).join(', ')
                : '정보 없음'}
            </p>
            <p>
              <strong>예산:</strong> ${budget.toLocaleString()}
            </p>
            <p>
              <strong>수익:</strong> ${revenue.toLocaleString()}
            </p>
            <p>
              <strong>줄거리:</strong> {overview || '줄거리가 없습니다.'}
            </p>
            <button
              className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlist}
            >
              {isWishlisted ? '찜 해제' : '찜하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
