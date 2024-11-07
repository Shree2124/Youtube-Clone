import React, { useEffect, useState } from "react";
import styled from "styled-components";
import logo from "../Logo/logo-color.png";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { LogoDev } from "@mui/icons-material";
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
  /*
  @media (min-width: 360px) {
    min-width: 18rem !important;
    min-height: 20rem;
  }
  @media (width: 412px) {
    width: 100%;
    height: 100%;
  }
  @media (width: 1024px) {
    min-width: 50% !important;
    padding: 1rem;
  }
  @media (width: 540px) {
    width: 100%;
    height: 100%;
  } */
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
  /* @media (min-width: 360px){
    min-width: 18rem;
    max-height: 15rem;
  }
  @media (width: 540px) {
    width: 100%;
    height: 100%;
  }
  @media (width: 912px) {
    width: 100% !important;
    min-width: 22.5rem !important;
    max-width: 100% !important;
  }
  @media (min-width: 768px) {
    max-width: 22.5rem;
    width: 100%;
    height: 100%;
    max-height: 20rem;
  } */
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
  const [channel, setChannel] = useState([]);

  useEffect(() => {
    console.log(video._id);
    const fetch = async () => {
      try {
        await axiosInstance.get(`/users/find/${video?.userId}`).then((res) => {
          console.log(res);
          setChannel(res.data.data);
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetch()
  }, [video]);
  return (
    <Container type={type}>
      <Link to={`/video/${video._id}`}>
        <Image type={type} src={video?.imgUrl} />
      </Link>
      <Details type={type}>
        <ChannelImg type={type} src={channel?.avatar} />
      </Details>
      <Texts>
        <Title>{video?.title}</Title>
        <ChannelName>{channel.name}</ChannelName>
        <Info>
          {video?.views} views • {format(video?.createdAt)}
        </Info>
      </Texts>
    </Container>


  );
};

export default Card;
