import React from 'react';
import MovieCard from './MovieCard';
import '../styles/MovieSlider.css';

const MovieSlider = ({ title, movies, onMovieClick }) => {
  return (
    <div className="movie-slider">
      <h2>{title}</h2>
      <div className="slider-container">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie)} />
        ))}
      </div>
    </div>
  );
};

export default MovieSlider;
