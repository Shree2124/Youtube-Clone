import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "../index.js";
import axiosInstance from "../../api/axios.js";
import { CircularProgress } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Search = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  
  // Get search query from URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    // Reset state when search query changes
    setVideos([]);
    setLoading(true);
    setFadeIn(false);
    
    // Add small delay before fetching to allow for animation reset
    setTimeout(() => {
      fetchSearchResults();
      setTimeout(() => setFadeIn(true), 100);
    }, 300);
  }, [query]);

  const fetchSearchResults = async () => {
    if (!query.trim()) {
      setLoading(false);
      setVideos([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(`video/search/`, {
        params: { q: query }
      });
      
      const searchResults = res?.data?.data || [];
      setVideos(searchResults);
      setError(null);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Failed to load search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12 min-h-screen">
      {/* Page Header */}
      <div className="flex md:flex-row flex-col justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <SearchOutlinedIcon className="mr-2" />
          <h1 className="font-medium text-xl">Search Results for "{query}"</h1>
        </div>
        
        <div className="mt-2 md:mt-0 text-gray-500 text-sm">
          {!loading && videos.length > 0 ? `${videos.length} results found` : ''}
        </div>
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="flex justify-center items-center w-full h-64">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center w-full h-64">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
            <ErrorOutlineIcon className="mb-2 text-red-500" fontSize="large" />
            <p className="mb-4 text-gray-600 dark:text-gray-300">{error}</p>
            <button 
              onClick={fetchSearchResults}
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
            <SearchOutlinedIcon className="mb-2 text-gray-400" fontSize="large" />
            <p className="mb-2 text-lg">No videos found</p>
            <p className="text-gray-500 text-sm">
              Try different keywords or check your spelling
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;