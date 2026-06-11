import initialUsers from '../data/users.json';
import initialMovies from '../data/movies.json';
import initialTheatres from '../data/theatres.json';
import initialScreens from '../data/screens.json';
import initialShows from '../data/shows.json';
import initialBookings from '../data/bookings.json';

const getOrInit = (key, initialData) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing localStorage key " + key, e);
    }
  }
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
};

export const getStorageUsers = () => getOrInit('cineverse_users', initialUsers);
export const saveStorageUsers = (users) => localStorage.setItem('cineverse_users', JSON.stringify(users));

export const getStorageMovies = () => getOrInit('cineverse_movies', initialMovies);
export const saveStorageMovies = (movies) => localStorage.setItem('cineverse_movies', JSON.stringify(movies));

export const getStorageTheatres = () => getOrInit('cineverse_theatres', initialTheatres);
export const saveStorageTheatres = (theatres) => localStorage.setItem('cineverse_theatres', JSON.stringify(theatres));

export const getStorageScreens = () => getOrInit('cineverse_screens', initialScreens);
export const saveStorageScreens = (screens) => localStorage.setItem('cineverse_screens', JSON.stringify(screens));

export const getStorageShows = () => getOrInit('cineverse_shows', initialShows);
export const saveStorageShows = (shows) => localStorage.setItem('cineverse_shows', JSON.stringify(shows));

export const getStorageBookings = () => getOrInit('cineverse_bookings', initialBookings);
export const saveStorageBookings = (bookings) => localStorage.setItem('cineverse_bookings', JSON.stringify(bookings));
