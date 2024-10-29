import React, { useEffect, useState } from "react";
import styled from "styled-components";
import logo from "../Logo/logo-color.png";
import video from "../components/video/vid2.mp4";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlined from "@mui/icons-material/ThumbUpOutlined";
import ThumbDown from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltOutlined from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlined from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlined from "@mui/icons-material/AddTaskOutlined";
import { Avatar, Box, ButtonBase, IconButton } from "@mui/material";
import { Card, Comments, Recommendations } from "../components/index.js";
import axios from "../api/axios.js";
import { useLocation } from "react-router-dom";
import { format } from "timeago.js";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
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
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;
const Videos = () => {

  const user = useSelector(state=>state.auth?.user)

  

  // const { user } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];
  console.log(path);
  

  const [channel, setChannel] = useState({});
  const [video, setVideo] = useState({});
  const [recVideos, setRecVideos] = useState(null)


  const handleSub = ()=>{}
  const handleDislike = ()=>{}
  const handleLike = ()=>{}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/video/find/${path}`);
        setVideo(videoRes.data.data)
        console.log(video);
        
        const res = await axios.get(`/video/random`);
        setRecVideos(res.data.data)
        
        
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.data.userId}`
        );
        setChannel(channelRes.data);
        // dispatch(fetchSuccess(videoRes.data));
      } catch (err) {}
    };
    fetchData();
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
            {video.likes?.includes(user?._id) ? (
              <ThumbUpIcon />
            ) : (
              <ThumbUpOutlinedIcon />
            )}{" "}
            {video.likes?.length}
          </Button>
          <Button onClick={handleDislike}>
            {video.dislikes?.includes(user?._id) ? (
              <ThumbDownIcon />
            ) : (
              <ThumbDownOffAltOutlinedIcon />
            )}{" "}
            Dislike
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
          <Avatar  src={channel?.avatar} />
          <ChannelDetail>
            <ChannelName>{channel.name}</ChannelName>
            <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
            <Description>{video.desc}</Description>
          </ChannelDetail>
        </ChannelInfo>
        <Subscribe onClick={handleSub}>
          {user?.subscribedUsers?.includes(channel._id)
            ? "SUBSCRIBED"
            : "SUBSCRIBE"}
        </Subscribe>
      </Channel>
      <Hr />
      <Comments videoId={path} />
    </Content>
    <Recommendations tags={video.tags} />
  </Container>
  );
};

export default Videos;
