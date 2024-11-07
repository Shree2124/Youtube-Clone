import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProfileLayout from "../Layouts/ProfileLayout";
import axiosInstance from "../../api/axios";
import { Link } from "react-router-dom";
import Card from "../Card";

const VideoGrid = styled.div`
  height: 100%;
  padding: 20px;
`;

const VideoCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  display: flex;

  &:hover {
    transform: scale(1.05);
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: auto;
`;

const VideoInfo = styled.div`
  padding: 10px;

  h3 {
    font-size: 1em;
    margin: 0 0 5px;
    color: ${({ theme }) => theme.text};
  }

  p {
    font-size: 0.9em;
    color: ${({ theme }) => theme.subText};
  }
`;

const MyVideo = ({ darkMode }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users/get-my-videos");
      console.log(res.data.data);
      setVideos(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) return <div className="h-screen">Loading.....</div>;

  return (
    <ProfileLayout darkMode={darkMode}>
      <VideoGrid>
        {videos?.map((video) => (
          <Link key={video._id} to={`/video/${video._id}`}>
            <Card type={"sm"} video={video} />
          </Link>
        ))}
      </VideoGrid>
    </ProfileLayout>
  );
};

export default MyVideo;
