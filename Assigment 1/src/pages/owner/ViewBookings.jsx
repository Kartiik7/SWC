import React from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../hooks/useAuth';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';

const ViewBookings = () => {
  const { bookings, theatres } = useBooking();
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  // Find owner's theatres
  const myTheatres = theatres.filter(t => t.ownerId === currentUser.id);
  const myTheatreNames = myTheatres.map(t => t.name);

  // Filter bookings linked to owner's theatres
  const myBookings = bookings.filter(b => myTheatreNames.includes(b.theatreName));

  const headers = ['Booking ID', 'Movie Name', 'Cinema', 'Seats', 'Customer', 'Date / Time', 'Total Price', 'Status'];

  const renderRow = (bk) => (
    <React.Fragment key={bk.id}>
      <td className="px-6 py-4 font-mono font-bold text-white text-xs tracking-wider">{bk.id}</td>
      <td className="px-6 py-4 font-semibold text-white text-sm">{bk.movieName}</td>
      <td className="px-6 py-4 text-xs text-gray-300">
        <div>
          <p className="font-semibold text-gray-300">{bk.theatreName}</p>
          <p className="text-[10px] text-gray-500">{bk.screenName}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-xs">
        <div className="flex flex-wrap gap-1">
          {bk.seats.map(s => (
            <span key={s} className="px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-white font-mono text-[10px] rounded">
              {s}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 text-xs text-gray-300">{bk.userName}</td>
      <td className="px-6 py-4 text-xs">
        <div>
          <p className="font-medium text-gray-300">{bk.date}</p>
          <p className="text-[10px] text-gray-500">{bk.showtime}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-xs text-brand-gold font-bold">₹{bk.amount.toFixed(2)}</td>
      <td className="px-6 py-4 text-xs">
        <Badge variant={bk.status === 'Completed' ? 'success' : 'danger'}>
          {bk.status}
        </Badge>
      </td>
    </React.Fragment>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">Customer Bookings</h1>
        <p className="text-xs text-gray-500">Monitor all ticket purchases and statuses across your theatres</p>
      </div>

      {/* Bookings table */}
      <Table
        headers={headers}
        data={myBookings}
        renderRow={renderRow}
        emptyMessage="No customer tickets purchased yet."
      />
    </div>
  );
};

export default ViewBookings;
