import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import Button from '../../components/common/Button';
import { CheckCircle, Calendar, Clock, MapPin, Download, Ticket, ArrowLeft, Printer } from 'lucide-react';
import Modal from '../../components/common/Modal';

const BookingConfirmation = () => {
  const { bookingSuccessData, setBookingSuccessData } = useBooking();
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const navigate = useNavigate();

  // If no success data, redirect to dashboard
  if (!bookingSuccessData) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">No recent bookings found.</p>
        <Link to="/user/dashboard" className="inline-block bg-brand-accent hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const {
    id: bookingId,
    movieName,
    theatreName,
    screenName,
    showtime,
    date,
    seats = [],
    amount
  } = bookingSuccessData;

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => {
      setIsDownloaded(false);
      setShowTicketModal(true); // Pop open the printable ticket modal as a mock download
    }, 1200);
  };

  const handleBackToDashboard = () => {
    setBookingSuccessData(null); // Clear success state
    navigate('/user/dashboard');
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      {/* Success Card */}
      <div className="bg-brand-card border border-gray-800 rounded-3xl p-6 md:p-8 text-center shadow-2xl relative overflow-hidden space-y-6">
        {/* Curved visual top accent */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-400" />

        {/* Check Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30 flex items-center justify-center animate-bounce">
            <CheckCircle className="h-10 w-10" />
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Booking Confirmed!</h1>
          <p className="text-sm text-gray-400">Your transaction was completed successfully.</p>
        </div>

        {/* Booking ID box */}
        <div className="bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 inline-block">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Booking Reference ID</span>
          <span className="text-lg font-mono font-black text-brand-gold tracking-widest">{bookingId}</span>
        </div>

        {/* Details Summary */}
        <div className="border-t border-b border-gray-800/80 py-5 text-left text-sm space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 font-medium uppercase">Movie</p>
            <p className="font-bold text-white text-base">{movieName}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-medium uppercase">Date & Showtime</p>
              <p className="font-semibold text-gray-300 flex items-center gap-1.5 text-xs">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                {formattedDate}
              </p>
              <p className="font-semibold text-gray-300 flex items-center gap-1.5 text-xs mt-1">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
                {showtime}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-medium uppercase">Theatre & Screen</p>
              <p className="font-semibold text-gray-300 flex items-center gap-1.5 text-xs">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                {theatreName}
              </p>
              <p className="font-semibold text-gray-400 text-xs mt-1">
                {screenName}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-900/30 p-3 rounded-lg border border-gray-900">
            <div>
              <p className="text-[10px] text-gray-500 font-medium uppercase">Seats</p>
              <p className="font-bold text-white mt-0.5">{seats.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-medium uppercase">Paid Amount</p>
              <p className="font-black text-brand-gold text-base">₹{amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            fullWidth
            onClick={handleDownload}
            disabled={isDownloaded}
            className="font-bold"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloaded ? 'Generating PDF...' : 'Download Ticket'}
          </Button>

          <Button
            variant="primary"
            fullWidth
            onClick={handleBackToDashboard}
            className="font-bold glow-red"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Ticket Modal Overlay */}
      <Modal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        title="Print Movie Ticket"
        footerActions={
          <Button variant="primary" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print Ticket
          </Button>
        }
      >
        <div className="p-4 bg-white text-gray-900 rounded-xl font-mono text-xs border border-dashed border-gray-400 space-y-4">
          <div className="text-center border-b border-gray-300 pb-3">
            <h2 className="text-base font-black tracking-widest text-brand-bg">CINEVERSE TICKET</h2>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">Booking Confirm - Official Entry Pass</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-bold text-gray-500">TICKET REF:</span>
              <span className="font-bold text-black">{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-500">MOVIE:</span>
              <span className="font-bold text-black">{movieName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-500">CINEMA:</span>
              <span className="font-bold text-black">{theatreName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-500">SCREEN:</span>
              <span className="font-bold text-black">{screenName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-500">DATE:</span>
              <span className="font-bold text-black">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-500">SHOWTIME:</span>
              <span className="font-bold text-black">{showtime}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-gray-300 pt-2">
              <span className="font-bold text-gray-500">SEATS:</span>
              <span className="font-bold text-black text-sm">{seats.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-500">TOTAL FARE:</span>
              <span className="font-bold text-black text-sm">₹{amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center border-t border-gray-300 pt-3 flex flex-col items-center">
            <div className="w-40 h-8 bg-gray-300 mb-2 border border-gray-400 flex items-center justify-center text-[10px] tracking-[6px] text-gray-700 font-bold font-sans">
              ||| |||| | || ||||
            </div>
            <p className="text-[8px] text-gray-400">Please present barcode at theatre entrance.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingConfirmation;
