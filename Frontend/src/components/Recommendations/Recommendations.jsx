import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios.js";
import Card from "../Card";

const Recommendations = ({ tags }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!tags || tags.length === 0) return;
      
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(`/video/tag?tags=${tags}`);
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [tags]);

  if (loading) {
    return (
      <div className="flex-1 md:flex-2 p-4">
        <h3 className="mb-4 font-medium text-lg">Loading recommendations...</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded w-full h-24 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 md:flex-2 p-4">
        <div className="p-3 border border-red-300 rounded text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-2 md:p-4">
      <h3 className="mb-2 font-medium text-lg">Recommended Videos</h3>
      
      {videos && videos.length > 0 ? (
        <div className="space-y-4">
          {videos.map((video) => (
            <Card type="sm" key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="py-6 text-gray-500 dark:text-gray-400 text-center">
          No recommendations available
        </div>
      )}
    </div>
  );
};

export default Recommendations;