import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import { BookingProvider } from './context/BookingContext';

// Protected Route Wrapper
import ProtectedRoute from './routes/ProtectedRoute';

// Layout shells
import AuthLayout from './layouts/AuthLayout';
import UserLayout from './layouts/UserLayout';
import OwnerLayout from './layouts/OwnerLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import MovieCatalog from './pages/user/MovieCatalog';
import MovieDetails from './pages/user/MovieDetails';
import LocationSelection from './pages/user/LocationSelection';
import TheatreSelection from './pages/user/TheatreSelection';
import AudiSelection from './pages/user/AudiSelection';
import ShowtimeSelection from './pages/user/ShowtimeSelection';
import SeatSelection from './pages/user/SeatSelection';
import BookingSummary from './pages/user/BookingSummary';
import BookingConfirmation from './pages/user/BookingConfirmation';
import UserProfile from './pages/user/UserProfile';
import UserSettings from './pages/user/UserSettings';
import BookingHistory from './pages/user/BookingHistory';

// Theatre Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddEditMovie from './pages/owner/AddEditMovie';
import ManageShows from './pages/owner/ManageShows';
import ViewBookings from './pages/owner/ViewBookings';
import ScreenManagement from './pages/owner/ScreenManagement';
import SeatLayoutConfig from './pages/owner/SeatLayoutConfig';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageTheatres from './pages/admin/ManageTheatres';
import ApproveRequests from './pages/admin/ApproveRequests';
import Reports from './pages/admin/Reports';

const App = () => {
  return (
    <AuthProvider>
      <MovieProvider>
        <BookingProvider>
          <Router>
            <Routes>
              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Authentication portal */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* Customer Portal */}
              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="movies" element={<MovieCatalog />} />
                <Route path="movie/:id" element={<MovieDetails />} />
                <Route path="location" element={<LocationSelection />} />
                <Route path="theatre" element={<TheatreSelection />} />
                <Route path="audi" element={<AudiSelection />} />
                <Route path="showtime" element={<ShowtimeSelection />} />
                <Route path="seats" element={<SeatSelection />} />
                <Route path="summary" element={<BookingSummary />} />
                <Route path="confirmation" element={<BookingConfirmation />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="settings" element={<UserSettings />} />
                <Route path="history" element={<BookingHistory />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Theatre Owner Portal */}
              <Route
                path="/owner"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<OwnerDashboard />} />
                <Route path="movies" element={<AddEditMovie />} />
                <Route path="shows" element={<ManageShows />} />
                <Route path="bookings" element={<ViewBookings />} />
                <Route path="screens" element={<ScreenManagement />} />
                <Route path="seat-layout" element={<SeatLayoutConfig />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Admin Portal */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="theatres" element={<ManageTheatres />} />
                <Route path="requests" element={<ApproveRequests />} />
                <Route path="reports" element={<Reports />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Global 404 redirect */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </BookingProvider>
      </MovieProvider>
    </AuthProvider>
  );
};

export default App;
