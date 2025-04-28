import React, { useEffect, useState, useRef } from "react";
import { Card } from "../components";
import axiosInstance from "../api/axios";
import { CircularProgress } from "@mui/material";
import { Tabs, Tab } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useInView } from 'react-intersection-observer';

const Home = ({ type = "random" }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  
  // For infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
  });
  
  // Categories for tabs
  const categories = ["All", "Music", "Gaming", "News", "Live", "Sports", "Learning"];
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFadeIn(false);
    setTimeout(() => setFadeIn(true), 100);
    // In a real app, this would fetch videos by category
  };

  // Get page title based on type
  const getPageTitle = () => {
    switch(type) {
      case "trend":
        return "Trending";
      case "sub":
        return "Subscriptions";
      case "random":
      default:
        return "Recommended";
    }
  };

  useEffect(() => {
    // Reset state when video type changes
    setVideos([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setFadeIn(false);
    
    // Add small delay before fetching to allow for animation reset
    setTimeout(() => {
      fetchVideos(1);
      setTimeout(() => setFadeIn(true), 100);
    }, 300);
  }, [type]);

  useEffect(() => {
    if (inView && !loading && hasMore) {
      loadMoreVideos();
    }
  }, [inView]);

  const fetchVideos = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/video/${type}`, {
        params: { page: pageNumber, limit: 12 }
      });
      
      const newVideos = res?.data?.data || [];
      if (newVideos.length === 0 || newVideos.length < 12) {
        setHasMore(false);
      }
      
      setVideos(prev => pageNumber === 1 ? newVideos : [...prev, ...newVideos]);
      setError(null);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to load videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreVideos = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(nextPage);
  };

  return (
    <div className="pb-12 min-h-screen">
      {/* Page Header */}
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center mb-4">
        <h1 className="font-medium text-xl">{getPageTitle()}</h1>
        
        {/* Filter button - for decoration */}
        <button className="flex items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 mt-2 md:mt-0 px-3 py-1.5 rounded-full transition-colors">
          <TuneIcon fontSize="small" className="mr-1" />
          <span className="text-sm">Filter</span>
        </button>
      </div>

      {/* Category tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          sx={{ 
            '& .MuiTab-root': { 
              textTransform: 'none',
              minWidth: 'auto',
              fontSize: '14px',
              py: 0.5,
              px: 2,
              borderRadius: '20px',
              margin: '0 4px',
              minHeight: '32px',
              color: 'inherit'
            },
            '& .Mui-selected': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
              color: 'inherit',
              fontWeight: 'bold'
            },
            '& .MuiTabs-indicator': {
              display: 'none'
            }
          }}
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>
      </div>

      {/* Videos Grid */}
      {loading && page === 1 ? (
        <div className="flex justify-center items-center w-full h-64">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center w-full h-64">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
            <ErrorOutlineIcon className="mb-2 text-red-500" fontSize="large" />
            <p className="mb-4 text-gray-600 dark:text-gray-300">{error}</p>
            <button 
              onClick={() => fetchVideos(1)}
              className="flex items-center bg-blue-500 hover:bg-blue-600 mx-auto px-4 py-2 rounded-md text-white transition-colors"
            >
              <RefreshIcon fontSize="small" className="mr-1" />
              Retry
            </button>
          </div>
        </div>
      ) : videos.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          {videos.map((video, index) => (
            <Card 
              key={video._id || index} 
              video={video} 
              animDelay={index % 12} // Stagger animation for cards
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-64">
          <div className="text-center">
            <p className="mb-2 text-lg">No videos available</p>
            {type === "sub" && (
              <p className="text-gray-500 text-sm">
                Videos from your subscribed channels will appear here
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      {loading && page > 1 && (
        <div className="flex justify-center my-8">
          <CircularProgress size={30} />
        </div>
      )}

      {/* Load more trigger element */}
      {!loading && hasMore && (
        <div ref={loadMoreRef} className="h-10"></div>
      )}
    </div>
  );
};

export default Home;