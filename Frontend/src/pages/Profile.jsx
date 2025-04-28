import React from 'react';
import ProfileLayout from '../components/Layouts/ProfileLayout';

const ProfilePage = () => {
  return (
    <ProfileLayout>
      <div className="py-4">
        {/* Content for the profile page will be rendered here */}
        <h2 className="font-semibold text-black dark:text-white text-xl">
          Welcome to your profile
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          This is where your profile content will be displayed.
        </p>
      </div>
    </ProfileLayout>
  );
};

export default ProfilePage;