import React from "react";
import ProfileNavbar from "../Profile/ProfileNavbar";
import Profile from "../Profile/Profile";

const ProfileLayout = ({ children }) => {
  return (
    <div className="bg-white dark:bg-inherit min-h-screen">
      <div className="mx-auto px-4 py-6 container">
        <Profile />
        <ProfileNavbar />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default ProfileLayout;