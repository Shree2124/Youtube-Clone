import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axiosInstance from "../api/axios";
import VerifiedIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';

const Card = ({ type = "default", video, animDelay = 0 }) => {
  const [channel, setChannel] = useState({});
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchChannel = async () => {
      if (video?.userId) {
        try {
          const res = await axiosInstance.get(`/users/find/${video.userId}`);
          setChannel(res.data.data || {});
        } catch (error) {
          console.error("Error fetching channel data:", error);
        }
      }
    };

    fetchChannel();
  }, [video?.userId]);

  // Format view count
  const formatViewCount = (count) => {
    if (!count && count !== 0) return "0 views";
    if (count >= 1000000) {
      return Math.floor(count / 100000) / 10 + 'M views';
    } else if (count >= 1000) {
      return Math.floor(count / 100) / 10 + 'K views';
    }
    return count + ' views';
  };

  // Format video duration (placeholder for now)
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = Math.floor(seconds % 60);
    
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMins = minutes % 60;
      return `${hours}:${remainingMins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Animation delay based on card position
  const getAnimationDelay = () => {
    return `${50 + (animDelay * 50)}ms`;
  };

  return (
    <div 
      className={`
        ${type === "sm" ? "flex gap-3 mb-3 max-w-full" : "flex flex-col mb-4 w-full"} 
        transform transition-all duration-300 ease-out
        hover:translate-y-[-4px]
        opacity-0 animate-fadeIn
      `}
      style={{ 
        animationDelay: getAnimationDelay(),
        animationFillMode: 'forwards'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowOptions(false);
      }}
    >
      {/* Thumbnail Section */}
      <Link 
        to={`/video/${video?._id}`} 
        className={`
          ${type === "sm" ? "w-40 h-24 md:w-48 md:h-28" : "w-full aspect-video"} 
          block overflow-hidden rounded-xl relative group
        `}
      >
        <div className={`w-full h-full bg-gray-200 ${!imageLoaded ? 'animate-pulse' : ''}`}>
          <img 
            src={video?.thumbnail || video?.imgUrl} 
            alt={video?.title || "Video thumbnail"}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/480x270?text=Video";
            }}
            className={`
              w-full h-full object-cover transition-all duration-300
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}
            loading="lazy"
          />
        </div>
        
        {/* Video Duration Badge - Removed as it's not in the API data */}
        
        {/* Hover Options - Shows when hovering over thumbnail */}
        {isHovered && type !== "sm" && (
          <div className="right-1 bottom-8 absolute flex flex-col gap-1">
            <button className="bg-gray-800 bg-opacity-70 hover:bg-opacity-90 p-1 rounded-full text-white transition-all duration-200">
              <WatchLaterOutlinedIcon fontSize="small" />
            </button>
            <button className="bg-gray-800 bg-opacity-70 hover:bg-opacity-90 p-1 rounded-full text-white transition-all duration-200">
              <PlaylistAddOutlinedIcon fontSize="small" />
            </button>
          </div>
        )}
      </Link>

      {/* Info Section */}
      <div className={`${type === "sm" ? "flex-1" : "flex mt-3"} relative`}>
        {/* Channel Avatar (only for default type) */}
        {type !== "sm" && (
          <Link 
            to={`/channel/${channel?._id || (video?.owner?._id || '')}`} 
            className="flex-shrink-0 mt-1 mr-3"
          >
            <div className="rounded-full w-9 h-9 overflow-hidden">
              <img 
                src={channel?.avatar || "https://www.w3schools.com/howto/img_avatar.png"} 
                alt={channel?.name || "Channel"} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://www.w3schools.com/howto/img_avatar.png";
                }}
              />
            </div>
          </Link>
        )}

        <div className="flex-1 min-w-0">
          {/* Video Title */}
          <Link to={`/video/${video?._id}`} className="group block">
            <h3 className={`font-medium ${
              type === "sm" ? "text-sm line-clamp-2" : "text-base line-clamp-2"
            } group-hover:text-blue-500 transition-colors duration-200`}>
              {video?.title || "Untitled Video"}
            </h3>
          </Link>

          {/* Channel Name & Verification */}
          <Link to={`/channel/${channel?._id || (video?.owner?._id || '')}`} className="group flex items-center mt-1">
            <p className="text-gray-500 dark:group-hover:text-gray-300 dark:text-gray-400 group-hover:text-gray-700 text-sm transition-colors duration-200">
              {channel?.name || video?.owner?.name || "Unknown Channel"}
            </p>
            {channel?.verified && (
              <VerifiedIcon sx={{ fontSize: 14, marginLeft: 0.5 }} className="text-gray-500" />
            )}
          </Link>

          {/* Video Stats */}
          <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400 text-xs">
            <span>{formatViewCount(video?.views)}</span>
            <span className="mx-1">•</span>
            <span>{video?.createdAt ? format(video.createdAt) : "Unknown time"}</span>
          </div>

          {/* Tags Display - Added based on API data */}
          {video?.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {video.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 text-xs">
                  #{tag}
                </span>
              ))}
              {video.tags.length > 3 && (
                <span className="text-gray-500 text-xs">+{video.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Options Button (3 dots) */}
        {isHovered && (
          <button 
            className="top-0 right-0 absolute hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-full transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              setShowOptions(!showOptions);
            }}
          >
            <MoreVertIcon fontSize="small" />
          </button>
        )}

        {/* Options Dropdown Menu */}
        {showOptions && (
          <div className="top-6 right-0 z-10 absolute bg-white dark:bg-gray-800 shadow-lg py-1 rounded-md w-48">
            <button className="hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 w-full text-sm text-left transition-colors duration-150">
              Not interested
            </button>
            <button className="hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 w-full text-sm text-left transition-colors duration-150">
              Don't recommend channel
            </button>
            <button className="hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 w-full text-sm text-left transition-colors duration-150">
              Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;