import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ImgLogo from "../../Logo/logo-color.png";
import { Avatar } from "@mui/material";
import axios from "../../api/axios";

const Container = styled.div`
  display: flex;
  gap: 0.625rem;
  margin-top: 1.25rem;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const Name = styled.span`
  font-size: 0.81rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Date = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 0.313rem;
`;

const Text = styled.span`
font-weight: lighter;
font-size: 0.87rem;
  color: ${({ theme }) => theme.text};
`;

const Comment = ({comment}) => {
  const [channel, setChannel] = useState({})

  useEffect(()=>{
    const fetch = async ()=>{
      const res = await axios.get(`/users/find/${comment.userId}`)
      console.log(res.data);
      setChannel(res.data.data)
    }
    fetch()
  },[comment.userId])

  return (
    <Container>
      <Avatar src={channel.img} />
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
