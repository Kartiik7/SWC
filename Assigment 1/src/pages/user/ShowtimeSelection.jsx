import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import { ArrowLeft, Clock, Calendar, ShieldAlert } from 'lucide-react';
import Badge from '../../components/common/Badge';

const ShowtimeSelection = () => {
  const { 
    selectedTheatre, 
    selectedMovie, 
    selectedScreen, 
    shows, 
    selectShow 
  } = useBooking();
  const navigate = useNavigate();

  // Redirect if previous steps are missing
  if (!selectedTheatre || !selectedMovie || !selectedScreen) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">Please select theatre, movie, and screen first.</p>
        <Link to="/user/movies" className="inline-block bg-brand-accent hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          Browse Movies
        </Link>
      </div>
    );
  }

  // Filter shows running in selected theatre, screen, and movie
  const matchingShows = shows.filter(show => 
    show.movieId === selectedMovie.id && 
    show.theatreId === selectedTheatre.id && 
    show.screenId === selectedScreen.id
  );

  // Helper to categorize showtimes
  const categorizeShowtime = (timeStr) => {
    // Example format: "09:00 AM", "06:00 PM"
    if (timeStr.includes('AM')) {
      const hour = parseInt(timeStr.split(':')[0]);
      if (hour >= 6 && hour < 12) return 'Morning';
    } else if (timeStr.includes('PM')) {
      const hour = parseInt(timeStr.split(':')[0]);
      if (hour === 12 || (hour >= 1 && hour < 4)) return 'Afternoon';
      if (hour >= 4 && hour < 8) return 'Evening';
      return 'Night';
    }
    return 'Evening'; // Fallback
  };

  // Group shows by Date
  const showsByDate = matchingShows.reduce((acc, show) => {
    if (!acc[show.date]) acc[show.date] = [];
    acc[show.date].push(show);
    return acc;
  }, {});

  const dates = Object.keys(showsByDate).sort();

  const handleSelectShowtime = (show) => {
    selectShow(show);
    navigate('/user/seats');
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
            <h1 className="text-2xl font-extrabold text-white tracking-wide">Select Showtime</h1>
            <p className="text-xs text-gray-500 mt-1">
              For <span className="text-brand-accent font-semibold">{selectedMovie.name}</span> in{' '}
              <span className="text-brand-gold font-semibold">{selectedScreen.name}</span> ({selectedTheatre.name})
            </p>
          </div>
        </div>
      </div>

      {/* Shows List */}
      {dates.length === 0 ? (
        <div className="text-center py-20 bg-brand-card/40 border border-gray-800/80 rounded-2xl space-y-3">
          <p className="text-gray-500 text-sm">No active showtimes listed for this setup.</p>
          <Link to="/user/audi" className="text-xs text-brand-accent hover:underline font-semibold">
            Change Screen
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {dates.map((dateStr) => {
            const dateShows = showsByDate[dateStr];
            
            // Group dateShows by period
            const periods = {
              Morning: dateShows.filter(s => categorizeShowtime(s.time) === 'Morning'),
              Afternoon: dateShows.filter(s => categorizeShowtime(s.time) === 'Afternoon'),
              Evening: dateShows.filter(s => categorizeShowtime(s.time) === 'Evening'),
              Night: dateShows.filter(s => categorizeShowtime(s.time) === 'Night')
            };

            // Format date for humans (e.g. Thursday, Jun 11)
            const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div key={dateStr} className="p-6 bg-brand-card border border-gray-800 rounded-2xl space-y-6">
                <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
                  <Calendar className="h-5 w-5 text-brand-accent" />
                  <h3 className="text-md font-bold text-white">{formattedDate}</h3>
                </div>

                <div className="space-y-6">
                  {Object.entries(periods).map(([periodName, pShows]) => {
                    if (pShows.length === 0) return null;
                    return (
                      <div key={periodName} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-b border-gray-900 pb-4 last:border-b-0 last:pb-0">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider md:pt-2">
                          {periodName}
                        </div>
                        
                        <div className="md:col-span-3 flex flex-wrap gap-3">
                          {pShows.map((show) => (
                            <button
                              key={show.id}
                              onClick={() => handleSelectShowtime(show)}
                              className="px-5 py-3 bg-gray-950 border border-gray-800 rounded-xl text-center hover:border-brand-accent hover:bg-brand-accent/5 transition-all duration-200 group flex flex-col items-center min-w-[100px]"
                            >
                              <span className="text-sm font-bold text-white group-hover:text-brand-accent flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-gray-400 group-hover:text-brand-accent" />
                                {show.time}
                              </span>
                              <span className="text-[10px] text-gray-500 mt-1 font-semibold group-hover:text-gray-400">
                                ₹{show.price} onwards
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShowtimeSelection;
