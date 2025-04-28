import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state?.user);

  return (
    <div>
      {/* Banner Image */}
      <div className="bg-cyan-400 rounded-3xl w-full h-[30vh]"></div>
      
      {/* Profile Info Section */}
      <div className="flex items-start gap-6 md:gap-12 mt-4">
        {/* Avatar */}
        <div className="p-3">
          <img
            className="border-4 border-white dark:border-gray-800 rounded-full w-32 md:w-40 h-32 md:h-40 object-cover"
            src={user?.avatar || "https://www.w3schools.com/howto/img_avatar.png"}
            alt={`${user?.name || "User"}'s profile`}
          />
        </div>
        
        {/* User Details */}
        <div className="flex flex-col">
          <h1 className="font-bold text-black dark:text-white text-2xl md:text-3xl lg:text-4xl">
            {user?.name || "Channel"}
          </h1>
          <span className="mt-1 text-gray-600 dark:text-gray-300 text-sm md:text-base">
            @{user?.name} • {user?.subscribers || 0} subscribers
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;