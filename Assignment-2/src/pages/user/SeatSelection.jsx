import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import SeatGrid from '../../components/booking/SeatGrid';
import Button from '../../components/common/Button';
import { ArrowLeft, Ticket, CreditCard } from 'lucide-react';

const SeatSelection = () => {
  const { 
    selectedTheatre, 
    selectedMovie, 
    selectedScreen, 
    selectedShow, 
    selectedSeats, 
    toggleSeat,
    calculatePrice 
  } = useBooking();
  const navigate = useNavigate();

  // Redirect if previous steps are missing
  if (!selectedTheatre || !selectedMovie || !selectedScreen || !selectedShow) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">Please complete the booking selections first.</p>
        <Link to="/user/movies" className="inline-block bg-brand-accent hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          Browse Movies
        </Link>
      </div>
    );
  }

  const { totalBase, convenienceFee, gst, finalAmount } = calculatePrice();

  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    navigate('/user/summary');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
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
            <h1 className="text-2xl font-extrabold text-white tracking-wide">Select Seats</h1>
            <p className="text-xs text-gray-500 mt-1">
              {selectedTheatre.name} | {selectedScreen.name} | {selectedShow.date} at {selectedShow.time}
            </p>
          </div>
        </div>
        
        {/* Movie Title Header */}
        <div className="text-right">
          <p className="text-xs text-gray-500">Selected Movie</p>
          <p className="font-extrabold text-white text-sm">{selectedMovie.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 columns: Interactive Seat Grid */}
        <div className="lg:col-span-2 bg-brand-card/40 border border-gray-900 rounded-2xl p-6 flex items-center justify-center">
          <SeatGrid
            screen={selectedScreen}
            show={selectedShow}
            selectedSeats={selectedSeats}
            onSeatToggle={toggleSeat}
          />
        </div>

        {/* Right column: Ticket Pricing Panel */}
        <div className="bg-brand-card border border-gray-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3 flex items-center gap-2">
            <Ticket className="h-5 w-5 text-brand-accent" />
            Booking Panel
          </h3>

          {selectedSeats.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-500 italic">
              Please click on seats in the layout grid to select them.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected seats list */}
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Selected Seats ({selectedSeats.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeats.sort().map(seat => (
                    <span key={seat} className="px-2.5 py-1 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold rounded-md">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-800 pt-4 space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Tickets Base Fare</span>
                  <span className="font-semibold text-white">₹{totalBase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Convenience Fee (₹30/seat)</span>
                  <span>₹{convenienceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Integrated GST (18%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-white">Total Payable</span>
                  <span className="text-2xl font-extrabold text-brand-accent">₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleProceed}
                className="py-3 font-bold glow-red"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
