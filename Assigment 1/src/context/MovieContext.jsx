import { createContext, useState, useEffect } from 'react';
import { getStorageMovies, saveStorageMovies } from '../services/storage';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    setMovies(getStorageMovies());
  }, []);

  const addMovie = (movieData) => {
    const newMovie = {
      id: 'm_' + Date.now(),
      votes: '0',
      rating: 0,
      isFeatured: false,
      isUpcoming: false,
      cast: [],
      ...movieData
    };

    const updatedMovies = [...movies, newMovie];
    setMovies(updatedMovies);
    saveStorageMovies(updatedMovies);
    return newMovie;
  };

  const updateMovie = (id, movieData) => {
    const updatedMovies = movies.map(m => {
      if (m.id === id) {
        return { ...m, ...movieData };
      }
      return m;
    });

    setMovies(updatedMovies);
    saveStorageMovies(updatedMovies);
  };

  const deleteMovie = (id) => {
    const updatedMovies = movies.filter(m => m.id !== id);
    setMovies(updatedMovies);
    saveStorageMovies(updatedMovies);
  };

  return (
    <MovieContext.Provider value={{
      movies,
      searchQuery,
      setSearchQuery,
      selectedGenre,
      setSelectedGenre,
      addMovie,
      updateMovie,
      deleteMovie
    }}>
      {children}
    </MovieContext.Provider>
  );
};
