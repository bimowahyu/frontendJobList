import React from 'react';

const UserProfile = () => (
  <div className="flex items-center space-x-2">
    <img className="w-8 h-8 rounded-full" src="https://via.placeholder.com/32" alt="User Profile" />
    <span className="hidden md:inline-block font-semibold text-gray-700">Michael</span>
  </div>
);

export default UserProfile;
