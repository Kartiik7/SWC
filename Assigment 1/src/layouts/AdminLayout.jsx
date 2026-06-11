import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-gray-100">
      <Navbar />
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar role="admin" />
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
