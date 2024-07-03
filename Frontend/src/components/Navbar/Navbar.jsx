import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Avatar, Box, IconButton } from "@mui/material";
import { Menu, Close } from "@mui/icons-material";
import MobileContext from "../context/MobileContext.js";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: auto;
  width: 100%;
  padding: 0.4rem;
  z-index: 10;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0rem 1rem;
  justify-content: space-around;
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
  height: 100%;
  margin-left: 1rem;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const Navbar = ({ darkMode }) => {
  const [color, setColor] = useState("white");
  const auth = useSelector((state) => state.user.auth)
  const user = useSelector((state)=>state.user?.currentUser?.data?.user)
  console.log(user);
  // const [isMobile, setIsMobile] = useState(false);

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
        <Box
          sx={{
            display: { sm: "block", md: "none" },
            position: "relative",
            zIndex: 10,
          }}
        >
          <IconButton
            sx={{
              color: { color },
            }}
            onClick={handler}
          >
            {!isMobile && <Menu />}
          </IconButton>
        </Box>
        <Search>
          <Input placeholder="Search"></Input>
          <SearchOutlinedIcon />
        </Search>
        <Link
          to={"/signin"}
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {!auth ? (
            <>
                <Link to="/signin" style={{ textDecoration: "none" }}>
                  <Button>
                    <AccountCircleOutlinedIcon />
                    SIGN IN
                  </Button>
                </Link>
            </>
          ): (
            <Avatar src={user.avatar}></Avatar>
          )}
        </Link>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
