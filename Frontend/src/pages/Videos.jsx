import React from "react";
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
import { Box, ButtonBase, IconButton } from "@mui/material";
import { Card, Comments } from "../components/index.js";

const Container = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const Contain = styled.div`
  flex: 7;
  width: 70%;
`;

const VideoWrapper = styled.div`

`;
const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 400;
  margin-top: 1.25rem;
  margin-bottom: 0.65rem;
  color: ${({ theme }) => theme.text};
`;
const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Buttons = styled.span`
  display: flex;
  gap: 1.25rem;
  color: ${({ theme }) => theme.text};
  .btn {
    color: ${({ theme }) => theme.text};
  }
`;
const Button = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Hr = styled.hr`
  margin: 0.9rem 0rem;
  border: 0.03rem solid ${({ theme }) => theme.soft};
`;

const Recommendation = styled.div`
  flex: 2;
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 1.25rem;
`;

const ChannelLogo = styled.img`
  width: 3.12rem;
  height: 3.12rem;
  border-radius: 50%;
`;

const ChannelDetails = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelSubscribers = styled.span`
  margin-top: 0.31rem;
  margin-bottom: 1.25rem;
  color: ${({ theme }) => theme.textSoft};
  font-size: 0.75rem;
`;

const ChannelDescription = styled.p`
  font-size: 14px;
`;

const SubscribeBtn = styled.button`
  background-color: #cc1a00;
  font-weight: 450;
  color: white;
  border: none;
  border-radius: 0.18rem;
  height: max-content;
  padding: 0.62rem 1.25rem;
  cursor: pointer;
`;

const Videos = () => {
  

  return (
    <Container>
      <Contain>
        <VideoWrapper>
          <VideoFrame src={video} controls />
        </VideoWrapper>
        <Title>Test</Title>
        <Details>
          <Info>9,292,282 views jun 2020</Info>
          <Buttons>
            <Button>
              <IconButton>
                <ThumbUpOutlined className="btn" />
              </IconButton>
              {123}
            </Button>
            <Button>
              <IconButton>
                <ThumbDownOffAltOutlined className="btn" />
              </IconButton>
              Dislike
            </Button>
            <Button>
              <IconButton>
                <ReplyOutlined className="btn" />
              </IconButton>
              Share
            </Button>
            <Button>
              <IconButton>
                <AddTaskOutlined className="btn" />
              </IconButton>
              Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <ChannelLogo src={logo} />
            <ChannelDetails>
              <ChannelName>Channel Name</ChannelName>
              <ChannelSubscribers>200 Subscribers</ChannelSubscribers>
              <ChannelDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
                quibusdam nostrum eveniet quas fugiat ut, laborum eaque ducimus
                laudantium quaerat odio sit, sed vero asperiores? Accusamus
                quasi eos a totam. Fugiat temporibus at quaerat velit. Quis, et
                officia. Molestias est at sunt, quia, totam distinctio fuga
                magni nobis quaerat hic recusandae qui! Placeat sit itaque
                deleniti dolor dignissimos, repudiandae quia.
              </ChannelDescription>
            </ChannelDetails>
          </ChannelInfo>
          <SubscribeBtn>Subscribe</SubscribeBtn>
        </Channel>
        <Hr />
        <Comments />
      </Contain>
      <Recommendation>
        <Card type={"sm"} />
        <Card type={"sm"} />
        <Card type={"sm"} />
        <Card type={"sm"} />
        <Card type={"sm"} />
        <Card type={"sm"} />
      </Recommendation>
    </Container>
  );
};

export default Videos;
