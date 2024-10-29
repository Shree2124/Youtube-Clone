import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ImgLogo from "../../Logo/logo-color.png";
import { Avatar, Button } from "@mui/material";
import { Comment } from "../index";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Container = styled.div``;
const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;
// const Avatar = styled.img`
//   width: 3.12rem;
//   height: 3.12rem;
//   border-radius: 50%;
// `;
const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  background: transparent;
  padding: 5px;
  outline: none;
  color: ${({ theme }) => theme.text};
  width: 100%;
`;

const Comments = ({ videoId }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.auth);
  console.log(user);
  
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");

  const fetch = async () => {
    const res = await axios.get(`/comment/get-comments/${videoId}`);
    console.log(res.data);

    setComments(res.data.data);
  };

  const handleComment = async () => {
    if(user){
      try {
        const res = await axios.post(`/comment/add-comment`, { desc: comment, videoId: videoId });
        console.log(res.data.data);
        setComment("")
        fetch()
      } catch (error) {
        console.log(error);
        
      }
    }else{
      navigate("/signin")
    }
  };

  useEffect(() => {
    
    fetch();
  }, [videoId]);

  return (
    <Container className="md:absolute">
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
        <Button
          sx={{
            bgcolor: "blue",
            color: "white",
          }}
          onClick={handleComment}
        >
          Add
        </Button>
      </NewComment>
      {comments?.length > 0 &&
        comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      {/* <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment /> */}
    </Container>
  );
};

export default Comments;
