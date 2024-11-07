import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ImgLogo from "../../Logo/logo-color.png";
import { Avatar, Button } from "@mui/material";
import { Comment } from "../index";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Container = styled.div`
  padding: 1rem;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  background: transparent;
  padding: 5px;
  outline: none;
  color: ${({ theme }) => theme.text};
  width: 100%;

  @media (max-width: 768px) {
    padding: 3px;
  }
`;

const StyledButton = styled(Button)`
  background-color: blue !important;
  color: white !important;
  padding: 0.5rem 1rem;

  @media (max-width: 480px) {
    padding: 0.3rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const Comments = ({ videoId }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comment/get-comments/${videoId}`);
      setComments(res.data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleComment = async () => {
    if (auth) {
      try {
        await axiosInstance.post(`/comment/add-comment`, { desc: comment, videoId });
        setComment("");
        fetchComments(); 
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <NewComment>
        <Avatar
          src={ImgLogo}
          sx={{
            height: "3.12rem",
            width: "3.12rem",
          }}
        />
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add new Comment...."
        />
        <StyledButton onClick={handleComment}>Add</StyledButton>
      </NewComment>
      {comments?.length > 0 &&
        comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
    </Container>
  );
};

export default Comments;
