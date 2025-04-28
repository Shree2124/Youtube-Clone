import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import axiosInstance from "../api/axios.js";
import { Comments, Recommendations } from "../components/index.js";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import { Avatar } from "@mui/material";

const Videos = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state?.user);
  const path = useLocation().pathname.split("/")[2];
  const [channel, setChannel] = useState({});
  const [video, setVideo] = useState({});
  const [commentsExpanded, setCommentsExpanded] = useState(false);

  const toggleComments = () => setCommentsExpanded(!commentsExpanded);

  const handleLike = async () => {
    try {
      const res = await axiosInstance.put(`/users/like/${id}`);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await axiosInstance.put(`/users/dislike/${id}`);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubscribe = async () => {
    try {
      if (!channel._id) return;
      const res = await axiosInstance.patch(`/users/sub/${channel._id}`);
      console.log(res.data);
    } catch (error) {
      console.log("Subscription error:", error);
    }
  };

  useEffect(() => {
    const handleView = async () => {
      try {
        console.log(id);
        const res = await axiosInstance.put(`/video/view/${id}`);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    
    const fetchData = async () => {
      try {
        const videoRes = await axiosInstance.get(`/video/find/${path}`);
        const videoData = videoRes.data.data;
        setVideo(videoData);

        if (videoData?.userId) {
          const channelRes = await axiosInstance.get(
            `/users/find/${videoData.userId}`
          );
          setChannel(channelRes.data.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    
    fetchData();
    handleView();
  }, [path, id]);

  return (
    <div className="flex md:flex-row flex-col gap-6 mb-20 h-full">
      {/* Main Content */}
      <div className="flex-1 md:flex-[5] bg-inherit text-inherit">
        {/* Video Player */}
        <div className="w-full">
          <video 
            className="w-full max-h-[70vh] object-cover" 
            src={video.videoUrl} 
            controls
            poster={video.imgUrl}
          />
        </div>
        
        {/* Video Title */}
        <h1 className="mt-5 mb-2 font-normal text-base md:text-lg">
          {video.title}
        </h1>
        
        {/* Video Details */}
        <div className="flex flex-wrap justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {video.views} views • {video.createdAt && format(video.createdAt)}
          </span>
          
          {/* Action Buttons */}
          <div className="flex gap-5 text-inherit">
            <button onClick={handleLike} className="flex items-center gap-1 cursor-pointer">
              <ThumbUpOutlinedIcon /> {video.likes?.length || 0}
            </button>
            <button onClick={handleDislike} className="flex items-center gap-1 cursor-pointer">
              <ThumbDownOffAltOutlinedIcon /> Dislike
            </button>
            <button className="flex items-center gap-1 cursor-pointer">
              <ReplyOutlinedIcon /> Share
            </button>
            <button className="flex items-center gap-1 cursor-pointer">
              <AddTaskOutlinedIcon /> Save
            </button>
          </div>
        </div>
        
        <hr className="my-4 border-gray-300 dark:border-gray-700" />
        
        {/* Channel Info */}
        <div className="flex md:flex-row flex-col justify-between gap-4">
          <div className="flex md:flex-row flex-col items-start gap-5">
            <Avatar src={channel?.avatar} alt={channel?.name} />
            <div className="flex flex-col text-inherit">
              <span className="font-medium">{channel.name}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {channel?.subscribedUsers?.length || 0} subscribers
              </span>
              <p className="mt-2 text-sm">{video.desc}</p>
            </div>
          </div>
          
          <button 
            onClick={handleSubscribe}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 border-none rounded font-medium text-white cursor-pointer"
          >
            Subscribe
          </button>
        </div>
        
        <hr className="my-4 border-gray-300 dark:border-gray-700" />
        
        {/* Comments Section */}
        <div className={`w-full ${commentsExpanded ? "h-full" : "max-h-32 md:max-h-full"} overflow-hidden transition-all duration-300`}>
          <Comments videoId={video._id} />
        </div>
        
        {/* Show More Button - Mobile Only */}
        <button 
          onClick={toggleComments}
          className="md:hidden block bg-red-600 hover:bg-red-700 mx-auto mt-2 px-3 py-2 border-none rounded text-white cursor-pointer"
        >
          {commentsExpanded ? "Hide Comments" : "Show More Comments"}
        </button>
      </div>
      
      {/* Recommendations */}
      <div className="flex-1 md:flex-[2]">
        <Recommendations tags={video.tags} />
      </div>
    </div>
  );
};

export default Videos;