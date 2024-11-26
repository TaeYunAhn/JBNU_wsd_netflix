import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from './Toast';
import '../styles/Header.css';

const Header = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setToast({ message: '안녕히 가세요, 또 뵙겠습니다!', type: 'success' });
    setIsModalOpen(false);

    setTimeout(() => {
      navigate('/signin');
    }, 2000); // 2초 후 로그인 페이지로 이동
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">🎬 Niraaah-flix</Link>
      </div>
      <div className="menu-icon" onClick={() => setIsMenuOpen((prev) => !prev)}>
        ☰
      </div>
      <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>홈</Link></li>
          <li><Link to="/popular" onClick={() => setIsMenuOpen(false)}>대세 콘텐츠</Link></li>
          <li><Link to="/search" onClick={() => setIsMenuOpen(false)}>찾아보기</Link></li>
          <li><Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>내가 찜한 리스트</Link></li>
          {loggedInUser ? (
            <li>
              <button
                className="logout-menu-button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsModalOpen(true);
                }}
              >
                로그아웃
              </button>
            </li>
          ) : (
            <li>
              <Link to="/signin" onClick={() => setIsMenuOpen(false)}>로그인</Link>
            </li>
          )}
        </ul>
      </nav>

      {/* 로그아웃 모달 */}
      {isModalOpen && (
        <div className="logout-modal-overlay">
          <div className="logout-modal-content">
            <p>로그아웃 하시겠습니까?</p>
            <div className="logout-modal-buttons">
              <button onClick={handleLogout}>확인</button>
              <button onClick={() => setIsModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast 메시지 */}
      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </header>
  );
};

export default Header;
