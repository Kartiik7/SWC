import React from 'react';

const Seat = ({ 
  row, 
  col, 
  category = 'Silver', 
  status = 'Available', // Available, Booked, Selected
  onClick 
}) => {
  const seatId = `${row}${col}`;

  // Colors mapping based on category and status
  const getStyles = () => {
    if (status === 'Booked') {
      return 'bg-gray-800 text-gray-600 border border-gray-900 cursor-not-allowed opacity-40';
    }
    
    if (status === 'Selected') {
      return 'bg-brand-accent text-white border border-brand-accent shadow-lg scale-105';
    }

    // Available states based on categories
    switch (category) {
      case 'Premium':
        return 'border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-bg';
      case 'Gold':
        return 'border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-brand-bg';
      case 'Silver':
      default:
        return 'border border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-brand-bg';
    }
  };

  return (
    <button
      onClick={() => status !== 'Booked' && onClick(seatId)}
      disabled={status === 'Booked'}
      className={`w-7 h-7 md:w-9 md:h-9 rounded-md text-[10px] md:text-xs font-bold transition-all duration-150 flex items-center justify-center ${getStyles()}`}
      title={`${seatId} (${category}) - ${status}`}
    >
      {col}
    </button>
  );
};

export default Seat;
