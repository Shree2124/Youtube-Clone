import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import { Avatar } from "@mui/material";
import axiosInstance from "../api/axios.js";
import { useLocation } from "react-router-dom";
import { format } from "timeago.js";
import { useSelector } from "react-redux";
import { Comments, Recommendations } from "../components/index.js";

const Container = styled.div`
  display: flex;
  gap: 24px;
  height: 100%;
  margin-bottom: 5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Content = styled.div`
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  flex: 5;
`;

const VideoWrapper = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 1rem;
  font-weight: 400;
  margin: 20px 0 10px;
  color: ${({ theme }) => theme.text};

  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
  font-size: 0.9rem;
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const SubscribeButton = styled.button`
  background-color: #cc1a00;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
`;

const ShowMoreButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin: 10px auto;
    background-color: #cc1a00;
    color: white;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 5px;
  }
`;

const CommentSection = styled.div`
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  transition: max-height 0.3s ease;
  width: 100%;
  height: fit-content;
  max-height: ${(props) => (props.expanded ? "100%" : "120px")};
  overflow: hidden;

  @media (min-width: 768px) {
    max-height: none;
  }
`;

const VideoFrame = styled.video`
  width: 100%;
  max-height: 70vh;
  object-fit: cover;
`;

const Videos = () => {
  const { user } = useSelector((state) => state?.user);
  const path = useLocation().pathname.split("/")[2];
  const [channel, setChannel] = useState({});
  const [video, setVideo] = useState({});
  const [commentsExpanded, setCommentsExpanded] = useState(false);

  const toggleComments = () => setCommentsExpanded(!commentsExpanded);

  const handleLike = async () => {
    try {
      const res = await axiosInstance.put(`/users/like/${video._id}`);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await axiosInstance.put(`/users/dislike/${video._id}`);
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
        const res = await axiosInstance.put(`/video/view/${video?._id}`);
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
          const channelRes = await axiosInstance.get(`/users/find/${videoData.userId}`);
          setChannel(channelRes.data.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
    handleView();
  }, [path]);

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={video.videoUrl} controls />
        </VideoWrapper>
        <Title>{video.title}</Title>
        <Details>
          <Info>
            {video.views} views • {format(video.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              <ThumbUpOutlinedIcon /> {video.likes?.length || 0}
            </Button>
            <Button>
              <ThumbDownOffAltOutlinedIcon onClick={handleDislike} /> Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Avatar src={channel?.avatar} />
            <ChannelDetail>
              <span>{channel.name}</span>
              <span>{channel?.subscribedUsers?.length || 0} subscribers</span>
              <p>{video.desc}</p>
            </ChannelDetail>
          </ChannelInfo>
          <SubscribeButton onClick={handleSubscribe}>Subscribe</SubscribeButton>
        </Channel>
        <Hr />
        <CommentSection expanded={commentsExpanded}>
          <Comments videoId={video._id} />
        </CommentSection>
        <ShowMoreButton onClick={toggleComments}>
          {commentsExpanded ? "Hide Comments" : "Show More Comments"}
        </ShowMoreButton>
      </Content>
      <Recommendations tags={video.tags} />
    </Container>
  );
};

export default Videos;
