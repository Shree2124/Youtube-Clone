// ProfileNavbar.jsx - Navigation tabs
import React from "react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  {
    name: "Home",
    path: "/profile/home",
  },
  {
    name: "My Videos",
    path: "/profile/my-videos",
  },
  {
    name: "Subscribed Channels",
    path: "/profile/subs"
  }
];

const ProfileNavbar = () => {
  const location = useLocation();
  
  return (
    <div className="flex justify-center py-4 md:py-6 border-gray-200 dark:border-gray-700 border-b">
      <nav>
        <ul className="flex space-x-2 md:space-x-8">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <li key={tab.path}>
                <Link 
                  to={tab.path}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 text-black dark:text-white
                    ${isActive 
                      ? "bg-gray-100 dark:bg-gray-700 font-medium" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                  {tab.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default ProfileNavbar;