import React from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useMovie } from '../../hooks/useMovie';
import { useAuth } from '../../hooks/useAuth';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { 
  Calendar, Film, Ticket, IndianRupee, TrendingUp, 
  MapPin, ClipboardList, PlusCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const OwnerDashboard = () => {
  const { theatres, shows, bookings } = useBooking();
  const { movies } = useMovie();
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  // Filter theatres owned by this owner
  const myTheatres = theatres.filter(t => t.ownerId === currentUser.id);
  const myTheatreIds = myTheatres.map(t => t.id);

  // Filter shows running in owner's theatres
  const myShows = shows.filter(s => myTheatreIds.includes(s.theatreId));

  // Filter bookings for owner's theatres
  // For mock data, bookings are linked to theatreName, let's map them by matching theatreNames
  const myTheatreNames = myTheatres.map(t => t.name);
  const myBookings = bookings.filter(b => myTheatreNames.includes(b.theatreName));

  // Calculate stats
  const totalShowsCount = myShows.length;
  const totalMoviesCount = movies.length;
  const totalBookingsCount = myBookings.length;
  const totalRevenue = myBookings.reduce((sum, b) => b.status === 'Completed' ? sum + b.amount : sum, 0);

  // Charts dataset: monthly revenue trend for this owner's theatres
  const revenueTrendData = [
    { month: 'Jan', Revenue: totalRevenue * 0.12 },
    { month: 'Feb', Revenue: totalRevenue * 0.15 },
    { month: 'Mar', Revenue: totalRevenue * 0.18 },
    { month: 'Apr', Revenue: totalRevenue * 0.22 },
    { month: 'May', Revenue: totalRevenue * 0.28 },
    { month: 'Jun', Revenue: totalRevenue * 0.35 }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Owner Dashboard</h1>
          <p className="text-xs text-gray-500">Manage screens, shows, and review ticket sales revenue</p>
        </div>

        <div className="flex gap-2">
          <Link to="/owner/shows">
            <button className="flex items-center space-x-1 px-4 py-2 bg-brand-accent hover:bg-brand-hover text-white text-xs font-semibold rounded-lg transition-colors shadow-md">
              <PlusCircle className="h-4 w-4" />
              <span>Create Show</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Active Showtimes"
          value={totalShowsCount}
          icon={Calendar}
          color="info"
          trend={{ type: 'up', value: '+4', text: 'this week' }}
        />
        <DashboardCard
          title="Total Movies"
          value={totalMoviesCount}
          icon={Film}
          color="accent"
        />
        <DashboardCard
          title="Tickets Sold"
          value={totalBookingsCount}
          icon={Ticket}
          color="gold"
          trend={{ type: 'up', value: '+18%', text: 'vs last month' }}
        />
        <DashboardCard
          title="Net Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          icon={IndianRupee}
          color="success"
          trend={{ type: 'up', value: '+12%', text: 'growth' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Revenue Analytics Area Chart */}
        <div className="lg:col-span-2 bg-brand-card border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-4 mb-6">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-accent" />
              Revenue Analytics
            </h3>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Live Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E50914" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151C2C', border: '1px solid #1F2937', borderRadius: '8px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#E50914" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right col: My Theatres Listing */}
        <div className="bg-brand-card border border-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-md font-bold text-white border-b border-gray-800/80 pb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-brand-accent" />
            My Cinemas
          </h3>

          {myTheatres.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No theatres owned.</p>
          ) : (
            <div className="space-y-3">
              {myTheatres.map(theatre => (
                <div key={theatre.id} className="p-3 bg-gray-950/60 border border-gray-900 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white text-xs">{theatre.name}</p>
                    <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black ${
                      theatre.status === 'Approved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {theatre.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">{theatre.address}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
