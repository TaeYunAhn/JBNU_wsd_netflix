import React from 'react';
import '../styles/WishlistCard.css';

const WishlistCard = ({ movie, onRemoveFromWishlist, onCardClick }) => {
  const { id, title, poster_path } = movie;

  const handleRemoveClick = (e) => {
    e.stopPropagation(); // 클릭 이벤트 버블링 방지
    onRemoveFromWishlist(movie);
  };

  return (
    <div className="wishlist-card" key={id} onClick={onCardClick}>
      <img
        src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
        alt={title}
        className="wishlist-poster"
      />
      <div className="wishlist-details">
        <button onClick={handleRemoveClick} className="remove-btn">
          찜 해제
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
