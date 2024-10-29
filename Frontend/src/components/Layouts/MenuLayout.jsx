import React, { useContext, useEffect, useState } from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import MobileContext from "../context/MobileContext.js";
import styled from "styled-components";
import ImgLogo from "../../Logo/logo-color.png";
import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  ExploreOutlined as ExploreOutlinedIcon,
  SubscriptionsOutlined as SubscriptionsOutlinedIcon,
  VideoLibraryOutlined as VideoLibraryOutlinedIcon,
  HistoryOutlined as HistoryOutlinedIcon,
  LibraryMusicOutlined as LibraryMusicOutlinedIcon,
  SportsEsportsOutlined as SportsEsportsOutlinedIcon,
  SportsBasketballOutlined as SportsBasketballOutlinedIcon,
  MovieOutlined as MovieOutlinedIcon,
  ArticleOutlined as ArticleOutlinedIcon,
  LiveTvOutlined as LiveTvOutlinedIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  FlagOutlined as FlagOutlinedIcon,
  HelpOutlineOutlined as HelpOutlineOutlinedIcon,
  SettingsBrightnessOutlined as SettingsBrightnessOutlinedIcon,
  Close,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

const Container = styled.div`
  flex: 4;
  width: fit-content;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100%;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: fixed;
  overflow: auto;
  width: "100%";
    
  z-index: 10;
`;

const Wrapper = styled.div`
  padding: 1.12rem 1.6rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: bold;
  margin-bottom: 25px;
`;

const Img = styled.img`
  height: 1.8rem;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 2px;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Login = styled.div`
  width: fit-content;
  display: "flex";
`;

const Button = styled.button`
  padding: 0.5rem 0.5rem;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
`;

const Menu = ({ darkMode, setDarkMode }) => {
  const auth = useSelector((state) => state.user.auth);
  const [color, setColor] = useState("white");
  const { isMobile, setIsMobile } = useContext(MobileContext);

  useEffect(() => {
    setColor(darkMode ? "white" : "black");
  }, [darkMode]);

  return (
    <Container>
      <Wrapper>
        {isMobile && (
          <Box
            sx={{
              display: { xs: "block", sm: "block", md: "block", lg: "block" },
              position: "relative",
              zIndex: 10,
            }}
          >
            <Logo>
              <Link
                to={"/"}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <Img src={ImgLogo} />
                <p>TuneTube</p>
              </Link>

              <IconButton sx={{ color }} onClick={() => setIsMobile(!isMobile)}>
                <Close />
              </IconButton>
            </Logo>
          </Box>
        )}
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            {" "}
            <HomeIcon /> Home{" "}
          </Item>
        </Link>
        <Link to="/trends" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            {" "}
            <ExploreOutlinedIcon /> Explore{" "}
          </Item>
        </Link>
        <Link
          to="/subscriptions"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            {" "}
            <SubscriptionsOutlinedIcon /> Subscriptions{" "}
          </Item>
        </Link>
        <Hr />
        <Item>
          {" "}
          <VideoLibraryOutlinedIcon /> Library{" "}
        </Item>
        <Item>
          {" "}
          <HistoryOutlinedIcon /> History{" "}
        </Item>
        <Hr />
        {!auth && (
          <>
            <div className="w-auto ">
              <p>Sign in to like videos, comment, and subscribe.</p>
              <Link to="/signin" style={{ textDecoration: "none" }}>
                <Button>
                  <AccountCircleOutlinedIcon />
                  SIGN IN
                </Button>
              </Link>
            </div>
            <Hr />
          </>
        )}
        <Title>BEST OF LAMATUBE</Title>
        <Item>
          {" "}
          <LibraryMusicOutlinedIcon /> Music{" "}
        </Item>
        <Item>
          {" "}
          <SportsBasketballOutlinedIcon /> Sports{" "}
        </Item>
        <Item>
          {" "}
          <SportsEsportsOutlinedIcon /> Gaming{" "}
        </Item>
        <Item>
          {" "}
          <MovieOutlinedIcon /> Movies{" "}
        </Item>
        <Item>
          {" "}
          <ArticleOutlinedIcon /> News{" "}
        </Item>
        <Item>
          {" "}
          <LiveTvOutlinedIcon /> Live{" "}
        </Item>
        <Hr />
        <Item>
          {" "}
          <SettingsOutlinedIcon /> Settings{" "}
        </Item>
        <Item>
          {" "}
          <FlagOutlinedIcon /> Report{" "}
        </Item>
        <Item>
          {" "}
          <HelpOutlineOutlinedIcon /> Help{" "}
        </Item>
        <Item onClick={() => setDarkMode(!darkMode)}>
          <SettingsBrightnessOutlinedIcon />
          {darkMode ? "Light" : "Dark"} Mode
        </Item>
      </Wrapper>
    </Container>
  );
};

const MenuLayout = ({ darkMode, setDarkMode }) => {
  const { isMobile, handleClose } = useContext(MobileContext);

  return (
    <>
    <Box sx={{
      display: {sm: "none", md:"none", xs: "none", lg:"none"},
      paddingTop: {sm:"2rem", md: "2rem", lg:"4rem", xs: "2rem"}
    }}>

      <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
    </Box>
      <Drawer open={isMobile} onClose={handleClose}>
        <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
      </Drawer>
    </>
  );
};

export default MenuLayout;
