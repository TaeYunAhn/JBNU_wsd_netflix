import React, { useEffect, useState } from 'react';
import '../styles/MovieCard.css';

const MovieCard = ({ movie, onClick }) => {
  const { poster_path, title, id } = movie;
  const [isWishlisted, setIsWishlisted] = useState(false);

  // 찜 목록 로컬스토리지에서 불러오기
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isInWishlist = wishlist.some((item) => item.id === id);
    setIsWishlisted(isInWishlist);
  }, [id]);

  // 찜하기 버튼 클릭 처리
  const handleWishlistClick = (e) => {
    e.stopPropagation(); // 부모 요소로의 클릭 이벤트 전파 방지
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (isWishlisted) {
      // 이미 찜 목록에 있는 경우 -> 제거
      wishlist = wishlist.filter((item) => item.id !== id);
      setIsWishlisted(false);
    } else {
      // 찜 목록에 없는 경우 -> 추가
      wishlist.push(movie);
      setIsWishlisted(true);
    }

    // 찜 목록 로컬스토리지에 업데이트
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
        alt={title || "Movie Poster"}
        className={`movie-poster ${isWishlisted ? 'wishlisted' : ''}`}
        onClick={onClick}
      />
      <div className="movie-details">
        <button
          className={`wishlist-btn ${isWishlisted ? 'disabled' : ''}`}
          onClick={handleWishlistClick}
        >
          {isWishlisted ? '✅ 찜 완료' : '찜하기'}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
