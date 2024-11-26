import React, { useEffect, useState } from 'react';
import '../styles/MovieCard.css';

const MovieCard = ({ movie, onClick }) => {
  const { poster_path, title, id } = movie;
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    // 로컬스토리지에서 찜 목록 확인
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isInWishlist = wishlist.some((item) => item.id === id);
    setIsWishlisted(isInWishlist);
  }, [id]);

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // 부모의 onClick 이벤트 전파 방지
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (isWishlisted) {
      // 이미 찜한 경우 제거
      const updatedWishlist = wishlist.filter((item) => item.id !== id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
    } else {
      // 찜하지 않은 경우 추가
      wishlist.push(movie);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
    }
  };

  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
        alt={title || "Movie Poster"}
        className="movie-poster"
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
