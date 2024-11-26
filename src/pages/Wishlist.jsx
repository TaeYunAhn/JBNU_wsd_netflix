import React, { useState, useEffect } from 'react';
import LocalStorageService from '../services/LocalStorageService';
import WishlistCard from '../components/WishlistCard';
import MovieModal from '../components/MovieModal';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // 선택된 영화
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  // 로컬 스토리지에서 찜한 영화 목록 불러오기
  useEffect(() => {
    setWishlist(LocalStorageService.get('wishlist') || []);
  }, []);

  // 찜한 영화 목록에서 삭제
  const handleRemoveFromWishlist = (movie) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== movie.id);
    LocalStorageService.set('wishlist', updatedWishlist);
    setWishlist(updatedWishlist);
  };

  // 영화 클릭 시 모달 열기
  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  // 모달 닫기 (페이지 리로드)
  const handleCloseModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);

    // 찜 목록 다시 로드 (리로딩 대신 업데이트 방식 사용)
    setWishlist(LocalStorageService.get('wishlist') || []);
  };

  return (
    <div className="wishlist">
      <h1>✅ 찜 목록</h1>
      {wishlist.length === 0 ? (
        <p>찜한 영화가 없습니다.</p>
      ) : (
        <div className="movie-grid">
          {wishlist.map((movie) => (
            <WishlistCard
              key={movie.id}
              movie={movie}
              onRemoveFromWishlist={handleRemoveFromWishlist}
              onCardClick={() => handleCardClick(movie)} // 카드 클릭 이벤트 전달
            />
          ))}
        </div>
      )}

      {/* MovieModal 렌더링 */}
      {isModalOpen && selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal} // 모달 닫힘 시 호출
        />
      )}
    </div>
  );
};

export default Wishlist;
