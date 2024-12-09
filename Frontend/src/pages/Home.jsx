import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card } from "../components";
import axiosInstance from "../api/axios";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  @media (width: 540px) {
    justify-content: space-between;
  }
  @media (width: 1024px), (width: 1280px) {
    flex-flow: wrap;
    justify-content: space-evenly;
  }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh; 
`;

const Home = ({ type = "random" }) => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/video/${type}`);
        setVideo(res?.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {loading ? (
        <LoaderWrapper>
          <CircularProgress />
        </LoaderWrapper>
      ) : video?.length > 0 ? (
        video.map((i) => <Card key={i?._id} video={i} />)
      ) : (
        <p>Video not available</p>
      )}
    </Container>
  );
};

export default Home;
