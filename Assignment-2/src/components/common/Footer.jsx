import React from 'react';
import { Film, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#080B13] border-t border-gray-900 text-gray-400 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Info */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2 text-white font-extrabold text-xl tracking-wider">
            <Film className="h-6 w-6 text-brand-accent" />
            <span>CineVerse</span>
          </div>
          <p className="text-sm text-gray-500">
            Your premium destination for hassle-free movie ticket booking. Discover, book, and enjoy your favorite cinema experiences.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/user/movies" className="hover:text-brand-accent transition-colors">Browse Movies</Link>
            </li>
            <li>
              <Link to="/user/history" className="hover:text-brand-accent transition-colors">Booking History</Link>
            </li>
            <li>
              <Link to="/user/profile" className="hover:text-brand-accent transition-colors">User Profile</Link>
            </li>
            <li>
              <Link to="/user/settings" className="hover:text-brand-accent transition-colors">Account Settings</Link>
            </li>
          </ul>
        </div>

        {/* Roles Access */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Portals</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/login" className="hover:text-brand-accent transition-colors">Customer Portal</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-brand-accent transition-colors">Theatre Owner Portal</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-brand-accent transition-colors">Administrator Portal</Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-brand-accent" />
              <span>+91 1800 208 8080 (Toll Free)</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-brand-accent" />
              <span>support@cineverse.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-brand-accent" />
              <span>CineVerse Tech Park, Hitech City, Hyderabad</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto text-xs">
        <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} CineVerse Entertainment Pvt. Ltd. All Rights Reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Preferences</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
