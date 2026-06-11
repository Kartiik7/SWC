import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { ArrowLeft, Ticket, Calendar, Clock, MapPin, ReceiptText } from 'lucide-react';

const BookingSummary = () => {
  const { 
    selectedTheatre, 
    selectedMovie, 
    selectedScreen, 
    selectedShow, 
    selectedSeats, 
    calculatePrice,
    confirmBooking 
  } = useBooking();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if previous steps are missing
  if (!selectedTheatre || !selectedMovie || !selectedScreen || !selectedShow || selectedSeats.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">No active checkout session found.</p>
        <Link to="/user/movies" className="inline-block bg-brand-accent hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          Browse Movies
        </Link>
      </div>
    );
  }

  const { totalBase, convenienceFee, gst, finalAmount } = calculatePrice();

  const handleConfirm = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const result = confirmBooking(currentUser.id, currentUser.name);
    if (result.success) {
      navigate('/user/confirmation');
    }
  };

  // Format date for display
  const formattedDate = new Date(selectedShow.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-gray-800 pb-5">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Booking Summary</h1>
          <p className="text-xs text-gray-500 mt-1">Review your tickets and proceed to complete booking</p>
        </div>
      </div>

      {/* Ticket Details Panel */}
      <div className="bg-brand-card border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Movie Header Card */}
        <div className="p-6 bg-gradient-to-r from-gray-900 to-brand-card border-b border-gray-800 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          <div className="w-24 aspect-[2/3] rounded-lg overflow-hidden border border-gray-800 flex-shrink-0 bg-gray-950">
            <img src={selectedMovie.posterUrl} alt={selectedMovie.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">{selectedMovie.name}</h2>
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {selectedMovie.genre.map(g => (
                <span key={g} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] rounded border border-gray-700">
                  {g}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 font-semibold">{selectedMovie.duration} | {selectedMovie.language}</p>
          </div>
        </div>

        {/* Screening Details */}
        <div className="p-6 border-b border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex items-start space-x-2 text-gray-300">
              <MapPin className="h-4 w-4 text-brand-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Cinema Hall</p>
                <p className="font-semibold text-white">{selectedTheatre.name}</p>
                <p className="text-[10px] text-gray-500 leading-normal">{selectedTheatre.address}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <Ticket className="h-4 w-4 text-brand-accent flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Audi & Screen</p>
                <p className="font-semibold text-white">{selectedScreen.name} ({selectedScreen.type})</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-300">
              <Calendar className="h-4 w-4 text-brand-accent flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Show Date</p>
                <p className="font-semibold text-white">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="h-4 w-4 text-brand-accent flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Showtime</p>
                <p className="font-semibold text-white">{selectedShow.time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seats and Pricing */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase font-medium">Seats booked ({selectedSeats.length})</span>
            <div className="flex flex-wrap gap-1">
              {selectedSeats.sort().map(s => (
                <span key={s} className="px-2 py-0.5 bg-gray-900 border border-gray-800 text-white font-bold text-xs rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Base Ticket Price</span>
              <span className="text-white font-medium">₹{totalBase.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Convenience Charge</span>
              <span className="text-white font-medium">₹{convenienceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Taxes (GST 18%)</span>
              <span className="text-white font-medium">₹{gst.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-800 pt-4 flex justify-between items-center text-white">
              <span className="text-base font-bold flex items-center gap-1">
                <ReceiptText className="h-4.5 w-4.5 text-brand-accent" />
                Final Total Amount
              </span>
              <span className="text-2xl font-extrabold text-brand-gold">₹{finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 bg-gray-900/50 border-t border-gray-800">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleConfirm}
            className="py-3 font-bold glow-red"
          >
            Confirm & Pay ₹{finalAmount.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
