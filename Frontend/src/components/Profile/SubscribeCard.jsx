import { Avatar } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.bgLighter};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  gap: 1rem;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
  align-items: center;
`;

const Subscribers = styled.p`
  color: ${({ theme }) => theme.textSoft};
`;


const ChannelName = styled.h3`
  color: ${({ theme }) => theme.text};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const SubscribeCard = ({ channelImage, channelName, subscribers }) => {
  return (
    <Card>
      <Avatar
        sx={{
          width: "7rem",
          height: "7rem",
        }}
        src={channelImage}
        alt={`${channelName} logo`}
      />
      <div>
        <ChannelName className="text-3xl">{channelName}</ChannelName>
        <Subscribers className="text-2xl font-semibold">Subscribers {subscribers}</Subscribers>
      </div>
    </Card>
  );
};

export default SubscribeCard;
