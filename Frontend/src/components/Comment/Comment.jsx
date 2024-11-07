import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import axiosInstance from "../../api/axios";
import useAuth from "../../hooks/useAuth.js";

const Container = styled.div`
  display: flex;
  gap: 0.625rem;
  margin-top: 1.25rem;
  padding: 1rem;
  height: 100%;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 100%;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const Name = styled.span`
  font-size: 0.81rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const Date = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 0.313rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin-left: 0;
  }
`;

const Text = styled.span`
  font-weight: lighter;
  font-size: 0.87rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Comment = ({ comment }) => {
  const [channel, setChannel] = useState({});
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const res = await axiosInstance.get(`/users/find/${comment.userId}`);
        setChannel(res.data.data);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    };

    fetchChannelData();
  }, [auth, comment.userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Avatar src={channel?.img} sx={{ width: 48, height: 48 }} />
      <Details>
        <Name>
          {channel.name} <Date>1 day ago</Date>
        </Name>
        <Text>{comment.desc}</Text>
      </Details>
    </Container>
  );
};

export default Comment;
