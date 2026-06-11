import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Film, Calendar, Clapperboard, 
  TicketCheck, Users, ShieldAlert, TrendingUp, Grid3X3 
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const routerLocation = useLocation();

  const getLinks = () => {
    if (role === 'owner') {
      return [
        { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
        { name: 'Manage Movies', path: '/owner/movies', icon: Film },
        { name: 'Manage Shows', path: '/owner/shows', icon: Calendar },
        { name: 'Manage Screens', path: '/owner/screens', icon: Clapperboard },
        { name: 'Visually Create Layout', path: '/owner/seat-layout', icon: Grid3X3 },
        { name: 'View Bookings', path: '/owner/bookings', icon: TicketCheck },
      ];
    }
    if (role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Manage Users', path: '/admin/users', icon: Users },
        { name: 'Manage Theatres', path: '/admin/theatres', icon: Clapperboard },
        { name: 'Approvals Queue', path: '/admin/requests', icon: ShieldAlert },
        { name: 'Reports & Analytics', path: '/admin/reports', icon: TrendingUp },
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <aside className="w-full md:w-64 bg-brand-card border-b md:border-b-0 md:border-r border-gray-800 flex flex-row md:flex-col p-4 md:py-6 overflow-x-auto md:overflow-x-visible space-x-2 md:space-x-0 md:space-y-1">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = routerLocation.pathname === link.path;
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap md:whitespace-normal ${
              isActive 
                ? 'bg-brand-accent text-white shadow-md glow-red' 
                : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </aside>
  );
};

export default Sidebar;
