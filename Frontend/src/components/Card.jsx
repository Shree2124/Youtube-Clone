import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axiosInstance from "../api/axios";

const Container = styled.div`
  width: ${(props) => (props.type === "sm" ? "max-content" : "25rem")};
  margin-bottom: ${(props) => (props.type === "sm" ? "0.65rem" : "2.813rem")};
  cursor: pointer;
  display: ${(props) => (props.type === "sm" ? "flex" : "inline")};
  gap: 0.65rem;
  
  @media (max-width: 768px) {
    width: 90%;
    height: auto;
  }
`;

const Image = styled.img`
  width: ${(props) => (props.type === "sm" ? "12.7rem" : "100%")};
  height: ${(props) => (props.type === "sm" ? "7.7rem" : "12.625rem")};
  background-color: #999;
  flex: 1;
  
  @media (max-width: 768px) {
    width: 90%;
    height: 45%;
  }
`;

const Details = styled.div`
  display: ${(props) => (props.type === "sm" ? "none" : "flex")};
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 0 0 0%;
  color: ${({ theme }) => theme.text};
`;

const ChannelImg = styled.img`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
`;

const Title = styled.h1`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 1rem;
  color: ${({ theme }) => theme.textSoft};
  margin: 0.53rem 0rem;
`;

const Info = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSoft};
`;

const Texts = styled.div``;

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      if (video?.userId) {
        try {
          const res = await axiosInstance.get(`/users/find/${video.userId}`);
          setChannel(res.data.data);
        } catch (error) {
          console.error("Error fetching channel data:", error);
        }
      }
    };

    fetchChannel();
  }, [video?.userId]);

  return (
    <Container type={type}>
      <Link to={`/video/${video._id}`}>
        <Image type={type} src={video?.imgUrl} alt="Video Thumbnail" />
      </Link>
      <Details type={type}>
        <ChannelImg type={type} src={channel?.avatar} alt="Channel Avatar" />
      </Details>
      <Texts>
        <Title>{video?.title}</Title>
        <ChannelName>{channel?.name || "Unknown Channel"}</ChannelName>
        <Info>
          {video?.views} views • {format(video?.createdAt)}
        </Info>
      </Texts>
    </Container>
  );
};

export default Card;
