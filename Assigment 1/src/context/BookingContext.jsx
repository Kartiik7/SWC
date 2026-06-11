import { createContext, useState, useEffect } from 'react';
import {
  getStorageTheatres, saveStorageTheatres,
  getStorageScreens, saveStorageScreens,
  getStorageShows, saveStorageShows,
  getStorageBookings, saveStorageBookings
} from '../services/storage';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Booking Cart State
  const [selectedLocation, setSelectedLocation] = useState(() => {
    return localStorage.getItem('cineverse_selected_location') || '';
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  useEffect(() => {
    setTheatres(getStorageTheatres());
    setScreens(getStorageScreens());
    setShows(getStorageShows());
    setBookings(getStorageBookings());
  }, []);

  const selectLocation = (location) => {
    setSelectedLocation(location);
    localStorage.setItem('cineverse_selected_location', location);
    // Clear subsequent flow
    setSelectedTheatre(null);
    setSelectedScreen(null);
    setSelectedShow(null);
    setSelectedSeats([]);
  };

  const selectMovie = (movie) => {
    setSelectedMovie(movie);
    setSelectedTheatre(null);
    setSelectedScreen(null);
    setSelectedShow(null);
    setSelectedSeats([]);
  };

  const selectTheatre = (theatre) => {
    setSelectedTheatre(theatre);
    setSelectedScreen(null);
    setSelectedShow(null);
    setSelectedSeats([]);
  };

  const selectScreen = (screen) => {
    setSelectedScreen(screen);
    setSelectedShow(null);
    setSelectedSeats([]);
  };

  const selectShow = (show) => {
    setSelectedShow(show);
    setSelectedSeats([]);
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }
      return [...prev, seatId];
    });
  };

  const clearSelection = () => {
    setSelectedMovie(null);
    setSelectedTheatre(null);
    setSelectedScreen(null);
    setSelectedShow(null);
    setSelectedSeats([]);
  };

  // Confirm booking
  const confirmBooking = (userId, userName) => {
    if (!selectedMovie || !selectedTheatre || !selectedScreen || !selectedShow || selectedSeats.length === 0) {
      return { success: false, message: 'Incomplete booking details.' };
    }

    const priceDetails = calculatePrice();
    const newBooking = {
      id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      showId: selectedShow.id,
      userId,
      userName,
      movieName: selectedMovie.name,
      theatreName: selectedTheatre.name,
      screenName: selectedScreen.name,
      showtime: selectedShow.time,
      date: selectedShow.date,
      seats: selectedSeats,
      amount: parseFloat(priceDetails.finalAmount),
      status: 'Completed'
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    saveStorageBookings(updatedBookings);

    setBookingSuccessData(newBooking);
    clearSelection();
    return { success: true, booking: newBooking };
  };

  const calculatePrice = () => {
    if (!selectedShow || selectedSeats.length === 0) {
      return { basePrice: 0, totalBase: 0, gst: 0, convenienceFee: 0, finalAmount: 0 };
    }
    
    // In our design:
    // SelectedShow.price is the base price.
    // Premium seats: +50, Gold seats: +20, Silver: +0
    let totalBase = 0;
    selectedSeats.forEach(seat => {
      const row = seat.charAt(0);
      let category = 'Silver';
      
      if (selectedScreen && selectedScreen.categories) {
        if (selectedScreen.categories.Premium.includes(row)) category = 'Premium';
        else if (selectedScreen.categories.Gold.includes(row)) category = 'Gold';
      }
      
      let price = selectedShow.price;
      if (category === 'Premium') price += 100;
      else if (category === 'Gold') price += 50;
      
      totalBase += price;
    });

    const convenienceFee = selectedSeats.length * 30; // 30 per seat
    const gst = parseFloat(((totalBase + convenienceFee) * 0.18).toFixed(2));
    const finalAmount = parseFloat((totalBase + convenienceFee + gst).toFixed(2));

    return {
      totalBase,
      convenienceFee,
      gst,
      finalAmount
    };
  };

  // Admin Theatre approvals
  const approveTheatre = (id) => {
    const updated = theatres.map(t => t.id === id ? { ...t, status: 'Approved' } : t);
    setTheatres(updated);
    saveStorageTheatres(updated);
  };

  const rejectTheatre = (id) => {
    const updated = theatres.map(t => t.id === id ? { ...t, status: 'Rejected' } : t);
    setTheatres(updated);
    saveStorageTheatres(updated);
  };

  // Theatre Owner CRUD for Theatres
  const addTheatre = (theatreData) => {
    const newTheatre = {
      id: 't_' + Date.now(),
      status: 'Pending', // Needs admin approval
      facilities: [],
      ...theatreData
    };
    const updated = [...theatres, newTheatre];
    setTheatres(updated);
    saveStorageTheatres(updated);
    return newTheatre;
  };

  const updateTheatre = (id, theatreData) => {
    const updated = theatres.map(t => t.id === id ? { ...t, ...theatreData } : t);
    setTheatres(updated);
    saveStorageTheatres(updated);
  };

  const deleteTheatre = (id) => {
    const updated = theatres.filter(t => t.id !== id);
    setTheatres(updated);
    saveStorageTheatres(updated);
    
    // Clean up screens & shows linked to this theatre
    const updatedScreens = screens.filter(s => s.theatreId !== id);
    setScreens(updatedScreens);
    saveStorageScreens(updatedScreens);

    const updatedShows = shows.filter(s => s.theatreId !== id);
    setShows(updatedShows);
    saveStorageShows(updatedShows);
  };

  // Screens CRUD
  const addScreen = (screenData) => {
    const newScreen = {
      id: 's_' + Date.now(),
      categories: {
        Premium: ["A"],
        Gold: ["B", "C"],
        Silver: ["D", "E"]
      },
      ...screenData
    };
    const updated = [...screens, newScreen];
    setScreens(updated);
    saveStorageScreens(updated);
    return newScreen;
  };

  const updateScreen = (id, screenData) => {
    const updated = screens.map(s => s.id === id ? { ...s, ...screenData } : s);
    setScreens(updated);
    saveStorageScreens(updated);
  };

  const deleteScreen = (id) => {
    const updated = screens.filter(s => s.id !== id);
    setScreens(updated);
    saveStorageScreens(updated);

    // Clean up shows linked to this screen
    const updatedShows = shows.filter(s => s.screenId !== id);
    setShows(updatedShows);
    saveStorageShows(updatedShows);
  };

  // Shows CRUD
  const addShow = (showData) => {
    const newShow = {
      id: 'sh_' + Date.now(),
      ...showData
    };
    const updated = [...shows, newShow];
    setShows(updated);
    saveStorageShows(updated);
    return newShow;
  };

  const updateShow = (id, showData) => {
    const updated = shows.map(s => s.id === id ? { ...s, ...showData } : s);
    setShows(updated);
    saveStorageShows(updated);
  };

  const deleteShow = (id) => {
    const updated = shows.filter(s => s.id !== id);
    setShows(updated);
    saveStorageShows(updated);
  };

  return (
    <BookingContext.Provider value={{
      theatres,
      screens,
      shows,
      bookings,
      selectedLocation,
      selectedMovie,
      selectedTheatre,
      selectedScreen,
      selectedShow,
      selectedSeats,
      bookingSuccessData,
      setBookingSuccessData,
      selectLocation,
      selectMovie,
      selectTheatre,
      selectScreen,
      selectShow,
      toggleSeat,
      clearSelection,
      confirmBooking,
      calculatePrice,
      approveTheatre,
      rejectTheatre,
      addTheatre,
      updateTheatre,
      deleteTheatre,
      addScreen,
      updateScreen,
      deleteScreen,
      addShow,
      updateShow,
      deleteShow
    }}>
      {children}
    </BookingContext.Provider>
  );
};
