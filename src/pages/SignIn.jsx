import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import ReactMarkdown from 'react-markdown';
import '../styles/SignIn.css';
import termsText from '../terms/terms.md';
import '../styles/TermsModal.css';

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    apiKey: '',
    username: '',
    rememberMe: false,
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    apiKey: '',
    username: '',
    agreeTerms: ''
  });
  const [toast, setToast] = useState({ message: '', type: '' });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // 모달 닫힘 애니메이션 상태
  const [termsContent, setTermsContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 로그인된 사용자 체크
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      navigate('/');
      return;
    }

    // 자동 로그인 체크
    const rememberedUser = JSON.parse(localStorage.getItem('rememberMe'));
    if (rememberedUser) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find((u) => u.email === rememberedUser.email);
      
      if (user) {
        // 30일 이내인 경우에만 자동 로그인
        const thirtyDays = 30 * 24 * 60 * 60 * 1000; // 30일을 밀리초로 변환
        if (new Date().getTime() - rememberedUser.timestamp < thirtyDays) {
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          navigate('/');
        } else {
          // 30일이 지난 경우 rememberMe 데이터 삭제
          localStorage.removeItem('rememberMe');
        }
      }
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const { email, password, confirmPassword, agreeTerms, apiKey } = formData;
    let newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = '유효하지 않은 이메일 형식입니다.';
    }
    if (isSignUp && password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    if (isSignUp && !agreeTerms) {
      newErrors.agreeTerms = '약관에 동의해야 합니다.';
    }
    if (isSignUp && !apiKey) {
      newErrors.apiKey = 'API 키를 입력해야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (isSignUp) {
        handleSignUp();
      } else {
        handleSignIn();
      }
    }
  };

  const handleSignUp = () => {
    setErrors({});
    const { email, password, confirmPassword, apiKey, agreeTerms, username } = formData;
    const errors = {};

    if (!validateEmail(email)) errors.email = '유효하지 않은 이메일 형식입니다.';
    if (password !== confirmPassword) errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!agreeTerms) errors.agreeTerms = '약관에 동의해야 합니다.';
    if (!apiKey) errors.apiKey = 'API 키를 입력해야 합니다.';
    if (!username) errors.username = '사용자 이름을 입력해야 합니다.';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === email)) {
      setErrors({ email: '이미 등록된 이메일입니다.' });
      return;
    }

    users.push({ email, password, apiKey, username });
    localStorage.setItem('users', JSON.stringify(users));
    setToast({ message: '회원가입 성공!', type: 'success' });
    setTimeout(() => {
      navigate('/signin');
    }, 2000);
  };

  const handleSignIn = () => {
    setErrors({});
    const { email, password, rememberMe } = formData;

    if (!validateEmail(email)) {
      setErrors({ email: '유효하지 않은 이메일 형식입니다.' });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setErrors({ password: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    // 필요한 사용자 정보만 명시적으로 저장
    localStorage.setItem('loggedInUser', JSON.stringify({
      email: user.email,
      username: user.username,
      apiKey: user.apiKey
    }));

    if (rememberMe) {
      localStorage.setItem('rememberMe', JSON.stringify({
        email: user.email,
        timestamp: new Date().getTime()
      }));
    } else {
      localStorage.removeItem('rememberMe');
    }

    setToast({ message: '로그인 성공! 메인 페이지로 이동합니다.', type: 'success' });
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleCardSwitch = () => {
    setIsSignUp((prev) => !prev);
    setErrors({}); // 에러 초기화
  };
  useEffect(() => {
    setErrors({});
  }, [isSignUp]);

  useEffect(() => {
    validateForm();
  }, [formData]);

  useEffect(() => {
    // Load terms and conditions from a separate file
    fetch(termsText)
      .then((response) => response.text())
      .then((text) => setTermsContent(text))
      .catch((error) => console.error('이용약관 로딩 오류:', error));
  }, []);
  
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowTermsModal(false);
      setIsClosing(false);
    }, 500); // 애니메이션 시간 (0.5초) 후에 모달을 숨김
  };

  return (
    <div className="signin-container">
      <div className="card-wrapper">
        <div className={`card-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
          {/* 로그인 카드 */}
          <div className="card front">
            <h2>환영합니다!</h2>
            <br />
            <p>본 서비스는 편리하고 효율적인 이용을 위해</p>
            <p>개인 TMDB API로 영화 데이터를 불러옵니다.</p>
            <br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="이메일"
            />
            {errors.email && <div className="error">{errors.email}</div>}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="비밀번호"
            />
            {errors.password && <div className="error">{errors.password}</div>}
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>로그인 상태 유지</span>
            </label>
            <button onClick={handleSignIn}>로그인</button>
            <br />
            <span onClick={handleCardSwitch}>계정이 없으신가요? 회원가입</span>
          </div>

          {/* 회원가입 카드 */}
          <div className="card back">
            <h2>계정 생성</h2>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="사용자 이름"
            />
            {errors.username && <div className="error">{errors.username}</div>}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="이메일"
            />
            {errors.email && <div className="error">{errors.email}</div>}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="비밀번호"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="비밀번호 확인"
            />
            <input
              type="text"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="TMDB API 키"
            />
            <label>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span>약관에 동의합니다</span>
            </label>
            {errors.agreeTerms && <div className="error">{errors.agreeTerms}</div>}
            <term-button onClick={() => setShowTermsModal(true)}>이용약관 보기</term-button>
            <button onClick={handleSignUp}>회원가입</button>
            <br />
            <span onClick={handleCardSwitch}>이미 계정이 있으신가요? 로그인</span>
          </div>
        </div>
      </div>
      {showTermsModal && (
        <div className={`terms-modal-overlay ${isClosing ? 'fade-out' : ''}`}>
          <div className={`terms-modal-content ${isClosing ? 'pop-out' : ''}`}>
            <button className="terms-close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <ReactMarkdown className="markdown-content">{termsContent}</ReactMarkdown>
          </div>
        </div>
      )}
      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default SignIn;
