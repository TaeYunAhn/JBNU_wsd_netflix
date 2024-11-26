import React from 'react';
import '../styles/Footer.css'; // Assuming we create a corresponding CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2024 Netflix Clone. All rights reserved.</p>
      <p>
        Data provided by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDb</a>.
      </p>
    </footer>
  );
};

export default Footer;
