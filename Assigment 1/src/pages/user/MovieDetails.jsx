import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMovie } from '../../hooks/useMovie';
import { useBooking } from '../../hooks/useBooking';
import { Star, Clock, Calendar, Globe, ArrowLeft, Ticket } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const MovieDetails = () => {
  const { id } = useParams();
  const { movies } = useMovie();
  const { selectedLocation, selectMovie } = useBooking();
  const navigate = useNavigate();

  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">Movie not found.</p>
        <Link to="/user/movies" className="text-brand-accent hover:underline text-sm font-semibold">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const {
    name,
    genre = [],
    rating,
    votes,
    duration,
    language,
    releaseDate,
    synopsis,
    cast = [],
    posterUrl,
    bannerUrl
  } = movie;

  const handleBookTickets = () => {
    selectMovie(movie);
    // Smart routing: if location is already set, jump straight to Theatre Selection
    if (selectedLocation) {
      navigate('/user/theatre');
    } else {
      navigate('/user/location');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white font-semibold transition-colors bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* Hero Banner Grid */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-brand-card">
        {/* Banner Image Backdrop */}
        <div className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-sm" style={{ backgroundImage: `url(${bannerUrl})` }} />
        
        <div className="relative p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start z-10">
          
          {/* Movie Poster */}
          <div className="w-56 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-gray-800/80 flex-shrink-0 bg-gray-950">
            <img src={posterUrl} alt={name} className="w-full h-full object-cover" />
          </div>

          {/* Details column */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                {genre.map(g => (
                  <Badge key={g} variant="primary" className="text-[10px] uppercase font-bold tracking-wider">
                    {g}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2 tracking-tight">
                {name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-brand-gold fill-brand-gold" />
                  <span className="font-bold text-white text-base">{rating.toFixed(1)}</span>
                  <span>({votes} votes)</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-brand-accent" />
                  <span>{duration}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0 border-t border-b border-gray-800/50 py-4 text-xs">
              <div className="space-y-1">
                <span className="text-gray-500 block uppercase font-medium">Language</span>
                <span className="text-white font-bold text-sm flex items-center justify-center md:justify-start gap-1">
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                  {language}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block uppercase font-medium">Release Date</span>
                <span className="text-white font-bold text-sm flex items-center justify-center md:justify-start gap-1">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  {releaseDate}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleBookTickets}
                variant="primary"
                size="lg"
                className="w-full md:w-auto px-8 py-3.5 text-base shadow-lg glow-red font-bold"
              >
                <Ticket className="h-5 w-5 mr-2" />
                Book Tickets
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis & Cast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Synopsis */}
        <div className="lg:col-span-2 space-y-6 bg-brand-card/40 border border-gray-900 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">Synopsis</h3>
          <p className="text-sm text-gray-300 leading-relaxed font-normal">
            {synopsis}
          </p>
        </div>

        {/* Right col: Cast list */}
        <div className="space-y-6 bg-brand-card/40 border border-gray-900 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">Cast</h3>
          {cast.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No cast details listed.</p>
          ) : (
            <div className="space-y-3.5">
              {cast.map((c, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 font-bold flex items-center justify-center border border-gray-700">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-gray-500 text-[10px]">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
