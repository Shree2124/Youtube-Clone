import React from "react";

const SubscribeCard = ({ channelImage, channelName, subscribers }) => {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 shadow-md mt-4 px-8 py-4 rounded-lg w-full">
      <img
        className="rounded-full w-28 h-28 object-cover"
        src={channelImage}
        alt={`${channelName} logo`}
      />
      <div>
        <h3 className="text-black dark:text-white text-3xl">{channelName}</h3>
        <p className="font-semibold text-gray-500 dark:text-gray-400 text-2xl">
          Subscribers {subscribers}
        </p>
      </div>
    </div>
  );
};

export default SubscribeCard;