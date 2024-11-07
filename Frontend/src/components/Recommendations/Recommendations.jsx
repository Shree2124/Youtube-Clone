import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../../api/axios.js";
import Card from "../Card";

const Container = styled.div`
  flex: 2;
  padding: 0 1rem;
  @media (max-width: 768px) {
    padding: 0.5rem;
    flex-direction: column;
    align-items: center;
  }
`;

const Recommendations = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axiosInstance.get(`/video/tag?tags=${tags}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [tags]);

  return (
    <Container>
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Recommendations;
