import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProfileCard from '../../components/dashboard/ProfileCard';

const UserProfile = () => {
  const { currentUser, updateProfile } = useAuth();

  return (
    <div className="space-y-8 py-6">
      <div className="text-center md:text-left border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">Account Profile</h1>
        <p className="text-xs text-gray-500">View and update your personal contact details</p>
      </div>

      <ProfileCard
        user={currentUser}
        onUpdate={updateProfile}
      />
    </div>
  );
};

export default UserProfile;
