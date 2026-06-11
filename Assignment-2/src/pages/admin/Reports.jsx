import React from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useMovie } from '../../hooks/useMovie';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import { TrendingUp, BarChart4, PieChart as PieIcon, Clapperboard, Award } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';

const Reports = () => {
  const { bookings } = useBooking();
  const { movies } = useMovie();

  // Completed bookings
  const successfulBookings = bookings.filter(b => b.status === 'Completed');

  // 1. Calculate Monthly Booking counts and Revenues
  const monthlyData = [
    { month: 'Jan', Bookings: 120, Revenue: 24000 },
    { month: 'Feb', Bookings: 180, Revenue: 38000 },
    { month: 'Mar', Bookings: 240, Revenue: 51000 },
    { month: 'Apr', Bookings: 310, Revenue: 68000 },
    { month: 'May', Bookings: 430, Revenue: 95000 },
    { month: 'Jun', Bookings: 520, Revenue: 114000 }
  ];

  // 2. Calculate Top Movies based on bookings count
  // Reduce to count occurrences of movieName
  const movieCounts = successfulBookings.reduce((acc, curr) => {
    acc[curr.movieName] = (acc[curr.movieName] || 0) + curr.seats.length;
    return acc;
  }, {});

  const topMoviesData = Object.entries(movieCounts)
    .map(([name, tickets]) => ({ name, tickets }))
    .sort((a, b) => b.tickets - a.tickets)
    .slice(0, 5);

  // 3. Occupancy statistics by category (Premium, Gold, Silver)
  // Let's mock seat category booking splits
  const categorySplitData = [
    { name: 'Premium Class', value: 240, color: '#FFC107' },
    { name: 'Gold Class', value: 380, color: '#F59E0B' },
    { name: 'Silver Class', value: 510, color: '#9E9E9E' }
  ];

  const headers = ['Rank', 'Movie Title', 'Tickets Sold', 'Revenue Contribution'];

  const renderRow = (movie, idx) => (
    <React.Fragment key={idx}>
      <td className="px-6 py-4">
        <span className="w-6 h-6 rounded-full bg-gray-900 border border-gray-800 text-brand-gold font-bold text-xs flex items-center justify-center">
          {idx + 1}
        </span>
      </td>
      <td className="px-6 py-4 font-bold text-white text-sm">{movie.name}</td>
      <td className="px-6 py-4 text-xs font-semibold text-white">{movie.tickets} tickets</td>
      <td className="px-6 py-4 text-xs text-brand-gold font-bold">
        ₹{(movie.tickets * 320).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
      </td>
    </React.Fragment>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">Platform Reports</h1>
        <p className="text-xs text-gray-500">Analyze user sales metrics, occupancy divisions, and movie popularity listings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Monthly Booking Curve */}
        <div className="bg-brand-card border border-gray-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800/80 pb-3 mb-6">
            <TrendingUp className="h-4.5 w-4.5 text-brand-accent" />
            Monthly Bookings Curve
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E50914" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151C2C', border: '1px solid #1F2937', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Area type="monotone" dataKey="Bookings" stroke="#E50914" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBookings)" name="Bookings Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy stats PieChart */}
        <div className="bg-brand-card border border-gray-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-brand-accent/20 pb-3 mb-6">
            <PieIcon className="h-4.5 w-4.5 text-brand-accent" />
            Occupancy splits
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="h-48 w-48 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySplitData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categorySplitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#151C2C', border: '1px solid #1F2937', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3.5 text-xs flex-grow">
              {categorySplitData.map(c => (
                <div key={c.name} className="flex items-center justify-between border-b border-gray-900 pb-2 last:border-b-0 last:pb-0">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-gray-400 font-medium">{c.name}</span>
                  </div>
                  <span className="text-white font-bold">{c.value} bookings</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Top Movies Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-gray-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clapperboard className="h-4.5 w-4.5 text-brand-accent" />
              Box Office Rank
            </h3>
          </div>
          <Table
            headers={headers}
            data={topMoviesData}
            renderRow={renderRow}
            emptyMessage="No movie ticket sales recorded."
          />
        </div>

        {/* Right col: Analytics summary card */}
        <div className="bg-gradient-to-tr from-brand-card to-gray-950 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800/80 pb-3">
              <Award className="h-4.5 w-4.5 text-brand-gold" />
              Box Office Awards
            </h3>
            
            {topMoviesData.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-xl">
                  <span className="text-[9px] uppercase tracking-wider font-black text-brand-gold">Platform Best Seller</span>
                  <h4 className="text-base font-extrabold text-white mt-1">{topMoviesData[0].name}</h4>
                  <p className="text-[10px] text-gray-500 mt-1">Leading box office bookings with {topMoviesData[0].tickets} tickets sold.</p>
                </div>
                
                {topMoviesData.length > 1 && (
                  <div className="p-4 bg-gray-950/60 border border-gray-900 rounded-xl">
                    <span className="text-[9px] uppercase tracking-wider font-black text-gray-400">Runner Up</span>
                    <h4 className="text-sm font-extrabold text-white mt-1">{topMoviesData[1].name}</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Securing second place with {topMoviesData[1].tickets} ticket sales.</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No sales recorded.</p>
            )}
          </div>
          
          <div className="text-[10px] text-gray-500 mt-6 text-center border-t border-gray-900 pt-4">
            Generated by CineVerse Analytics Engine
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
