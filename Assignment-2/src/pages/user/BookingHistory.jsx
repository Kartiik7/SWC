import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../../components/common/Badge';
import { Calendar, Clock, MapPin, Ticket, Clapperboard, ArrowRight } from 'lucide-react';

const BookingHistory = () => {
  const { bookings } = useBooking();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  // Filter bookings for current logged in user
  const userBookings = bookings.filter(b => b.userId === currentUser.id);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">My Bookings</h1>
          <p className="text-xs text-gray-500 mt-1">Review your ticket purchase history and screening details</p>
        </div>
      </div>

      {/* Bookings List */}
      {userBookings.length === 0 ? (
        <div className="text-center py-20 bg-brand-card/40 border border-gray-800/80 rounded-2xl space-y-4">
          <p className="text-gray-500 text-sm">You haven't booked any movie tickets yet.</p>
          <Link to="/user/movies" className="inline-block bg-brand-accent hover:bg-brand-hover text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md">
            Browse Live Movies
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userBookings.map((bk) => {
            const formattedDate = new Date(bk.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div 
                key={bk.id} 
                className="bg-brand-card border border-gray-800 hover:border-gray-700 rounded-2xl p-5 md:p-6 shadow-md transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/60 pb-4 mb-4">
                  {/* Left part: Movie name & ID */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                      <Clapperboard className="h-4 w-4 text-brand-accent" />
                      {bk.movieName}
                    </h3>
                    <span className="font-mono text-xs text-gray-500 tracking-wider">REF ID: {bk.id}</span>
                  </div>

                  {/* Right: Badge Status & Paid amount */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Paid Fare</p>
                      <p className="font-black text-brand-gold text-base">₹{bk.amount.toFixed(2)}</p>
                    </div>
                    <Badge variant={bk.status === 'Completed' ? 'success' : 'danger'}>
                      {bk.status}
                    </Badge>
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">Theatre</p>
                      <p className="font-semibold text-gray-300 mt-0.5">{bk.theatreName}</p>
                      <p className="text-[10px] text-gray-500">{bk.screenName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">Show Date & Time</p>
                      <p className="font-semibold text-gray-300 mt-0.5">{formattedDate}</p>
                      <p className="text-[10px] text-gray-500">{bk.showtime}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Ticket className="h-4 w-4 text-brand-accent flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">Seats Allocated</p>
                      <p className="font-bold text-white mt-0.5">{bk.seats.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
