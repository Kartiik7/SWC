import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import { ArrowLeft, Clapperboard, Layers, Users } from 'lucide-react';
import Button from '../../components/common/Button';

const AudiSelection = () => {
  const { 
    selectedTheatre, 
    selectedMovie, 
    screens, 
    shows, 
    selectScreen 
  } = useBooking();
  const navigate = useNavigate();

  // Redirect if previous steps are missing
  if (!selectedTheatre || !selectedMovie) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">Please select a movie and theatre first.</p>
        <Link to="/user/movies" className="inline-block bg-brand-accent hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          Browse Movies
        </Link>
      </div>
    );
  }

  // Get screens for this theatre
  const theatreScreens = screens.filter(s => s.theatreId === selectedTheatre.id);

  // Filter screens that actually have shows for this movie in this theatre
  const screensWithShows = theatreScreens.filter(screen => {
    return shows.some(show => 
      show.movieId === selectedMovie.id && 
      show.theatreId === selectedTheatre.id && 
      show.screenId === screen.id
    );
  });

  const handleSelectScreen = (screen) => {
    selectScreen(screen);
    navigate('/user/showtime');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide">Select Screen (Audi)</h1>
            <p className="text-xs text-gray-500 mt-1">
              Screening <span className="text-brand-accent font-semibold">{selectedMovie.name}</span> at{' '}
              <span className="text-brand-gold font-semibold">{selectedTheatre.name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Screen Options Grid */}
      {screensWithShows.length === 0 ? (
        <div className="text-center py-20 bg-brand-card/40 border border-gray-800/80 rounded-2xl space-y-3">
          <p className="text-gray-500 text-sm">No screens currently screening this movie.</p>
          <Link to="/user/theatre" className="text-xs text-brand-accent hover:underline font-semibold">
            Change Theatre
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {screensWithShows.map((screen) => (
            <div
              key={screen.id}
              onClick={() => handleSelectScreen(screen)}
              className="p-6 rounded-2xl border border-gray-800 bg-brand-card hover:border-gray-700 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-500/10 text-brand-accent rounded-xl border border-brand-accent/20">
                  <Clapperboard className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{screen.name}</h3>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Layers className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {screen.type}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {screen.capacity} seats capacity
                    </span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="pointer-events-none">
                Select
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudiSelection;
