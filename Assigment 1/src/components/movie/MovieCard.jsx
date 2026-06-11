import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';

const MovieCard = ({ movie }) => {
  const { id, name, genre = [], rating, votes, duration, posterUrl } = movie;

  return (
    <div className="group bg-brand-card border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-gray-700 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
        <img
          src={posterUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Rating overlay */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-gray-800">
          <Star className="h-4 w-4 text-brand-gold fill-brand-gold" />
          <span className="text-sm font-bold text-white">{rating.toFixed(1)}</span>
          <span className="text-[10px] text-gray-400">({votes})</span>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-white text-base leading-snug mb-1 truncate group-hover:text-brand-accent transition-colors">
          {name}
        </h3>
        
        {/* Duration & Time */}
        <div className="flex items-center text-xs text-gray-400 mb-3 space-x-1">
          <Clock className="h-3 w-3" />
          <span>{duration}</span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
          {genre.slice(0, 3).map((g) => (
            <Badge key={g} variant="default" className="text-[10px] py-0 px-2 font-normal">
              {g}
            </Badge>
          ))}
        </div>

        <Link
          to={`/user/movie/${id}`}
          className="w-full text-center py-2 bg-gray-800 hover:bg-brand-accent text-white font-semibold rounded-lg text-sm transition-all duration-200"
        >
          Book Tickets
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
