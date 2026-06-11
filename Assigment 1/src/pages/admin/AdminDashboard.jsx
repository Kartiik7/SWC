import React from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useMovie } from '../../hooks/useMovie';
import { useAuth } from '../../hooks/useAuth';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { Users, Briefcase, Film, Ticket, IndianRupee, MapPin } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';

const AdminDashboard = () => {
  const { theatres, bookings } = useBooking();
  const { movies } = useMovie();
  const { users } = useAuth();

  // Stats calculations
  const totalUsers = users.filter(u => u.role === 'user').length;
  const totalOwners = users.filter(u => u.role === 'owner').length;
  const totalMovies = movies.length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => b.status === 'Completed' ? sum + b.amount : sum, 0);

  // Recharts Monthly Revenue & Bookings data
  const reportsData = [
    { name: 'Jan', Bookings: 120, Revenue: 24000 },
    { name: 'Feb', Bookings: 180, Revenue: 38000 },
    { name: 'Mar', Bookings: 240, Revenue: 51000 },
    { name: 'Apr', Bookings: 310, Revenue: 68000 },
    { name: 'May', Bookings: 430, Revenue: 95000 },
    { name: 'Jun', Bookings: 520, Revenue: 114000 }
  ];

  // Approved vs Pending theatres count
  const approvedTheatres = theatres.filter(t => t.status === 'Approved').length;
  const pendingTheatres = theatres.filter(t => t.status === 'Pending').length;

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">System Admin Dashboard</h1>
        <p className="text-xs text-gray-500">Monitor system performance, coordinate owner requests, and audit logs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Total Customers"
          value={totalUsers}
          icon={Users}
          color="info"
        />
        <DashboardCard
          title="Theatre Owners"
          value={totalOwners}
          icon={Briefcase}
          color="gold"
        />
        <DashboardCard
          title="Active Movies"
          value={totalMovies}
          icon={Film}
          color="accent"
        />
        <DashboardCard
          title="Ticket Bookings"
          value={totalBookings}
          icon={Ticket}
          color="secondary"
          trend={{ type: 'up', value: '+35%', text: 'this month' }}
        />
        <DashboardCard
          title="Total Gross"
          value={`₹${(totalRevenue/1000).toFixed(0)}k`}
          icon={IndianRupee}
          color="success"
          trend={{ type: 'up', value: '+24%', text: 'growth' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Recharts BarChart comparing Revenue & Bookings */}
        <div className="lg:col-span-2 bg-brand-card border border-gray-800 rounded-2xl p-6">
          <div className="border-b border-gray-800/80 pb-4 mb-6">
            <h3 className="text-md font-bold text-white">Platform Transaction Volume</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Comparing ticket transactions and revenue charts</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151C2C', border: '1px solid #1F2937', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Bar dataKey="Revenue" fill="#E50914" radius={[4, 4, 0, 0]} name="Gross Revenue (₹)" />
                <Bar dataKey="Bookings" fill="#FFC107" radius={[4, 4, 0, 0]} name="Ticket Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right col: Pending Queue Summary & Statuses */}
        <div className="bg-brand-card border border-gray-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-md font-bold text-white border-b border-gray-800/80 pb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-accent" />
              Cinema Registry
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">Approved</span>
              <p className="text-3xl font-extrabold text-white mt-1">{approvedTheatres}</p>
            </div>
            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-center">
              <span className="text-[10px] text-amber-400 font-semibold uppercase">Pending</span>
              <p className="text-3xl font-extrabold text-white mt-1 animate-pulse">{pendingTheatres}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs border-b border-gray-900 pb-2.5">
              <span className="text-gray-500 font-medium">Total Registered Users</span>
              <span className="text-white font-bold">{users.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-gray-900 pb-2.5">
              <span className="text-gray-500 font-medium">Total Cinemas</span>
              <span className="text-white font-bold">{theatres.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">System Health</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
