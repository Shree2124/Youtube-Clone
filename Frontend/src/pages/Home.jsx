import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card } from "../components";
import axios from "axios";
import { nanoid } from "@reduxjs/toolkit";

const Container = styled.div`
height: 100vh;
display: flex;
flex-wrap: wrap;
justify-content: space-around;
width: 100%;
@media (width: 540px) {
  justify-content: space-between;
}
@media (width: 1024px),(width: 1280px) {
  flex-flow: wrap;
  justify-content: space-evenly;
}
`;

const Home = ({type}) => {
  const [ video, setVideo ] =  useState([])
  useEffect(()=>{
    axios.get(`/api/v1/video/${type}`)
    .then((res)=>{
      console.log(res.data);
      setVideo(res.data["data"])
    }).catch((err)=>{
      console.log(err);
    })
  },[type])

  return (
    <Container>
      {(video.length >0) &&video.map((i)=>(
        <Card video={i} id={i._id}/>
      ))}
    </Container>
  );
};

export default Home;
