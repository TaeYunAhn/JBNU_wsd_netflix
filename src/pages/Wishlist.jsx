import React, { useState, useEffect, useCallback } from 'react';
import LocalStorageService from '../services/LocalStorageService';
import WishlistCard from '../components/WishlistCard';
import MovieModal from '../components/MovieModal';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // 선택된 영화
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [page, setPage] = useState(1); // 페이지 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  // 로컬 스토리지에서 찜한 영화 목록 불러오기
  const loadWishlist = useCallback(() => {
    setLoading(true);
    const storedWishlist = LocalStorageService.get('wishlist') || [];
    setWishlist(storedWishlist.slice((page - 1) * 10, page * 10)); // prev 제거
    setLoading(false);
  }, [page]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    setPage((prev) => prev + 1); // 다음 페이지 로드
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 찜한 영화 목록에서 삭제
  const handleRemoveFromWishlist = (movie) => {
    const storedWishlist = LocalStorageService.get('wishlist') || [];
    const updatedWishlist = storedWishlist.filter((item) => item.id !== movie.id);
    LocalStorageService.set('wishlist', updatedWishlist);
    setWishlist(updatedWishlist.slice(0, page * 10)); // 현재 페이지까지만 표시
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
      {loading && <p>로딩 중...</p>} {/* 로딩 중 메시지 추가 */}

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
