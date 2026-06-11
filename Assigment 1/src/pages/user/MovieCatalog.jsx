import React, { useState } from 'react';
import { useMovie } from '../../hooks/useMovie';
import MovieCard from '../../components/movie/MovieCard';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';

const MovieCatalog = () => {
  const { movies } = useMovie();
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');

  // Extract unique genres across all movies
  const genres = ['All', ...new Set(movies.flatMap(m => m.genre || []))];

  // Filter movies: matching both title search and genre selection
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter === 'All' || movie.genre.includes(genreFilter);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Movie Catalog</h1>
          <p className="text-xs text-gray-500">Search and discover movies currently screening near you</p>
        </div>
        
        <div className="w-full md:max-w-xs">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movie titles..."
          />
        </div>
      </div>

      {/* Genre Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setGenreFilter(genre)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
              genreFilter === genre
                ? 'bg-brand-accent border-brand-accent text-white shadow-md'
                : 'border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700 hover:text-white'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-20 bg-brand-card/40 border border-gray-800/80 rounded-2xl">
          <p className="text-gray-500 text-sm">No movies match your current search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieCatalog;
