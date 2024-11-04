import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { Menu, Close, ArrowDropDown } from "@mui/icons-material";
import MobileContext from "../context/MobileContext.js";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ImgLogo from "../../Logo/logo-color.png";

const Container = styled.div`
  position: fixed;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 ${({ theme }) => theme.bgLighter};
  width: 100%;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  padding-left: 3rem;
  padding-right: 3rem;
  z-index: 20;
  color: ${({ theme }) => theme.text};
`;

const Img = styled.img`
  height: 2.5rem;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0rem 1rem;
`;

const Search = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: 1px solid #ccc;
  border-radius: 2rem;
`;

const Button = styled.button`
  padding: 0.3rem 0.9rem;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 0.18rem;
  font-weight: 500;
  margin-top: 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  padding: 0.5rem;
  margin-left: 1rem;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: bold;
`;

const Dropdown = styled(Box)`
  position: absolute;
  top: 100%;
  right: 0;
  padding: 1rem;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 110;
`;

const DropdownItem = styled(Typography)`
  cursor: pointer;
  padding: 0.6rem;
  &:hover {
    background-color: ${({ theme }) => theme.softHover};
  }
`;

const Navbar = ({ darkMode }) => {
  const [color, setColor] = useState("white");
  const { auth, user } = useSelector((state) => state?.user);
  const { isMobile, setIsMobile } = useContext(MobileContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    console.log(option);
    setDropdownOpen(false);
  };

  const handleMobileToggle = () => {
    setIsMobile((prev) => !prev);
    console.log(isMobile);
  };

  useEffect(() => {
    setColor(darkMode ? "white" : "black");
  }, [darkMode]);

  return (
    <Container>
      <Wrapper>
        <div className="flex items-center justify-between gap-8">
          <IconButton
            sx={{
              color,
              display: { xs: "block", md: "block", sm: "block", lg: "block" },
            }}
            onClick={handleMobileToggle}
          >
            {!isMobile ? <Menu /> : <Close />}
          </IconButton>
          <Box
            sx={{
              display: { xs: "none", md: "none", lg: "block" },
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
            </Logo>
          </Box>
        </div>

        <Search>
          <Input placeholder="Search" />
          <SearchOutlinedIcon />
        </Search>
        {!auth ? (
          <Link
            to={"/signin"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button>
              <AccountCircleOutlinedIcon />
              SIGN IN
            </Button>
          </Link>
        ) : (
          <Box position="relative">
            <Box display="flex" alignItems="center">
              <Avatar
                src={
                  user?.avatar ||
                  "https://www.w3schools.com/howto/img_avatar.png"
                }
              />
              <Typography sx={{ ml: 1 }}>{user?.name || "User"}</Typography>
              <IconButton onClick={handleToggleDropdown}>
                <ArrowDropDown sx={{
                  color,
                }} />
              </IconButton>
            </Box>

            {isDropdownOpen && (
              <Dropdown>
                <DropdownItem onClick={() => handleOptionClick("Profile")}>
                  <Link to={"/profile"}>
                  Profile
                  </Link>
                </DropdownItem>
                <DropdownItem onClick={() => handleOptionClick("Logout")}>
                  <span>

                  Logout
                  </span>
                </DropdownItem>
                <DropdownItem onClick={() => handleOptionClick("Upload Video")}>
                  <Link to={"/upload-video"}>
                  Upload Video
                  </Link>
                </DropdownItem>
              </Dropdown>
            )}
          </Box>
        )}
      </Wrapper>
    </Container>
  );
};

export default Navbar;
