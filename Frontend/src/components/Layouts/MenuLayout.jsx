import React, { useContext, useEffect, useState } from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import MobileContext from "../context/MobileContext.js";
import styled from "styled-components";
import ImgLogo from "../../Logo/logo-color.png";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { useSelector } from "react-redux";
import { Close } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Container = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: sticky !important;
  top: 0 !important;
  overflow: auto !important;
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

const Login = styled.div``;
const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
`;

const Menu = ({ darkMode, setDarkMode }) => {
    const auth = useSelector((state) => state.user.auth);
    console.log(auth);
  const [color, setColor] = useState("white");
  const { isMobile, setIsMobile } = useContext(MobileContext);

  const handleMobile = () => {
    setIsMobile(!isMobile);
  };
  const handler = () => {
    // console.log("In handler");
    // console.log(isMobile);
    handleMobile();
  };

  useEffect(() => {
    if (darkMode) {
      setColor("white");
    } else {
      setColor("black");
    }
  }, [darkMode]);

  return (
    <Container>
      <Wrapper>
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
            LamaTube
          </Link>
          {isMobile && (
            <Box
              sx={{
                display: { sx: "block", md: "none" },
                position: "relative",
                zIndex: 10,
                marginLeft: "1rem",
              }}
            >
              <IconButton
                sx={{
                  color: { color },
                }}
                onClick={handler}
              >
                {isMobile && <Close />}
              </IconButton>
            </Box>
          )}
        </Logo>

        <Link
          to={"/"}
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={handler}
        >
          <Item>
            <HomeIcon />
            Home
          </Item>
        </Link>
        <Link
          to="/trends"
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={handler}
        >
          <Item>
            <ExploreOutlinedIcon />
            Explore
          </Item>
        </Link>
        <Link
          to="/subscriptions"
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={handler}
        >
          <Item>
            <SubscriptionsOutlinedIcon />
            Subscriptions
          </Item>
        </Link>
        <Hr />
        <Item>
          <VideoLibraryOutlinedIcon />
          Library
        </Item>
        <Item>
          <HistoryOutlinedIcon />
          History
        </Item>
        <Hr />
        {!auth &&
          <>
            <Login>
              Sign in to like videos, comment, and subscribe.
              <Link to="/signin" style={{ textDecoration: "none" }}>
                <Button>
                  <AccountCircleOutlinedIcon />
                  SIGN IN
                </Button>
              </Link>
            </Login>
            <Hr />
          </>
        }
        <Title>BEST OF LAMATUBE</Title>
        <Item>
          <LibraryMusicOutlinedIcon />
          Music
        </Item>
        <Item>
          <SportsBasketballOutlinedIcon />
          Sports
        </Item>
        <Item>
          <SportsEsportsOutlinedIcon />
          Gaming
        </Item>
        <Item>
          <MovieOutlinedIcon />
          Movies
        </Item>
        <Item>
          <ArticleOutlinedIcon />
          News
        </Item>
        <Item>
          <LiveTvOutlinedIcon />
          Live
        </Item>
        <Hr />
        <Item>
          <SettingsOutlinedIcon />
          Settings
        </Item>
        <Item>
          <FlagOutlinedIcon />
          Report
        </Item>
        <Item>
          <HelpOutlineOutlinedIcon />
          Help
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

  useEffect(() => {
    // console.log("inside useEffect");
    // console.log(isMobile);
    // console.log(handleClose);
  }, []);
  return (
    <>
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "100%",
        }}
      >
        <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
      </Box>
      <Drawer open={isMobile} onClose={handleClose}>
        <Menu
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isMobile={isMobile}
        />
      </Drawer>
    </>
  );
};

export default MenuLayout;
