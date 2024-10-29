import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Profile = ({ darkMode }) => {
  const { user } = useSelector((state) => state.user);
  const [color, setColor] = useState("white");

  useEffect(() => {
    setColor(darkMode ? "white" : "black");
  }, [darkMode]);

  return (
    <div>
      <Box
        sx={{
          padding: "0px",
          backgroundColor: "#2de3e3",
          height: "30vh",
        }}
        className="rounded-3xl"
      ></Box>
      <Box
        sx={{
          marginTop: "1rem",
          display: "flex",
          color: { color },
          gap: "3rem",
        }}
      >
        <div className="p-3">
          <Avatar
            sx={{
              height: "10rem",
              width: "10rem",
            }}
            src={
              user?.avatar || "https://www.w3schools.com/howto/img_avatar.png"
            }
          />
        </div>
        <Box>
          <Typography sx={{}} variant="h3" color={color}>
            {user?.username || "Channel"}
          </Typography>
          <span className="block">@SageArtLive • {user.subscribers} subscribers • 149 videos</span>
          <Button sx={{
            backgroundColor: "#dc2626",
            marginTop: "1rem",
            color: "white"
          }} className="block bg-red-600 text-white">
            Subscribe
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
