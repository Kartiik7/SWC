import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import TheatreCard from '../../components/booking/TheatreCard';
import { ArrowLeft, Film, MapPin } from 'lucide-react';

const TheatreSelection = () => {
  const { 
    theatres, 
    shows, 
    selectedLocation, 
    selectedMovie, 
    selectTheatre 
  } = useBooking();
  const navigate = useNavigate();

  // Redirect to Location page if no location is selected
  if (!selectedLocation) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">Please select a location first.</p>
        <Link to="/user/location" className="inline-block bg-brand-accent hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          Select Location
        </Link>
      </div>
    );
  }

  // Filter approved theatres in this city
  const cityTheatres = theatres.filter(t => t.city === selectedLocation && t.status === 'Approved');

  // Filter theatres that actually screen the selected movie (if selected)
  const matchingTheatres = cityTheatres.filter(theatre => {
    if (!selectedMovie) return true; // Show all theatres in city if no movie selected
    // Check if there's at least one show for this movie in this theatre
    return shows.some(show => show.movieId === selectedMovie.id && show.theatreId === theatre.id);
  });

  const handleSelectTheatre = (theatre) => {
    selectTheatre(theatre);
    navigate('/user/audi');
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
            <h1 className="text-2xl font-extrabold text-white tracking-wide">Select Theatre</h1>
            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center text-brand-accent font-semibold">
                <MapPin className="h-3 w-3 mr-1" />
                {selectedLocation}
              </span>
              {selectedMovie && (
                <>
                  <span>•</span>
                  <span className="flex items-center text-brand-gold font-semibold">
                    <Film className="h-3 w-3 mr-1" />
                    {selectedMovie.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theatres List */}
      {matchingTheatres.length === 0 ? (
        <div className="text-center py-20 bg-brand-card/40 border border-gray-800/80 rounded-2xl space-y-4">
          <p className="text-gray-500 text-sm">
            {selectedMovie 
              ? `No theatres are currently screening "${selectedMovie.name}" in ${selectedLocation}.` 
              : `No approved theatres found in ${selectedLocation}.`}
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/user/location" className="text-xs text-brand-accent hover:underline font-semibold">
              Change Location
            </Link>
            {selectedMovie && (
              <>
                <span className="text-gray-700">|</span>
                <Link to="/user/movies" className="text-xs text-brand-gold hover:underline font-semibold">
                  Select Another Movie
                </Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {matchingTheatres.map((theatre) => (
            <TheatreCard
              key={theatre.id}
              theatre={theatre}
              onSelect={handleSelectTheatre}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TheatreSelection;
