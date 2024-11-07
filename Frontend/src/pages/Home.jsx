import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card } from "../components";
import axiosInstance from "../api/axios";
import useAuth from "../hooks/useAuth";
import { fetchUser } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  @media (width: 540px) {
    justify-content: space-between;
  }
  @media (width: 1024px), (width: 1280px) {
    flex-flow: wrap;
    justify-content: space-evenly;
  }
`;

const Home = ({ type = "random" }) => {
  // const {user, loading} = useAuth()
  const [video, setVideo] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const dispatch = useDispatch();

  // const auth = useSelector((state) => state?.auth?.auth);
  // const fetchVideo = async () => {
  //   try {
  //     setLoading(true);
  //     await axios
  //       .get(`/api/v1/video/${type}`)
  //       .then((res) => {
  //         console.log(res);
  //         setLoading(false);
  //         setVideo(res?.data?.data);
  //         console.log(video);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setLoading(false);
  //       })
  //       .finally(() => setLoading(false));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  let res;

  useEffect(() => {
    const fetchVideos = async () => {
      res = await axiosInstance.get(`/video/${type}`);
      console.log(res.data.data);

      setVideo(res?.data?.data);
      console.log(video);
      
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {loading2 ? (
        <p>Loading</p>
      ) : (
        video?.length > 0 ? (
          video.map((i) => <Card key={i?._id} video={i} />)
        ) : (
          <p>Video not available</p>
        )
      )}
      {/* <Card/>
      <Card/>
      <Card/>
      <Card/>
      <Card/>
      <Card/> */}
    </Container>
  );
};

export default Home;
