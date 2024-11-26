import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TMDbAPI from '../services/URL.ts';
import '../styles/MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await TMDbAPI.getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!movie) {
    return <p>Movie not found.</p>;
  }

  return (
    <div className="movie-details-page">
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
        className="movie-details-poster"
      />
      <div className="movie-details-info">
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
        <p>Release Date: {movie.release_date}</p>
        <p>Rating: {movie.vote_average}</p>
      </div>
    </div>
  );
};

export default MovieDetails;
