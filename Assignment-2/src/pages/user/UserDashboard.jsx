import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMovie } from '../../hooks/useMovie';
import { useBooking } from '../../hooks/useBooking';
import MovieCard from '../../components/movie/MovieCard';
import { Film, MapPin, ClipboardList, Settings, User } from 'lucide-react';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { movies } = useMovie();
  const { selectedLocation } = useBooking();
  const navigate = useNavigate();

  const featuredMovies = movies.filter(m => m.isFeatured);
  const upcomingMovies = movies.filter(m => m.isUpcoming);

  const navigationCards = [
    {
      title: 'Browse Movies',
      description: 'Explore trending releases and book tickets.',
      icon: Film,
      link: '/user/movies',
      color: 'bg-red-500/10 border-red-500/20 text-brand-accent hover:bg-red-500/20'
    },
    {
      title: selectedLocation ? `Location: ${selectedLocation}` : 'Select City',
      description: selectedLocation ? 'Change your currently active city.' : 'Pick a city to find nearby theatres.',
      icon: MapPin,
      link: '/user/location',
      color: 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
    },
    {
      title: 'Booking History',
      description: 'Review your past and active movie tickets.',
      icon: ClipboardList,
      link: '/user/history',
      color: 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
    },
    {
      title: 'Profile Settings',
      description: 'Update phone, address, and profile settings.',
      icon: User,
      link: '/user/profile',
      color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Hero Banner */}
      <div 
        className="rounded-2xl overflow-hidden relative p-8 md:p-12 border border-gray-800 flex flex-col justify-center min-h-[220px]"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(11, 15, 25, 0.95), rgba(11, 15, 25, 0.4)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="space-y-3 z-10 max-w-lg">
          <p className="text-brand-accent text-xs font-semibold uppercase tracking-widest">
            Welcome back, {currentUser?.name}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Book Tickets for the Latest Blockbusters
          </h1>
          <p className="text-sm text-gray-400">
            Enjoy premium seating, high-fidelity Dolby Atmos sound, and breathtaking IMAX screens near you.
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {navigationCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className={`p-5 rounded-xl border flex items-start space-x-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${card.color}`}
            >
              <div className="p-3 rounded-lg bg-gray-900 border border-gray-800/80 flex-shrink-0">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">{card.title}</h4>
                <p className="text-xs text-gray-500 leading-normal">{card.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Featured Movies */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-xl font-extrabold text-white tracking-wide">Featured In Theatres</h2>
          <Link to="/user/movies" className="text-xs font-semibold text-brand-accent hover:text-brand-hover hover:underline transition-all">
            See All Movies
          </Link>
        </div>
        
        {featuredMovies.length === 0 ? (
          <p className="text-sm text-gray-500">No movies currently featured.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Movies */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h2 className="text-xl font-extrabold text-white tracking-wide">Upcoming Blockbusters</h2>
          <span className="text-xs text-gray-500">Releasing Soon</span>
        </div>
        
        {upcomingMovies.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming releases listed.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {upcomingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
