import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Popular from './pages/Popular';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import SignIn from './pages/SignIn';
import MovieDetails from './pages/MovieDetails';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';

// 인증 상태를 체크하는 래퍼 컴포넌트
const AppWrapper = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // 이미 초기화되었다면 처리하지 않음
      if (isInitialized) return;
      
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const rememberedUser = JSON.parse(localStorage.getItem('rememberMe'));
        const currentPath = window.location.pathname;

        if (loggedInUser) {
          // 첫 진입시에만 홈으로 이동
          if (currentPath === '/signin') {
            navigate('/');
          }
          // 새로고침시에는 현재 페이지 유지
        } else if (rememberedUser) {
          const users = JSON.parse(localStorage.getItem('users')) || [];
          const user = users.find((u) => u.email === rememberedUser.email);
          
          if (user) {
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;
            if (new Date().getTime() - rememberedUser.timestamp < thirtyDays) {
              localStorage.setItem('loggedInUser', JSON.stringify({
                email: user.email,
                username: user.username,
                apiKey: user.apiKey,
                wishlist: user.wishlist || []
              }));
              if (currentPath === '/signin') {
                navigate('/');
              }
            } else {
              localStorage.removeItem('rememberMe');
              navigate('/signin');
    
            }
          } else {
            localStorage.removeItem('rememberMe');
            navigate('/signin');
          }
        } else {
          navigate('/signin');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        navigate('/signin');
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [navigate, isInitialized]);

  if (isLoading) {
    return <div>로딩중...</div>; // 또는 로딩 스피너 컴포넌트
  }

  return (
    <>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/popular"
          element={
            <PrivateRoute>
              <Popular />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <Wishlist />
            </PrivateRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <PrivateRoute>
              <MovieDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

// 메인 App 컴포넌트
const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
