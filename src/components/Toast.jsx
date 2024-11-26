import React, { useEffect } from 'react';
import '../styles/Toast.css';

const Toast = ({ message, type }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const toastElement = document.querySelector('.toast');
      if (toastElement) toastElement.style.display = 'none';
    }, 2000); // 2초 후 자동 닫힘
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`toast ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default Toast;
