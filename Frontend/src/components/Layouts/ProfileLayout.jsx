import React from "react";
import ProfileNavbar from "../Profile/ProfileNavbar";
import Profile from "../Profile/Profile";

const ProfileLayout = ({ darkMode, children }) => {
  return (
    <div>
      <Profile darkMode={darkMode} />
      <ProfileNavbar />
      <div className="h-screen">{children}</div>
    </div>
  );
};

export default ProfileLayout;
