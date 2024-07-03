import React from "react";
import styled from "styled-components";
import ImgLogo from "../../Logo/logo-color.png";
import { Avatar } from "@mui/material";

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

const Comment = () => {
  return (
    <Container>
      <Avatar
        src={ImgLogo}
        sx={{
          height: "2.5rem",
          width: "2.5rem",
        }}
      />
      <Details>
        <Name>
          Chanel
          <Date>8 jun</Date>
        </Name>

        <Text>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro et,
          dolores dicta placeat tempore ratione in. Magnam quos saepe, inventore
          consequatur a exercitationem dolor odit in numquam at pariatur
          nostrum.
        </Text>
      </Details>
    </Container>
  );
};

export default Comment;
