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
      if (isInitialized) return;
      
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const rememberedUser = JSON.parse(localStorage.getItem('rememberMe'));
        const currentPath = window.location.pathname;

        if (loggedInUser) {
          if (currentPath === '/signin') {
            navigate('/home');  // '/'대신 '/home'으로 변경
          }
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
                navigate('/home');  // '/'대신 '/home'으로 변경
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
    return <div>로딩중...</div>;
  }

  return (
    <>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/* 루트 경로를 /home으로 리다이렉트 */}
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/home"
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
    <Router basename="/JBNU_wsd_netflix">
      <AppWrapper />
    </Router>
  );
};

export default App;
