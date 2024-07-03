import React from "react";
import styled from "styled-components";
import ImgLogo from "../../Logo/logo-color.png";
import { Avatar } from "@mui/material";
import { Comment } from "../index";

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

const Comments = () => {
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
        <Input placeholder="Add new Comment...." />
      </NewComment>
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
    </Container>
  );
};

export default Comments;
