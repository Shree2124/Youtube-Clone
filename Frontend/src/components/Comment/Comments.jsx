import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axios";
import { Comment } from "../index";

const Comments = ({ videoId }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.user);
  
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = async () => {
    if (!videoId) return;
    
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/comment/get-comments/${videoId}`);
      setComments(res.data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    
    try {
      if (user) {
        setIsLoading(true);
        const res = await axiosInstance.post(`/comment/add-comment`, {
          desc: comment,
          videoId,
        });
        
        setComment("");
        fetchComments();
      } else {
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  if (!videoId) return null;

  return (
    <div className="p-4 max-w-full">
      <h3 className="mb-4 font-medium text-lg">
        {comments?.length || 0} Comments
      </h3>
      
      {/* New Comment Section */}
      <div className="flex items-start gap-3 mb-6">
        <Avatar
          src={user?.avatar}
          alt={user?.name || "User"}
          className="w-10 h-10"
        />
        <div className="flex flex-col flex-1 gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="bg-transparent px-2 py-2 border-gray-300 dark:border-gray-700 border-b focus:border-blue-500 outline-none w-full transition-all"
          />
          <div className="flex justify-end">
            <button 
              onClick={handleComment}
              disabled={isLoading || !comment.trim()}
              className={`bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors
                ${(isLoading || !comment.trim()) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-4">
        {isLoading && !comments ? (
          <div className="flex justify-center py-4">Loading comments...</div>
        ) : comments?.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))
        ) : (
          <div className="py-8 text-gray-500 text-center">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;