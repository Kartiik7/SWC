import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-gray-100">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
