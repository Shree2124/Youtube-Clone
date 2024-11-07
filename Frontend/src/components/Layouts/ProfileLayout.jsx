import React from "react";
import ProfileNavbar from "../Profile/ProfileNavbar";
import Profile from "../Profile/Profile";

const ProfileLayout = ({ darkMode, children }) => {
  return (
    <div className="h-full min-h-screen">
      <Profile darkMode={darkMode} />
      <ProfileNavbar />
      <div className="h-full">{children}</div>
    </div>
  );
};

export default ProfileLayout;
