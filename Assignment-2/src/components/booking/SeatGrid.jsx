import React from 'react';
import Seat from './Seat';
import Badge from '../common/Badge';

const SeatGrid = ({ 
  screen, 
  show, 
  selectedSeats = [], 
  onSeatToggle 
}) => {
  if (!screen) return null;

  const { rows, columns, categories = {} } = screen;

  // Generate mock booked seats deterministically based on showId
  const getBookedSeatsForShow = (showId) => {
    if (!showId) return new Set();
    const booked = new Set();
    // Use a simple hash code of showId to seed mock bookings
    let seed = 0;
    for (let i = 0; i < showId.length; i++) {
      seed += showId.charCodeAt(i);
    }
    
    // Select about 30% of seats randomly but consistently
    rows.forEach(row => {
      for (let col = 1; col <= columns; col++) {
        // Simple seeded pseudo-random
        const val = Math.sin(seed + row.charCodeAt(0) * col) * 1000;
        const diff = val - Math.floor(val);
        if (diff < 0.35) {
          booked.add(`${row}${col}`);
        }
      }
    });

    return booked;
  };

  const bookedSeats = getBookedSeatsForShow(show?.id);

  // Helper to find seat category
  const getCategory = (row) => {
    if (categories.Premium && categories.Premium.includes(row)) return 'Premium';
    if (categories.Gold && categories.Gold.includes(row)) return 'Gold';
    return 'Silver';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Screen Indicator */}
      <div className="w-full max-w-lg mb-12 flex flex-col items-center">
        <div className="w-full h-3 border-t-2 border-brand-accent/50 rounded-[50%] shadow-[0_0_20px_rgba(229,9,20,0.2)] bg-gradient-to-b from-brand-accent/10 to-transparent"></div>
        <p className="text-[10px] uppercase text-gray-500 tracking-widest mt-2">All eyes this way (Screen)</p>
      </div>

      {/* Seats Matrix */}
      <div className="flex flex-col space-y-3 overflow-x-auto max-w-full pb-4 scrollbar-thin">
        {rows.map((row) => (
          <div key={row} className="flex items-center space-x-3 min-w-max">
            {/* Row Letter Start */}
            <span className="w-5 text-sm font-bold text-gray-500 text-center">{row}</span>
            
            {/* Seats */}
            <div className="flex space-x-2">
              {Array.from({ length: columns }, (_, idx) => {
                const col = idx + 1;
                const seatId = `${row}${col}`;
                const category = getCategory(row);
                
                let status = 'Available';
                if (bookedSeats.has(seatId)) status = 'Booked';
                else if (selectedSeats.includes(seatId)) status = 'Selected';

                return (
                  <Seat
                    key={col}
                    row={row}
                    col={col}
                    category={category}
                    status={status}
                    onClick={onSeatToggle}
                  />
                );
              })}
            </div>

            {/* Row Letter End */}
            <span className="w-5 text-sm font-bold text-gray-500 text-center">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-10 border-t border-gray-800 pt-6 w-full max-w-xl">
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-5 h-5 rounded border border-gray-600 bg-transparent flex items-center justify-center text-[10px] text-gray-500 font-bold">A</div>
          <span className="text-gray-400">Available (Silver)</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-5 h-5 rounded border border-amber-500 bg-transparent flex items-center justify-center text-[10px] text-amber-500 font-bold">A</div>
          <span className="text-gray-400">Available (Gold)</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-5 h-5 rounded border border-brand-gold bg-transparent flex items-center justify-center text-[10px] text-brand-gold font-bold">A</div>
          <span className="text-gray-400">Available (Premium)</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-5 h-5 rounded-md bg-brand-accent flex items-center justify-center text-[10px] text-white font-bold">A</div>
          <span className="text-gray-400">Selected</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-5 h-5 rounded-md bg-gray-800 border border-gray-900 flex items-center justify-center text-[10px] text-gray-600 font-bold opacity-40">A</div>
          <span className="text-gray-400">Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
